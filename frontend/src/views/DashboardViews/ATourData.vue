<script setup lang="ts">
import ASearchbar from '@/components/searchbar/ASearchbar.vue'
import ACalenderInput from '@/components/calender-input/ACalenderInput.vue'
import AListe from '@/components/list/AList.vue'
import { onBeforeMount, ref } from 'vue'
import type { Ref } from 'vue'
import { ATourDataService } from '@/services/ATourDataService'
import { filterTourData } from '@/utils/functions/filterTourData'
import type { ATourDataType } from '@/utils/types/aTourDataType'
import { format } from 'date-fns'
import { useTourDataStore } from '@/stores/tourDataStore'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import type { AxiosError } from 'axios'
import AButton from '@/components/button/AButton.vue'

withDefaults(defineProps<Props>(), {
  width: '850px'
})

interface Props {
  /**
   * The width of the component
   */
  width?: string
}

const tourDataStore = useTourDataStore()

const mockColumnNames = [
  { key: 'transportOperator', name: 'Spedition' },
  { key: 'tourNumber', name: 'Tour' },
  { key: 'date', name: 'Datum' },
  { key: 'kilometers', name: 'Kilometer' },
  { key: 'plannedShipments', name: 'Sendungen' },
  { key: 'plannedShipmentWeight', name: 'Gewicht' },
  { key: 'resource', name: 'Ressoure' },
  { key: 'numberOfStops', name: 'Anz. Stopps' }
]
const filteredTourData: Ref<ATourDataType[]> = ref([])

const calenderFilter: Ref<string> = ref(format(new Date(), 'dd.MM.yyyy').toString())

const filter = ref('')

const authStore = useAuthStore()
const { aUser } = storeToRefs(authStore)

const loading = ref(true)

onBeforeMount(async () => {
  await handleUpdateData()
  filteredTourData.value = filterTourData(
    filteredTourData.value,
    filter.value.toLowerCase().split(' ')
  )
})

const handleNewFilter = async (newFilter: string) => {
  filteredTourData.value = await tourDataStore.getTourDataForDate(calenderFilter.value)
  filter.value = newFilter
  const filterArray = newFilter.toLowerCase().split(' ')
  filteredTourData.value = filterTourData(filteredTourData.value, filterArray)
}

const handleNewCalenderFilter = async () => {
  await handleUpdateData()
  loading.value = true
  const filterArray = filter.value.toLowerCase().split(' ')
  filteredTourData.value = filterTourData(filteredTourData.value, filterArray)
  loading.value = false
}

const handleUpdateData = async () => {
  loading.value = true
  if (!tourDataStore.checkIfDateIsInStore(calenderFilter.value)) {
    try {
      const newTourData = await ATourDataService.getTourData(
        aUser.value.shippingCompanyId,
        calenderFilter.value
      )
      newTourData.forEach((tourData) => {
        tourData.date = tourData.date.split('-').reverse().join('.')
      })
      tourDataStore.addSortedTourData(newTourData)
    } catch (e) {
      if (
        !(
          ((e as AxiosError).response!.data as Record<string, string>).message ===
          'Tours could not be fetched!'
        )
      ) {
        alert('Es ist ein Fehler beim Laden der Touren aufgetreten!' + e)
      }
    }
  }
  filteredTourData.value = await tourDataStore.getTourDataForDate(calenderFilter.value)
  loading.value = false
}
</script>

<template>
  <div class="a-tour-data-host">
    <div class="a-tour-data-container">
      <div class="a-tour-data-header">
        <ASearchbar placeholder="[Spedition Tour] suchen..." @change="handleNewFilter" />
        <ACalenderInput v-model:value="calenderFilter" />
        <AButton
          title="Aktualisieren"
          primary
          @press="handleNewCalenderFilter"
          :disabled="loading"
        />
      </div>
      <div class="loader" v-if="loading"></div>
      <AListe :column-names="mockColumnNames" :list="filteredTourData" v-else />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import 'src/styles/config.scss';

.a-tour-data-host {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;
  padding: 20px 0 20px 0;

  .a-tour-data-container {
    display: flex;
    flex-direction: column;
    background-color: white;
    width: fit-content;
    height: fit-content;
    padding: 20px 50px 20px 50px;
    border-radius: $big-border-radius;

    .a-tour-data-header {
      display: flex;
      flex-direction: row;
      justify-content: center;
      gap: 30px;
      align-items: center;
      margin-bottom: 20px;
    }
  }
}
</style>
