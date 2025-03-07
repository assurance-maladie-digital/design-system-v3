import type { Meta, StoryObj } from '@storybook/vue3'
import UploadWorkflow from './UploadWorkflow.vue'
import { fn } from '@storybook/test'
import { VBtn, VSnackbar } from 'vuetify/components'
import { ref } from 'vue'

const meta: Meta<typeof UploadWorkflow> = {
	title: 'Composants/Formulaires/UploadWorkflow',
	component: UploadWorkflow,
	parameters: {
		controls: { exclude: ['update:modelValue', 'error'] },
	},
	argTypes: {
		'modelValue': {
			description: 'La valeur du modèle pour le champ.',
			control: false,
			table: {
				category: 'props',
				type: {
					summary: 'array',
					detail: `{
	id: Readonly<string>
	title: Readonly<string>
	state: 'initial' | 'success' | 'error' | 'loading'
	optional?: Readonly<boolean>
	showPreviewBtn?: Readonly<boolean>
	fileName: string
	file: File
)[]`,
				},
			},
		},
		'uploadList': {
			description: 'La liste des fichiers à uploader.',
			control: 'object',
			table: {
				category: 'props',
				type: {
					summary: 'Array',
					detail: `{
	id: string
	title: string
	state?: 'initial' | 'success' | 'error' | 'loading'
	optional?: boolean
	showPreviewBtn?: boolean
} & ({
	fileName: string
	file: File
} | {
	fileName?: undefined
	file?: undefined
})[]`,
				},
			},
		},
		'showFilePreview': {
			description: 'Active la prévisualisation du fichier avant validation.',
			control: 'boolean',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: {
					summary: 'false',
				},
			},
		},
		'sectionTitle': {
			description: 'Le titre de la section.',
			control: 'text',
			table: {
				category: 'props',
				type: {
					summary: 'string',
				},
			},
		},
		'vuetifyOptions': {
			description: 'Les options pour les composants enfants.',
			control: 'object',
			table: {
				category: 'props',
				type: {
					summary: 'object',
					detail: `{
	fileUpload: Record<string, unknown>
	dialog: Record<string, unknown>
	card: Record<string, unknown>
	select: Record<string, unknown>
	layout: Record<string, unknown>
	cancelBtn: Record<string, unknown>
	confirmBtn: Record<string, unknown>
}`,
				},
				defaultValue: {
					summary: '{}',
					detail: `{
	fileUpload: {
		class: 'mt-6',
	},
	dialog: {
		persistent: true,
		width: '550',
	},
	card: {
		class: 'pa-4',
	},
	select: {
		variant: 'outlined',
		validateOnBlur: true,
		label: 'Nature du fichier',
	},
	layout: {
		wrap: true,
		class: 'mt-2',
	},
	cancelBtn: {
		text: true,
		class: 'mr-4',
		color: 'accent',
	},
	confirmBtn: {
		color: 'accent',
	},
}`,
				},
			},
		},
		'locales': {
			description: 'Les locales pour les textes.',
			control: 'object',
			table: {
				category: 'props',
				type: {
					summary: 'object',
				},
				defaultValue: {
					summary: '{}',
					detail: `{
	title: (plural: boolean): string =>
		\`Document\${plural ? 's' : ''} à nous transmettre\`,
	importTitle: 'Importer des fichiers',
	modalTitle: 'Fichier transmis',
	cancelBtn: 'Retour',
	confirmBtn: 'Confirmer',
}`,
				},
			},
		},
		'maxWidth': {
			description: 'Largeur maximale du composant',
			control: 'text',
			table: {
				type: {
					summary: 'number | string',
				},
				category: 'props',
			},
		},
		'minWidth': {
			description: 'Largeur minimale du composant',
			control: 'text',
			table: {
				type: {
					summary: 'number | string',
				},
				category: 'props',
			},
		},
		'width': {
			description: 'Largeur du composant',
			control: 'text',
			table: {
				type: {
					summary: 'number | string',
				},
				category: 'props',
			},
		},
		'onError': {
			description: 'Événement émis lorsqu\'une erreur survient.',
			table: {
				category: 'events',
				type: {
					summary: 'string[]',
				},
			},
		},
		'onUpdate:modelValue': {
			description: 'Événement émis lorsqu\'un fichier est ajouté ou supprimé.',
			table: {
				category: 'events',
				type: {
					summary: 'Object[]',
					detail: `{
	id: string
	title: string
	state: 'initial' | 'success' | 'error' | 'loading'
	optional?: boolean
	showPreviewBtn?: boolean
	fileName: string
	file: File
}[]`,
				},
			},
		},
		// slots
		'title': {
			description: 'Slot pour le titre de la section.',
			table: {
				category: 'slots',
				type: {
					summary: '{}',
				},
			},
			control: 'text',
		},
		'modal-title': {
			description: 'Slot pour le titre de la modale.',
			table: {
				category: 'slots',
				type: {
					summary: '{}',
				},
			},
			control: 'text',
		},
		'modal-description': {
			description: 'Slot pour la description de la modale.',
			table: {
				category: 'slots',
				type: {
					summary: '{}',
				},
			},
			control: 'text',
		},
		'preview-description': {
			description: 'Slot pour la description de la prévisualisation.',
			table: {
				category: 'slots',
				type: {
					summary: '{}',
				},
			},
			control: 'text',
		},
	},
} satisfies Meta<typeof UploadWorkflow>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		'modelValue': [],
		'uploadList': [
			{
				id: '1',
				title: 'Carte d\'identité',
			},
			{
				id: '2',
				title: 'Facture de soin',
			},
		],
		'onUpdate:modelValue': fn(),
		'onError': fn(),
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<UploadWorkflow
		v-model="files"
		:uploadList="uploadList"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { ref } from 'vue'
	import { UploadWorkflow } from '@cnamts/synapse'

	const files = ref([])

	const uploadList = [
		{
			id: '1',
			title: 'Carte d'identité',
		},
		{
			id: '2',
			title: 'Facture de soin',
		},
	]
</script>`,
			},
		],
	},
}

export const OptionalDocument: Story = {
	args: {
		'modelValue': [],
		'uploadList': [
			{
				id: '1',
				title: 'Carte d\'identité',
			},
			{
				id: '2',
				title: 'Facture de soin',
				optional: true,
			},
			{
				id: '3',
				title: 'Relevé d\'identité bancaire',
				optional: true,
			},
		],
		'onUpdate:modelValue': fn(),
		'onError': fn(),
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<UploadWorkflow
		v-model="files"
		:uploadList="uploadList"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { ref } from 'vue'
	import { UploadWorkflow } from '@cnamts/synapse'

	const files = ref([])
	const uploadList = [
		{
			id: '1',
			title: 'Carte d'identité',
		},
		{
			id: '2',
			title: 'Facture de soin',
			optional: true,
		},
		{
			id: '3',
			title: 'Relevé d'identité bancaire',
			optional: true,
		},
	]
</script>`,
			},
		],
	},
}

export const ManuallySetFile: Story = {
	args: {
		'modelValue': [
			{
				id: '1',
				title: 'Carte d\'identité',
				state: 'success',
				fileName: 'carte_identite.jpg',
				optional: false,
				showPreviewBtn: false,
				file: new File([''], 'carte_identite.jpg', { type: 'image/jpeg' }),
			},
			{
				id: '2',
				title: 'Facture de soin',
				state: 'success',
				fileName: 'facture_soin.pdf',
				optional: false,
				showPreviewBtn: false,
				file: new File([''], 'facture_soin.pdf', { type: 'application/pdf' }),
			},
		],
		'uploadList': [
			{
				id: '1',
				title: 'Carte d\'identité',
			},
			{
				id: '2',
				title: 'Facture de soin',
			},
		],
		'onUpdate:modelValue': fn(),
		'onError': fn(),
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<UploadWorkflow
		v-model="files"
		:uploadList="uploadList"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { ref } from 'vue'
	import { UploadWorkflow } from '@cnamts/synapse'

	const files = ref([
		{
			id: '1',
			title: 'Carte d'identité',
			state: 'success',
			fileName: 'carte_identite.jpg',
			optional: false,
			showPreviewBtn: false,
			file: new File([''], 'carte_identite.jpg', { type: 'image/jpeg' }),
		},
		{
			id: '2',
			title: 'Facture de soin',
			state: 'success',
			fileName: 'facture_soin.pdf',
			optional: false,
			showPreviewBtn: false,
			file: new File([''], 'facture_soin.pdf', { type: 'application/pdf' }),
		},
	])

	const uploadList = [
		{
			id: '1',
			title: 'Carte d'identité',
		},
		{
			id: '2',
			title: 'Facture de soin',
		},
	]
</script>`,
			},
		],
	},
}

export const ManuallySetStates: Story = {
	args: {
		'modelValue': [
			{
				id: '1',
				title: 'Carte d\'identité',
				state: 'error',
				fileName: 'carte_identite.jpg',
				optional: false,
				showPreviewBtn: false,
				file: new File([''], 'carte_identite.jpg', { type: 'image/jpeg' }),
			},
			{
				id: '2',
				title: 'Facture de soin',
				state: 'loading',
				progress: 50,
				fileName: 'facture_soin.pdf',
				optional: false,
				showPreviewBtn: false,
				file: new File([''], 'facture_soin.pdf', { type: 'application/pdf' }),
			},
		],
		'uploadList': [
			{
				id: '1',
				title: 'Carte d\'identité',
			},
			{
				id: '2',
				title: 'Facture de soin',
			},
		],
		'onUpdate:modelValue': fn(),
		'onError': fn(),
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<UploadWorkflow
		v-model="files"
		:uploadList="uploadList"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { ref } from 'vue'
	import { UploadWorkflow } from '@cnamts/synapse'

	const files = ref([
		{
			id: '1',
			title: 'Carte d'identité',
			state: 'error',
			fileName: 'carte_identite.jpg',
			optional: false,
			showPreviewBtn: false,
			file: new File([''], 'carte_identite.jpg', { type: 'image/jpeg' }),
		},
		{
			id: '2',
			title: 'Facture de soin',
			state: 'loading',
			progress: 50,
			fileName: 'facture_soin.pdf',
			optional: false,
			showPreviewBtn: false,
			file: new File([''], 'facture_soin.pdf', { type: 'application/pdf' }),
		},
	])
		
	</script>`,
			},
		],
	},
}

export const OneFile: Story = {
	args: {
		'modelValue': [],
		'uploadList': [
			{
				id: 'ID',
				title: 'Carte d\'identité',
			},
		],
		'onUpdate:modelValue': fn(),
		'onError': fn(),
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<UploadWorkflow
		v-model="files"
		:uploadList="uploadList"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { ref } from 'vue'
	import { UploadWorkflow } from '@cnamts/synapse'

	const files = ref([])
	const uploadList = [
		{
			id: 'ID',
			title: 'Carte d'identité',
		},
	]

</script>`,
			},
		],
	},
}

export const Events: Story = {
	args: {
		'modelValue': [],
		'uploadList': [
			{
				id: 'ID',
				title: 'Carte d\'identité',
			},
			{
				id: 'Bill',
				title: 'Facture de soin',
			},
		],
		'onUpdate:modelValue': fn(),
		'onError': fn(),
	},
	render: (args) => {
		return {
			components: { UploadWorkflow, VSnackbar, VBtn },
			setup() {
				const snackbar = ref(false)
				const snackbarText = ref('')
				const snackbarColor = ref('')
				const options = {
					fileUpload: {
						allowedExtensions: [
							'png',
							'jpg',
							'jpeg',
						],
					},
				}

				function showError(errors: string[]) {
					snackbarText.value = errors.join(', ')
					snackbarColor.value = 'error'
					snackbar.value = true
				}

				function valueUpdated(items: { fileName: string, file: File }[]) {
					if (items.length === 0) {
						return
					}
					snackbarText.value = `Le fichier '"${items.at(-1)!.fileName}"' a été ajouté avec succès.`
					snackbarColor.value = 'success'
					snackbar.value = true
				}
				return { args, snackbar, snackbarText, snackbarColor, options, showError, valueUpdated }
			},
			template: `
			<div>
				<UploadWorkflow
					v-model="args.modelValue"
					:uploadList="args.uploadList"
					:vuetify-options="options"
					@error="[showError, args.onError]"
					@update:modelValue="[valueUpdated, args['onUpdate:modelValue']]"
				/>
				<VSnackbar
					v-model="snackbar"
					:color="snackbarColor"
				>
					{{ snackbarText }}

					<template #action="{ attrs }">
						<VBtn
							v-bind="attrs"
							variant="text"
							@click="snackbar = false"
						>
							Fermer
						</VBtn>
					</template>
				</VSnackbar>
			</div>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<UploadWorkflow
		v-model="files"
		:uploadList="uploadList"
		vuetify-options="options"
		@onError="showError"
		@onUpdate:modelValue="valueUpdated"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { ref } from 'vue'
	import { UploadWorkflow } from '@cnamts/synapse'

	const files = ref([])
	const uploadList = [
		{
			id: 'ID',
			title: 'Carte d'identité',
		},
		{
			id: 'Bill',
			title: 'Facture de soin',
		},
	]

	const options = {
		fileUpload: {
			allowedExtensions: [
				'png',
				'jpg',
				'jpeg'
			]
		}
	}

	function showError (errors: string[]) {
		snackbarText.value = errors.join(', ')
		snackbarColor.value = 'error';
		snackbar.value = true
	}

	function valueUpdated (items: {fileName: string, file: File}[]) {
		if(items.length === 0) {
			return
		}
		snackbarText.value = \`Le fichier "\${items[0].fileName}" a été ajouté avec succès.\`;
		snackbarColor.value = 'success';
		snackbar.value = true
	}
</script>`,
			},
		],
	},
}

export const WithPreviewStep: Story = {
	args: {
		'modelValue': [],
		'uploadList': [
			{
				id: 'ID',
				title: 'Carte d\'identité',
			},
			{
				id: 'Bill',
				title: 'Facture de soin',
			},
		],
		'onUpdate:modelValue': fn(),
		'onError': fn(),
		'showFilePreview': true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<UploadWorkflow
		v-model="files"
		:uploadList="uploadList"
		:showFilePreview="true"
	/>
</template>`,

			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { ref } from 'vue'
	import { UploadWorkflow } from '@cnamts/synapse'

	const files = ref([])
	const uploadList = [
		{
			id: 'ID',
			title: 'Carte d'identité',
		},
		{
			id: 'Bill',
			title: 'Facture de soin',
		},
	]
</script>`,
			},
		],
	},
}
