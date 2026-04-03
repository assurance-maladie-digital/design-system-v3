import type { Meta, StoryObj } from '@storybook/vue3'

const meta: Meta = {
	title: 'Composants/Composants Vuetify/VBtn',
	tags: ['!dev'],
	render: args => ({
		setup() {
			return { args }
		},
		template: `
      <v-btn :color="args.color" :variant="args.variant" :disabled="args.disabled">
        {{ args.label }}
      </v-btn>
    `,
	}),
}

export default meta
type Story = StoryObj<typeof meta>

// --- Primary ---
export const PrimaryElevated: Story = {
	args: { label: 'Button primary elevated', color: 'primary', variant: 'elevated', disabled: false },
}
export const PrimaryOutlined: Story = {
	args: { label: 'Button primary outlined', color: 'primary', variant: 'outlined', disabled: false },
}
export const PrimaryTonal: Story = {
	args: { label: 'Button primary tonal', color: 'primary', variant: 'tonal', disabled: false },
}
export const PrimaryText: Story = {
	args: { label: 'Button primary text', color: 'primary', variant: 'text', disabled: false },
}
export const PrimaryElevatedDisabled: Story = {
	args: { label: 'Button primary elevated disabled', color: 'primary', variant: 'elevated', disabled: true },
}
export const PrimaryOutlinedDisabled: Story = {
	args: { label: 'Button primary outlined disabled', color: 'primary', variant: 'outlined', disabled: true },
}
export const PrimaryTonalDisabled: Story = {
	args: { label: 'Button primary tonal disabled', color: 'primary', variant: 'tonal', disabled: true },
}
export const PrimaryTextDisabled: Story = {
	args: { label: 'Button primary text disabled', color: 'primary', variant: 'text', disabled: true },
}

// --- Secondary ---
export const SecondaryElevated: Story = {
	args: { label: 'Button secondary elevated', color: 'secondary', variant: 'elevated', disabled: false },
}
export const SecondaryOutlined: Story = {
	args: { label: 'Button secondary outlined', color: 'secondary', variant: 'outlined', disabled: false },
}
export const SecondaryTonal: Story = {
	args: { label: 'Button secondary tonal', color: 'secondary', variant: 'tonal', disabled: false },
}
export const SecondaryText: Story = {
	args: { label: 'Button secondary text', color: 'secondary', variant: 'text', disabled: false },
}
export const SecondaryElevatedDisabled: Story = {
	args: { label: 'Button secondary elevated disabled', color: 'secondary', variant: 'elevated', disabled: true },
}
export const SecondaryOutlinedDisabled: Story = {
	args: { label: 'Button secondary outlined disabled', color: 'secondary', variant: 'outlined', disabled: true },
}
export const SecondaryTonalDisabled: Story = {
	args: { label: 'Button secondary tonal disabled', color: 'secondary', variant: 'tonal', disabled: true },
}
export const SecondaryTextDisabled: Story = {
	args: { label: 'Button secondary text disabled', color: 'secondary', variant: 'text', disabled: true },
}

// --- Tertiary ---
export const TertiaryElevated: Story = {
	args: { label: 'Button tertiary elevated', color: 'tertiary', variant: 'elevated', disabled: false },
}
export const TertiaryOutlined: Story = {
	args: { label: 'Button tertiary outlined', color: 'tertiary', variant: 'outlined', disabled: false },
}
export const TertiaryTonal: Story = {
	args: { label: 'Button tertiary tonal', color: 'tertiary', variant: 'tonal', disabled: false },
}
export const TertiaryText: Story = {
	args: { label: 'Button tertiary text', color: 'tertiary', variant: 'text', disabled: false },
}
export const TertiaryElevatedDisabled: Story = {
	args: { label: 'Button tertiary elevated disabled', color: 'tertiary', variant: 'elevated', disabled: true },
}
export const TertiaryOutlinedDisabled: Story = {
	args: { label: 'Button tertiary outlined disabled', color: 'tertiary', variant: 'outlined', disabled: true },
}
export const TertiaryTonalDisabled: Story = {
	args: { label: 'Button tertiary tonal disabled', color: 'tertiary', variant: 'tonal', disabled: true },
}
export const TertiaryTextDisabled: Story = {
	args: { label: 'Button tertiary text disabled', color: 'tertiary', variant: 'text', disabled: true },
}
