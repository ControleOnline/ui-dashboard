<template>
  <q-card>
    <q-card-section>
      <DxChart id="attendanceChart" :data-source="attendanceData" title="Gráfico de Atendimentos" @pointClick="onPointClick">
        <DxCommonSeriesSettings argument-field="time" type="bar" hover-mode="allArgumentPoints" selection-mode="allArgumentPoints">
          <DxLabel :visible="true"><DxFormat :precision="0" type="fixedPoint" /></DxLabel>
        </DxCommonSeriesSettings>
        <DxSeries value-field="value" name="Atendimentos" />
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
  data() { return { attendanceData: [] }; },
  methods: {
    ...mapActions({
      getHoursTicket: "dashboard/getHoursTicket",
      getTicketValue: "dashboard/getTicketValue",
    }),
    onPointClick({ target }) { target.select(); },
    init() {
      if (!this.startDate || !this.endDate) return;
      const params = { date: { after: this.startDate, before: this.endDate } };
      this.getHoursTicket(params)
        .then((data) => {
          const rows = data || [];
          if (rows.length && rows[0].hour != null) {
            const byHour = {};
            rows.forEach((item) => {
              const hour = Number(item.hour);
              const key = hour < 10 ? `0${hour}:00` : `${hour}:00`;
              byHour[key] = (byHour[key] || 0) + Number(item.quantity || item.total || 1);
            });
            this.attendanceData = Object.keys(byHour).sort().map((time) => ({ time, value: byHour[time] }));
            return;
          }
          return this.getTicketValue(params).then((vehicles) => {
            const byDate = {};
            (vehicles || []).forEach((item) => {
              const key = String(item.date || "").slice(0, 10);
              byDate[key] = (byDate[key] || 0) + Number(item.quantity || 0);
            });
            this.attendanceData = Object.keys(byDate).sort().map((time) => ({ time, value: byDate[time] }));
          });
        })
        .catch(() => { this.attendanceData = []; });
    },
  },
  created() { this.init(); },
  watch: {
    startDate() { this.init(); },
    endDate() { this.init(); },
  },
};
</script>
