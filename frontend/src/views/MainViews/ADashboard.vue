<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { onBeforeMount } from 'vue'
import { router } from '@/router'
import ADashboardIcon from '@/components/icons/ADashboardIcon.vue'
import ADiagramIcon from '@/components/icons/ADiagramIcon.vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const { aUser } = storeToRefs(authStore)

onBeforeMount(() => {
  if (!aUser.value.permissions.dashboard) {
    router.push('/master-data-maintenance')
    return
  }
  router.push('/dashboard/key-figures')
})
</script>

<template>
  <header>
    <section class="nav">
      <RouterLink to="/dashboard/key-figures">
        <div class="icon"><ADiagramIcon /></div>
        <div class="text">Kennzahlen</div>
      </RouterLink>
      <RouterLink to="/dashboard/tour-data">
        <div class="icon"><ADashboardIcon /></div>
        <div class="text">Tourendaten</div>
      </RouterLink>
    </section>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped lang="scss">
@import 'src/styles/config.scss';

header {
  display: flex;
  flex-flow: row;
  justify-content: center;
  background-color: $background-grey-color;
  height: 50px;

  .nav {
    display: flex;
    align-items: center;
    font-size: 17px;

    a {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-flow: row;
      padding: 8px;
      text-decoration: none;
      color: $heading-text-light;

      .icon {
        margin-right: 5px;
        position: relative;
        top: 4px;
      }

      &.router-link-active {
        color: $main-color;
        background-color: $main-color-hover;
      }
    }

    a:hover {
      background-color: $main-color-hover;
    }
  }
}
</style>
