<template>
  <q-card>
    <q-card-section>
      <DxChart id="timeChart" :data-source="timeData" title="Por Horário" @pointClick="onPointClick">
        <DxCommonSeriesSettings argument-field="time" type="bar" hover-mode="allArgumentPoints" selection-mode="allArgumentPoints">
          <DxLabel :visible="true"><DxFormat :precision="0" type="fixedPoint" /></DxLabel>
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
import { DxChart, DxSeries, DxCommonSeriesSettings, DxLabel, DxFormat, DxLegend, DxExport } from "devextreme-vue/chart";
import { mapActions } from "vuex";

export default {
  components: { DxChart, DxSeries, DxCommonSeriesSettings, DxLabel, DxFormat, DxLegend, DxExport },
  props: {
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" },
  },
  data() { return { timeData: [] }; },
  methods: {
    ...mapActions({ getHoursTicket: "dashboard/getHoursTicket" }),
    onPointClick({ target }) { target.select(); },
    generateTimeData(resultArray) {
      if (!resultArray.length) return [];
      const app1Data = resultArray.filter((item) => String(item.app) === "1");
      const app2Data = resultArray.filter((item) => String(item.app) === "2");
      const hours = resultArray.map((item) => Number(item.hour)).filter((h) => !Number.isNaN(h));
      const startTime = Math.min(...hours);
      const endTime = Math.max(...hours);
      const byHour = (data) => {
        const quantityByHour = {};
        data.forEach((item) => {
          const hour = Number(item.hour);
          quantityByHour[hour] = (quantityByHour[hour] || 0) + Number(item.quantity || 0);
        });
        return quantityByHour;
      };
      const q1 = byHour(app1Data);
      const q2 = byHour(app2Data);
      const timeData = [];
      for (let hour = startTime; hour <= endTime; hour++) {
        timeData.push({
          time: hour < 10 ? `0${hour}:00` : `${hour}:00`,
          valueApp1: q1[hour] || 0,
          valueApp2: q2[hour] || 0,
        });
      }
      return timeData;
    },
    init() {
      if (!this.startDate || !this.endDate) return;
      this.getHoursTicket({ date: { after: this.startDate, before: this.endDate } })
        .then((data) => {
          this.timeData = this.generateTimeData((data || []).map((item) => ({
            app: item.app,
            date: item.date,
            hour: item.hour,
            quantity: item.quantity,
          })));
        })
        .catch(() => { this.timeData = []; });
    },
  },
  created() { this.init(); },
  watch: {
    startDate() { this.init(); },
    endDate() { this.init(); },
  },
};
</script>
