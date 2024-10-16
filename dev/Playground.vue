<script setup lang="ts">
	import CollapsibleList from '@/components/CollapsibleList/CollapsibleList.vue'
	import type { ListItem } from '@/components/CollapsibleList/types'

	const remboursementItems = [
		{
			text: 'Remboursement',
			href: '/remboursement',
			ariaLabel: 'Remboursement',
		},
		{
			text: 'Remboursement',
			href: '/remboursement',
			ariaLabel: 'Remboursement',
		},
		{
			text: 'Remboursement',
			href: '/remboursement',
			ariaLabel: 'Remboursement',
		},
		{
			text: 'Remboursement',
			href: '/remboursement',
			ariaLabel: 'Remboursement',
		},
	] as ListItem[]
</script>

<template>
	<CollapsibleList
		:items="remboursementItems"
		list-title="Remboursement"
	/>
</template>
