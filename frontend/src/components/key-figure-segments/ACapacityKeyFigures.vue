<script setup lang="ts">
import ADoughnutChart from '@/components/diagramms/ADoughnutChart.vue'
import { useKeyFiguresStore } from '@/stores/keyFiguresStore'
import { computed, ref } from 'vue'
import {
  computeCapacityKeyFigure,
  computeCapacityKeyFigureTour
} from '@/utils/functions/computeCapacityKeyFigure'

const keyFiguresStore = useKeyFiguresStore()

const totalStoringPositions = ref(0)
const computedAvgUsedStoringPositions = computed(() => {
  return computeCapacityKeyFigure(
    keyFiguresStore.computedCapacityKeyFigures,
    'avgUsedStoringPositions',
    totalStoringPositions
  )
})

const totalShippingVolume = ref(0)
const computedAvgUsedShipmentVolume = computed(() => {
  return computeCapacityKeyFigure(
    keyFiguresStore.computedCapacityKeyFigures,
    'avgUsedShipmentVolume',
    totalShippingVolume
  )
})

const totalLoadingMeter = ref(0)
const computedAvgUsedShipmentLoadingMeter = computed(() => {
  return computeCapacityKeyFigure(
    keyFiguresStore.computedCapacityKeyFigures,
    'avgUsedShipmentLoadingMeter',
    totalLoadingMeter
  )
})

const computedPlannedTours = computed(() => {
  return computeCapacityKeyFigureTour(keyFiguresStore.computedCapacityKeyFigures, 'plannedTours')
})

const computedAvailableTours = computed(() => {
  return computeCapacityKeyFigureTour(keyFiguresStore.computedCapacityKeyFigures, 'availableTours')
})

const capacityLabels = [
  ['durchgeführte Touren', 'noch verfügbare Touren'],
  ['verwendetes Ladevolumen', 'noch verfügbares Ladevolumen'],
  ['verwendete Kapazität Ladepositionen', 'noch verfügbare Kapazität Ladevolumen'],
  ['verwendete Kapazität Lademeter', 'noch verfügbare Kapazität Lademeter']
]
</script>

<template>
  <div class="a-capacity-key-figures-host">
    <header>
      <span>Auslastungs Kennzahlen</span>
    </header>
    <main>
      <section>
        <p>⌀ Anteil durchgeführter Touren</p>
        <ADoughnutChart
          :data="(computedPlannedTours / computedAvailableTours) * 100"
          :labels="capacityLabels[0]"
        />
        <div>
          <span>Kapazität Touren</span>
          <span>davon durchgeführt</span>
        </div>
        <div class="add-data">
          <span>{{ computedAvailableTours }} Stück</span>
          <span>{{ computedPlannedTours }} Stück</span>
        </div>
      </section>

      <section>
        <p>⌀ genutztes Ladevolumen</p>
        <ADoughnutChart :data="computedAvgUsedShipmentVolume" :labels="capacityLabels[1]" />
        <div>
          <span>Kapazität Ladevolumen</span>
          <span>davon verwendet</span>
        </div>
        <div class="add-data">
          <span>{{ Math.round(totalShippingVolume) }} m3</span>
          <span
            >{{ Math.round((totalShippingVolume * computedAvgUsedShipmentVolume) / 100) }} m3</span
          >
        </div>
      </section>

      <section>
        <p>⌀ genutztes Ladepositionen</p>
        <ADoughnutChart :data="computedAvgUsedStoringPositions" :labels="capacityLabels[2]" />
        <div>
          <span>Kapazität Ladepositionen</span>
          <span>davon verwendet</span>
        </div>
        <div class="add-data">
          <span>{{ Math.round(totalStoringPositions) }} Stück</span>
          <span
            >{{
              Math.round((totalStoringPositions * computedAvgUsedStoringPositions) / 100)
            }}
            Stück</span
          >
        </div>
      </section>

      <section>
        <p>⌀ genutztes Lademeter</p>
        <ADoughnutChart :data="computedAvgUsedShipmentLoadingMeter" :labels="capacityLabels[3]" />
        <div>
          <span>Kapazität Lademeter</span>
          <span>davon verwendet</span>
        </div>
        <div class="add-data">
          <span>{{ Math.round(totalLoadingMeter) }} lm</span>
          <span
            >{{
              Math.round((totalLoadingMeter * computedAvgUsedShipmentLoadingMeter) / 100)
            }}
            lm</span
          >
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped lang="scss">
@import 'src/styles/config.scss';

.a-capacity-key-figures-host {
  border-radius: 10px;
  margin: 10px auto;
  padding: 15px;
  width: 1300px;
  background-color: $background-grey-color;

  header {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 10px;
  }

  main {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;

    section {
      background-color: $background-white;
      border-radius: $outer-border-radius;
      width: 610px;
      margin: 10px;
      box-shadow: $main-box-shadow;

      p {
        font-size: 18px;
        font-weight: bold;
        text-align: center;
      }

      div {
        font-size: 18px;
        display: flex;
        justify-content: center;
        gap: 100px;
        padding: 10px;
        font-weight: bold;
      }

      .add-data {
        font-weight: normal;
        color: $secondary-color;
        gap: 200px;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
