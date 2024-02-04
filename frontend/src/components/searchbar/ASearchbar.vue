<script setup lang="ts">
import ASearchBarIcon from '@/components/icons/ASearchBarIcon.vue'
import { ref, watch } from 'vue'

interface Props {
  /**
   * The placeholder text of the search bar
   */
  placeholder: string

  /**
   * The width of the search bar
   */
  width?: string
}

withDefaults(defineProps<Props>(), {
  width: '450px'
})

interface Emits {
  /**
   * Returns the new value of the search bar
   * @param e The event
   * @param newValue The new value of the search bar
   */
  (e: 'change', newValue: string): void
}

const emit = defineEmits<Emits>()

const inputValue = ref('')

watch(inputValue, (newValue) => {
  emit('change', newValue)
})
</script>

<template>
  <div class="a-searchbar-host">
    <span class="a-searchbar-icon">
      <ASearchBarIcon />
    </span>
    <input class="native-input" type="text" v-model="inputValue" :placeholder="placeholder" />
  </div>
</template>

<style scoped lang="scss">
@import 'src/styles/config.scss';

.a-searchbar-host {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 10px 14px;
  width: v-bind(width);
  height: 40px;
  gap: 10px;
  border-radius: $inner-border-radius;
  user-select: none;
  background-color: rgba(221, 221, 221, 1);

  .a-searchbar-icon {
    display: flex;
    align-items: center;
  }

  .native-input {
    height: 40px;
    padding: 0;
    border-radius: $inner-border-radius;
    background-color: rgba(221, 221, 221, 1);
    border: none;
    font-size: $second-font-size;
  }

  .native-input:focus {
    outline: none;
  }
}
</style>
