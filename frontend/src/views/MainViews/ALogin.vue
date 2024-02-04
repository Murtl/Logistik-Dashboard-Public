<script setup lang="ts">
import ALoginForm from '@/components/login-form/ALoginForm.vue'
import { AAuthService } from '@/services/AAuthService'
import AModal from '@/components/modal/AModal.vue'
import { ref } from 'vue'
import AButton from '@/components/button/AButton.vue'

const showErrorModal = ref(false)
const errorModalText = ref('')

const login = async (mail: string, pwd: string) => {
  const { state, message } = await AAuthService.login(mail, pwd)
  if (!state) {
    showErrorModal.value = true
    errorModalText.value = message
  }
}
</script>

<template>
  <div class="a-login-host">
    <ALoginForm @login="login" />
    <AModal title="Fehler beim Login" v-if="showErrorModal">
      <template #main>
        {{ errorModalText }}
      </template>
      <template #buttons>
        <AButton title="Erneut versuchen" width="200px" @press="showErrorModal = false" primary />
      </template>
    </AModal>
  </div>
</template>
