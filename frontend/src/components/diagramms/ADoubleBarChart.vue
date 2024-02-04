<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import { computed } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

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
   * The x-axis label on hover for first bar chart
   */
  x_axis_bar_one_label: string

  /**
   * The x-axis label on hover for second bar chart
   */
  x_axis_bar_two_label: string

  /**
   * The y-axis label
   */
  y_axis_label: string

  /**
   * The data to display as first bar chart
   */
  barOneData: number[]

  /**
   * The data to display as second bar chart
   */
  barTwoData: number[]
}
const props = defineProps<Props>()
const chartData = computed(() => {
  return {
    labels: props.x_axis,
    datasets: [
      {
        type: 'bar' as const,
        data: props.barOneData,
        backgroundColor: '#09696d',
        label: props.x_axis_bar_one_label,
        order: 2
      },
      {
        type: 'bar' as const,
        data: props.barTwoData,
        backgroundColor: '#9900ff',
        label: props.x_axis_bar_two_label,
        order: 1
      }
    ]
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
  <div class="a-bar-chart-host">
    <section class="title">
      {{ props.title }}
    </section>
    <section class="chart">
      <Bar :options="chartOptions" :data="chartData" />
    </section>
  </div>
</template>

<style scoped lang="scss">
.a-bar-chart-host {
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
