import { type Meta, type StoryObj } from '@storybook/vue3'
import CookieBanner from './CookieBanner.vue'
import { fn } from '@storybook/test'
import { VBtn } from 'vuetify/components'
import { ref } from 'vue'
import { watch } from 'fs'

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
	argTypes: {
		cookiesRoute: { control: { type: 'text' } },
		onAccept: { action: 'accept' },
		onReject: { action: 'reject' },
		onCustomize: { action: 'customize' },
	},
	args: {
		cookiesRoute: '/cookie',
		onAccept: fn(),
		onReject: fn(),
		onCustomize: fn(),
	},

	decorators: [
		() => ({
			template: '<div style="height: 500px;"><story /></div>',
		}),
	],

	render: (args) => {
		return {
			components: { CookieBanner, VBtn },
			setup() {
				watch(args.modelValue, (value) => {
					open.value = value
				}, { immediate: true })
				const open = ref(true)
				return { args, open }
			},
			template: `
			<div style="height: 500px; display: flex; align-items: center; justify-content: center;">
				<VBtn @click="open = true" v-if="!open">Reset</VBtn>
				<CookieBanner v-bind="args" v-model="open" />
			</div>
			`,
		}
	},
}

export const WithoutCookiesRoute: Story = {
	args: {
		onAccept: fn(),
		onReject: fn(),
		onCustomize: fn(),
	},
	decorators: [
		() => ({
			template: '<div style="height: 500px;"><story /></div>',
		}),
	],
}

export const DescriptionSlot: Story = {
	args: {
		onAccept: fn(),
		onReject: fn(),
		onCustomize: fn(),
	},
	render: (args) => {
		return {
			components: { CookieBanner },
			setup() {
				return { args }
			},
			template: `
			<div style="height: 500px;">
				<CookieBanner v-bind="args">
					<p><b>Custom</b> description</p>
				</CookieBanner>
			</div>
			`,
		}
	},
}

export const Customization: Story = {
	args: {
		onAccept: fn(),
		onReject: fn(),
		onCustomize: fn(),
		vuetifyOptions: {
			sheet: {
				color: '#ced9eb',
			},
			customizeBtn: {
				text: true,
				outlined: false,
			},
			rejectBtn: {
				outlined: true,
			},
			acceptBtn: {
				outlined: true,
			},
		},
	},
	render: (args) => {
		return {
			components: { CookieBanner },
			setup() {
				return { args }
			},
			template: `
			<div style="height: 500px;">
				<CookieBanner v-bind="args" />
			</div>
			`,
		}
	},
}
