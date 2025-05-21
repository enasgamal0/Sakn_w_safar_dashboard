<template>
    <router-link :to="SectionRoute" class="chart_card">
        <!-- START:: TITLE -->
        <h5 class="chart_title m-0">
            <slot name="chart_title"></slot>
        </h5>
        <!-- END:: TITLE -->

        <!-- START:: CHART  -->
        <apexchart
            type="area"
            height="120"
            :options="areaChartOptions"
            :series="areaChartSeries"
        ></apexchart>
        <!-- END:: CHART  -->
    </router-link>
</template>

<script>
export default {
    name: "SaknsAreaChart",

    props: [
        "SectionRoute",
        "ChartColor",
        "ChartTitle",
        "ChartName",
        "ChartLabels",
        "ChartData",
    ],

    data() {
        return {
            // START:: SAKNS AREA CHART DATA
            areaChartOptions: {
                chart: {
                    type: "area",
                    sakn_w_safarline: {
                        enabled: true,
                    },
                },
                stroke: {
                    curve: "smooth",
                },
                title: {
                    text: this.ChartTitle,
                    offsetX: 100,
                    style: {
                        fontFamily: "Cairo-Bold",
                        fontSize: "24px",
                        color: this.ChartColor,
                    },
                },
                colors: [this.ChartColor],
                labels: this.ChartLabels,
            },

            areaChartSeries: [
                {
                    name: this.ChartName,
                    data: this.ChartData,
                },
            ],
            // END:: SAKNS AREA CHART DATA
        };
    },
};
</script>
