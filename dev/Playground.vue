<script lang="ts" setup>
	import { ref, reactive } from 'vue'
	import PaginatedTable from '@/components/PaginatedTable/PaginatedTable.vue'

	const options = ref({
		itemsPerPage: 2,
		sortBy: 'lastname',
		sortDesc: false,
	})

	const headers = reactive([
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

	const users = reactive([
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
	])
</script>

<template>
	<PaginatedTable
		:headers="headers"
		:items="users"
		:options="options"
	/>
</template>
