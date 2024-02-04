<script setup lang="ts">
import { AResource } from '@/utils/classes/AResource'
import AInput from '@/components/input/AInput.vue'
import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import { ACostTypes } from '@/utils/interfaces/ACostTypes'
import ATrashIcon from '@/components/icons/ATrashIcon.vue'
import AModal from '@/components/modal/AModal.vue'
import AButton from '@/components/button/AButton.vue'

interface Props {
  /**
   * The resources to be displayed
   */
  resources: AResource[]

  /**
   * Whether the resources are valid
   */
  valid: boolean[]
}

const props = defineProps<Props>()

interface Emits {
  /**
   * Returns the updated resources
   * @param e The event
   * @param resources The updated resources
   */
  (e: 'update', resources: AResource[]): void
}

const emit = defineEmits<Emits>()

const editedResources: Ref<AResource[]> = ref(JSON.parse(JSON.stringify(props.resources)))
watch(
  editedResources,
  () => {
    emit('update', editedResources.value)
  },
  { deep: true }
)

watch(
  () => props.resources,
  (newValue) => {
    if (newValue) {
      editedResources.value = JSON.parse(JSON.stringify(newValue))
    }
  }
)

watch(
  () => props.valid,
  (newValue) => {
    if (newValue) {
      rerenderErrors()
    }
  }
)

const handleToggleVisibility = (type: string) => {
  const element = document.getElementById(type)
  element?.classList.toggle('open')
  rerenderHeaders()
}

const checkForOpenClass = (type: string) => {
  const element = document.getElementById(type)
  if (element) {
    return element.classList.contains('open')
  } else {
    return false
  }
}

const headerKey = ref(0)
const errorKey = ref(0)

const rerenderHeaders = () => {
  headerKey.value++
}

const rerenderErrors = () => {
  errorKey.value++
}

const showDeleteModal = ref(false)
const deleteIndex = ref(0)

const handleOpenDeleteModal = (index: number) => {
  deleteIndex.value = index
  showDeleteModal.value = true
}
const handleDeleteRessource = () => {
  editedResources.value.splice(deleteIndex.value, 1)
  showDeleteModal.value = false
}

const showAddModal = ref(false)
const newResource = ref(new AResource('', ACostTypes.fixed, 0, 0, 0, 0, 0, 0))
const creationValidation = ref({
  type: { valid: true, validationError: 'Bitte ausfüllen' },
  cost: { valid: true, validationError: 'Bitte ausfüllen' },
  co2PerKM: { valid: true, validationError: 'Bitte ausfüllen' },
  loadingVolume: { valid: true, validationError: 'Bitte ausfüllen' },
  maxStoringPositions: { valid: true, validationError: 'Bitte ausfüllen' },
  loadingMeter: { valid: true, validationError: 'Bitte ausfüllen' },
  payload: { valid: true, validationError: 'Bitte ausfüllen' }
})

const handleOpenAddModal = () => {
  newResource.value = new AResource('', ACostTypes.fixed, 0, 0, 0, 0, 0, 0)
  creationValidation.value = {
    type: { valid: true, validationError: 'Bitte ausfüllen' },
    cost: { valid: true, validationError: 'Bitte ausfüllen' },
    co2PerKM: { valid: true, validationError: 'Bitte ausfüllen' },
    loadingVolume: { valid: true, validationError: 'Bitte ausfüllen' },
    maxStoringPositions: { valid: true, validationError: 'Bitte ausfüllen' },
    loadingMeter: { valid: true, validationError: 'Bitte ausfüllen' },
    payload: { valid: true, validationError: 'Bitte ausfüllen' }
  }
  showAddModal.value = true
}
const handleAddRessource = () => {
  if (validateResourceInput()) {
    editedResources.value.push(newResource.value)
    showAddModal.value = false
  }
}

const validateResourceInput = () => {
  if (newResource.value.type === '') {
    creationValidation.value.type.valid = false
    creationValidation.value.type.validationError = 'Bitte ausfüllen'
  } else if (checkForExistingType(newResource.value.type)) {
    creationValidation.value.type.valid = false
    creationValidation.value.type.validationError = 'Name bereits vergeben'
  } else {
    creationValidation.value.type.valid = true
  }
  creationValidation.value.cost.valid = !!newResource.value.cost
  creationValidation.value.co2PerKM.valid = !!newResource.value.co2PerKm
  creationValidation.value.loadingVolume.valid = !!newResource.value.loadingVolume
  creationValidation.value.maxStoringPositions.valid = !!newResource.value.maxStoringPositions
  creationValidation.value.loadingMeter.valid = !!newResource.value.loadingMeter
  creationValidation.value.payload.valid = !!newResource.value.payload

  return (
    creationValidation.value.type.valid &&
    creationValidation.value.cost.valid &&
    creationValidation.value.co2PerKM.valid &&
    creationValidation.value.loadingVolume.valid &&
    creationValidation.value.maxStoringPositions.valid &&
    creationValidation.value.loadingMeter.valid &&
    creationValidation.value.payload.valid
  )
}

const checkForExistingType = (type: string) => {
  return editedResources.value.some((resource) => resource.type === type)
}

const handleCloseModal = () => {
  showDeleteModal.value = false
  showAddModal.value = false
}
</script>

<template>
  <div class="a-resource-list-host">
    <div
      class="resource-list"
      v-for="(row, rowIndex) in editedResources"
      v-bind:key="editedResources[rowIndex].type"
    >
      <section class="resource-header">
        <div
          class="resource-header-text"
          @click="handleToggleVisibility(row.type)"
          v-bind:key="headerKey"
        >
          {{ row.type }}
          <span v-if="checkForOpenClass(row.type)">˄</span><span v-else>˅</span>
        </div>
        <ATrashIcon class="resource-header-delete" @click="handleOpenDeleteModal(rowIndex)" />
      </section>
      <section class="resource-info" :id="row.type">
        <div class="select-cell">
          <span class="title">Kostenart</span>
          <select v-model="row.costType">
            <option :value="ACostTypes.fixed">{{ ACostTypes.fixed }}</option>
            <option :value="ACostTypes.variable">{{ ACostTypes.variable }}</option>
          </select>
        </div>
        <div class="input-cell">
          <AInput
            v-model:value="row.cost"
            type="number"
            width="200px"
            height="30px"
            title="Unterhaltungskosten"
          />
        </div>
        <div class="input-cell">
          <AInput
            v-model:value="row.co2PerKm"
            type="number"
            width="200px"
            height="30px"
            title="CO2-Ausstoß pro km"
          />
        </div>
        <div class="input-cell">
          <AInput
            v-model:value="row.loadingVolume"
            type="number"
            width="200px"
            height="30px"
            title="Ladevolumen"
          />
        </div>
        <div class="input-cell">
          <AInput
            v-model:value="row.maxStoringPositions"
            type="number"
            width="200px"
            height="30px"
            title="maximale Lagerpositionen"
          />
        </div>
        <div class="input-cell">
          <AInput
            v-model:value="row.loadingMeter"
            type="number"
            width="200px"
            height="30px"
            title="Länge der Ladefläche"
          />
        </div>
        <div class="input-cell">
          <AInput
            v-model:value="row.payload"
            type="number"
            width="200px"
            height="30px"
            title="Ladekapazität in kg"
          />
        </div>
      </section>
      <section class="error-message" v-if="!valid[rowIndex]">
        Bitte nur positive Zahlen eingeben
      </section>
    </div>
    <section class="resource-list-add-row" @click="handleOpenAddModal">
      + Ressource hinzufügen
    </section>
  </div>
  <AModal v-if="showAddModal" title="Ressource hinzufügen" grid>
    <template #main>
      <AInput
        title="Ressourcenart"
        v-model:value="newResource.type"
        :valid="creationValidation.type.valid"
        :validation-message="creationValidation.type.validationError"
      />
      <div class="select-input">
        <span class="title">Kostenart</span>
        <select v-model="newResource.costType">
          <option :value="ACostTypes.fixed">{{ ACostTypes.fixed }}</option>
          <option :value="ACostTypes.variable">{{ ACostTypes.variable }}</option>
        </select>
      </div>
      <AInput
        title="Unterhaltungskosten"
        type="number"
        v-model:value="newResource.cost"
        :valid="creationValidation.cost.valid"
        :validation-message="creationValidation.cost.validationError"
      />
      <AInput
        title="CO2-Ausstoß pro km"
        type="number"
        v-model:value="newResource.co2PerKm"
        :valid="creationValidation.co2PerKM.valid"
        :validation-message="creationValidation.co2PerKM.validationError"
      />
      <AInput
        title="Ladevolumen"
        type="number"
        v-model:value="newResource.loadingVolume"
        :valid="creationValidation.loadingVolume.valid"
        :validation-message="creationValidation.loadingVolume.validationError"
      />
      <AInput
        title="maximale Lagerpositionen"
        type="number"
        v-model:value="newResource.maxStoringPositions"
        :valid="creationValidation.maxStoringPositions.valid"
        :validation-message="creationValidation.maxStoringPositions.validationError"
      />
      <AInput
        title="Länge der Ladefläche"
        type="number"
        v-model:value="newResource.loadingMeter"
        :valid="creationValidation.loadingMeter.valid"
        :validation-message="creationValidation.loadingMeter.validationError"
      />
      <AInput
        title="Ladekapazität in kg"
        type="number"
        v-model:value="newResource.payload"
        :valid="creationValidation.payload.valid"
        :validation-message="creationValidation.payload.validationError"
      />
    </template>
    <template #buttons>
      <AButton title="Abbrechen" width="120px" @press="handleCloseModal" />
      <AButton title="Hinzufügen" width="120px" @press="handleAddRessource" primary />
    </template>
  </AModal>
  <AModal v-if="showDeleteModal" title="Ressource Löschen" grid>
    <template #main>
      <div class="delete-modal-content">
        <span class="text"
          >Möchten Sie die Ressource "{{ editedResources[deleteIndex].type }}" wirklich
          löschen?</span
        >
        <span class="subtext">Die Ressource wird unwiderruflich gelöscht.</span>
      </div>
    </template>
    <template #buttons>
      <AButton title="Abbrechen" width="120px" @press="handleCloseModal" />
      <AButton title="Löschen" width="120px" @press="handleDeleteRessource" primary />
    </template>
  </AModal>
</template>

<style scoped lang="scss">
@import '@/styles/config.scss';

.a-resource-list-host {
  width: 200%;
  font-family: $main-font-family;
  font-style: normal;
  box-sizing: border-box;
  background: $background-white;
  border-radius: $outer-border-radius;
  border: 1px solid rgba(26, 56, 96, 0.1);

  .resource-list {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid rgba(26, 56, 96, 0.1);
    padding: 10px 20px;
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    color: #1a3860;
    background: $background-white;
    border-radius: $outer-border-radius;

    .resource-header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 5px;
      padding-top: 5px;
      font-weight: 500;
      font-size: $second-font-size;
      line-height: 17px;
      color: #1a3860;
      gap: 2%;

      .resource-header-text {
        display: flex;
        justify-content: space-between;
        width: 94%;
        cursor: pointer;
      }

      .resource-header-delete {
        display: flex;
        justify-content: flex-end;
        width: 4%;
        cursor: pointer;
      }
    }
    .error-message {
      color: red;
      font-size: 12px;
      margin-top: 5px;
    }

    .resource-info {
      box-sizing: border-box;
      line-height: 17px;
      max-height: 0;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: start;
      align-items: center;
      font-weight: 500;
      font-size: 14px;
      color: #1a3860;
      overflow: hidden;
      transition: all 0.3s ease-in-out;
      padding: 0;

      .title {
        color: #616d7c;
        font-size: $second-font-size;
      }

      .select-cell {
        min-width: 250px;
        padding-bottom: 10px;
        display: flex;
        flex-direction: column;

        select {
          background: #e9ecf0;
          border: none;
          border-radius: 4px;
          height: 30px;
          width: 200px;
          padding-left: 10px;
        }
      }

      .input-cell {
        min-width: 250px;
        padding-bottom: 10px;
      }

      &.open {
        max-height: 500px;
        padding-bottom: 10px;
        padding-top: 10px;
      }
    }
  }

  .resource-list-add-row {
    display: flex;
    border-bottom: 1px solid rgba(26, 56, 96, 0.1);
    padding: 10px 20px;
    font-weight: 500;
    background: #ffffff;
    border-radius: 10px;
    border-spacing: 0;
    border-collapse: separate;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: $second-font-size;
    line-height: 17px;
    color: $main-color;
  }

  .resource-list-add-row:hover {
    background-color: $main-color-hover;
    cursor: pointer;
  }
}
.select-input {
  display: flex;
  flex-flow: column;

  .title {
    color: #616d7c;
    font-size: $second-font-size;
  }

  select {
    background: #e9ecf0;
    border: none;
    border-radius: 4px;
    height: 50px;
    padding-left: 10px;
    font-size: $second-font-size;
  }
}

.delete-modal-content {
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 200%;
  font-family: $main-font-family;

  .text {
    font-size: 16px;
    line-height: 20px;
    margin-bottom: 20px;
  }

  .subtext {
    font-size: 14px;
    line-height: 17px;
    margin-bottom: 20px;
  }
}
</style>
