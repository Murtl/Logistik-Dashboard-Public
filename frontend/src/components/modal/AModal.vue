<script setup lang="ts">
interface Props {
  /**
   * The title of the modal
   */
  title: string

  /**
   * Whether the main part of the modal should be a grid
   */
  grid?: boolean
}

withDefaults(defineProps<Props>(), {
  grid: false
})
</script>

<template>
  <Teleport to="#modal-container">
    <div class="shadowbox"></div>
    <div class="at-modal-host">
      <header>
        {{ title }}
      </header>

      <main :class="{ grid }">
        <slot name="main"></slot>
      </main>

      <footer>
        <span>
          <slot name="deleteButton"></slot>
        </span>
        <span class="buttons">
          <slot name="buttons"></slot>
        </span>
      </footer>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
@import '@/styles/config.scss';

.shadowbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: $color-black;
  opacity: 0.5;
  z-index: 2;
}

.at-modal-host {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: $background-white;
  box-shadow: $main-box-shadow;
  border-radius: $outer-border-radius;
  z-index: 2;

  header {
    font-weight: bold;
    font-size: 25px;
    font-family: $main-font-family;
    color: $heading-text-light;
    padding: 20px 20px 10px 20px;
  }

  main {
    padding: 20px;

    &.grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }
  }

  footer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    background-color: #f3f5f7;
    padding: 15px 20px 10px 20px;
    border-radius: 0 0 10px 10px;

    .buttons {
      display: flex;
      justify-content: flex-end;
      gap: 20px;
    }
  }
}
</style>
