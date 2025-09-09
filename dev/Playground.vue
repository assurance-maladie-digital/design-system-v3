<script lang="ts" setup>
	import SySelect from '@/components/Customs/Selects/SySelect/SySelect.vue'
	import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'

	const items = [
		{ text: 'Adrien', value: 'Adrien' },
		{ text: 'Axel', value: 'Axel' },
		{ text: 'Baptiste', value: 'Baptiste' },
		{ text: 'Clement', value: 'Clement' },
		{ text: 'Corentin', value: 'Corentin' },
		{ text: 'Damien', value: 'Damien' },
		{ text: 'David', value: 'David' },
		{ text: 'Eloi', value: 'Eloi' },
		{ text: 'Louis', value: 'Louis' },
		{ text: 'Valentin', value: 'Valentin' },
	]
</script>

<template>
	<SySelect :items="items" clearable/>
	<DatePicker />
	<VRadioGroup>
		<VRadio
			label="TEST"
			:value="true"
		/>
		<VRadio
			label="TEST2"
			:value="false"
		/>
	</VRadioGroup>
</template>
