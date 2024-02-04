<script setup lang="ts">
import AListe from '@/components/list/AList.vue'
import ASearchbar from '@/components/searchbar/ASearchbar.vue'
import AButton from '@/components/button/AButton.vue'
import APlusIcon from '@/components/icons/APlusIcon.vue'
import AInput from '@/components/input/AInput.vue'
import AModal from '@/components/modal/AModal.vue'
import { computed, onBeforeMount, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { useUserDataStore } from '@/stores/userDataStore'
import { storeToRefs } from 'pinia'
import { AUser } from '@/utils/classes/AUser'
import { APermissions } from '@/utils/classes/APermissions'
import ADropdown from '@/components/dropdown/ADropdown.vue'
import { useAuthStore } from '@/stores/authStore'
import { checkPasswordValidation } from '@/utils/functions/checkPasswordValidation'
import { router } from '@/router'

const userDataStore = useUserDataStore()
const { users } = storeToRefs(userDataStore)

const authStore = useAuthStore()
const { aUser } = storeToRefs(authStore)

const loading = ref(true)

onBeforeMount(async () => {
  if (!aUser.value.permissions.userManagement) {
    router.push('/dashboard')
    return
  }

  await userDataStore.fetchUsers(aUser.value.shippingCompanyId)
  loading.value = false
})

watch(users, () => {
  filteredUsers.value = users.value
})

const filteredUsers: Ref<AUser[]> = ref(users.value)
watch(users, () => {
  filteredUsers.value = users.value
})
const handleUpdatedFilter = (filter: string) => {
  filteredUsers.value = (users.value as AUser[]).filter((user: AUser) => {
    return user.email.toLowerCase().includes(filter.toLowerCase())
  })
}

const ColumnNames = ref([
  { key: 'email', name: 'E-Mail' },
  { key: 'permissions', name: 'Rechte' }
])

const activeUser = ref(new AUser('', new APermissions(false, false, false), '', '', ''))
const editedUser = ref(new AUser('', new APermissions(false, false, false), '', '', ''))
const editedUserNewPassword = ref({ password: '', confirmationPassword: '' })
const newUserData = ref(new AUser('', new APermissions(false, false, false), '', '', ''))
const newUserNewPassword = ref({ password: '', confirmationPassword: '' })

const showNewUserModal = ref(false)
const showEditUserModal = ref(false)
const showSafeDeleteModal = ref(false)

const creationValidation = ref({
  email: { valid: true, validationError: 'Bitte eine gültige Email Adresse verwenden' },
  permissions: { valid: true, validationError: 'Bitte mindestens ein Recht vergeben' },
  password: {
    valid: true,
    validationError:
      'Passwort muss mindestens 8 Zeichen lang sein und mindestens einen Großbuchstaben, einen Kleinbuchstaben, eine Zahl und ein Sonderzeichen enthalten'
  },
  confirmationPassword: { valid: true, validationError: 'Passwörter stimmen nicht überein' }
})

const editValidation = ref({
  email: { valid: true, validationError: 'Bitte eine gültige Email Adresse verwenden' },
  permissions: { valid: true, validationError: 'Bitte mindestens ein Recht vergeben' },
  password: {
    valid: true,
    validationError:
      'Passwort muss mindestens 8 Zeichen lang sein und mindestens einen Großbuchstaben, einen Kleinbuchstaben, eine Zahl und ein Sonderzeichen enthalten'
  },
  confirmationPassword: { valid: true, validationError: 'Passwörter stimmen nicht überein' }
})

const createButtonDisabled = ref(false)
const computedCreateButtonDisabledState = computed(() => {
  return (
    newUserData.value.email === '' ||
    newUserData.value.permissions.toLocaleString() === '' ||
    newUserNewPassword.value.password === '' ||
    newUserNewPassword.value.confirmationPassword === '' ||
    createButtonDisabled.value
  )
})

const editButtonDisabled = ref(false)

const handleOpenEditUserModal = (user: AUser) => {
  editedUser.value = new AUser(
    user.email,
    new APermissions(
      user.permissions.userManagement,
      user.permissions.resourceManagement,
      user.permissions.dashboard
    ),
    user.shippingCompanyId,
    user.shippingCompanyName,
    user.uid
  )
  editedUserNewPassword.value = { password: '', confirmationPassword: '' }
  activeUser.value = new AUser(
    user.email,
    new APermissions(
      user.permissions.userManagement,
      user.permissions.resourceManagement,
      user.permissions.dashboard
    ),
    user.shippingCompanyId,
    user.shippingCompanyName,
    user.uid
  )
  editValidation.value.permissions.valid = true
  editValidation.value.email.valid = true
  editValidation.value.confirmationPassword.valid = true
  showEditUserModal.value = true
}

const handleOpenCreateUserModal = () => {
  newUserData.value = new AUser(
    '',
    new APermissions(false, false, false),
    aUser.value.shippingCompanyId,
    aUser.value.shippingCompanyName
  )
  newUserNewPassword.value = { password: '', confirmationPassword: '' }
  creationValidation.value.permissions.valid = true
  creationValidation.value.email.valid = true
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
    createButtonDisabled.value = true
    const response = await userDataStore.addUser(
      aUser.value.shippingCompanyId,
      newUserData.value,
      newUserNewPassword.value.password
    )

    if (response.state) {
      showNewUserModal.value = false
    } else {
      alert('Fehler beim Erstellen des Benutzers: ' + response.message)
    }
    createButtonDisabled.value = false
  }
}

const handleEditUser = async () => {
  if (
    activeUser.value.email === editedUser.value.email &&
    activeUser.value.permissions.toLocaleString() ===
      editedUser.value.permissions.toLocaleString() &&
    editedUserNewPassword.value.password === '' &&
    editedUserNewPassword.value.confirmationPassword === ''
  ) {
    handleCloseModal()
    return
  }

  if (validateEditInput()) {
    editButtonDisabled.value = true
    const response = await userDataStore.updateUser(
      aUser.value.shippingCompanyId,
      activeUser.value,
      editedUser.value,
      editedUserNewPassword.value.password
    )
    if (response.state) {
      showEditUserModal.value = false
    } else {
      alert('Fehler beim Updaten des Benutzers: ' + response.message)
    }
    editButtonDisabled.value = false
  }
}

const handleDeleteUser = () => {
  showSafeDeleteModal.value = true
}

const handleSafeDeleteUser = async () => {
  const response = await userDataStore.deleteUser(
    aUser.value.shippingCompanyId,
    activeUser.value.uid!
  )
  if (response.state) {
    showEditUserModal.value = false
    showSafeDeleteModal.value = false
  } else {
    alert('Fehler beim Löschen des Benutzers: ' + response.message)
  }
}

const validateEditInput = () => {
  editValidation.value.email.valid = true
  editValidation.value.permissions.valid = true
  editValidation.value.password.valid = true
  editValidation.value.confirmationPassword.valid = true

  if (
    !editedUser.value.email ||
    editedUser.value.email === '' ||
    !editedUser.value.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
  ) {
    editValidation.value.email.valid = false
  }
  if (!editedUser.value.permissions.resourceManagement && !editedUser.value.permissions.dashboard) {
    editValidation.value.permissions.valid = false
  }
  if (
    editedUserNewPassword.value.password !== '' &&
    !checkPasswordValidation(editedUserNewPassword.value.password)
  ) {
    editValidation.value.password.valid = false
  }
  if (editedUserNewPassword.value.password !== editedUserNewPassword.value.confirmationPassword) {
    editValidation.value.confirmationPassword.valid = false
  }
  return (
    editValidation.value.email.valid &&
    editValidation.value.permissions.valid &&
    editValidation.value.password.valid &&
    editValidation.value.confirmationPassword.valid
  )
}

const validateCreationInput = () => {
  creationValidation.value.email.valid = true
  creationValidation.value.permissions.valid = true
  creationValidation.value.password.valid = true
  creationValidation.value.confirmationPassword.valid = true

  if (
    !newUserData.value.email ||
    newUserData.value.email === '' ||
    !newUserData.value.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
  ) {
    creationValidation.value.email.valid = false
  }
  if (
    !newUserData.value.permissions.resourceManagement &&
    !newUserData.value.permissions.dashboard
  ) {
    creationValidation.value.permissions.valid = false
  }
  if (!checkPasswordValidation(newUserNewPassword.value.password)) {
    creationValidation.value.password.valid = false
  }
  if (newUserNewPassword.value.password !== newUserNewPassword.value.confirmationPassword) {
    creationValidation.value.confirmationPassword.valid = false
  }
  return (
    creationValidation.value.email.valid &&
    creationValidation.value.permissions.valid &&
    creationValidation.value.password.valid &&
    creationValidation.value.confirmationPassword.valid
  )
}
</script>

<template>
  <div class="loader" v-if="loading"></div>
  <div class="a-user-management-host" v-else>
    <div class="a-user-management-container">
      <div class="a-user-management-header">
        <ASearchbar placeholder="Benutzer suchen..." @change="handleUpdatedFilter" width="480px" />
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
        :column-names="ColumnNames"
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
        <ADropdown
          title="Rechte"
          :text="newUserData.permissions.toLocaleString()"
          placeholder="Rechte auswählen ..."
          :valid="creationValidation.permissions.valid"
          :validation-message="creationValidation.permissions.validationError"
        >
          <template #optionList>
            <div>
              <input id="dashboard" type="checkbox" v-model="newUserData.permissions.dashboard" />
              <label for="dashboard"> Dashboard</label>
            </div>
            <div>
              <input
                id="resourceManagement"
                type="checkbox"
                v-model="newUserData.permissions.resourceManagement"
              />
              <label for="resourceManagement"> Stammdatenpflege</label>
            </div>
          </template>
        </ADropdown>
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
          v-model:value="editedUser.email"
          :valid="editValidation.email.valid"
          :validation-message="editValidation.email.validationError"
        />
        <ADropdown
          title="Rechte"
          :text="editedUser.permissions.toLocaleString()"
          placeholder="Rechte auswählen"
          :valid="editValidation.permissions.valid"
          :validation-message="editValidation.permissions.validationError"
          :disabled="editedUser.permissions.userManagement"
        >
          <template #optionList>
            <div>
              <input id="dashboard" type="checkbox" v-model="editedUser.permissions.dashboard" />
              <label for="dashboard"> Dashboard</label>
            </div>
            <div>
              <input
                id="resourceManagement"
                type="checkbox"
                v-model="editedUser.permissions.resourceManagement"
              />
              <label for="resourceManagement"> Stammdatenverwaltung</label>
            </div>
          </template>
        </ADropdown>
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
      <template #deleteButton v-if="!activeUser.permissions.userManagement">
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
  </div>
</template>

<style scoped lang="scss">
@import 'src/styles/config.scss';

.a-user-management-host {
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

.a-user-management-permissions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;

  .a-user-management-permissions-title {
    color: $color-grey;
    font-size: $second-font-size;
  }

  .a-user-management-permissions-checkboxes {
    display: flex;
    flex-direction: row;
    gap: 10px;
  }
}
</style>
