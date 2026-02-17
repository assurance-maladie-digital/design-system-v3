<script lang="ts" setup>
import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
import { ref } from 'vue'
import SyForm from '@/components/Customs/SyForm/SyForm.vue'
import type { ValidationRule } from '@/composables/validation/useValidation'

interface IForm {
  firstname: string
  birthDate: string
}

const firstnameRules: ValidationRule[] = [
  {
    type: 'required',
    options: { message: 'Obligatoire', fieldIdentifier: 'Nom' },
  },
  {
    type: 'matchPattern',
    options: {
      pattern: /^[A-Za-zÀ-ÖØ-öø-ÿ\-\s0-9']+$/,
      message: 'Alphanumérique requis',
      fieldIdentifier: 'Nom',
    },
  },
]

const formState = ref(false)
const isReadonly = ref(true)
const form = ref<IForm>({
  firstname: 'firstname',
  birthDate: '1967-02-01',
})

const formRef = ref<InstanceType<typeof SyForm> | null>(null)

function saveForm() {
  if (!form.value || !formState.value) {
    alert('fields are not valid')
    return false
  }

  alert('fields are valid')
  return true
}

function onToggleReadonly() {
  isReadonly.value = !isReadonly.value
}
</script>

<template>
  <SyForm
    ref="formRef"
    v-model="formState"
    class="mt-4"
    @submit="saveForm"
  >
    <SyTextField
      v-model="form.firstname"
      label="Nom"
      class="mb-2"
      color="primary"
      type="text"
      :readonly="isReadonly"
      :custom-rules="firstnameRules"
    />

    <DatePicker
      v-model="form.birthDate"
      label="Date de naissance"
      placeholder="Date de naissance"
      format="YYYY-MM-DD"
      date-format-return="YYYY-MM-DD"
      :display-icon="false"
      :readonly="isReadonly"
      class="mb-2"
      :custom-rules="[
        {
          type: 'notAfterToday',
          options: { message: 'Erreur date futur' },
        },
      ]"
      is-birth-date
      required
    />

    <VBtn
      class="mt-4"
      color="primary"
      @click="onToggleReadonly"
    >
      isReadonly ? {{ isReadonly }}
    </VBtn>
    <VBtn
      v-if="!isReadonly"
      class="mt-4"
      color="primary"
      type="submit"
    >
      Save
    </VBtn>
  </SyForm>
</template>