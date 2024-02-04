<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { computed } from 'vue'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface Props {
  /**
   * The title of the chart
   */
  title: string

  /**
   * The x-axis labels
   */
  x_axis: string[]

  /**
   * The datasets
   */
  datasets: {
    data: number[]
    backgroundColor: string
    label: string
  }[]

  /**
   * The label of the y-axis
   */
  y_axis_label: string
}
const props = defineProps<Props>()
const chartData = computed(() => {
  return {
    labels: props.x_axis,
    datasets: props.datasets
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      title: {
        display: true,
        text: props.y_axis_label
      }
    }
  }
}
</script>

<template>
  <div class="line-chart-host">
    <section class="title">
      {{ props.title }}
    </section>
    <section class="chart">
      <Line :options="chartOptions" :data="chartData" />
    </section>
  </div>
</template>

<style scoped lang="scss">
.line-chart-host {
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
    height: 100%;
  }
}
</style>
