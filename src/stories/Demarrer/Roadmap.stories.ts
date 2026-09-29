import type { StoryObj } from '@storybook/vue3-vite'
import SyAlert from '../../components/SyAlert/SyAlert.vue'
import '../styles/shared.css'
import './Roadmap.css'

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

type VersionStatus = 'current' | 'in-progress' | 'planned' | 'study'

type Version = {
	version: string
	date: string
	status: VersionStatus
	major?: boolean
	highlights: string[]
}

const statusLabels: Record<VersionStatus, string> = {
	'current': 'Version actuelle',
	'in-progress': 'En cours',
	'planned': 'Prévue',
	'study': 'À l’étude',
}

const versions: Version[] = [
	{
		version: 'v1.1',
		date: 'Juin 2026',
		status: 'current',
		highlights: ['Mise à jour des tokens suite à l’intégration du thème Amelipro', 'Messages de succès masqués par défaut', 'Fin du support de Node 18'],
	},
	{
		version: 'v1.2',
		date: 'T3 2026',
		status: 'in-progress',
		highlights: ['Validation sur les composants de formulaire', 'Montée de version Node 22 et Pnpm 10'],
	},
	{
		version: 'v1.3',
		date: 'T1 2027',
		status: 'planned',
		highlights: ['Documentation des usages', 'Alignement Figma & Storybook', 'Vitest-axe sur 100 % des composants'],
	},
	{
		version: 'v1.4',
		date: 'T2 2027',
		status: 'planned',
		highlights: ['Thème Amelipro stabilisé (sortie de l’alpha)', '10 patterns clés dans Storybook et Figma'],
	},
	{
		version: 'v2.0',
		date: 'Cadrage T2 2027',
		status: 'study',
		major: true,
		highlights: ['IA pour le Design System', 'Vue 4 / Vuetify 4', 'RGAA 5'],
	},
]

export const VersionsTimeline: StoryObj = {
	render: () => ({
		setup() {
			return { versions, statusLabels }
		},
		template: `
			<ol class="roadmap-timeline">
				<li
					v-for="item in versions"
					:key="item.version"
					:class="['roadmap-timeline__item', 'roadmap-timeline__item--' + item.status, { 'roadmap-timeline__item--major': item.major }]"
				>
					<span class="roadmap-timeline__dot" aria-hidden="true" />
					<div class="roadmap-timeline__card">
						<p class="roadmap-timeline__head">
							<span class="roadmap-timeline__version">{{ item.version }}</span>
							<span class="roadmap-timeline__date">{{ item.date }}</span>
						</p>
						<p class="roadmap-timeline__status">
							{{ statusLabels[item.status] }}<template v-if="item.major"> · Majeure</template>
						</p>
						<ul class="roadmap-timeline__highlights">
							<li v-for="highlight in item.highlights" :key="highlight">{{ highlight }}</li>
						</ul>
					</div>
				</li>
			</ol>
		`,
	}),
	tags: ['!dev'],
}
