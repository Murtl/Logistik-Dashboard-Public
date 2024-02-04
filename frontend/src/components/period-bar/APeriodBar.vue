<script setup lang="ts">
import ACalenderInput from '@/components/calender-input/ACalenderInput.vue'
import AButton from '@/components/button/AButton.vue'
import { onBeforeMount, ref } from 'vue'
import { format } from 'date-fns'

interface Emits {
  /**
   * Returns the new time period
   * @param e The event
   * @param from The start of the new time period
   * @param to The end of the new time period
   */
  (e: 'newTimePeriod', from: string, to: string): void

  /**
   * Returns the previous time period
   * @param e The event
   * @param from The start of the previous time period
   * @param to The end of the previous time period
   */
  (e: 'previousTimePeriod', from: string, to: string): void
}

const emit = defineEmits<Emits>()

const from = ref(format(new Date(), 'dd.MM.yyyy'))
const to = ref(format(new Date(), 'dd.MM.yyyy'))
const refreshButtonDisabled = ref(false)

const emitPeriods = async () => {
  refreshButtonDisabled.value = true
  await calculatePreviousPeriodAndEmit(from.value, to.value)
  emit('newTimePeriod', from.value, to.value)
  refreshButtonDisabled.value = false
}

onBeforeMount(() => {
  emitCurrentDay()
})

const emitCurrentDay = () => {
  const currentDay = new Date()
  const today = format(currentDay, 'dd.MM.yyyy')
  from.value = today
  to.value = today
  emit('newTimePeriod', today, today)

  const previousDay = currentDay.setDate(currentDay.getDate() - 1)
  emit('previousTimePeriod', format(previousDay, 'dd.MM.yyyy'), format(previousDay, 'dd.MM.yyyy'))
}

const emitCurrentMonth = () => {
  const today = new Date()
  const firstDayOfMonth = format(new Date(today.getFullYear(), today.getMonth(), 1), 'dd.MM.yyyy')
  const lastDayOfMonth = format(
    new Date(today.getFullYear(), today.getMonth() + 1, 0),
    'dd.MM.yyyy'
  )
  from.value = firstDayOfMonth
  to.value = lastDayOfMonth
  emit('newTimePeriod', firstDayOfMonth, lastDayOfMonth)

  const firstDayOfPreviousMonth = format(
    new Date(today.getFullYear(), today.getMonth() - 1, 1),
    'dd.MM.yyyy'
  )
  const lastDayOfPreviousMonth = format(
    new Date(today.getFullYear(), today.getMonth(), 0),
    'dd.MM.yyyy'
  )
  emit('previousTimePeriod', firstDayOfPreviousMonth, lastDayOfPreviousMonth)
}

const emitCurrentYear = () => {
  const today = new Date()
  const firstDayOfYear = format(new Date(today.getFullYear(), 0, 1), 'dd.MM.yyyy')
  const lastDayOfYear = format(new Date(today.getFullYear(), 11, 31), 'dd.MM.yyyy')
  from.value = firstDayOfYear
  to.value = lastDayOfYear
  emit('newTimePeriod', firstDayOfYear, lastDayOfYear)

  const firstDayOfPreviousYear = format(new Date(today.getFullYear() - 1, 0, 1), 'dd.MM.yyyy')
  const lastDayOfPreviousYear = format(new Date(today.getFullYear() - 1, 11, 31), 'dd.MM.yyyy')
  emit('previousTimePeriod', firstDayOfPreviousYear, lastDayOfPreviousYear)
}

const calculatePreviousPeriodAndEmit = async (fromValue: string, toValue: string) => {
  const dateFrom = new Date(fromValue.split('.').reverse().join('-'))
  const dateTo = new Date(toValue.split('.').reverse().join('-'))

  const timestamp1 = dateFrom.getTime()
  const timestamp2 = dateTo.getTime()

  const difference = Math.abs(timestamp2 - timestamp1)

  const differenceInDays = Math.ceil(difference / (1000 * 3600 * 24))

  const previousTo = dateFrom.setDate(dateFrom.getDate() - 1)
  const previousFrom = dateFrom.setDate(dateFrom.getDate() - differenceInDays)

  emit('previousTimePeriod', format(previousFrom, 'dd.MM.yyyy'), format(previousTo, 'dd.MM.yyyy'))
}
</script>

<template>
  <div class="a-period-bar-host">
    <section class="title">
      <span>Zeitraum</span>
    </section>
    <section class="main-elements">
      <ACalenderInput v-model:value="from" />
      <ACalenderInput v-model:value="to" />
      <AButton
        primary
        title="Aktualisieren"
        @press="emitPeriods"
        :disabled="refreshButtonDisabled"
      />
      <AButton primary title="aktueller Tag" @press="emitCurrentDay" />
      <AButton primary title="aktueller Monat" @press="emitCurrentMonth" />
      <AButton primary title="aktuelles Jahr" @press="emitCurrentYear" />
    </section>
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/config.scss';

.a-period-bar-host {
  display: flex;
  flex-flow: row;
  align-items: center;
  gap: 200px;
  background-color: $background-grey-color;
  margin-top: 20px;
  padding: 15px;
  width: 1290px;
  border-radius: $outer-border-radius;
  margin-left: auto;
  margin-right: auto;

  .title {
    font-size: 20px;
    font-weight: bold;
  }

  .main-elements {
    display: flex;
    flex-flow: row;
    justify-content: center;
    align-items: center;
    gap: 10px;

    :deep(.a-calender-input-host) {
      background-color: white;
    }
  }
}
</style>
