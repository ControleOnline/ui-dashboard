<template>
  <q-page>
    <div class="q-pa-md">
      <h6>Dashboard</h6>
      <div class="q-gutter-md row items-center q-mb-md">
        <q-input v-model="startDate" label="Data Início" filled type="date" class="col" />
        <q-input v-model="endDate" label="Data Fim" filled type="date" class="col" />
        <q-btn @click="filterData" label="Filtrar" color="primary" class="col-auto" />
      </div>
      <div class="row">
        <div class="col-12 col-md-6 q-pa-md">
          <AverageTicket :startDate="appliedStart" :endDate="appliedEnd" />
        </div>
        <div class="col-12 col-md-6 q-pa-md">
          <AverageVehicles :startDate="appliedStart" :endDate="appliedEnd" />
        </div>
        <div class="col-12 col-md-6 q-pa-md">
          <AverageService :startDate="appliedStart" :endDate="appliedEnd" />
        </div>
        <div class="col-12 col-md-6 q-pa-md">
          <AppGraph :startDate="appliedStart" :endDate="appliedEnd" />
        </div>
        <div class="col-12 col-md-6 q-pa-md">
          <AverageHour :startDate="appliedStart" :endDate="appliedEnd" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import AverageTicket from "../components/Charts/AverageTicket";
import AverageHour from "../components/Charts/AverageHour";
import AppGraph from "../components/Charts/AppGraph";
import AverageVehicles from "../components/Charts/AverageVehicles";
import AverageService from "../components/Charts/AverageService";

function isoDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + day;
}

export default {
  components: {
    AverageTicket,
    AverageHour,
    AverageService,
    AverageVehicles,
    AppGraph,
  },
  data() {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    const startIso = isoDate(start);
    const endIso = isoDate(end);
    return {
      startDate: startIso,
      endDate: endIso,
      appliedStart: startIso,
      appliedEnd: endIso,
    };
  },
  methods: {
    filterData() {
      if (!this.startDate || !this.endDate) return;
      this.appliedStart = this.startDate;
      this.appliedEnd = this.endDate;
    },
  },
};
</script>
