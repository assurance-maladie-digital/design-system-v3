<script lang="ts" setup>
	import { ref } from 'vue'
	import PaginatedTable from '@/components/PaginatedTable/PaginatedTable.vue'

	const options = ref({
		itemsPerPage: 2,
		sortDesc: false,
	})

	const headers = ref([
		{
			title: 'Nom',
			key: 'lastname',
			filterable: true,
		},
		{
			title: 'Prénom',
			key: 'firstname',
		},
		{
			title: 'Email',
			key: 'email',
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
	<main>
		<PaginatedTable
			:options="options"
			:headers="headers"
			:items="users"
			@update:options="options.value = $event"
		/>
	</main>
</template>
