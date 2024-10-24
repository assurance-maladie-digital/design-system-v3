<script setup lang="ts">
	import DataList from '@/components/DataList/DataList.vue'

	import { mdiCalendar, mdiAccount } from '@mdi/js'

	const items = [
		{
			title: 'Title 1',
			subtitle: 'Subtitle 1',
			icon: mdiCalendar,
		},
		{
			title: 'Title 2',
			subtitle: 'Subtitle 2',
			icon: mdiAccount,
		},
	]

	const icons = {
		calendarIcon: mdiCalendar,
		accountIcon: mdiAccount,
	}
</script>

<template>
	<DataList
		:items="items"
		:icons="icons"
	/>
</template>
