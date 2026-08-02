import {api} from '@controleonline/ui-common/src/api';
import * as types from '@controleonline/ui-default/src/store/default/mutation_types';
import {
  buildDateRangeWindow,
  buildOperationalInsightsFilters,
  buildWeekdayComparison,
  extractOperationalInsightsSummary,
  normalizeText,
  resolveCompanyLabel,
  resolveCompanyProviderIri,
} from '../../react/utils/reportInsights';

const DEFAULT_CURRENT_ERROR =
  'Nao foi possivel carregar o resumo operacional.';
const DEFAULT_COMPARISON_ERROR =
  'Nao foi possivel carregar a comparacao semanal.';
const DEFAULT_REPORT_ERROR =
  'Nao foi possivel carregar os relatórios.';

const buildEmptySummary = ({
  companyId = '',
  companyLabel = '',
  requestKey = '',
  ranges = null,
  currentFilters = null,
  comparisonFilters = null,
  now = new Date(),
} = {}) => ({
  current: null,
  comparison: null,
  errors: {},
  meta: {
    companyId,
    companyLabel,
    requestKey,
    currentRange: ranges?.current
      ? {
          after: ranges.current.after.toISOString(),
          before: ranges.current.before.toISOString(),
          label: ranges.current.label,
        }
      : null,
    comparisonRange: ranges?.comparison
      ? {
          after: ranges.comparison.after.toISOString(),
          before: ranges.comparison.before.toISOString(),
          label: ranges.comparison.label,
        }
      : null,
    filters: {
      current: currentFilters,
      comparison: comparisonFilters,
    },
    loadedAt: now.getTime(),
  },
});

const resolveErrorMessage = (error, fallback) => {
  if (typeof error === 'string') {
    return normalizeText(error) || fallback;
  }

  return (
    normalizeText(
      error?.message ||
        error?.detail ||
        error?.body?.detail ||
        error?.body?.message ||
        error?.body?.['hydra:description'] ||
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.response?.data?.['hydra:description'] ||
        '',
    ) || fallback
  );
};

export async function loadDashboard({commit, getters}, params = {}) {
  const company = params?.company || null;
  const provider =
    resolveCompanyProviderIri(params?.provider || company || params?.companyId);
  const companyId = params?.companyId || provider || '';
  const companyLabel = resolveCompanyLabel(company || companyId);
  const force = Boolean(params?.force);
  const comparisonDays = Number(params?.comparisonDays || 70);
  const referenceDate =
    params?.referenceDate instanceof Date ? params.referenceDate : new Date();
  const ranges = buildDateRangeWindow({referenceDate, comparisonDays});
  const currentFilters = buildOperationalInsightsFilters({
    provider,
    after: ranges.current.after,
    before: ranges.current.before,
    orderType: 'sale',
  });
  const comparisonFilters = buildOperationalInsightsFilters({
    provider,
    after: ranges.comparison.after,
    before: ranges.comparison.before,
    orderType: 'sale',
    insight: 'daily',
  });
  const requestKey = [
    provider || 'no-company',
    ranges.current.after.toISOString(),
    ranges.current.before.toISOString(),
    ranges.comparison.after.toISOString(),
    ranges.comparison.before.toISOString(),
  ].join('::');

  if (!force && getters.loadedKey === requestKey && getters.summary?.current) {
    return getters.summary;
  }

  commit(types.SET_ACTIVE_REQUEST_KEY, requestKey);
  commit(types.SET_ISLOADING, true);
  commit(types.SET_ERROR, null);
  commit(
    types.SET_SUMMARY,
    buildEmptySummary({
      companyId,
      companyLabel,
      requestKey,
      ranges,
      currentFilters,
      comparisonFilters,
      now: referenceDate,
    }),
  );

  if (!provider) {
    const nextSummary = {
      current: null,
      comparison: null,
      errors: {
        current: 'Selecione uma empresa para carregar os relatórios.',
      },
      meta: buildEmptySummary({
        companyId: '',
        companyLabel,
        requestKey,
        ranges,
        currentFilters: null,
        comparisonFilters: null,
        now: referenceDate,
      }).meta,
    };

    commit(types.SET_SUMMARY, nextSummary);
    commit(types.SET_LOADED_KEY, requestKey);
    commit(types.SET_LOADED_AT, referenceDate.getTime());
    commit(types.SET_ISLOADING, false);
    return nextSummary;
  }

  try {
    const [currentResult, comparisonResult] = await Promise.allSettled([
      api.fetch('/report/orders/operational-insights', {
        params: currentFilters,
      }),
      api.fetch('/report/orders/operational-insights', {
        params: comparisonFilters,
      }),
    ]);

    if (getters.activeRequestKey !== requestKey) {
      return getters.summary;
    }

    const currentSummary =
      currentResult.status === 'fulfilled'
        ? extractOperationalInsightsSummary(currentResult.value)
        : null;
    const comparisonSummary =
      comparisonResult.status === 'fulfilled'
        ? extractOperationalInsightsSummary(comparisonResult.value)
        : null;
    const comparison =
      comparisonResult.status === 'fulfilled'
        ? buildWeekdayComparison({
            dailyEntries: comparisonSummary?.daily || [],
            range: ranges.comparison,
            metricKey: 'units',
            secondaryKey: 'orders',
            limit: 10,
          })
        : null;
    const errors = {};

    if (currentResult.status === 'rejected') {
      errors.current = resolveErrorMessage(
        currentResult.reason,
        DEFAULT_CURRENT_ERROR,
      );
    }

    if (comparisonResult.status === 'rejected') {
      errors.comparison = resolveErrorMessage(
        comparisonResult.reason,
        DEFAULT_COMPARISON_ERROR,
      );
    }

    const nextSummary = {
      current: currentSummary,
      comparison,
      errors,
      meta: {
        companyId,
        companyLabel,
        requestKey,
        currentRange: {
          after: ranges.current.after.toISOString(),
          before: ranges.current.before.toISOString(),
          label: ranges.current.label,
        },
        comparisonRange: {
          after: ranges.comparison.after.toISOString(),
          before: ranges.comparison.before.toISOString(),
          label: ranges.comparison.label,
        },
        filters: {
          current: currentFilters,
          comparison: comparisonFilters,
        },
        loadedAt: referenceDate.getTime(),
      },
    };

    commit(types.SET_SUMMARY, nextSummary);
    commit(types.SET_LOADED_KEY, requestKey);
    commit(types.SET_LOADED_AT, referenceDate.getTime());
    commit(types.SET_LAST_COMPLETED_REQUEST, requestKey);
    commit(
      types.SET_ERROR,
      Object.keys(errors).length === 2 ? DEFAULT_REPORT_ERROR : null,
    );

    return nextSummary;
  } catch (error) {
    const message = resolveErrorMessage(error, DEFAULT_REPORT_ERROR);
    commit(types.SET_ERROR, message);
    throw error;
  } finally {
    if (getters.activeRequestKey === requestKey) {
      commit(types.SET_ISLOADING, false);
    }
  }
}
