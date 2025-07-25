import { type Meta, type StoryFn } from '@storybook/vue3'
import DatePickerValidationExamples from '../docExamples/DatePickerValidationExamples.vue'
import DatePickerBidirectionalValidation from '../docExamples/DatePickerBidirectionalValidation.vue'

export default {
	title: 'Composants/Formulaires/DatePicker/Validation',
	component: DatePickerValidationExamples,
	argTypes: {},
	parameters: {
		docs: {
			description: {
				component: 'Exemples de validation pour le composant CalendarMode.',
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

export const BidirectionalValidation: StoryFn = () => ({
	components: {
		DatePickerBidirectionalValidation,
	},
	template: '<DatePickerBidirectionalValidation />',
})
