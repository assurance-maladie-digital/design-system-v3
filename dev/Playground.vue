<script setup lang="ts">
import { ref, watch } from 'vue'
import FilterInline from '@/components/FilterInline/FilterInline.vue'
import PeriodField from '@/components/PeriodField/PeriodField.vue'
import SyTable from '@/components/Tables/SyTable/SyTable.vue'
import type { FilterOption } from '@/components/Tables/common/types'

const filters = ref([
	{
		name: 'period',
		title: 'Période de soin',
	},
])

const headers = [
	{ title: 'Nom', key: 'name' },
	{ title: 'Prénom', key: 'firstname' },
	{ title: 'Date de soin', key: 'date' },
]

const allItems = [
	{ name: 'Dupont', firstname: 'Jean', date: '15/01/2025' },
	{ name: 'Martin', firstname: 'Marie', date: '10/03/2025' },
	{ name: 'Durand', firstname: 'Pierre', date: '22/11/2024' },
	{ name: 'Petit', firstname: 'Sophie', date: '08/06/2025' },
	{ name: 'Leroy', firstname: 'Thomas', date: '30/07/2025' },
	{ name: 'Moreau', firstname: 'Lucie', date: '14/02/2025' },
	{ name: 'Simon', firstname: 'Paul', date: '03/04/2025' },
	{ name: 'Bernard', firstname: 'Anne', date: '17/09/2025' },
]

const options = ref<{ itemsPerPage: number, filters: FilterOption[] }>({
	itemsPerPage: 10,
	filters: [],
})

watch(filters, (newFilters) => {
	const periodFilter = newFilters.find(f => f.name === 'period')
	const value = periodFilter?.value as { from: string | null, to: string | null } | undefined

	if (value && (value.from !== null || value.to !== null)) {
		options.value.filters = [{ key: 'date', value, type: 'period' }]
	}
	else {
		options.value.filters = []
	}
}, { deep: true })
</script>

<template>
	<div class="pa-4">
		<FilterInline
			v-model="filters"
			class="mb-4"
		>
			<template #period="{ props }">
				<PeriodField
					v-bind="props"
					variant="outlined"
				/>
			</template>
		</FilterInline>

		<SyTable
			v-model:options="options"
			:headers="headers"
			:items="allItems"
			suffix="playground-period-filter"
			caption=""
		/>
	</div>
</template>
