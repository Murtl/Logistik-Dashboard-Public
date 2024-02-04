<script setup lang="ts">
import AButton from '@/components/button/AButton.vue'
import { computed, onBeforeMount, ref, watch } from 'vue'
import type { Ref } from 'vue'
import AOpenEyeIcon from '@/components/icons/AOpenEyeIcon.vue'
import AClosedEyeIcon from '@/components/icons/AClosedEyeIcon.vue'

export interface Props {
  /**
   * The value of the input
   */
  value?: string | number

  /**
   * The title of the input
   */
  title?: string

  /**
   * The type of the input
   */
  type?: string

  /**
   * The placeholder of the input
   */
  placeholder?: string

  /**
   * The width of the input
   */
  width?: string

  /**
   * The height of the input
   */
  height?: string

  /**
   * If the input is disabled
   */
  disabled?: boolean

  /**
   * If the input is valid
   */
  valid?: boolean

  /**
   * The validation message of the input
   */
  validationMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  value: '',
  title: '',
  type: 'text',
  placeholder: '',
  width: '400px',
  height: '50px',
  disabled: false,
  valid: true,
  validationMessage: 'Eingabe ungültig'
})

interface Emits {
  (e: 'update:value', value: string | number | undefined): void
}

const emit = defineEmits<Emits>()

onBeforeMount(() => {
  if (props.value === 0) {
    inputValue.value = undefined
  }
})

const inputValue: Ref<string | number | undefined> = ref(props.value)
const computedWidth = computed(() =>
  props.type === 'password'
    ? `${parseInt(props.width.substring(0, props.width.length - 2)) - 50}px`
    : props.width
)
const inputType = ref(props.type)

const showPassword = () => {
  inputType.value = 'text'
}

const hidePassword = () => {
  inputType.value = 'password'
}

watch(
  () => props.value,
  (newValue) => {
    if (newValue) {
      inputValue.value = newValue
    }
  }
)

watch(inputValue, (newValue) => {
  emit('update:value', newValue)
})
</script>

<template>
  <div class="a-input-host">
    <section v-if="title" class="title">
      {{ title }}
    </section>

    <section class="input-field" :class="{ valid }">
      <input
        :type="inputType"
        class="native-input-element"
        :placeholder="placeholder"
        v-model="inputValue"
        :disabled="disabled"
      />
      <AButton
        v-if="inputType === 'password' && props.type === 'password'"
        width="50px"
        @press="showPassword"
        secondary
        class="button"
      >
        <template #icon>
          <AOpenEyeIcon />
        </template>
      </AButton>
      <AButton
        v-if="inputType === 'text' && props.type === 'password'"
        width="50px"
        @press="hidePassword"
        secondary
        class="button"
      >
        <template #icon>
          <AClosedEyeIcon />
        </template>
      </AButton>
    </section>
    <section v-if="!valid" class="validation-message">
      {{ validationMessage }}
    </section>
  </div>
</template>

<style scoped lang="scss">
@import 'src/styles/config.scss';

.a-input-host {
  display: flex;
  flex-flow: column;

  .title {
    color: $color-grey;
    font-size: $second-font-size;
  }

  .input-field {
    display: flex;
    flex-flow: row;
    background-color: $background-color-light;
    border-radius: $inner-border-radius;
    width: v-bind(width);
    border: 1px solid $tertiary-color;

    &.valid {
      border: none;
    }
  }

  .native-input-element {
    border: none;
    cursor: pointer;
    height: v-bind(height);
    border-radius: 5px;
    font-size: $second-font-size;
    background-color: $background-color-light;
    width: v-bind(computedWidth);
    padding: 8px 14px;
    box-sizing: border-box;
  }

  .native-input-element:focus {
    outline: none;
  }

  .button {
    background-color: $background-color-light;
    align-items: center;
    height: 50px;
    justify-content: center;
    width: 50px;
    margin-bottom: 0;
  }

  .button:hover {
    background-color: $background-color-light;
  }

  .validation-message {
    color: $tertiary-color;
    font-size: 14px;
  }
}
</style>
