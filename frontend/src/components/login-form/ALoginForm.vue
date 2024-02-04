<script setup lang="ts">
import AButton from '@/components/button/AButton.vue'
import AInput from '@/components/input/AInput.vue'
import ALogoWhite from '../logos/ALogoWhite.vue'
import { computed, ref } from 'vue'
import AModal from '@/components/modal/AModal.vue'

interface Emits {
  /**
   * Returns the mail and password that the user entered
   * @param e The event
   * @param mail The mail that the user entered
   * @param pwd The password that the user entered
   */
  (e: 'login', mail: string, pwd: string): void
}

const emit = defineEmits<Emits>()

const mailValue = ref('')
const pwdValue = ref('')

const showModalForgotPassword = ref(false)

const computedButtonDisabledState = computed(() => {
  return mailValue.value === '' || pwdValue.value === ''
})

const handleLogin = () => {
  emit('login', mailValue.value, pwdValue.value)
}
</script>
<template>
  <div class="a-welcome-form-host">
    <header>
      <section class="logo">
        <ALogoWhite />
      </section>
      <section class="text">
        <p class="caption">Aluco Dashboard</p>
        <p class="lower-caption">erstellt von der THA Gruppe</p>
      </section>
    </header>

    <main>
      <section class="title">Login</section>

      <section class="input">
        <AInput title="E-Mail" v-model:value="mailValue" />
        <AInput type="password" title="Passwort" v-model:value="pwdValue" />
      </section>

      <section class="button">
        <AButton
          @press="handleLogin"
          title="Login"
          primary
          width="400px"
          :disabled="computedButtonDisabledState"
        />
        <AButton
          title="Passwort vergessen?"
          secondary
          width="400px"
          @press="showModalForgotPassword = true"
        />
      </section>
    </main>
  </div>

  <AModal title="Passwort vergessen?" v-if="showModalForgotPassword">
    <template #main>
      Bitte kontaktieren Sie einen Administrator, um Ihr Passwort zurückzusetzen.
    </template>
    <template #buttons>
      <AButton primary title="Ok" @press="showModalForgotPassword = false" />
    </template>
  </AModal>
</template>

<style scoped lang="scss">
@import '@/styles/config.scss';

.a-welcome-form-host {
  display: flex;
  flex-direction: column;
  width: 440px;
  background: $background-white;
  box-shadow: $main-box-shadow;
  border-radius: $outer-border-radius;
  margin: 5% auto auto;

  header {
    height: 150px;
    background: $main-color;
    border-radius: 10px 10px 0 0;
    display: flex;

    .logo {
      width: 140px;
    }

    .caption {
      font-size: 30px;
      text-align: left;
      color: $color-white;
      margin-bottom: 10px;
    }

    .lower-caption {
      font-size: $main-font-size;
      color: $color-white;
      opacity: 0.7;
    }
  }

  main {
    .title {
      font-size: 30px;
      line-height: 125.3%;
      color: $heading-text-light;
      margin-left: 20px;
      margin-top: 20px;
      margin-bottom: 20px;
    }

    .input {
      margin-left: 20px;

      :deep(.a-input-host) {
        margin-bottom: 10px;
      }
    }

    .button {
      margin-left: 20px;
      margin-top: 30px;

      :deep(.a-button-host) {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
