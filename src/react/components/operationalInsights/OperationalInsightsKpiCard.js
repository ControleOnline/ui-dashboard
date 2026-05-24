import React, {useMemo} from 'react';
import {View} from 'react-native';
import {
  MetricTile,
  ReportCardShell,
  formatDecimal,
  formatInteger,
  normalizeNumber,
} from './shared';

const OperationalInsightsKpiCard = ({
  ppcColors = {},
  title = '',
  subtitle = '',
  summary = {},
  iconName = 'chart-box-outline',
  accentColor = '',
  style = null,
}) => {
  const orders = normalizeNumber(summary?.orders);
  const units = normalizeNumber(summary?.units);
  const averageUnitsPerOrder = orders > 0 ? units / orders : 0;

  const averageHint =
    orders > 0
      ? `${formatInteger(units)} itens / ${formatInteger(orders)} pedidos`
      : 'Sem pedidos no período.';

  const stats = useMemo(
    () => [
      {
        key: 'orders',
        label: 'Pedidos',
        value: orders,
        hint: 'Total no período',
        formatValue: formatInteger,
      },
      {
        key: 'units',
        label: 'Itens',
        value: units,
        hint: 'Quantidade vendida',
        formatValue: formatInteger,
      },
      {
        key: 'average',
        label: 'Média por pedido',
        value: averageUnitsPerOrder,
        hint: averageHint,
        formatValue: formatDecimal,
      },
    ],
    [averageHint, averageUnitsPerOrder, orders, units],
  );

  return (
    <ReportCardShell
      ppcColors={ppcColors}
      accentColor={accentColor}
      title={title}
      subtitle={subtitle}
      iconName={iconName}
      style={style}
    >
      <View style={{gap: 8}}>
        <View style={{gap: 8, flexDirection: 'row', flexWrap: 'wrap'}}>
          {stats.map(stat => (
            <MetricTile
              key={stat.key}
              ppcColors={ppcColors}
              accentColor={accentColor}
              label={stat.label}
              value={stat.value}
              hint={stat.hint}
              formatValue={stat.formatValue}
            />
          ))}
        </View>
      </View>
    </ReportCardShell>
  );
};

export default OperationalInsightsKpiCard;
