<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { computed } from 'vue'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

interface Props {
  /**
   * The data to be displayed in the chart.
   */
  data: number

  /**
   * The labels to be displayed in the chart.
   */
  labels: string[]
}

const props = defineProps<Props>()

const chartData = computed(() => {
  return {
    labels: props.labels,
    datasets: [
      {
        data: [props.data, 100 - props.data],
        backgroundColor: ['#00A344', '#bce0fa'],
        label: 'Auslastung in %'
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}
</script>

<template>
  <div class="doughnut-chart-host">
    <Doughnut :options="chartOptions" :data="chartData" />
  </div>
</template>

<style scoped lang="scss">
.doughnut-chart-host {
  margin: 20px;
}
</style>
