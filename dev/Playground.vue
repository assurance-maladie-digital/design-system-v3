<script setup>
	import { ref } from 'vue'
	import SelectBtnField from '@/components/SelectBtnField/SelectBtnField.vue'
	import PageContainer from '@/components/PageContainer/PageContainer.vue'

	const value = ref([])
	const items = [
		{
			text: 'Email',
			value: 'email',
		},
		{
			text: 'Courrier',
			value: 'courrier',
		},
		{
			text: 'SMS',
			value: 'sms',
		},
	]

</script>
<template>
	<PageContainer>
		<SelectBtnField
			v-model="value"
			:items="items"
			label="Moyen de contact"
		/>
	</PageContainer>
</template>
