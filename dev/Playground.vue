<script lang='ts' setup>
	import HeaderNavigationBar from '@/components/HeaderNavigationBar/HeaderNavigationBar.vue'
	import LogoBrandSection from '@/components/LogoBrandSection/LogoBrandSection.vue'
	import { computed } from 'vue'

	const navigationItems = computed(() => {
		return [
			{
				label: 'Séances',
				to: '/seances',
			},
			{
				label: 'Calendrier',
				to: '/calendrier',
			},
			{
				label: 'Profil',
				to: '/profil',
			},
		]
	})
</script>
<template>
	<HeaderNavigationBar
		:sticky="false"
		:items="navigationItems"
	>
		<template #logo>
			<LogoBrandSection
				:home-link="{ to: '/' }"
				service-title="ConcertMP PS"
				theme="risque-pro"
			/>
		</template>
	</HeaderNavigationBar>
</template>
