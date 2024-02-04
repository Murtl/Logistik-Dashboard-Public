import { defineStore } from 'pinia'
import type { Ref } from 'vue'
import { ref } from 'vue'
import type { ATourDataType } from '@/utils/types/aTourDataType'
import type { ASortedTourData } from '@/utils/types/aSortedTourData'

/**
 * @description Store for the tour data
 */
export const useTourDataStore = defineStore('tourDataStore', () => {
  const sortedTourData: Ref<ASortedTourData[]> = ref([])

  const addSortedTourData = (tourData: ATourDataType[]) => {
    if (tourData.length > 0) {
      sortedTourData.value.push({
        date: tourData[0].date,
        tourenData: tourData
      })
    }
  }

  const checkIfDateIsInStore = (date: string): boolean => {
    sortedTourData.value.forEach((sortedTourData) => {
      if (sortedTourData.date === date) {
        return true
      }
    })
    return false
  }

  const getTourDataForDate = async (date: string): Promise<ATourDataType[]> => {
    const tourData: ATourDataType[] = []
    sortedTourData.value.forEach((sortedTourData) => {
      if (sortedTourData.date === date) {
        Object.assign(tourData, sortedTourData.tourenData)
      }
    })
    return tourData
  }

  return {
    sortedTourData,
    addSortedTourData,
    checkIfDateIsInStore,
    getTourDataForDate
  }
})
