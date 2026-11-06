import type { Meta, StoryObj } from '@storybook/vue3-vite'
import SyAutocomplete from '../SyAutocomplete.vue'
import SyForm from '../../../SyForm/SyForm.vue'
import { ref, onMounted, nextTick } from 'vue'
import { fn } from 'storybook/test'
import { VBtn, VForm } from 'vuetify/components'

const meta: Meta<typeof SyAutocomplete> = {
	title: 'Composants/Formulaires/Selects/SyAutocomplete/Validation',
	component: SyAutocomplete,
	parameters: {
		layout: 'fullscreen',
	},
	args: {
		'onUpdate:modelValue': fn(),
	},
} as Meta<typeof SyAutocomplete>

export default meta

type Story = StoryObj<typeof meta>

const items = [
	{ text: 'Option 1', value: '1' },
	{ text: 'Option 2', value: '2' },
	{ text: 'Option 3', value: '3' },
]
const requiredRule = (value: unknown): boolean | string => Boolean(value) || 'Ce champ est requis'

export const WithError: Story = {
	parameters: {
		docs: {
			description: {
				story: '« Option 1 » est présélectionnée et déclenche une erreur bloquante au chargement.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyAutocomplete
    ref="autocompleteRef"
    v-model="value"
    :items="items"
    :filter="false"
    label="Option"
    :custom-rules="customRules"
  />
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SyAutocomplete } from '@cnamts/synapse'

const value = ref('1')
const items = [
  { text: 'Option 1', value: '1' },
  { text: 'Option 2', value: '2' },
  { text: 'Option 3', value: '3' },
]
const customRules = [{
  type: 'custom',
  options: {
    validate: (value: unknown): boolean => value !== '1',
    message: 'Option 1 n\\'est pas autorisée, choisissez Option 2 ou 3.'
  }
}]

const autocompleteRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)

onMounted(() => {
  autocompleteRef.value?.validateOnSubmit()
})
</script>`,
			},
		],
	},
	argTypes: {
		customRules: {
			control: false,
			description: 'La règle fixe est nécessaire pour déclencher l’erreur illustrée au chargement.',
		},
	},
	args: {
		'items': items,
		'label': 'Option',
		'filter': false,
		'onUpdate:modelValue': fn(),
	},
	render: args => ({
		components: { SyAutocomplete },
		setup() {
			const value = ref('1')
			const autocompleteRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)
			const customRules = [{
				type: 'custom',
				options: {
					validate: (value: unknown): boolean => value !== '1',
					message: 'Option 1 n\'est pas autorisée, choisissez Option 2 ou 3.',
				},
			}]

			onMounted(() => {
				autocompleteRef.value?.validateOnSubmit()
			})

			return { args, value, autocompleteRef, customRules }
		},
		template: `
			<div class="pa-4">
				<SyAutocomplete
					ref="autocompleteRef"
					v-model="value"
					v-bind="args"
					:custom-rules="customRules"
				/>
			</div>
		`,
	}),
}

export const WithWarning: Story = {
	parameters: {
		docs: {
			description: {
				story: '« Option 1 » est présélectionnée et déclenche un avertissement (non bloquant) au chargement.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyAutocomplete
    ref="autocompleteRef"
    v-model="value"
    :items="items"
    :filter="false"
    label="Option"
    :custom-warning-rules="customWarningRules"
  />
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SyAutocomplete } from '@cnamts/synapse'

const value = ref('1')
const items = [
  { text: 'Option 1', value: '1' },
  { text: 'Option 2', value: '2' },
  { text: 'Option 3', value: '3' },
]
const customWarningRules = [{
  type: 'custom',
  options: {
    validate: (value: unknown): boolean => value !== '1',
    warningMessage: 'Option 1 est dépréciée, préférez Option 2 ou 3.'
  }
}]

const autocompleteRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)

onMounted(() => {
  autocompleteRef.value?.validateOnSubmit()
})
</script>`,
			},
		],
	},
	argTypes: {
		customWarningRules: {
			control: false,
			description: 'La règle fixe est nécessaire pour déclencher l’avertissement illustré au chargement.',
		},
	},
	args: {
		'items': items,
		'label': 'Option',
		'filter': false,
		'onUpdate:modelValue': fn(),
	},
	render: args => ({
		components: { SyAutocomplete },
		setup() {
			const value = ref('1')
			const autocompleteRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)
			const customWarningRules = [{
				type: 'custom',
				options: {
					validate: (value: unknown): boolean => value !== '1',
					warningMessage: 'Option 1 est dépréciée, préférez Option 2 ou 3.',
				},
			}]

			onMounted(() => {
				autocompleteRef.value?.validateOnSubmit()
			})

			return { args, value, autocompleteRef, customWarningRules }
		},
		template: `
			<div class="pa-4">
				<SyAutocomplete
					ref="autocompleteRef"
					v-model="value"
					v-bind="args"
					:custom-warning-rules="customWarningRules"
				/>
			</div>
		`,
	}),
}

export const WithSuccess: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Une option est présélectionnée et déclenche la confirmation de succès au chargement.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyAutocomplete
    ref="autocompleteRef"
    v-model="value"
    :items="items"
    :filter="false"
    label="Option"
    show-success-messages
    :custom-success-rules="customSuccessRules"
  />
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SyAutocomplete } from '@cnamts/synapse'

const value = ref('1')
const items = [
  { text: 'Option 1', value: '1' },
  { text: 'Option 2', value: '2' },
  { text: 'Option 3', value: '3' },
]
const customSuccessRules = [{
  type: 'custom',
  options: {
    validate: (value: unknown): boolean => value !== null && value !== undefined,
    successMessage: 'Option sélectionnée avec succès.'
  }
}]

const autocompleteRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)

onMounted(() => {
  autocompleteRef.value?.validateOnSubmit()
})
</script>`,
			},
		],
	},
	argTypes: {
		customSuccessRules: {
			control: false,
		},
	},
	args: {
		'items': items,
		'label': 'Option',
		'filter': false,
		'showSuccessMessages': true,
		'onUpdate:modelValue': fn(),
	},
	render: args => ({
		components: { SyAutocomplete },
		setup() {
			const value = ref('1')
			const autocompleteRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)
			const customSuccessRules = [{
				type: 'custom',
				options: {
					validate: (value: unknown): boolean => value !== null && value !== undefined,
					successMessage: 'Option sélectionnée avec succès.',
				},
			}]

			onMounted(() => {
				autocompleteRef.value?.validateOnSubmit()
			})

			return { args, value, autocompleteRef, customSuccessRules }
		},
		template: `
			<div class="pa-4">
				<SyAutocomplete
					ref="autocompleteRef"
					v-model="value"
					v-bind="args"
					:custom-success-rules="customSuccessRules"
				/>
			</div>
		`,
	}),
}

export const NoValidateOnBlur: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Par défaut, `isValidateOnBlur` vaut `false` sur SyAutocomplete : la validation se déclenche au changement de valeur. Sélectionnez « Option 1 » (invalide) dans chaque champ puis quittez-le : le champ configuré à `false` affiche l’erreur dès la sélection, tandis que celui configuré à `true` attend le blur. « Option 2 » est valide. Le bouton réinitialise les valeurs et efface les messages.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <div class="d-flex flex-column ga-4 pa-4">
    <SyAutocomplete
      ref="changeAutocompleteRef"
      v-model="changeValue"
      :items="items"
      :custom-rules="customRules"
      :custom-success-rules="customSuccessRules"
      label="Validation au changement (false)"
      :is-validate-on-blur="false"
      show-success-messages
    />
    <SyAutocomplete
      ref="blurAutocompleteRef"
      v-model="blurValue"
      :items="items"
      :custom-rules="customRules"
      :custom-success-rules="customSuccessRules"
      label="Validation au blur (true)"
      :is-validate-on-blur="true"
      show-success-messages
    />
    <VBtn class="align-self-start" @mousedown.prevent @click="resetComparisons">Réinitialiser</VBtn>
  </div>
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { SyAutocomplete } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'

type SyAutocompleteInstance = { clearValidation: () => void }

const changeValue = ref<string | null>(null)
const blurValue = ref<string | null>(null)
const changeAutocompleteRef = ref<SyAutocompleteInstance | null>(null)
const blurAutocompleteRef = ref<SyAutocompleteInstance | null>(null)
const items = [
  { text: 'Option 1', value: '1' },
  { text: 'Option 2', value: '2' },
  { text: 'Option 3', value: '3' },
]

const customRules = [{
  type: 'custom',
  options: {
    validate: (value: unknown): boolean => value !== '1',
    message: "Option 1 n'est pas autorisée."
  }
}]

const customSuccessRules = [{
  type: 'custom',
  options: {
    validate: (value: unknown): boolean => value !== null && value !== undefined,
    successMessage: 'Option sélectionnée avec succès.'
  }
}]

const resetComparisons = async () => {
  changeValue.value = null
  blurValue.value = null
  await nextTick()
  changeAutocompleteRef.value?.clearValidation()
  blurAutocompleteRef.value?.clearValidation()
}
</script>`,
			},
		],
	},
	argTypes: {
		modelValue: {
			control: false,
		},
		label: {
			control: false,
		},
		isValidateOnBlur: {
			control: false,
		},
		customRules: {
			control: false,
		},
		customSuccessRules: {
			control: false,
		},
	},
	args: {
		items,
		showSuccessMessages: true,
	},
	render: (args) => {
		return {
			components: { SyAutocomplete, VBtn },
			setup() {
				type SyAutocompleteInstance = { clearValidation: () => void }

				const changeValue = ref<string | null>(null)
				const blurValue = ref<string | null>(null)
				const changeAutocompleteRef = ref<SyAutocompleteInstance | null>(null)
				const blurAutocompleteRef = ref<SyAutocompleteInstance | null>(null)
				const customRules = [{
					type: 'custom',
					options: {
						validate: (value: unknown): boolean => value !== '1',
						message: 'Option 1 n\'est pas autorisée.',
					},
				}]
				const customSuccessRules = [{
					type: 'custom',
					options: {
						validate: (value: unknown): boolean => value !== null && value !== undefined,
						successMessage: 'Option sélectionnée avec succès.',
					},
				}]

				const resetComparisons = async () => {
					changeValue.value = null
					blurValue.value = null
					await nextTick()
					changeAutocompleteRef.value?.clearValidation()
					blurAutocompleteRef.value?.clearValidation()
				}

				return {
					args,
					changeValue,
					blurValue,
					changeAutocompleteRef,
					blurAutocompleteRef,
					customRules,
					customSuccessRules,
					resetComparisons,
				}
			},
			template: `
				<div class="d-flex flex-column ga-4 pa-4">
					<SyAutocomplete
						v-bind="args"
						ref="changeAutocompleteRef"
						v-model="changeValue"
						label="Validation au changement (false)"
						:is-validate-on-blur="false"
						:custom-rules="customRules"
						:custom-success-rules="customSuccessRules"
					/>
					<SyAutocomplete
						v-bind="args"
						ref="blurAutocompleteRef"
						v-model="blurValue"
						label="Validation au blur (true)"
						:is-validate-on-blur="true"
						:custom-rules="customRules"
						:custom-success-rules="customSuccessRules"
					/>
					<VBtn class="align-self-start" @mousedown.prevent @click="resetComparisons">Réinitialiser</VBtn>
				</div>
			`,
		}
	},
}

export const DisableErrorHandling: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<div class="d-flex flex-column ga-4">
		<SyAutocomplete
			v-model="value1"
			:items="items"
			label="Avec validation interne (défaut)"
			required
		/>

		<SyAutocomplete
			v-model="value2"
			:items="items"
			label="Validation interne désactivée"
			required
			disable-error-handling
		/>
	</div>
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { SyAutocomplete } from '@cnamts/synapse'

const items = [
	{ text: 'Option 1', value: '1' },
	{ text: 'Option 2', value: '2' },
	{ text: 'Option 3', value: '3' },
]

const value1 = ref<string | null>(null)
const value2 = ref<string | null>(null)
</script>`,
			},
		],
	},
	argTypes: {
		label: {
			control: false,
		},
		disableErrorHandling: {
			control: false,
		},
	},
	args: {
		items,
		required: true,
	},
	render: (args) => {
		return {
			components: { SyAutocomplete },
			setup() {
				const value1 = ref<string | null>(null)
				const value2 = ref<string | null>(null)
				return { args, value1, value2 }
			},
			template: `
				<div class="pa-4 d-flex flex-column" style="gap: 16px;">
					<SyAutocomplete
						v-model="value1"
						v-bind="args"
						label="Avec validation interne (défaut)"
					/>
					<SyAutocomplete
						v-model="value2"
						v-bind="args"
						label="Validation interne désactivée"
						disable-error-handling
					/>
				</div>
			`,
		}
	},
}

export const SyFormValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Le champ requis ne montre l\'erreur qu\'après interaction (blur/submit), pas au mount.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyForm @submit="onSubmit">
    <SyAutocomplete
      v-model="value"
      :items="items"
      label="Recherche obligatoire"
      required
      display-asterisk
      class="mb-4"
    />
    <VBtn type="submit" color="primary">Soumettre</VBtn>
  </SyForm>
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { SyAutocomplete, SyForm } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'

const value = ref('')
const items = [
  { text: 'Option 1', value: '1' },
  { text: 'Option 2', value: '2' },
  { text: 'Option 3', value: '3' }
]

const onSubmit = (event) => {
  if (event.isValid) {
    alert('Formulaire valide : ' + JSON.stringify(value.value))
  } else {
    alert('Formulaire invalide : veuillez choisir une option.')
  }
}
</script>`,
			},
		],
	},
	args: {
		items,
		label: 'Recherche obligatoire',
		required: true,
		displayAsterisk: true,
	},
	render: (args) => {
		return {
			components: { SyAutocomplete, SyForm, VBtn },
			setup() {
				const value = ref('')

				const onSubmit = (event: { isValid: boolean }) => {
					if (event.isValid) {
						alert(`Formulaire valide : ${JSON.stringify(value.value)}`)
					}
					else {
						alert('Formulaire invalide : veuillez choisir une option.')
					}
				}

				return { args, value, onSubmit }
			},
			template: `
				<div class="pa-4">
					<SyForm @submit="onSubmit">
						<SyAutocomplete
							v-model="value"
							v-bind="args"
							class="mb-4"
						/>
						<VBtn type="submit" color="primary">Soumettre</VBtn>
					</SyForm>
				</div>
			`,
		}
	},
}

export const VFormValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Intégration avec `VForm` natif Vuetify en conservant la validation Synapse. La soumission appelle `validateOnSubmit()` manuellement sur le champ pour déclencher la validation.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <VForm @submit.prevent="onSubmit">
    <SyAutocomplete
      ref="autocompleteRef"
      v-model="value"
      :items="items"
      label="Recherche obligatoire"
      required
      display-asterisk
      class="mb-4"
    />
    <VBtn type="submit" color="primary">Soumettre</VBtn>
  </VForm>
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { SyAutocomplete } from '@cnamts/synapse'
import { VBtn, VForm } from 'vuetify/components'

const value = ref('')
const autocompleteRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)
const items = [
  { text: 'Option 1', value: '1' },
  { text: 'Option 2', value: '2' },
  { text: 'Option 3', value: '3' },
]
const requiredRule = (value: unknown): boolean | string => Boolean(value) || 'Ce champ est requis'

async function onSubmit() {
  const isValid = await autocompleteRef.value?.validateOnSubmit()
  if (isValid) {
    alert('Formulaire valide : ' + JSON.stringify(value.value))
  } else {
    alert('Formulaire invalide : veuillez choisir une option.')
  }
}
</script>`,
			},
		],
	},
	args: {
		items,
		label: 'Recherche obligatoire',
		required: true,
		displayAsterisk: true,
	},
	render: (args) => {
		return {
			components: { SyAutocomplete, VBtn, VForm },
			setup() {
				const value = ref('')
				const autocompleteRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)

				async function onSubmit() {
					const isValid = await autocompleteRef.value?.validateOnSubmit()
					if (isValid) {
						alert(`Formulaire valide : ${JSON.stringify(value.value)}`)
					}
					else {
						alert('Formulaire invalide : veuillez choisir une option.')
					}
				}

				return { args, value, autocompleteRef, onSubmit }
			},
			template: `
				<div class="pa-4">
					<VForm @submit.prevent="onSubmit">
						<SyAutocomplete
							ref="autocompleteRef"
							v-model="value"
							v-bind="args"
							class="mb-4"
						/>
						<VBtn type="submit" color="primary">Soumettre</VBtn>
					</VForm>
				</div>
			`,
		}
	},
}

export const SyFormVuetifyValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Validation native Vuetify (`useVuetifyValidation`) intégrée dans `SyForm`. Les règles sont définies au format Vuetify : des fonctions retournant `true` ou un message d\'erreur. Soumettez le formulaire pour déclencher la validation.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyForm @submit="onSubmit">
    <SyAutocomplete
      v-model="value"
      :items="items"
      label="Option"
      use-vuetify-validation
      :show-success-messages="false"
      :rules="[requiredRule]"
    />
    <VBtn type="submit" color="primary" class="mt-4">
      Soumettre
    </VBtn>
  </SyForm>
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { SyAutocomplete, SyForm } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'

const value = ref<string | null>(null)
const items = [
  { text: 'Option 1', value: '1' },
  { text: 'Option 2', value: '2' },
  { text: 'Option 3', value: '3' },
]
const requiredRule = (value: unknown): boolean | string => Boolean(value) || 'Ce champ est requis'

function onSubmit(event: { isValid: boolean }) {
  if (event.isValid) {
    alert('Formulaire valide : ' + value.value)
  } else {
    alert('Formulaire invalide : veuillez choisir une option.')
  }
}
</script>`,
			},
		],
	},
	argTypes: {
		rules: {
			control: false,
		},
	},
	args: {
		'items': items,
		'label': 'Option',
		'useVuetifyValidation': true,
		'showSuccessMessages': false,
		'onUpdate:modelValue': fn(),
	},
	render: args => ({
		components: { SyAutocomplete, SyForm, VBtn },
		setup() {
			const value = ref<string | null>(null)

			function onSubmit(event: { isValid: boolean }) {
				if (event.isValid) {
					alert(`Formulaire valide : ${value.value}`)
				}
				else {
					alert('Formulaire invalide : veuillez choisir une option.')
				}
			}

			return { args, value, requiredRule, onSubmit }
		},
		template: `
			<div class="pa-4">
				<SyForm @submit="onSubmit">
					<SyAutocomplete
						v-model="value"
						v-bind="args"
						:rules="[requiredRule]"
					/>
					<VBtn
						type="submit"
						color="primary"
						class="mt-4"
					>
						Soumettre
					</VBtn>
				</SyForm>
			</div>
		`,
	}),
}

export const VFormAndVuetifyValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Validation native Vuetify (`useVuetifyValidation`) intégrée dans un `VForm` natif (sans SyForm). La soumission du formulaire déclenche la validation via `form.validate()`.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <VForm ref="formRef" @submit.prevent="onSubmit">
    <SyAutocomplete
      v-model="value"
      :items="items"
      label="Option"
      use-vuetify-validation
      :rules="[requiredRule]"
    />
    <VBtn type="submit" color="primary" class="mt-4">
      Soumettre
    </VBtn>
  </VForm>
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { SyAutocomplete } from '@cnamts/synapse'
import { VBtn, VForm } from 'vuetify/components'

const value = ref<string | null>(null)
const formRef = ref<InstanceType<typeof VForm> | null>(null)
const items = [
  { text: 'Option 1', value: '1' },
  { text: 'Option 2', value: '2' },
  { text: 'Option 3', value: '3' },
]
const requiredRule = (value: unknown): boolean | string => Boolean(value) || 'Ce champ est requis'

async function onSubmit() {
  const result = await formRef.value?.validate()
  if (result?.valid) {
    alert('Formulaire valide : ' + value.value)
  } else {
    alert('Formulaire invalide : veuillez choisir une option.')
  }
}
</script>`,
			},
		],
	},
	argTypes: {
		rules: {
			control: false,
		},
	},
	args: {
		'items': items,
		'label': 'Option',
		'useVuetifyValidation': true,
		'onUpdate:modelValue': fn(),
	},
	render: args => ({
		components: { SyAutocomplete, VBtn, VForm },
		setup() {
			const value = ref<string | null>(null)
			const formRef = ref<InstanceType<typeof VForm> | null>(null)

			async function onSubmit() {
				const result = await formRef.value?.validate()
				if (result?.valid) {
					alert(`Formulaire valide : ${value.value}`)
				}
				else {
					alert('Formulaire invalide : veuillez choisir une option.')
				}
			}

			return { args, value, formRef, requiredRule, onSubmit }
		},
		template: `
			<div class="pa-4">
				<VForm ref="formRef" @submit.prevent="onSubmit">
					<SyAutocomplete
						v-model="value"
						v-bind="args"
						:rules="[requiredRule]"
					/>
					<VBtn
						type="submit"
						color="primary"
						class="mt-4"
					>
						Soumettre
					</VBtn>
				</VForm>
			</div>
		`,
	}),
}
