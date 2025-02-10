import type { Meta, StoryObj } from '@storybook/vue3'
import { onMounted, ref } from 'vue'
import FilePreview from './FilePreview.vue'

const meta: Meta = {
	title: 'Composants/Feedback/FilePreview',
	component: FilePreview,
	argTypes: {
		file: {
			control: false,
			table: {
				type: {
					summary: 'File | Blob',
				},
				category: 'props',
			},
			description: 'Fichier à afficher',
		},
		options: {
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
			description: 'Configuration des attributs pour les balises <object> et <img>',
		},
		locales: {
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
		default: {
			control: {
				type: 'text',
			},
			table: {
				category: 'slots',
			},
			description: 'Remplace le contenu par défaut affiché quand le fichier n\'est pas une image ou un pdf',
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
				<input type="file" @change="file = $event.target.files[0]" />
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
