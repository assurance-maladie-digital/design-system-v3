import type { Meta, StoryObj } from '@storybook/vue3'
import CookieBanner from './CookieBanner.vue'
import { fn } from '@storybook/test'

const meta = {
	title: 'Composants/Feedback/CookieBanner',
	component: CookieBanner,
	parameters: {
		layout: 'fullscreen',
	},
} satisfies Meta<typeof CookieBanner>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		cookiesRoute: '/cookie',
		onAccept: fn(),
		onReject: fn(),
		onCustomize: fn(),
	},
}

export const WithoutCookiesRoute: Story = {
	args: {
		onAccept: fn(),
		onReject: fn(),
		onCustomize: fn(),
	},
}
