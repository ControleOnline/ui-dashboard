<template>
  <q-card>
    <q-card-section>
      <DxChart id="ticketChart" :data-source="ticketData" title="Ticket Médio" @pointClick="onPointClick">
        <DxCommonSeriesSettings argument-field="period" type="bar" hover-mode="allArgumentPoints"
          selection-mode="allArgumentPoints">
          <DxLabel :visible="true">
            <DxFormat :precision="0" type="fixedPoint" />
          </DxLabel>
        </DxCommonSeriesSettings>
        <DxSeries value-field="qtd" name="Qtd" />
        <DxSeries value-field="max" name="Ticket m." />
        <DxSeries value-field="value" name="Total" />

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

      ticketData: [],
      /* ticketData: [
         { period: "Dia", value: 100 },
         { period: "Semana", value: 700 },
         { period: "Mês", value: 3000 },
         { period: "Dia", qtd: 100 },
         { period: "Semana", qtd: 700 },
         { period: "Mês", qtd: 3000 },
       ], */
    };
  },
  methods: {

    ...mapActions({
      getTicketValue: 'dashboard/getTicketValue',
    }),

    getFirstAndLastDates(resultArray) {
      let sortedArray = resultArray.sort((a, b) => new Date(a.date) - new Date(b.date));
      let firstDate = new Date(sortedArray[0].date);
      let lastDate = new Date(sortedArray[sortedArray.length - 1].date);

      return { firstDate, lastDate };
    },

    generateTicketValue(resultArray) {
      let { firstDate, lastDate } = this.getFirstAndLastDates(resultArray);
      let differenceInMilliseconds = lastDate - firstDate;
      let totalDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);


      let totalSum = resultArray.reduce((accumulator, item) => {
        return accumulator + item.total;
      }, 0);

      let totalQuantity = resultArray.reduce((accumulator, item) => {
        return accumulator + item.quantity;
      }, 0);
      let weeks = 1;
      let monthly = 1;
      let dailyQuantity = Math.ceil(totalQuantity / totalDays);
      let dailyTicket = Math.ceil(totalSum / totalDays);
      let dailyMax = (dailyTicket / dailyQuantity);
      console.log('01', dailyQuantity, '02', dailyTicket, '03', dailyMax);
      if (totalDays > 7) {
        weeks = totalDays / 7;
      }
      let weeklyQuantity = Math.ceil(totalQuantity / weeks);
      let weeklyTicket = Math.ceil(totalSum / weeks);
      let weeklyMax = Math.ceil(weeklyTicket / weeklyQuantity);
      if (totalDays > 30) {
        monthly = totalDays / 30;
      }
      let monthlyQuantity = Math.ceil(totalQuantity / monthly);
      let monthlyTicket = Math.ceil(totalSum / monthly);
      let monthlyMax = Math.ceil(monthlyTicket / monthlyQuantity);
      return {
        dailyQuantity,
        dailyTicket,
        dailyMax,
        weeklyQuantity,
        weeklyTicket,
        weeklyMax,
        monthlyQuantity,
        monthlyTicket,
        monthlyMax
      };
    },
    init(){
      
    let teste = {
      date: {
        after: this.startDate,
        before: this.endDate
      }
    };

    this.getTicketValue(teste).then((data) => {

      let resultArray = data.map(item => ({
        date: item.date,
        quantity: item.quantity,
        total: item.total
      }));

    /*  let filteredArray = resultArray.filter(item => {
        let itemDate = new Date(item.date);
        return itemDate >= initialDate && itemDate <= finalDate;
      }); */

      const averages = this.generateTicketValue(resultArray);

      const {
        dailyQuantity,
        dailyTicket,
        dailyMax,
        weeklyQuantity,
        weeklyTicket,
        weeklyMax,
        monthlyQuantity,
        monthlyTicket,
        monthlyMax
      } = averages;

      this.ticketData = [
        { period: "Dia", qtd: dailyQuantity },
        { period: "Semana", qtd: weeklyQuantity },
        { period: "Mês", qtd: monthlyQuantity },
        { period: "Dia", value: dailyTicket },
        { period: "Semana", value: weeklyTicket },
        { period: "Mês", value: monthlyTicket },
        { period: "Dia", max: dailyMax },
        { period: "Semana", max: weeklyMax },
        { period: "Mês", max: monthlyMax },


      ];

    });

    /* Exemplo:
    ticketData: [
       { period: "Dia", value: 100 },
       { period: "Semana", value: 700 },
       { period: "Mês", value: 3000 },
       { period: "Dia", qtd: 100 },
       { period: "Semana", qtd: 700 },
       { period: "Mês", qtd: 3000 },
     ], */


    },

    onPointClick({ target }) {
      target.select();
    },
    filterData() {
      // Lógica para filtrar dados baseada nas datas selecionadas
      console.log(`Filtrando dados de ${this.startDate} até ${this.endDate}`);
      // Atualizar os dados dos gráficos aqui /
    },
  },

  created() {
    this.init();
  },
  
  watch: {
    startDate: {
      handler: function (current, preview) {
        this.init();     },
      deep: true,
    },
    endDate: {
      handler: function (current, preview) {
        this.init();
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
