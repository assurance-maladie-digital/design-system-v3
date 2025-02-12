<script lang="ts" setup>
	import { ref } from 'vue'
	import PaginatedTable from '@/components/PaginatedTable/PaginatedTable.vue'

	const options = ref({
		itemsPerPage: 2,
		sortBy: 'lastname',
		sortDesc: false,
	})

	const headers = ref([
		{
			text: 'Nom',
			key: 'lastname',
			value: 'lastname',
			filterable: true,
		},
		{
			title: 'Prénom',
			value: 'firstname',
		},
		{
			value: 'email',
		},
	])

	const users = ref([
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
	])
</script>

<template>
	<PaginatedTable
		:options="options"
		:headers="headers"
		:items="users"
		@update:options="options = $event"
	/>

	<br><br>
</template>
