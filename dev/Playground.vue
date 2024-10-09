<script setup>
	import PhoneField from '@/components/PhoneField/PhoneField.vue'
	import { ref } from 'vue'
	const value = ref('')
  const handleChange = (newValue) => {
    console.log('Value changed:', newValue)
  }
</script>
<template>
	<div class="ma-12">
    {{ value }}
		<PhoneField
			v-model="value"
      required
      @change="handleChange"
    />
		<PhoneField v-model="value" required withCountryCode />
	</div>
</template>
