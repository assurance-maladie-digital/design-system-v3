import type { StoryObj } from '@storybook/vue3-vite'
import SyAlert from '../../components/SyAlert/SyAlert.vue'
import '../styles/shared.css'
import './Roadmap.css'

export default {
	title: 'Démarrer/Roadmap',
	component: SyAlert,
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
		date: 'T4 2026',
		status: 'planned',
		highlights: ['Validation sur les composants de formulaire', 'Montée de version Node 22 et Pnpm 10'],
	},
	{
		version: 'v1.3',
		date: 'S1 2027',
		status: 'planned',
		highlights: ['Nouveautés selon les besoins projets (Cnam / Portail Agent / Amelipro)'],
	},
	{
		version: 'v2.0',
		date: 'Cadrage S2 2027',
		status: 'study',
		major: true,
		highlights: ['IA pour le Design System', 'Vue 4 / Vuetify 4', 'RGAA 5', '10 patterns clés dans Storybook et Figma'],
	},
]

// Mêmes libellés que la colonne « Impact pour votre projet » du tableau des cycles de versions.
// Le tag de statut en reprend la couleur ; le libellé est restitué aux lecteurs d'écran.
const impactLabels = {
	minor: 'Adaptations légères',
	major: 'Migration planifiée',
}

export const VersionsTimeline: StoryObj = {
	render: () => ({
		setup() {
			return { versions, statusLabels, impactLabels }
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
						<p :class="['roadmap-impact', 'roadmap-timeline__status', item.major ? 'roadmap-impact--major' : 'roadmap-impact--minor']">
							{{ statusLabels[item.status] }}<template v-if="item.major"> · Majeure</template>
							<span class="d-sr-only"> – impact : {{ item.major ? impactLabels.major : impactLabels.minor }}</span>
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

type Axis = 'ds' | 'ux' | 'a11y' | 'eco'

type Workstream = {
	label: string
	axis: Axis
	deliverable: string
}

const axisLabels: Record<Axis, string> = {
	ds: 'Design System',
	ux: 'UX/UI',
	a11y: 'Accessibilité',
	eco: 'Écoconception',
}

const workstreamColumns: { period: string, items: Workstream[] }[] = [
	{
		period: 'T3 2026',
		items: [
			{ label: 'Gouvernance & accompagnement', axis: 'ds', deliverable: 'Parcours d’accompagnement publié sur Storybook' },
		],
	},
	{
		period: 'T4 2026',
		items: [
			{ label: 'Documentation des usages et cas particuliers', axis: 'ds', deliverable: '100 % des composants documentés' },
			{ label: 'Alignement Figma & Storybook', axis: 'ds', deliverable: 'Conformité de 100 % des composants, harmonisation sémantique Figma' },
			{ label: 'Accessibilité du Design System', axis: 'ds', deliverable: 'Grille d’exigences a11y, 100 % des composants testés avec Vitest-axe' },
			{ label: 'Qualité & méthodes UX/UI', axis: 'ux', deliverable: 'Offre avec guidelines designers, consolidation de l’offre UX' },
		],
	},
	{
		period: 'T1 2027',
		items: [
			{ label: 'Stabilisation du thème Amelipro', axis: 'ds', deliverable: 'Version stabilisée' },
			{ label: 'IA pour le Design System', axis: 'ds', deliverable: 'Règles d’usage de l’IA' },
			{ label: 'Élargissement des pratiques d’écoconception', axis: 'eco', deliverable: 'Périmètres back, architecture et run, principes directeurs v2' },
		],
	},
	{
		period: 'T2 2027',
		items: [
			{ label: 'Études Synapse v2', axis: 'ds', deliverable: 'IA pour le Design System, passage à Vue 4 / Vuetify 4' },
			{ label: 'Évolution du catalogue', axis: 'ds', deliverable: '10 patterns clés dans Storybook et Figma' },
			{ label: 'Évolution RGAA 5', axis: 'a11y', deliverable: 'Étude d’impact RGAA 5, kit de pré-audit v2' },
		],
	},
	{
		period: 'En continu',
		items: [
			{ label: 'Communication & adoption', axis: 'ds', deliverable: 'Cercle technique Synapse, articles trimestriels, webinaire' },
		],
	},
]

export const Chantiers: StoryObj = {
	render: () => ({
		setup() {
			return { workstreamColumns, axisLabels }
		},
		template: `
			<div class="roadmap-board">
				<section
					v-for="column in workstreamColumns"
					:key="column.period"
					:class="['roadmap-board__column', { 'roadmap-board__column--continuous': column.period === 'En continu' }]"
				>
					<h4 class="roadmap-board__period">{{ column.period }}</h4>
					<ul class="roadmap-board__list">
						<li
							v-for="item in column.items"
							:key="item.label"
							:class="['roadmap-board__card', 'roadmap-board__card--' + item.axis]"
						>
							<span class="roadmap-board__axis">{{ axisLabels[item.axis] }}</span>
							<p class="roadmap-board__title">{{ item.label }}</p>
							<p class="roadmap-board__deliverable">{{ item.deliverable }}</p>
						</li>
					</ul>
				</section>
			</div>
		`,
	}),
	tags: ['!dev'],
}
