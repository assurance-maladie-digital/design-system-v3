import type { StoryObj, Meta } from '@storybook/vue3'
import PhoneField from './PhoneField.vue'

const meta = {
	title: 'Components/PhoneField',
	component: PhoneField,
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['computedValue', 'selectedDialCode', 'phoneMask', 'counter', 'hasError', 'phoneNumber', 'mergedDialCodes'] },
	},
	argTypes: {
		modelValue: { control: 'text' },
		required: { control: 'boolean' },
		outlined: { control: 'boolean' },
		outlinedIndicatif: { control: 'boolean' },
		withCountryCode: { control: 'boolean' },
		countryCodeRequired: { control: 'boolean' },
		displayFormat: {
			control: { type: 'select' },
			description: 'Format d\'affichage des items',
			options: ['code', 'code-abbreviation', 'code-country', 'country', 'abbreviation'],
		},
		customIndicatifs: {
			control: 'object',
			description: 'Permet d\'ajouter des indicatifs à la liste pre-existante',
		},
		useCustomIndicatifsOnly: {
			control: 'boolean',
			description: 'Permet d\'utiliser uniquement les indicatifs que vous renseignez dans la props customIndicatifs',
		},
		isValidatedOnBlur: { control: 'boolean' },
	},
} satisfies Meta<typeof PhoneField>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		modelValue: '',
		required: true,
		outlined: true,
		outlinedIndicatif: true,
		withCountryCode: true,
		countryCodeRequired: true,
		displayFormat: 'code',
		customIndicatifs: [],
		useCustomIndicatifsOnly: false,
		isValidatedOnBlur: true,
	},
	render: (args) => {
		return {
			components: { PhoneField },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
				<PhoneField
					v-model="args.modelValue"
					:required="args.required"
					:outlined="args.outlined"
					:outlinedIndicatif="args.outlinedIndicatif"
					:withCountryCode="args.withCountryCode"
					:countryCodeRequired="args.countryCodeRequired"
					:displayFormat="args.displayFormat"
					:customIndicatifs="args.customIndicatifs"
					:useCustomIndicatifsOnly="args.useCustomIndicatifsOnly"
					:isValidatedOnBlur="args.isValidatedOnBlur"
				/>
				</div>
			`,
		}
	},
}

export const Required: Story = {
	args: {
		modelValue: '',
		required: true,
		outlined: true,
		outlinedIndicatif: true,
		withCountryCode: true,
		countryCodeRequired: true,
		displayFormat: 'code',
		customIndicatifs: [],
		useCustomIndicatifsOnly: false,
		isValidatedOnBlur: true,
	},
	render: (args) => {
		return {
			components: { PhoneField },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
    <PhoneField
     v-model="args.modelValue"
     :required="args.required"
     :outlined="args.outlined"
     :outlinedIndicatif="args.outlinedIndicatif"
     :withCountryCode="args.withCountryCode"
     :countryCodeRequired="args.countryCodeRequired"
     :displayFormat="args.displayFormat"
     :customIndicatifs="args.customIndicatifs"
     :useCustomIndicatifsOnly="args.useCustomIndicatifsOnly"
     :isValidatedOnBlur="args.isValidatedOnBlur"
    />
				</div>
   `,
		}
	},
}

export const CustomIndicatifs: Story = {
	args: {
		modelValue: '',
		required: false,
		outlined: true,
		outlinedIndicatif: true,
		withCountryCode: true,
		countryCodeRequired: false,
		displayFormat: 'code',
		customIndicatifs: [
			{ code: '+99', country: 'Utopia', abbreviation: 'UT', mask: '## ## ## ##', phoneLength: 8 },
			{ code: '+98', country: 'Paradise', abbreviation: 'PA', mask: '## ## ## ##', phoneLength: 18 },
		],
		useCustomIndicatifsOnly: true,
		isValidatedOnBlur: true,
	},
	render: (args) => {
		return {
			components: { PhoneField },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
    <PhoneField
     v-model="args.modelValue"
     :required="args.required"
     :outlined="args.outlined"
     :outlinedIndicatif="args.outlinedIndicatif"
     :withCountryCode="args.withCountryCode"
     :countryCodeRequired="args.countryCodeRequired"
     :displayFormat="args.displayFormat"
     :customIndicatifs="args.customIndicatifs"
     :useCustomIndicatifsOnly="args.useCustomIndicatifsOnly"
     :isValidatedOnBlur="args.isValidatedOnBlur"
    />
				</div>
   `,
		}
	},
}

export const ValidatedOnBlur: Story = {
	args: {
		modelValue: '',
		required: false,
		outlined: true,
		outlinedIndicatif: true,
		withCountryCode: true,
		countryCodeRequired: false,
		displayFormat: 'code',
		customIndicatifs: [],
		useCustomIndicatifsOnly: false,
		isValidatedOnBlur: true,
	},
	render: (args) => {
		return {
			components: { PhoneField },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
    <PhoneField
     v-model="args.modelValue"
     :required="args.required"
     :outlined="args.outlined"
     :outlinedIndicatif="args.outlinedIndicatif"
     :withCountryCode="args.withCountryCode"
     :countryCodeRequired="args.countryCodeRequired"
     :displayFormat="args.displayFormat"
     :customIndicatifs="args.customIndicatifs"
     :useCustomIndicatifsOnly="args.useCustomIndicatifsOnly"
     :isValidatedOnBlur="args.isValidatedOnBlur"
    />
				</div>
   `,
		}
	},
}

export const DisplayFormatCode: Story = {
	args: {
		modelValue: '',
		required: false,
		outlined: true,
		outlinedIndicatif: true,
		withCountryCode: true,
		countryCodeRequired: false,
		displayFormat: 'code',
		customIndicatifs: [],
		useCustomIndicatifsOnly: false,
		isValidatedOnBlur: false,
	},
	render: (args) => {
		return {
			components: { PhoneField },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
    <PhoneField
     v-model="args.modelValue"
     :required="args.required"
     :outlined="args.outlined"
     :outlinedIndicatif="args.outlinedIndicatif"
     :withCountryCode="args.withCountryCode"
     :countryCodeRequired="args.countryCodeRequired"
     :displayFormat="args.displayFormat"
     :customIndicatifs="args.customIndicatifs"
     :useCustomIndicatifsOnly="args.useCustomIndicatifsOnly"
     :isValidatedOnBlur="args.isValidatedOnBlur"
    />
				</div>
   `,
		}
	},
}

export const DisplayFormatCodeAbbreviation: Story = {
	args: {
		modelValue: '',
		required: false,
		outlined: true,
		outlinedIndicatif: true,
		withCountryCode: true,
		countryCodeRequired: false,
		displayFormat: 'code-abbreviation',
		customIndicatifs: [],
		useCustomIndicatifsOnly: false,
		isValidatedOnBlur: false,
	},
	render: (args) => {
		return {
			components: { PhoneField },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
    <PhoneField
     v-model="args.modelValue"
     :required="args.required"
     :outlined="args.outlined"
     :outlinedIndicatif="args.outlinedIndicatif"
     :withCountryCode="args.withCountryCode"
     :countryCodeRequired="args.countryCodeRequired"
     :displayFormat="args.displayFormat"
     :customIndicatifs="args.customIndicatifs"
     :useCustomIndicatifsOnly="args.useCustomIndicatifsOnly"
     :isValidatedOnBlur="args.isValidatedOnBlur"
    />
				</div>
   `,
		}
	},
}

export const DisplayFormatCodeCountry: Story = {
	args: {
		modelValue: '',
		required: false,
		outlined: true,
		outlinedIndicatif: true,
		withCountryCode: true,
		countryCodeRequired: false,
		displayFormat: 'code-country',
		customIndicatifs: [],
		useCustomIndicatifsOnly: false,
		isValidatedOnBlur: false,
	},
	render: (args) => {
		return {
			components: { PhoneField },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
    <PhoneField
     v-model="args.modelValue"
     :required="args.required"
     :outlined="args.outlined"
     :outlinedIndicatif="args.outlinedIndicatif"
     :withCountryCode="args.withCountryCode"
     :countryCodeRequired="args.countryCodeRequired"
     :displayFormat="args.displayFormat"
     :customIndicatifs="args.customIndicatifs"
     :useCustomIndicatifsOnly="args.useCustomIndicatifsOnly"
     :isValidatedOnBlur="args.isValidatedOnBlur"
    />
				</div>
   `,
		}
	},
}

export const DisplayFormatCountry: Story = {
	args: {
		modelValue: '',
		required: false,
		outlined: true,
		outlinedIndicatif: true,
		withCountryCode: true,
		countryCodeRequired: false,
		displayFormat: 'country',
		customIndicatifs: [],
		useCustomIndicatifsOnly: false,
		isValidatedOnBlur: false,
	},
	render: (args) => {
		return {
			components: { PhoneField },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
    <PhoneField
     v-model="args.modelValue"
     :required="args.required"
     :outlined="args.outlined"
     :outlinedIndicatif="args.outlinedIndicatif"
     :withCountryCode="args.withCountryCode"
     :countryCodeRequired="args.countryCodeRequired"
     :displayFormat="args.displayFormat"
     :customIndicatifs="args.customIndicatifs"
     :useCustomIndicatifsOnly="args.useCustomIndicatifsOnly"
     :isValidatedOnBlur="args.isValidatedOnBlur"
    />
				</div>
   `,
		}
	},
}

export const DisplayFormatAbbreviation: Story = {
	args: {
		modelValue: '',
		required: false,
		outlined: true,
		outlinedIndicatif: true,
		withCountryCode: true,
		countryCodeRequired: false,
		displayFormat: 'abbreviation',
		customIndicatifs: [],
		useCustomIndicatifsOnly: false,
		isValidatedOnBlur: false,
	},
	render: (args) => {
		return {
			components: { PhoneField },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
    <PhoneField
     v-model="args.modelValue"
     :required="args.required"
     :outlined="args.outlined"
     :outlinedIndicatif="args.outlinedIndicatif"
     :withCountryCode="args.withCountryCode"
     :countryCodeRequired="args.countryCodeRequired"
     :displayFormat="args.displayFormat"
     :customIndicatifs="args.customIndicatifs"
     :useCustomIndicatifsOnly="args.useCustomIndicatifsOnly"
     :isValidatedOnBlur="args.isValidatedOnBlur"
    />
							</div>
   `,
		}
	},
}
