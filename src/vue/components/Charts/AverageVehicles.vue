<template>
    <q-card>
        <q-card-section>
            <DxChart id="vehicleChart" :data-source="vehicleData" title="Quantidade Média de Veículos"
                @pointClick="onPointClick">
                <DxCommonSeriesSettings argument-field="period" type="bar" hover-mode="allArgumentPoints"
                    selection-mode="allArgumentPoints">
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

  props: {
    startDate: {
      required: true,
      default: null,
    },
    endDate: {
      required: true,
      default: null,
    },
  },
  
  data() {
    return {
      startDate: "",
      endDate: "",
      vehicleData: [
        { period: "Dia", value: 22 },
        { period: "Semana", value: 187 },
        { period: "Mês", value: 862 },
      ],
    };
  },
  
  
  created() {
    console.log(this.startDate, "x");
    console.log(this.endDate, "y");
  },
  watch: {
    startDate: {
      handler: function (current, preview) {
        console.log(this.startDate, "x");
      },
      deep: true,
    },
    endDate: {
      handler: function (current, preview) {
        console.log(this.endDate, "y");
      },
      deep: true,
    },
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
