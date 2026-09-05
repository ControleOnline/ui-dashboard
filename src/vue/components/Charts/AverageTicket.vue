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
  DxChart, DxSeries, DxCommonSeriesSettings, DxLabel, DxFormat, DxLegend, DxExport,
} from "devextreme-vue/chart";
import { mapActions } from "vuex";

export default {
  components: { DxChart, DxSeries, DxCommonSeriesSettings, DxLabel, DxFormat, DxLegend, DxExport },
  props: {
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" },
  },
  data() {
    return { ticketData: [] };
  },
  methods: {
    ...mapActions({ getTicketValue: "dashboard/getTicketValue" }),
    onPointClick({ target }) { target.select(); },
    generateTicketValue(resultArray) {
      if (!resultArray.length) {
        return { dailyQuantity: 0, dailyTicket: 0, dailyMax: 0, weeklyQuantity: 0, weeklyTicket: 0, weeklyMax: 0, monthlyQuantity: 0, monthlyTicket: 0, monthlyMax: 0 };
      }
      const sorted = [...resultArray].sort((a, b) => new Date(a.date) - new Date(b.date));
      const firstDate = new Date(sorted[0].date);
      const lastDate = new Date(sorted[sorted.length - 1].date);
      const totalDays = Math.max(1, (lastDate - firstDate) / (1000 * 60 * 60 * 24) || 1);
      const totalSum = resultArray.reduce((acc, item) => acc + Number(item.total || 0), 0);
      const totalQuantity = resultArray.reduce((acc, item) => acc + Number(item.quantity || 0), 0);
      const weeks = totalDays > 7 ? totalDays / 7 : 1;
      const monthly = totalDays > 30 ? totalDays / 30 : 1;
      const dailyQuantity = Math.ceil(totalQuantity / totalDays);
      const dailyTicket = Math.ceil(totalSum / totalDays);
      const dailyMax = dailyQuantity ? Math.ceil(dailyTicket / dailyQuantity) : 0;
      const weeklyQuantity = Math.ceil(totalQuantity / weeks);
      const weeklyTicket = Math.ceil(totalSum / weeks);
      const weeklyMax = weeklyQuantity ? Math.ceil(weeklyTicket / weeklyQuantity) : 0;
      const monthlyQuantity = Math.ceil(totalQuantity / monthly);
      const monthlyTicket = Math.ceil(totalSum / monthly);
      const monthlyMax = monthlyQuantity ? Math.ceil(monthlyTicket / monthlyQuantity) : 0;
      return { dailyQuantity, dailyTicket, dailyMax, weeklyQuantity, weeklyTicket, weeklyMax, monthlyQuantity, monthlyTicket, monthlyMax };
    },
    init() {
      if (!this.startDate || !this.endDate) return;
      this.getTicketValue({ date: { after: this.startDate, before: this.endDate } })
        .then((data) => {
          const resultArray = (data || []).map((item) => ({
            date: item.date,
            quantity: Number(item.quantity || 0),
            total: Number(item.total || item.value || 0),
          }));
          const a = this.generateTicketValue(resultArray);
          this.ticketData = [
            { period: "Dia", qtd: a.dailyQuantity, value: a.dailyTicket, max: a.dailyMax },
            { period: "Semana", qtd: a.weeklyQuantity, value: a.weeklyTicket, max: a.weeklyMax },
            { period: "Mês", qtd: a.monthlyQuantity, value: a.monthlyTicket, max: a.monthlyMax },
          ];
        })
        .catch(() => { this.ticketData = []; });
    },
  },
  created() { this.init(); },
  watch: {
    startDate() { this.init(); },
    endDate() { this.init(); },
  },
};
</script>
