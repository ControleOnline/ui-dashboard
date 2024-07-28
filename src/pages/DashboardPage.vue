<template>
  <q-page>
    <div class="q-pa-md">
      <h1>Dashboard</h1>
      <!-- Campos de data para filtragem -->
      <div class="q-gutter-md row items-center q-mb-md">
        <q-input v-model="startDate" label="Data Início" mask="####-##-##" filled type="date" class="col" />
        <q-input v-model="endDate" label="Data Fim" mask="####-##-##" filled type="date" class="col" />
        <q-btn @click="filterData" label="Filtrar" color="primary" class="col-auto" />
      </div>
      <!-- Gráficos -->
      <div class="row">
        <div class="col-12 col-md-6 q-pa-md">
          <q-card>
            <q-card-section>
              <h2>Ticket Médio</h2>
              <DxChart id="ticketChart" :data-source="ticketData" title="Ticket Médio" @pointClick="onPointClick">
                <DxCommonSeriesSettings argument-field="period" type="bar" hover-mode="allArgumentPoints"
                  selection-mode="allArgumentPoints">
                  <DxLabel :visible="true">
                    <DxFormat :precision="0" type="fixedPoint" />
                  </DxLabel>
                </DxCommonSeriesSettings>
                <DxSeries value-field="value" name="Valor" />
                <DxLegend vertical-alignment="bottom" horizontal-alignment="center" />
                <DxExport :enabled="true" />
              </DxChart>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-6 q-pa-md">
          <q-card>
            <q-card-section>
              <h2>Quantidade Média de Veículos</h2>
              <DxChart id="vehicleChart" :data-source="vehicleData" title="Quantidade Média de Veículos"
                @pointClick="onPointClick">
                <DxCommonSeriesSettings argument-field="period" type="bar" hover-mode="allArgumentPoints"
                  selection-mode="allArgumentPoints">
                  <DxLabel :visible="true">
                    <DxFormat :precision="0" type="fixedPoint" />
                  </DxLabel>
                </DxCommonSeriesSettings>
                <DxSeries value-field="value" name="Valor" />
                <DxLegend vertical-alignment="bottom" horizontal-alignment="center" />
                <DxExport :enabled="true" />
              </DxChart>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-6 q-pa-md">
          <q-card>
            <q-card-section>
              <h2>Gráfico de Atendimentos</h2>
              <DxChart id="attendanceChart" :data-source="attendanceData" title="Gráfico de Atendimentos"
                @pointClick="onPointClick">
                <DxCommonSeriesSettings argument-field="time" type="bar" hover-mode="allArgumentPoints"
                  selection-mode="allArgumentPoints">
                  <DxLabel :visible="true">
                    <DxFormat :precision="0" type="fixedPoint" />
                  </DxLabel>
                </DxCommonSeriesSettings>
                <DxSeries value-field="value" name="Atendimentos" />
                <DxLegend vertical-alignment="bottom" horizontal-alignment="center" />
                <DxExport :enabled="true" />
              </DxChart>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-6 q-pa-md">
          <q-card>
            <q-card-section>
              <h2>Por Shampoozeira</h2>
              <DxChart id="shampoozeiraChart" :data-source="shampoozeiraData" title="Por Shampoozeira"
                @pointClick="onPointClick">
                <DxCommonSeriesSettings argument-field="name" type="bar" hover-mode="allArgumentPoints"
                  selection-mode="allArgumentPoints">
                  <DxLabel :visible="true">
                    <DxFormat :precision="0" type="fixedPoint" />
                  </DxLabel>
                </DxCommonSeriesSettings>
                <DxSeries value-field="value" name="Atendimentos" />
                <DxLegend vertical-alignment="bottom" horizontal-alignment="center" />
                <DxExport :enabled="true" />
              </DxChart>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-6 q-pa-md">
          <q-card>
            <q-card-section>
              <h2>Por Horário</h2>
              <DxChart id="timeChart" :data-source="timeData" title="Por Horário" @pointClick="onPointClick">
                <DxCommonSeriesSettings argument-field="time" type="bar" hover-mode="allArgumentPoints"
                  selection-mode="allArgumentPoints">
                  <DxLabel :visible="true">
                    <DxFormat :precision="0" type="fixedPoint" />
                  </DxLabel>
                </DxCommonSeriesSettings>
                <DxSeries value-field="value" name="Atendimentos" />
                <DxLegend vertical-alignment="bottom" horizontal-alignment="center" />
                <DxExport :enabled="true" />
              </DxChart>
            </q-card-section>
          </q-card>
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
} from 'devextreme-vue/chart';
import { QInput, QBtn, QCard, QCardSection } from 'quasar';

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
  data() {
    return {
      startDate: '',
      endDate: '',
      ticketData: [
        { period: 'Dia', value: 100 },
        { period: 'Semana', value: 700 },
        { period: 'Mês', value: 3000 },
      ],
      vehicleData: [
        { period: 'Dia', value: 50 },
        { period: 'Semana', value: 350 },
        { period: 'Mês', value: 1500 },
      ],
      attendanceData: [
        { time: '08:00', value: 10 },
        { time: '09:00', value: 15 },
        { time: '10:00', value: 20 },
        { time: '11:00', value: 25 },
      ],
      shampoozeiraData: [
        { name: 'Maria', value: 30 },
        { name: 'João', value: 25 },
        { name: 'Ana', value: 20 },
        { name: 'Paulo', value: 15 },
      ],
      timeData: [
        { time: '08:00', value: 10 },
        { time: '09:00', value: 15 },
        { time: '10:00', value: 20 },
        { time: '11:00', value: 25 },
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
    }
  }
};
</script>

<style>
#chart {
  height: 440px;
}
</style>
