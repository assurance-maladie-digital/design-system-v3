<script setup lang="ts">
	import { ref } from 'vue'
	import SyTable from '@/components/Tables/SyTable/SyTable.vue'

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

	const selection = ref<Array<never>>([])
</script>

<template>
	<SyTable
		v-model:options="options"
		v-model="selection"
		:headers="headers"
		:items="items"
		show-filters
    show-select-single
		suffix="selection-table"
	/>
	<div
		v-if="selection.length"
		class="mt-4 pa-4 bg-grey-lighten-4"
	>
		<h3 class="text-h6 mb-3">
			Item(s) sélectionné(s) ({{ selection.length }})
		</h3>
		<div
			v-for="(item, index) in selection"
			:key="index"
			class="mb-2 pa-2 bg-grey-lighten-3"
		>
			<div><strong>Nom:</strong> {{ typeof item === 'object' ? item.lastname : items.find(i => JSON.stringify(i) === item)?.lastname }}</div>
			<div><strong>Prénom:</strong> {{ typeof item === 'object' ? item.firstname : items.find(i => JSON.stringify(i) === item)?.firstname }}</div>
			<div><strong>Email:</strong> {{ typeof item === 'object' ? item.email : items.find(i => JSON.stringify(i) === item)?.email }}</div>
		</div>
	</div>
</template>
