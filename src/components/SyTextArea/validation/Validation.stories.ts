import type { Meta, StoryObj } from '@storybook/vue3'
import SyTextArea from '../SyTextArea.vue'
import SyForm from '../../Customs/SyForm/SyForm.vue'
import { ref, onMounted, nextTick } from 'vue'
import { fn } from '@storybook/test'
import { VBtn, VForm } from 'vuetify/components'

const meta: Meta<typeof SyTextArea> = {
	title: 'Composants/Formulaires/SyTextArea/Validation',
	component: SyTextArea,
	parameters: {
		layout: 'fullscreen',
	},
	args: {
		'onUpdate:modelValue': fn(),
	},
} as Meta<typeof SyTextArea>

export default meta

type Story = StoryObj<typeof meta>

export const WithError: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Un message prédéfini est présélectionné et déclenche une erreur bloquante au chargement.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyTextArea
    ref="textAreaRef"
    v-model="value"
    label="Description"
    :custom-rules="[
      {
        type: 'custom',
        options: {
          validate: (v) => v.length <= 20,
          message: 'Le texte ne doit pas dépasser 20 caractères.'
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
import { SyTextArea } from '@cnamts/synapse'

const value = ref('Ce texte est trop long et provoque une erreur.')
const textAreaRef = ref(null)

onMounted(() => {
  textAreaRef.value?.validateOnSubmit()
})
</script>`,
			},
		],
	},
	args: {
		'label': 'Description',
		'onUpdate:modelValue': fn(),
	},
	render: args => ({
		components: { SyTextArea },
		setup() {
			const value = ref('Ce texte est trop long et provoque une erreur.')
			const textAreaRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)

			onMounted(() => {
				textAreaRef.value?.validateOnSubmit()
			})

			return { args, value, textAreaRef }
		},
		template: `
			<div class="pa-4">
				<SyTextArea
					ref="textAreaRef"
					v-model="value"
					v-bind="args"
					:custom-rules="[
						{
							type: 'custom',
							options: {
								validate: (v) => v.length <= 20,
								message: 'Le texte ne doit pas dépasser 20 caractères.'
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
				story: 'Les règles d\'alerte (`customWarningRules`) sont non bloquantes : le formulaire peut être soumis même si elles échouent.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyTextArea
    ref="textAreaRef"
    v-model="value"
    label="Observations"
    :custom-warning-rules="[
      {
        type: 'custom',
        options: {
          validate: (v) => v.length >= 10,
          warningMessage: 'Pour une meilleure description, saisissez au moins 10 caractères.'
        }
      }
    ]"
  />
</template>`,
			},
		],
	},
	args: {
		'label': 'Observations',
		'onUpdate:modelValue': fn(),
	},
	render: args => ({
		components: { SyTextArea },
		setup() {
			const value = ref('Court.')
			const textAreaRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)

			onMounted(() => {
				textAreaRef.value?.validateOnSubmit()
			})

			return { args, value, textAreaRef }
		},
		template: `
			<div class="pa-4">
				<SyTextArea
					ref="textAreaRef"
					v-model="value"
					v-bind="args"
					:custom-warning-rules="[
						{
							type: 'custom',
							options: {
								validate: (v) => v.length >= 10,
								warningMessage: 'Pour une meilleure description, saisissez au moins 10 caractères.'
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
				story: 'Les règles de succès (`customSuccessRules`) affichent un message positif quand la valeur est valide.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyTextArea
    ref="textAreaRef"
    v-model="value"
    label="Commentaire"
    show-success-messages
    :custom-success-rules="[
      {
        type: 'custom',
        options: {
          validate: (v) => v.length >= 20,
          successMessage: 'Description suffisamment détaillée.'
        }
      }
    ]"
  />
</template>`,
			},
		],
	},
	args: {
		'label': 'Commentaire',
		'showSuccessMessages': true,
		'onUpdate:modelValue': fn(),
	},
	render: args => ({
		components: { SyTextArea },
		setup() {
			const value = ref('Voici une description bien détaillée du problème rencontré.')
			const textAreaRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)

			onMounted(() => {
				textAreaRef.value?.validateOnSubmit()
			})

			return { args, value, textAreaRef }
		},
		template: `
			<div class="pa-4">
				<SyTextArea
					ref="textAreaRef"
					v-model="value"
					v-bind="args"
					:custom-success-rules="[
						{
							type: 'custom',
							options: {
								validate: (v) => v.length >= 20,
								successMessage: 'Description suffisamment détaillée.'
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
				story: 'Avec `isValidateOnBlur: false`, la validation se déclenche **immédiatement** dès que la valeur change. Dans cette story, l\'état de validation est volontairement conservé uniquement pour les changements déclenchés par les boutons. Une saisie directe dans le textarea met donc à jour la valeur, puis réinitialise aussitôt les messages et l\'état visuel.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <div class="d-flex flex-column gap-4 pa-4">
    <SyTextArea
      ref="textAreaRef"
      :model-value="value"
      label="Description"
      :is-validate-on-blur="false"
      :custom-rules="[{
        type: 'custom',
        options: {
          validate: (v) => v !== 'Contenu interdit',
          message: 'Le contenu « Contenu interdit » n\\'est pas autorisé.'
        }
      }]"
      @update:model-value="handleManualChange"
    />
    <div class="d-flex gap-4 mt-2">
      <VBtn color="primary" class="mr-1" @mousedown.prevent @click="applyButtonValue('Contenu interdit')">Définir une valeur invalide</VBtn>
      <VBtn color="primary" class="mr-1" @mousedown.prevent @click="applyButtonValue('Contenu valide')">Définir une valeur valide</VBtn>
      <VBtn @mousedown.prevent @click="applyButtonValue('')">Réinitialiser</VBtn>
    </div>
  </div>
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { SyTextArea } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'

const value = ref('')
const textAreaRef = ref(null)
const isButtonDrivenChange = ref(false)

const handleManualChange = async (newValue) => {
  value.value = newValue
  if (isButtonDrivenChange.value) {
    isButtonDrivenChange.value = false
    return
  }
  await nextTick()
  textAreaRef.value?.clearValidation()
}

const applyButtonValue = (newValue) => {
  isButtonDrivenChange.value = true
  value.value = newValue
}
</script>`,
			},
		],
	},
	args: {
		'label': 'Description',
		'isValidateOnBlur': false,
		'onUpdate:modelValue': fn(),
	},
	render: args => ({
		components: { SyTextArea, VBtn },
		setup() {
			const value = ref('')
			const textAreaRef = ref<{ clearValidation: () => void } | null>(null)
			const isButtonDrivenChange = ref(false)

			const handleManualChange = async (newValue: string) => {
				value.value = newValue
				if (isButtonDrivenChange.value) {
					isButtonDrivenChange.value = false
					return
				}
				await nextTick()
				textAreaRef.value?.clearValidation()
			}

			const applyButtonValue = (newValue: string) => {
				isButtonDrivenChange.value = true
				value.value = newValue
			}

			return { args, value, textAreaRef, handleManualChange, applyButtonValue }
		},
		template: `
			<div class="d-flex flex-column gap-4 pa-4">
				<SyTextArea
					ref="textAreaRef"
					:model-value="value"
					v-bind="args"
					:custom-rules="[{
						type: 'custom',
						options: {
							validate: (v) => v !== 'Contenu interdit',
							message: 'Le contenu « Contenu interdit » n\\'est pas autorisé.'
						}
					}]"
					@update:model-value="handleManualChange"
				/>
				<div class="d-flex gap-4 mt-2">
					<VBtn color="primary" class="mr-1" @mousedown.prevent @click="applyButtonValue('Contenu interdit')">Définir une valeur invalide</VBtn>
					<VBtn color="primary" class="mr-1" @mousedown.prevent @click="applyButtonValue('Contenu valide')">Définir une valeur valide</VBtn>
					<VBtn @mousedown.prevent @click="applyButtonValue('')">Réinitialiser</VBtn>
				</div>
			</div>
		`,
	}),
}

export const DisableErrorHandling: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Avec `disableErrorHandling: true`, les messages d\'erreur ne sont pas affichés même si des règles échouent. L\'état visuel reste inchangé.',
			},
		},
	},
	render: () => ({
		components: { SyTextArea },
		setup() {
			const valueWithHandling = ref('')
			const valueWithout = ref('')

			const customRules = [
				{
					type: 'required',
					options: {},
				},
			]

			const textAreaRef1 = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)
			const textAreaRef2 = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)

			onMounted(async () => {
				await nextTick()
				textAreaRef1.value?.validateOnSubmit()
				textAreaRef2.value?.validateOnSubmit()
			})

			return { valueWithHandling, valueWithout, customRules, textAreaRef1, textAreaRef2 }
		},
		template: `
			<div class="pa-4 d-flex flex-column gap-6">
				<div>
					<p class="text-subtitle-2 mb-2">Avec gestion des erreurs (défaut)</p>
					<SyTextArea
						ref="textAreaRef1"
						v-model="valueWithHandling"
						label="Description"
						:custom-rules="customRules"
					/>
				</div>
				<div>
					<p class="text-subtitle-2 mb-2">Sans gestion des erreurs (disableErrorHandling)</p>
					<SyTextArea
						ref="textAreaRef2"
						v-model="valueWithout"
						label="Description"
						:custom-rules="customRules"
						disable-error-handling
					/>
				</div>
			</div>
		`,
	}),
}

export const SyFormValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Le composant s\'enregistre automatiquement auprès de `SyForm` via `useValidatable`. Le champ reste neutre au chargement, puis la soumission déclenche la validation.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyForm @submit="onSubmit">
    <SyTextArea
      v-model="value"
      label="Description obligatoire"
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
import { SyTextArea, SyForm } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'

const value = ref('')

function onSubmit(event: { isValid: boolean }) {
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
		'label': 'Description obligatoire',
		'required': true,
		'displayAsterisk': true,
		'onUpdate:modelValue': fn(),
	},
	render: args => ({
		components: { SyTextArea, SyForm, VBtn },
		setup() {
			const value = ref('')

			function onSubmit(event: { isValid: boolean }) {
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
					<SyTextArea
						v-model="value"
						label="Description obligatoire"
						:required="true"
						:display-asterisk="true"
						class="mb-4"
					/>
					<VBtn type="submit" color="primary">Soumettre</VBtn>
				</SyForm>
			</div>
		`,
	}),
}

export const VFormValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Intégration avec `VForm` natif Vuetify en conservant la validation Synapse. Le formulaire est rendu avec `novalidate` pour désactiver la validation HTML native du `textarea`. Le champ reste neutre au chargement, puis la soumission appelle `validateOnSubmit()` manuellement.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <VForm novalidate @submit.prevent="onSubmit">
    <SyTextArea
      ref="textAreaRef"
      v-model="value"
      label="Description obligatoire"
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
import { SyTextArea } from '@cnamts/synapse'
import { VBtn, VForm } from 'vuetify/components'

const value = ref('')
const textAreaRef = ref(null)

async function onSubmit() {
  const isValid = await textAreaRef.value?.validateOnSubmit()
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
		'label': 'Description obligatoire',
		'required': true,
		'displayAsterisk': true,
		'onUpdate:modelValue': fn(),
	},
	render: args => ({
		components: { SyTextArea, VBtn, VForm },
		setup() {
			const value = ref('')
			const textAreaRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)

			async function onSubmit() {
				const isValid = await textAreaRef.value?.validateOnSubmit()
				if (isValid) {
					alert(`Formulaire valide : ${value.value}`)
				}
				else {
					alert('Formulaire invalide.')
				}
			}

			return { args, value, textAreaRef, onSubmit }
		},
		template: `
			<div class="pa-4">
				<VForm novalidate @submit.prevent="onSubmit">
					<SyTextArea
						ref="textAreaRef"
						v-model="value"
						label="Description obligatoire"
						:required="true"
						:display-asterisk="true"
						class="mb-4"
					/>
					<VBtn type="submit" color="primary">Soumettre</VBtn>
				</VForm>
			</div>
		`,
	}),
}
