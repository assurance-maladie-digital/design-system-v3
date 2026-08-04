import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta: Meta = {
	title: 'Composants/Composants Vuetify/VBtn',
	tags: ['!dev'],
	render: args => ({
		setup() {
			return { args }
		},
		template: `
      <v-btn :color="args.color" :variant="args.variant" :disabled="args.disabled" :loading="args.loading">
        {{ args.label }}
      </v-btn>
    `,
	}),
}

export default meta
type Story = StoryObj<typeof meta>

// --- Primary ---
export const Primary: Story = {
	args: { label: 'Button primary', color: 'primary', variant: 'elevated', disabled: false },
	parameters: { docs: { source: { code: `<v-btn color="primary" variant="elevated">Button</v-btn>` } } },
}
export const PrimaryLoading: Story = {
	args: { label: 'Button primary loading', color: 'primary', variant: 'elevated', disabled: false, loading: true },
	parameters: { docs: { source: { code: `<v-btn color="primary" variant="elevated" loading>Button</v-btn>` } } },
}
export const PrimaryDisabled: Story = {
	args: { label: 'Button primary disabled', color: 'primary', variant: 'elevated', disabled: true },
	parameters: { docs: { source: { code: `<v-btn color="primary" variant="elevated" disabled>Button</v-btn>` } } },
}

// --- Secondary ---
export const Secondary: Story = {
	args: { label: 'Button secondary ', color: 'primary', variant: 'outlined', disabled: false },
	parameters: { docs: { source: { code: `<v-btn color="primary" variant="outlined">Button</v-btn>` } } },
}
export const SecondaryLoading: Story = {
	args: { label: 'Button secondary loading', color: 'primary', variant: 'outlined', disabled: false, loading: true },
	parameters: { docs: { source: { code: `<v-btn color="primary" variant="outlined" loading>Button</v-btn>` } } },
}
export const SecondaryDisabled: Story = {
	args: { label: 'Button secondary disabled', color: 'primary', variant: 'outlined', disabled: true },
	parameters: { docs: { source: { code: `<v-btn color="primary" variant="outlined" disabled>Button</v-btn>` } } },
}

// --- Tertiary ---
export const Tertiary: Story = {
	args: { label: 'Button tertiary', color: 'primary', variant: 'text', disabled: false },
	parameters: { docs: { source: { code: `<v-btn color="primary" variant="text">Button</v-btn>` } } },
}
export const TertiaryLoading: Story = {
	args: { label: 'Button tertiary loading', color: 'primary', variant: 'text', disabled: false, loading: true },
	parameters: { docs: { source: { code: `<v-btn color="primary" variant="text" loading>Button</v-btn>` } } },
}
export const TertiaryDisabled: Story = {
	args: { label: 'Button tertiary disabled', color: 'primary', variant: 'text', disabled: true },
	parameters: { docs: { source: { code: `<v-btn color="primary" variant="text" disabled>Button</v-btn>` } } },
}

// --- Sizes ---
export const Sizes: Story = {
	render: () => ({
		template: `
            <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
                <v-btn color="primary" variant="elevated" size="x-small">X-Small</v-btn>
                <v-btn color="primary" variant="elevated" size="small">Small</v-btn>
                <v-btn color="primary" variant="elevated" size="default">Default</v-btn>
                <v-btn color="primary" variant="elevated" size="large">Large</v-btn>
                <v-btn color="primary" variant="elevated" size="x-large">X-Large</v-btn>
            </div>
        `,
	}),
	parameters: {
		docs: {
			source: {
				code: `<v-btn size="x-small">X-Small</v-btn>
<v-btn size="small">Small</v-btn>
<v-btn size="default">Default</v-btn>
<v-btn size="large">Large</v-btn>
<v-btn size="x-large">X-Large</v-btn>`,
			},
		},
	},
}
