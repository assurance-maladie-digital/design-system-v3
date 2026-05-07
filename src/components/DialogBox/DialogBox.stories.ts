import { type Meta, type StoryObj } from '@storybook/vue3'
import { VBtn } from 'vuetify/components'
import DialogBox from './DialogBox.vue'
import { fn } from '@storybook/test'
import { computed } from 'vue'

const meta: Meta<typeof DialogBox> = {
	title: 'Composants/Feedback/DialogBox',
	component: DialogBox,
	parameters: {
		layout: 'fullscreen',
		docs: {
			controls: {
				exclude: ['cancel', 'confirm', 'update:modelValue'],
			},
		},
	},
	argTypes: {
		'headingLevel': {
			control: { type: 'select' },
			options: [1, 2, 3, 4, 5, 6],
			description: 'Niveau de titre pour le titre de la boîte de dialogue',
		},
		'modelValue': {
			control: 'boolean',
			description: 'Afficher la boîte de dialogue, a utiliser avec `v-model`',
			table: {
				category: 'props',
			},
		},
		'title': {
			control: 'text',
			description: 'Titre de la boîte de dialogue, utilisable en prop ou slot',
			table: {
				type: {
					summary: 'string',
				},
			},
		},
		'default': {
			control: 'text',
			description: 'Contenu de la boîte de dialogue',
			table: {
				type: {
					summary: '{}',
				},
			},
		},
		'actions': {
			control: 'text',
			description: 'Contenu des actions de la boîte de dialogue',
			table: {
				type: {
					summary: '{}',
				},
			},
		},
		'width': {
			control: 'text',
			description: 'Largeur max de la boîte de dialogue',
			table: {
				type: {
					summary: 'string',
				},
			},
		},
		'cancelBtnText': {
			control: 'text',
			description: 'Texte du bouton d\'annulation',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: {
					summary: `'Annuler'`,
				},
			},
		},
		'confirmBtnText': {
			control: 'text',
			description: 'Texte du bouton de confirmation',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: {
					summary: `'Confirmer'`,
				},
			},
		},
		'hideActions': {
			control: 'boolean',
			description: 'Masquer les actions',
			table: {
				type: {
					summary: 'boolean',
				},
			},
		},
		'persistent': {
			control: 'boolean',
			description: 'Masquer le bouton de fermeture',
			table: {
				type: {
					summary: 'boolean',
				},
			},
		},
		'autofocusValidateBtn': {
			control: 'boolean',
			description: 'Focus automatique sur le bouton de validation à l\'ouverture',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: {
					summary: 'false',
				},
			},
		},
		'draggable': {
			control: 'boolean',
			description: 'Rendre la boîte de dialogue déplaçable avec la souris ou les flèches du clavier',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: {
					summary: 'false',
				},
			},
		},
		'vuetifyOptions': {
			control: 'object',
			description: 'Personnalisation des composants Vuetify internes',
			table: {
				category: 'props',
				defaultValue: {
					detail: `
					{
						card: {
							class: 'pa-6',
						},
						cardTitle: {
							class: 'd-flex align-start flex-nowrap pa-0 mb-6 mr-6',
						},
						closeBtn: {
							icon: true,
							elevation: 0,
							width: '32px',
							height: '32px',
							class: 'mt-n2 mr-n2 ml-4',
						},
						cardActions: {
							class: 'd-flex flex-wrap mt-6',
						},
						cancelBtn: {
							color: 'colorPrimary',
							variant: 'text',
						},
						confirmBtn: {
							color: 'colorPrimary',
						},
					}`,
				},
				type: {
					summary: 'Record<string, any>',
					detail: `
					{
	card?: Record<string, any>,
	cardTitle?: Record<string, any>,
	spacer?: Record<string, any>,
	closeBtn?: Record<string, any>,
	icon?: Record<string, any>,
	actionsBtn?: Record<string, any>,
	actionsSpacer?: Record<string, any>,
	cancelBtn?: Record<string, any>,
	confirmBtn?: Record<string, any>,
}
					`,
				},
			},
		},
		'onCancel': {
			description: 'Callback sur annulation',
			table: {
				category: 'events',
			},
		},
		'onConfirm': {
			description: 'Callback sur confirmation',
			table: {
				category: 'events',
			},
		},
		'onUpdate:modelValue': {
			description: 'Callback sur mise à jour de la valeur',
			table: {
				category: 'events',
			},
		},
	},
} satisfies Meta<typeof DialogBox>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		'headingLevel': 2,
		'modelValue': false,
		'title': 'DialogBox title',
		'default': 'DialogBox content',
		'onCancel': fn(),
		'onConfirm': fn(),
		'onUpdate:modelValue': fn(),
	},
	render: (args) => {
		return {
			components: { DialogBox, VBtn },
			setup() {
				const rest = computed(() => {
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					const { default: _, ...rest } = args
					return rest
				})
				return { args, rest }
			},
			template: `
				<div class="pa-4">
					<VBtn
						@click="args.modelValue = !args.modelValue"
                        color="colorPrimary"
					>Toggle DialogBox</VBtn>
					<DialogBox
						v-bind="rest"
						@confirm="args.modelValue = false"
						@cancel="args.modelValue = false"
						@update:modelValue="args.modelValue = $event"
					>
						{{ args.default }}
					</DialogBox>
				</div>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<VBtn
						color="colorPrimary"
						@click="dialogOpen = !dialogOpen"
					>Toggle DialogBox</VBtn>
					<DialogBox
						v-model="dialogOpen"
						title="DialogBox title"
						@confirm="dialogOpen = false"
						@cancel="dialogOpen = false"
					>
						DialogBox content
					</DialogBox>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { DialogBox } from '@cnamts/synapse'
					import { ref } from 'vue'

					const dialogOpen = ref(false)
				</script>
				`,
			},
		],
	},
}

export const ButtonTexts: Story = {
	args: {
		'headingLevel': 2,
		'modelValue': false,
		'title': 'DialogBox title',
		'default': 'DialogBox content',
		'cancelBtnText': 'Retour',
		'confirmBtnText': 'Valider',
		'onCancel': fn(),
		'onConfirm': fn(),
		'onUpdate:modelValue': fn(),
	},
	render: (args) => {
		return {
			components: { DialogBox, VBtn },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
					<VBtn
						@click="args.modelValue = !args.modelValue"
                        color="colorPrimary"
					>Toggle DialogBox</VBtn>
					<DialogBox
						v-bind="args"
						@update:modelValue="args.modelValue = $event"
						@confirm="args.modelValue = false"
						@cancel="args.modelValue = false"
					>
						{{ args.default }}
					</DialogBox>
				</div>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<VBtn
						color="colorPrimary"
						@click="dialogOpen = !dialogOpen"
					>Toggle DialogBox</VBtn>
					<DialogBox
						v-model="dialogOpen"
						title="DialogBox title"
						cancelBtnText="Retour"
						confirmBtnText="Valider"
						@confirm="dialogOpen = false"
						@cancel="dialogOpen = false"
					>
						DialogBox content
					</DialogBox>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { DialogBox } from '@cnamts/synapse'
					import { ref } from 'vue'

					const dialogOpen = ref(false)
				</script>
				`,
			},
		],
	},
}

export const HideActions: Story = {
	args: {
		'modelValue': false,
		'title': 'DialogBox title',
		'default': 'DialogBox content',
		'hideActions': true,
		'onCancel': fn(),
		'onConfirm': fn(),
		'onUpdate:modelValue': fn(),
	},
	render: (args) => {
		return {
			components: { DialogBox, VBtn },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
					<VBtn
						@click="args.modelValue = !args.modelValue"
                        color="colorPrimary"
					>Toggle DialogBox</VBtn>
					<DialogBox
						v-bind="args"
						@update:modelValue="args.modelValue = $event"
					>
						{{ args.default }}
					</DialogBox>
				</div>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<VBtn
						color="colorPrimary"
						@click="dialogOpen = !dialogOpen"
					>Toggle DialogBox</VBtn>
					<DialogBox
						v-model="dialogOpen"
						title="DialogBox title"
						hideActions
					>
						DialogBox content
					</DialogBox>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { DialogBox } from '@cnamts/synapse'
					import { ref } from 'vue'

					const dialogOpen = ref(false)
				</script>
				`,
			},
		],
	},
}

export const Persistent: Story = {
	args: {
		'headingLevel': 2,
		'modelValue': false,
		'title': 'DialogBox title',
		'default': 'DialogBox content',
		'persistent': true,
		'onCancel': fn(),
		'onConfirm': fn(),
		'onUpdate:modelValue': fn(),
	},
	render: (args) => {
		return {
			components: { DialogBox, VBtn },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
					<VBtn
						@click="args.modelValue = !args.modelValue"
                        color="colorPrimary"
					>Toggle DialogBox</VBtn>
					<DialogBox
						v-bind="args"
						@update:modelValue="args.modelValue = $event"
						@confirm="args.modelValue = false"
						@cancel="args.modelValue = false"
					>
						{{ args.default }}
					</DialogBox>
				</div>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<VBtn
						color="colorPrimary"
						@click="dialogOpen = !dialogOpen"
					>Toggle DialogBox</VBtn>
					<DialogBox
						v-model="dialogOpen"
						title="DialogBox title"
						persistent
						@confirm="dialogOpen = false"
						@cancel="dialogOpen = false"
					>
						DialogBox content
					</DialogBox>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { DialogBox } from '@cnamts/synapse'
					import { ref } from 'vue'

					const dialogOpen = ref(false)
				</script>
				`,
			},
		],
	},
}

export const ActionsSlot: Story = {
	args: {
		'modelValue': false,
		'title': 'DialogBox title',
		'default': 'DialogBox content',
		'headingLevel': 2,
		'onCancel': fn(),
		'onConfirm': fn(),
		'onUpdate:modelValue': fn(),
	},
	render: (args) => {
		return {
			components: { DialogBox, VBtn },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
					<VBtn
						@click="args.modelValue = !args.modelValue"
                        color="colorPrimary"
					>Toggle DialogBox</VBtn>
					<DialogBox
						v-bind="args"
						@update:modelValue="args.modelValue = $event"
					>
						<template #actions>
							<VBtn
                                color="colorPrimary"
								@click="args.modelValue = false"
							>Action</VBtn>
						</template>
						{{ args.default }}
					</DialogBox>
				</div>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<VBtn
						color="colorPrimary"
						@click="dialogOpen = !dialogOpen"
					>Toggle DialogBox</VBtn>
					<DialogBox
						v-model="dialogOpen"
						title="DialogBox title"
					>
						<template #actions>
							<VBtn
								color="colorPrimary"
								@click="dialogOpen = false"
							>Action</VBtn>
						</template>
						DialogBox content
					</DialogBox>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { DialogBox } from '@cnamts/synapse'
					import { ref } from 'vue'

					const dialogOpen = ref(false)
				</script>
				`,
			},
		],
	},
}

export const TitleSlot: Story = {
	args: {
		'headingLevel': 2,
		'modelValue': false,
		'default': 'DialogBox content',
		'onCancel': fn(),
		'onConfirm': fn(),
		'onUpdate:modelValue': fn(),
	},
	render: (args) => {
		return {
			components: { DialogBox, VBtn },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
					<VBtn
						@click="args.modelValue = !args.modelValue"
						color="colorPrimary"
					>Toggle DialogBox</VBtn>
					<DialogBox
						v-bind="args"
						@update:modelValue="args.modelValue = $event"
						@confirm="args.modelValue = false"
						@cancel="args.modelValue = false"
					>
						<template #title>
							Title slot
						</template>
						{{ args.default }}
					</DialogBox>
				</div>
			`,
		}
	},
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<VBtn
						color="colorPrimary"
						@click="dialogOpen = !dialogOpen"
					>Toggle DialogBox</VBtn>
					<DialogBox
						v-model="dialogOpen"
					>
						<template #title>
							Title slot
						</template>
						DialogBox content
					</DialogBox>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { DialogBox } from '@cnamts/synapse'
					import { ref } from 'vue'

					const dialogOpen = ref(false)
				</script>
				`,
			},
		],
	},
}

export const Width: Story = {
	args: {
		'headingLevel': 2,
		'modelValue': false,
		'title': 'DialogBox title',
		'default': 'DialogBox content',
		'width': '500px',
		'onCancel': fn(),
		'onConfirm': fn(),
		'onUpdate:modelValue': fn(),
	},
	render: (args) => {
		return {
			components: { DialogBox, VBtn },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
					<VBtn
						@click="args.modelValue = !args.modelValue"
                        color="colorPrimary"
					>Toggle DialogBox</VBtn>
					<DialogBox
						v-bind="args"
						@update:modelValue="args.modelValue = $event"
						@confirm="args.modelValue = false"
						@cancel="args.modelValue = false"
					>
						{{ args.default }}
					</DialogBox>
				</div>
				`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
					<template>
						<VBtn
							color="colorPrimary"
							@click="dialogOpen = !dialogOpen"
						>Toggle DialogBox</VBtn>
						<DialogBox
							v-model="dialogOpen"
							title="DialogBox title"
							width="500px"
							@confirm="dialogOpen = false"
							@cancel="dialogOpen = false"
						>
							DialogBox content
						</DialogBox>
					</template>
					`,
			},
			{
				name: 'Script',
				code: `
					<script setup lang="ts">
						import { DialogBox } from '@cnamts/synapse'
						import { ref } from 'vue'
	
						const dialogOpen = ref(false)
					</script>
					`,
			},
		],
	},
}

export const VuetifyOptions: Story = {
	args: {
		'headingLevel': 2,
		'modelValue': false,
		'title': 'DialogBox title',
		'default': 'DialogBox content',
		'vuetifyOptions': {
			card: {
				rounded: 'xl',
			},
			cardTitle: {
				class: 'pa-5 mb-4 secondary--text',
			},
			closeBtn: {
				class: {
					'd-none': true,
				},
			},
			icon: {
				color: 'secondary',
			},
			cancelBtn: {
				color: 'secondary',
				text: false,
			},
			confirmBtn: {
				color: 'secondary',
				text: true,
			},
		},
		'onCancel': fn(),
		'onConfirm': fn(),
		'onUpdate:modelValue': fn(),
	},
	render: (args) => {
		return {
			components: { DialogBox, VBtn },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
					<VBtn
						@click="args.modelValue = !args.modelValue"
                        color="colorPrimary"
					>Toggle DialogBox</VBtn>
					<DialogBox
						v-bind="args"
						@update:modelValue="args.modelValue = $event"
						@confirm="args.modelValue = false"
						@cancel="args.modelValue = false"
					>
						{{ args.default }}
					</DialogBox>
				</div>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<VBtn
						color="colorPrimary"
						@click="dialogOpen = !dialogOpen"
					>Toggle DialogBox</VBtn>
					<DialogBox
						v-model="dialogOpen"
						title="DialogBox title"
						:vuetify-options="vuetifyOptions"
						@confirm="dialogOpen = false"
						@cancel="dialogOpen = false"
					>
						DialogBox content
					</DialogBox>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { DialogBox } from '@cnamts/synapse'
					import { ref } from 'vue'

					const dialogOpen = ref(false)
					
					const vuetifyOptions = {
						card: {
							rounded: 'xl',
						},
						cardTitle: {
							class: 'pa-5 mb-4 secondary--text',
						},
						closeBtn: {
							class: {
								'd-none': true,
							},
						},
						icon: {
							color: 'secondary',
						},
						cancelBtn: {
							color: 'secondary',
							text: false,
						},
						confirmBtn: {
							color: 'secondary',
							text: true,
						},
					}
				</script>
				`,
			},
		],
	},
}

export const Draggable: Story = {
	args: {
		'headingLevel': 2,
		'modelValue': false,
		'title': 'DialogBox title',
		'default': 'DialogBox content',
		'draggable': true,
		'onCancel': fn(),
		'onConfirm': fn(),
		'onUpdate:modelValue': fn(),
	},
	render: (args) => {
		return {
			components: { DialogBox, VBtn },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
					<VBtn
						@click="args.modelValue = !args.modelValue"
                        color="colorPrimary"
					>Toggle DialogBox</VBtn>
					<DialogBox
						v-bind="args"
						@update:modelValue="args.modelValue = $event"
						@confirm="args.modelValue = false"
						@cancel="args.modelValue = false"
					>
						{{ args.default }}
					</DialogBox>
				</div>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<VBtn
						color="colorPrimary"
						@click="dialogOpen = !dialogOpen"
					>Toggle DialogBox</VBtn>
					<DialogBox
						v-model="dialogOpen"
						title="DialogBox title"
						draggable
						@confirm="dialogOpen = false"
						@cancel="dialogOpen = false"
					>
						DialogBox content
					</DialogBox>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { DialogBox } from '@cnamts/synapse'
					import { ref } from 'vue'

					const dialogOpen = ref(false)
				</script>
				`,
			},
		],
	},
}
