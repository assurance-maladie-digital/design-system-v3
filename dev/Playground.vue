<script setup>
import { ref } from 'vue'
import NirField from '@/components/NirField/NirField.vue'
const nirTest = ref('')
</script>

<template>
<NirField
	v-model="nirTest"
	placeholder="Date de test"
    width="40%"
/>
</template>