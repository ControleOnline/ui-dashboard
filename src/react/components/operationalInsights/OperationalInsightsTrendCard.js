import React, {useMemo} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {
  createOperationalInsightsStyles,
  formatInteger,
  normalizeNumber,
  normalizeText,
  resolveProgressColor,
  ReportCardShell,
} from './shared';

const OperationalInsightsTrendCard = ({
  ppcColors = {},
  title = '',
  subtitle = '',
  accentColor = '',
  items = [],
  valueKey = 'units',
  limit = 10,
  iconName = 'chart-line',
  style = null,
}) => {
  const styles = useMemo(
    () => createOperationalInsightsStyles(ppcColors, accentColor),
    [accentColor, ppcColors],
  );

  const trendItems = useMemo(() => {
    return (Array.isArray(items) ? items : [])
      .slice(-limit)
      .map((item, index) => ({
        key: normalizeText(item?.key || item?.label || String(index)),
        label: normalizeText(item?.label || item?.date || item?.name || 'Item'),
        value: normalizeNumber(item?.[valueKey]),
      }));
  }, [items, limit, valueKey]);

  const maxValue = useMemo(
    () =>
      trendItems.reduce(
        (highest, item) => Math.max(highest, normalizeNumber(item?.value)),
        0,
    ),
    [trendItems],
  );

  const chartWidth = Math.max(320, trendItems.length * 56);
  const hasItems = trendItems.length > 0;

  return (
    <ReportCardShell
      ppcColors={ppcColors}
      accentColor={accentColor}
      title={title}
      subtitle={subtitle}
      iconName={iconName}
      style={style}
      message={hasItems ? '' : 'Sem dados para este período.'}
    >
      {hasItems ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.trendShell}
        >
          <View style={[styles.trendContent, {width: chartWidth}]}>
            {trendItems.map((item, index) => {
              const height =
                maxValue > 0
                  ? Math.max(8, Math.round((item.value / maxValue) * 118))
                  : 8;

              return (
                <View key={item.key || index} style={styles.trendColumn}>
                  <Text style={styles.trendColumnValue}>{formatInteger(item.value)}</Text>
                  <View style={styles.trendColumnTrack}>
                    <View
                      style={[
                        styles.trendColumnFill,
                        {
                          height,
                          backgroundColor: resolveProgressColor(
                            accentColor,
                            index,
                            trendItems.length,
                          ),
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.trendColumnLabel}>{item.label}</Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      ) : null}
    </ReportCardShell>
  );
};

export default OperationalInsightsTrendCard;
