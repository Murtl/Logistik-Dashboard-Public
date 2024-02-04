<script setup lang="ts">
import { ref } from 'vue'
import AButton from '@/components/button/AButton.vue'
import AChevronDownIcon from '@/components/icons/AChevronDownIcon.vue'
import AChevronUpIcon from '@/components/icons/AChevronUpIcon.vue'

interface Props {
  /**
   * The text of the dropdown
   */
  text?: string

  /**
   * The title of the dropdown
   */
  title?: string

  /**
   * The placeholder of the dropdown
   */
  placeholder?: string

  /**
   * The width of the dropdown
   */
  width?: string

  /**
   * The height of the dropdown
   */
  height?: string

  /**
   * The validation state of the dropdown
   */
  valid?: boolean

  /**
   * The validation message of the dropdown
   */
  validationMessage?: string

  /**
   * The disabled state of the dropdown
   */
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  text: '',
  title: '',
  placeholder: '',
  width: '400px',
  height: '50px',
  valid: true,
  validationMessage: 'Eingabe ungültig',
  disabled: false
})

const dropdownVisible = ref(false)

const toggleDropdown = () => {
  dropdownVisible.value = !dropdownVisible.value
}
</script>
<template>
  <div class="a-dropdown-host">
    <section v-if="title" class="title">
      {{ title }}
    </section>
    <section class="dropdown-header" :class="{ valid, disabled }">
      <span>{{ text !== '' ? text : placeholder }}</span>
      <AButton width="50px" secondary class="button" @press="toggleDropdown" v-if="!disabled">
        <template #icon>
          <AChevronDownIcon v-if="!dropdownVisible" />
          <AChevronUpIcon v-else />
        </template>
      </AButton>
    </section>
    <section class="dropdown-list" :class="{ dropdownVisible }">
      <slot name="optionList"> </slot>
    </section>

    <section v-if="!valid" class="validation-message">
      {{ validationMessage }}
    </section>
  </div>
</template>

<style scoped lang="scss">
@import 'src/styles/config.scss';

.a-dropdown-host {
  display: flex;
  flex-direction: column;

  .title {
    color: $color-grey;
    font-size: $second-font-size;
  }

  .dropdown-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: $background-color-light;
    width: v-bind(width);
    border-radius: $inner-border-radius;
    border: 1px solid $tertiary-color;
    box-sizing: border-box;
    padding-left: 15px;

    &.valid {
      border: none;
    }

    .button {
      background-color: $background-color-light;
      align-items: center;
      height: 50px;
      justify-content: center;
      width: 50px;
      margin-bottom: 0;
    }

    &.disabled {
      color: gray;
    }
  }
  .dropdown-list {
    background-color: $background-color-light;
    display: none;
    position: absolute;
    width: v-bind(width);

    &.dropdownVisible {
      gap: 10px;
      display: flex;
      flex-direction: column;
      align-content: space-between;
      border-radius: 5px;
      padding: 15px;
      transform: translateY(70px);
      box-sizing: border-box;
      border: 1px solid $color-grey;
    }
  }
  .validation-message {
    color: $tertiary-color;
    font-size: 14px;
  }
}
</style>
