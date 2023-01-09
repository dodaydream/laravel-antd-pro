<template>
    <apexchart
        height="100%"
        width="100%"
        :type="chart.type"
        :options="options"
        :series="chart.series"
    ></apexchart>
</template>

<script>
import {useThemeStore} from "../Store/theme";

export default {
    name: "Chart",
    props: {
        chart: {
            type: Object,
            required: true
        }
    },
    setup () {
        const { isDark } = useThemeStore()

        return {
            isDark
        }
    },
    computed: {
        options () {
            const clonedOpt = JSON.parse(JSON.stringify(this.chart.options))

            clonedOpt.chart.background = 'transparent'
            clonedOpt.chart.foreColor = this.isDark ? '#fff' : '#000'
            clonedOpt.chart.height = 350
            clonedOpt.chart.width = '100%'
            clonedOpt.theme = {}
            clonedOpt.theme.mode = this.isDark ? 'dark' : 'light'

            return clonedOpt
        }
    }
}
</script>

<style scoped>

</style>
