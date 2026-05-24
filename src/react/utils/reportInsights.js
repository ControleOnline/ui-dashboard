import Formatter from '@controleonline/ui-common/src/utils/formatter';

const DATE_KEY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})/;

const pad2 = value => String(value).padStart(2, '0');

export const normalizeText = value => String(value ?? '').trim();

export const normalizeNumber = value => {
  const numericValue = Number(value ?? 0);
  return Number.isFinite(numericValue) ? numericValue : 0;
};

export const formatInteger = value =>
  Formatter.formatInteger(normalizeNumber(value));

export const formatDecimal = value =>
  Formatter.formatDecimal(normalizeNumber(value));

export const formatPercent = value => Formatter.formatPercent(normalizeNumber(value));

export const formatSignedInteger = value => {
  const normalized = normalizeNumber(value);

  return Formatter.formatSignedInteger(normalized);
};

export const formatSignedPercent = value => {
  const normalized = normalizeNumber(value);

  return Formatter.formatSignedPercent(normalized);
};

export const normalizeEntityId = value => {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();

    if (/^\d+$/.test(trimmed)) {
      return Number(trimmed);
    }

    const iriMatch = trimmed.match(/\/(\d+)(?:\/)?$/);

    if (iriMatch?.[1]) {
      return Number(iriMatch[1]);
    }
  }

  if (typeof value === 'object') {
    if (typeof value.id === 'number' && Number.isFinite(value.id)) {
      return value.id;
    }

    if (typeof value.id === 'string') {
      return normalizeEntityId(value.id);
    }

    if (value['@id']) {
      return normalizeEntityId(value['@id']);
    }
  }

  return null;
};

export const resolveCompanyLabel = company => {
  if (!company) {
    return '';
  }

  if (typeof company === 'string' || typeof company === 'number') {
    return `#${normalizeEntityId(company) || normalizeText(company)}`;
  }

  return (
    normalizeText(company.alias) ||
    normalizeText(company.name) ||
    normalizeText(company.display) ||
    (normalizeEntityId(company) ? `#${normalizeEntityId(company)}` : '')
  );
};

export const resolveCompanyProviderIri = company => {
  if (!company) {
    return '';
  }

  if (typeof company === 'string') {
    const trimmed = company.trim();

    if (!trimmed) {
      return '';
    }

    if (trimmed.startsWith('/people/')) {
      return trimmed;
    }

    const normalizedId = normalizeEntityId(trimmed);
    return normalizedId ? `/people/${normalizedId}` : trimmed;
  }

  const normalizedId = normalizeEntityId(company);

  if (normalizedId) {
    return `/people/${normalizedId}`;
  }

  if (company?.['@id']) {
    return String(company['@id']).trim();
  }

  return '';
};

export const startOfDay = date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);

export const endOfDay = date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

export const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + Number(days || 0));
  return next;
};

export const formatApiDate = date => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return '';
  }

  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())} ${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`;
};

export const formatShortDate = date => {
  return Formatter.formatDateShort(date);
};

export const formatLongDate = date => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return '';
  }

  return Formatter.formatDateYmdTodmY(date);
};

export const parseReportDate = value => {
  if (value instanceof Date) {
    return new Date(
      value.getFullYear(),
      value.getMonth(),
      value.getDate(),
      0,
      0,
      0,
      0,
    );
  }

  const normalized = normalizeText(value);

  if (!normalized) {
    return null;
  }

  const match = normalized.match(DATE_KEY_PATTERN);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsedDate = new Date(year, month - 1, day, 0, 0, 0, 0);

  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.getFullYear() !== year ||
    parsedDate.getMonth() !== month - 1 ||
    parsedDate.getDate() !== day
  ) {
    return null;
  }

  return parsedDate;
};

export const buildDateRangeWindow = ({
  referenceDate = new Date(),
  comparisonDays = 70,
} = {}) => {
  const today = new Date(referenceDate);
  const currentAfter = startOfDay(today);
  const currentBefore = endOfDay(today);
  const comparisonAfter = startOfDay(addDays(today, -(Math.max(1, comparisonDays) - 1)));
  const comparisonBefore = endOfDay(today);

  return {
    current: {
      after: currentAfter,
      before: currentBefore,
      label: 'Hoje',
    },
    comparison: {
      after: comparisonAfter,
      before: comparisonBefore,
      label: `Últimos ${Math.max(1, comparisonDays)} dias`,
    },
  };
};

export const buildOperationalInsightsFilters = ({
  company = null,
  companyId = null,
  provider = null,
  after = null,
  before = null,
  insight = '',
  orderType = 'sale',
} = {}) => {
  const resolvedProvider =
    normalizeText(provider) || resolveCompanyProviderIri(company || companyId);

  if (!resolvedProvider) {
    return null;
  }

  const params = {
    provider: resolvedProvider,
    orderType,
  };

  if (normalizeText(insight)) {
    params.insight = normalizeText(insight);
  }

  if (after instanceof Date && !Number.isNaN(after.getTime())) {
    params['orderDate[after]'] = formatApiDate(after);
  }

  if (before instanceof Date && !Number.isNaN(before.getTime())) {
    params['orderDate[before]'] = formatApiDate(before);
  }

  return params;
};

export const extractOperationalInsightsSummary = response => {
  const summary = response?.summary;

  if (summary?.report?.operationalInsights) {
    return summary.report.operationalInsights;
  }

  if (summary?.operationalInsights) {
    return summary.operationalInsights;
  }

  if (summary?.report) {
    return summary.report;
  }

  if (summary && typeof summary === 'object') {
    return summary;
  }

  if (response?.report?.operationalInsights) {
    return response.report.operationalInsights;
  }

  if (response?.operationalInsights) {
    return response.operationalInsights;
  }

  if (response?.report) {
    return response.report;
  }

  return null;
};

export const extractOperationalInsightsDaily = response => {
  const summary = extractOperationalInsightsSummary(response);

  if (Array.isArray(summary?.daily)) {
    return summary.daily;
  }

  return [];
};

export const buildWeekdayComparison = ({
  dailyEntries = [],
  range = null,
  metricKey = 'units',
  secondaryKey = 'orders',
  limit = 10,
} = {}) => {
  const resolvedLimit = Math.max(1, Number(limit || 10));
  const startDate = range?.after instanceof Date ? startOfDay(range.after) : null;
  const endDate = range?.before instanceof Date ? startOfDay(range.before) : null;
  const dailyMap = new Map();

  for (const entry of Array.isArray(dailyEntries) ? dailyEntries : []) {
    const parsedDate = parseReportDate(entry?.date || entry?.orderDate || entry?.day);

    if (!parsedDate) {
      continue;
    }

    const key = `${parsedDate.getFullYear()}-${pad2(parsedDate.getMonth() + 1)}-${pad2(parsedDate.getDate())}`;

    dailyMap.set(key, {
      date: key,
      label: normalizeText(entry?.label) || formatShortDate(parsedDate),
      weekdayIndex: parsedDate.getDay(),
      orders: normalizeNumber(entry?.orders),
      units: normalizeNumber(entry?.units),
      dateValue: parsedDate,
    });
  }

  const series = [];

  if (startDate && endDate) {
    const cursor = new Date(startDate);
    while (cursor <= endDate) {
      const key = `${cursor.getFullYear()}-${pad2(cursor.getMonth() + 1)}-${pad2(cursor.getDate())}`;
      const existing = dailyMap.get(key) || {};

      series.push({
        date: key,
        label: existing.label || formatShortDate(cursor),
        weekdayIndex: cursor.getDay(),
        orders: normalizeNumber(existing.orders),
        units: normalizeNumber(existing.units),
        dateValue: new Date(cursor),
      });

      cursor.setDate(cursor.getDate() + 1);
    }
  } else {
    Array.from(dailyMap.values())
      .sort((left, right) => left.date.localeCompare(right.date))
      .forEach(entry => {
        series.push({
          ...entry,
          dateValue: entry.dateValue || parseReportDate(entry.date),
        });
      });
  }

  const weekdayDefinitions = [
    {index: 1, key: 'monday', label: 'Segundas', shortLabel: 'Seg'},
    {index: 2, key: 'tuesday', label: 'Terças', shortLabel: 'Ter'},
    {index: 3, key: 'wednesday', label: 'Quartas', shortLabel: 'Qua'},
    {index: 4, key: 'thursday', label: 'Quintas', shortLabel: 'Qui'},
    {index: 5, key: 'friday', label: 'Sextas', shortLabel: 'Sex'},
    {index: 6, key: 'saturday', label: 'Sábados', shortLabel: 'Sáb'},
    {index: 0, key: 'sunday', label: 'Domingos', shortLabel: 'Dom'},
  ];

  return {
    range: {
      after: startDate,
      before: endDate,
      label:
        startDate && endDate
          ? `${formatLongDate(startDate)} - ${formatLongDate(endDate)}`
          : '',
    },
    weekdays: weekdayDefinitions.map(definition => {
      const points = series
        .filter(entry => entry.weekdayIndex === definition.index)
        .slice(-resolvedLimit)
        .map((entry, index, entries) => {
          const value = normalizeNumber(entry?.[metricKey]);
          const secondaryValue =
            secondaryKey && entry?.[secondaryKey] !== undefined
              ? normalizeNumber(entry?.[secondaryKey])
              : 0;

          return {
            key: `${definition.key}-${entry.date}`,
            date: entry.date,
            label: entry.label,
            dateValue: entry.dateValue,
            value,
            secondaryValue,
            isLatest: index === entries.length - 1,
          };
        });

      const totalValue = points.reduce(
        (carry, point) => carry + normalizeNumber(point.value),
        0,
      );
      const totalSecondary = points.reduce(
        (carry, point) => carry + normalizeNumber(point.secondaryValue),
        0,
      );
      const firstPoint = points[0] || null;
      const lastPoint = points[points.length - 1] || null;
      const firstValue = normalizeNumber(firstPoint?.value);
      const lastValue = normalizeNumber(lastPoint?.value);
      const deltaValue = lastValue - firstValue;
      const growthPercent =
        firstValue > 0 ? (deltaValue / firstValue) * 100 : null;

      return {
        ...definition,
        points,
        totalValue,
        totalSecondary,
        averageValue: points.length > 0 ? totalValue / points.length : 0,
        peakValue: points.reduce(
          (highest, point) => Math.max(highest, normalizeNumber(point.value)),
          0,
        ),
        firstValue,
        lastValue,
        deltaValue,
        growthPercent,
        trend:
          deltaValue > 0 ? 'up' : deltaValue < 0 ? 'down' : 'flat',
      };
    }),
  };
};
