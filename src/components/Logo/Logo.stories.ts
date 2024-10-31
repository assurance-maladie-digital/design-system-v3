import type { StoryObj, Meta } from '@storybook/vue3'
import Logo from './Logo.vue'
import { VSheet } from 'vuetify/components'

const meta = {
	title: 'Components/Logo',
	component: Logo,
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		hideSignature: { control: 'boolean' },
		hideOrganism: { control: 'boolean' },
		risquePro: { control: 'boolean' },
		ariaLabel: { control: 'text' },
		avatar: { control: 'boolean' },
		dark: { control: 'boolean' },
		size: {
			options: ['normal', 'small', 'x-small'],
			control: { type: 'select' },
			default: 'normal',
		},
	},
} satisfies Meta<typeof Logo>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		hideSignature: false,
		hideOrganism: false,
		risquePro: false,
		ariaLabel: '',
		avatar: false,
		dark: false,
		size: 'normal',
	},
	render: args => ({
		components: { Logo, VSheet },
		setup() {
			return { args }
		},
		template: `
			<div class="d-flex flex-wrap align-center pa-4">
				<VSheet v-if="args.dark" color="primary" class="pa-0">
					<Logo v-bind="args" />
				</VSheet>
				<Logo v-else v-bind="args" />
			</div>
		`,
	}),
}

export const small: Story = {
	args: {
		hideSignature: false,
		hideOrganism: false,
		risquePro: false,
		ariaLabel: '',
		avatar: false,
		dark: false,
		size: 'small',
	},
	render: args => ({
		components: { Logo },
		setup() {
			return { args }
		},
		template: `
			<div class="d-flex flex-wrap align-center pa-4">
				<Logo v-bind="args" />
			</div>
		`,
	}),
}

export const xSmall: Story = {
	args: {
		hideSignature: false,
		hideOrganism: false,
		risquePro: false,
		ariaLabel: '',
		avatar: false,
		dark: false,
		size: 'x-small',
	},
	render: args => ({
		components: { Logo },
		setup() {
			return { args }
		},
		template: `
			<div class="d-flex flex-wrap align-center pa-4">
				<Logo v-bind="args" />
			</div>
		`,
	}),
}

export const hideSignature: Story = {
	args: {
		hideSignature: true,
		hideOrganism: false,
		risquePro: false,
		ariaLabel: '',
		avatar: false,
		dark: false,
		size: 'normal',
	},
	render: args => ({
		components: { Logo },
		setup() {
			return { args }
		},
		template: `
			<div class="d-flex flex-wrap align-center pa-4">
				<Logo v-bind="args" />
			</div>
		`,
	}),
}

export const hideOrganism: Story = {
	args: {
		hideSignature: false,
		hideOrganism: true,
		risquePro: false,
		ariaLabel: '',
		avatar: false,
		dark: false,
		size: 'normal',
	},
	render: args => ({
		components: { Logo },
		setup() {
			return { args }
		},
		template: `
			<div class="d-flex flex-wrap align-center pa-4">
				<Logo v-bind="args" />
			</div>
		`,
	}),
}

export const risquePro: Story = {
	args: {
		hideSignature: false,
		hideOrganism: false,
		risquePro: true,
		ariaLabel: '',
		avatar: false,
		dark: false,
		size: 'normal',
	},
	render: args => ({
		components: { Logo },
		setup() {
			return { args }
		},
		template: `
			<div class="d-flex flex-wrap align-center pa-4">
				<Logo v-bind="args" />
			</div>
		`,
	}),
}

export const avatar: Story = {
	args: {
		hideSignature: false,
		hideOrganism: false,
		risquePro: true,
		ariaLabel: '',
		avatar: true,
		dark: false,
		size: 'normal',
	},
	render: args => ({
		components: { Logo },
		setup() {
			return { args }
		},
		template: `
			<div class="d-flex flex-wrap align-center pa-4">
				<Logo v-bind="args" />
			</div>
		`,
	}),
}

export const dark: Story = {
	args: {
		hideSignature: false,
		hideOrganism: false,
		risquePro: false,
		ariaLabel: '',
		avatar: false,
		dark: true,
		size: 'normal',
	},
	render: args => ({
		components: { Logo, VSheet },
		setup() {
			return { args }
		},
		template: `
			<div class="d-flex flex-wrap align-center pa-4">
				<VSheet v-if="args.dark" color="primary" class="pa-4">
					<Logo v-bind="args" />
				</VSheet>
			</div>
		`,
	}),
}
