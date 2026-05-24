import React, {useMemo} from 'react';
import {Text, View} from 'react-native';
import {
  createOperationalInsightsStyles,
  formatInteger,
  normalizeNumber,
  normalizeText,
  ReportCardShell,
} from './shared';

const OperationalInsightsRankingCard = ({
  ppcColors = {},
  title = '',
  subtitle = '',
  accentColor = '',
  items = [],
  valueKey = 'units',
  valueLabel = '',
  secondaryKey = 'orders',
  secondaryLabel = '',
  limit = 5,
  iconName = 'chart-bar',
  style = null,
}) => {
  const styles = useMemo(
    () => createOperationalInsightsStyles(ppcColors, accentColor),
    [accentColor, ppcColors],
  );

  const rankingItems = useMemo(() => {
    return (Array.isArray(items) ? items : [])
      .slice(0, limit)
      .map((item, index) => {
        const value = normalizeNumber(item?.[valueKey]);
        const secondaryValue =
          secondaryKey && item?.[secondaryKey] !== undefined
            ? normalizeNumber(item?.[secondaryKey])
            : null;

        return {
          key: normalizeText(item?.key || item?.label || String(index)),
          label: normalizeText(item?.label || item?.name || item?.key || 'Item'),
          value,
          secondaryValue,
        };
      });
  }, [items, limit, secondaryKey, valueKey]);

  const maxValue = useMemo(
    () =>
      rankingItems.reduce(
        (highest, item) => Math.max(highest, normalizeNumber(item?.value)),
        0,
    ),
    [rankingItems],
  );

  const hasItems = rankingItems.length > 0;

  return (
    <ReportCardShell
      ppcColors={ppcColors}
      accentColor={accentColor}
      title={title}
      subtitle={subtitle}
      iconName={iconName}
      style={style}
      message={hasItems ? '' : 'Sem itens para este período.'}
    >
      {hasItems ? (
        <View style={styles.list}>
          {rankingItems.map((item, index) => {
            const width =
              maxValue > 0
                ? `${Math.max(6, Math.round((item.value / maxValue) * 100))}%`
                : '6%';

            return (
              <View key={item.key || index} style={styles.listRow}>
                <View style={styles.listHeaderRow}>
                  <View style={styles.listLabelWrap}>
                    <Text style={styles.listLabel}>{item.label}</Text>
                    {secondaryLabel ? (
                      <Text style={styles.listMeta}>
                        {secondaryLabel}: {formatInteger(item.secondaryValue)}
                      </Text>
                    ) : item.secondaryValue !== null ? (
                      <Text style={styles.listMeta}>
                        {formatInteger(item.secondaryValue)}
                      </Text>
                    ) : null}
                  </View>
                  <Text style={styles.listValue}>{formatInteger(item.value)}</Text>
                </View>
                <View style={styles.track}>
                  <View style={[styles.fill, {width}]} />
                </View>
              </View>
            );
          })}
        </View>
      ) : null}
    </ReportCardShell>
  );
};

export default OperationalInsightsRankingCard;
