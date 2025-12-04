import type { Meta, StoryObj } from '@storybook/vue3'
import LunarCalendar from './LunarCalendar.vue'

const meta = {
	title: 'Composants/Formulaires/LunarCalendar',
	component: LunarCalendar,
	argTypes: {
		modelValue: {
			description: 'La valeur du calendrier lunaire au format DD/MM/YYYY',
			control: { type: 'text' },
		},
		minYear: {
			description: 'Année minimale autorisée',
			control: { type: 'number' },
		},
		maxYear: {
			description: 'Année maximale autorisée',
			control: { type: 'number' },
		},
	},
	args: {
		modelValue: '',
	},
} satisfies Meta<typeof LunarCalendar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		modelValue: '',
	},
}

export const WithYearConstraints: Story = {
	args: {
		modelValue: '16/08/1550',
		minYear: 1400,
		maxYear: 1500,
	},
}

export const WithMinYearOnly: Story = {
	args: {
		modelValue: '12/12/1445',
		minYear: 1420,
	},
}

export const WithMaxYearOnly: Story = {
	args: {
		modelValue: '12/12/1445',
		maxYear: 1450,
	},
}
