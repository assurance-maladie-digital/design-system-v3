import { fn } from '@storybook/test'
import FileUpload from './FileUpload.vue'
import type { Meta, StoryObj } from '@storybook/vue3'

import NotificationBar from '@/components/NotificationBar/NotificationBar.vue'
import { useNotificationService } from '@/services/NotificationService'
import { mdiCloudUpload } from '@mdi/js'
import { VIcon } from 'vuetify/components'

const meta = {
	title: 'Composants/Formulaires/FileUpload',
	component: FileUpload,
	argTypes: {
		'modelValue': {
			description: 'La/Les fichiers de l\'utilisateur',
			control: 'file',
			table: {
				type: {
					summary: 'File[]',
				},
				disable: false,
				category: 'props',
			},
		},
		'disabled': {
			description: 'Désactive le champ',
			control: 'boolean',
			table: {
				type: {
					summary: 'boolean',
				},
			},
			defaultValue: false,
		},
		'multiple': {
			description: 'Autorise l\'envoi de plusieurs fichiers',
			control: 'boolean',
			table: {
				type: {
					summary: 'boolean',
				},
			},
			defaultValue: false,
		},
		'fileSizeMax': {
			description: 'Taille maximale des fichiers en octets',
			control: 'number',
			table: {
				type: {
					summary: 'number',
				},
			},
			defaultValue: 10485760,
		},
		'fileSizeUnits': {
			description: 'Unité de taille des fichiers',
			control: 'object',
			table: {
				type: {
					summary: 'string[]',
				},
				defaultValue: {
					summary: '[\'o\', \'Ko\', \'Mo\', \'Go\', \'To\']',
				},
			},
		},
		'allowedExtensions': {
			description: 'Extensions de fichiers autorisées, un tableau vide autorise toutes les extensions',
			control: 'object',
			table: {
				type: {
					summary: 'string[]',
				},

				defaultValue: {
					summary: '[\'pdf\', \'jpg\', \'jpeg\', \'png\']',
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
		'onUpdate:modelValue': {
			description: 'Événement émis lorsqu\'un fichier est ajouté ou supprimé',
			table: {
				type: {
					summary: 'File[]',
				},
				category: 'events',
			},
		},
		'onError': {
			description: 'Événement émis lorsqu\'une erreur de validation survient',
			table: {
				type: {
					summary: 'string[]',
				},
				category: 'events',
			},
		},
		'default': {
			description: 'Intérieur de champ',
			control: 'text',
			table: {
				category: 'slots',
				type: {
					summary: undefined,
				},
			},
		},
		'icon': {
			description: 'Icône supérieur',
			control: 'text',
			table: {
				category: 'slots',
				type: {
					summary: undefined,
				},
			},
		},
		'action-text': {
			description: 'Texte de l\'appel à l\'action',
			control: 'text',
			table: {
				category: 'slots',
				type: {
					summary: undefined,
				},
			},
		},
		'or': {
			description: 'Texte de séparation entre le cta et le bouton',
			control: 'text',
			table: {
				category: 'slots',
				type: {
					summary: undefined,
				},
			},
		},
		'button-text': {
			description: 'Texte du bouton',
			control: 'text',
			table: {
				category: 'slots',
				type: {
					summary: undefined,
				},
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
	or: 'Ou',
	chooseFile: (multiple: boolean) => multiple ? 'Choisir des fichiers' : 'Choisir un fichier',
	infoText: (max: string, ext: string[]): string =>
		\`Taille max. : \${max}. \${ext.length === 1 ? 'Format accepté' : 'Formats acceptés'} : \${ext.join(', ')}\`,
	fileSizeUnits: ['o', 'Ko', 'Mo', 'Go', 'To'],
	dropFilesHere: (multiple: boolean): string => (!multiple ? 'Déposer votre fichier ici' : 'Déposer vos fichiers ici'),
	errorSize: (fileName: string, max: string): string => \`Le fichier \${fileName} est trop volumineux. Taille max. : \${max}\`,
	errorExtension: (fileName: string, ext: string[]): string => \`Le fichier \${fileName} a une extension invalide. Extensions acceptées : \${ext.join(', ')}\`,
}`,
				},
			},
		},
	},
	parameters: {
		controls: {
			exclude: ['error', 'update:modelValue', 'slotName'],
		},
		docs: {
			controls: {
				sort: 'requiredFirst',
			},
		},
	},
} satisfies Meta<typeof FileUpload>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		'modelValue': [],
		'multiple': false,
		'onUpdate:modelValue': fn(),
		'onError': fn(),
	},
	render: args => ({
		components: { FileUpload },
		setup() {
			return { args }
		},
		template: `<div>
			<FileUpload
				v-model="args.modelValue"
				v-bind="args"
			/>
			<ul class="ma-2">
				<li v-for="file in args.modelValue" :key="file.name">{{ file.name }}</li>
			</ul>
		</div>`,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<FileUpload
		v-model="modelValue"
	/>
	<ul class="ma-2">
		<li v-for="file in modelValue" :key="file.name">{{ file.name }}</li>
	</ul>
</template>
				`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
	import { FileUpload } from '@cnamts/synapse'
	import { ref } from 'vue'

	const modelValue = ref([])

</script>
				`,
			},
		],
	},
}

export const MultipleFiles: Story = {
	args: {
		'modelValue': [],
		'onUpdate:modelValue': fn(),
		'onError': fn(),
	},
	render: args => ({
		components: { FileUpload, NotificationBar },
		setup() {
			const { addNotification } = useNotificationService()
			const sendError = (e: string[]) => {
				addNotification({
					id: Date.now().toString(),
					message: e.join(', '),
					type: 'error',
					timeout: -1,
				})
			}
			return { args, sendError }
		},
		template: `<div>
			<NotificationBar />
			<FileUpload
				v-model="args.modelValue"
				v-bind="args"
			/>
			<ul class="ma-2">
				<li v-for="file in args.modelValue" :key="file.name">{{ file.name }}</li>
			</ul>
		</div>`,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<div>
		<FileUpload
			v-model="files"
			:multiple="true"
		/>
		<ul class="ma-2">
			<li v-for="file in files" :key="file.name">{{ file.name }}</li>
		</ul>
		<NotificationBar />
	</div>
</template>
				`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
	import { FileUpload, NotificationBar, useNotificationService } from '@cnamts/synapse'
	import { ref } from 'vue'

	const files = ref([])

	const { addNotification } = useNotificationService()
	const sendError = (e: string[]) => {
		addNotification({
			id: Date.now().toString(),
			message: e.join(', '),
			type: 'error',
			timeout: -1,
		})
	}

</script>
				`,
			},
		],
	},
}

export const Customization: Story = {
	args: {
		'modelValue': [],
		'onUpdate:modelValue': fn(),
		'onError': fn(),
		'width': '50%',
		'minWidth': '300px',
		'maxWidth': '600px',
	},
	render: args => ({
		components: { FileUpload, VIcon },
		setup() {
			return { args, uploadIcon: mdiCloudUpload }
		},
		template: `<div>
			<FileUpload
				v-model="args.modelValue"
				v-bind="args"
				class="bg-accent elevation-3 px-4 py-3 border-0 rounded-0"
			>
				<span class="d-flex align-center white--text">
					<VIcon
						size="25"
						color="white"
						class="mr-4"
					>
						{{ uploadIcon }}
					</VIcon>

					Sélectionner un fichier
				</span>
			</FileUpload>
			<ul class="ma-2">
				<li v-for="file in args.modelValue" :key="file.name">{{ file.name }}</li>
			</ul>
		</div>`,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<div>
		<FileUpload
			v-model="files"
			width="50%"
			min-width="300px"
			max-width="600px"
			class="bg-accent elevation-3 px-4 py-3 border-0 rounded-0"
		>
			<span>
				<v-icon size="25" color="white" class="mr-4">
					{{ uploadIcon }}
				</v-icon>
				Sélectionner un fichier
			</span>
		</FileUpload>
		<ul class="ma-2">
			<li v-for="file in files" :key="file.name">{{ file.name }}</li>
		</ul>
	</div>
</template>
				`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
	import { FileUpload, VIcon } from '@cnamts/synapse'
	import { mdiCloudUpload } from '@mdi/js'
	import { ref } from 'vue'

	const files = ref([])

	const uploadIcon = mdiCloudUpload
</script>
				`,
			},
		],
	},
}
