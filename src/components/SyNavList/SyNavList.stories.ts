import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { VBtn } from 'vuetify/components'
import { fn } from 'storybook/test'
import { mdiAccount, mdiChevronDown, mdiChevronUp, mdiCog, mdiFileDocument, mdiFolderPlus, mdiShieldCheck, mdiPencilBox } from '@mdi/js'
import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
import SyIconButton from '@/components/Customs/SyIconButton/SyIconButton.vue'
import HeaderBar from '@/components/HeaderBar/HeaderBar.vue'
import SyNavList from './SyNavList.vue'
import type { SyNavListAction, SyNavListItem } from './types'

const edit: SyNavListAction = { id: 'edit', icon: mdiPencilBox, label: 'Modifier' }
const settings: SyNavListAction = { id: 'settings', icon: mdiCog, label: 'Paramètres' }

// Les stories vont de la plus simple à la plus complète : chacune n'ajoute qu'une option.

const simpleItems: SyNavListItem[] = [
	{ id: 'cmu-c-as', label: 'CMU-C/AS', href: '/cmu-c-as' },
	{ id: 'ame', label: 'AME', href: '/ame' },
	{ id: 'at-mp', label: 'AT/MP', href: '/at-mp' },
]

const iconItems: SyNavListItem[] = [
	{ id: 'cmu-c-as', label: 'CMU-C/AS', href: '/cmu-c-as', icon: mdiShieldCheck },
	{ id: 'ame', label: 'AME', href: '/ame', icon: mdiAccount },
	{ id: 'at-mp', label: 'AT/MP', href: '/at-mp', icon: mdiFileDocument },
]

const actionItems: SyNavListItem[] = [
	{ id: 'cmu-c-as', label: 'CMU-C/AS', href: '/cmu-c-as' },
	{ id: 'ame', label: 'AME', href: '/ame', actions: [settings, edit] },
	{ id: 'at-mp', label: 'AT/MP', href: '/at-mp', actions: [settings, edit] },
]

const subLevelItems: SyNavListItem[] = [
	{
		id: 'cmu-b',
		label: 'CMU-B',
		href: '/cmu-b',
		children: [
			{ id: 'reception', label: 'Réception', href: '/reception' },
			{ id: 'instruction', label: 'Instruction', href: '/instruction' },
			{ id: 'revision', label: 'Révision', href: '/revision' },
		],
	},
	{ id: 'cmu-c-as', label: 'CMU-C/AS', href: '/cmu-c-as' },
	{ id: 'ame', label: 'AME', href: '/ame' },
]

// Données de la maquette PA « Sous-menu — Dossiers client ».
const dossiersClient: SyNavListItem[] = [
	{
		id: 'droit-de-base',
		label: 'Droit de base',
		href: '/droit-de-base',
		actions: [edit],
		children: [
			{
				id: 'demande-affiliation',
				label: 'Demande d’affiliation',
				href: '/demande-affiliation',
				children: [{ id: 'pieces-justificatives', label: 'Pièces justificatives', href: '/pieces-justificatives' }],
			},
		],
	},
	{
		id: 'cmu-b',
		label: 'CMU-B',
		href: '/cmu-b',
		actions: [edit],
		children: [
			{ id: 'reception', label: 'Réception', href: '/reception' },
			{ id: 'instruction', label: 'Instruction', href: '/instruction' },
			{ id: 'revision', label: 'Révision', href: '/revision' },
		],
	},
	{ id: 'cmu-c-as', label: 'CMU-C/AS', href: '/cmu-c-as' },
	{ id: 'ame', label: 'AME', href: '/ame', actions: [settings, edit] },
	{ id: 'at-mp', label: 'AT/MP', href: '/at-mp', actions: [settings, edit] },
]

const simpleTemplate = `<template>
	<SyNavList
		:items="items"
		label="Dossiers client"
	/>
</template>`

const actionTemplate = `<template>
	<SyNavList
		:items="items"
		label="Dossiers client"
		@action="onAction"
	/>
</template>`

const onActionScript = `function onAction(item: SyNavListItem, action: SyNavListAction): void {
	// Traitement de l'action « action.label » sur l'entrée « item.label »
}`

const meta = {
	title: 'Composants/Navigation/SyNavList',
	component: SyNavList,
	parameters: {
		layout: 'fullscreen',
	},
	decorators: [
		(_, { parameters }) => ({
			setup() {
				// Liens de démonstration : sans cela, un clic quitte Storybook (dans la doc, une ancre #… ouvre l'iframe seule).
				function preventNavigation(event: MouseEvent): void {
					if (event.target instanceof Element && event.target.closest('a')) event.preventDefault()
				}
				return { preventNavigation }
			},
			// Les exemples de page entière (paramètre fullPage) gèrent leurs propres marges.
			template: parameters.fullPage
				? '<div @click="preventNavigation"><story /></div>'
				: '<div class="pa-4" style="min-height: 360px" @click="preventNavigation"><story /></div>',
		}),
	],
	argTypes: {
		items: {
			control: 'object',
			description: 'Entrées de la liste. Chaque entrée a un `id`, un `label`, et optionnellement une icône décorative (`icon`), un lien (`href` ou `to`), des actions (`actions`, jusqu\'à 4) et un sous-niveau (`children`, même structure).',
			table: {
				type: { summary: 'SyNavListItem[]', detail: `{
	id: string
	label: string
	icon?: IconValue
	href?: string
	to?: RouteLocationRaw
	actions?: { id: string, icon: IconValue, label: string }[]
	children?: SyNavListItem[]
}[]` },
				category: 'props',
			},
		},
		label: {
			control: 'text',
			description: 'Nom accessible de la navigation, posé sur le `<nav>`. Par défaut : `locales.navLabel`.',
			table: {
				type: { summary: 'string' },
				defaultValue: { summary: 'undefined' },
				category: 'props',
			},
		},
		iconColor: {
			type: { name: 'string', required: false },
			control: { type: 'text' },
			description: 'Couleur des icônes : icône d\'entrée, actions et chevron. Couleur du thème Vuetify (`primary`, `secondary`…) ou valeur CSS. Les actions et le chevron identifient des boutons : la couleur doit garder un contraste d\'au moins 3:1 avec le fond (RGAA 3.3).',
			table: {
				type: { summary: 'string' },
				defaultValue: { summary: 'primary' },
				category: 'props',
			},
		},
		locales: {
			control: 'object',
			description: 'Surcharge des libellés (fichier `locales.ts` du composant). La prop accepte un objet partiel : seules les clés renseignées surchargent les valeurs par défaut.',
			table: {
				type: { summary: 'object', detail: `{
	navLabel: string,
	subMenuLabel: (label: string) => string,
	openSubMenu: (label: string) => string,
	closeSubMenu: (label: string) => string,
	actionLabel: (action: string, item: string) => string,
}` },
				category: 'props',
			},
		},
		onSubLevelChange: {
			description: 'Émis avec `true` quand un sous-niveau s\'ouvre alors qu\'aucun ne l\'était, et avec `false` quand le dernier se ferme. Sert par exemple à laisser Échap fermer les sous-niveaux avant le menu qui contient la liste.',
			table: {
				type: { summary: '(open: boolean) => void' },
				category: 'events',
			},
		},
		onAction: {
			description: 'Émis au clic sur une action déclarée dans `items`, avec l\'entrée et l\'action.',
			table: {
				type: { summary: '(item: SyNavListItem, action: SyNavListAction) => void' },
				category: 'events',
			},
		},
	},
	args: {
		items: simpleItems,
		label: 'Dossiers client',
		onAction: fn(),
	},
} satisfies Meta<typeof SyNavList>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Usage le plus simple : une liste de liens dans un `<nav>` nommé par `label`.',
			},
		},
		sourceCode: [
			{ name: 'Template', code: simpleTemplate },
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { SyNavList, type SyNavListItem } from '@cnamts/synapse'

const items: SyNavListItem[] = [
	{ id: 'cmu-c-as', label: 'CMU-C/AS', href: '/cmu-c-as' },
	{ id: 'ame', label: 'AME', href: '/ame' },
	{ id: 'at-mp', label: 'AT/MP', href: '/at-mp' },
]
</script>`,
			},
		],
	},
}

export const WithIcons: Story = {
	args: {
		items: iconItems,
	},
	parameters: {
		docs: {
			description: {
				story: 'L\'option `icon` affiche une icône décorative avant le libellé, masquée aux technologies d\'assistance.',
			},
		},
		sourceCode: [
			{ name: 'Template', code: simpleTemplate },
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { mdiAccount, mdiFileDocument, mdiShieldCheck } from '@mdi/js'
import { SyNavList, type SyNavListItem } from '@cnamts/synapse'

const items: SyNavListItem[] = [
	{ id: 'cmu-c-as', label: 'CMU-C/AS', href: '/cmu-c-as', icon: mdiShieldCheck },
	{ id: 'ame', label: 'AME', href: '/ame', icon: mdiAccount },
	{ id: 'at-mp', label: 'AT/MP', href: '/at-mp', icon: mdiFileDocument },
]
</script>`,
			},
		],
	},
}

export const WithActions: Story = {
	args: {
		items: actionItems,
	},
	parameters: {
		docs: {
			description: {
				story: 'L\'option `actions` ajoute jusqu\'à 4 boutons par entrée, affichés au survol, au focus dans l\'entrée et en permanence sur écran tactile. Un clic émet `action` avec l\'entrée et l\'action ; le nom accessible du bouton reprend celui de l\'entrée (« Modifier (AME) »).',
			},
		},
		sourceCode: [
			{ name: 'Template', code: actionTemplate },
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { mdiCog, mdiPencilBox } from '@mdi/js'
import { SyNavList, type SyNavListAction, type SyNavListItem } from '@cnamts/synapse'

const edit: SyNavListAction = { id: 'edit', icon: mdiPencilBox, label: 'Modifier' }
const settings: SyNavListAction = { id: 'settings', icon: mdiCog, label: 'Paramètres' }

const items: SyNavListItem[] = [
	{ id: 'cmu-c-as', label: 'CMU-C/AS', href: '/cmu-c-as' },
	{ id: 'ame', label: 'AME', href: '/ame', actions: [settings, edit] },
	{ id: 'at-mp', label: 'AT/MP', href: '/at-mp', actions: [settings, edit] },
]

${onActionScript}
</script>`,
			},
		],
	},
}

export const WithSubLevel: Story = {
	args: {
		items: subLevelItems,
	},
	parameters: {
		docs: {
			description: {
				story: 'L\'option `children` ajoute un sous-niveau, ouvert par le chevron (clic, Entrée, Espace, et survol à la souris sur grand écran). Il s\'affiche à droite à partir de 960 px, sous l\'entrée en dessous ; Échap le referme.',
			},
		},
		sourceCode: [
			{ name: 'Template', code: simpleTemplate },
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { SyNavList, type SyNavListItem } from '@cnamts/synapse'

const items: SyNavListItem[] = [
	{
		id: 'cmu-b',
		label: 'CMU-B',
		href: '/cmu-b',
		children: [
			{ id: 'reception', label: 'Réception', href: '/reception' },
			{ id: 'instruction', label: 'Instruction', href: '/instruction' },
			{ id: 'revision', label: 'Révision', href: '/revision' },
		],
	},
	{ id: 'cmu-c-as', label: 'CMU-C/AS', href: '/cmu-c-as' },
	{ id: 'ame', label: 'AME', href: '/ame' },
]
</script>`,
			},
		],
	},
}

export const Complete: Story = {
	args: {
		items: dossiersClient,
	},
	parameters: {
		docs: {
			description: {
				story: 'Maquette PA « Sous-menu — Dossiers client » : actions et sous-niveaux combinés, sur trois niveaux.',
			},
		},
		sourceCode: [
			{ name: 'Template', code: actionTemplate },
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { mdiCog, mdiPencilBox } from '@mdi/js'
import { SyNavList, type SyNavListAction, type SyNavListItem } from '@cnamts/synapse'

const edit: SyNavListAction = { id: 'edit', icon: mdiPencilBox, label: 'Modifier' }
const settings: SyNavListAction = { id: 'settings', icon: mdiCog, label: 'Paramètres' }

const items: SyNavListItem[] = [
	{
		id: 'droit-de-base',
		label: 'Droit de base',
		href: '/droit-de-base',
		actions: [edit],
		children: [
			{
				id: 'demande-affiliation',
				label: 'Demande d’affiliation',
				href: '/demande-affiliation',
				children: [{ id: 'pieces-justificatives', label: 'Pièces justificatives', href: '/pieces-justificatives' }],
			},
		],
	},
	{
		id: 'cmu-b',
		label: 'CMU-B',
		href: '/cmu-b',
		actions: [edit],
		children: [
			{ id: 'reception', label: 'Réception', href: '/reception' },
			{ id: 'instruction', label: 'Instruction', href: '/instruction' },
			{ id: 'revision', label: 'Révision', href: '/revision' },
		],
	},
	{ id: 'cmu-c-as', label: 'CMU-C/AS', href: '/cmu-c-as' },
	{ id: 'ame', label: 'AME', href: '/ame', actions: [settings, edit] },
	{ id: 'at-mp', label: 'AT/MP', href: '/at-mp', actions: [settings, edit] },
]

${onActionScript}
</script>`,
			},
		],
	},
}

export const IconColor: Story = {
	args: {
		iconColor: 'secondary',
		items: [
			{
				id: 'cmu-b',
				label: 'CMU-B',
				href: '/cmu-b',
				icon: mdiShieldCheck,
				actions: [edit],
				children: [
					{ id: 'reception', label: 'Réception', href: '/reception' },
					{ id: 'instruction', label: 'Instruction', href: '/instruction' },
				],
			},
			{ id: 'ame', label: 'AME', href: '/ame', icon: mdiAccount, actions: [settings, edit] },
		],
	},
	parameters: {
		docs: {
			description: {
				story: 'La prop `icon-color` change la couleur de toutes les icônes : icône d\'entrée, actions et chevron (`primary` par défaut).',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<SyNavList
		:items="items"
		label="Dossiers client"
		icon-color="secondary"
		@action="onAction"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { mdiAccount, mdiChevronDown, mdiChevronUp, mdiCog, mdiPencilBox, mdiShieldCheck } from '@mdi/js'
import { SyNavList, type SyNavListAction, type SyNavListItem } from '@cnamts/synapse'

const edit: SyNavListAction = { id: 'edit', icon: mdiPencilBox, label: 'Modifier' }
const settings: SyNavListAction = { id: 'settings', icon: mdiCog, label: 'Paramètres' }

const items: SyNavListItem[] = [
	{
		id: 'cmu-b',
		label: 'CMU-B',
		href: '/cmu-b',
		icon: mdiShieldCheck,
		actions: [edit],
		children: [
			{ id: 'reception', label: 'Réception', href: '/reception' },
			{ id: 'instruction', label: 'Instruction', href: '/instruction' },
		],
	},
	{ id: 'ame', label: 'AME', href: '/ame', icon: mdiAccount, actions: [settings, edit] },
]

${onActionScript}
</script>`,
			},
		],
	},
}

export const SlotActions: Story = {
	args: {
		items: subLevelItems,
	},
	parameters: {
		docs: {
			description: {
				story: 'Le slot `actions` remplace les actions déclarées dans `items`, à tous les niveaux. Il reçoit l\'entrée (`item`). Pour une entrée où il ne rend rien, les actions déclarées dans `items` s\'affichent. L\'intitulé de chaque bouton doit reprendre le nom de l\'entrée.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<SyNavList
		:items="items"
		label="Dossiers client"
	>
		<template #actions="{ item }">
			<SyIconButton
				v-if="item.children?.length"
				:icon="mdiFolderPlus"
				:label="\`Créer un dossier (\${item.label})\`"
				color="primary"
				@click-icon-button="createFolder(item)"
			/>
		</template>
	</SyNavList>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { mdiFolderPlus } from '@mdi/js'
import { SyIconButton, SyNavList, type SyNavListItem } from '@cnamts/synapse'

const items: SyNavListItem[] = [
	{
		id: 'cmu-b',
		label: 'CMU-B',
		href: '/cmu-b',
		children: [
			{ id: 'reception', label: 'Réception', href: '/reception' },
			{ id: 'instruction', label: 'Instruction', href: '/instruction' },
			{ id: 'revision', label: 'Révision', href: '/revision' },
		],
	},
	{ id: 'cmu-c-as', label: 'CMU-C/AS', href: '/cmu-c-as' },
	{ id: 'ame', label: 'AME', href: '/ame' },
]

function createFolder(item: SyNavListItem): void {
	// Création d'un dossier dans « item.label »
}
</script>`,
			},
		],
	},
	render: args => ({
		components: { SyNavList, SyIconButton },
		setup() {
			function createFolder(item: SyNavListItem): void {
				args.onAction?.(item, { id: 'create', icon: mdiFolderPlus, label: 'Créer un dossier' })
			}
			return { args, createFolder, mdiFolderPlus }
		},
		template: `
			<SyNavList v-bind="args">
				<template #actions="{ item }">
					<SyIconButton
						v-if="item.children?.length"
						:icon="mdiFolderPlus"
						:label="\`Créer un dossier (\${item.label})\`"
						color="primary"
						@click-icon-button="createFolder(item)"
					/>
				</template>
			</SyNavList>
		`,
	}),
}

export const InHeaderBar: Story = {
	args: {
		items: dossiersClient,
	},
	parameters: {
		fullPage: true,
		docs: {
			description: {
				story: 'Exemple d\'intégration dans le `HeaderBar` : `SyNavList` est le sous-menu de l\'entrée « Dossiers client », dans une barre de navigation placée dans le slot `append`. Le bouton d\'entrée porte `aria-expanded` et `aria-controls`. Échap ferme d\'abord les sous-niveaux de la liste, puis le sous-menu, et rend le focus au bouton : l\'événement `sub-level-change` indique si un sous-niveau est ouvert. Un clic à l\'extérieur ou la sortie du focus ferment aussi le sous-menu. La liste n\'est montée que sous-menu ouvert : elle repart fermée à chaque ouverture. Le slot `append` est préféré à `header-side` : à droite du header, les sous-niveaux sortiraient de l\'écran.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<HeaderBar
		service-title="Portail Agents"
		:sticky="false"
	>
		<template #append>
			<nav
				aria-label="Navigation principale"
				class="border-t bg-surface"
			>
				<ul
					class="d-flex ga-2 py-1 px-4 px-md-14 mx-auto"
					style="max-width: 1712px; list-style: none"
				>
					<li
						ref="dossiersEntry"
						style="position: relative"
						@keydown.esc="onEscape"
						@focusout="onFocusOut"
					>
						<VBtn
							:aria-expanded="dossiersOpen ? 'true' : 'false'"
							aria-controls="sous-menu-dossiers"
							variant="text"
							color="primary"
							@click="dossiersOpen = !dossiersOpen"
						>
							Dossiers client
							<SyIcon
								:icon="dossiersOpen ? mdiChevronUp : mdiChevronDown"
								class="ml-1"
								decorative
							/>
						</VBtn>
						<div
							v-show="dossiersOpen"
							id="sous-menu-dossiers"
							style="position: absolute; top: 100%; left: 0; z-index: 10; width: min(300px, calc(100vw - 32px))"
						>
							<SyNavList
								v-if="dossiersOpen"
								:items="items"
								label="Dossiers client"
								@action="onAction"
								@sub-level-change="subLevelOpen = $event"
							/>
						</div>
					</li>
				</ul>
			</nav>
		</template>
	</HeaderBar>
	<main
		class="pa-4 px-md-14"
		style="min-height: 420px"
	>
		<h2 class="text-h5 mb-4">
			Accueil
		</h2>
		<p>Contenu de la page.</p>
	</main>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { VBtn } from 'vuetify/components'
import { mdiChevronDown, mdiChevronUp, mdiCog, mdiPencilBox } from '@mdi/js'
import { HeaderBar, SyIcon, SyNavList, type SyNavListAction, type SyNavListItem } from '@cnamts/synapse'

const edit: SyNavListAction = { id: 'edit', icon: mdiPencilBox, label: 'Modifier' }
const settings: SyNavListAction = { id: 'settings', icon: mdiCog, label: 'Paramètres' }

const items: SyNavListItem[] = [
	{
		id: 'droit-de-base',
		label: 'Droit de base',
		href: '/droit-de-base',
		actions: [edit],
		children: [
			{
				id: 'demande-affiliation',
				label: 'Demande d’affiliation',
				href: '/demande-affiliation',
				children: [{ id: 'pieces-justificatives', label: 'Pièces justificatives', href: '/pieces-justificatives' }],
			},
		],
	},
	{
		id: 'cmu-b',
		label: 'CMU-B',
		href: '/cmu-b',
		actions: [edit],
		children: [
			{ id: 'reception', label: 'Réception', href: '/reception' },
			{ id: 'instruction', label: 'Instruction', href: '/instruction' },
			{ id: 'revision', label: 'Révision', href: '/revision' },
		],
	},
	{ id: 'cmu-c-as', label: 'CMU-C/AS', href: '/cmu-c-as' },
	{ id: 'ame', label: 'AME', href: '/ame', actions: [settings, edit] },
	{ id: 'at-mp', label: 'AT/MP', href: '/at-mp', actions: [settings, edit] },
]

const dossiersOpen = ref(false)
const subLevelOpen = ref(false)
const dossiersEntry = ref<HTMLElement | null>(null)

function closeDossiers(returnFocus = false): void {
	dossiersOpen.value = false
	// La liste est démontée avec le sous-menu : elle n'émettra pas sub-level-change.
	subLevelOpen.value = false
	if (returnFocus) dossiersEntry.value?.querySelector('button')?.focus()
}

// Échap ferme d'abord les sous-niveaux de SyNavList (le composant s'en charge), puis le sous-menu.
function onEscape(): void {
	if (!subLevelOpen.value) closeDossiers(true)
}

function onFocusOut(event: FocusEvent): void {
	const next = event.relatedTarget as Node | null
	if (next && !dossiersEntry.value?.contains(next)) closeDossiers()
}

function onDocumentClick(event: MouseEvent): void {
	if (!dossiersEntry.value?.contains(event.target as Node)) closeDossiers()
}

onMounted(() => document.addEventListener('click', onDocumentClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocumentClick))

${onActionScript}
</script>`,
			},
		],
	},
	render: args => ({
		components: { HeaderBar, SyIcon, SyNavList, VBtn },
		setup() {
			const dossiersOpen = ref(false)
			const subLevelOpen = ref(false)
			const dossiersEntry = ref<HTMLElement | null>(null)

			function closeDossiers(returnFocus = false): void {
				dossiersOpen.value = false
				// La liste est démontée avec le sous-menu : elle n'émettra pas sub-level-change.
				subLevelOpen.value = false
				if (returnFocus) dossiersEntry.value?.querySelector('button')?.focus()
			}

			// Échap ferme d'abord les sous-niveaux de SyNavList (le composant s'en charge), puis le sous-menu.
			function onEscape(): void {
				if (!subLevelOpen.value) closeDossiers(true)
			}

			function onFocusOut(event: FocusEvent): void {
				const next = event.relatedTarget as Node | null
				if (next && !dossiersEntry.value?.contains(next)) closeDossiers()
			}

			function onDocumentClick(event: MouseEvent): void {
				if (!dossiersEntry.value?.contains(event.target as Node)) closeDossiers()
			}

			onMounted(() => document.addEventListener('click', onDocumentClick))
			onBeforeUnmount(() => document.removeEventListener('click', onDocumentClick))

			function onAction(item: SyNavListItem, action: SyNavListAction): void {
				args.onAction?.(item, action)
			}

			return { items: args.items, dossiersOpen, subLevelOpen, dossiersEntry, onEscape, onFocusOut, onAction, mdiChevronDown, mdiChevronUp }
		},
		template: `
			<HeaderBar
				service-title="Portail Agents"
				:sticky="false"
			>
				<template #append>
					<nav
						aria-label="Navigation principale"
						class="border-t bg-surface"
					>
						<ul
							class="d-flex ga-2 py-1 px-4 px-md-14 mx-auto"
							style="max-width: 1712px; list-style: none"
						>
							<li
								ref="dossiersEntry"
								style="position: relative"
								@keydown.esc="onEscape"
								@focusout="onFocusOut"
							>
								<VBtn
									:aria-expanded="dossiersOpen ? 'true' : 'false'"
									aria-controls="sous-menu-dossiers"
									variant="text"
									color="primary"
									@click="dossiersOpen = !dossiersOpen"
								>
									Dossiers client
									<SyIcon
										:icon="dossiersOpen ? mdiChevronUp : mdiChevronDown"
										class="ml-1"
										decorative
									/>
								</VBtn>
								<div
									v-show="dossiersOpen"
									id="sous-menu-dossiers"
									style="position: absolute; top: 100%; left: 0; z-index: 10; width: min(300px, calc(100vw - 32px))"
								>
									<SyNavList
										v-if="dossiersOpen"
										:items="items"
										label="Dossiers client"
										@action="onAction"
										@sub-level-change="subLevelOpen = $event"
									/>
								</div>
							</li>
						</ul>
					</nav>
				</template>
			</HeaderBar>
			<main
				class="pa-4 px-md-14"
				style="min-height: 420px"
			>
				<h2 class="text-h5 mb-4">
					Accueil
				</h2>
				<p>Contenu de la page.</p>
			</main>
		`,
	}),
}
