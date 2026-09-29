import type { StoryObj } from '@storybook/vue3-vite'
import SyAlert from '../../components/SyAlert/SyAlert.vue'
import '../styles/shared.css'

export default {
	title: 'Démarrer/Roadmap',
	component: SyAlert,
}

export const InfoIntro: StoryObj = {
	render: () => ({
		components: { SyAlert },
		template: `
			<SyAlert type="info" variant="tonal" :closable="false">
				<template #default>
					Cette feuille de route est indicative : elle reflète nos priorités à date et peut évoluer en fonction des besoins des équipes produit et des arbitrages de gouvernance.
				</template>
			</SyAlert>
		`,
	}),
	tags: ['!dev'],
}
