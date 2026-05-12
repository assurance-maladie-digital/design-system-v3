import type { Meta, StoryObj } from '@storybook/vue3'
import SyAutocomplete from '../SyAutocomplete.vue'
import SyForm from '../../../SyForm/SyForm.vue'
import { ref, onMounted } from 'vue'
import { fn } from '@storybook/test'
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
    label="Option"
    :customRules="[
      {
        type: 'custom',
        options: {
          validate: (v) => v !== '1',
          message: 'Option 1 n\\'est pas autorisée, choisissez Option 2 ou 3.'
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
import { SyAutocomplete } from '@cnamts/synapse'

const value = ref('1')
const items = [
  { text: 'Option 1', value: '1' },
  { text: 'Option 2', value: '2' },
  { text: 'Option 3', value: '3' },
]

const autocompleteRef = ref(null)

onMounted(() => {
  autocompleteRef.value?.validateOnSubmit()
})
</script>`,
			},
		],
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

			onMounted(() => {
				autocompleteRef.value?.validateOnSubmit()
			})

			return { args, value, autocompleteRef }
		},
		template: `
			<div class="pa-4">
				<SyAutocomplete
					ref="autocompleteRef"
					v-model="value"
					v-bind="args"
					:customRules="[
						{
							type: 'custom',
							options: {
								validate: (v) => v !== '1',
								message: 'Option 1 n\\'est pas autorisée, choisissez Option 2 ou 3.'
							}
						}
					]"
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
    label="Option"
    :customWarningRules="[
      {
        type: 'custom',
        options: {
          validate: (v) => v !== '1',
          warningMessage: 'Option 1 est dépréciée, préférez Option 2 ou 3.'
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
import { SyAutocomplete } from '@cnamts/synapse'

const value = ref('1')
const items = [
  { text: 'Option 1', value: '1' },
  { text: 'Option 2', value: '2' },
  { text: 'Option 3', value: '3' },
]

const autocompleteRef = ref(null)

onMounted(() => {
  autocompleteRef.value?.validateOnSubmit()
})
</script>`,
			},
		],
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

			onMounted(() => {
				autocompleteRef.value?.validateOnSubmit()
			})

			return { args, value, autocompleteRef }
		},
		template: `
			<div class="pa-4">
				<SyAutocomplete
					ref="autocompleteRef"
					v-model="value"
					v-bind="args"
					:customWarningRules="[
						{
							type: 'custom',
							options: {
								validate: (v) => v !== '1',
								warningMessage: 'Option 1 est dépréciée, préférez Option 2 ou 3.'
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
    label="Option"
    show-success-messages
    :customSuccessRules="[
      {
        type: 'custom',
        options: {
          validate: (v) => v !== null && v !== undefined,
          successMessage: 'Option sélectionnée avec succès.'
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
import { SyAutocomplete } from '@cnamts/synapse'

const value = ref('1')
const items = [
  { text: 'Option 1', value: '1' },
  { text: 'Option 2', value: '2' },
  { text: 'Option 3', value: '3' },
]

const autocompleteRef = ref(null)

onMounted(() => {
  autocompleteRef.value?.validateOnSubmit()
})
</script>`,
			},
		],
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

			onMounted(() => {
				autocompleteRef.value?.validateOnSubmit()
			})

			return { args, value, autocompleteRef }
		},
		template: `
			<div class="pa-4">
				<SyAutocomplete
					ref="autocompleteRef"
					v-model="value"
					v-bind="args"
					:customSuccessRules="[
						{
							type: 'custom',
							options: {
								validate: (v) => v !== null && v !== undefined,
								successMessage: 'Option sélectionnée avec succès.'
							}
						}
					]"
				/>
			</div>
		`,
	}),
}

export const NoSuccessMessage: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Avec `showSuccessMessages: false`, l\'état visuel de succès reste actif (bordure verte, icône) mais le message texte n\'est pas affiché. Utile quand un retour positif silencieux est suffisant.',
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
    label="Option"
    :show-success-messages="false"
    :customSuccessRules="[
      {
        type: 'custom',
        options: {
          validate: (v) => v !== null && v !== undefined,
          successMessage: 'Option sélectionnée avec succès.'
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
import { SyAutocomplete } from '@cnamts/synapse'

const value = ref('1')
const items = [
  { text: 'Option 1', value: '1' },
  { text: 'Option 2', value: '2' },
  { text: 'Option 3', value: '3' },
]

const autocompleteRef = ref(null)

onMounted(() => {
  autocompleteRef.value?.validateOnSubmit()
})
</script>`,
			},
		],
	},
	args: {
		'items': items,
		'label': 'Option',
		'filter': false,
		'showSuccessMessages': false,
		'onUpdate:modelValue': fn(),
	},
	render: args => ({
		components: { SyAutocomplete },
		setup() {
			const value = ref('1')
			const autocompleteRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)

			onMounted(() => {
				autocompleteRef.value?.validateOnSubmit()
			})

			return { args, value, autocompleteRef }
		},
		template: `
			<div class="pa-4">
				<SyAutocomplete
					ref="autocompleteRef"
					v-model="value"
					v-bind="args"
					:customSuccessRules="[
						{
							type: 'custom',
							options: {
								validate: (v) => v !== null && v !== undefined,
								successMessage: 'Option sélectionnée avec succès.'
							}
						}
					]"
				/>
			</div>
		`,
	}),
}

export const NoValidateOnBlur: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Avec `isValidateOnBlur: false`, la validation se déclenche **immédiatement** dès que la valeur change, sans attendre que le champ perde le focus. Utilisez les boutons ci-dessous pour modifier la valeur par programmation et observer le comportement.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <div class="d-flex flex-column gap-4 pa-4">
    <SyAutocomplete
      v-model="value"
      :items="items"
      label="Option"
      :is-validate-on-blur="false"
      :custom-rules="[{
        type: 'custom',
        options: {
          validate: (v) => v !== '1',
          message: 'Option 1 n\\'est pas autorisée.'
        }
      }]"
    />
    <div class="d-flex gap-4 mt-2">
      <VBtn color="primary" class="mr-1" @click="value = '1'">Définir une valeur invalide</VBtn>
      <VBtn color="primary" class="mr-1" @click="value = '2'">Définir une valeur valide</VBtn>
      <VBtn @click="value = null">Réinitialiser</VBtn>
    </div>
  </div>
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { SyAutocomplete } from '@cnamts/synapse'

const value = ref(null)
const items = [
  { text: 'Option 1', value: '1' },
  { text: 'Option 2', value: '2' },
  { text: 'Option 3', value: '3' },
]
</script>`,
			},
		],
	},
	args: {
		items,
		label: 'Option',
		isValidateOnBlur: false,
	},
	render: (args) => {
		return {
			components: { SyAutocomplete, VBtn },
			setup() {
				const value = ref(null)
				return { args, value }
			},
			template: `
				<div class="d-flex flex-column gap-4 pa-4">
					<SyAutocomplete
						v-model="value"
						v-bind="args"
						:custom-rules="[{
							type: 'custom',
							options: {
								validate: (v) => v !== '1',
								message: 'Option 1 n\\'est pas autorisée.'
							}
						}]"
					/>
					<div class="d-flex gap-4 mt-2">
						<VBtn color="primary" class="mr-1" @click="value = '1'">Définir une valeur invalide</VBtn>
						<VBtn color="primary" class="mr-1" @click="value = '2'">Définir une valeur valide</VBtn>
						<VBtn @click="value = null">Réinitialiser</VBtn>
					</div>
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
	<div class="d-flex flex-column gap-4">
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

const value1 = ref(null)
const value2 = ref(null)
</script>`,
			},
		],
	},
	args: {
		items,
	},
	render: (args) => {
		return {
			components: { SyAutocomplete },
			setup() {
				const value1 = ref(null)
				const value2 = ref(null)
				return { args, value1, value2 }
			},
			template: `
				<div class="pa-4 d-flex flex-column" style="gap: 16px;">
					<SyAutocomplete
						v-model="value1"
						v-bind="args"
						label="Avec validation interne (défaut)"
						required
					/>
					<SyAutocomplete
						v-model="value2"
						v-bind="args"
						label="Validation interne désactivée"
						required
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
const autocompleteRef = ref(null)
const items = [
  { text: 'Option 1', value: '1' },
  { text: 'Option 2', value: '2' },
  { text: 'Option 3', value: '3' },
]

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
      :rules="[v => !!v || 'Ce champ est requis']"
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

const value = ref(null)
const items = [
  { text: 'Option 1', value: '1' },
  { text: 'Option 2', value: '2' },
  { text: 'Option 3', value: '3' },
]

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
			const value = ref(null)

			function onSubmit(event: { isValid: boolean }) {
				if (event.isValid) {
					alert(`Formulaire valide : ${value.value}`)
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
						:rules="[v => !!v || 'Ce champ est requis']"
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
      :rules="[v => !!v || 'Ce champ est requis']"
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

const value = ref(null)
const formRef = ref(null)
const items = [
  { text: 'Option 1', value: '1' },
  { text: 'Option 2', value: '2' },
  { text: 'Option 3', value: '3' },
]

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
		'items': items,
		'label': 'Option',
		'useVuetifyValidation': true,
		'onUpdate:modelValue': fn(),
	},
	render: args => ({
		components: { SyAutocomplete, VBtn, VForm },
		setup() {
			const value = ref(null)
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
					<SyAutocomplete
						v-model="value"
						v-bind="args"
						:rules="[v => !!v || 'Ce champ est requis']"
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
