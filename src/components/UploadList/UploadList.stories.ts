import type { Meta, StoryObj } from '@storybook/vue3'
import UploadList from './UploadList.vue'
import { fn } from '@storybook/test'
import { VIcon } from 'vuetify/components'
import { mdiCardAccountDetailsOutline, mdiCertificateOutline } from '@mdi/js'

const meta = {
	title: 'Composants/Formulaires/UploadList',
	component: UploadList,
	argTypes: {
		'uploadList': {
			description: 'Liste des fichiers à uploader',
			control: 'object',
			table: {
				type: {
					summary: 'Object[]',
					detail: `Array<{
	id: string,
	title: string,
	state: 'initial' | 'success' | 'error' | 'loading'
	fileName?: string,
	optional?: boolean,
	progress?: number,
	showUploadBtn?: boolean
	showPreviewBtn?: boolean
	showDeleteBtn?: boolean
}>`,
				},
				category: 'props',
			},
		},
		'locales': {
			description: 'Traductions',
			control: false,
			table: {
				category: 'props',
				type: {
					summary: undefined,
				},
				defaultValue: {
					summary: `Locales`,
					detail: `{
	optionalDocument: 'Document facultatif',
	see: 'Voir',
	delete: 'Supprimer',
	uploading: 'En cours',
	success: 'Téléchargé',
	error: 'Erreur',
	errorOccurred: 'Une erreur est survenue pendant le téléchargement.',
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
		'onUpload': {
			description: 'Événement déclenché lors du clic sur le bouton d\'upload',
			action: 'upload',
			table: {
				category: 'events',
				type: {
					summary: 'Object',
					detail: `{
	id: string,
	title: string,
	state: 'initial' | 'error',
	fileName: undefined,
	optional?: boolean,
	progress?: number,
	showUploadBtn: true
	showPreviewBtn?: boolean
	showDeleteBtn?: boolean
}`,
				},
			},
		},
		'onDelete': {
			description: 'Événement déclenché lors du clic sur le bouton de suppression',
			action: 'delete',
			table: {
				category: 'events',
				type: {
					summary: 'Object',
					detail: `{
	id: string,
	title: string,
	state: 'success',
	fileName?: string,
	optional?: boolean,
	showUploadBtn?: boolean
	showPreviewBtn?: boolean
	showDeleteBtn: true
}`,
				},
			},
		},
		'onPreview': {
			description: 'Événement déclenché lors du clic sur le bouton de prévisualisation',
			action: 'preview',
			table: {
				category: 'events',
				type: {
					summary: 'Object',
					detail: `{
	id: string,
	title: string,
	state: 'success',
	fileName: string,
	optional?: boolean,
	showUploadBtn?: boolean
	showPreviewBtn: true
	showDeleteBtn?: boolean
}`,
				},
			},
		},
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore - 'file-icon-${item.id}' storybook can't infer dynamic slot name
		'file-icon-${item.id}': {
			description: 'Icône du fichier',
			control: 'none',
			table: {
				category: 'slots',
				type: {
					summary: 'Object',
					detail: `{
	state: 'initial' | 'success' | 'error' | 'loading',
`,
				},
			},
		},
	},
	parameters: {
		controls: {
			exclude: ['upload', 'preview', 'delete', '`file-icon-${item.id}`'],
		},
	},
} satisfies Meta<typeof UploadList>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		uploadList: [
			{
				id: 'residenceCertificate',
				title: 'Attestation de domicile',
				state: 'initial',
			},
			{
				id: 'identityCard',
				title: 'Carte d\'identité',
				state: 'initial',
			},
			{
				id: 'paySlip',
				title: 'Fiche de paie',
				state: 'initial',
			},
		],
		onUpload: fn(),
		onDelete: fn(),
		onPreview: fn(),
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<UploadList
		:uploadList="uploadList"
	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { UploadList } from '@cnamts/synapse'
import { ref } from 'vue'

const uploadList = ref([
	{
		id: 'residenceCertificate',
		title: 'Attestation de domicile',
		state: 'initial',
	},
	{
		id: 'identityCard',
		title: 'Carte d\\'identité',
		state: 'initial',
	},
	{
		id: 'paySlip',
		title: 'Fiche de paie',
		state: 'initial',
	},
])

</script>
				`,
			},
		],
	},

}

export const States: Story = {
	args: {
		uploadList: [
			{
				id: 'residenceCertificate',
				title: 'Attestation de domicile',
				fileName: 'file1.jpg',
				state: 'success',
			},
			{
				id: 'identityCard',
				title: 'Carte d\'identité',
				state: 'loading',
			},
			{
				id: 'paySlip',
				title: 'Fiche de paie',
				state: 'error',
			},
		],
		onUpload: fn(),
		onDelete: fn(),
		onPreview: fn(),
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<UploadList
		:uploadList="uploadList"
	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { UploadList } from '@cnamts/synapse'
import { ref } from 'vue'

const uploadList = ref([
	{
		id: 'residenceCertificate',
		title: 'Attestation de domicile',
		fileName: 'file1.jpg',
		state: 'success',
	},
	{
		id: 'identityCard',
		title: 'Carte d\\'identité',
		state: 'loading',
	},
	{
		id: 'paySlip',
		title: 'Fiche de paie',
		state: 'error',
	},
])

</script>
				`,
			},
		],
	},
}

export const OptionalDocument: Story = {
	args: {
		uploadList: [
			{
				id: 'residenceCertificate',
				title: 'Attestation de domicile',
				state: 'initial',
			},
			{
				id: 'identityCard',
				title: 'Carte d\'identité',
				state: 'initial',
				optional: true,
			},
			{
				id: 'paySlip',
				title: 'Fiche de paie',
				state: 'initial',
				optional: true,
			},
		],
		onUpload: fn(),
		onDelete: fn(),
		onPreview: fn(),
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<UploadList
		:uploadList="uploadList"
	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { UploadList } from '@cnamts/synapse'
import { ref } from 'vue'

const uploadList = ref([
	{
		id: 'residenceCertificate',
		title: 'Attestation de domicile',
		state: 'initial',
	},
	{
		id: 'identityCard',
		title: 'Carte d\\'identité',
		state: 'initial',
		optional: true,
	},
	{
		id: 'paySlip',
		title: 'Fiche de paie',
		state: 'initial',
		optional: true,
	},
])

</script>
				`,
			},
		],
	},
}

export const Actions: Story = {
	args: {
		uploadList: [
			{
				id: 'residenceCertificate',
				title: 'Attestation de domicile',
				fileName: 'file1.jpg',
				state: 'success',
				showDeleteBtn: true,
				showPreviewBtn: true,
			},
			{
				id: 'identityCard',
				title: 'Carte d\'identité',
				state: 'initial',
				showUploadBtn: false,
			},
			{
				id: 'paySlip',
				title: 'Fiche de paie',
				fileName: 'file2.jpg',
				state: 'success',
				showDeleteBtn: false,
				showPreviewBtn: false,
			},
		],
		onUpload: fn(),
		onDelete: fn(),
		onPreview: fn(),
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<UploadList
		:uploadList="uploadList"
	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `	
<script setup lang="ts">
import { UploadList } from '@cnamts/synapse'
import { ref } from 'vue'

const uploadList = ref([
	{
		id: 'residenceCertificate',
		title: 'Attestation de domicile',
		fileName: 'file1.jpg',
		state: 'success',
		showDeleteBtn: true,
		showPreviewBtn: true,
	},
	{
		id: 'identityCard',
		title: 'Carte d\\'identité',
		state: 'initial',
		showUploadBtn: false,
	},
	{
		id: 'paySlip',
		title: 'Fiche de paie',
		fileName: 'file2.jpg',
		state: 'success',
		showDeleteBtn: false,
		showPreviewBtn: false,
	},
])

</script>
				`,
			},
		],
	},
}

export const Customization: Story = {
	args: {
		uploadList: [
			{
				id: 'residenceCertificate',
				title: 'Attestation de domicile',
				state: 'initial',
			},
			{
				id: 'identityCard',
				title: 'Carte d\'identité',
				state: 'initial',
			},
		],
		onUpload: fn(),
		onDelete: fn(),
		onPreview: fn(),
	},
	render: args => ({
		components: { UploadList, VIcon },
		setup() {
			return { args, mdiCertificateOutline, mdiCardAccountDetailsOutline }
		},
		template: `
			<UploadList
				:uploadList="args.uploadList"
				:maxWidth="600"
				:minWidth="400"
				:width="'50%'"
				@upload="args.onUpload"
				@delete="args.onDelete"
				@preview="args.onPreview"
			>
				<template #file-icon-residenceCertificate>
					<VIcon
						color="primary"
					>{{ mdiCertificateOutline }}</VIcon>
				</template>
				<template #file-icon-identityCard>
					<VIcon
						color="primary"
					>{{ mdiCardAccountDetailsOutline }}</VIcon>
				</template>
			</UploadList>
		`,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<UploadList
		:uploadList="uploadList"
		:maxWidth="600"
		:minWidth="400"
		:width="'50%'"
		@upload="console.log"
		@delete="console.log"
		@preview="console.log"
	>
		<template #file-icon-residenceCertificate>
			<VIcon
				color="primary"
			>{{ mdiCertificateOutline }}</VIcon>
		</template>
		<template #file-icon-identityCard>
			<VIcon
				color="primary"
			>{{ mdiCardAccountDetailsOutline }}</VIcon>
		</template>
	</UploadList>
</template>
				`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { UploadList } from '@cnamts/synapse'
import { ref } from 'vue'
import { mdiCertificateOutline, mdiCardAccountDetailsOutline } from '@mdi/js'

const uploadList = ref([
	{
		id: 'residenceCertificate',
		title: 'Attestation de domicile',
		state: 'initial',
	},
	{
		id: 'identityCard',
		title: 'Carte d\\'identité',
		state: 'initial',
	},
])

</script>
				`,
			},
		],
	},
}
