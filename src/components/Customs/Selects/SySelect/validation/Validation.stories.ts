import type { Meta, StoryObj } from '@storybook/vue3'
import SySelect from '../SySelect.vue'
import SyForm from '../../../SyForm/SyForm.vue'
import { ref, onMounted } from 'vue'
import { fn } from '@storybook/test'
import { VBtn, VForm } from 'vuetify/components'

const meta: Meta<typeof SySelect> = {
	title: 'Composants/Formulaires/Selects/SySelect/Validation',
	component: SySelect,
	parameters: {
		layout: 'fullscreen',
	},
	args: {
		'onUpdate:modelValue': fn(),
	},
} as Meta<typeof SySelect>

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
  <SySelect
    ref="selectRef"
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
import { SySelect } from '@cnamts/synapse'
const value = ref('1')
const items = [
  { text: 'Option 1', value: '1' },
  { text: 'Option 2', value: '2' },
  { text: 'Option 3', value: '3' },
]

const selectRef = ref(null)

onMounted(() => {
  selectRef.value?.validateOnSubmit()
})
</script>`,
			},
		],
	},
	args: {
		'items': items,
		'label': 'Option',
		'onUpdate:modelValue': fn(),
	},
	render: args => ({
		components: { SySelect },
		setup() {
			const value = ref('1')
			const selectRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)

			onMounted(() => {
				selectRef.value?.validateOnSubmit()
			})

			return { args, value, selectRef }
		},
		template: `
			<div class="pa-4">
				<SySelect
					ref="selectRef"
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
  <SySelect
    ref="selectRef"
    v-model="value"
    :items="items"
    label="Option"
    :customWarningRules="[
      {
        type: 'custom',
        options: {
          validate: (v) => v !== '1',
          message: 'Option 1 est dépréciée, préférez Option 2 ou 3.'
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
import { SySelect } from '@cnamts/synapse'
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
		'items': items,
		'label': 'Option',
		'onUpdate:modelValue': fn(),
	},
	render: args => ({
		components: { SySelect },
		setup() {
			const value = ref('1')
			const selectRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)

			onMounted(() => {
				selectRef.value?.validateOnSubmit()
			})

			return { args, value, selectRef }
		},
		template: `
			<div class="pa-4">
				<SySelect
					ref="selectRef"
					v-model="value"
					v-bind="args"
					:customWarningRules="[
						{
							type: 'custom',
							options: {
								validate: (v) => v !== '1',
								message: 'Option 1 est dépréciée, préférez Option 2 ou 3.'
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
  <SySelect
    ref="selectRef"
    v-model="value"
    :items="items"
    label="Option"
    show-success-messages
    :customSuccessRules="[
      {
        type: 'custom',
        options: {
          validate: (v) => v !== null && v !== undefined,
          message: 'Option sélectionnée avec succès.'
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
import { SySelect } from '@cnamts/synapse'
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
		'items': items,
		'label': 'Option',
		'showSuccessMessages': true,
		'onUpdate:modelValue': fn(),
	},
	render: args => ({
		components: { SySelect },
		setup() {
			const value = ref('1')
			const selectRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)

			onMounted(() => {
				selectRef.value?.validateOnSubmit()
			})

			return { args, value, selectRef }
		},
		template: `
			<div class="pa-4">
				<SySelect
					ref="selectRef"
					v-model="value"
					v-bind="args"
					:customSuccessRules="[
						{
							type: 'custom',
							options: {
								validate: (v) => v !== null && v !== undefined,
								message: 'Option sélectionnée avec succès.'
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
  <SySelect
    ref="selectRef"
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
import { SySelect } from '@cnamts/synapse'

const value = ref('1')
const items = [
  { text: 'Option 1', value: '1' },
  { text: 'Option 2', value: '2' },
  { text: 'Option 3', value: '3' },
]

const selectRef = ref(null)

onMounted(() => {
  selectRef.value?.validateOnSubmit()
})
</script>`,
			},
		],
	},
	args: {
		'items': items,
		'label': 'Option',
		'showSuccessMessages': false,
		'onUpdate:modelValue': fn(),
	},
	render: args => ({
		components: { SySelect },
		setup() {
			const value = ref('1')
			const selectRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)

			onMounted(() => {
				selectRef.value?.validateOnSubmit()
			})

			return { args, value, selectRef }
		},
		template: `
			<div class="pa-4">
				<SySelect
					ref="selectRef"
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
				story: 'Avec `isValidateOnBlur: false`, la validation se déclenche **immédiatement** dès que la valeur change, sans attendre que le champ perde le focus.\n\nCliquez sur « Définir une valeur invalide » : l\'erreur apparaît aussitôt, sans qu\'il soit nécessaire d\'ouvrir ou de fermer le menu. Avec le comportement par défaut (`isValidateOnBlur: true`), la même action ne déclencherait aucune erreur tant que l\'utilisateur n\'a pas interagi avec le champ.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <div class="d-flex flex-column gap-4 pa-4">
    <SySelect
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
    <div class="d-flex gap-4">
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
import { SySelect } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'

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
			components: { SySelect, VBtn },
			setup() {
				const value = ref(null)
				return { args, value }
			},
			template: `
				<div class="d-flex flex-column gap-4 pa-4">
					<SySelect
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
					<div class="d-flex gap-4">
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
		<SySelect
			v-model="value1"
			:items="items"
			label="Avec validation interne (défaut)"
			required
		/>

		<SySelect
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
import { SySelect } from '@cnamts/synapse'

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
			components: { SySelect },
			setup() {
				const value1 = ref(null)
				const value2 = ref(null)
				return { args, value1, value2 }
			},
			template: `
				<div class="pa-4 d-flex flex-column" style="gap: 16px;">
					<SySelect
						v-model="value1"
						v-bind="args"
						label="Avec validation interne (défaut)"
						required
					/>
					<SySelect
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
				story: 'Exemple d\'utilisation du SySelect dans un formulaire.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyForm @submit="onSubmit">
    <SySelect
      v-model="formData.option"
      :items="options"
      label="Option"
      required
      display-asterisk
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
</template>
        `,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { SySelect, SyForm } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'

const formData = ref({
  option: ''
})

const options = [
  { text: 'Option 1', value: '1' },
  { text: 'Option 2', value: '2' },
  { text: 'Option 3', value: '3' },
]

const onSubmit = (event) => {
  if (event.isValid) {
    alert('Formulaire valide : ' + JSON.stringify(formData.value))
  } else {
    alert('Formulaire invalide : veuillez choisir une option.')
  }
}
</script>
        `,
			},
		],
	},
	args: {
		'items': items,
		'label': 'Option',
		'required': true,
		'displayAsterisk': true,
		'onUpdate:modelValue': fn(),
	},
	render: (args) => {
		return {
			components: { SySelect, SyForm, VBtn },
			setup() {
				const formData = ref({
					option: '',
				})

				const onSubmit = (event: { isValid: boolean }) => {
					if (event.isValid) {
						alert(`Formulaire valide : ${JSON.stringify(formData.value)}`)
					}
					else {
						alert('Formulaire invalide : veuillez choisir une option.')
					}
				}

				return { args, formData, onSubmit }
			},
			template: `
				<div class="pa-4">
					<SyForm @submit="onSubmit">
						<SySelect
							v-model="formData.option"
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
    <SySelect
      ref="selectRef"
      v-model="value"
      :items="items"
      label="Option obligatoire"
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
import { SySelect } from '@cnamts/synapse'
import { VBtn, VForm } from 'vuetify/components'

const value = ref('')
const selectRef = ref(null)
const items = [
  { text: 'Option 1', value: '1' },
  { text: 'Option 2', value: '2' },
  { text: 'Option 3', value: '3' },
]

async function onSubmit() {
  const isValid = await selectRef.value?.validateOnSubmit()
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
		label: 'Option obligatoire',
		required: true,
		displayAsterisk: true,
	},
	render: (args) => {
		return {
			components: { SySelect, VBtn, VForm },
			setup() {
				const value = ref('')
				const selectRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)

				async function onSubmit() {
					const isValid = await selectRef.value?.validateOnSubmit()
					if (isValid) {
						alert(`Formulaire valide : ${JSON.stringify(value.value)}`)
					}
					else {
						alert('Formulaire invalide : veuillez choisir une option.')
					}
				}

				return { args, value, selectRef, onSubmit }
			},
			template: `
				<div class="pa-4">
					<VForm @submit.prevent="onSubmit">
						<SySelect
							ref="selectRef"
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
				story: 'Exemple d\'utilisation de la validation native Vuetify via la prop `useVuetifyValidation`. Les règles sont définies au format Vuetify : des fonctions retournant `true` ou un message d\'erreur. Soumettez le formulaire pour déclencher la validation.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyForm @submit="onSubmit">
    <SySelect
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
import { SySelect, SyForm } from '@cnamts/synapse'
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
		components: { SySelect, SyForm, VBtn },
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
					<SySelect
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
    <SySelect
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
import { SySelect } from '@cnamts/synapse'
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
		components: { SySelect, VBtn, VForm },
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
					<SySelect
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
