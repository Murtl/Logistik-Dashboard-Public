import type { AKennzahlkachelData } from '@/utils/interfaces/aKennzahlkachelData'
import type { ALineChartData } from '@/utils/interfaces/aLineChartData'
import type { AKeyModel } from '@/utils/types/aKeyModel'

/**
 * @description Get the KPI data for the line chart
 * @param unit the unit
 * @param name the name
 * @param storeRefCurrent the current store ref
 * @param storeRefPrevious the previous store ref
 * @param multiplier the multiplier
 */
export const getKPIDataForKennzahlkachel = (
  unit: string,
  name: string,
  storeRefCurrent: AKeyModel[],
  storeRefPrevious: AKeyModel[],
  multiplier?: number
) => {
  const kpiData: AKennzahlkachelData = {
    value: 0,
    unit: unit,
    ps: {
      absolute: 0,
      percentage: 0
    }
  }
  storeRefCurrent.forEach((kpi) => {
    if (kpi.name === name) {
      kpi.values.forEach((value) => {
        kpiData.value = kpiData.value + value.value * (multiplier ? multiplier : 1)
      })
    }
  })
  let tempPreviousValue = 0
  storeRefPrevious.forEach((kpi) => {
    if (kpi.name === name) {
      kpi.values.forEach((value) => {
        tempPreviousValue = tempPreviousValue + value.value * (multiplier ? multiplier : 1)
      })
    }
  })
  kpiData.ps.absolute = kpiData.value - tempPreviousValue
  if (tempPreviousValue === 0 || kpiData.ps.absolute === 0) {
    kpiData.ps.percentage = 0
  } else {
    kpiData.ps.percentage = (kpiData.ps.absolute / tempPreviousValue) * 100
  }
  return kpiData
}

/**
 * @description Get the KPI data for the line chart
 * @param label the label
 * @param color the color
 * @param name the name
 * @param storeRefCurrent the current store ref
 * @param multiplier the multiplier
 */
export const getKPIDataForLineChart = (
  label: string,
  color: string,
  name: string,
  storeRefCurrent: AKeyModel[],
  multiplier?: number
) => {
  const lineChartData: ALineChartData = {
    data: {
      label: label,
      data: [],
      backgroundColor: color
    },
    labels: []
  }

  storeRefCurrent.forEach((kpi) => {
    if (kpi.name === name) {
      kpi.values.forEach((value) => {
        lineChartData.data.data.push(value.value * (multiplier ? multiplier : 1))
        lineChartData.labels.push(value.date.split('-').reverse().join('.'))
      })
    }
  })
  if (lineChartData.labels.length > 60) {
    return clusterDataInMonths(lineChartData)
  }
  return lineChartData
}

/**
 * @description Cluster the data in months
 * @param lineChartData the line chart data
 */
const clusterDataInMonths = (lineChartData: ALineChartData) => {
  const clusteredData: ALineChartData = {
    data: {
      label: lineChartData.data.label,
      data: [],
      backgroundColor: lineChartData.data.backgroundColor
    },
    labels: []
  }

  const tempData: number[] = []
  const tempLabels: string[] = []
  let tempSum = 0
  let tempCount = 0
  let tempMonth = ''
  let tempYear = ''
  lineChartData.labels.forEach((label, index) => {
    if (index !== 0 && (label.split('.')[1] !== tempMonth || label.split('.')[2] !== tempYear)) {
      tempLabels.push(tempMonth + '.' + tempYear)
      tempData.push(tempSum / tempCount)
      tempSum = 0
      tempCount = 0
    }
    tempCount++
    tempSum = tempSum + lineChartData.data.data[index]
    tempMonth = label.split('.')[1]
    tempYear = label.split('.')[2]
  })
  tempLabels.push(tempMonth + '.' + tempYear)
  tempData.push(tempSum / tempCount)
  clusteredData.data.data = tempData
  clusteredData.labels = tempLabels
  return clusteredData
}

/**
 * @description Get the KPI data for the kennzahlkachel only value
 * @param unit the unit of the KPI
 * @param name the name of the KPI
 * @param storeRefCurrent the current KPI data
 * @param multiplier the multiplier for the KPI
 */
export const getKPIDataForKennzahlkachelOnlyValue = (
  unit: string,
  name: string,
  storeRefCurrent: AKeyModel[],
  multiplier?: number
) => {
  const kpi = {
    value: 0,
    unit: unit
  }
  storeRefCurrent.forEach((kpiCurrent) => {
    if (kpiCurrent.name === name) {
      kpiCurrent.values.forEach((value) => {
        kpi.value = kpi.value + value.value * (multiplier ? multiplier : 1)
      })
    }
  })
  return kpi
}
