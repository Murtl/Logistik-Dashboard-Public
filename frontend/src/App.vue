<script setup lang="ts">
import { storeToRefs } from 'pinia'
import ALogin from '@/views/MainViews/ALogin.vue'
import AHome from '@/views/AHome.vue'
import ASuperAdminView from '@/views/MainViews/ASuperAdminView.vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const { loggedIn, isSuperadmin, loading } = storeToRefs(authStore)
</script>

<template>
  <div class="loader" v-if="loading"></div>
  <div v-else>
    <div v-if="loggedIn">
      <ASuperAdminView v-if="isSuperadmin" />
      <AHome v-else />
    </div>
    <ALogin v-else />
  </div>
</template>

<style lang="scss">
@import '@/styles/config.scss';

body {
  background-color: $background-body-color;
  margin: 0;
  font-family: $main-font-family;
  user-select: none;
}

.loader {
  border: 10px solid white;
  border-top: 10px solid black;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1.5s linear infinite;
  margin: 10% auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
