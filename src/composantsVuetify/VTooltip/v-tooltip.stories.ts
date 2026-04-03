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
}
export const Bottom: Story = {
	args: { text: 'Tooltip bottom', activator: 'Hover me', location: 'bottom', disabled: false },
}
export const Left: Story = {
	args: { text: 'Tooltip left', activator: 'Hover me', location: 'left', disabled: false },
}
export const Right: Story = {
	args: { text: 'Tooltip right', activator: 'Hover me', location: 'right', disabled: false },
}

// --- Disabled ---
export const Disabled: Story = {
	args: { text: 'Tooltip disabled', activator: 'Hover me', location: 'top', disabled: true },
}
