<script setup lang="ts">
	import { ref } from 'vue'
	import SyForm from '@/components/Customs/SyForm/SyForm.vue'
	import PhoneField from '@/components/PhoneField/PhoneField.vue'

	const phone = ref('')
</script>

<template>
	<SyForm>
		<PhoneField
			v-model="phone"
			required
		/>
		<button type="reset">
			Réinitialiser
		</button>
		<button type="submit">
			Envoyer
		</button>
	</SyForm>
</template>
