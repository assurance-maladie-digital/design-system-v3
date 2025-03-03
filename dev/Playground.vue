<script setup>
import { ref } from 'vue'
import DatePicker from '@/components/DatePicker/DatePicker.vue'
const dateTest = ref('')

const resetTest = () => {
    dateTest.value = ''
    console.log(dateTest.value) // retourne bien string vide
}
</script>

<template>
<DatePicker
	v-model="dateTest"
	placeholder="Date de test"
	:display-icon="false"
/>

<VBtn @click="resetTest()">Reset la date de test</VBtn>
</template>