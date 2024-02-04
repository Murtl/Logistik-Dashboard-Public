<script setup lang="ts">
import AKennzahlkachel from '@/components/kennzahlkachel/AKennzahlkachel.vue'
import ALineChart from '@/components/diagramms/ALineChart.vue'
import APieChart from '@/components/diagramms/APieChart.vue'
import { computed } from 'vue'
import { useKeyFiguresStore } from '@/stores/keyFiguresStore'
import {
  getKPIDataForKennzahlkachel,
  getKPIDataForKennzahlkachelOnlyValue,
  getKPIDataForLineChart
} from '@/utils/functions/kpiFunctions'
import type { AKennzahlkachelData } from '@/utils/interfaces/aKennzahlkachelData'
import ADoubleBarChart from '@/components/diagramms/ADoubleBarChart.vue'

const keyFiguresStore = useKeyFiguresStore()

const computedTotalPlannedShipmentWeightLineChart = computed(() => {
  return getKPIDataForLineChart(
    'Gesamtgewicht der Sendungen (in 100kg)',
    '#2dbebe',
    'totalPlannedShipmentWeight',
    keyFiguresStore.computedGeneralKeyFigures,
    1 / 100
  )
})

const computedAmountOfPlannedShipmentsLineChart = computed(() => {
  return getKPIDataForLineChart(
    'Anzahl der verplanten Sendungen',
    '#1e397e',
    'amountPlannedShipments',
    keyFiguresStore.computedGeneralKeyFigures
  )
})

const computedCostUsedResourcesLineChart = computed(() => {
  return getKPIDataForLineChart(
    'Gesamtkosten der Ressourcen',
    '#2dbebe',
    'costsUsedResources',
    keyFiguresStore.computedGeneralKeyFigures
  )
})

const computedAvgStopsTourLineChart = computed(() => {
  return getKPIDataForLineChart(
    'Tourstopps',
    '#2dbebe',
    'avgStopsTour',
    keyFiguresStore.computedGeneralKeyFigures
  )
})

const computedAvgKmToursLineChart = computed(() => {
  return getKPIDataForLineChart(
    'Durchschnitt der Kilometer der Touren je Tag',
    '#1e397e',
    'avgKmTours',
    keyFiguresStore.computedGeneralKeyFigures
  )
})

const computedAmountOfPlannedShipmentsKPI = computed(() => {
  return getKPIDataForKennzahlkachel(
    'Stück',
    'amountPlannedShipments',
    keyFiguresStore.computedGeneralKeyFigures,
    keyFiguresStore.computedGeneralPreviousPeriodKeyFigures
  )
})

const computedTotalPlannedShipmentWeightKPI = computed(() => {
  return getKPIDataForKennzahlkachel(
    't',
    'totalPlannedShipmentWeight',
    keyFiguresStore.computedGeneralKeyFigures,
    keyFiguresStore.computedGeneralPreviousPeriodKeyFigures,
    1 / 1000
  )
})

const computedCostUsedResourcesKPI = computed(() => {
  return getKPIDataForKennzahlkachel(
    'T€',
    'costsUsedResources',
    keyFiguresStore.computedGeneralKeyFigures,
    keyFiguresStore.computedGeneralPreviousPeriodKeyFigures,
    1 / 1000
  )
})

const computedReschedulingCount = computed(() => {
  return getKPIDataForKennzahlkachelOnlyValue(
    'Stück',
    'reschudulingCount',
    keyFiguresStore.computedGeneralKeyFigures
  )
})

const computedPlanningTime = computed(() => {
  return getKPIDataForKennzahlkachelOnlyValue(
    'h',
    'planningTime',
    keyFiguresStore.computedGeneralKeyFigures,
    1 / 60 / 60
  )
})

const computedAvailableToursKPI = computed(() => {
  let availableTours: AKennzahlkachelData = {
    value: 0,
    unit: 'Stück',
    text: 'davon geplant',
    ps: {
      absolute: 0,
      percentage: 0
    }
  }
  keyFiguresStore.computedGeneralKeyFigures.forEach((kpi) => {
    if (kpi.name === 'availableTours') {
      kpi.values.forEach((value) => {
        availableTours.value = availableTours.value + value.value
      })
    }
  })
  keyFiguresStore.computedGeneralKeyFigures.forEach((kpi) => {
    if (kpi.name === 'plannedTours') {
      kpi.values.forEach((value) => {
        availableTours.ps.absolute = availableTours.ps.absolute + value.value
      })
    }
  })
  if (availableTours.value === 0 || availableTours.ps.absolute === 0) {
    availableTours.ps.percentage = 0
  } else {
    availableTours.ps.percentage = (availableTours.ps.absolute / availableTours.value) * 100
  }
  return availableTours
})

const computedToursPerResourceTypePieChart = computed(() => {
  let toursPerResourceTypeIndex: { [name: string]: { name: string; tours: number } } = {}
  keyFiguresStore.computedGeneralKeyFigures.forEach((kpi) => {
    if (kpi.name === 'toursPerResourceType') {
      kpi.values.forEach((value) => {
        value.value.forEach((resource: { count: number; resource: string }) => {
          if (toursPerResourceTypeIndex[resource.resource]) {
            toursPerResourceTypeIndex[resource.resource].tours =
              toursPerResourceTypeIndex[resource.resource].tours + resource.count
          } else {
            toursPerResourceTypeIndex[resource.resource] = {
              name: resource.resource,
              tours: resource.count
            }
          }
        })
      })
    }
  })
  let toursPerResourceType: { name: string; tours: number }[] = []
  for (const key in toursPerResourceTypeIndex) {
    toursPerResourceType.push(toursPerResourceTypeIndex[key])
  }
  return toursPerResourceType
})

const computedToursAndShipmentsPerTransportOperatorDoubleBarChart = computed(() => {
  let toursAndShipmentsPerTransportOperatorIndex: {
    [name: string]: { name: string; tours: number; shipments: number }
  } = {}
  keyFiguresStore.computedGeneralKeyFigures.forEach((kpi) => {
    if (kpi.name === 'toursPerTransportOperator') {
      kpi.values.forEach((value) => {
        value.value.forEach((resource: { count: number; operator: string }) => {
          if (toursAndShipmentsPerTransportOperatorIndex[resource.operator]) {
            toursAndShipmentsPerTransportOperatorIndex[resource.operator].tours =
              toursAndShipmentsPerTransportOperatorIndex[resource.operator].tours + resource.count
          } else {
            toursAndShipmentsPerTransportOperatorIndex[resource.operator] = {
              name: resource.operator,
              tours: resource.count,
              shipments: 0
            }
          }
        })
      })
    }
  })
  keyFiguresStore.computedGeneralKeyFigures.forEach((kpi) => {
    if (kpi.name === 'shipmentsPerTransportOperator') {
      kpi.values.forEach((value) => {
        value.value.forEach((resource: { operator: string; shipments: number }) => {
          if (toursAndShipmentsPerTransportOperatorIndex[resource.operator]) {
            toursAndShipmentsPerTransportOperatorIndex[resource.operator].shipments =
              toursAndShipmentsPerTransportOperatorIndex[resource.operator].shipments +
              resource.shipments
          } else {
            toursAndShipmentsPerTransportOperatorIndex[resource.operator] = {
              name: resource.operator,
              tours: 0,
              shipments: resource.shipments
            }
          }
        })
      })
    }
  })

  let toursAndShipmentsPerTransportOperator: { name: string; tours: number; shipments: number }[] =
    []
  for (const key in toursAndShipmentsPerTransportOperatorIndex) {
    toursAndShipmentsPerTransportOperator.push(toursAndShipmentsPerTransportOperatorIndex[key])
  }
  return toursAndShipmentsPerTransportOperator
})
</script>

<template>
  <div class="a-general-key-figures-host">
    <header>
      <span>Allgemeine Kennzahlen</span>
    </header>
    <main class="a-general-key-figures-grid">
      <div class="grid-column-span-3 grid-item kennzahlen-segment">
        <div class="title">Sendungen</div>
        <div class="kennzahl-kachel-container">
          <AKennzahlkachel
            title="Anzahl"
            :savings="computedAmountOfPlannedShipmentsKPI.value.toString()"
            :psabsolute="computedAmountOfPlannedShipmentsKPI.ps.absolute.toString()"
            :pspercentage="computedAmountOfPlannedShipmentsKPI.ps.percentage.toFixed(2)"
            :unit="computedAmountOfPlannedShipmentsKPI.unit"
            small-title
          />
          <AKennzahlkachel
            title="Gewicht"
            :savings="computedTotalPlannedShipmentWeightKPI.value.toFixed(1)"
            :psabsolute="computedTotalPlannedShipmentWeightKPI.ps.absolute.toFixed(1)"
            :pspercentage="computedTotalPlannedShipmentWeightKPI.ps.percentage.toFixed(2)"
            :unit="computedTotalPlannedShipmentWeightKPI.unit"
            small-title
          />
        </div>
      </div>
      <AKennzahlkachel
        title="Umplanungen"
        :savings="computedReschedulingCount.value.toString()"
        :unit="computedReschedulingCount.unit"
        class="grid-item"
        color="#478F92"
      />
      <AKennzahlkachel
        title="Planungszeit"
        :savings="computedPlanningTime.value.toFixed(2)"
        :unit="computedPlanningTime.unit"
        class="grid-item"
        color="#478F92"
      />
      <ALineChart
        title="Sendungen - Anzahl & Gewicht"
        :datasets="[
          computedTotalPlannedShipmentWeightLineChart.data,
          computedAmountOfPlannedShipmentsLineChart.data
        ]"
        :x_axis="computedAmountOfPlannedShipmentsLineChart.labels"
        y_axis_label=""
        class="grid-item grid-column-span-3 grid-row-span-2"
      />
      <AKennzahlkachel
        title="Gesamtkosten der Ressourcen"
        :savings="computedCostUsedResourcesKPI.value.toFixed(2)"
        :unit="computedCostUsedResourcesKPI.unit"
        :psabsolute="computedCostUsedResourcesKPI.ps.absolute.toFixed(2)"
        :pspercentage="computedCostUsedResourcesKPI.ps.percentage.toFixed(2)"
        class="grid-item grid-column-span-2"
      />
      <ALineChart
        title="Gesamtkosten der Sendungen"
        :datasets="[computedCostUsedResourcesLineChart.data]"
        :x_axis="computedCostUsedResourcesLineChart.labels"
        y_axis_label=""
        class="grid-item grid-column-span-2"
      />

      <AKennzahlkachel
        title="Anzahl der verfügbaren Touren"
        :savings="computedAvailableToursKPI.value.toString()"
        :unit="computedAvailableToursKPI.unit"
        :text="computedAvailableToursKPI.text"
        :psabsolute="computedAvailableToursKPI.ps.absolute.toString()"
        :pspercentage="computedAvailableToursKPI.ps.percentage.toFixed(2)"
        color="#478F92"
        class="grid-item grid-column-span-2"
      />
      <APieChart
        title="Eingesetzte Ressourcen"
        :data="computedToursPerResourceTypePieChart.map((item) => item.tours)"
        item-label="Touren"
        :labels="computedToursPerResourceTypePieChart.map((item) => item.name)"
        class="grid-item grid-column-span-3 grid-row-span-2"
      />
      <ALineChart
        title="Tourdetails - Stopps & Touren"
        :datasets="[computedAvgStopsTourLineChart.data, computedAvgKmToursLineChart.data]"
        :x_axis="computedAvgStopsTourLineChart.labels"
        y_axis_label=""
        class="grid-item grid-column-span-2 grid-row-span-2"
      />
      <ADoubleBarChart
        title="Durchführende Speditionen"
        :barOneData="
          computedToursAndShipmentsPerTransportOperatorDoubleBarChart.map((item) => item.tours)
        "
        :barTwoData="
          computedToursAndShipmentsPerTransportOperatorDoubleBarChart.map(
            (item) => item.shipments / 100
          )
        "
        :x_axis="
          computedToursAndShipmentsPerTransportOperatorDoubleBarChart.map((item) => item.name)
        "
        x_axis_bar_one_label="Anzahl Touren"
        x_axis_bar_two_label="Anzahl Sendungen (x100)"
        y_axis_label=""
        class="grid-item grid-column-span-3"
      />
    </main>
  </div>
</template>

<style scoped lang="scss">
@import 'src/styles/config.scss';

.a-general-key-figures-host {
  border-radius: 10px;
  margin: 10px auto;
  padding: 15px;
  width: 1300px;
  background-color: $background-grey-color;

  header {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
  }

  .a-general-key-figures-grid {
    box-sizing: border-box;
    padding: 20px 10px 0 10px;
    display: grid;
    grid-template-columns: repeat(2, 2fr) 1fr repeat(2, 2fr);
    grid-template-rows: repeat(6, 1fr);
    gap: 30px;

    .kennzahlen-segment {
      box-sizing: border-box;
      padding: 20px;

      .title {
        font-family: 'Inter', sans-serif;
        font-size: 20px;
        font-weight: bold;
        text-align: center;
      }

      .kennzahl-kachel-container {
        display: flex;
        justify-content: space-around;
        height: 180px;
      }
    }

    .grid-item {
      border-radius: $big-border-radius;
      background-color: white;
      box-shadow: $main-box-shadow;
    }

    .grid-column-span-2 {
      grid-column: span 2;
    }

    .grid-row-span-2 {
      grid-row: span 2;
    }

    .grid-column-span-3 {
      grid-column: span 3;
    }
  }
}
</style>
