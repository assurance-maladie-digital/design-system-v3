import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta: Meta = {
	title: 'Composants/Composants Vuetify/VBtn',
	tags: ['!dev'],
	render: args => ({
		setup() {
			return { args }
		},
		template: `
          <v-btn
              :color="args.color"
              :variant="args.variant"
              :disabled="args.disabled"
              :loading="args.loading"
              :ripple="false"
          >
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
	parameters: { docs: { source: { code: `<v-btn color="primary" variant="elevated" :ripple="false">Button</v-btn>` } } },
}
export const PrimaryLoading: Story = {
	args: { label: 'Button primary loading', color: 'primary', variant: 'elevated', disabled: false, loading: true },
	parameters: { docs: { source: { code: `<v-btn color="primary" variant="elevated" loading :ripple="false">Button</v-btn>` } } },
}
export const PrimaryDisabled: Story = {
	args: { label: 'Button primary disabled', color: 'primary', variant: 'elevated', disabled: true },
	parameters: { docs: { source: { code: `<v-btn color="primary" variant="elevated" disabled :ripple="false">Button</v-btn>` } } },
}

// --- Secondary ---
export const Secondary: Story = {
	args: { label: 'Button secondary ', color: 'primary', variant: 'outlined', disabled: false },
	parameters: { docs: { source: { code: `<v-btn color="primary" variant="outlined" :ripple="false">Button</v-btn>` } } },
}
export const SecondaryLoading: Story = {
	args: { label: 'Button secondary loading', color: 'primary', variant: 'outlined', disabled: false, loading: true },
	parameters: { docs: { source: { code: `<v-btn color="primary" variant="outlined" loading :ripple="false">Button</v-btn>` } } },
}
export const SecondaryDisabled: Story = {
	args: { label: 'Button secondary disabled', color: 'primary', variant: 'outlined', disabled: true },
	parameters: { docs: { source: { code: `<v-btn color="primary" variant="outlined" disabled :ripple="false">Button</v-btn>` } } },
}

// --- Tertiary ---
export const Tertiary: Story = {
	args: { label: 'Button tertiary', color: 'primary', variant: 'text', disabled: false },
	parameters: { docs: { source: { code: `<v-btn color="primary" variant="text" :ripple="false">Button</v-btn>` } } },
}
export const TertiaryLoading: Story = {
	args: { label: 'Button tertiary loading', color: 'primary', variant: 'text', disabled: false, loading: true },
	parameters: { docs: { source: { code: `<v-btn color="primary" variant="text" loading :ripple="false">Button</v-btn>` } } },
}
export const TertiaryDisabled: Story = {
	args: { label: 'Button tertiary disabled', color: 'primary', variant: 'text', disabled: true },
	parameters: { docs: { source: { code: `<v-btn color="primary" variant="text" disabled :ripple="false">Button</v-btn>` } } },
}

// --- Primary ---
export const PrimaryDestructive: Story = {
	args: { label: 'Button primary', color: 'error', variant: 'elevated', disabled: false },
	parameters: { docs: { source: { code: `<v-btn color="error" variant="elevated" :ripple="false">Button</v-btn>` } } },
}
export const PrimaryDestructiveLoading: Story = {
	args: { label: 'Button primary loading', color: 'error', variant: 'elevated', disabled: false, loading: true },
	parameters: { docs: { source: { code: `<v-btn color="error" variant="elevated" loading :ripple="false">Button</v-btn>` } } },
}
export const PrimaryDestructiveDisabled: Story = {
	args: { label: 'Button primary disabled', color: 'error', variant: 'elevated', disabled: true },
	parameters: { docs: { source: { code: `<v-btn color="error" variant="elevated" disabled :ripple="false">Button</v-btn>` } } },
}

// --- Secondary ---
export const SecondaryDestructive: Story = {
	args: { label: 'Button secondary ', color: 'error', variant: 'outlined', disabled: false },
	parameters: { docs: { source: { code: `<v-btn color="error" variant="outlined" :ripple="false">Button</v-btn>` } } },
}
export const SecondaryDestructiveLoading: Story = {
	args: { label: 'Button secondary loading', color: 'error', variant: 'outlined', disabled: false, loading: true },
	parameters: { docs: { source: { code: `<v-btn color="error" variant="outlined" loading :ripple="false">Button</v-btn>` } } },
}
export const SecondaryDestructiveDisabled: Story = {
	args: { label: 'Button secondary disabled', color: 'error', variant: 'outlined', disabled: true },
	parameters: { docs: { source: { code: `<v-btn color="error" variant="outlined" disabled :ripple="false">Button</v-btn>` } } },
}

// --- Tertiary ---
export const TertiaryDestructive: Story = {
	args: { label: 'Button tertiary', color: 'error', variant: 'text', disabled: false },
	parameters: { docs: { source: { code: `<v-btn color="error" variant="text" :ripple="false">Button</v-btn>` } } },
}
export const TertiaryDestructiveLoading: Story = {
	args: { label: 'Button tertiary loading', color: 'error', variant: 'text', disabled: false, loading: true },
	parameters: { docs: { source: { code: `<v-btn color="error" variant="text" loading :ripple="false">Button</v-btn>` } } },
}
export const TertiaryDestructiveDisabled: Story = {
	args: { label: 'Button tertiary disabled', color: 'error', variant: 'text', disabled: true },
	parameters: { docs: { source: { code: `<v-btn color="error" variant="text" disabled :ripple="false">Button</v-btn>` } } },
}
