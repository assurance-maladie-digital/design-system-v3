<script setup lang="ts">
	import TableToolbar from '@/components/TableToolbar/TableToolbar.vue'
	import SySelect from '@/components/Customs/SySelect/SySelect.vue'
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

  const filterItems = ref<{ text: string; value: string }[]>([])

	items.forEach((item) => {
		filterItems.value.push({
			text: item.lastname,
			value: item.lastname,
		})
	})
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
				@update:search="search = $event"
			>
				<template #filters>
					<SySelect
						v-model="search"
						:items="filterItems"
						label="Nom"
						density="compact"
            hide-message
            clearable
					/>
				</template>
			</tabletoolbar>
		</template>
	</VDataTable>
</template>
