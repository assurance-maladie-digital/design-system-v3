import type { StoryObj, Meta } from '@storybook/vue3'
import PhoneField from './PhoneField.vue'

const meta = {
	title: 'Composants/Formulaires/PhoneField',
	component: PhoneField,
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['computedValue', 'phoneMask', 'counter', 'hasError', 'phoneNumber', 'mergedDialCodes'] },
	},
	argTypes: {
		modelValue: { control: false },
		dialCodeModel: { control: false },
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
		displayAsterisk: { control: 'boolean' },
		disableErrorHandling: { control: 'boolean' },
	},
} satisfies Meta<typeof PhoneField>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<PhoneField
						v-model="modelValue"
						:required="required"
						:withCountryCode="withCountryCode"
						:countryCodeRequired="countryCodeRequired"
						:displayFormat="displayFormat"
						:customIndicatifs="customIndicatifs"
						:useCustomIndicatifsOnly="useCustomIndicatifsOnly"
						:isValidatedOnBlur="isValidatedOnBlur"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { PhoneField } from '@cnamts/synapse'
					
					const modelValue = ref('')
					const required = ref(true)
					const withCountryCode = ref(true)
					const countryCodeRequired = ref(true)
					const displayFormat = ref('code')
					const customIndicatifs = ref([])
					const useCustomIndicatifsOnly = ref(false)
					const isValidatedOnBlur = ref(true)
				</script>
				`,
			},
		],
	},
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
				<br><br><br><br><br>
			`,
		}
	},
}

export const Required: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<PhoneField
						v-model="modelValue"
						:required="required"
						:withCountryCode="withCountryCode"
						:countryCodeRequired="countryCodeRequired"
						:displayFormat="displayFormat"
						:customIndicatifs="customIndicatifs"
						:useCustomIndicatifsOnly="useCustomIndicatifsOnly"
						:isValidatedOnBlur="isValidatedOnBlur"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { PhoneField } from '@cnamts/synapse'
					
					const modelValue = ref('')
					const required = ref(true)
					const withCountryCode = ref(true)
					const countryCodeRequired = ref(true)
					const displayFormat = ref('code')
					const customIndicatifs = ref([])
					const useCustomIndicatifsOnly = ref(false)
					const isValidatedOnBlur = ref(true)
				</script>
				`,
			},
		],
	},
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

/**
 * Story avec champ requis et astérisque.
 */
export const RequiredWithAsterisk: Story = {
	args: {
		...Default.args,
		required: true,
		displayAsterisk: true,
	},
	parameters: {
		docs: {
			description: {
				story: 'Version du champ téléphone requis avec un astérisque visuel.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <PhoneField
    v-model="phoneNumber"
    required
    display-asterisk
  />
</template>
        `,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import PhoneField from '@cnamts/synapse'

const phoneNumber = ref('')
</script>
        `,
			},
		],
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
						:display-asterisk="args.displayAsterisk"
					/>
				</div>
			`,
		}
	},
}

export const CustomIndicatifs: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<PhoneField
						v-model="modelValue"
						:required="required"
						:withCountryCode="withCountryCode"
						:countryCodeRequired="countryCodeRequired"
						:displayFormat="displayFormat"
						:customIndicatifs="customIndicatifs"
						:useCustomIndicatifsOnly="useCustomIndicatifsOnly"
						:isValidatedOnBlur="isValidatedOnBlur"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { PhoneField } from '@cnamts/synapse'
					
					const modelValue = ref('')
					const required = ref(true)
					const withCountryCode = ref(true)
					const countryCodeRequired = ref(true)
					const displayFormat = ref('code')
					const customIndicatifs = [
                        { code: '+33', country: 'France', abbreviation: 'FR', phoneLength: 10, mask: '## ## ## ## ##' },
                        { code: '+34', country: 'Spain', abbreviation: 'ES', phoneLength: 9, mask: '### ### ###' },
						{ code: '+199', country: 'Utopia', abbreviation: 'UT', mask: '## ## ## ##', phoneLength: 8 },
						{ code: '+198', country: 'Paradise', abbreviation: 'PA', mask: '## ## ## ##', phoneLength: 10 },
					]
					const useCustomIndicatifsOnly = ref(false)
					const isValidatedOnBlur = ref(true)
				</script>
				`,
			},
		],
	},
	args: {
		modelValue: '',
		required: false,
		outlined: true,
		outlinedIndicatif: true,
		withCountryCode: true,
		countryCodeRequired: false,
		displayFormat: 'code',
		customIndicatifs: [
			{ code: '+33', country: 'France', abbreviation: 'FR', phoneLength: 10, mask: '## ## ## ## ##' },
			{ code: '+34', country: 'Spain', abbreviation: 'ES', phoneLength: 9, mask: '### ### ###' },
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

export const NotValidatedOnBlur: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<PhoneField
						v-model="modelValue"
						:required="required"
						:withCountryCode="withCountryCode"
						:countryCodeRequired="countryCodeRequired"
						:displayFormat="displayFormat"
						:customIndicatifs="customIndicatifs"
						:useCustomIndicatifsOnly="useCustomIndicatifsOnly"
						:isValidatedOnBlur="isValidatedOnBlur"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { PhoneField } from '@cnamts/synapse'
					
					const modelValue = ref('')
					const required = ref(true)
					const withCountryCode = ref(true)
					const countryCodeRequired = ref(true)
					const displayFormat = ref('code')
					const customIndicatifs = ref([])
					const useCustomIndicatifsOnly = ref(false)
					const isValidatedOnBlur = ref(false)
				</script>
				`,
			},
		],
	},
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

export const DisplayFormatCode: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<PhoneField
						v-model="modelValue"
						:required="required"
						:withCountryCode="withCountryCode"
						:countryCodeRequired="countryCodeRequired"
						:displayFormat="displayFormat"
						:customIndicatifs="customIndicatifs"
						:useCustomIndicatifsOnly="useCustomIndicatifsOnly"
						:isValidatedOnBlur="isValidatedOnBlur"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { PhoneField } from '@cnamts/synapse'
					
					const modelValue = ref('')
					const required = ref(true)
					const withCountryCode = ref(true)
					const countryCodeRequired = ref(true)
					const displayFormat = ref('code')
					const customIndicatifs = ref([])
					const useCustomIndicatifsOnly = ref(false)
					const isValidatedOnBlur = ref(true)
				</script>
				`,
			},
		],
	},
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
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<PhoneField
						v-model="modelValue"
						:required="required"
						:withCountryCode="withCountryCode"
						:countryCodeRequired="countryCodeRequired"
						:displayFormat="displayFormat"
						:customIndicatifs="customIndicatifs"
						:useCustomIndicatifsOnly="useCustomIndicatifsOnly"
						:isValidatedOnBlur="isValidatedOnBlur"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { PhoneField } from '@cnamts/synapse'
					
					const modelValue = ref('')
					const required = ref(true)
					const withCountryCode = ref(true)
					const countryCodeRequired = ref(true)
					const displayFormat = ref('code-abbreviation')
					const customIndicatifs = ref([])
					const useCustomIndicatifsOnly = ref(false)
					const isValidatedOnBlur = ref(true)
				</script>
				`,
			},
		],
	},
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
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<PhoneField
						v-model="modelValue"
						:required="required"
						:withCountryCode="withCountryCode"
						:countryCodeRequired="countryCodeRequired"
						:displayFormat="displayFormat"
						:customIndicatifs="customIndicatifs"
						:useCustomIndicatifsOnly="useCustomIndicatifsOnly"
						:isValidatedOnBlur="isValidatedOnBlur"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { PhoneField } from '@cnamts/synapse'
					
					const modelValue = ref('')
					const required = ref(true)
					const withCountryCode = ref(true)
					const countryCodeRequired = ref(true)
					const displayFormat = ref('code-country')
					const customIndicatifs = ref([])
					const useCustomIndicatifsOnly = ref(false)
					const isValidatedOnBlur = ref(true)
				</script>
				`,
			},
		],
	},
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
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<PhoneField
						v-model="modelValue"
						:required="required"
						:withCountryCode="withCountryCode"
						:countryCodeRequired="countryCodeRequired"
						:displayFormat="displayFormat"
						:customIndicatifs="customIndicatifs"
						:useCustomIndicatifsOnly="useCustomIndicatifsOnly"
						:isValidatedOnBlur="isValidatedOnBlur"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { PhoneField } from '@cnamts/synapse'
					
					const modelValue = ref('')
					const required = ref(true)
					const withCountryCode = ref(true)
					const countryCodeRequired = ref(true)
					const displayFormat = ref('country')
					const customIndicatifs = ref([])
					const useCustomIndicatifsOnly = ref(false)
					const isValidatedOnBlur = ref(true)
				</script>
				`,
			},
		],
	},
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
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<PhoneField
						v-model="modelValue"
						:required="required"
						:withCountryCode="withCountryCode"
						:countryCodeRequired="countryCodeRequired"
						:displayFormat="displayFormat"
						:customIndicatifs="customIndicatifs"
						:useCustomIndicatifsOnly="useCustomIndicatifsOnly"
						:isValidatedOnBlur="isValidatedOnBlur"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { PhoneField } from '@cnamts/synapse'
					
					const modelValue = ref('')
					const required = ref(true)
					const withCountryCode = ref(true)
					const countryCodeRequired = ref(true)
					const displayFormat = ref('abbreviation')
					const customIndicatifs = ref([])
					const useCustomIndicatifsOnly = ref(false)
					const isValidatedOnBlur = ref(true)
				</script>
				`,
			},
		],
	},
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

export const DisplayModels: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
        <template>
        	<span>
				{{ args.selectedDialCode }} - {{ args.modelValue }}
			</span>
          <PhoneField
            v-model="modelValue"
            v-model:selectedDialCode="selectedDialCode"
            :required="required"
            :withCountryCode="withCountryCode"
            :countryCodeRequired="countryCodeRequired"
            :displayFormat="displayFormat"
            :customIndicatifs="customIndicatifs"
            :useCustomIndicatifsOnly="useCustomIndicatifsOnly"
            :isValidatedOnBlur="isValidatedOnBlur"
          />
        </template>
        `,
			},
			{
				name: 'Script',
				code: `
        <script setup lang="ts">
          import { PhoneField } from '@cnamts/synapse'

          const modelValue = ref('')
          const selectedDialCode = ref('')
          const required = ref(true)
          const withCountryCode = ref(true)
          const countryCodeRequired = ref(true)
          const displayFormat = ref('code-country')
          const customIndicatifs = ref([])
          const useCustomIndicatifsOnly = ref(false)
          const isValidatedOnBlur = ref(true)
        </script>
        `,
			},
		],
	},
	args: {
		modelValue: '',
		dialCodeModel: '',
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
					<div class="pa-4">
						{{ args.dialCodeModel }} - {{ args.modelValue }}
					</div>
					<PhoneField
						v-model="args.modelValue"
						v-model:selected-dial-code="args.dialCodeModel"
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

/**
 * Story qui montre le comportement du composant lorsque la gestion des erreurs est désactivée.
 * Aucun message d'erreur ne sera affiché, même si le champ est requis et vide.
 */
export const DisabledErrorHandling: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<PhoneField
						v-model="modelValue"
						:required="required"
						:withCountryCode="withCountryCode"
						:countryCodeRequired="countryCodeRequired"
						:displayFormat="displayFormat"
						:isValidatedOnBlur="isValidatedOnBlur"
						:disableErrorHandling="disableErrorHandling"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { PhoneField } from '@cnamts/synapse'
					
					const modelValue = ref('')
					const required = ref(true)
					const withCountryCode = ref(true)
					const countryCodeRequired = ref(true)
					const displayFormat = ref('code')
					const isValidatedOnBlur = ref(true)
					const disableErrorHandling = ref(true)
				</script>
				`,
			},
		],
	},
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
		disableErrorHandling: true,
	},
	render: (args) => {
		return {
			components: { PhoneField },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
					<h3>Gestion des erreurs désactivée</h3>
					<p>Ce champ est requis mais n'affichera pas d'erreur même s'il est vide.</p>
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
						:disableErrorHandling="args.disableErrorHandling"
					/>
					<div class="mt-6">
						<h3>Comparaison avec gestion des erreurs activée</h3>
						<p>Ce champ est requis et affichera une erreur s'il est vide.</p>
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
							:disableErrorHandling="false"
						/>
					</div>
				</div>
			`,
		}
	},
}
