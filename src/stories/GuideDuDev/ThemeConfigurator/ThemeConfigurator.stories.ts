import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ThemeConfigurator from './ThemeConfigurator.vue'

const meta = {
	title: 'Guide Du Dev/Démarrage/Customisation du thème',
	component: ThemeConfigurator,
	parameters: {
		layout: 'padded',
	},
} satisfies Meta<typeof ThemeConfigurator>

export default meta

type Story = StoryObj<typeof meta>

export const Configurator: Story = {
	tags: ['!dev'],
}
