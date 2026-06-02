import React, {useMemo} from 'react';
import {Text, View} from 'react-native';
import {
  createOperationalInsightsStyles,
  formatInteger,
  formatPercent,
  normalizeNumber,
  normalizeText,
  ReportCardShell,
} from './shared';

const BUCKET_COLORS = {
  A: '#16A34A',
  B: '#F59E0B',
  C: '#EF4444',
};

const OperationalInsightsAbcCard = ({
  ppcColors = {},
  title = '',
  subtitle = '',
  accentColor = '',
  items = [],
  buckets = [],
  totalUnits = 0,
  limit = 5,
  iconName = 'chart-areaspline',
  style = null,
}) => {
  const styles = useMemo(
    () => createOperationalInsightsStyles(ppcColors, accentColor),
    [accentColor, ppcColors],
  );

  const normalizedBuckets = useMemo(() => {
    const bucketMap = new Map(
      (Array.isArray(buckets) ? buckets : []).map(bucket => [
        normalizeText(bucket?.bucket || bucket?.label),
        bucket,
      ]),
    );

    return ['A', 'B', 'C'].map(bucket => {
      const bucketData = bucketMap.get(bucket) || {};

      return {
        bucket,
        label: bucket,
        items: normalizeNumber(bucketData?.items),
        units: normalizeNumber(bucketData?.units),
        share: normalizeNumber(bucketData?.share),
      };
    });
  }, [buckets]);

  const normalizedItems = useMemo(() => {
    return (Array.isArray(items) ? items : [])
      .slice(0, limit)
      .map((item, index) => {
        const bucket = normalizeText(item?.bucket || '');
        const share = normalizeNumber(item?.share);
        const cumulativeShare = normalizeNumber(item?.cumulativeShare);

        return {
          key: normalizeText(item?.key || item?.label || String(index)),
          label: normalizeText(item?.label || item?.name || item?.key || 'Item'),
          bucket: bucket || '-',
          bucketColor: BUCKET_COLORS[bucket] || accentColor,
          units: normalizeNumber(item?.units),
          share,
          cumulativeShare,
        };
      });
  }, [accentColor, items, limit]);

  const hasItems = normalizedItems.length > 0;

  return (
    <ReportCardShell
      ppcColors={ppcColors}
      accentColor={accentColor}
      title={title}
      subtitle={subtitle}
      iconName={iconName}
      style={style}
      message={hasItems ? '' : 'Sem itens para esta curva.'}
    >
      {hasItems ? (
        <View style={{gap: 10}}>
          <View style={styles.bucketGrid}>
            {normalizedBuckets.map(bucket => {
              const bucketColor = BUCKET_COLORS[bucket.bucket] || accentColor;

              return (
                <View
                  key={bucket.bucket}
                  style={[
                    styles.bucketTile,
                    {
                      borderColor: bucketColor,
                      backgroundColor: `${bucketColor}11`,
                    },
                  ]}
                >
                  <Text style={[styles.bucketLabel, {color: bucketColor}]}>
                    Bucket {bucket.label}
                  </Text>
                  <Text style={styles.bucketValue}>{formatInteger(bucket.units)}</Text>
                  <Text style={styles.bucketMeta}>
                    {formatInteger(bucket.items)} itens · {formatPercent(bucket.share)}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={styles.list}>
            {normalizedItems.map((item, index) => (
              <View key={item.key || index} style={styles.listRow}>
                <View style={styles.listHeaderRow}>
                  <View style={styles.listLabelWrap}>
                    <Text style={styles.listLabel}>{item.label}</Text>
                    <Text style={styles.listMeta}>
                      Bucket {item.bucket} · participação {formatPercent(item.share)}
                    </Text>
                  </View>
                  <Text style={[styles.listValue, {color: item.bucketColor}]}>
                    {formatInteger(item.units)}
                  </Text>
                </View>
                <View style={styles.track}>
                  <View
                    style={[
                      styles.fill,
                      {
                        width: `${Math.max(6, Math.round(item.share || 6))}%`,
                        backgroundColor: item.bucketColor,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.statHint}>
                  Cumulado {formatPercent(item.cumulativeShare)} · total {formatInteger(totalUnits)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </ReportCardShell>
  );
};

export default OperationalInsightsAbcCard;
