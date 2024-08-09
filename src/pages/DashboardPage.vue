<template>
  <q-page>
    <div class="q-pa-md">
      <h6>Dashboard</h6>
      <!-- Campos de data para filtragem -->
      <div class="q-gutter-md row items-center q-mb-md">
        <q-input
          v-model="startDate"
          label="Data Início"
          mask="####-##-##"
          filled
          type="date"
          class="col"
        />
        <q-input
          v-model="endDate"
          label="Data Fim"
          mask="####-##-##"
          filled
          type="date"
          class="col"
        />
        <q-btn
          @click="filterData"
          label="Filtrar"
          color="primary"
          class="col-auto"
        />
      </div>
      <!-- Gráficos -->
      <div class="row">
        <div class="col-12 col-md-6 q-pa-md">
          <AverageTicket :startDate="startDate" :endDate="endDate" />
        </div>
        <div class="col-12 col-md-6 q-pa-md">
          <AverageVehicles :startDate="startDate" :endDate="endDate" />
        </div>
        <div class="col-12 col-md-6 q-pa-md">
          <AverageService :startDate="startDate" :endDate="endDate" />
        </div>
        <div class="col-12 col-md-6 q-pa-md">
          <AppGraph :startDate="startDate" :endDate="endDate" />
        </div>
        <div class="col-12 col-md-6 q-pa-md">
         <AverageHour  :startDate="startDate" :endDate="endDate" />
        </div>
      </div>
    </div>
  </q-page>
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
import AverageTicket from "../components/Charts/AverageTicket";
import AverageHour from "../components/Charts/AverageHour";
import AppGraph from "../components/Charts/AppGraph";
import AverageVehicles from "../components/Charts/AverageVehicles";
import AverageService from "../components/Charts/AverageService";


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
    AverageTicket,
    AverageHour,
    AverageService,    
    AverageVehicles,
    AppGraph,
  },
  data() {
    return {
      startDate: "",
      endDate: "",
      vehicleData: [
        { period: "Dia", value: 50 },
        { period: "Semana", value: 350 },
        { period: "Mês", value: 1500 },
      ],
      attendanceData: [
        { time: "08:00", value: 10 },
        { time: "09:00", value: 15 },
        { time: "10:00", value: 20 },
        { time: "11:00", value: 25 },
      ],
      shampoozeiraData: [
        { name: "Maria", value: 30 },
        { name: "João", value: 25 },
        { name: "Ana", value: 20 },
        { name: "Paulo", value: 15 },
      ],
      timeData: [
        { time: "08:00", value: 10 },
        { time: "09:00", value: 15 },
        { time: "10:00", value: 20 },
        { time: "11:00", value: 25 },
      ],
    };
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
