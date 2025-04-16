import { type Meta, type StoryFn } from '@storybook/vue3'
import DatePickerValidationExamples from './DatePickerValidationExamples.vue'

export default {
	title: 'Composants/Formulaires/DatePicker/Validation',
	component: DatePickerValidationExamples,
	argTypes: {},
	parameters: {
		docs: {
			description: {
				component: 'Exemples de validation pour le composant DatePicker.',
			},
		},
	},
} as Meta

export const ValidationExamples: StoryFn = () => ({
	components: {
		DatePickerValidationExamples,
	},
	template: '<DatePickerValidationExamples />',
})
