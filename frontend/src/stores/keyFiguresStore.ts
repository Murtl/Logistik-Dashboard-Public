import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Ref } from 'vue'
import { AKPIService } from '@/services/AKPIService'
import type { AKeyModel } from '@/utils/types/aKeyModel'
import type { AxiosError } from 'axios'

/**
 * @description Store for the key figures
 */
export const useKeyFiguresStore = defineStore('keyFiguresStore', () => {
  const allKpisCurrentPeriod: Ref<AKeyModel[]> = ref([])
  const allKpisPreviousPeriod: Ref<AKeyModel[]> = ref([])

  const fetchKeyFiguresCurrentPeriod = async (
    shippingCompanyID: string,
    from: string,
    to: string
  ) => {
    await fetchKeyFigures(shippingCompanyID, from, to, allKpisCurrentPeriod)
  }

  const fetchKeyFiguresPreviousPeriod = async (
    shippingCompanyID: string,
    from: string,
    to: string
  ) => {
    await fetchKeyFigures(shippingCompanyID, from, to, allKpisPreviousPeriod)
  }

  const fetchKeyFigures = async (
    shippingCompanyID: string,
    from: string,
    to: string,
    saveTo: Ref<AKeyModel[]>
  ) => {
    if (from.split('.')[2] === to.split('.')[2]) {
      try {
        const result = await AKPIService.getKPIs(
          shippingCompanyID,
          parseInt(from.split('.')[2]),
          from,
          to
        )
        saveTo.value = result.data
      } catch (error: unknown) {
        handleError(error, saveTo)
      }
    } else {
      for (let i = parseInt(from.split('.')[2]); i <= parseInt(to.split('.')[2]); i++) {
        try {
          if (i === parseInt(from.split('.')[2])) {
            const result = await AKPIService.getKPIs(shippingCompanyID, i, from, `31.12.${i}`)
            saveTo.value = result.data
          } else if (i === parseInt(to.split('.')[2])) {
            const result = await AKPIService.getKPIs(shippingCompanyID, i, `01.01.${i}`, to)
            appendKeyFigures(result.data, saveTo)
          } else {
            const result = await AKPIService.getKPIs(
              shippingCompanyID,
              i,
              `01.01.${i}`,
              `31.12.${i}`
            )
            appendKeyFigures(result.data, saveTo)
          }
        } catch (error: unknown) {
          handleError(error, saveTo)
        }
      }
    }
  }

  const appendKeyFigures = (keyFigures: AKeyModel[], saveTo: Ref<AKeyModel[]>) => {
    keyFigures.forEach((kpi: AKeyModel) => {
      const index = saveTo.value.findIndex((kpiCurrent) => {
        return kpiCurrent.name === kpi.name
      })
      if (index !== -1) {
        kpi.values.forEach((value) => {
          saveTo.value[index].values.push(value)
        })
      } else {
        saveTo.value.push(kpi)
      }
    })
  }

  const handleError = (error: unknown, saveTo: Ref<AKeyModel[]>) => {
    if ((error as AxiosError).isAxiosError) {
      const axiosError = error as AxiosError
      if (axiosError.response?.status === 400) {
        saveTo.value = []
      } else {
        console.log(error)
      }
    } else {
      console.log(error)
    }
  }

  const computedCapacityKeyFigures = computed(() => {
    return allKpisCurrentPeriod.value.filter((kpi) => {
      if (
        kpi.name === 'avgUsedStoringPositions' ||
        kpi.name === 'avgUsedShipmentVolume' ||
        kpi.name === 'avgUsedShipmentLoadingMeter' ||
        kpi.name === 'plannedTours' ||
        kpi.name === 'availableTours'
      ) {
        return true
      }
    })
  })

  const computedTotalSavingsKeyFigures = computed(() => {
    return allKpisCurrentPeriod.value.filter((kpi) => {
      if (
        kpi.name === 'co2Savings' ||
        kpi.name === 'tourSavings' ||
        kpi.name === 'costSavingsPlanningTime' ||
        kpi.name === 'timeSavingsPlanningTime' ||
        kpi.name === 'costSavingsResources'
      ) {
        return true
      }
    })
  })

  const computedTotalSavingsPreviousPeriodKeyFigures = computed(() => {
    return allKpisPreviousPeriod.value.filter((kpi) => {
      if (
        kpi.name === 'costSavingsResources' ||
        kpi.name === 'costSavingsPlanningTime' ||
        kpi.name === 'timeSavingsPlanningTime' ||
        kpi.name === 'tourSavings'
      ) {
        return true
      }
    })
  })

  const computedGeneralKeyFigures = computed(() => {
    return allKpisCurrentPeriod.value.filter((kpi) => {
      if (
        kpi.name === 'planningTime' ||
        kpi.name === 'reschudulingCount' ||
        kpi.name === 'amountPlannedShipments' ||
        kpi.name === 'costsUsedResources' ||
        kpi.name === 'avgStopsTour' ||
        kpi.name === 'avgKmTours' ||
        kpi.name === 'toursPerResourceType' ||
        kpi.name === 'toursPerTransportOperator' ||
        kpi.name === 'shipmentsPerTransportOperator' ||
        kpi.name === 'availableTours' ||
        kpi.name === 'plannedTours' ||
        kpi.name === 'totalPlannedShipmentWeight'
      ) {
        return true
      }
    })
  })

  const computedGeneralPreviousPeriodKeyFigures = computed(() => {
    return allKpisPreviousPeriod.value.filter((kpi) => {
      if (
        kpi.name === 'amountPlannedShipments' ||
        kpi.name === 'costUsedResources' ||
        kpi.name === 'totalPlannedShipmentWeight'
      ) {
        return true
      }
    })
  })

  return {
    fetchKeyFiguresCurrentPeriod,
    fetchKeyFiguresPreviousPeriod,
    computedCapacityKeyFigures,
    computedTotalSavingsKeyFigures,
    computedTotalSavingsPreviousPeriodKeyFigures,
    computedGeneralKeyFigures,
    computedGeneralPreviousPeriodKeyFigures
  }
})
