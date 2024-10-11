<script setup>
	import PhoneField from '@/components/PhoneField/PhoneField.vue'
	import { ref } from 'vue'
	const value = ref('')
  const handleChange = (newValue) => {
    console.log('Value changed:', newValue)
  }
</script>
<template>
	<main class="ma-12">
		<PhoneField v-model="value"required withCountryCode countryCodeRequired />
	</main>
</template>
