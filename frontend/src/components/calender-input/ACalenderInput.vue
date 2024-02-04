<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Ref } from 'vue'

interface Props {
  /**
   * The value of the input
   */
  value?: string
}

const props = withDefaults(defineProps<Props>(), {
  value: ''
})

interface Emits {
  /**
   * Emitted when the value of the input changes
   * @param e The event
   * @param value The new value
   */
  (e: 'update:value', value: string): void
}

const emit = defineEmits<Emits>()

const inputDate: Ref<string> = ref(props.value ? props.value.split('.').reverse().join('-') : '')

watch(inputDate, (newValue) => {
  if (newValue) {
    emit('update:value', newValue.toString().split('-').reverse().join('.'))
  }
})

watch(
  () => props.value,
  (newValue) => {
    if (newValue) {
      inputDate.value = newValue.split('.').reverse().join('-')
    }
  }
)
</script>

<template>
  <input type="date" class="a-calender-input-host" v-model="inputDate" />
</template>

<style scoped lang="scss">
@import 'src/styles/config.scss';

.a-calender-input-host {
  width: 150px;
  border: none;
  cursor: pointer;
  height: 40px;
  border-radius: $inner-border-radius;
  font-size: $second-font-size;
  background-color: $background-grey-color;
  padding: 8px 14px;
  box-sizing: border-box;
}

.a-calender-input-host:focus {
  outline: none;
}
</style>
