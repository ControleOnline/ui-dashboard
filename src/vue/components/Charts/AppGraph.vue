<template>
    <q-card>
        <q-card-section>
            <DxChart id="shampoozeiraChart" :data-source="data" title="Por Shampoozeira"
                @pointClick="onPointClick">
                <DxCommonSeriesSettings argument-field="dia" type="bar" hover-mode="allArgumentPoints"
                    selection-mode="allArgumentPoints">
                    <DxLabel :visible="true">
                        <DxFormat :precision="0" type="fixedPoint" />
                    </DxLabel>
                </DxCommonSeriesSettings>
                <DxSeries value-field="cba01" name="cba01" />
                <DxSeries value-field="cba02" name="cba02" />                
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
      data: [
        { dia: "01", cba01: 18 },
        { dia: "01", cba02: 25 },
        { dia: "02", cba01: 12 },
        { dia: "02", cba02: 16 },    
        { dia: "03", cba01: 7 },
        { dia: "03", cba02: 22 },                
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
