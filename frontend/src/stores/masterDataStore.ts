import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import { AMasterDataService } from '@/services/AMasterDataService'
import type { AResource } from '@/utils/classes/AResource'
import { AMasterData } from '@/utils/classes/AMasterData'

/**
 * @description Store for user data
 */
export const useMasterDataStore = defineStore('masterDataStore', () => {
  const masterData: Ref<AMasterData> = ref(new AMasterData('', 0, 0, []))

  const resources: ComputedRef<AResource[]> = computed(() => masterData.value.resources)
  const planningCost: ComputedRef<{ regularPlanningTime: number; dispatcherSalary: number }> =
    computed((): { regularPlanningTime: number; dispatcherSalary: number } => {
      return {
        regularPlanningTime: masterData.value.regularPlanningTime,
        dispatcherSalary: masterData.value.dispatcherSalary
      }
    })

  const fetchMasterData = async (shippingCompanyID: string) => {
    masterData.value = await AMasterDataService.getMasterData(shippingCompanyID)
  }

  const updateResources = async (updatedResources: AResource[], shippingCompanyID: string) => {
    const updatedMasterData = new AMasterData(
      masterData.value.shippingCompanyName,
      masterData.value.regularPlanningTime,
      masterData.value.dispatcherSalary,
      updatedResources
    )
    return AMasterDataService.updateMasterData(updatedMasterData, shippingCompanyID).then(
      async (result: any) => {
        await fetchMasterData(shippingCompanyID)
        return result
      }
    )
  }

  const updatePlanningCost = async (
    updatedPlanningCost: {
      regularPlanningTime: number
      dispatcherSalary: number
    },
    shippingCompanyID: string
  ) => {
    const updatedMasterData = new AMasterData(
      masterData.value.shippingCompanyName,
      updatedPlanningCost.regularPlanningTime,
      updatedPlanningCost.dispatcherSalary,
      masterData.value.resources
    )
    return AMasterDataService.updateMasterData(updatedMasterData, shippingCompanyID).then(
      async (result: any) => {
        await fetchMasterData(shippingCompanyID)
        return result
      }
    )
  }

  const createMasterData = async (newMasterData: AMasterData, shippingCompanyID: string) => {
    AMasterDataService.createMasterData(newMasterData, shippingCompanyID).then(async (result) => {
      await fetchMasterData(shippingCompanyID)
      return result
    })
  }

  return {
    masterData,
    resources,
    planningCost,
    fetchMasterData,
    updateResources,
    updatePlanningCost,
    createMasterData
  }
})
