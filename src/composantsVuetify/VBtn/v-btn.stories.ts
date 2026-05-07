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
	args: { label: 'Button primary elevated', color: 'colorPrimary', variant: 'elevated', disabled: false },
	parameters: { docs: { source: { code: `<v-btn color="colorPrimary" variant="elevated">Button</v-btn>` } } },
}
export const PrimaryOutlined: Story = {
	args: { label: 'Button primary outlined', color: 'colorPrimary', variant: 'outlined', disabled: false },
	parameters: { docs: { source: { code: `<v-btn color="colorPrimary" variant="outlined">Button</v-btn>` } } },
}
export const PrimaryTonal: Story = {
	args: { label: 'Button primary tonal', color: 'colorPrimary', variant: 'tonal', disabled: false },
	parameters: { docs: { source: { code: `<v-btn color="colorPrimary" variant="tonal">Button</v-btn>` } } },
}
export const PrimaryText: Story = {
	args: { label: 'Button primary text', color: 'colorPrimary', variant: 'text', disabled: false },
	parameters: { docs: { source: { code: `<v-btn color="colorPrimary" variant="text">Button</v-btn>` } } },
}
export const PrimaryElevatedDisabled: Story = {
	args: { label: 'Button primary elevated disabled', color: 'colorPrimary', variant: 'elevated', disabled: true },
	parameters: { docs: { source: { code: `<v-btn color="colorPrimary" variant="elevated" disabled>Button</v-btn>` } } },
}
export const PrimaryOutlinedDisabled: Story = {
	args: { label: 'Button primary outlined disabled', color: 'colorPrimary', variant: 'outlined', disabled: true },
	parameters: { docs: { source: { code: `<v-btn color="colorPrimary" variant="outlined" disabled>Button</v-btn>` } } },
}
export const PrimaryTonalDisabled: Story = {
	args: { label: 'Button primary tonal disabled', color: 'colorPrimary', variant: 'tonal', disabled: true },
	parameters: { docs: { source: { code: `<v-btn color="colorPrimary" variant="tonal" disabled>Button</v-btn>` } } },
}
export const PrimaryTextDisabled: Story = {
	args: { label: 'Button primary text disabled', color: 'colorPrimary', variant: 'text', disabled: true },
	parameters: { docs: { source: { code: `<v-btn color="colorPrimary" variant="text" disabled>Button</v-btn>` } } },
}

// --- Secondary ---
export const SecondaryElevated: Story = {
	args: { label: 'Button secondary elevated', color: 'colorSecondary', variant: 'elevated', disabled: false },
	parameters: { docs: { source: { code: `<v-btn color="colorSecondary" variant="elevated">Button</v-btn>` } } },
}
export const SecondaryOutlined: Story = {
	args: { label: 'Button secondary outlined', color: 'colorSecondary', variant: 'outlined', disabled: false },
	parameters: { docs: { source: { code: `<v-btn color="colorSecondary" variant="outlined">Button</v-btn>` } } },
}
export const SecondaryTonal: Story = {
	args: { label: 'Button secondary tonal', color: 'colorSecondary', variant: 'tonal', disabled: false },
	parameters: { docs: { source: { code: `<v-btn color="colorSecondary" variant="tonal">Button</v-btn>` } } },
}
export const SecondaryText: Story = {
	args: { label: 'Button secondary text', color: 'colorSecondary', variant: 'text', disabled: false },
	parameters: { docs: { source: { code: `<v-btn color="colorSecondary" variant="text">Button</v-btn>` } } },
}
export const SecondaryElevatedDisabled: Story = {
	args: { label: 'Button secondary elevated disabled', color: 'colorSecondary', variant: 'elevated', disabled: true },
	parameters: { docs: { source: { code: `<v-btn color="colorSecondary" variant="elevated" disabled>Button</v-btn>` } } },
}
export const SecondaryOutlinedDisabled: Story = {
	args: { label: 'Button secondary outlined disabled', color: 'colorSecondary', variant: 'outlined', disabled: true },
	parameters: { docs: { source: { code: `<v-btn color="colorSecondary" variant="outlined" disabled>Button</v-btn>` } } },
}
export const SecondaryTonalDisabled: Story = {
	args: { label: 'Button secondary tonal disabled', color: 'colorSecondary', variant: 'tonal', disabled: true },
	parameters: { docs: { source: { code: `<v-btn color="colorSecondary" variant="tonal" disabled>Button</v-btn>` } } },
}
export const SecondaryTextDisabled: Story = {
	args: { label: 'Button secondary text disabled', color: 'colorSecondary', variant: 'text', disabled: true },
	parameters: { docs: { source: { code: `<v-btn color="colorSecondary" variant="text" disabled>Button</v-btn>` } } },
}

// --- Tertiary ---
export const TertiaryElevated: Story = {
	args: { label: 'Button tertiary elevated', color: 'tertiary', variant: 'elevated', disabled: false },
	parameters: { docs: { source: { code: `<v-btn color="tertiary" variant="elevated">Button</v-btn>` } } },
}
export const TertiaryOutlined: Story = {
	args: { label: 'Button tertiary outlined', color: 'tertiary', variant: 'outlined', disabled: false },
	parameters: { docs: { source: { code: `<v-btn color="tertiary" variant="outlined">Button</v-btn>` } } },
}
export const TertiaryTonal: Story = {
	args: { label: 'Button tertiary tonal', color: 'tertiary', variant: 'tonal', disabled: false },
	parameters: { docs: { source: { code: `<v-btn color="tertiary" variant="tonal">Button</v-btn>` } } },
}
export const TertiaryText: Story = {
	args: { label: 'Button tertiary text', color: 'tertiary', variant: 'text', disabled: false },
	parameters: { docs: { source: { code: `<v-btn color="tertiary" variant="text">Button</v-btn>` } } },
}
export const TertiaryElevatedDisabled: Story = {
	args: { label: 'Button tertiary elevated disabled', color: 'tertiary', variant: 'elevated', disabled: true },
	parameters: { docs: { source: { code: `<v-btn color="tertiary" variant="elevated" disabled>Button</v-btn>` } } },
}
export const TertiaryOutlinedDisabled: Story = {
	args: { label: 'Button tertiary outlined disabled', color: 'tertiary', variant: 'outlined', disabled: true },
	parameters: { docs: { source: { code: `<v-btn color="tertiary" variant="outlined" disabled>Button</v-btn>` } } },
}
export const TertiaryTonalDisabled: Story = {
	args: { label: 'Button tertiary tonal disabled', color: 'tertiary', variant: 'tonal', disabled: true },
	parameters: { docs: { source: { code: `<v-btn color="tertiary" variant="tonal" disabled>Button</v-btn>` } } },
}
export const TertiaryTextDisabled: Story = {
	args: { label: 'Button tertiary text disabled', color: 'tertiary', variant: 'text', disabled: true },
	parameters: { docs: { source: { code: `<v-btn color="tertiary" variant="text" disabled>Button</v-btn>` } } },
}
