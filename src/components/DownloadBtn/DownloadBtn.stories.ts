import { fn, userEvent, within } from '@storybook/test'
import type { Meta, StoryObj } from '@storybook/vue3'
import axios from 'axios'
import { VThemeProvider } from 'vuetify/components'
import DownloadBtn from './DownloadBtn.vue'
import NotificationBar from '../NotificationBar/NotificationBar.vue'
import { useNotificationService } from '@/services/NotificationService'

const meta = {
	title: 'Composants/Boutons/DownloadBtn',
	component: DownloadBtn,
	parameters: {
		layout: 'fullscreen',
		controls: {
			exclude: ['getFileInfo', 'download', 'state', 'onError', 'onSuccess'],
		},
	},
	argTypes: {
		default: {
			control: { type: 'text' },
			table: {
				category: 'slots',
			},
		},
		filePromise: {
			control: false,
			description: 'Une fonction retournant un valeur de retour de Axios `Promise<AxiosResponse>`. <br>Exemple: `() => axios.get("https://run.mocky.io/v3/63e571d5-1134-4f51-82ac-fa7cc8045124")`',
			table: {
				category: 'props',
			},
		},
		fallbackFilename: {
			control: { type: 'text' },
			description: 'Le nom du fichier téléchargé si celui ci n\'est pas disponible dans la réponse.',
			table: {
				type: {
					summary: 'string',
				},
			},
		},
		vuetifyOptions: {
			control: { type: 'object' },
			description: 'Options pour personnaliser les composants Vuetify utilisés en interne.',
			table: {
				type: {
					summary: 'object',
					detail: `{
	btn: Record<string, any>,
	icon: Record<string, any>,
}`,
				},
				defaultValue: {
					summary: 'config',
					detail: ` {
	btn: {
		variant: 'outlined',
		color: 'primary',
		class: 'text-wrap',
		minHeight: '36px',
		height: 'auto',
	},
	icon: {
		color: 'primary',
		class: 'mr-3',
	},
}`,
				},
				category: 'props',
			},
		},
	},
	args: {
		vuetifyOptions: {
			btn: {
				variant: 'outlined',
				color: 'primary',
				class: 'text-wrap',
				minHeight: '36px',
				height: 'auto',
			},
			icon: {
				color: 'primary',
				class: 'mr-3',
			},
		},
	},
	decorators: [() => ({ template: '<div class="pa-4"><story/></div>' })],
} satisfies Meta<typeof DownloadBtn>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<DownloadBtn
		:file-promise="download"
		@error="onError"
		@success="onSuccess"
	>
		Télécharger
	</DownloadBtn>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import DownloadBtn from '@cnamts/synapse'
	import axios from 'axios'
	
	const download = () => {
        return axios.get('https://run.mocky.io/v3/63e571d5-1134-4f51-82ac-fa7cc8045124')
	}
</script>
				`,
			},
		],
	},
	args: {
		filePromise: () => axios.get('https://run.mocky.io/v3/63e571d5-1134-4f51-82ac-fa7cc8045124'),
		default: 'Télécharger',
		onError: fn(),
		onSuccess: fn(),
	},
}

export const Error: Story = {
	name: 'Error',
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<DownloadBtn
		:file-promise="download"
		@error="onError"
		@success="onSuccess"
	>
		Télécharger
	</DownloadBtn>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import DownloadBtn from '@cnamts/synapse'
	import axios from 'axios'
	
	const download = () => {
        return axios.get('https://')
	}
</script>
				`,
			},
		],
	},
	args: {
		filePromise: () => axios.get('https://'),
		default: 'Télécharger',
		onError: fn(),
		onSuccess: fn(),
	},
}

export const Loading: Story = {
	name: 'Loading',
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<DownloadBtn
		:file-promise="download"
		@error="onError"
		@success="onSuccess"
	>
		Télécharger
	</DownloadBtn>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import DownloadBtn from '@cnamts/synapse'
	import axios from 'axios'
	
	const download = () => {
        return new Promise(() => { setTimeout(() => {}, 100000) })
	}
</script>
				`,
			},
		],
	},
	args: {
		filePromise: () => new Promise(() => { setTimeout(() => {}, 100000) }),
		default: 'Télécharger',
		onError: fn(),
		onSuccess: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const btn = canvas.getByRole('button')
		userEvent.click(btn)
	},
}

export const Dark: Story = {
	name: 'Dark theme',
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<VThemeProvider theme="dark" with-background class="pa-4">
		<DownloadBtn
			:file-promise="download"
			@error="onError"
			@success="onSuccess"
		>
			Télécharger
		</DownloadBtn>
	</VThemeProvider>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import DownloadBtn from '@cnamts/synapse'
	import axios from 'axios'
	
	const download = () => {
        return new Promise(() => { setTimeout(() => {}, 100000) })
	}
</script>
				`,
			},
		],
	},
	render: args => ({
		components: { VThemeProvider, DownloadBtn },
		setup() {
			return { args }
		},
		template: `
			<VThemeProvider theme="dark" with-background class="pa-4">
				<DownloadBtn v-bind="args">{{ args.default }}</DownloadBtn>
			</VThemeProvider>
		`,
	}),
	args: {
		filePromise: () => axios.get('https://run.mocky.io/v3/63e571d5-1134-4f51-82ac-fa7cc8045124'),
		default: 'Télécharger',
		onError: fn(),
		onSuccess: fn(),
	},
}

export const Notify: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div>
		<NotificationBar />
		<DownloadBtn
			:file-promise="download"
			@error="onError"
			@success="onSuccess"
		>
			Télécharger
		</DownloadBtn>
	</div>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import DownloadBtn from '@cnamts/synapse'
	import NotificationBar from '@cnamts/synapse'
	
	import axios from 'axios'
	
	const download = () => {
        return new Promise(() => { setTimeout(() => {}, 100000) })
	}
    
    const { addNotification } = useNotificationService()
    
    const notify = (message: string, type: 'error' | 'success') => {
		const notification = {
			id: Date.now().toString(),
			message,
			type,
			timeout: -1,
		}
		addNotification(notification)
	}
</script>
				`,
			},
		],
	},
	args: {
		filePromise: () => axios.get('https://run.mocky.io/v3/63e571d5-1134-4f51-82ac-fa7cc8045124'),
		default: 'Télécharger',
		onError: fn(),
		onSuccess: fn(),
	},
	name: 'Notification',
	render: args => ({
		components: { NotificationBar, DownloadBtn },
		setup() {
			const { addNotification } = useNotificationService()

			const notify = (message: string, type: 'error' | 'success') => {
				const notification = {
					id: Date.now().toString(),
					message,
					type,
					timeout: -1,
				}
				addNotification(notification)
			}
			return { args, notify }
		},
		template: `
			<div>
				<NotificationBar />
				<div class="d-flex">
					<DownloadBtn
						:file-promise="args.filePromise"
						:btn="{ color: 'primary'}"
						@error="notify('Une error est survenue', 'error')"
						@success="notify('Votre attestation a été téléchargée', 'success')"
					>
						{{ args.default }}
					</DownloadBtn>
				</div>
			</div>
		`,
	}),
}

export const Customization: Story = {
	name: 'Customisation',
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<DownloadBtn
		:file-promise="download"
		:vuetify-options="vuetifyOptions"
		@error="onError"
		@success="onSuccess"
	>
		Télécharger
	</DownloadBtn>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import DownloadBtn from '@cnamts/synapse'
	import axios from 'axios'
	
	const download = () => {
        return axios.get('https://run.mocky.io/v3/63e571d5-1134-4f51-82ac-fa7cc8045124')
	}
    
    const vuetifyOptions = {
		btn: {
			variant: 'plain',
			ripple: true,
			color: 'secondary',
		},
		icon: {
			class: 'ml-2 mr-2',
			color: 'secondary',
		},
	}
</script>
				`,
			},
		],
	},
	args: {
		filePromise: () => axios.get('https://run.mocky.io/v3/63e571d5-1134-4f51-82ac-fa7cc8045124'),
		default: 'Télécharger',
		onError: fn(),
		onSuccess: fn(),
		vuetifyOptions: {
			btn: {
				variant: 'plain',
				ripple: true,
				color: 'secondary',
			},
			icon: {
				class: 'ml-2 mr-2',
				color: 'secondary',
			},
		},
	},
}
