<script setup lang="ts">
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'
import { computed } from 'vue'

ChartJS.register(ArcElement, Tooltip, Legend)

interface Props {
  /**
   * The title of the chart.
   */
  title: string
  /**
   * The data to be displayed in the chart.
   */
  data: number[]

  /**
   * The labels to be displayed in the chart.
   */
  labels: string[]

  /**
   * The label of the item to be displayed in the chart.
   */
  itemLabel: string
}

const props = defineProps<Props>()

const chartData = computed(() => {
  return {
    labels: props.labels,
    datasets: [
      {
        data: props.data,
        backgroundColor: ['#09696d', '#c1d9da', 'blue', 'red', 'green', 'violet'],
        label: props.itemLabel
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
  <div class="pie-chart-host">
    <section class="title">
      {{ props.title }}
    </section>
    <section class="chart">
      <Pie :options="chartOptions" :data="chartData" />
    </section>
  </div>
</template>

<style scoped lang="scss">
.pie-chart-host {
  box-sizing: border-box;
  padding: 20px;
  display: flex;
  flex-direction: column;

  .title {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 10px;
  }

  .chart {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
}
</style>
