import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'
import { mdiAccountOutline, mdiCogOutline, mdiFileDocumentOutline, mdiFolderPlusOutline, mdiShieldCheckOutline, mdiSquareEditOutline } from '@mdi/js'
import SyIconButton from '@/components/Customs/SyIconButton/SyIconButton.vue'
import SyNavList from './SyNavList.vue'
import type { SyNavListAction, SyNavListItem } from './types'

const edit: SyNavListAction = { id: 'edit', icon: mdiSquareEditOutline, label: 'Modifier' }
const settings: SyNavListAction = { id: 'settings', icon: mdiCogOutline, label: 'Paramètres' }

// Les stories vont de la plus simple à la plus complète : chacune n'ajoute qu'une option.

const simpleItems: SyNavListItem[] = [
	{ id: 'cmu-c-as', label: 'CMU-C/AS', href: '/cmu-c-as' },
	{ id: 'ame', label: 'AME', href: '/ame' },
	{ id: 'at-mp', label: 'AT/MP', href: '/at-mp' },
]

const iconItems: SyNavListItem[] = [
	{ id: 'cmu-c-as', label: 'CMU-C/AS', href: '/cmu-c-as', icon: mdiShieldCheckOutline },
	{ id: 'ame', label: 'AME', href: '/ame', icon: mdiAccountOutline },
	{ id: 'at-mp', label: 'AT/MP', href: '/at-mp', icon: mdiFileDocumentOutline },
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
		() => ({
			setup() {
				// Liens de démonstration : sans cela, un clic quitte Storybook (dans la doc, une ancre #… ouvre l'iframe seule).
				function preventNavigation(event: MouseEvent): void {
					if (event.target instanceof Element && event.target.closest('a')) event.preventDefault()
				}
				return { preventNavigation }
			},
			template: '<div class="pa-4" style="min-height: 360px" @click="preventNavigation"><story /></div>',
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
import { mdiAccountOutline, mdiFileDocumentOutline, mdiShieldCheckOutline } from '@mdi/js'
import { SyNavList, type SyNavListItem } from '@cnamts/synapse'

const items: SyNavListItem[] = [
	{ id: 'cmu-c-as', label: 'CMU-C/AS', href: '/cmu-c-as', icon: mdiShieldCheckOutline },
	{ id: 'ame', label: 'AME', href: '/ame', icon: mdiAccountOutline },
	{ id: 'at-mp', label: 'AT/MP', href: '/at-mp', icon: mdiFileDocumentOutline },
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
import { mdiCogOutline, mdiSquareEditOutline } from '@mdi/js'
import { SyNavList, type SyNavListAction, type SyNavListItem } from '@cnamts/synapse'

const edit: SyNavListAction = { id: 'edit', icon: mdiSquareEditOutline, label: 'Modifier' }
const settings: SyNavListAction = { id: 'settings', icon: mdiCogOutline, label: 'Paramètres' }

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
import { mdiCogOutline, mdiSquareEditOutline } from '@mdi/js'
import { SyNavList, type SyNavListAction, type SyNavListItem } from '@cnamts/synapse'

const edit: SyNavListAction = { id: 'edit', icon: mdiSquareEditOutline, label: 'Modifier' }
const settings: SyNavListAction = { id: 'settings', icon: mdiCogOutline, label: 'Paramètres' }

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
				:icon="mdiFolderPlusOutline"
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
import { mdiFolderPlusOutline } from '@mdi/js'
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
				args.onAction?.(item, { id: 'create', icon: mdiFolderPlusOutline, label: 'Créer un dossier' })
			}
			return { args, createFolder, mdiFolderPlusOutline }
		},
		template: `
			<SyNavList v-bind="args">
				<template #actions="{ item }">
					<SyIconButton
						v-if="item.children?.length"
						:icon="mdiFolderPlusOutline"
						:label="\`Créer un dossier (\${item.label})\`"
						color="primary"
						@click-icon-button="createFolder(item)"
					/>
				</template>
			</SyNavList>
		`,
	}),
}
