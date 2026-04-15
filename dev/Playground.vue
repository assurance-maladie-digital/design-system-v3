<script setup lang="ts">
	import SyTable from '@/components/Tables/SyTable/SyTable.vue'
	import type { DataTableHeaders } from '@/components/Tables/common/types'

	const headers: DataTableHeaders[] = [
		{
			title: 'Nom de la colonne super longue',
			key: 'nom',
			maxWidth: '100px',
		},
		{
			title: 'Un autre nom vachement long',
			key: 'prenom',
		},
		{
			title: 'test',
			key: 'test',
		},
	]
</script>

<template>
	<SyTable
		:headers
		:items="[
			{
				nom: 'tesaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaat',
				prenom: 'aaaa',
				test: 'test',
				test2: 'test2',
				test3: 'test3',
			},
			{
				nom: 'tesaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaat',
				prenom: 'aaaa',
				test: 'test',
				test2: 'test2',
				test3: 'test3',
			},
		]"
		suffix="cog-table"
		show-filters
		:server-items-length="12"
	/>
</template>
