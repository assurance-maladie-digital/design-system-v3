import type { Meta, StoryObj } from '@storybook/vue3'

const meta: Meta = {
	title: 'Composants/Boutons/Btn',
	argTypes: {
		label: { control: 'text' },
		class: {
			control: 'select',
			options: ['primary', 'secondary', 'tertiary', 'disabled'],
		},
	},
	args: {
		label: 'Bouton',
		class: 'primary',
	},
	render: args => ({
		setup() {
			return { args }
		},
		template: `
      <v-btn :class="[args.class]">
        {{ args.label }}
      </v-btn>
    `,
	}),
}

export default meta
type Story = StoryObj<typeof meta>

export const Primaire: Story = {
	name: 'Primaire',
	args: { label: 'Bouton primaire', class: 'primary' },
}

export const PrimaireDisabled: Story = {
	name: 'Primaire – Désactivé',
	args: { label: 'Bouton primaire désactivé', class: 'primary disabled' },
}

export const Secondaire: Story = {
	name: 'Secondaire',
	args: { label: 'Bouton secondaire', class: 'secondary' },
}

export const SecondaireDisabled: Story = {
	name: 'Secondaire – Désactivé',
	args: { label: 'Bouton secondaire désactivé', class: 'secondary disabled' },
}

export const Tertiaire: Story = {
	name: 'Tertiaire ',
	args: { label: 'Bouton tertiaire', class: 'tertiary' },
}

export const TertiaireDisabled: Story = {
	name: 'Tertiaire – Désactivé ',
	args: { label: 'Bouton tertiaire désactivé', class: 'tertiary disabled' },
}
