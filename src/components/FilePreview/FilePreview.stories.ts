import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'
import { onMounted, ref } from 'vue'
import FilePreview from './FilePreview.vue'
import FileUpload from '../FileUpload/FileUpload.vue'
import SyCheckbox from '../Customs/SyCheckbox/SyCheckbox.vue'

const meta: Meta = {
	title: 'Composants/Données/FilePreview',
	component: FilePreview,
	argTypes: {
		'file': {
			control: false,
			table: {
				type: {
					summary: 'File | Blob',
				},
				category: 'props',
			},
			description: 'Fichier à afficher',
		},
		'options': {
			control: {
				type: 'object',
			},
			table: {
				type: {
					summary: 'Object',
					detail: `{
	pdf?: Record<string, string>,
	image?: Record<string, string>,
}`,
				},
				category: 'props',
			},
			description: 'Configuration des attributs pour les balises `object` et `img`. Par défaut, l\'image a une description vide.',
		},
		'locales': {
			description: 'Traductions',
			control: {
				type: 'object',
			},
			table: {
				category: 'props',
				type: {
					summary: 'Record<string, string>',
				},
				defaultValue: {
					summary: 'locales',
					detail: `{
	previewNotAvailable: 'Impossible de prévisualiser le fichier.',
	previewTypeNotAvailable: 'Impossible de prévisualiser ce type de fichier.',
}`,
				},
			},
		},
		'default': {
			control: {
				type: 'text',
			},
			table: {
				category: 'slots',
			},
			description: 'Remplace le contenu par défaut affiché quand le fichier n\'est pas une image ou un pdf',
		},
		'trackConsultation': {
			control: { type: 'boolean' },
			table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
			description: 'Active le suivi de consultation d\'un PDF (rendu via pdf.js, chargé à la demande). Permet d\'utiliser `v-model:complete` et l\'évènement `loaded`. Désactivé par défaut (aperçu natif `<object>`).',
		},
		'readonly': {
			control: { type: 'boolean' },
			table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
			description: 'Aperçu en lecture seule : rendu via pdf.js sans barre d\'outils native (téléchargement, impression et annotation indisponibles). Désactivé par défaut (aperçu natif `<object>`).',
		},
		'pdfWorkerSrc': {
			control: false,
			table: { category: 'props', type: { summary: 'string' } },
			description: 'URL du worker pdf.js (optionnel). Par défaut, le worker bundlé est utilisé.',
		},
		'onLoaded': {
			table: { category: 'events' },
			description: 'Émis quand le PDF est entièrement chargé et rendu. Reçoit le nombre de pages.',
		},
		'complete': {
			control: false,
			table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
			description: 'État de consultation complète du document (`v-model:complete`). Passe à `true` quand l\'utilisateur atteint la fin, et revient à `false` au chargement d\'un nouveau document.',
		},
		'onUpdate:complete': {
			table: { category: 'events' },
			description: 'Émis quand l\'état de consultation change (`true` à la fin, `false` au rechargement). Support de `v-model:complete`.',
		},
	},
} satisfies Meta<typeof FilePreview>

export default meta

type Story = StoryObj<typeof FilePreview>

export const Default: Story = {
	render: args => ({
		components: { FilePreview },
		template: `
			<div>
				<input type="file" @change="file = $event.target.files[0]" id="file-test-upload" />
				<FilePreview v-bind="args" :file >
					<template #default v-if="args.default">
						{{ args.default }}
					</template>
				</FilePreview>
			</div>
		`,
		setup: () => {
			const file = ref<File | undefined>()
			return { args, file }
		},
	}),
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<div>
	<input type="file" @change="file = $event.target.files[0]" />
	<FilePreview :file="file" />
</div>
				`,
			},
			{
				name: 'Script',
				code: `
import { ref } from 'vue'
import { FilePreview } from '@cnamts/synapse'

const file = ref<File | undefined>()`,
			},
		],
	},
}

export const UnsupportedFile: Story = {
	render: args => ({
		components: { FilePreview },
		template: `
			<FilePreview v-bind="args" :file="file" >
				<template #default v-if="args.default">
					{{ args.default }}
				</template>
			</FilePreview>
		`,
		setup: () => {
			const file = ref({
				name: 'document.txt',
				size: 1000,
				type: 'text/plain',
			} as File)
			return { args, file }
		},
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<FilePreview :file="file" />
				`,
			},
			{
				name: 'Script',
				code: `
import { ref } from 'vue'
import { FilePreview } from '@cnamts/synapse'

const file = ref({
	name: 'document.txt',
	size: 1000,
	type: 'text/plain',
} as File)`,
			},
		],
	},
}

export const FromApi: Story = {
	render: args => ({
		components: { FilePreview },
		template: `
			<FilePreview v-bind="args" :file="file">
				<template #default v-if="args.default">
					{{ args.default }}
				</template>
			</FilePreview>
		`,
		setup: () => {
			const file = ref<File | Blob | undefined>()

			onMounted(() => {
				fetch('https://picsum.photos/seed/picsum/750/350')
					.then(res => res.blob())
					.then(blob => file.value = blob)
			})
			return { args, file }
		},
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<FilePreview :file="file" />
				`,
			},
			{
				name: 'Script',
				code: `
import { onMounted, ref } from 'vue'
import { FilePreview } from '@cnamts/synapse'

const file = ref<File | Blob | undefined>()

onMounted(() => {
	fetch('https://picsum.photos/seed/picsum/750/350')
		.then(res => res.blob())
		.then(blob => file.value = blob)
})`,
			},
		],
	},
}

export const WithFileUpload: Story = {
	render: args => ({
		components: { FilePreview, FileUpload },
		template: `
			<div>
				<FileUpload v-model="files" class="mb-4"/>
				<FilePreview v-bind="args" :file="files[0]">
					<template #default v-if="args.default">
						{{ args.default }}
					</template>
				</FilePreview>
			</div>
		`,
		setup: () => {
			const files = ref<File[]>([])

			return { args, files }
		},
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<div>
	<FileUpload v-model="files" class="mb-4"/>
	<FilePreview :file="files[0]"/>
</div>
				`,
			},
			{
				name: 'Script',
				code: `
import { ref } from 'vue'
import { FilePreview, FileUpload } from '@cnamts/synapse'

const files = ref<File[]>([])`,
			},
		],
	},
}

export const ReadOnly: Story = {
	args: {
		readonly: true,
	},
	render: args => ({
		components: { FilePreview, FileUpload },
		template: `
			<div>
				<FileUpload v-model="files" class="mb-4" :allowed-extensions="['pdf']" />
				<FilePreview
					v-if="files[0]"
					v-bind="args"
					:file="files[0]"
				/>
			</div>
		`,
		setup: () => {
			const files = ref<File[]>([])
			return { args, files }
		},
	}),
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<div>
	<FileUpload v-model="files" :allowed-extensions="['pdf']" />

	<FilePreview
		v-if="files[0]"
		:file="files[0]"
		readonly
	/>
</div>
				`,
			},
			{
				name: 'Script',
				code: `
import { ref } from 'vue'
import { FilePreview, FileUpload } from '@cnamts/synapse'

const files = ref<File[]>([])`,
			},
		],
	},
}

export const MandatoryReading: Story = {
	args: {
		trackConsultation: true,
	},
	render: args => ({
		components: { FilePreview, FileUpload, SyCheckbox },
		template: `
			<div>
				<FileUpload v-model="files" class="mb-4" :allowed-extensions="['pdf']" />
				<FilePreview
					v-if="files[0]"
					v-bind="args"
					:file="files[0]"
					v-model:complete="hasRead"
					@loaded="onLoaded"
					@update:complete="onComplete"
				/>
				<SyCheckbox
					v-model="acknowledged"
					class="mt-4"
					color="primary"
					:disabled="!hasRead"
					label="J'ai pris connaissance de l'intégralité du document"
					@update:model-value="onAcknowledged"
				/>
				<p
					v-if="files[0] && !hasRead"
					class="text-caption"
				>
					Faites défiler le document jusqu'à la fin pour activer la case à cocher.
				</p>
			</div>
		`,
		setup: () => {
			const files = ref<File[]>([])
			const hasRead = ref(false)
			const acknowledged = ref(false)

			// Actions loggées dans le panneau « Actions » de Storybook
			const onLoaded = fn().mockName('loaded')
			const onAcknowledged = fn().mockName('acknowledged')
			const onComplete = fn().mockName('update:complete')

			return { args, files, hasRead, acknowledged, onLoaded, onAcknowledged, onComplete }
		},
	}),
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<div>
	<FileUpload v-model="files" :allowed-extensions="['pdf']" />

	<FilePreview
		v-if="files[0]"
		:file="files[0]"
		track-consultation
		v-model:complete="hasRead"
	/>

	<SyCheckbox
		v-model="acknowledged"
		color="primary"
		:disabled="!hasRead"
		label="J'ai pris connaissance de l'intégralité du document"
	/>
</div>
				`,
			},
			{
				name: 'Script',
				code: `
import { ref } from 'vue'
import { FilePreview, FileUpload, SyCheckbox } from '@cnamts/synapse'

const files = ref<File[]>([])
const hasRead = ref(false)
const acknowledged = ref(false)`,
			},
		],
	},
}
