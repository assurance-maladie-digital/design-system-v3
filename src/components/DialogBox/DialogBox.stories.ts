import { type Meta, type StoryObj } from '@storybook/vue3'
import { VBtn } from 'vuetify/components'
import DialogBox from './DialogBox.vue'
import { fn } from '@storybook/test'

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
						actionsCtn: {
							class: 'd-flex flex-wrap mt-6',
						},
						cancelBtn: {
							color: 'primary',
							variant: 'text',
						},
						confirmBtn: {
							color: 'primary',
						},
					}`,
				},
				type: {
					summary: 'Record<string, any>',
					detail: `
					{
	card?: Record<string, any>,
	cardTitle?: Record<string, any>,
	closeBtn?: Record<string, any>,
	actionsCtn?: Record<string, any>,
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
				return { args }
			},
			template: `
				<div class="pa-4">
					<VBtn
						@click="args.modelValue = !args.modelValue"
						color="primary"
					>Toggle DialogBox</VBtn>
					<DialogBox
						v-bind="args"
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
						color="primary"
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
						color="primary"
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
						color="primary"
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
						color="primary"
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
						color="primary"
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
						color="primary"
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
						color="primary"
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
						color="primary"
					>Toggle DialogBox</VBtn>
					<DialogBox
						v-bind="args"
						@update:modelValue="args.modelValue = $event"
					>
						<template #actions>
							<VBtn
								color="primary"
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
						color="primary"
						@click="dialogOpen = !dialogOpen"
					>Toggle DialogBox</VBtn>
					<DialogBox
						v-model="dialogOpen"
						title="DialogBox title"
					>
						<template #actions>
							<VBtn
								color="primary"
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
						color="primary"
					>Toggle DialogBox</VBtn>
					<DialogBox
						v-bind="args"
						@update:modelValue="args.modelValue = $event"
						@confirm="args.modelValue = false"
						@cancel="args.modelValue = false"
					>
						<template #title>
							<VBtn
								color="primary"
								@click="args.modelValue = false"
							>Title slot</VBtn>
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
						color="primary"
						@click="dialogOpen = !dialogOpen"
					>Toggle DialogBox</VBtn>
					<DialogBox
						v-model="dialogOpen"
					>
						<template #title>
							<VBtn 
								color="primary"
								@click="dialogOpen = false"
							>Title slot</VBtn>
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
						color="primary"
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
							color="primary"
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
		'modelValue': false,
		'title': 'DialogBox title',
		'default': 'DialogBox content',
		'vuetifyOptions': {
			card: {
				rounded: 'xl',
			},
			cardTitle: {
				class: 'pa-0 mb-4 accent--text',
			},
			closeBtn: {
				class: {
					'd-none': true,
				},
			},
			icon: {
				color: 'accent',
			},
			cancelBtn: {
				color: 'accent',
				text: false,
			},
			confirmBtn: {
				color: 'accent',
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
						color="primary"
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
						color="primary"
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
							class: 'pa-0 mb-4 accent--text',
						},
						closeBtn: {
							class: {
								'd-none': true,
							},
						},
						icon: {
							color: 'accent',
						},
						cancelBtn: {
							color: 'accent',
							text: false,
						},
						confirmBtn: {
							color: 'accent',
							text: true,
						},
					}
				</script>
				`,
			},
		],
	},
}
