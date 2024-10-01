import type { Meta, StoryObj } from '@storybook/vue3'
import FranceConnectBtn from './FranceConnectBtn.vue'

const meta = {
	title: 'Components/FranceConnectBtn',
	component: FranceConnectBtn,
	parameters: {
		layout: 'fullscreen',
	},
} satisfies Meta<typeof FranceConnectBtn>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		href: 'https://app.franceconnect.gouv.fr/',
	},
}

export const FranceConnectPlus: Story = {
	args: {
		href: 'https://app.franceconnect.gouv.fr/',
		isConnectPlus: true,
	},
}

export const DarkTheme: Story = {
	args: {
		href: 'https://app.franceconnect.gouv.fr/',
		isConnectPlus: true,
	},
	render: (args) => {
		return {
			components: { FranceConnectBtn },
			setup() {
				return { args }
			},
			template: `
                <VThemeProvider
                    theme="dark"
                    with-background
                    class="pa-4"
                >
                    <FranceConnectBtn v-bind="args" />
                </VThemeProvider>`,
		}
	},
}
