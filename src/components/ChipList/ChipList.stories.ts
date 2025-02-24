import type { Meta, StoryObj } from '@storybook/vue3'
import ChipList from './ChipList.vue'
import { mdiAccount } from '@mdi/js'
import type { ChipItem } from './types'

const meta = {
	title: 'Composants/Données/ChipList',
	component: ChipList,
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['copy'] },
	},
	argTypes: {
		items: {
			description: 'Liste des éléments à afficher',
			control: { type: 'object' },
			table: {
				type: { summary: 'ChipItem[]' },
				defaultValue: { summary: '[]' },
			},
		},
		overflowLimit: {
			description: 'Nombre maximum d\'éléments avant débordement',
			control: { type: 'number', min: 1 },
			table: {
				type: { summary: 'number' },
				defaultValue: { summary: '4' },
			},
		},
		readonly: {
			description: 'Désactive la possibilité de supprimer des éléments',
			control: { type: 'boolean' },
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		resetText: {
			description: 'Texte personnalisé pour le bouton de réinitialisation',
			control: { type: 'text' },
			table: {
				type: { summary: 'string' },
				defaultValue: { summary: 'undefined' },
			},
		},
		remove: {
			description: 'Événement émis lors de la suppression d\'un élément',
			table: {
				type: { summary: '(item: ChipItem) => void' },
			},
			action: 'remove',
		},
		reset: {
			description: 'Événement émis lors de la réinitialisation',
			table: {
				type: { summary: '() => void' },
			},
			action: 'reset',
		},
		displayPrependStateIcon: {
			description: 'Affiche l\'icône d\'état au début du chip',
			control: { type: 'boolean' },
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		displayAppendStateIcon: {
			description: 'Affiche l\'icône d\'état à la fin du chip',
			control: { type: 'boolean' },
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		customIcon: {
			description: 'Icône personnalisée qui remplace l\'icône d\'état',
			control: { type: 'text' },
			table: {
				type: { summary: 'string' },
				defaultValue: { summary: 'undefined' },
			},
		},
	},
} satisfies Meta<typeof ChipList>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
	<ChipList
		:items="args.items"
		:overflow-limit="args.overflowLimit"
	/>
</template>
                `,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
   import ChipList from '@/components/ChipList/ChipList.vue'
	const items = [
		{
			text: 'Email',
			value: 'email',
			state: '',
		},
		{
			text: 'Courrier',
			value: 'courrier',
			state: '',

		},
		{
			text: 'SMS',
			value: 'sms',
			state: '',
		},

		{
			text: 'Telephone',
			value: 'telephone',
			state: '',
		},

	]
    
</script>
                `,
			},
		],
	},
	args: {
		items: [
			{
				text: 'Email',
				value: 'email',
				state: '',
			},
			{
				text: 'Courrier',
				value: 'courrier',
				state: '',

			},
			{
				text: 'SMS',
				value: 'sms',
				state: '',
			},

			{
				text: 'Telephone',
				value: 'telephone',
				state: '',
			},
		],
		overflowLimit: 5,
	},
	render: (args) => {
		return {
			components: { ChipList },
			setup() {
				return { args }
			},
			template: `
			<ChipList
		:items="args.items"
		:overflow-limit="args.overflowLimit"
	/>
            `,
		}
	},
}

export const Success: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
	<ChipList
		:items="args.items"
		:overflow-limit="args.overflowLimit"
	/>
</template>
                `,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
   import ChipList from '@/components/ChipList/ChipList.vue'
	const items = [
		{
			text: 'Email',
			value: 'email',
			state: 'success',
		},
		{
			text: 'Courrier',
			value: 'courrier',
			state: 'success',

		},
		{
			text: 'SMS',
			value: 'sms',
			state: 'success',
		},

		{
			text: 'Telephone',
			value: 'telephone',
			state: 'success',
		},

	]
    
</script>
                `,
			},
		],
	},
	args: {
		items: [
			{
				text: 'Email',
				value: 'email',
				state: 'success',
			},
			{
				text: 'Courrier',
				value: 'courrier',
				state: 'success',

			},
			{
				text: 'SMS',
				value: 'sms',
				state: 'success',
			},

			{
				text: 'Telephone',
				value: 'telephone',
				state: 'success',
			},
		],
		overflowLimit: 5,
	},
	render: (args) => {
		return {
			components: { ChipList },
			setup() {
				return { args }
			},
			template: `
			<ChipList
		:items="args.items"
		:overflow-limit="args.overflowLimit"
	/>
            `,
		}
	},
}

export const Info: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
	<ChipList
		:items="args.items"
		:overflow-limit="args.overflowLimit"
	/>
</template>
                `,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
   import ChipList from '@/components/ChipList/ChipList.vue'
	const items = [
		{
			text: 'Email',
			value: 'email',
			state: 'info',
		},
		{
			text: 'Courrier',
			value: 'courrier',
			state: 'info',

		},
		{
			text: 'SMS',
			value: 'sms',
			state: 'info',
		},

		{
			text: 'Telephone',
			value: 'telephone',
			state: 'info',
		},

	]
    
</script>
                `,
			},
		],
	},
	args: {
		items: [
			{
				text: 'Email',
				value: 'email',
				state: 'info',
			},
			{
				text: 'Courrier',
				value: 'courrier',
				state: 'info',

			},
			{
				text: 'SMS',
				value: 'sms',
				state: 'info',
			},

			{
				text: 'Telephone',
				value: 'telephone',
				state: 'info',
			},
		],
		overflowLimit: 5,
	},
	render: (args) => {
		return {
			components: { ChipList },
			setup() {
				return { args }
			},
			template: `
			<ChipList
		:items="args.items"
		:overflow-limit="args.overflowLimit"
	/>
            `,
		}
	},
}

export const Warning: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
	<ChipList
		:items="args.items"
		:overflow-limit="args.overflowLimit"
	/>
</template>
                `,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
   import ChipList from '@/components/ChipList/ChipList.vue'
	const items = [
		{
			text: 'Email',
			value: 'email',
			state: 'warning',
		},
		{
			text: 'Courrier',
			value: 'courrier',
			state: 'warning',

		},
		{
			text: 'SMS',
			value: 'sms',
			state: 'warning',
		},

		{
			text: 'Telephone',
			value: 'telephone',
			state: 'warning',
		},

	]
    
</script>
                `,
			},
		],
	},
	args: {
		items: [
			{
				text: 'Email',
				value: 'email',
				state: 'warning',
			},
			{
				text: 'Courrier',
				value: 'courrier',
				state: 'warning',

			},
			{
				text: 'SMS',
				value: 'sms',
				state: 'warning',
			},

			{
				text: 'Telephone',
				value: 'telephone',
				state: 'warning',
			},
		],
		overflowLimit: 5,
	},
	render: (args) => {
		return {
			components: { ChipList },
			setup() {
				return { args }
			},
			template: `
			<ChipList
		:items="args.items"
		:overflow-limit="args.overflowLimit"
	/>
            `,
		}
	},
}

export const Error: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
	<ChipList
		:items="args.items"
		:overflow-limit="args.overflowLimit"
	/>
</template>
                `,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
   import ChipList from '@/components/ChipList/ChipList.vue'
	const items = [
		{
			text: 'Email',
			value: 'email',
			state: 'error',
		},
		{
			text: 'Courrier',
			value: 'courrier',
			state: 'error',

		},
		{
			text: 'SMS',
			value: 'sms',
			state: 'error',
		},

		{
			text: 'Telephone',
			value: 'telephone',
			state: 'error',
		},

	]
    
</script>
                `,
			},
		],
	},
	args: {
		items: [
			{
				text: 'Email',
				value: 'email',
				state: 'error',
			},
			{
				text: 'Courrier',
				value: 'courrier',
				state: 'error',

			},
			{
				text: 'SMS',
				value: 'sms',
				state: 'error',
			},

			{
				text: 'Telephone',
				value: 'telephone',
				state: 'error',
			},
		],
		overflowLimit: 5,
	},
	render: (args) => {
		return {
			components: { ChipList },
			setup() {
				return { args }
			},
			template: `
			<ChipList
		:items="args.items"
		:overflow-limit="args.overflowLimit"
	/>
            `,
		}
	},
}

export const ReadOnly: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<ChipList
		:items="args.items"
		:overflow-limit="args.overflowLimit"
		:readonly="true"
	/>
</template>
				`,
			},
		],
	},
	args: {
		items: [
			{
				text: 'Email',
				value: 'email',
				state: 'success',
			},
			{
				text: 'SMS',
				value: 'sms',
				state: 'info',
			},
			{
				text: 'Téléphone',
				value: 'telephone',
				state: 'warning',
			},
		],
		overflowLimit: 5,
		readonly: true,
	},
	render: args => ({
		components: { ChipList },
		setup() {
			return { args }
		},
		template: `
			<ChipList
				:items="args.items"
				:overflow-limit="args.overflowLimit"
				:readonly="args.readonly"
			/>
		`,
	}),
}

export const CustomResetText: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<ChipList
		:items="args.items"
		:overflow-limit="args.overflowLimit"
		reset-text="Tout effacer"
	/>
</template>
				`,
			},
		],
	},
	args: {
		items: [
			{
				text: 'Email',
				value: 'email',
				state: 'success',
			},
			{
				text: 'SMS',
				value: 'sms',
				state: 'info',
			},
		],
		overflowLimit: 5,
		resetText: 'Tout effacer',
	},
	render: args => ({
		components: { ChipList },
		setup() {
			return { args }
		},
		template: `
			<ChipList
				:items="args.items"
				:overflow-limit="args.overflowLimit"
				:reset-text="args.resetText"
			/>
		`,
	}),
}

export const WithOverflow: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<ChipList
		:items="args.items"
		:overflow-limit="3"
	/>
</template>
				`,
			},
		],
	},
	args: {
		items: [
			{
				text: 'Email',
				value: 'email',
				state: 'success',
			},
			{
				text: 'SMS',
				value: 'sms',
				state: 'info',
			},
			{
				text: 'Téléphone',
				value: 'telephone',
				state: 'warning',
			},
			{
				text: 'Courrier',
				value: 'mail',
				state: 'error',
			},
			{
				text: 'Notification',
				value: 'notification',
				state: '',
			},
		],
		overflowLimit: 3,
	},
	render: args => ({
		components: { ChipList },
		setup() {
			return { args }
		},
		template: `
			<ChipList
				:items="args.items"
				:overflow-limit="args.overflowLimit"
			/>
		`,
	}),
}

export const WithEvents: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<ChipList
		:items="items"
		@remove="handleRemove"
		@reset="handleReset"
	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import ChipList from '@/components/ChipList/ChipList.vue'
import type { ChipItem } from './types'

const items = [
	{
		text: 'Email',
		value: 'email',
		state: 'success',
	},
	{
		text: 'SMS',
		value: 'sms',
		state: 'info',
	},
	{
		text: 'Téléphone',
		value: 'telephone',
		state: 'warning',
	},
	{
		text: 'Courrier',
		value: 'mail',
		state: 'error',
	},
]

const handleRemove = (item: ChipItem) => {
	window.alert(\`Élément supprimé : \${item.text}\`)
}

const handleReset = () => {
	window.alert('Liste réinitialisée')
}
</script>
				`,
			},
		],
		docs: {
			description: {
				story: 'Cette story démontre les événements émis par le composant ChipList. Une alerte s\'affiche lors de la suppression d\'un élément ou de la réinitialisation de la liste.',
			},
		},
	},
	args: {
		items: [
			{
				text: 'Email',
				value: 'email',
				state: 'success',
			},
			{
				text: 'SMS',
				value: 'sms',
				state: 'info',
			},
			{
				text: 'Téléphone',
				value: 'telephone',
				state: 'warning',
			},
			{
				text: 'Courrier',
				value: 'mail',
				state: 'error',
			},
		],
	},
	render: args => ({
		components: { ChipList },
		setup() {
			const handleRemove = (item: ChipItem) => {
				window.alert(`Élément supprimé : ${item.text}`)
			}

			const handleReset = () => {
				window.alert('Liste réinitialisée')
			}

			return {
				args,
				handleRemove,
				handleReset,
			}
		},
		template: `
			<ChipList
				v-bind="args"
				@remove="handleRemove"
				@reset="handleReset"
			/>
		`,
	}),
}

export const WithPrependStateIcon: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<ChipList
		:items="items"
		:display-prepend-state-icon="true"
	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import ChipList from '@/components/ChipList/ChipList.vue'

const items = [
	{
		text: 'Email',
		value: 'email',
		state: 'success',
	},
	{
		text: 'SMS',
		value: 'sms',
		state: 'info',
	},
	{
		text: 'Téléphone',
		value: 'telephone',
		state: 'warning',
	},
	{
		text: 'Courrier',
		value: 'mail',
		state: 'error',
	},
]
</script>
				`,
			},
		],
		docs: {
			description: {
				story: 'Cette story montre les chips avec une icône d\'état au début. L\'icône change en fonction de l\'état du chip.',
			},
		},
	},
	args: {
		items: [
			{
				text: 'Email',
				value: 'email',
				state: 'success',
			},
			{
				text: 'SMS',
				value: 'sms',
				state: 'info',
			},
			{
				text: 'Téléphone',
				value: 'telephone',
				state: 'warning',
			},
			{
				text: 'Courrier',
				value: 'mail',
				state: 'error',
			},
		],
		displayPrependStateIcon: true,
	},
}

export const WithAppendStateIcon: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<ChipList
		:items="items"
		:display-append-state-icon="true"
	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import ChipList from '@/components/ChipList/ChipList.vue'

const items = [
	{
		text: 'Email',
		value: 'email',
		state: 'success',
	},
	{
		text: 'SMS',
		value: 'sms',
		state: 'info',
	},
	{
		text: 'Téléphone',
		value: 'telephone',
		state: 'warning',
	},
	{
		text: 'Courrier',
		value: 'mail',
		state: 'error',
	},
]
</script>
				`,
			},
		],
		docs: {
			description: {
				story: 'Cette story montre les chips avec une icône d\'état à la fin. L\'icône change en fonction de l\'état du chip.',
			},
		},
	},
	args: {
		items: [
			{
				text: 'Email',
				value: 'email',
				state: 'success',
			},
			{
				text: 'SMS',
				value: 'sms',
				state: 'info',
			},
			{
				text: 'Téléphone',
				value: 'telephone',
				state: 'warning',
			},
			{
				text: 'Courrier',
				value: 'mail',
				state: 'error',
			},
		],
		displayAppendStateIcon: true,
	},
}

export const WithCustomIcon: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<ChipList
		:items="items"
		:display-prepend-state-icon="true"
		:custom-icon="mdiHeart"
	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import ChipList from '@/components/ChipList/ChipList.vue'
import { mdiStar } from '@mdi/js'

const items = [
	{
		text: 'Email',
		value: 'email',
		state: 'success',
	},
	{
		text: 'SMS',
		value: 'sms',
		state: 'info',
	},
	{
		text: 'Téléphone',
		value: 'telephone',
		state: 'warning',
	},
	{
		text: 'Courrier',
		value: 'mail',
		state: 'error',
	},
]
</script>
				`,
			},
		],
		docs: {
			description: {
				story: 'Cette story montre les chips avec une icône personnalisée (étoile) qui remplace les icônes d\'état par défaut.',
			},
		},
	},
	args: {
		items: [
			{
				text: 'Email',
				value: 'email',
				state: 'success',
			},
			{
				text: 'SMS',
				value: 'sms',
				state: 'info',
			},
			{
				text: 'Téléphone',
				value: 'telephone',
				state: 'warning',
			},
			{
				text: 'Courrier',
				value: 'mail',
				state: 'error',
			},
		],
		displayPrependStateIcon: true,
		displayAppendStateIcon: false,
		customIcon: mdiAccount,
	},
}
