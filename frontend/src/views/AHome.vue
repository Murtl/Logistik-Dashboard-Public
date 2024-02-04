<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AButton from '@/components/button/AButton.vue'
import AGridBigIcon from '@/components/icons/AGridBigIcon.vue'
import AGroupIcon from '@/components/icons/AGroupIcon.vue'
import ADatabaseIcon from '@/components/icons/ADatabaseIcon.vue'
import ALogoWhiteWithBackground from '@/components/logos/ALogoWhiteWithBackground.vue'
import { ref } from 'vue'
import { AAuthService } from '@/services/AAuthService'
import ALogoutIcon from '@/components/icons/ALogoutIcon.vue'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { aUser } = storeToRefs(authStore)

const isOpen = ref(false)

const logout = async () => {
  await AAuthService.logout()
}
</script>

<template>
  <header>
    <section class="title">
      <ALogoWhiteWithBackground />
      Aluco
    </section>
    <section class="nav">
      <RouterLink to="/dashboard" v-if="aUser.permissions.dashboard">
        <div class="icon"><AGridBigIcon /></div>
        <div class="text">Dashboard</div>
      </RouterLink>
      <RouterLink to="/user-management" v-if="aUser.permissions.userManagement">
        <div class="icon"><AGroupIcon /></div>
        <div class="text">Benutzerverwaltung</div>
      </RouterLink>
      <RouterLink to="/master-data-maintenance" v-if="aUser.permissions.resourceManagement">
        <div class="icon"><ADatabaseIcon /></div>
        <div class="text">Stammdatenpflege</div>
      </RouterLink>
    </section>
    <section class="avatar">
      {{ aUser.shippingCompanyName }}
      <AButton
        class="avatar-button"
        primary
        :title="aUser.email.slice(0, 2).toUpperCase()"
        width="40px"
        @press="isOpen = !isOpen"
      />
      <section v-if="isOpen" class="flyout">
        <div class="flyout-arrow"></div>
        <div class="flyout-button">
          <AButton title="logout" width="100px" quaternary @press="logout">
            <template #icon>
              <ALogoutIcon />
            </template>
          </AButton>
        </div>
      </section>
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
  justify-content: space-between;
  background-color: $background-white;

  .title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: bold;
    font-size: $main-font-size;
    margin-left: 10px;
    color: $heading-text-light;
  }

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

  .avatar {
    width: 215px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;

    :deep(.a-button-host) {
      border-radius: 50px;
      margin: 5px 10px 5px 5px;
      font-size: $second-font-size;
    }

    .avatar-button {
      z-index: 1;
    }

    .flyout {
      height: 150px;
      width: 160px;
      position: absolute;

      .flyout-arrow {
        position: absolute;
        background-color: white;
        width: 35px;
        height: 35px;
        right: 11px;
        margin-top: 103px;
        transform: rotate(45deg);
        border-radius: $inner-border-radius;
      }
      .flyout-button {
        margin-top: 105px;
        right: 0;
        position: absolute;

        :deep(.a-button-host) {
          margin: 0;
        }
      }
    }
  }
}
</style>
