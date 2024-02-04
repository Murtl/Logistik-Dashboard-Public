<script setup lang="ts">
interface Props {
  /**
   * The title of the button
   */
  title?: string

  /**
   * The width of the button
   */
  width?: string

  /**
   * Whether the button is disabled
   */
  disabled?: boolean

  /**
   * Whether the button is primary
   */
  primary?: boolean

  /**
   * Whether the button is secondary
   */
  secondary?: boolean

  /**
   * Whether the button is tertiary
   */
  tertiary?: boolean

  /**
   * Whether the button is quaternary
   */
  quaternary?: boolean
}

withDefaults(defineProps<Props>(), {
  title: '',
  width: '150px',
  disabled: false,
  primary: false,
  secondary: false,
  tertiary: false,
  quaternary: false
})

interface Emits {
  /**
   * Emitted when the button is pressed
   * @param e The event
   */
  (e: 'press'): void
}

const emit = defineEmits<Emits>()
</script>

<template>
  <button
    class="a-button-host"
    :class="{ primary, secondary, tertiary, quaternary, disabled }"
    @click="emit('press')"
    :disabled="disabled"
  >
    <slot name="icon"></slot>
    {{ title }}
  </button>
</template>

<style scoped lang="scss">
@import '@/styles/config.scss';

.a-button-host {
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 14px;
  gap: 4px;
  height: 40px;
  width: v-bind(width);
  font-family: $main-font-family;
  font-size: $second-font-size;
  border-radius: $inner-border-radius;
  user-select: none;
  cursor: pointer;
  color: $color-black;
  background-color: $background-white;

  &.primary {
    color: $color-white;
    background-color: $main-color;
  }

  &.secondary {
    background-color: $background-secondary-color;
    color: $secondary-color;
  }

  &.tertiary {
    background-color: $background-tertiary-color;
    color: $tertiary-color;
  }

  &.disabled {
    background-color: $background-color-disabled;
    color: $color-disabled;
    cursor: unset;
  }
}

.a-button-host:hover {
  background-color: $background-white-hover;

  &.primary {
    background-color: $main-color-hover;
  }

  &.secondary {
    background-color: $background-secondary-color-hover;
  }

  &.tertiary {
    color: $color-white;
    background-color: $background-tertiary-color-hover;
  }

  &.quaternary {
    background-color: $color-white;
  }

  &.disabled {
    background-color: $background-color-disabled;
    color: $color-disabled;
    cursor: unset;
  }
}
</style>
