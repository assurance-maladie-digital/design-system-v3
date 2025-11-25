<script lang="ts" setup>
	import { computed, ref } from 'vue'
	import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
    import SyForm from '@/components/Customs/SyForm/SyForm.vue'

    const dateSinistre = computed(() => '12/10/2025')
const dateSinistreBis = ref('12/10/2025')

const form = ref()

const resetForm: () => Promise<void> = async () => {
 await form.value.reset()
}
</script>

<template>
<SyForm ref="form">
    <DatePicker
         v-model="dateSinistre"
         label="DatePicker"
         display-append-icon
         outlined
         disabled
         :show-success-messages="false"
    />
        <DatePicker
         v-model="dateSinistre"
         label="Combined"
         display-append-icon
         outlined
         disabled
         :show-success-messages="false"
         use-combined-mode
    />
        <DatePicker
         v-model="dateSinistre"
         label="no-calendar"
         display-ap
         disabled
         :show-success-messages="false"
         no-calendar
    />
    <DatePicker
         v-model="dateSinistre"
         label="DatePicker actif"
         display-append-icon
         outlined
         :show-success-messages="false"
    />
        <DatePicker
         v-model="dateSinistre"
         label="Combined actif"
         display-append-icon
         outlined
         :show-success-messages="false"
         use-combined-mode
    />
        <DatePicker
         v-model="dateSinistre"
         label="no-calendar actif"
         :show-success-messages="false"
         no-calendar
    />
    <VBtn @click="resetForm">Effacer</VBtn>
</SyForm>
</template>