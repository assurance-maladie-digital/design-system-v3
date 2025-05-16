<script setup lang="ts">
	import TableToolbar from '@/components/TableToolbar/TableToolbar.vue'
	import { VDataTable } from 'vuetify/components'
	import { ref } from 'vue'

	const headers = [
		{
			title: 'Nom',
			value: 'lastname',
		},
		{
			title: 'Prénom',
			value: 'firstname',
		},
		{
			title: 'Email',
			value: 'email',
		},
	]

	const items = [
		{
			firstname: 'Virginie',
			lastname: 'Beauchesne',
			email: 'virginie.beauchesne@example.com',
		},
		{
			firstname: 'Étienne',
			lastname: 'Salois',
			email: 'etienne.salois@example.com',
		},
	]

	const search = ref('')
</script>

<template>
	<VDataTable
		:headers="headers"
		:items="items"
    :search="search"
	>
		<template #top>
			<TableToolbar
				v-model="search"
				:nb-total="items.length"
				show-add-button
        @update:search="search = $event"
			/>
		</template>
	</VDataTable>
</template>
