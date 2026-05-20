import type { StoryObj, Meta } from '@storybook/vue3'
import PhoneField from './PhoneField.vue'
import { ref, watch } from 'vue'
import { indicatifs } from './indicatifs'
import { getValidationDocumentation } from '@/composables/unifyValidation/documentationValidationProps'
import { fn } from '@storybook/test'

const meta = {
	title: 'Composants/Formulaires/PhoneField',
	component: PhoneField,
	parameters: {
		layout: 'fullscreen',
		actions: { argTypesRegex: '^on.*' },
		controls: { exclude: /^on*/ },
	},
	argTypes: {
		'modelValue': {
			control: 'string',
			description: 'Valeur du champ numéro de téléphone. Ne doit contenir que les chiffres du numéro national, sans l\'indicatif pays. Par exemple, pour un numéro français +33 6 12 34 56 78, le `modelValue` doit être `0612345678`.',
			table: {
				type: {
					summary: 'string',
				},
			},
		},
		'bgColor': {
			control: 'color',
			description: 'Couleur de fond du champ.',
			table: {
				type: {
					summary: 'string',
				},
			},
		},
		'dialCodeModel': {
			control: 'string',
			description: 'Valeur de l\'indicatif pays sélectionné. Peut être une chaîne (ex : "+33") ou un objet indicatif complet (ex : { code: "+33", country: "France", abbreviation: "FR" }).' },
		'outlined': { control: 'boolean' },
		'withCountryCode': {
			control: 'boolean',
			description: 'Affiche un sélecteur d\'indicatif pays à côté du champ numéro de téléphone. Lorsque cette prop est à `true`, le champ est divisé en deux parties : un sélecteur pour l\'indicatif pays et un champ pour le numéro national.',
			table: {
				type: {
					summary: 'boolean',
				},
			},
		},
		'displayFormat': {
			control: { type: 'select' },
			description: 'Format d\'affichage des options d\'indicatif pays dans le sélecteur. Les formats disponibles sont :\n\n- `code` (ex : +33)\n- `code-abbreviation` (ex : +33 - FR)\n- `code-country` (ex : +33 - France)\n- `country` (ex : France)\n- `abbreviation` (ex : FR)',
			options: ['code', 'code-abbreviation', 'code-country', 'country', 'abbreviation'],
			table: {
				type: {
					summary: `'code' | 'code-abbreviation' | 'code-country' | 'country' | 'abbreviation'`,
				},
			},
		},
		'customIndicatifs': {
			table: {
				type: {
					summary: 'Indicatif[]',
					details: `{
	code: string
	abbreviation: string
	country: string
	countryFr?: string
	mask?: string
	phoneLength?: number
}[]					
` },
			},
			control: 'object',
			description: 'Permet d\'ajouter des indicatifs à la liste pre-existante',
		},
		'countryCodeRequired': {
			control: 'boolean',
			description: 'Rend la sélection de l\'indicatif pays obligatoire. Si `withCountryCode` est à `true` et que cette prop est également à `true`, l\'utilisateur doit sélectionner un indicatif pays pour que le champ soit considéré comme valide.',
		},
		'useCustomIndicatifsOnly': {
			control: 'boolean',
			description: 'Permet d\'utiliser uniquement les indicatifs que vous renseignez dans la props customIndicatifs',
		},
		'helpText': {
			control: 'text',
			description: 'Texte d\'aide affiché sous le champ. Lorsque présent, les messages d\'erreur incluent un exemple concret distinct du texte d\'aide.',
			table: {
				type: {
					summary: 'string',
				},
			},
		},
		'autocompleteCountryCode': {
			control: 'text',
			description: 'Valeur de l\'attribut `autocomplete` pour le champ indicatif pays. Utiliser `tel-country-code` (défaut) lorsque le numéro est séparé en deux champs (indicatif + numéro national), conformément à [WHATWG](https://html.spec.whatwg.org/#autofill-field-tel-country-code) et [WCAG 1.3.5](https://www.w3.org/WAI/WCAG21/quickref/#identify-input-purpose).',
			table: {
				type: {
					summary: `'autocomplete' | 'tel-country-code' | undefined`,
				},
			},
		},
		'autocompletePhone': {
			control: 'text',
			table: {
				type: {
					summary: `'autocomplete' | 'tel-national' | 'tel' | 'tel-extension'`,
				},
			},
			description: 'Valeur de l\'attribut `autocomplete` pour le champ numéro de téléphone. Valeurs recommandées selon le scénario :\n\n- `tel-national` (défaut) — numéro sans indicatif, lorsque le composant est en mode deux champs (`withCountryCode`).\n- `tel` — numéro complet avec indicatif intégré, pour un champ unique sans sélecteur de pays.\n- `tel-extension` — poste ou extension téléphonique.',
		},
		'displayAsterisk': { control: 'boolean' },
		'update:modelValue': {
			action: 'update:modelValue',
			table: {
				type: {
					summary: 'string',
				},
			},
		},
		'update:dialCodeModel': {
			action: 'update:dialCodeModel',
			table: {
				type: {
					summary: 'Indicatif',
					details: `{
	code: string
	abbreviation: string
	country: string
	countryFr?: string
	mask?: string
	phoneLength?: number
}					
`,
				},
			},
		},
		...getValidationDocumentation('string'),
	} as Record<string, unknown>,
	args: {
		'onUpdate:modelValue': fn(),
		'onUpdate:dialCodeModel': fn(),
	} as Record<string, unknown>,
} satisfies Meta<typeof PhoneField>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		a11y: {
			disable: false,
		},
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
						:isValidateOnBlur="isValidateOnBlur"
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
					const isValidateOnBlur = ref(true)
				</script>
				`,
			},
		],
	},
	args: {
		modelValue: '',
		required: false,
		outlined: true,
		withCountryCode: true,
		countryCodeRequired: true,
		displayFormat: 'code',
		customIndicatifs: [],
		useCustomIndicatifsOnly: false,
		isValidateOnBlur: true,
		bgColor: 'white',
		readonly: false,
		disabled: false,
	},
	render: (args) => {
		return {
			components: { PhoneField },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4 mb-8">
					<PhoneField
						v-bind="args"
					/>
				</div>
			`,
		}
	},
}

export const Required: Story = {
	parameters: {
		a11y: {
			disable: false,
		},
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
						:isValidateOnBlur="isValidateOnBlur"
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
					const isValidateOnBlur = ref(true)
				</script>
				`,
			},
		],
	},
	args: {
		modelValue: '',
		required: true,
		outlined: true,
		withCountryCode: true,
		countryCodeRequired: true,
		displayFormat: 'code',
		customIndicatifs: [],
		useCustomIndicatifsOnly: false,
		isValidateOnBlur: true,
		bgColor: 'white',
		readonly: false,
		disabled: false,
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
     v-bind="args"
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
		bgColor: 'white',
	},
	parameters: {
		a11y: {
			disable: false,
		},
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
						v-bind="args"
					/>
				</div>
			`,
		}
	},
}

export const HelpText: Story = {
	parameters: {
		a11y: {
			disable: false,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div class="pa-4">
		<div class="mb-6">
			<h4 class="mb-2">Avec aide à la saisie</h4>
			<PhoneField
				v-model="phoneValue1"
				required
				help-text="Saisissez votre numéro de téléphone au format 01 23 45 67 89"
				label="Numéro de téléphone"
			/>
			<p class="text-caption mt-2">
				Essayez de laisser le champ vide ou de saisir un numéro incorrect pour voir 
				l'exemple dans le message d'erreur (différent de l'aide).
			</p>
		</div>

		<div class="mb-6">
			<h4 class="mb-2">Avec aide à la saisie et indicatif pays</h4>
			<PhoneField
				v-model="phoneValue2"
				v-model:selected-dial-code="dialCodeModel"
				required
				with-country-code
				help-text="Choisissez votre pays et saisissez votre numéro de téléphone"
				label="Numéro de téléphone international"
			/>
			<p class="text-caption mt-2">
				L'exemple dans le message d'erreur s'adapte au format du pays sélectionné.
			</p>
		</div>

		<div class="mt-4">
			<h4>Valeurs actuelles :</h4>
			<pre class="text-caption">phoneValue1: {{ phoneValue1 }}</pre>
			<pre class="text-caption">phoneValue2: {{ phoneValue2 }}</pre>
			<pre class="text-caption">dialCodeModel: {{ dialCodeModel }}</pre>
		</div>
	</div>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import PhoneField from './PhoneField.vue'

const phoneValue1 = ref('')
const phoneValue2 = ref('')
const dialCodeModel = ref('')
</script>`,
			},
		],
	},
	args: {
		required: true,
		helpText: 'Saisissez votre numéro de téléphone français au format 01 23 45 67 89',
	},
	render(args) {
		return {
			components: { PhoneField },
			setup() {
				const phoneValue1 = ref('')
				const phoneValue2 = ref('')
				const dialCodeModel = ref('')

				return {
					args,
					phoneValue1,
					phoneValue2,
					dialCodeModel,
				}
			},
			template: `
				<div class="pa-4">
					<div class="mb-6">
						<h4 class="mb-2">Avec aide à la saisie</h4>
						<PhoneField
							v-model="phoneValue1"
							required
							help-text="Saisissez votre numéro de téléphone au format 01 23 45 67 89"
							label="Numéro de téléphone"
						/>
						<p class="text-caption mt-2">
							Essayez de laisser le champ vide ou de saisir un numéro incorrect pour voir 
							l'exemple dans le message d'erreur (différent de l'aide).
						</p>
					</div>

					<div class="mb-6">
						<h4 class="mb-2">Avec aide à la saisie et indicatif pays</h4>
						<PhoneField
							v-model="phoneValue2"
							v-model:selected-dial-code="dialCodeModel"
							required
							with-country-code
							help-text="Choisissez votre pays et saisissez votre numéro de téléphone"
							label="Numéro de téléphone international"
						/>
						<p class="text-caption mt-2">
							L'exemple dans le message d'erreur s'adapte au format du pays sélectionné.
						</p>
					</div>

					<div class="mt-4">
						<h4>Valeurs actuelles :</h4>
						<pre class="text-caption">phoneValue1: {{ phoneValue1 }}</pre>
						<pre class="text-caption">phoneValue2: {{ phoneValue2 }}</pre>
						<pre class="text-caption">dialCodeModel: {{ dialCodeModel }}</pre>
					</div>
				</div>
			`,
		}
	},
}

export const Autocomplete: Story = {
	parameters: {
		a11y: {
			disable: false,
		},
		docs: {
			description: {
				story: `
Les attributs \`autocomplete\` permettent aux navigateurs et aux outils d'assistance de remplir automatiquement les champs avec les bonnes informations utilisateur, conformément à [WCAG 1.3.5 — Identifier la finalité de la saisie](https://www.w3.org/WAI/WCAG21/quickref/#identify-input-purpose).

| Scénario | Prop à utiliser | Valeur recommandée | Source |
|---|---|---|---|
| **Code pays** (ex : +33) — champ séparé | \`autocompleteCountryCode\` | \`tel-country-code\` | [WHATWG](https://html.spec.whatwg.org/#autofill-field-tel-country-code) |
| **Numéro sans indicatif** (ex : 06 12 34 56 78) — avec \`withCountryCode\` | \`autocompletePhone\` | \`tel-national\` | [WHATWG](https://html.spec.whatwg.org/#autofill-field-tel-national) |
| **Numéro complet** (indicatif intégré) — sans \`withCountryCode\` | \`autocompletePhone\` | \`tel\` | [WHATWG](https://html.spec.whatwg.org/#autofill-field-tel) |
| **Extension / poste** | \`autocompletePhone\` | \`tel-extension\` | [WHATWG](https://html.spec.whatwg.org/#autofill-field-tel-extension) |
				`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div class="pa-4">
		<p class="mb-4">
			Les attributs <code>autocomplete</code> permettent aux navigateurs de remplir automatiquement 
			les champs avec les bonnes informations utilisateur.
		</p>
		
		<div class="mb-6">
			<h4 class="mb-2">Avec indicatif pays (autocomplete="tel-country-code")</h4>
			<PhoneField
				v-model="phoneValue1"
				v-model:selected-dial-code="dialCodeModel1"
				required
				with-country-code
				autocomplete-country-code="tel-country-code"
				autocomplete-phone="tel-national"
				help-text="L'indicatif utilise tel-country-code, le numéro utilise tel-national"
				label="Numéro de téléphone avec indicatif"
			/>
		</div>

		<div class="mb-6">
			<h4 class="mb-2">Numéro complet (autocomplete="tel")</h4>
			<PhoneField
				v-model="phoneValue2"
				required
				autocomplete-phone="tel"
				help-text="Pour un numéro complet avec indicatif intégré"
				label="Numéro de téléphone complet"
			/>
		</div>

		<div class="mb-6">
			<h4 class="mb-2">Extension téléphonique (autocomplete="tel-extension")</h4>
			<PhoneField
				v-model="phoneValue3"
				required
				autocomplete-phone="tel-extension"
				help-text="Pour les extensions ou postes téléphoniques"
				label="Extension téléphonique"
			/>
		</div>

		<div class="mt-4">
			<h4>Valeurs actuelles :</h4>
			<pre class="text-caption">phoneValue1: {{ phoneValue1 }}</pre>
			<pre class="text-caption">dialCodeModel1: {{ dialCodeModel1 }}</pre>
			<pre class="text-caption">phoneValue2: {{ phoneValue2 }}</pre>
			<pre class="text-caption">phoneValue3: {{ phoneValue3 }}</pre>
		</div>
	</div>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import PhoneField from './PhoneField.vue'

const phoneValue1 = ref('')
const dialCodeModel1 = ref('')
const phoneValue2 = ref('')
const phoneValue3 = ref('')
</script>`,
			},
		],
	},
	args: {
		required: false,
		withCountryCode: true,
		autocompleteCountryCode: 'tel-country-code',
		autocompletePhone: 'tel-national',
		helpText: 'Utilisez les valeurs autocomplete appropriées pour l\'accessibilité',
	},
	render(args) {
		return {
			components: { PhoneField },
			setup() {
				const phoneValue1 = ref('')
				const dialCodeModel1 = ref('')
				const phoneValue2 = ref('')
				const phoneValue3 = ref('')

				return {
					args,
					phoneValue1,
					dialCodeModel1,
					phoneValue2,
					phoneValue3,
				}
			},
			template: `
				<div class="pa-4">
					<p class="mb-4">
						Les attributs <code>autocomplete</code> permettent aux navigateurs de remplir automatiquement 
						les champs avec les bonnes informations utilisateur.
					</p>
					
					<div class="mb-6">
						<h4 class="mb-2">Avec indicatif pays (autocomplete="tel-country-code")</h4>
						<PhoneField
							v-model="phoneValue1"
							v-model:selected-dial-code="dialCodeModel1"
							required
							with-country-code
							autocomplete-country-code="tel-country-code"
							autocomplete-phone="tel-national"
							help-text="L'indicatif utilise tel-country-code, le numéro utilise tel-national"
							label="Numéro de téléphone avec indicatif"
						/>
					</div>

					<div class="mb-6">
						<h4 class="mb-2">Numéro complet (autocomplete="tel")</h4>
						<PhoneField
							v-model="phoneValue2"
							required
							autocomplete-phone="tel"
							help-text="Pour un numéro complet avec indicatif intégré"
							label="Numéro de téléphone complet"
						/>
					</div>

					<div class="mb-6">
						<h4 class="mb-2">Extension téléphonique (autocomplete="tel-extension")</h4>
						<PhoneField
							v-model="phoneValue3"
							required
							autocomplete-phone="tel-extension"
							help-text="Pour les extensions ou postes téléphoniques"
							label="Extension téléphonique"
						/>
					</div>

					<div class="mt-4">
						<h4>Valeurs actuelles :</h4>
						<pre class="text-caption">phoneValue1: {{ phoneValue1 }}</pre>
						<pre class="text-caption">dialCodeModel1: {{ dialCodeModel1 }}</pre>
						<pre class="text-caption">phoneValue2: {{ phoneValue2 }}</pre>
						<pre class="text-caption">phoneValue3: {{ phoneValue3 }}</pre>
					</div>
				</div>
			`,
		}
	},
}

export const CustomIndicatifs: Story = {
	parameters: {
		a11y: {
			disable: false,
		},
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
						:isValidateOnBlur="isValidateOnBlur"
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
					const isValidateOnBlur = ref(true)
				</script>
				`,
			},
		],
	},
	args: {
		modelValue: '',
		required: false,
		outlined: true,
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
		bgColor: 'white',
		readonly: false,
		disabled: false,
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
     	v-bind="args"
    />
				</div>
   `,
		}
	},
}

export const NotValidatedOnBlur: Story = {
	parameters: {
		a11y: {
			disable: false,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<PhoneField
						v-bind="args"
						:required="required"
						:withCountryCode="withCountryCode"
						:countryCodeRequired="countryCodeRequired"
						:displayFormat="displayFormat"
						:customIndicatifs="customIndicatifs"
						:useCustomIndicatifsOnly="useCustomIndicatifsOnly"
						:isValidateOnBlur="isValidateOnBlur"
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
					const isValidateOnBlur = ref(false)
				</script>
				`,
			},
		],
	},
	args: {
		modelValue: '',
		required: false,
		outlined: true,
		withCountryCode: true,
		countryCodeRequired: false,
		displayFormat: 'code',
		customIndicatifs: [],
		useCustomIndicatifsOnly: false,
		isValidateOnBlur: false,
		readonly: false,
		disabled: false,
		bgColor: 'white',
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
     v-bind="args"
    />
				</div>
   `,
		}
	},
}

export const DisplayFormatCode: Story = {
	parameters: {
		a11y: {
			disable: false,
		},
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
						:isValidateOnBlur="isValidateOnBlur"
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
					const isValidateOnBlur = ref(true)
				</script>
				`,
			},
		],
	},
	args: {
		modelValue: '',
		required: false,
		outlined: true,
		withCountryCode: true,
		countryCodeRequired: false,
		displayFormat: 'code',
		customIndicatifs: [],
		useCustomIndicatifsOnly: false,
		isValidateOnBlur: true,
		readonly: false,
		disabled: false,
		bgColor: 'white',
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
     v-bind="args"
    />
				</div>
   `,
		}
	},
}

export const DisplayFormatCodeAbbreviation: Story = {
	parameters: {
		a11y: {
			disable: false,
		},
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
						:isValidateOnBlur="isValidateOnBlur"
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
					const isValidateOnBlur = ref(true)
				</script>
				`,
			},
		],
	},
	args: {
		modelValue: '',
		required: false,
		outlined: true,
		withCountryCode: true,
		countryCodeRequired: false,
		displayFormat: 'code-abbreviation',
		customIndicatifs: [],
		useCustomIndicatifsOnly: false,
		isValidateOnBlur: true,
		readonly: false,
		disabled: false,
		bgColor: 'white',
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
     v-bind="args"
    />
				</div>
   `,
		}
	},
}

export const DisplayFormatCodeCountry: Story = {
	parameters: {
		a11y: {
			disable: false,
		},
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
						:isValidateOnBlur="isValidateOnBlur"
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
					const isValidateOnBlur = ref(true)
				</script>
				`,
			},
		],
	},
	args: {
		modelValue: '',
		required: false,
		outlined: true,
		withCountryCode: true,
		countryCodeRequired: false,
		displayFormat: 'code-country',
		customIndicatifs: [],
		useCustomIndicatifsOnly: false,
		isValidateOnBlur: true,
		readonly: false,
		disabled: false,
		bgColor: 'white',
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
     v-bind="args"
    />
				</div>
   `,
		}
	},
}

export const DisplayFormatCountry: Story = {
	parameters: {
		a11y: {
			disable: false,
		},
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
						:isValidateOnBlur="isValidateOnBlur"
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
					const isValidateOnBlur = ref(true)
				</script>
				`,
			},
		],
	},
	args: {
		modelValue: '',
		required: false,
		outlined: true,
		withCountryCode: true,
		countryCodeRequired: false,
		displayFormat: 'country',
		customIndicatifs: [],
		useCustomIndicatifsOnly: false,
		isValidateOnBlur: true,
		readonly: false,
		disabled: false,
		bgColor: 'white',
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
     v-bind="args"
    />
				</div>
   `,
		}
	},
}

export const DisplayFormatAbbreviation: Story = {
	parameters: {
		a11y: {
			disable: false,
		},
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
						:isValidateOnBlur="isValidateOnBlur"
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
					const isValidateOnBlur = ref(true)
				</script>
				`,
			},
		],
	},
	args: {
		modelValue: '',
		required: false,
		outlined: true,
		withCountryCode: true,
		countryCodeRequired: false,
		displayFormat: 'abbreviation',
		customIndicatifs: [],
		useCustomIndicatifsOnly: false,
		isValidateOnBlur: true,
		readonly: false,
		disabled: false,
		bgColor: 'white',
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
     v-bind="args"
    />
							</div>
   `,
		}
	},
}

export const DefaultDialCode: Story = {
	parameters: {
		a11y: {
			disable: false,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<PhoneField
						v-model="modelValue"
						:dial-code-model="dialCodeModel"
						:required="required"
						:withCountryCode="withCountryCode"
						:countryCodeRequired="countryCodeRequired"
						:displayFormat="displayFormat"
						:customIndicatifs="customIndicatifs"
						:useCustomIndicatifsOnly="useCustomIndicatifsOnly"
						:isValidateOnBlur="isValidateOnBlur"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { PhoneField } from '@cnamts/synapse'
					
					const modelValue = ref('')
					
					// Indicatifs personnalisés
					const customIndicatifs = [
						{ code: '+3433', country: 'Exemple', abbreviation: 'EX', phoneLength: 10, mask: '## ## ## ## ##' },
						{ code: '+34', country: 'Espagne', abbreviation: 'ES', phoneLength: 9, mask: '### ### ###' },
						{ code: '+41', country: 'Suisse', abbreviation: 'CH', phoneLength: 9, mask: '### ### ###' },
					]
					
					// Pré-sélection de l'indicatif Exemple
					const dialCodeModel = ref(customIndicatifs.find(ind => ind.country === 'Exemple'))
					
					const required = ref(true)
					const withCountryCode = ref(true)
					const countryCodeRequired = ref(true)
					const displayFormat = ref('code-country')
					const useCustomIndicatifsOnly = ref(true)
					const isValidateOnBlur = ref(true)
				</script>
				`,
			},
		],
	},
	args: {
		modelValue: '',
		dialCodeModel: { code: '+3433', country: 'Exemple', abbreviation: 'EX', phoneLength: 10, mask: '## ## ## ## ##' },
		required: false,
		outlined: true,
		withCountryCode: true,
		countryCodeRequired: true,
		displayFormat: 'code-country',
		customIndicatifs: [
			{ code: '+3433', country: 'Exemple', abbreviation: 'EX', phoneLength: 10, mask: '## ## ## ## ##' },
			{ code: '+34', country: 'Espagne', abbreviation: 'ES', phoneLength: 9, mask: '### ### ###' },
			{ code: '+41', country: 'Suisse', abbreviation: 'CH', phoneLength: 9, mask: '### ### ###' },
		],
		useCustomIndicatifsOnly: true,
		isValidateOnBlur: true,
		bgColor: 'white',
		readonly: false,
		disabled: false,
	},
	render: (args) => {
		return {
			components: { PhoneField },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
					<h3>PhoneField avec indicatif pré-rempli</h3>
					<p>Cette story montre comment pré-remplir l'indicatif téléphonique avec des indicatifs personnalisés.</p>
					<PhoneField
						v-bind="args"
					/>
				</div>
			`,
		}
	},
}

export const DefaultDialCodeStandard: Story = {
	parameters: {
		a11y: {
			disable: false,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<PhoneField
						v-model="phone"
						:dial-code-model="dialCodeModel"
						:with-country-code="true"
						:country-code-required="true"
						display-format="code-country"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { PhoneField, indicatifs } from '@cnamts/synapse'
					
					// Modèle pour le numéro de téléphone
					const phone = ref('')
					
					// Recherche de l'indicatif France dans les indicatifs standards
					const franceIndicatif = indicatifs.find(ind => ind.country === 'France')
					
					// Pré-remplissage avec l'indicatif France
					const dialCodeModel = ref(franceIndicatif)
				</script>
				`,
			},
		],
	},
	args: {
		modelValue: '',
		dialCodeModel: indicatifs.find(ind => ind.country === 'France'),
		required: false,
		outlined: true,
		withCountryCode: true,
		countryCodeRequired: true,
		displayFormat: 'code-country',
		customIndicatifs: [],
		useCustomIndicatifsOnly: false,
		isValidateOnBlur: true,
		bgColor: 'white',
		readonly: false,
		disabled: false,
	},
	render: (args) => {
		return {
			components: { PhoneField },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
					<h3>PhoneField avec indicatif standard pré-rempli</h3>
					<p>Cette story montre comment pré-remplir l'indicatif téléphonique avec les indicatifs standards.</p>
					<div class="mb-4">
						<strong>Indicatif sélectionné :</strong> {{ args.dialCodeModel ? args.dialCodeModel.code + ' ' + args.dialCodeModel.country : 'Aucun' }}
					</div>
					<PhoneField
						v-bind="args"
					/>
				</div>
			`,
		}
	},
}

export const DisplayModels: Story = {
	parameters: {
		a11y: {
			disable: false,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
        <template>
        	<span>
				Indicatif: {{ dialCodeModel }}<br/>Numéro: {{ modelValue }}
			</span>
          <PhoneField
            v-model="modelValue"
            v-model:dialCodeModel="dialCodeModel"
            :required="required"
            :withCountryCode="withCountryCode"
            :countryCodeRequired="countryCodeRequired"
            :displayFormat="displayFormat"
            :customIndicatifs="customIndicatifs"
            :useCustomIndicatifsOnly="useCustomIndicatifsOnly"
            :isValidateOnBlur="isValidateOnBlur"
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
          const dialCodeModel = ref('')
          const required = ref(true)
          const withCountryCode = ref(true)
          const countryCodeRequired = ref(true)
          const displayFormat = ref('code-country')
          const customIndicatifs = ref([])
          const useCustomIndicatifsOnly = ref(false)
          const isValidateOnBlur = ref(true)
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
		withCountryCode: true,
		countryCodeRequired: false,
		displayFormat: 'code-country',
		customIndicatifs: [],
		useCustomIndicatifsOnly: false,
		isValidateOnBlur: true,
		readonly: false,
		bgColor: 'white',
	},
	render: args => ({
		components: { PhoneField },
		setup() {
			const modelValue = ref(args.modelValue)
			const dialCodeModel = ref(args.dialCodeModel)

			// Sync ref -> args (pour afficher les modèles dans la story)
			watch(modelValue, (val) => {
				args.modelValue = val
			})
			watch(dialCodeModel, (val) => {
				args.dialCodeModel = val
			})
			// Sync args -> ref (quand on change les controls Storybook)
			watch(() => args.modelValue, (val) => {
				modelValue.value = val
			})
			watch(() => args.dialCodeModel, (val) => {
				dialCodeModel.value = val
			})

			return {
				args,
				modelValue,
				dialCodeModel,
			}
		},
		template: `
    <div class="pa-4">
      <div class="pa-4">
        Indicatif: {{ dialCodeModel }}<br/>Numéro: {{ modelValue }}
      </div>

      <PhoneField
        v-bind="args"
        v-model="modelValue"
        v-model:dialCodeModel="dialCodeModel"
      />
    </div>
  `,
	}),
}

/**
 * Story qui montre le comportement du composant lorsque la gestion des erreurs est désactivée.
 * Aucun message d'erreur ne sera affiché, même si le champ est requis et vide.
 */
export const DisabledErrorHandling: Story = {
	parameters: {
		a11y: {
			disable: false,
		},
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
						:isValidateOnBlur="isValidateOnBlur"
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
					const isValidateOnBlur = ref(true)
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
		withCountryCode: true,
		countryCodeRequired: true,
		displayFormat: 'code',
		customIndicatifs: [],
		useCustomIndicatifsOnly: false,
		isValidateOnBlur: true,
		disableErrorHandling: true,
		readonly: false,
		disabled: false,
		bgColor: 'white',
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
						v-bind="args"
					/>
					<div class="mt-6">
						<h3>Comparaison avec gestion des erreurs activée</h3>
						<p>Ce champ est requis et affichera une erreur s'il est vide.</p>
						<PhoneField
							v-bind="args"
							:disable-error-handling="false"
						/>
					</div>
				</div>
			`,
		}
	},
}

export const FormValidation: Story = {
	parameters: {
		a11y: {
			disable: false,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<form @submit.prevent="submitForm" class="d-flex flex-column">
						<PhoneField
							ref="phoneFieldRef"
							v-model="phoneNumber"
							:required="true"
							:outlined="true"
							:outlinedIndicatif="true"
							:withCountryCode="true"
							:country-code-required="true"
							:isValidateOnBlur="true"
							:readonly="readonly"
							:disabled="disabled"
						/>
						<v-btn type="submit" color="primary" class="mt-4" style="width: 200px;">Soumettre le formulaire</v-btn>
						<div v-if="formSubmitted" class="mt-4 pa-2" :class="{ 'bg-success': formIsValid, 'bg-error': !formIsValid }" style="width: fit-content;">
							<p v-if="formIsValid" class="text-white">Formulaire valide !</p>
							<p v-else class="text-white">Formulaire invalide !</p>
						</div>
					</form>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { PhoneField } from '@cnamts/synapse'
					
					const phoneFieldRef = ref(null)
					const phoneNumber = ref('')
					const formSubmitted = ref(false)
					const formIsValid = ref(false)
					const readonly = ref(false)
					const disabled = ref(false)
					
					const submitForm = async () => {
						formSubmitted.value = true
						// Validation du champ téléphone
						let isValid = false
						if (phoneFieldRef.value) {
							// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Nécessaire pour accéder à validateOnSubmit
							isValid = await (phoneFieldRef.value as any).validateOnSubmit()
						}
						
						formIsValid.value = isValid
						
						console.log(isValid ? 'Formulaire valide !' : 'Formulaire invalide !')
					}
				</script>
				`,
			},
		],
	},
	args: {
		modelValue: '',
		required: true,
		outlined: true,
		withCountryCode: true,
		countryCodeRequired: true,
		displayFormat: 'code',
		customIndicatifs: [],
		useCustomIndicatifsOnly: false,
		isValidateOnBlur: true,
		bgColor: 'white',
		readonly: false,
		disabled: false,
	},
	render: (args) => {
		return {
			components: { PhoneField },
			setup() {
				const phoneFieldRef = ref(null)
				const phoneNumber = ref('')
				const formSubmitted = ref(false)
				const formIsValid = ref(false)

				const submitForm = async () => {
					formSubmitted.value = true
					// Validation du champ téléphone
					let isValid = false
					if (phoneFieldRef.value) {
						// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Nécessaire pour accéder à validateOnSubmit
						isValid = await (phoneFieldRef.value as any).validateOnSubmit()
					}

					formIsValid.value = isValid

					console.log(isValid ? 'Formulaire valide !' : 'Formulaire invalide !')
				}

				return { phoneFieldRef, phoneNumber, formSubmitted, formIsValid, submitForm, args }
			},
			template: `
				<div class="pa-4">
					<form @submit.prevent="submitForm" class="d-flex flex-column">
						<PhoneField
							ref="phoneFieldRef"
							v-bind="args"
						/>
						<v-btn type="submit" color="primary" class="mt-4" style="width: 200px;">Soumettre le formulaire</v-btn>
						<div v-if="formSubmitted" class="mt-4 pa-2" :class="{ 'bg-success': formIsValid, 'bg-error': !formIsValid }" style="width: fit-content;">
							<p v-if="formIsValid" class="text-white">Formulaire valide !</p>
							<p v-else class="text-white">Formulaire invalide !</p>
						</div>
					</form>
					<div class="mt-8">
						<h3>Comment utiliser la validation à la soumission</h3>
						<p>1. Ajoutez une référence au composant PhoneField avec <code>ref="phoneFieldRef"</code></p>
						<p>2. Désactivez la validation au blur si nécessaire avec <code>:isValidateOnBlur="false"</code></p>
						<p>3. Dans votre méthode de soumission, appelez <code>phoneFieldRef.value.validateOnSubmit()</code></p>
						<p>4. Cette méthode retourne une Promise qui résout à <code>true</code> si le champ est valide, <code>false</code> sinon</p>
					</div>
				</div>
			`,
		}
	},
}
