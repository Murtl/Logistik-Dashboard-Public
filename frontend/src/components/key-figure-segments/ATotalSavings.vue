<script setup lang="ts">
import AKennzahlkachel from '@/components/kennzahlkachel/AKennzahlkachel.vue'
import ALineChart from '@/components/diagramms/ALineChart.vue'
import { computed } from 'vue'
import { useKeyFiguresStore } from '@/stores/keyFiguresStore'
import {
  getKPIDataForKennzahlkachel,
  getKPIDataForKennzahlkachelOnlyValue,
  getKPIDataForLineChart
} from '@/utils/functions/kpiFunctions'

const keyFiguresStore = useKeyFiguresStore()

const computedCo2SavingsLineChart = computed(() => {
  return getKPIDataForLineChart(
    'CO2-Einsparung in t',
    '#de7223',
    'co2Savings',
    keyFiguresStore.computedTotalSavingsKeyFigures,
    1 / 1000 / 1000
  )
})

const computedTourSavingsLineChart = computed(() => {
  return getKPIDataForLineChart(
    'Eingesparte Touren',
    '#dc2e2e',
    'tourSavings',
    keyFiguresStore.computedTotalSavingsKeyFigures
  )
})

const computedCostSavingsPlanningTimeLineChart = computed(() => {
  return getKPIDataForLineChart(
    'Kosten-Einsparung in T€',
    '#2dbebe',
    'costSavingsPlanningTime',
    keyFiguresStore.computedTotalSavingsKeyFigures,
    1 / 1000
  )
})

const computedTimeSavingsPlanningTimeLineChart = computed(() => {
  return getKPIDataForLineChart(
    'Zeit-Einsparung in Stunden',
    '#1e397e',
    'timeSavingsPlanningTime',
    keyFiguresStore.computedTotalSavingsKeyFigures,
    1 / 60 / 60
  )
})

const computedCostSavingsResourcesKPI = computed(() => {
  return getKPIDataForKennzahlkachel(
    'T€',
    'costSavingsResources',
    keyFiguresStore.computedTotalSavingsKeyFigures,
    keyFiguresStore.computedTotalSavingsPreviousPeriodKeyFigures,
    1 / 1000
  )
})

const computedCo2SavingsResourcesKPI = computed(() => {
  let co2Savings = getKPIDataForKennzahlkachelOnlyValue(
    't CO2',
    'co2Savings',
    keyFiguresStore.computedTotalSavingsKeyFigures,
    1 / 1000 / 1000
  )
  return {
    ...co2Savings,
    text: 'entspricht',
    alternativeBottomText: `${((co2Savings.value * 1000 * 1000) / 118.5).toFixed()} km Autofahrt`
  }
  //Quelle für Berechnung: https://www.umweltbundesamt.de/themen/eu-co2-ausstoss-von-neuwagen-2017-hoeher-als-im
})

const computedCostSavingsPlanningTimeKPI = computed(() => {
  return getKPIDataForKennzahlkachel(
    'T€',
    'costSavingsPlanningTime',
    keyFiguresStore.computedTotalSavingsKeyFigures,
    keyFiguresStore.computedTotalSavingsPreviousPeriodKeyFigures,
    1 / 1000
  )
})

const computedTimeSavingsPlanningTimeKPI = computed(() => {
  return getKPIDataForKennzahlkachel(
    'h',
    'timeSavingsPlanningTime',
    keyFiguresStore.computedTotalSavingsKeyFigures,
    keyFiguresStore.computedTotalSavingsPreviousPeriodKeyFigures,
    1 / 60 / 60
  )
})

const computedTourSavingsKPI = computed(() => {
  return getKPIDataForKennzahlkachel(
    'Stück',
    'tourSavings',
    keyFiguresStore.computedTotalSavingsKeyFigures,
    keyFiguresStore.computedTotalSavingsPreviousPeriodKeyFigures
  )
})
</script>

<template>
  <div class="a-total-savings-host">
    <header>
      <span>Gesamteinsparung durch Aluco</span>
    </header>
    <main class="a-total-savings-grid">
      <div class="grid-column-span-3 grid-item">
        <div class="title">Einsparung durch Ressourcenoptimierung</div>
        <div class="kennzahl-kachel-container">
          <AKennzahlkachel
            :savings="computedCostSavingsResourcesKPI.value.toFixed(2)"
            :unit="computedCostSavingsResourcesKPI.unit"
            :psabsolute="computedCostSavingsResourcesKPI.ps.absolute.toFixed(2)"
            :pspercentage="computedCostSavingsResourcesKPI.ps.percentage.toFixed(2)"
          ></AKennzahlkachel>
          <AKennzahlkachel
            :savings="computedCo2SavingsResourcesKPI.value.toFixed(1)"
            :text="computedCo2SavingsResourcesKPI.text"
            :unit="computedCo2SavingsResourcesKPI.unit"
            color="#478F92"
            :alternativeBottomText="computedCo2SavingsResourcesKPI.alternativeBottomText"
          ></AKennzahlkachel>
        </div>
      </div>
      <ALineChart
        title="CO2- und Tour-Einsparungen"
        :datasets="[computedCo2SavingsLineChart.data, computedTourSavingsLineChart.data]"
        :x_axis="computedCo2SavingsLineChart.labels"
        y_axis_label=""
        class="grid-column-span-3 grid-row-span-2 grid-item"
      />
      <ALineChart
        title="Kostenersparnis durch reduzierte Planungszeit"
        :datasets="[computedCostSavingsPlanningTimeLineChart.data]"
        :x_axis="computedCostSavingsPlanningTimeLineChart.labels"
        y_axis_label=""
        class="grid-column-span-3 grid-item"
      />
      <ALineChart
        title="Zeitersparnis durch reduzierte Planungszeit"
        :datasets="[computedTimeSavingsPlanningTimeLineChart.data]"
        :x_axis="computedTimeSavingsPlanningTimeLineChart.labels"
        y_axis_label=""
        class="grid-column-span-3 grid-item"
      />
      <div class="grid-column-span-2 grid-item">
        <div class="title">Einsparungen ggü. regulärer Planung</div>
        <div class="kennzahl-kachel-container">
          <AKennzahlkachel
            :savings="computedCostSavingsPlanningTimeKPI.value.toFixed(1)"
            :unit="computedCostSavingsPlanningTimeKPI.unit"
            :psabsolute="computedCostSavingsPlanningTimeKPI.ps.absolute.toFixed(1)"
            :pspercentage="computedCostSavingsPlanningTimeKPI.ps.percentage.toFixed(2)"
          ></AKennzahlkachel>
          <AKennzahlkachel
            :savings="computedTimeSavingsPlanningTimeKPI.value.toFixed(2)"
            :unit="computedTimeSavingsPlanningTimeKPI.unit"
            :psabsolute="computedTimeSavingsPlanningTimeKPI.ps.absolute.toFixed(2)"
            :pspercentage="computedTimeSavingsPlanningTimeKPI.ps.percentage.toFixed(2)"
          ></AKennzahlkachel>
        </div>
      </div>
      <AKennzahlkachel
        title="Eingesparte Touren"
        :savings="computedTourSavingsKPI.value.toString()"
        :unit="computedTourSavingsKPI.unit"
        :psabsolute="computedTourSavingsKPI.ps.absolute.toString()"
        :pspercentage="computedTourSavingsKPI.ps.percentage.toFixed(2)"
        class="grid-item"
      ></AKennzahlkachel>
    </main>
  </div>
</template>

<style scoped lang="scss">
@import 'src/styles/config.scss';

.a-total-savings-host {
  border-radius: 10px;
  margin: 10px auto;
  padding: 15px;
  width: 1300px;
  background-color: $background-grey-color;

  .a-total-savings-grid {
    box-sizing: border-box;
    padding: 20px 10px 0 10px;
    display: grid;
    grid-template-columns: 2fr repeat(3, 1fr) repeat(2, 2fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 30px;

    .kennzahl-kachel-container {
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: 200px;
    }

    .grid-item {
      border-radius: $big-border-radius;
      background-color: $background-white;
      box-shadow: $main-box-shadow;

      .title {
        font-family: 'Inter', sans-serif;
        font-size: 20px;
        font-weight: bold;
        text-align: center;
        margin: 20px 0 0 0;
      }
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

  header {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
  }
}
</style>
