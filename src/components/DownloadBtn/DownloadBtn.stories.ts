import { fn, userEvent, within } from '@storybook/test'
import type { Meta, StoryObj } from '@storybook/vue3'
import axios from 'axios'
import { VThemeProvider } from 'vuetify/components'
import DownloadBtn from './DownloadBtn.vue'
import NotificationBar from '../NotificationBar/NotificationBar.vue'
import { useNotificationService } from '@/services/NotificationService'

const meta = {
	title: 'Components/DownloadBtn',
	component: DownloadBtn,
	parameters: {
		layout: 'fullscreen',
		controls: {
			exclude: ['getFileInfo', 'download', 'onError', 'onSuccess'],
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
} satisfies Meta<typeof DownloadBtn>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	name: 'Défaut',
	args: {
		filePromise: () => axios.get('https://run.mocky.io/v3/63e571d5-1134-4f51-82ac-fa7cc8045124'),
		default: 'Télécharger',
		onError: fn(),
		onSuccess: fn(),
	},
}

export const Error: Story = {
	name: 'Erreur',
	args: {
		filePromise: () => axios.get('https://'),
		default: 'Télécharger',
		onError: fn(),
		onSuccess: fn(),
	},
}

export const Loading: Story = {
	name: 'Etat de chargement',
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
	name: 'Thème sombre',
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
	args: {
		filePromise: () => axios.get('https://run.mocky.io/v3/63e571d5-1134-4f51-82ac-fa7cc8045124'),
		default: 'Télécharger',
		onError: fn(),
		onSuccess: fn(),
		vuetifyOptions: {
			btn: {
				variant: 'plain',
				ripple: true,
				color: 'red',
			},
			icon: {
				class: 'ml-2 mr-2',
				color: 'red',
			},
		},
	},
}
