import type { Meta, StoryObj } from '@storybook/vue3'
import UploadWorkflow from './UploadWorkflow.vue'
import { fn } from '@storybook/test'
import { VBtn, VSnackbar } from 'vuetify/components'
import { ref } from 'vue'

const meta: Meta<typeof UploadWorkflow> = {
	title: 'Composants/Formulaires/UploadWorkflow',
	component: UploadWorkflow,
	parameters: {
		controls: { exclude: ['update:modelValue', 'error', 'preview'] },
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
		'readOnly': {
			description: 'Active le mode lecture seule sur la prévisualisation PDF. Remplace le visualiseur natif du navigateur (avec sa barre d\'outils) par un rendu canvas sans possibilité de téléchargement ni d\'édition.',
			control: 'boolean',
			table: {
				category: 'props',
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
		'headingLevel': {
			description: 'Niveau du titre affiché (utilise role="heading" et aria-level).',
			control: {
				type: 'number',
				min: 1,
				max: 6,
			},
			table: {
				category: 'props',
				type: {
					summary: 'number',
				},
				defaultValue: {
					summary: '4',
				},
			},
		},
		'infoText': {
			description: 'Personnalise le texte affiché dans la zone d’information du composant enfant FileUpload (slot info-text).',
			control: 'text',
			table: {
				category: 'props',
				type: {
					summary: 'string',
				},
				defaultValue: {
					summary: '\'\'',
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
		'onPreview': {
			description: 'Événement émis lors de l\'ouverture d\'une prévisualisation.',
			table: {
				category: 'events',
				type: {
					summary: 'FileItem',
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
					summary: '{ id: string }',
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
		'onPreview': fn(),
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<UploadWorkflow
		v-model="files"
		:upload-list="uploadList"
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
			title: 'Carte d\\'identité',
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
		:upload-list="uploadList"
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
			title: 'Carte d\\'identité',
		},
		{
			id: '2',
			title: 'Facture de soin',
			optional: true,
		},
		{
			id: '3',
			title: 'Relevé d\\'identité bancaire',
			optional: true,
		},
	]
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
		'onPreview': fn(),
		'showFilePreview': true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<UploadWorkflow
		v-model="files"
		:upload-list="uploadList"
		:showFilePreview="true"
		@preview="onPreview"
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
			title: 'Carte d\\'identité',
		},
		{
			id: 'Bill',
			title: 'Facture de soin',
		},
	]

	function onPreview(fileItem: unknown) {
		console.log('preview', fileItem)
	}
</script>`,
			},
		],
	},
}

export const WithPreviewStepReadOnly: Story = {
	args: {
		'modelValue': [],
		'uploadList': [
			{
				id: 'ID',
				title: 'Courrier à destination de l\'assuré',
			},
		],
		'vuetifyOptions': {
			fileUpload: {
				allowedExtensions: ['pdf'],
			},
		},
		'onUpdate:modelValue': fn(),
		'onError': fn(),
		'onPreview': fn(),
		'showFilePreview': true,
		'readOnly': true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<UploadWorkflow
		v-model="files"
		:upload-list="uploadList"
		:vuetify-options="options"
		:show-file-preview="true"
		:read-only="true"
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
			title: 'Courrier à destination de l\\'assuré',
		},
	]

	const options = {
		fileUpload: {
			allowedExtensions: ['pdf'],
		},
	}
</script>`,
			},
		],
	},
}

export const WithInfoText: Story = {
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
		'infoText': 'Vous pouvez déposer vos fichiers ici. Formats acceptés : PDF, JPG, PNG.',
		'onUpdate:modelValue': fn(),
		'onError': fn(),
		'onPreview': fn(),
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<UploadWorkflow
		v-model="files"
		:upload-list="uploadList"
		info-text="Vous pouvez déposer vos fichiers ici. Formats acceptés : PDF, JPG, PNG."
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
		{ id: '1', title: 'Carte d\\'identité' },
		{ id: '2', title: 'Facture de soin' },
	]
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
		:upload-list="uploadList"
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
			title: 'Carte d\\'identité',
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
				showPreviewBtn: true,
			},
			{
				id: 'Bill',
				title: 'Facture de soin',
				showPreviewBtn: true,
			},
		],
		'onUpdate:modelValue': fn(),
		'onError': fn(),
		'onPreview': fn(),
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
					snackbarText.value = `Le fichier "${items.at(-1)!.fileName}" a été ajouté avec succès.`
					snackbarColor.value = 'success'
					snackbar.value = true
				}
				return { args, snackbar, snackbarText, snackbarColor, options, showError, valueUpdated }
			},
			template: `
			<div>
				<UploadWorkflow
					v-model="args.modelValue"
					:upload-list="args.uploadList"
					:vuetify-options="options"
					@error="[showError, args.onError]"
					@preview="args.onPreview"
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
		:upload-list="uploadList"
		vuetify-options="options"
		@onError="showError"
		@onPreview="onPreview"
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
			title: 'Carte d\\'identité',
			showPreviewBtn: true,
		},
		{
			id: 'Bill',
			title: 'Facture de soin',
			showPreviewBtn: true,
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

	function showError(errors: string[]) {
		snackbarText.value = errors.join(', ')
		snackbarColor.value = 'error';
		snackbar.value = true
	}

	function valueUpdated(items: { fileName: string, file: File }[]) {
		if(items.length === 0) {
			return
		}
		snackbarText.value = \`Le fichier "\${items[0].fileName}" a été ajouté avec succès.\`;
		snackbarColor.value = 'success';
		snackbar.value = true
	}

	function onPreview(fileItem: unknown) {
		console.log('preview', fileItem)
	}
</script>`,
			},
		],
	},
}

export const Slots: Story = {
	args: {
		'modelValue': [],
		'uploadList': [
			{
				id: 'ID',
				title: 'Carte d\'identité',
				showPreviewBtn: true,
			},
			{
				id: 'Bill',
				title: 'Facture de soin',
				showPreviewBtn: true,
			},
		],
		'onUpdate:modelValue': fn(),
		'onError': fn(),
	},
	render: (args) => {
		return {
			components: { UploadWorkflow },
			setup() {
				return { args }
			},
			template: `
			<UploadWorkflow
				v-model="args.modelValue"
				:upload-list="args.uploadList"
			>
				<template #title>
					<h2>Title slot</h2>
				</template>
				<template #modal-title>
					<h2>Modal Title slot</h2>
				</template>
				<template #modal-description>
					<p>Modal Description slot</p>
				</template>
				<template #preview-description>
					<p>Preview Description slot</p>
				</template>
			</UploadWorkflow>
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
		:upload-list="uploadList"
	>
		<template #title>
			<h2>Title slot</h2>
		</template>
		<template #modal-title>
			<h2>Modal Title slot</h2>
		</template>
		<template #modal-description>
			<p>Modal Description slot</p>
		</template>
		<template #preview-description>
			<p>Preview Description slot</p>
		</template>
	</UploadWorkflow>
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
			title: 'Carte d\\'identité',
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

export const Customization: Story = {
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
		'vuetifyOptions': {
			fileUpload: {
				allowedExtensions: [
					'pdf',
				],
			},
			select: {
				variant: 'solo-filled',
			},
			dialog: {
				width: '400px',
			},
		},
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
		:upload-list="uploadList"
		:vuetify-options="options"
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
			title: 'Carte d\\'identité',
		},
		{
			id: '2',
			title: 'Facture de soin',
		},
	]

	const options = {
		fileUpload: {
			allowedExtensions: [
				'pdf',
			],
		},
		select: {
			variant: 'solo-filled',
		},
		dialog: {
			width: '400px',
		},
	}
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
		:upload-list="uploadList"
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
			title: 'Carte d\\'identité',
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
			title: 'Carte d\\'identité',
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
		:upload-list="uploadList"
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
			title: 'Carte d\\'identité',
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
