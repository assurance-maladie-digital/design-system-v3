import type { Meta, StoryObj } from '@storybook/vue3'

const meta: Meta = {
	title: 'Composants/Composants Vuetify/VTooltip',
	tags: ['!dev'],
	render: args => ({
		setup() {
			return { args }
		},
		template: `
            <v-tooltip :text="args.text" :location="args.location" :disabled="args.disabled">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" color="primary">{{ args.activator }}</v-btn>
                </template>
            </v-tooltip>
        `,
	}),
}

export default meta
type Story = StoryObj<typeof meta>

// --- Location ---
export const Top: Story = {
	args: { text: 'Tooltip top', activator: 'Hover me', location: 'top', disabled: false },
	parameters: {
		docs: {
			source: {
				code: `<v-tooltip text="Tooltip top" location="top">
    <template v-slot:activator="{ props }">
        <v-btn v-bind="props" color="primary">Hover me</v-btn>
    </template>
</v-tooltip>`,
			},
		},
	},
}
export const Bottom: Story = {
	args: { text: 'Tooltip bottom', activator: 'Hover me', location: 'bottom', disabled: false },
	parameters: {
		docs: {
			source: {
				code: `<v-tooltip text="Tooltip bottom" location="bottom">
    <template v-slot:activator="{ props }">
        <v-btn v-bind="props" color="primary">Hover me</v-btn>
    </template>
</v-tooltip>`,
			},
		},
	},
}
export const Left: Story = {
	args: { text: 'Tooltip left', activator: 'Hover me', location: 'left', disabled: false },
	parameters: {
		docs: {
			source: {
				code: `<v-tooltip text="Tooltip left" location="left">
    <template v-slot:activator="{ props }">
        <v-btn v-bind="props" color="primary">Hover me</v-btn>
    </template>
</v-tooltip>`,
			},
		},
	},
}
export const Right: Story = {
	args: { text: 'Tooltip right', activator: 'Hover me', location: 'right', disabled: false },
	parameters: {
		docs: {
			source: {
				code: `<v-tooltip text="Tooltip right" location="right">
    <template v-slot:activator="{ props }">
        <v-btn v-bind="props" color="primary">Hover me</v-btn>
    </template>
</v-tooltip>`,
			},
		},
	},
}

// --- Disabled ---
export const Disabled: Story = {
	args: { text: 'Tooltip disabled', activator: 'Hover me', location: 'top', disabled: true },
	parameters: {
		docs: {
			source: {
				code: `<v-tooltip text="Tooltip disabled" location="top" disabled>
    <template v-slot:activator="{ props }">
        <v-btn v-bind="props" color="primary">Hover me</v-btn>
    </template>
</v-tooltip>`,
			},
		},
	},
}
