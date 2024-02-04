<script setup lang="ts">
import AButton from '@/components/button/AButton.vue'

interface Props {
  /**
   * The title of the segment
   */
  title: string

  /**
   * The width of the segment
   */
  width?: string

  /**
   * If the button should be disabled
   */
  buttonDisabled?: boolean
}

withDefaults(defineProps<Props>(), {
  width: '850px'
})

interface Emits {
  /**
   * saves the segment
   * @param e The event
   */
  (e: 'save'): void
}

const emit = defineEmits<Emits>()
</script>

<template>
  <div class="a-segment-host">
    <header>{{ title }}</header>
    <main>
      <slot></slot>
    </main>
    <footer>
      <span v-if="!buttonDisabled">Es liegen ungesicherte Änderungen vor!</span>
      <AButton title="Speichern" primary @press="emit('save')" :disabled="buttonDisabled" />
    </footer>
  </div>
</template>

<style scoped lang="scss">
@import 'src/styles/config.scss';

.a-segment-host {
  width: v-bind(width);
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: $background-white;
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: $outer-border-radius;
  font-size: $second-font-size;
  box-shadow: $main-box-shadow;
  padding: 8px 14px;

  header {
    width: 100%;
    padding: 8px 14px;
    font-size: $main-font-size;
    font-weight: bold;
    border-bottom: 1px solid #c1d9da;
  }

  main {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    padding: 8px 14px;
    margin: 20px 0;
  }

  footer {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    padding: 8px 14px;

    span {
      color: red;
      font-size: $second-font-size;
      margin-top: 10px;
      margin-right: 15px;
    }
  }
}
</style>
