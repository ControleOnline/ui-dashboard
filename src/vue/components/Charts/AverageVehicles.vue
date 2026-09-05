<template>
  <q-card>
    <q-card-section>
      <DxChart id="vehicleChart" :data-source="vehicleData" title="Quantidade Média de Veículos" @pointClick="onPointClick">
        <DxCommonSeriesSettings argument-field="period" type="bar" hover-mode="allArgumentPoints" selection-mode="allArgumentPoints">
          <DxLabel :visible="true"><DxFormat :precision="0" type="fixedPoint" /></DxLabel>
        </DxCommonSeriesSettings>
        <DxSeries value-field="value" name="Valor" />
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
  data() { return { vehicleData: [] }; },
  methods: {
    ...mapActions({ getVehiclesValue: "dashboard/getVehiclesValue" }),
    onPointClick({ target }) { target.select(); },
    init() {
      if (!this.startDate || !this.endDate) return;
      this.getVehiclesValue({ date: { after: this.startDate, before: this.endDate } })
        .then((data) => {
          const rows = data || [];
          const totalQty = rows.reduce((acc, item) => acc + Number(item.quantity || item.value || 0), 0);
          const days = Math.max(1, rows.length);
          const weeks = Math.max(1, days / 7);
          const months = Math.max(1, days / 30);
          this.vehicleData = [
            { period: "Dia", value: Math.ceil(totalQty / days) },
            { period: "Semana", value: Math.ceil(totalQty / weeks) },
            { period: "Mês", value: Math.ceil(totalQty / months) },
          ];
        })
        .catch(() => { this.vehicleData = []; });
    },
  },
  created() { this.init(); },
  watch: {
    startDate() { this.init(); },
    endDate() { this.init(); },
  },
};
</script>
