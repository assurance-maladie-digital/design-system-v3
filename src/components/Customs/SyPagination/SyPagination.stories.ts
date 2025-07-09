import type { Meta, StoryObj } from '@storybook/vue3'
import SyPagination from '@/components/Customs/SyPagination/SyPagination.vue'
import { ref, computed } from 'vue'
import { fn } from '@storybook/test'

const meta: Meta<typeof SyPagination> = {
	title: 'Composants/Navigation/SyPagination',
	component: SyPagination,
	parameters: {
		layout: 'centered',
	},
	argTypes: {
		'modelValue': {
			control: 'number',
			description: 'Numéro de la page actuelle',
		},

		'visible': {
			control: 'number',
			description: 'Nombre de boutons visibles',
		},
		'label': {
			control: 'text',
			description: 'Label pour la navigation de pagination (utilisé pour l\'accessibilité)',
		},
		'first-page': {
			description: 'Slot pour personnaliser le bouton de première page',
		},
		'previous': {
			description: 'Slot pour personnaliser le bouton de page précédente',
		},
		'next': {
			description: 'Slot pour personnaliser le bouton de page suivante',
		},
		'last-page': {
			description: 'Slot pour personnaliser le bouton de dernière page',
		},
		'prepend': {
			description: 'Slot pour ajouter du contenu avant la pagination',
		},
		'append': {
			description: 'Slot pour ajouter du contenu après la pagination',
		},
	},
} as Meta<typeof SyPagination>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Lorsque le nombre total de pages est faible, toutes les pages sont affichées sans ellipses.',
			},
		},
	},
	args: {
		'modelValue': 1,
		'pages': 5,
		'visible': 5,
		'onUpdate:modelValue': fn(),
	},
	render: args => ({
		components: { SyPagination },
		setup() {
			const currentPage = ref(args.modelValue)
			return { args, currentPage }
		},
		template: `
			<div>
				<p>Page actuelle: {{ currentPage }}</p>
				<SyPagination
					v-model="currentPage"
					:pages="args.pages"
					:visible="args.visible"
					:label="args.label"
					@update:model-value="args['onUpdate:modelValue']"
				/>
			</div>
		`,
	}),
}

export const ManyPages: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Lorsque le nombre total de pages est élevé, des ellipses sont affichées pour indiquer les pages masquées.',
			},
		},
	},
	args: {
		'modelValue': 5,
		'pages': 20,
		'visible': 5,
		'onUpdate:modelValue': fn(),
	},
	render: args => ({
		components: { SyPagination },
		setup() {
			const currentPage = ref(args.modelValue)
			return { args, currentPage }
		},
		template: `
			<div>
				<p>Page actuelle: {{ currentPage }}</p>
				<SyPagination
					v-model="currentPage"
					:pages="args.pages"
					:visible="args.visible"
					:label="args.label"
					@update:model-value="args['onUpdate:modelValue']"
				/>
			</div>
		`,
	}),
}

export const CustomButtons: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Les boutons de navigation peuvent être personnalisés à l\'aide de slots.',
			},
		},
	},
	args: {
		'modelValue': 5,
		'pages': 20,
		'visible': 5,
		'onUpdate:modelValue': fn(),
	},
	render: args => ({
		components: { SyPagination },
		setup() {
			const currentPage = ref(args.modelValue)
			return { args, currentPage }
		},
		template: `
			<div>
				<p>Page actuelle: {{ currentPage }}</p>
				<SyPagination
					v-model="currentPage"
					:pages="args.pages"
					:visible="args.visible"
					:label="args.label"
					@update:model-value="args['onUpdate:modelValue']"
				>
					<template #first-page>
						<span>⏮️</span>
					</template>
					<template #previous>
						<span>◀️</span>
					</template>
					<template #next>
						<span>▶️</span>
					</template>
					<template #last-page>
						<span>⏭️</span>
					</template>
				</SyPagination>
			</div>
		`,
	}),
}

export const Slots: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Vous pouvez ajouter du contenu avant ou après la pagination à l\'aide des slots `prepend` et `append`.',
			},
		},
	},
	args: {
		'modelValue': 3,
		'pages': 10,
		'visible': 5,
		'onUpdate:modelValue': fn(),
	},
	render: args => ({
		components: { SyPagination },
		setup() {
			const currentPage = ref(args.modelValue)
			const itemsPerPage = 10
			const totalItems = 100

			const startItem = computed(() => (currentPage.value - 1) * itemsPerPage + 1)
			const endItem = computed(() => Math.min(currentPage.value * itemsPerPage, totalItems))

			return { args, currentPage, totalItems, startItem, endItem }
		},
		template: `
			<div>
				<SyPagination
					v-model="currentPage"
					:pages="args.pages"
					:visible="args.visible"
					:label="args.label"
					@update:model-value="args['onUpdate:modelValue']"
				>
					<template #prepend>
						<div class="info-text">
							Éléments {{ startItem }}-{{ endItem }} sur {{ totalItems }}
						</div>
					</template>
				</SyPagination>
			</div>
		`,
	}),
}
