<template>
    <q-card>
        <q-card-section>
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
            required: true,
            default: null,
        },
        endDate: {
            required: true,
            default: null,
        },
    },

    data() {
        return {
            startDate: "",
            endDate: "",
            attendanceData: [
        { time: "08:00", value: 12 },
        { time: "09:00", value: 16 },
        { time: "10:00", value: 21 },
        { time: "11:00", value: 23 },
      ],
        };
    },


    created() {
        console.log(this.startDate, "x");
        console.log(this.endDate, "y");
    },
    watch: {
        startDate: {
            handler: function (current, preview) {
                console.log(this.startDate, "x");
            },
            deep: true,
        },
        endDate: {
            handler: function (current, preview) {
                console.log(this.endDate, "y");
            },
            deep: true,
        },
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
