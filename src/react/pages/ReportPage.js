/*
 * Contract imported from AGENTS.md
 * ## Escopo
 * - `ui-report` e o modulo React de indicadores e relatorios operacionais.
 * - Esta pagina e leitura de dados e nao deve mutar o dominio.
 *
 * ## Estado
 *
 * ## Limites
 * - Nao duplicar cards ou metricas em outros modulos.
 * - Manter aqui apenas a composicao da visualizacao analitica.
 */
import React, {useCallback, useMemo} from 'react';
import {Pressable, RefreshControl, ScrollView, Text, View, useWindowDimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import Formatter from '@controleonline/ui-common/src/utils/formatter';
import {useStore} from '@store';
import {
  OperationalInsightsAbcCard,
  OperationalInsightsKpiCard,
  OperationalInsightsRankingCard,
  OperationalInsightsStatusCard,
  OperationalInsightsTrendCard,
} from '../components/operationalInsights';
import {WeekdayComparisonCard} from '../components/weeklyComparison';
import createReportPageStyles from './ReportPage.styles';

const DEFAULT_RANGE_LABEL = 'Hoje';
const DEFAULT_COMPARISON_LABEL = 'Últimos 70 dias';

const ReportPage = ({navigation: _navigation}) => {
  const {width} = useWindowDimensions();
  const peopleStore = useStore('people');
  const reportStore = useStore('report');
  const styles = useMemo(() => createReportPageStyles(width), [width]);

  const {currentCompany = {}} = peopleStore.getters;
  const reportGetters = reportStore.getters;
  const reportActions = reportStore.actions;
  const summary = reportGetters.summary || {};
  const isLoading = Boolean(reportStore.isLoading);
  const loadedAt = Number(reportStore.loadedAt || summary?.meta?.loadedAt || 0);
  const currentSummary = summary?.current || null;
  const comparison = summary?.comparison || null;
  const currentError = summary?.errors?.current || '';
  const comparisonError = summary?.errors?.comparison || '';

  const companyLabel =
    summary?.meta?.companyLabel ||
    currentCompany?.alias ||
    currentCompany?.name ||
    'Selecione uma empresa';
  const currentRangeLabel =
    summary?.meta?.currentRange?.label || DEFAULT_RANGE_LABEL;
  const comparisonRangeLabel =
    summary?.meta?.comparisonRange?.label || DEFAULT_COMPARISON_LABEL;
  const loadedAtLabel = loadedAt
    ? Formatter.formatDateYmdTodmY(new Date(loadedAt), true)
    : '';

  const loadDashboard = useCallback(
    (force = false) =>
      reportActions
        .loadDashboard({
          company: currentCompany,
          force,
        })
        .catch(() => null),
    [currentCompany, reportActions],
  );

  useFocusEffect(
    useCallback(() => {
      loadDashboard(false);
      return undefined;
    }, [loadDashboard]),
  );

  const handleRefresh = useCallback(() => {
    loadDashboard(true);
  }, [loadDashboard]);

  const operationalCards = useMemo(() => {
    if (!currentSummary) {
      return [];
    }

    return [
      {
        key: 'totals',
        component: OperationalInsightsKpiCard,
        props: {
          title: 'Resumo operacional',
          subtitle: currentRangeLabel,
          summary: currentSummary?.totals || currentSummary,
          accentColor: '#0EA5E9',
          iconName: 'chart-box-outline',
        },
      },
      {
        key: 'apps',
        component: OperationalInsightsRankingCard,
        props: {
          title: 'Vendas por app',
          subtitle: 'Pedidos e itens',
          items: currentSummary?.apps || [],
          valueKey: 'units',
          valueLabel: 'itens',
          secondaryKey: 'orders',
          secondaryLabel: 'pedidos',
          limit: 5,
          accentColor: '#0EA5E9',
          iconName: 'cellphone-link',
        },
      },
      {
        key: 'displays',
        component: OperationalInsightsRankingCard,
        props: {
          title: 'Entradas por display',
          subtitle: 'Fila e volume',
          items: currentSummary?.displays || [],
          valueKey: 'units',
          valueLabel: 'itens',
          secondaryKey: 'queueCount',
          secondaryLabel: 'entradas',
          limit: 5,
          accentColor: '#10b981',
          iconName: 'monitor-dashboard',
        },
      },
      {
        key: 'products',
        component: OperationalInsightsRankingCard,
        props: {
          title: 'Produtos mais vendidos',
          subtitle: 'Top itens do período',
          items: currentSummary?.products || [],
          valueKey: 'units',
          valueLabel: 'itens',
          secondaryKey: 'orders',
          secondaryLabel: 'pedidos',
          limit: 5,
          accentColor: '#e67e22',
          iconName: 'food',
        },
      },
      {
        key: 'daily',
        component: OperationalInsightsTrendCard,
        props: {
          title: 'Itens por dia',
          subtitle: currentRangeLabel,
          items: currentSummary?.daily || [],
          valueKey: 'units',
          limit: 10,
          accentColor: '#8B5CF6',
          iconName: 'chart-line',
        },
      },
      {
        key: 'abc',
        component: OperationalInsightsAbcCard,
        props: {
          title: 'Curva ABC',
          subtitle: 'Participação por item',
          items: currentSummary?.abc?.items || [],
          buckets: currentSummary?.abc?.buckets || [],
          totalUnits: currentSummary?.abc?.totalUnits || 0,
          limit: 5,
          accentColor: '#14B8A6',
          iconName: 'chart-areaspline',
        },
      },
    ];
  }, [currentRangeLabel, currentSummary]);

  const hasOperationalSummary = Boolean(currentSummary);
  const hasComparison = Boolean(comparison);
  const comparisonLoading = Boolean(
    isLoading && !hasComparison && !comparisonError,
  );
  const heroChips = useMemo(
    () => [
      `Empresa: ${companyLabel}`,
      `Período: ${currentRangeLabel}`,
      `Comparação: ${comparisonRangeLabel}`,
      loadedAtLabel ? `Atualizado: ${loadedAtLabel}` : 'Atualização pendente',
    ],
    [companyLabel, comparisonRangeLabel, currentRangeLabel, loadedAtLabel],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor="#0EA5E9"
            colors={['#0EA5E9']}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroOrbOne} />
          <View style={styles.heroOrbTwo} />

          <View style={styles.heroHeader}>
            <View style={styles.heroTextWrap}>
              <Text style={styles.heroEyebrow}>Relatórios</Text>
              <Text style={styles.heroTitle}>Painel operacional</Text>
              <Text style={styles.heroSubtitle}>
                Resumo do dia em cards independentes, lado a lado, com a mesma
                base usada na TV. A comparação semanal abaixo mostra as últimas
                10 ocorrências de cada dia da semana para enxergar crescimento.
              </Text>

              <View style={styles.heroMetaRow}>
                {heroChips.map(chip => (
                  <View key={chip} style={styles.heroChip}>
                    <Text style={styles.heroChipText}>{chip}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.heroActions}>
              <Pressable
                accessibilityRole="button"
                onPress={handleRefresh}
                style={styles.refreshButton}
              >
                <Text style={styles.refreshButtonText}>
                  {isLoading ? 'Carregando' : 'Atualizar'}
                </Text>
              </Pressable>
              <Text style={styles.refreshHint}>
                {isLoading ? 'Sincronizando dados do report...' : 'Puxe para atualizar quando quiser.'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderText}>
            <Text style={styles.sectionEyebrow}>Resumo do dia</Text>
            <Text style={styles.sectionTitle}>Relatórios operacionais</Text>
            <Text style={styles.sectionSubtitle}>
              Os cards abaixo são os mesmos do display TV, mas agora em uma tela
              única de análise.
            </Text>
          </View>
          <View style={styles.sectionPill}>
            <Text style={styles.sectionPillText}>{currentRangeLabel}</Text>
          </View>
        </View>

        {hasOperationalSummary ? (
          <View style={styles.grid}>
            {operationalCards.map(card => {
              const CardComponent = card.component;

              return (
                <View key={card.key} style={styles.gridCard}>
                  <CardComponent {...card.props} />
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.fullWidthCard}>
            <OperationalInsightsStatusCard
              ppcColors={{}}
              title="Resumo operacional"
              subtitle={currentRangeLabel}
              loading={isLoading && !currentError}
              message={
                currentError ||
                (currentCompany?.id
                  ? 'Carregando o resumo operacional...'
                  : 'Selecione uma empresa no filtro para carregar os relatórios.')
              }
              accentColor="#0EA5E9"
              iconName="chart-box-outline"
            />
          </View>
        )}

        <View style={styles.sectionSpacer} />

        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderText}>
            <Text style={styles.sectionEyebrow}>Análise de tendência</Text>
            <Text style={styles.sectionTitle}>Comparação por dia da semana</Text>
            <Text style={styles.sectionSubtitle}>
              Cada card mostra as últimas 10 segundas, terças, quartas e assim
              por diante para comparar crescimento semanal.
            </Text>
          </View>
          <View style={styles.sectionPill}>
            <Text style={styles.sectionPillText}>{comparisonRangeLabel}</Text>
          </View>
        </View>

        <View style={styles.comparisonCard}>
          <WeekdayComparisonCard
            ppcColors={{}}
            title="Comparativo semanal"
            subtitle="Últimas 10 semanas"
            comparison={comparison}
            loading={comparisonLoading}
            message={
              comparisonError ||
              (!comparison && !isLoading
                ? 'Sem dados para a comparação semanal.'
                : '')
            }
            accentColor="#0EA5E9"
            iconName="calendar-week"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReportPage;
