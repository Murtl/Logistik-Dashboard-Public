<script setup lang="ts">
import APeriodBar from '@/components/period-bar/APeriodBar.vue'
import ATotalSavings from '@/components/key-figure-segments/ATotalSavings.vue'
import AGeneralKeyFigures from '@/components/key-figure-segments/AGeneralKeyFigures.vue'
import ACapacityKeyFigures from '@/components/key-figure-segments/ACapacityKeyFigures.vue'
import { useKeyFiguresStore } from '@/stores/keyFiguresStore'
import { useAuthStore } from '@/stores/authStore'
import { ref } from 'vue'

const keyFiguresStore = useKeyFiguresStore()
const authStore = useAuthStore()

const loading = ref(true)

const showCurrentPeriod = async (from: string, to: string) => {
  loading.value = true
  await keyFiguresStore.fetchKeyFiguresCurrentPeriod(authStore.aUser.shippingCompanyId, from, to)
  loading.value = false
}

const showPreviousPeriod = async (from: string, to: string) => {
  loading.value = true
  await keyFiguresStore.fetchKeyFiguresPreviousPeriod(authStore.aUser.shippingCompanyId, from, to)
  loading.value = false
}
</script>

<template>
  <div class="a-key-figures-host">
    <header>
      <APeriodBar @new-time-period="showCurrentPeriod" @previous-time-period="showPreviousPeriod" />
    </header>

    <main v-if="loading" class="loader"></main>

    <main v-else>
      <ATotalSavings />
      <AGeneralKeyFigures />
      <ACapacityKeyFigures />
    </main>
  </div>
</template>

<style scoped lang="scss">
.a-key-figures-host {
  main {
    margin-top: 50px;
  }
}
</style>
