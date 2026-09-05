<template>
  <q-card>
    <q-card-section>
      <DxChart id="shampoozeiraChart" :data-source="data" title="Por Shampoozeira" @pointClick="onPointClick">
        <DxCommonSeriesSettings argument-field="dia" type="bar" hover-mode="allArgumentPoints" selection-mode="allArgumentPoints">
          <DxLabel :visible="true"><DxFormat :precision="0" type="fixedPoint" /></DxLabel>
        </DxCommonSeriesSettings>
        <DxSeries v-for="name in seriesNames" :key="name" :value-field="name" :name="name" />
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
  data() { return { data: [], seriesNames: [] }; },
  methods: {
    ...mapActions({ getAttendance: "dashboard/getAttendance", getTicketValue: "dashboard/getTicketValue" }),
    onPointClick({ target }) { target.select(); },
    init() {
      if (!this.startDate || !this.endDate) return;
      const params = { date: { after: this.startDate, before: this.endDate } };
      this.getAttendance(params)
        .then((rows) => {
          const list = rows || [];
          if (list.length && (list[0].people || list[0].employee || list[0].name)) {
            this.buildPeopleSeries(list);
            return;
          }
          return this.getTicketValue(params).then((vehicles) => this.buildPeopleSeries(vehicles || []));
        })
        .catch(() => { this.data = []; this.seriesNames = []; });
    },
    buildPeopleSeries(list) {
      const names = new Set();
      const byDay = {};
      list.forEach((item) => {
        const person = item.people?.alias || item.people?.name || item.employee || item.name || item.app || "total";
        names.add(String(person));
        const day = String(item.date || item.day || item.dia || "").slice(8, 10) || String(item.date || "").slice(0, 10);
        if (!byDay[day]) byDay[day] = { dia: day };
        byDay[day][String(person)] = (byDay[day][String(person)] || 0) + Number(item.quantity || item.total || item.value || 1);
      });
      this.seriesNames = Array.from(names);
      this.data = Object.keys(byDay).sort().map((k) => byDay[k]);
    },
  },
  created() { this.init(); },
  watch: {
    startDate() { this.init(); },
    endDate() { this.init(); },
  },
};
</script>
