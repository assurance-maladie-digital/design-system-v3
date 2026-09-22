import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta: Meta = {
	title: 'Composants/Composants Vuetify/VOtpInput',
	tags: ['!dev'],
	render: args => ({
		setup() {
			return { args }
		},
		template: `
      <VOtpInput 
        :length="args.length" 
        :disabled="args.disabled"
        :error="args.error"
        :variant="args.variant"
      />
    `,
	}),
}

export default meta
type Story = StoryObj<typeof meta>

// --- Default ---
export const Default: Story = {
	args: { length: 6, disabled: false, error: false, variant: 'outlined' },
	parameters: { docs: { source: { code: `<v-otp-input :length="6" />` } } },
}

export const Underlined: Story = {
	args: { length: 6, disabled: false, error: false, variant: 'underlined' },
	parameters: { docs: { source: { code: `<v-otp-input :length="6" variant="underlined" />` } } },
}

export const Filled: Story = {
	args: { length: 6, disabled: false, error: false, variant: 'filled' },
	parameters: { docs: { source: { code: `<v-otp-input :length="6" variant="filled" />` } } },
}

// --- Disabled ---
export const Disabled: Story = {
	args: { length: 6, disabled: true, error: false, variant: 'outlined' },
	parameters: { docs: { source: { code: `<v-otp-input :length="6" disabled />` } } },
}

// --- Error ---
export const Error: Story = {
	args: { length: 6, disabled: false, error: true, variant: 'outlined' },
	parameters: { docs: { source: { code: `<v-otp-input :length="6" error />` } } },
}

// --- Different lengths ---
export const FourDigits: Story = {
	args: { length: 4, disabled: false, error: false, variant: 'outlined' },
	parameters: { docs: { source: { code: `<v-otp-input :length="4" />` } } },
}
