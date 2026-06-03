import type { Meta, StoryObj } from '@storybook/vue3'
import NirField from '../NirField.vue'
import SyForm from '../../Customs/SyForm/SyForm.vue'
import { onMounted, ref } from 'vue'
import { fn } from '@storybook/test'
import { VBtn, VForm } from 'vuetify/components'

const meta: Meta<typeof NirField> = {
	title: 'Composants/Formulaires/NirField/Validation',
	component: NirField,
	parameters: {
		layout: 'fullscreen',
	},
	args: {
		'onUpdate:modelValue': fn(),
	},
} as Meta<typeof NirField>

export default meta

type Story = StoryObj<typeof meta>

const VALID_NIR = '184027512345674'
const INVALID_NIR = '199012345678'

export const WithError: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Un NIR invalide est présaisi et la validation est déclenchée au chargement.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <NirField
    ref="nirRef"
    v-model="value"
    label="Identifiant assuré"
    required
    show-success-messages
  />
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { NirField } from '@cnamts/synapse'

const value = ref('199012345678')
const nirRef = ref(null)

onMounted(() => {
  nirRef.value?.validateOnSubmit()
})
</script>`,
			},
		],
	},
	args: {
		label: 'Identifiant assuré',
		required: true,
		showSuccessMessages: true,
	},
	render: args => ({
		components: { NirField },
		setup() {
			const value = ref(INVALID_NIR)
			const nirRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)

			onMounted(() => {
				nirRef.value?.validateOnSubmit()
			})

			return { args, value, nirRef }
		},
		template: `
			<div class="pa-4">
				<NirField
					ref="nirRef"
					v-model="value"
					v-bind="args"
				/>
			</div>
		`,
	}),
}

export const WithWarning: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Un avertissement non bloquant s\'affiche si le NIR commence par 1 (homme). Le champ reste valide.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <NirField
    ref="nirRef"
    v-model="value"
    label="Identifiant assuré"
    :custom-number-warning-rules="[
      {
        type: 'custom',
        options: {
          validate: (v) => !v || !v.startsWith('1'),
          warningMessage: 'Attention : NIR masculin (commence par 1).'
        }
      }
    ]"
  />
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { NirField } from '@cnamts/synapse'

const value = ref('184027512345674')
const nirRef = ref(null)

onMounted(() => {
  nirRef.value?.validateOnSubmit()
})
</script>`,
			},
		],
	},
	args: {
		label: 'Identifiant assuré',
	},
	render: args => ({
		components: { NirField },
		setup() {
			const value = ref(VALID_NIR)
			const nirRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)

			onMounted(() => {
				nirRef.value?.validateOnSubmit()
			})

			return { args, value, nirRef }
		},
		template: `
			<div class="pa-4">
				<NirField
					ref="nirRef"
					v-model="value"
					v-bind="args"
					:custom-number-warning-rules="[
						{
							type: 'custom',
							options: {
								validate: (v) => !v || !v.startsWith('1'),
								warningMessage: 'Attention : NIR masculin (commence par 1).'
							}
						}
					]"
				/>
			</div>
		`,
	}),
}

export const WithSuccess: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Un NIR valide est présaisi et les messages de succès s\'affichent au chargement.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <NirField
    ref="nirRef"
    v-model="value"
    label="Identifiant assuré"
    required
    show-success-messages
  />
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { NirField } from '@cnamts/synapse'

const value = ref('184027512345674')
const nirRef = ref(null)

onMounted(() => {
  nirRef.value?.validateOnSubmit()
})
</script>`,
			},
		],
	},
	args: {
		label: 'Identifiant assuré',
		required: true,
		showSuccessMessages: true,
	},
	render: args => ({
		components: { NirField },
		setup() {
			const value = ref(VALID_NIR)
			const nirRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)

			onMounted(() => {
				nirRef.value?.validateOnSubmit()
			})

			return { args, value, nirRef }
		},
		template: `
			<div class="pa-4">
				<NirField
					ref="nirRef"
					v-model="value"
					v-bind="args"
				/>
			</div>
		`,
	}),
}

export const DisableErrorHandling: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <div class="d-flex flex-column gap-4">
    <NirField
      v-model="value1"
      label="Avec validation interne (défaut)"
      required
    />

    <NirField
      v-model="value2"
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
import { NirField } from '@cnamts/synapse'

const value1 = ref('')
const value2 = ref('')
</script>`,
			},
		],
	},
	render: () => ({
		components: { NirField },
		setup() {
			const value1 = ref('')
			const value2 = ref('')
			return { value1, value2 }
		},
		template: `
			<div class="pa-4 d-flex flex-column" style="gap: 16px;">
				<NirField
					v-model="value1"
					label="Avec validation interne (défaut)"
					required
				/>
				<NirField
					v-model="value2"
					label="Validation interne désactivée"
					required
					disable-error-handling
				/>
			</div>
		`,
	}),
}

export const CustomRules: Story = {
	args: {
		customRulesPrecedence: true,
		customNumberRules: [
			{
				type: 'custom',
				options: {
					validate: (value: string) => {
						if (!value) return true

						const valueWithoutSpaces = value.replace(/\s/g, '')

						if (valueWithoutSpaces.length !== 13) {
							return 'Le numéro de sécurité sociale doit contenir 13 caractères.'
						}

						if (!/^[12]/.test(valueWithoutSpaces)) {
							return 'Le premier chiffre doit être 1 (homme) ou 2 (femme).'
						}

						const anneeNaissance = valueWithoutSpaces.substring(1, 3)
						if (!/^[0-9]{2}$/.test(anneeNaissance)) {
							return 'Les chiffres 2 et 3 doivent représenter l\'année de naissance.'
						}

						const moisNaissance = valueWithoutSpaces.substring(3, 5)
						if (!/^(0[1-9]|1[0-2])$/.test(moisNaissance)) {
							return 'Les chiffres 4 et 5 doivent représenter un mois valide (01-12).'
						}

						const departement = valueWithoutSpaces.substring(5, 7)
						if (!((/^[0-9]{2}$/.test(departement) && departement !== '00')
							|| departement === '2A' || departement === '2B' || departement === '99')) {
							return 'Les chiffres 6 et 7 doivent représenter un département valide.'
						}

						const codeCommune = valueWithoutSpaces.substring(7, 10)
						if (!/^[0-9]{3}$/.test(codeCommune)) {
							return 'Les chiffres 8 à 10 doivent représenter un code commune ou pays valide.'
						}

						const numeroOrdre = valueWithoutSpaces.substring(10, 13)
						if (!/^[0-9]{3}$/.test(numeroOrdre)) {
							return 'Les chiffres 11 à 13 doivent représenter un numéro d\'ordre valide.'
						}

						return true
					},
					message: 'Le numéro de sécurité sociale est invalide.',
					successMessage: 'Le numéro de sécurité sociale est valide.',
					fieldIdentifier: 'Numéro de sécurité sociale',
				},
			},
		],
	},
	parameters: {
		docs: {
			description: {
				story: 'Règle personnalisée avec prévalence (`customRulesPrecedence: true`) qui valide le format du NIR selon les règles officielles françaises : sexe, année, mois, département, commune, numéro d\'ordre.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <NirField
    v-model="value"
    label="Identifiant assuré"
    :custom-rules-precedence="true"
    :custom-number-rules="[
      {
        type: 'custom',
        options: {
          validate: (value) => {
            if (!value) return true
            const v = value.replace(/\\s/g, '')
            if (v.length !== 13) return 'Doit contenir 13 caractères.'
            if (!/^[12]/.test(v)) return 'Le 1er chiffre doit être 1 ou 2.'
            const mois = v.substring(3, 5)
            if (!/^(0[1-9]|1[0-2])$/.test(mois)) return 'Mois invalide (01-12).'
            return true
          },
          message: 'Le numéro de sécurité sociale est invalide.',
          successMessage: 'Le numéro de sécurité sociale est valide.',
        }
      }
    ]"
  />
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { NirField } from '@cnamts/synapse'

const value = ref('')
</script>`,
			},
		],
	},
	render: args => ({
		components: { NirField },
		setup() {
			const value = ref('')
			return { args, value }
		},
		template: `
			<div class="pa-4">
				<NirField
					v-model="value"
					v-bind="args"
					label="Identifiant assuré"
				/>
				<div class="mt-4 text-body-2">Valeur actuelle : {{ value }}</div>
			</div>
		`,
	}),
}

export const NoValidateOnBlur: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Avec `isValidateOnBlur: false`, la validation se déclenche à chaque modification plutôt qu\'au seul moment du blur. Les boutons permettent de simuler une valeur programmatique avec validation immédiate.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <div class="d-flex flex-column gap-4 pa-4">
    <NirField
      ref="nirRef"
      :model-value="value"
      label="Identifiant assuré"
      required
      :is-validate-on-blur="false"
      :show-success-messages="true"
      @update:model-value="handleChange"
    />
    <div class="d-flex gap-4 mt-2">
      <VBtn color="primary" @mousedown.prevent @click="applyValue('199012345678')">Valeur invalide</VBtn>
      <VBtn color="primary" @mousedown.prevent @click="applyValue('184027512345674')">Valeur valide</VBtn>
      <VBtn @mousedown.prevent @click="applyValue(null)">Réinitialiser</VBtn>
    </div>
  </div>
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { NirField } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'

const value = ref<string | null>(null)
const nirRef = ref(null)

const handleChange = (newValue: string | null) => {
  value.value = newValue
}

const applyValue = async (newValue: string | null) => {
  value.value = newValue
  await nirRef.value?.validateOnSubmit()
}
</script>`,
			},
		],
	},
	args: {
		label: 'Identifiant assuré',
		isValidateOnBlur: false,
		showSuccessMessages: true,
		required: true,
	},
	render: args => ({
		components: { NirField, VBtn },
		setup() {
			const value = ref<string | null>(null)
			const nirRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)

			const handleChange = (newValue: string | null) => {
				value.value = newValue
			}

			const applyValue = async (newValue: string | null) => {
				value.value = newValue
				await nirRef.value?.validateOnSubmit()
			}

			return { args, value, nirRef, handleChange, applyValue, VALID_NIR, INVALID_NIR }
		},
		template: `
			<div class="d-flex flex-column gap-4 pa-4">
				<NirField
					ref="nirRef"
					:model-value="value"
					v-bind="args"
					@update:model-value="handleChange"
				/>
				<div class="d-flex gap-4 mt-2">
					<VBtn color="primary" class="mr-1" @mousedown.prevent @click="applyValue(INVALID_NIR)">Valeur invalide</VBtn>
					<VBtn color="primary" class="mr-1" @mousedown.prevent @click="applyValue(VALID_NIR)">Valeur valide</VBtn>
					<VBtn @mousedown.prevent @click="applyValue(null)">Réinitialiser</VBtn>
				</div>
			</div>
		`,
	}),
}

export const SyFormValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Le NirField s\'intègre automatiquement dans un SyForm via `useValidatable`. La soumission du formulaire déclenche la validation sans configuration supplémentaire.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyForm @submit="onSubmit">
    <NirField
      v-model="value"
      label="Identifiant assuré"
      required
      display-asterisk
      show-success-messages
      class="mb-4"
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
import { NirField, SyForm } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'

const value = ref('')

const onSubmit = (event) => {
  if (event.isValid) {
    alert('Formulaire valide : ' + value.value)
  } else {
    alert('Formulaire invalide.')
  }
}
</script>`,
			},
		],
	},
	args: {
		label: 'Identifiant assuré',
		required: true,
		displayAsterisk: true,
		showSuccessMessages: true,
	},
	render: args => ({
		components: { NirField, SyForm, VBtn },
		setup() {
			const value = ref('')

			const onSubmit = (event: { isValid: boolean }) => {
				if (event.isValid) {
					alert(`Formulaire valide : ${value.value}`)
				}
				else {
					alert('Formulaire invalide.')
				}
			}

			return { args, value, onSubmit }
		},
		template: `
			<div class="pa-4">
				<SyForm @submit="onSubmit">
					<NirField
						v-model="value"
						v-bind="args"
						class="mb-4"
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

export const VFormValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Intégration avec `VForm` natif Vuetify. La soumission appelle `validateOnSubmit()` manuellement sur le champ pour déclencher la validation Synapse.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <VForm @submit.prevent="onSubmit">
    <NirField
      ref="nirRef"
      v-model="value"
      label="Identifiant assuré"
      required
      display-asterisk
      show-success-messages
      class="mb-4"
    />
    <VBtn type="submit" color="primary" class="mt-4">Soumettre</VBtn>
  </VForm>
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { NirField } from '@cnamts/synapse'
import { VBtn, VForm } from 'vuetify/components'

const value = ref('')
const nirRef = ref(null)

async function onSubmit() {
  const isValid = await nirRef.value?.validateOnSubmit()
  if (isValid) {
    alert('Formulaire valide : ' + value.value)
  } else {
    alert('Formulaire invalide.')
  }
}
</script>`,
			},
		],
	},
	args: {
		label: 'Identifiant assuré',
		required: true,
		displayAsterisk: true,
		showSuccessMessages: true,
	},
	render: args => ({
		components: { NirField, VBtn, VForm },
		setup() {
			const value = ref('')
			const nirRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)

			async function onSubmit() {
				const isValid = await nirRef.value?.validateOnSubmit()
				if (isValid) {
					alert(`Formulaire valide : ${value.value}`)
				}
				else {
					alert('Formulaire invalide.')
				}
			}

			return { args, value, nirRef, onSubmit }
		},
		template: `
			<div class="pa-4">
				<VForm @submit.prevent="onSubmit">
					<NirField
						ref="nirRef"
						v-model="value"
						v-bind="args"
						class="mb-4"
					/>
					<VBtn type="submit" color="primary" class="mt-4">Soumettre</VBtn>
				</VForm>
			</div>
		`,
	}),
}

export const SyFormVuetifyValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Validation native Vuetify via `useVuetifyValidation`. Les règles sont au format Vuetify (fonctions retournant `true` ou un message d\'erreur), passées via `numberRules`/`keyRules`. Soumettez le formulaire pour déclencher la validation.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyForm @submit="onSubmit">
    <NirField
      v-model="value"
      label="Identifiant assuré"
      use-vuetify-validation
      :number-rules="[v => !!v || 'Le numéro est requis']"
      class="mb-4"
    />
    <VBtn type="submit" color="primary" class="mt-4">Soumettre</VBtn>
  </SyForm>
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { NirField, SyForm } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'

const value = ref('')

const onSubmit = (event) => {
  if (event.isValid) {
    alert('Formulaire valide : ' + value.value)
  } else {
    alert('Formulaire invalide.')
  }
}
</script>`,
			},
		],
	},
	args: {
		label: 'Identifiant assuré',
		useVuetifyValidation: true,
	},
	render: args => ({
		components: { NirField, SyForm, VBtn },
		setup() {
			const value = ref('')

			const onSubmit = (event: { isValid: boolean }) => {
				if (event.isValid) {
					alert(`Formulaire valide : ${value.value}`)
				}
				else {
					alert('Formulaire invalide.')
				}
			}

			return { args, value, onSubmit }
		},
		template: `
			<div class="pa-4">
				<SyForm @submit="onSubmit">
					<NirField
						v-model="value"
						v-bind="args"
						:number-rules="[v => !!v || 'Le numéro est requis']"
						class="mb-4"
					/>
					<VBtn type="submit" color="primary" class="mt-4">Soumettre</VBtn>
				</SyForm>
			</div>
		`,
	}),
}

export const VFormAndVuetifyValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Validation native Vuetify (`useVuetifyValidation`) intégrée dans un `VForm` natif (sans SyForm). La soumission déclenche la validation via `form.validate()`.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <VForm ref="formRef" @submit.prevent="onSubmit">
    <NirField
      v-model="value"
      label="Identifiant assuré"
      use-vuetify-validation
      :number-rules="[v => !!v || 'Le numéro est requis']"
      class="mb-4"
    />
    <VBtn type="submit" color="primary" class="mt-4">Soumettre</VBtn>
  </VForm>
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { NirField } from '@cnamts/synapse'
import { VBtn, VForm } from 'vuetify/components'

const value = ref('')
const formRef = ref(null)

async function onSubmit() {
  const result = await formRef.value?.validate()
  if (result?.valid) {
    alert('Formulaire valide : ' + value.value)
  }
}
</script>`,
			},
		],
	},
	args: {
		label: 'Identifiant assuré',
		useVuetifyValidation: true,
	},
	render: args => ({
		components: { NirField, VBtn, VForm },
		setup() {
			const value = ref('')
			const formRef = ref<InstanceType<typeof VForm> | null>(null)

			async function onSubmit() {
				const result = await formRef.value?.validate()
				if (result?.valid) {
					alert(`Formulaire valide : ${value.value}`)
				}
			}

			return { args, value, formRef, onSubmit }
		},
		template: `
			<div class="pa-4">
				<VForm ref="formRef" @submit.prevent="onSubmit">
					<NirField
						v-model="value"
						v-bind="args"
						:number-rules="[v => !!v || 'Le numéro est requis']"
						class="mb-4"
					/>
					<VBtn type="submit" color="primary" class="mt-4">Soumettre</VBtn>
				</VForm>
			</div>
		`,
	}),
}
