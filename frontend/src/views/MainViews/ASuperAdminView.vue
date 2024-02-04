<script setup lang="ts">
import AListe from '@/components/list/AList.vue'
import ASearchbar from '@/components/searchbar/ASearchbar.vue'
import AButton from '@/components/button/AButton.vue'
import APlusIcon from '@/components/icons/APlusIcon.vue'
import AInput from '@/components/input/AInput.vue'
import AModal from '@/components/modal/AModal.vue'
import { computed, onBeforeMount, ref, watch } from 'vue'
import ALogoutIcon from '@/components/icons/ALogoutIcon.vue'
import ALogoWhiteWithBackground from '@/components/logos/ALogoWhiteWithBackground.vue'
import { AAuthService } from '@/services/AAuthService'
import { ASuperAdminService } from '@/services/ASuperAdminService'
import type { AAdminUser } from '@/utils/types/aAdminUser'
import { checkPasswordValidation } from '@/utils/functions/checkPasswordValidation'

const adminUsers = ref(Array<AAdminUser>())
const filteredUsers = ref(adminUsers.value)

const columnNames = ref([
  {
    key: 'email',
    name: 'E-Mail'
  },
  {
    key: 'shippingCompanyName',
    name: 'Speditionsname'
  },
  {
    key: 'shippingCompanyId',
    name: 'Speditions-ID'
  }
])

const activeUser = ref({ uid: '', email: '', shippingCompanyName: '', shippingCompanyId: '' })
const editedUserEmail = ref('')
const editedUserNewPassword = ref({ password: '', confirmationPassword: '' })
const newUserData = ref({ email: '', shippingCompanyName: '', shippingCompanyId: '' })
const newUserNewPassword = ref({ password: '', confirmationPassword: '' })

const isOpen = ref(false)
const showNewUserModal = ref(false)
const showEditUserModal = ref(false)
const showSafeDeleteModal = ref(false)

const createButtonDisabled = ref(false)
const computedCreateButtonDisabledState = computed(() => {
  return (
    newUserData.value.email === '' ||
    newUserData.value.shippingCompanyName === '' ||
    newUserData.value.shippingCompanyId === '' ||
    newUserNewPassword.value.password === '' ||
    newUserNewPassword.value.confirmationPassword === '' ||
    createButtonDisabled.value
  )
})

const editButtonDisabled = ref(false)

const loading = ref(true)

onBeforeMount(async () => {
  adminUsers.value = await ASuperAdminService.getAdminUsers()
  filteredUsers.value = adminUsers.value
  loading.value = false
})

watch(adminUsers, () => {
  filteredUsers.value = adminUsers.value
})

const logout = async () => {
  await AAuthService.logout()
}

const handleUpdatedFilter = (filter: string) => {
  filteredUsers.value = adminUsers.value.filter((item) => {
    if (item.email.toLowerCase().includes(filter.toLowerCase())) {
      return true
    }
  })
}

const creationValidation = ref({
  email: { valid: true, validationError: 'Bitte eine gültige Email Adresse verwenden' },
  shippingCompanyName: {
    valid: true,
    validationError: 'Bitte eine gültigen Speditionsnamen verwenden'
  },
  shippingCompanyID: { valid: true, validationError: 'Bitte eine gültige Speditions-Id verwenden' },
  password: {
    valid: true,
    validationError:
      'Password muss länger als 8 Zeichen sein und einen Großbuchstaben, einen Kleinbuchstaben, eine Zahl und ein Sonderzeichen beinhalten!'
  },
  confirmationPassword: { valid: true, validationError: 'Passwörter stimmen nicht überein' }
})

const editValidation = ref({
  email: { valid: true, validationError: 'Bitte eine gültige Email Adresse verwenden' },
  shippingCompanyName: {
    valid: true,
    validationError: 'Bitte eine gültigen Speditionsnamen verwenden'
  },
  shippingCompanyID: { valid: true, validationError: 'Bitte eine gültige Speditions-Id verwenden' },
  password: {
    valid: true,
    validationError:
      'Password muss länger als 8 Zeichen sein und einen Großbuchstaben, einen Kleinbuchstaben, eine Zahl und ein Sonderzeichen beinhalten!'
  },
  confirmationPassword: { valid: true, validationError: 'Passwörter stimmen nicht überein' }
})

const handleOpenEditUserModal = (user: AAdminUser) => {
  editedUserEmail.value = user.email
  activeUser.value = Object.create(user)
  editedUserNewPassword.value = { password: '', confirmationPassword: '' }
  editValidation.value.email.valid = true
  editValidation.value.shippingCompanyName.valid = true
  editValidation.value.shippingCompanyID.valid = true
  editValidation.value.confirmationPassword.valid = true
  showEditUserModal.value = true
}

const handleOpenCreateUserModal = () => {
  newUserData.value = {
    email: '',
    shippingCompanyName: '',
    shippingCompanyId: ''
  }
  newUserNewPassword.value = { password: '', confirmationPassword: '' }
  creationValidation.value.email.valid = true
  creationValidation.value.shippingCompanyName.valid = true
  creationValidation.value.shippingCompanyID.valid = true
  creationValidation.value.password.valid = true
  creationValidation.value.confirmationPassword.valid = true
  showNewUserModal.value = true
}

const handleCloseModal = () => {
  showNewUserModal.value = false
  showEditUserModal.value = false
}

const handleCreateUser = async () => {
  if (validateCreationInput()) {
    try {
      createButtonDisabled.value = true
      const newUser = await ASuperAdminService.createAdminUser(
        newUserData.value.email,
        newUserNewPassword.value.password,
        newUserNewPassword.value.confirmationPassword,
        newUserData.value.shippingCompanyId,
        newUserData.value.shippingCompanyName
      )
      adminUsers.value.push({
        uid: newUser.uid,
        email: newUser.email,
        shippingCompanyName: newUser.shippingCompanyName,
        shippingCompanyId: newUser.shippingCompanyId
      })
      createButtonDisabled.value = false
    } catch (e) {
      alert('Fehler beim Erstellen des Benutzers: ' + e)
    }
    handleCloseModal()
  }
}

const handleEditUser = async () => {
  if (
    editedUserNewPassword.value.password === '' &&
    editedUserNewPassword.value.confirmationPassword === '' &&
    editedUserEmail.value === activeUser.value.email
  ) {
    handleCloseModal()
    return
  }

  if (validateEditInput()) {
    try {
      editButtonDisabled.value = true
      await ASuperAdminService.updateAdminUser(
        activeUser.value.uid,
        editedUserEmail.value,
        editedUserNewPassword.value.password,
        editedUserNewPassword.value.confirmationPassword
      )
      adminUsers.value = adminUsers.value.map((user) => {
        if (user.uid === activeUser.value.uid) {
          return { ...user, email: editedUserEmail.value }
        }
        return user
      })
      editButtonDisabled.value = false
    } catch (e) {
      alert('Fehler beim Updaten des Benutzers: ' + e)
    }
    handleCloseModal()
  }
}

const handleDeleteUser = () => {
  showSafeDeleteModal.value = true
}

const handleSafeDeleteUser = async () => {
  const response = await ASuperAdminService.deleteAdminUser(
    activeUser.value.uid,
    activeUser.value.shippingCompanyId
  )
  if (response.state) {
    showEditUserModal.value = false
    showSafeDeleteModal.value = false
    adminUsers.value = adminUsers.value.filter((user) => user.uid !== activeUser.value.uid)
  } else {
    alert('Fehler beim Löschen des Benutzers: ' + response.message)
  }
}

const validateEditInput = () => {
  editValidation.value.email.valid = false
  editValidation.value.confirmationPassword.valid = false
  editValidation.value.password.valid = false

  if (
    editedUserEmail.value &&
    editedUserEmail.value !== '' &&
    editedUserEmail.value.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
  ) {
    editValidation.value.email.valid = true
  }

  if (
    editedUserNewPassword.value.password &&
    editedUserNewPassword.value.password !== '' &&
    checkPasswordValidation(editedUserNewPassword.value.password)
  ) {
    editValidation.value.password.valid = true
  }

  if (!editedUserNewPassword.value.password) {
    editValidation.value.password.valid = true
  }

  if (editedUserNewPassword.value.password === editedUserNewPassword.value.confirmationPassword) {
    editValidation.value.confirmationPassword.valid = true
  }

  return (
    editValidation.value.email.valid &&
    editValidation.value.confirmationPassword.valid &&
    editValidation.value.password.valid
  )
}

const validateCreationInput = () => {
  creationValidation.value.email.valid = true
  creationValidation.value.shippingCompanyName.valid = true
  creationValidation.value.shippingCompanyID.valid = true
  creationValidation.value.password.valid = true
  creationValidation.value.confirmationPassword.valid = true

  if (
    !newUserData.value.email ||
    newUserData.value.email === '' ||
    !newUserData.value.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
  ) {
    creationValidation.value.email.valid = false
  }
  if (!newUserData.value.shippingCompanyName || newUserData.value.shippingCompanyName === '') {
    creationValidation.value.shippingCompanyName.valid = false
  }
  if (!newUserData.value.shippingCompanyId || newUserData.value.shippingCompanyId === '') {
    creationValidation.value.shippingCompanyID.valid = false
  }
  if (!newUserNewPassword.value.password || newUserNewPassword.value.password === '') {
    creationValidation.value.password.valid = false
  }
  if (newUserNewPassword.value.password !== newUserNewPassword.value.confirmationPassword) {
    creationValidation.value.confirmationPassword.valid = false
  }

  if (!checkPasswordValidation(newUserNewPassword.value.password)) {
    creationValidation.value.password.valid = false
  }
  return (
    creationValidation.value.email.valid &&
    creationValidation.value.shippingCompanyName.valid &&
    creationValidation.value.shippingCompanyID.valid &&
    creationValidation.value.password.valid &&
    creationValidation.value.confirmationPassword.valid
  )
}
</script>

<template>
  <div class="a-superadmin-view-host">
    <header>
      <section class="title">
        <ALogoWhiteWithBackground />
        Aluco
      </section>
      <section class="nav">Superadmin Ansicht</section>
      <section class="avatar">
        <AButton class="avatar-button" primary title="AL" width="40px" @press="isOpen = !isOpen" />
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

    <div class="loader" v-if="loading"></div>

    <main v-else>
      <div class="a-user-management-container">
        <div class="a-user-management-header">
          <ASearchbar
            placeholder="Benutzer suchen..."
            @change="handleUpdatedFilter"
            width="480px"
          />
          <AButton
            title="Benutzer hinzufügen"
            primary
            width="250px"
            @press="handleOpenCreateUserModal"
          >
            <template #icon>
              <APlusIcon />
            </template>
          </AButton>
        </div>
        <AListe
          :column-names="columnNames"
          :list="filteredUsers"
          editable
          @edit="handleOpenEditUserModal"
        />
      </div>

      <AModal v-if="showNewUserModal" title="Benutzer hinzufügen" grid>
        <template #main>
          <AInput
            title="E-Mail"
            v-model:value="newUserData.email"
            :valid="creationValidation.email.valid"
            :validation-message="creationValidation.email.validationError"
          />
          <AInput
            title="Spedition"
            v-model:value="newUserData.shippingCompanyName"
            :valid="creationValidation.shippingCompanyName.valid"
            :validation-message="creationValidation.shippingCompanyName.validationError"
          />
          <AInput
            title="Speditions-Id"
            v-model:value="newUserData.shippingCompanyId"
            :valid="creationValidation.shippingCompanyID.valid"
            :validation-message="creationValidation.shippingCompanyID.validationError"
          />
          <AInput
            title="Passwort"
            type="password"
            v-model:value="newUserNewPassword.password"
            :valid="creationValidation.password.valid"
            :validation-message="creationValidation.password.validationError"
          />
          <AInput
            title="Passwort bestätigen"
            type="password"
            v-model:value="newUserNewPassword.confirmationPassword"
            :valid="creationValidation.confirmationPassword.valid"
            :validation-message="creationValidation.confirmationPassword.validationError"
          />
        </template>
        <template #buttons>
          <AButton title="Abbrechen" width="120px" @press="handleCloseModal" />
          <AButton
            title="Speichern"
            width="120px"
            @press="handleCreateUser"
            primary
            :disabled="computedCreateButtonDisabledState"
          />
        </template>
      </AModal>

      <AModal v-if="showEditUserModal" title="Benutzer bearbeiten" grid>
        <template #main>
          <AInput
            title="E-Mail"
            v-model:value="editedUserEmail"
            :valid="editValidation.email.valid"
            :validation-message="editValidation.email.validationError"
          />
          <AInput
            title="Neues Passwort"
            type="password"
            v-model:value="editedUserNewPassword.password"
            :valid="editValidation.password.valid"
            :validation-message="editValidation.password.validationError"
          />
          <AInput
            title="Neues Passwort bestätigen"
            type="password"
            v-model:value="editedUserNewPassword.confirmationPassword"
            :valid="editValidation.confirmationPassword.valid"
            :validation-message="editValidation.confirmationPassword.validationError"
          />
        </template>
        <template #deleteButton>
          <AButton title="Löschen..." width="120px" tertiary @press="handleDeleteUser" />
        </template>
        <template #buttons>
          <AButton title="Abbrechen" width="120px" @press="handleCloseModal" />
          <AButton
            title="Speichern"
            width="120px"
            @press="handleEditUser"
            primary
            :disabled="editButtonDisabled"
          />
        </template>
      </AModal>
      <AModal v-if="showSafeDeleteModal" title="Benutzer wirklich löschen?">
        <template #buttons>
          <AButton title="Abbrechen" width="120px" @press="showSafeDeleteModal = false" />
          <AButton title="Löschen" width="120px" @press="handleSafeDeleteUser" tertiary />
        </template>
      </AModal>
    </main>
  </div>
</template>

<style scoped lang="scss">
@import 'src/styles/config.scss';

.a-superadmin-view-host {
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
      font-weight: bold;
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
          border-radius: 5px;
        }
        .flyout-button {
          margin-top: 105px;
          right: 0;
          position: absolute;

          :deep(.a-button-host) {
            margin-right: 0;
          }
        }
      }
    }
  }

  main {
    display: flex;
    flex-direction: row;
    justify-content: center;
    height: calc(100vh - 50px);
    width: 100%;
    box-sizing: border-box;
    padding: 20px 0 20px 0;

    .a-user-management-container {
      display: flex;
      flex-direction: column;
      background-color: white;
      width: fit-content;
      height: fit-content;
      padding: 20px 50px 20px 50px;
      border-radius: $big-border-radius;

      .a-user-management-header {
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 20px;
        align-items: center;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
