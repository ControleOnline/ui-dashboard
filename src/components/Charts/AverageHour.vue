<template>
  <q-card>
    <q-card-section>
      <DxChart id="timeChart" :data-source="timeData" title="Por Horário" @pointClick="onPointClick">
        <DxCommonSeriesSettings argument-field="time" type="bar" hover-mode="allArgumentPoints"
          selection-mode="allArgumentPoints">
          <DxLabel :visible="true">
            <DxFormat :precision="0" type="fixedPoint" />
          </DxLabel>
        </DxCommonSeriesSettings>
        <DxSeries value-field="valueApp1" name="Box 1" />
        <DxSeries value-field="valueApp2" name="Box 2" />
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
import { mapActions, mapGetters } from 'vuex';

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
      type: String,
      required: true,
      default: '',
    },
    endDate: {
      type: String,
      required: true,
      default: '',
    },
  },

  data() {
    return {
      timeData: []
    };
  },

  computed: {

  },

  methods: {

    ...mapActions({
      getHoursTicket: 'dashboard/getHoursTicket',
    }),


    generateTimeData(resultArray) {
      const app1Data = resultArray.filter(item => item.app === '1');
      const app2Data = resultArray.filter(item => item.app === '2');

      const app1Hours = app1Data.map(item => item.hour);
      const app2Hours = app2Data.map(item => item.hour);

      // Determinando o startTime e endTime para cada app
      const startTime = Math.min(Math.min(...app1Hours), Math.min(...app2Hours));
      const endTime = Math.max(Math.max(...app1Hours), Math.max(...app2Hours));

      // Gerando timeData para cada app
      const generateDataForApp = (data) => {
        const quantityByHour = {};

        // Agregar quantidades por hora
        data.forEach(item => {
          const hour = item.hour;
          if (!quantityByHour[hour]) {
            quantityByHour[hour] = 0;
          }
          quantityByHour[hour] += item.quantity;
        });

        return quantityByHour;
      };

      const quantityByHourApp1 = generateDataForApp(app1Data);
      const quantityByHourApp2 = generateDataForApp(app2Data);

      const timeData = [];
      for (let hour = startTime; hour <= endTime; hour++) {
        let formattedHour = hour < 10 ? `0${hour}:00` : `${hour}:00`;
        timeData.push({
          time: formattedHour,
          valueApp1: quantityByHourApp1[hour] || 0,
          valueApp2: quantityByHourApp2[hour] || 0
        });
      }

      return timeData;
    },




    onPointClick({ target }) {
      target.select();
    },

    filterData() {
      // Lógica para filtrar dados baseada nas datas selecionadas
      console.log(`Filtrando dados de ${this.startDate} até ${this.endDate}`);
      // Atualizar os dados dos gráficos aqui
    },

  },



  created() {

    this.getHoursTicket().then((data) => {
      let resultArray = data.map(item => ({
        app: item.app,
        date: item.date,
        hour: item.hour,
        quantity: item.quantity
      }));

      const timeData = this.generateTimeData(resultArray);

      // Use a data estruturada retornada por generateTimeData
      this.timeData = timeData;
    });




  },

  watch: {
    startDate: {
      handler: function (current, preview) {
        console.log(this.startDate, "y");
      },
      deep: true,
    },
    endDate: {
      handler: function (current, preview) {
        console.log(this.endDate, "x");
      },
      deep: true,
    },
  },
};
</script>

<style>
#chart {
  height: 440px;
}
</style>
