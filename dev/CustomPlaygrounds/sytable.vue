<script setup lang="ts">
	import SyTable from '@/components/Tables/SyTable/SyTable.vue'

	import { ref } from 'vue'

	const options = ref({
		itemsPerPage: 4,
	})

	const headers = ref([
		{
			title: 'Nom',
			key: 'lastname',
		},
		{
			title: 'Prénom',
			key: 'firstname',
		},
		{
			title: 'Email',
			value: 'email',
		},
	])

	const items = ref([
		{
			firstname: 'Virginie',
			lastname: 'Beauchesne',
			email: 'virginie.beauchesne@example.com',
		},
		{
			firstname: 'Simone',
			lastname: 'Bellefeuille',
			email: 'simone.bellefeuille@example.com',
		},
		{
			firstname: 'Étienne',
			lastname: 'Salois',
			email: 'etienne.salois@example.com',
		},
		{
			firstname: 'Thierry',
			lastname: 'Bobu',
			email: 'thierry.bobu@example.com',
		},
		{
			firstname: 'Bernadette',
			lastname: 'Langelier',
			email: 'bernadette.langelier@exemple.com',
		},
		{
			firstname: 'Agate',
			lastname: 'Roy',
			email: 'agate.roy@exemple.com',
		},
	])
</script>

<template>
	<SyTable
		v-model:options="options"
		:items="items"
		:headers="headers"
		suffix="table"
	/>
</template>
