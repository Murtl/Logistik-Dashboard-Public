<script setup lang="ts">
import AInput from '@/components/input/AInput.vue'
import ASegment from '@/components/segment/ASegment.vue'
import AResourceList from '@/components/resource-list/AResourceList.vue'
import type { AResource } from '@/utils/classes/AResource'
import type { Ref } from 'vue'
import { onBeforeMount, ref, watch } from 'vue'
import { useMasterDataStore } from '@/stores/masterDataStore'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'
import AButton from '@/components/button/AButton.vue'
import { AMasterData } from '@/utils/classes/AMasterData'
import AModal from '@/components/modal/AModal.vue'
import { router } from '@/router'

const authStore = useAuthStore()
const { aUser } = storeToRefs(authStore)

const masterDataStore = useMasterDataStore()
const { resources, planningCost, masterData } = storeToRefs(masterDataStore)

const loading = ref(true)

const unsavedResources = ref(false)
const unsavedPlanningCost = ref(false)
const creationMode = ref(false)
const uninitializedResources: Ref<string[]> = ref([])
const popupVisible = ref(false)

const localResources: Ref<AResource[]> = ref([])
const localPlanningCost: Ref<{ regularPlanningTime: number; dispatcherSalary: number }> = ref({
  regularPlanningTime: 0,
  dispatcherSalary: 0
})
const planningCostSegmentKey = ref(0)

const localPlanningCostValidation = {
  regularPlanningTime: {
    valid: true,
    validationMessage: 'Bitte geben Sie einen Wert größer 0 ein'
  },
  dispatcherSalary: {
    valid: true,
    validationMessage: 'Bitte geben Sie einen Wert größer 0 ein'
  }
}
const localResourcesValidation: Ref<boolean[]> = ref([])

onBeforeMount(async () => {
  if (!aUser.value.permissions.resourceManagement) {
    router.push('/dashboard')
    return
  }

  await masterDataStore.fetchMasterData(aUser.value.shippingCompanyId)
  resources.value.forEach((resource: AResource) => {
    if (resource.cost === 0) {
      uninitializedResources.value.push(resource.type)
    }
  })
  if (uninitializedResources.value.length > 0) {
    popupVisible.value = true
  }
  loading.value = false
})

watch(
  masterData,
  () => {
    if (masterData.value.shippingCompanyName !== '') {
      creationMode.value = false
      localResources.value = JSON.parse(JSON.stringify(resources.value))
      localPlanningCost.value = JSON.parse(JSON.stringify(planningCost.value))
      localResourcesValidation.value = new Array<boolean>(localResources.value.length).fill(true)
    } else {
      creationMode.value = true
    }
  },
  { deep: true }
)

watch(
  resources,
  () => {
    localResources.value = JSON.parse(JSON.stringify(resources.value))
  },
  { deep: true }
)
watch(
  planningCost,
  () => {
    localPlanningCost.value = JSON.parse(JSON.stringify(planningCost.value))
  },
  { deep: true }
)

watch(
  localPlanningCost,
  () => {
    unsavedPlanningCost.value =
      localPlanningCost.value.dispatcherSalary !== planningCost.value.dispatcherSalary ||
      localPlanningCost.value.regularPlanningTime !== planningCost.value.regularPlanningTime
  },
  { deep: true }
)

watch(
  localResources,
  () => {
    unsavedResources.value = false
    if (localResources.value.length !== resources.value.length) {
      unsavedResources.value = true
      localResourcesValidation.value = new Array<boolean>(localResources.value.length).fill(true)
    } else {
      localResources.value.forEach((resource: AResource, i: number) => {
        if (
          resource.costType !== resources.value[i].costType ||
          resource.cost !== resources.value[i].cost ||
          resource.co2PerKm !== resources.value[i].co2PerKm ||
          resource.loadingVolume !== resources.value[i].loadingVolume ||
          resource.maxStoringPositions !== resources.value[i].maxStoringPositions ||
          resource.loadingMeter !== resources.value[i].loadingMeter ||
          resource.payload !== resources.value[i].payload
        ) {
          unsavedResources.value = true
          return
        }
      })
    }
  },
  { deep: true }
)

const handleUpdate = (updatedResources: AResource[]) => {
  localResources.value = updatedResources
}

const handleSaveResourceChanges = async () => {
  if (validateResources()) {
    await masterDataStore.updateResources(localResources.value, aUser.value.shippingCompanyId)
    uninitializedResources.value = []
  }
}

const handleSavePlanningCostChanges = async () => {
  if (validatePlanningCost()) {
    await masterDataStore.updatePlanningCost(localPlanningCost.value, aUser.value.shippingCompanyId)
  }
}

const handleCreateMasterData = async () => {
  if (validatePlanningCost()) {
    masterDataStore
      .createMasterData(
        new AMasterData(
          aUser.value.shippingCompanyName,
          localPlanningCost.value.regularPlanningTime,
          localPlanningCost.value.dispatcherSalary,
          localResources.value
        ),
        aUser.value.shippingCompanyId
      )
      .then(() => {
        creationMode.value = false
      })
      .catch((error) => {
        alert(error)
      })
  }
}

const validatePlanningCost = () => {
  localPlanningCostValidation.regularPlanningTime.valid =
    localPlanningCost.value.regularPlanningTime > 0
  localPlanningCostValidation.dispatcherSalary.valid = localPlanningCost.value.dispatcherSalary > 0
  rerenderPlanningCostSegment()
  return (
    localPlanningCostValidation.regularPlanningTime.valid &&
    localPlanningCostValidation.dispatcherSalary.valid
  )
}

const validateResources = () => {
  let resourcesValid = true
  let tempValid = true
  localResources.value.forEach((resource: AResource, i: number) => {
    tempValid = true
    if (resource.cost <= 0) {
      localResources.value[i].cost = 0
      tempValid = false
    }
    if (resource.co2PerKm <= 0) {
      localResources.value[i].co2PerKm = 0
      tempValid = false
    }
    if (resource.loadingVolume <= 0) {
      localResources.value[i].loadingVolume = 0
      tempValid = false
    }
    if (resource.maxStoringPositions <= 0) {
      localResources.value[i].maxStoringPositions = 0
      tempValid = false
    }
    if (resource.loadingMeter <= 0) {
      localResources.value[i].loadingMeter = 0
      tempValid = false
    }
    if (resource.payload <= 0) {
      localResources.value[i].payload = 0
      tempValid = false
    }
    if (!tempValid) {
      resourcesValid = false
    }
    localResourcesValidation.value[i] = tempValid
  })
  return resourcesValid
}

const rerenderPlanningCostSegment = () => {
  planningCostSegmentKey.value++
}
</script>

<template>
  <div class="loader" v-if="loading"></div>
  <div class="a-master-data-maintenance" v-else>
    <ASegment
      title="Kosten"
      @save="handleSavePlanningCostChanges"
      :key="planningCostSegmentKey"
      :button-disabled="creationMode || !unsavedPlanningCost || uninitializedResources.length > 0"
    >
      <AInput
        title="Aktuelle Dauer der Planung"
        placeholder="Wert (in Stunden)..."
        type="number"
        v-model:value="localPlanningCost.regularPlanningTime"
        :valid="localPlanningCostValidation.regularPlanningTime.valid"
        :validation-message="localPlanningCostValidation.regularPlanningTime.validationMessage"
      />
      <AInput
        title="Gehalt Disponent*in"
        placeholder="Wert (in Euro) ..."
        type="number"
        v-model:value="localPlanningCost.dispatcherSalary"
        :valid="localPlanningCostValidation.dispatcherSalary.valid"
        :validation-message="localPlanningCostValidation.dispatcherSalary.validationMessage"
      />
    </ASegment>
    <ASegment
      title="Ressourcen"
      @save="handleSaveResourceChanges"
      :button-disabled="creationMode || !unsavedResources"
    >
      <AResourceList
        :resources="resources"
        @update="handleUpdate"
        :valid="localResourcesValidation"
      />
    </ASegment>
    <AButton
      title="Stammdaten initial anlegen"
      primary
      width="250px"
      v-if="creationMode"
      @press="handleCreateMasterData"
    />
    <AModal title="Es gibt ungepflegte Ressourcen" v-if="popupVisible" grid>
      <template #main>
        <p style="width: 200%">
          Folgende Ressourcen müssen gepflegt werden bevor sie fortfahren: <br />
          {{ uninitializedResources.join(', ') }}
        </p>
      </template>
      <template #buttons>
        <AButton
          title="Ok"
          width="120px"
          @press="
            () => {
              popupVisible = false
            }
          "
          primary
        />
      </template>
    </AModal>
  </div>
</template>

<style scoped lang="scss">
.a-master-data-maintenance {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}
</style>
