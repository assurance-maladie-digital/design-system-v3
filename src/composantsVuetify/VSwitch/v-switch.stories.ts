import type { Meta, StoryObj } from '@storybook/vue3'
import { VSwitch } from 'vuetify/components'

const meta: Meta<typeof VSwitch> = {
	title: 'Composants/Composants Vuetify/VSwitch',
	tags: ['!dev'],
	component: VSwitch,
	argTypes: {
		color: {
			control: { type: 'text' },
			description: 'Couleur du switch',
		},
		disabled: {
			control: { type: 'boolean' },
			description: 'Désactive le switch',
		},
		label: {
			control: { type: 'text' },
			description: 'Label du switch',
		},
		inset: {
			control: { type: 'boolean' },
			description: 'Style inset du switch',
		},
		hideDetails: {
			control: { type: 'boolean' },
			description: 'Masque les détails (messages d\'erreur, etc.)',
		},
	},
}

export default meta

type Story = StoryObj<typeof VSwitch>

// Primary

export const PrimaryOn: Story = {
	args: {
		modelValue: true,
		label: 'Activé',
		color: 'primary',
		hideDetails: true,
	},
}

export const PrimaryOff: Story = {
	args: {
		modelValue: false,
		label: 'Désactivé',
		color: 'primary',
		hideDetails: true,
	},
}

export const PrimaryInsetOn: Story = {
	args: {
		modelValue: true,
		label: 'Activé (inset)',
		color: 'primary',
		inset: true,
		hideDetails: true,
	},
}

export const PrimaryInsetOff: Story = {
	args: {
		modelValue: false,
		label: 'Désactivé (inset)',
		color: 'primary',
		inset: true,
		hideDetails: true,
	},
}

// Primary – Désactivé

export const PrimaryOnDisabled: Story = {
	args: {
		modelValue: true,
		label: 'Activé – désactivé',
		color: 'primary',
		disabled: true,
		hideDetails: true,
	},
}

export const PrimaryOffDisabled: Story = {
	args: {
		modelValue: false,
		label: 'Désactivé – désactivé',
		color: 'primary',
		disabled: true,
		hideDetails: true,
	},
}

// Secondary

export const SecondaryOn: Story = {
	args: {
		modelValue: true,
		label: 'Activé',
		color: 'secondary',
		hideDetails: true,
	},
}

export const SecondaryOff: Story = {
	args: {
		modelValue: false,
		label: 'Désactivé',
		color: 'secondary',
		hideDetails: true,
	},
}

export const SecondaryInsetOn: Story = {
	args: {
		modelValue: true,
		label: 'Activé (inset)',
		color: 'secondary',
		inset: true,
		hideDetails: true,
	},
}

export const SecondaryInsetOff: Story = {
	args: {
		modelValue: false,
		label: 'Désactivé (inset)',
		color: 'secondary',
		inset: true,
		hideDetails: true,
	},
}

// Secondary – Désactivé

export const SecondaryOnDisabled: Story = {
	args: {
		modelValue: true,
		label: 'Activé – désactivé',
		color: 'secondary',
		disabled: true,
		hideDetails: true,
	},
}

export const SecondaryOffDisabled: Story = {
	args: {
		modelValue: false,
		label: 'Désactivé – désactivé',
		color: 'secondary',
		disabled: true,
		hideDetails: true,
	},
}
