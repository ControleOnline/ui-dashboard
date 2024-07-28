<template>
  <q-card>
    <q-card-section>
      <h2>Ticket Médio</h2>
      <DxChart
        id="ticketChart"
        :data-source="ticketData"
        title="Ticket Médio"
        @pointClick="onPointClick"
      >
        <DxCommonSeriesSettings
          argument-field="period"
          type="bar"
          hover-mode="allArgumentPoints"
          selection-mode="allArgumentPoints"
        >
          <DxLabel :visible="true">
            <DxFormat :precision="0" type="fixedPoint" />
          </DxLabel>
        </DxCommonSeriesSettings>
        <DxSeries value-field="value" name="Valor" />
        <DxLegend vertical-alignment="bottom" horizontal-alignment="center" />
        <DxExport :enabled="true" />
      </DxChart>
    </q-card-section>
  </q-card>
</template>

<script>
import {
  DxChart,
  DxSeries,
  DxCommonSeriesSettings,
  DxLabel,
  DxFormat,
  DxLegend,
  DxExport,
} from "devextreme-vue/chart";
import { QInput, QBtn, QCard, QCardSection } from "quasar";

export default {
  components: {
    DxChart,
    DxSeries,
    DxCommonSeriesSettings,
    DxLabel,
    DxFormat,
    DxLegend,
    DxExport,
    QInput,
    QBtn,
    QCard,
    QCardSection,
  },
  data() {
    return {
      startDate: "",
      endDate: "",
      ticketData: [
        { period: "Dia", value: 100 },
        { period: "Semana", value: 700 },
        { period: "Mês", value: 3000 },
      ],
    };
  },
  methods: {
    onPointClick({ target }) {
      target.select();
    },
    filterData() {
      // Lógica para filtrar dados baseada nas datas selecionadas
      console.log(`Filtrando dados de ${this.startDate} até ${this.endDate}`);
      // Atualizar os dados dos gráficos aqui
    },
  },
};
</script>

<style>
#chart {
  height: 440px;
}
</style>
