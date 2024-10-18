<script setup lang="ts">
	import { ref } from 'vue'
	import CustomSelect from '@/components/Customs/CustomSelect/CustomSelect.vue'

	const selectedValue = ref(undefined)
	const selectedValue2 = ref(undefined)

	const items = ref([
		{ textoto: 'Option 1', value: '1' },
		{ textoto: 'Option 2', value: '2' },
	])
	const items2 = ref(['1', '2', '3', '4', '5'])

	const errorMessages = ref<string[]>([])

	const triggerError = () => {
		errorMessages.value = ['This is a test error message']
	}
</script>

<template>
	<main class="ma-12">
		SelectedValue: {{ selectedValue }}
		<div class="d-flex flex-wrap align-center pa-4">
			<custom-select
				v-model="selectedValue"
				:items="items"
				:error-messages="errorMessages"
				text-key="textoto"
				outlined
				required
			/>
		</div>
		<custom-select
			v-model="selectedValue2"
			:items="items2"
			:error-messages="errorMessages"
		/>
		<custom-select
			v-model="selectedValue2"
			:items="items2"
			:error-messages="errorMessages"
		/>
		<button @click="triggerError">
			Trigger Error
		</button>
	</main>
</template>
