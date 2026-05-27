import SyForm from '@/components/Customs/SyForm/SyForm.vue'
import PhoneField from '../PhoneField.vue'
import type { StoryObj, Meta } from '@storybook/vue3'
import { ref, onMounted } from 'vue'
import { VBtn } from 'vuetify/components'
import { VForm } from 'vuetify/components/VForm'
import { fn } from '@storybook/test'

const meta: Meta<typeof PhoneField> = {
	title: 'Composants/Formulaires/PhoneField/Validation',
	component: PhoneField,
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: /^on*|undefined/ },
	},
	args: {
		'onUpdate:modelValue': fn(),
		'onUpdate:dialCodeModel': fn(),
	} as Record<string, unknown>,
} as Meta<typeof PhoneField>

export default meta

type Story = StoryObj<typeof meta>

export const WithError: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Un numéro invalide est pré-rempli et déclenche une erreur bloquante au chargement.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <PhoneField
    ref="phoneRef"
    v-model="phone"
    :customRules="[
      {
        type: 'custom',
        options: {
          validate: (value) => /^0[1-9][0-9]{8}$/.test(value.replace(/\\s/g, '')),
          message: 'Le numéro de téléphone n\\'est pas valide.'
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
import { PhoneField } from '@cnamts/synapse'

const phone = ref('123')
const phoneRef = ref(null)

onMounted(() => {
  phoneRef.value?.validateOnSubmit()
})
</script>`,
			},
		],
	},
	render: args => ({
		components: { PhoneField },
		setup() {
			const phone = ref('123')
			const phoneRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)

			onMounted(() => {
				phoneRef.value?.validateOnSubmit()
			})

			return { args, phone, phoneRef }
		},
		template: `
			<div class="pa-4">
				<PhoneField
					ref="phoneRef"
					v-model="phone"
					v-bind="args"
					:customRules="[
						{
							type: 'custom',
							options: {
								validate: (value) => /^0[1-9][0-9]{8}$/.test(value.replace(/\\s/g, '')),
								message: 'Le numéro de téléphone n\\'est pas valide.'
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
				story: 'Un numéro est pré-rempli et déclenche un avertissement (non bloquant) au chargement.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <PhoneField
    ref="phoneRef"
    v-model="phone"
    :customWarningRules="[
      {
        type: 'custom',
        options: {
          validate: (value) => !value.replace(/\\s/g, '').startsWith('08'),
          warningMessage: 'Les numéros commençant par 08 peuvent être surtaxés.'
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
import { PhoneField } from '@cnamts/synapse'

const phone = ref('0812345678')
const phoneRef = ref(null)

onMounted(() => {
  phoneRef.value?.validateOnSubmit()
})
</script>`,
			},
		],
	},
	render: args => ({
		components: { PhoneField },
		setup() {
			const phone = ref('0812345678')
			const phoneRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)

			onMounted(() => {
				phoneRef.value?.validateOnSubmit()
			})

			return { args, phone, phoneRef }
		},
		template: `
			<div class="pa-4">
				<PhoneField
					ref="phoneRef"
					v-model="phone"
					v-bind="args"
					:customWarningRules="[
						{
							type: 'custom',
							options: {
								validate: (value) => !value.replace(/\\s/g, '').startsWith('08'),
								warningMessage: 'Les numéros commençant par 08 peuvent être surtaxés.'
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
				story: 'Un numéro valide est pré-rempli et déclenche la confirmation de succès au chargement.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <PhoneField
    ref="phoneRef"
    v-model="phone"
    show-success-messages
    :customSuccessRules="[
      {
        type: 'custom',
        options: {
          validate: (value) => value.replace(/\\s/g, '').length === 10,
          successMessage: 'Numéro de téléphone valide.'
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
import { PhoneField } from '@cnamts/synapse'

const phone = ref('0612345678')
const phoneRef = ref(null)

onMounted(() => {
  phoneRef.value?.validateOnSubmit()
})
</script>`,
			},
		],
	},
	args: {
		showSuccessMessages: true,
	} as Record<string, unknown>,
	render: args => ({
		components: { PhoneField },
		setup() {
			const phone = ref('0612345678')
			const phoneRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)

			onMounted(() => {
				phoneRef.value?.validateOnSubmit()
			})

			return { args, phone, phoneRef }
		},
		template: `
			<div class="pa-4">
				<PhoneField
					ref="phoneRef"
					v-model="phone"
					v-bind="args"
					:customSuccessRules="[
						{
							type: 'custom',
							options: {
								validate: (value) => value.replace(/ /g, '').length === 10,
								successMessage: 'Numéro de téléphone valide.'
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
  <PhoneField
    ref="phoneRef"
    v-model="phone"
    :show-success-messages="false"
    :customSuccessRules="[
      {
        type: 'custom',
        options: {
			validate: (value) => value.replace(/\\s/g, '').length === 10,
			successMessage: 'Numéro de téléphone valide.'
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
import { PhoneField } from '@cnamts/synapse'

const phone = ref('0612345678')
const phoneRef = ref(null)

onMounted(() => {
  phoneRef.value?.validateOnSubmit()
})
</script>`,
			},
		],
	},
	args: {
		showSuccessMessages: false,
	} as Record<string, unknown>,
	render: args => ({
		components: { PhoneField },
		setup() {
			const phone = ref('0612345678')
			const phoneRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)

			onMounted(() => {
				phoneRef.value?.validateOnSubmit()
			})

			return { args, phone, phoneRef }
		},
		template: `
			<div class="pa-4">
				<PhoneField
					ref="phoneRef"
					v-model="phone"
					v-bind="args"
					:customSuccessRules="[
						{
							type: 'custom',
							options: {
								validate: (value) => value.replace(/ /g, '').length === 10,
								successMessage: 'Numéro de téléphone valide.'
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
				story: 'Avec `isValidateOnBlur: false`, la validation se déclenche **immédiatement** dès que la valeur change, sans attendre que le champ perde le focus.\n\nCliquez sur « Définir une valeur invalide » : l\'erreur apparaît aussitôt, sans qu\'il soit nécessaire de quitter le champ. Avec le comportement par défaut (`isValidateOnBlur: true`), la même action ne déclencherait aucune erreur tant que l\'utilisateur n\'a pas quitté le champ.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <div class="d-flex flex-column ga-4 pa-4">
    <PhoneField
      v-model="phone"
      :is-validate-on-blur="false"
      :custom-rules="[{
        type: 'custom',
        options: {
          validate: (value) => /^0[1-9][0-9]{8}$/.test(value.replace(/\\s/g, '')),
          message: 'Le numéro de téléphone n\\'est pas valide.'
        }
      }]"
    />
    <div class="d-flex ga-4 mt-2">
      <VBtn color="primary" @click="phone = '123'">Définir une valeur invalide</VBtn>
      <VBtn color="primary" @click="phone = '0612345678'">Définir une valeur valide</VBtn>
      <VBtn @click="phone = ''">Réinitialiser</VBtn>
    </div>
  </div>
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { PhoneField } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'

const phone = ref('')
</script>`,
			},
		],
	},
	args: {
		isValidateOnBlur: false,
	} as Record<string, unknown>,
	render: args => ({
		components: { PhoneField, VBtn },
		setup() {
			const phone = ref('')
			return { args, phone }
		},
		template: `
			<div class="d-flex flex-column ga-4 pa-4">
				<PhoneField
					v-model="phone"
					v-bind="args"
					:custom-rules="[{
						type: 'custom',
						options: {
							validate: (value) => /^0[1-9][0-9]{8}$/.test(value.replace(/\\s/g, '')),
							message: 'Le numéro de téléphone n\\'est pas valide.'
						}
					}]"
				/>
				<div class="d-flex ga-4 mt-2">
					<VBtn color="primary" @click="phone = '123'">Définir une valeur invalide</VBtn>
					<VBtn color="primary" @click="phone = '0612345678'">Définir une valeur valide</VBtn>
					<VBtn @click="phone = ''">Réinitialiser</VBtn>
				</div>
			</div>
		`,
	}),
}

export const DisableErrorHandling: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Avec `disableErrorHandling: true`, les règles d\'erreur sont évaluées mais n\'affectent pas l\'état visuel du champ (pas de bordure rouge ni d\'icône d\'erreur). Utile dans les cas où la validation doit être effectuée en arrière-plan sans perturber l\'expérience utilisateur.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <PhoneField
	v-model="phone"
	:disable-error-handling="true"
	:custom-rules="[{
	  type: 'custom',
	  options: {
		validate: (value) => /^0[1-9][0-9]{8}$/.test(value.replace(/\\s/g, '')),
		message: 'Le numéro de téléphone n\\'est pas valide.'
	  }
	}]"
  />
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { PhoneField } from '@cnamts/synapse'

const phone = ref('123')
</script>`,
			},
		],
	},
	args: {
		disableErrorHandling: true,
	} as Record<string, unknown>,
	render: args => ({
		components: { PhoneField },
		setup() {
			const phone = ref('123')
			return { args, phone }
		},
		template: `
			<div class="pa-4">
				<PhoneField
					v-model="phone"
					v-bind="args"
					:custom-rules="[{
						type: 'custom',
						options: {
							validate: (value) => /^0[1-9][0-9]{8}$/.test(value.replace(/\\s/g, '')),
							message: 'Le numéro de téléphone n\\'est pas valide.'
						}
					}]"
				/>
			</div>
		`,
	}),
}

export const SyFormValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Le champ peut être intégré dans un formulaire utilisant `SyForm` pour bénéficier de la validation globale du formulaire. Dans cet exemple, le bouton de soumission est désactivé tant que le numéro de téléphone n\'est pas valide.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyForm @submit="onSubmit">
	<PhoneField
	  v-model="phone"
	  required
	  :custom-rules="[{
		type: 'custom',
		options: {
		  validate: (value) => /^0[1-9][0-9]{8}$/.test(value.replace(/\\s/g, '')),
		  message: 'Le numéro de téléphone n\\'est pas valide.'
		}
	  }]"
	/>
	<VBtn type="submit">Soumettre</VBtn>
  </SyForm>
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { SyForm, PhoneField } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'

const phone = ref('')

const onSubmit = (e) => {
  alert('Le formulaire est : ' + (e.isValid ? 'valide' : 'invalide'))
}
</script>`,
			},
		],
	},
	render: args => ({
		components: { SyForm, PhoneField, VBtn },
		setup() {
			const phone = ref('')
			const onSubmit = (e) => {
				alert('Le formulaire est : ' + (e.isValid ? 'valide' : 'invalide'))
			}
			return { args, phone, onSubmit }
		},
		template: `
			<div class="pa-4">
				<SyForm @submit="onSubmit">
					<PhoneField
						v-model="phone"
						v-bind="args"
						required
						:custom-rules="[{
							type: 'custom',
							options: {
								validate: (value) => /^0[1-9][0-9]{8}$/.test(value.replace(/\\s/g, '')),
								message: 'Le numéro de téléphone n\\'est pas valide.'
							}
						}]"
					/>
					<VBtn type="submit" class="mt-4">Soumettre</VBtn>
				</SyForm>
			</div>
		`,
	}),
}

export const VFormValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Le champ peut également être utilisé dans un formulaire classique de Vuetify (`VForm`). Dans cet exemple, le bouton de soumission est désactivé tant que le numéro de téléphone n\'est pas valide.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <VForm @submit.prevent="onSubmit">
	<PhoneField
	  v-model="phone"
	  required
	  :custom-rules="[{
		type: 'custom',
		options: {
		  validate: (value) => /^0[1-9][0-9]{8}$/.test(value.replace(/\\s/g, '')),
		  message: 'Le numéro de téléphone n\\'est pas valide.'
		}
	  }]"
	/>
	<VBtn type="submit">Soumettre</VBtn>
  </VForm>
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { PhoneField } from '@cnamts/synapse'
import { VForm, VBtn } from 'vuetify/components'

const phone = ref('')
async function onSubmit(e) {
  alert('Le formulaire est : ' + ((await e).valid ? 'valide' : 'invalide'))
}
</script>`,
			},
		],
	},
	render: args => ({
		components: { PhoneField, VForm, VBtn },
		setup() {
			const phone = ref('')
			async function onSubmit(e) {
				alert('Le formulaire est : ' + ((await e).valid ? 'valide' : 'invalide'))
			}
			return { args, phone, onSubmit }
		},
		template: `
			<div class="pa-4">
				<VForm @submit.prevent="onSubmit">
					<PhoneField
						v-model="phone"
						v-bind="args"
						required
						:custom-rules="[{
							type: 'custom',
							options: {
								validate: (value) => /^0[1-9][0-9]{8}$/.test(value.replace(/\\s/g, '')),
								message: 'Le numéro de téléphone n\\'est pas valide.'
							}
						}]"
					/>
					<VBtn type="submit" class="mt-4">Soumettre</VBtn>
				</VForm>
			</div>
		`,
	}),
}

export const SyFromVuetifyValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Le champ est compatible avec les deux types de formulaires (`SyForm` et `VForm`) dans le même projet, permettant une intégration flexible selon les besoins spécifiques de chaque formulaire.\n\n- **SyForm** : la soumission déclenche automatiquement la validation de tous les champs enregistrés.\n- **VForm** : le bouton de soumission appelle manuellement `validateOnSubmit()` sur le champ.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <div class="d-flex flex-column ga-8">
    <div>
      <h3>Formulaire avec SyForm</h3>
      <SyForm @submit="onSyFormSubmit">
        <PhoneField
          v-model="phone1"
          required
          display-asterisk
          class="mb-4"
        />
        <VBtn type="submit" color="primary">Soumettre (SyForm)</VBtn>
      </SyForm>
    </div>
    <div>
      <h3>Formulaire avec VForm</h3>
      <VForm @submit.prevent="onVFormSubmit">
        <PhoneField
          ref="phoneRef"
          v-model="phone2"
          required
          display-asterisk
          class="mb-4"
        />
        <VBtn type="submit" color="primary">Soumettre (VForm)</VBtn>
      </VForm>
    </div>
  </div>
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { SyForm, PhoneField } from '@cnamts/synapse'
import { VBtn, VForm } from 'vuetify/components'

const phone1 = ref('')
const phone2 = ref('')
const phoneRef = ref(null)

function onSyFormSubmit(event: { isValid: boolean }) {
  if (event.isValid) {
    alert('SyForm valide : ' + phone1.value)
  } else {
    alert('SyForm invalide : veuillez corriger les erreurs.')
  }
}

async function onVFormSubmit() {
  const isValid = await phoneRef.value?.validateOnSubmit()
  if (isValid) {
    alert('VForm valide : ' + phone2.value)
  } else {
    alert('VForm invalide : veuillez corriger les erreurs.')
  }
}
</script>`,
			},
		],
	},
	render: args => ({
		components: { SyForm, PhoneField, VForm, VBtn },
		setup() {
			const phone1 = ref('')
			const phone2 = ref('')
			const phoneRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)

			function onSyFormSubmit(event: { isValid: boolean }) {
				if (event.isValid) {
					alert(`SyForm valide : ${phone1.value}`)
				}
				else {
					alert('SyForm invalide : veuillez corriger les erreurs.')
				}
			}

			async function onVFormSubmit() {
				const isValid = await phoneRef.value?.validateOnSubmit()
				if (isValid) {
					alert(`VForm valide : ${phone2.value}`)
				}
				else {
					alert('VForm invalide : veuillez corriger les erreurs.')
				}
			}

			return { args, phone1, phone2, phoneRef, onSyFormSubmit, onVFormSubmit }
		},
		template: `
			<div class="pa-4 d-flex flex-column ga-8">
				<div>
					<h3 class="mb-4">Formulaire avec SyForm</h3>
					<SyForm @submit="onSyFormSubmit">
						<PhoneField
							v-model="phone1"
							v-bind="args"
							required
							display-asterisk
							class="mb-4"
						/>
						<VBtn type="submit" color="primary">Soumettre (SyForm)</VBtn>
					</SyForm>
				</div>
				<div>
					<h3 class="mb-4">Formulaire avec VForm</h3>
					<VForm @submit.prevent="onVFormSubmit">
						<PhoneField
							ref="phoneRef"
							v-model="phone2"
							v-bind="args"
							required
							display-asterisk
							class="mb-4"
						/>
						<VBtn type="submit" color="primary">Soumettre (VForm)</VBtn>
					</VForm>
				</div>
			</div>
		`,
	}),
}

export const VFormAndVuetifyValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: 'En utilisant vuetifyValidation, le champ peut être validé à la fois par `SyForm` et `VForm` selon le contexte d\'utilisation.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <VForm v-slot="{ isValid }">
    <PhoneField
	  v-model="phone"
	  :use-vuetify-validation="true"
	  :rules="[(value) => /^0[1-9][0-9]{8}$/.test(value.replace(/\\s/g, '')) || 'Le numéro de téléphone n\\'est pas valide.']"
	/>
	<VBtn type="submit" :disabled="isValid === false">Soumettre</VBtn>
  </VForm>
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { PhoneField } from '@cnamts/synapse'
import { VForm, VBtn } from 'vuetify/components'

const phone = ref('')
</script>`,
			},
		],
	},
	render: args => ({
		components: { PhoneField, VForm, VBtn },
		setup() {
			const phone = ref('')
			async function onSubmit(e: Promise<{ valid: boolean }>) {
				const result = await e
				alert('Le formulaire est : ' + (result.valid ? 'valide' : 'invalide'))
			}
			return { args, phone, onSubmit }
		},
		template: `
			<div class="pa-4">
				<VForm @submit.prevent="onSubmit">
					<PhoneField
						v-model="phone"
						v-bind="args"
						:use-vuetify-validation="true"
						:rules="[(value) => /^0[1-9][0-9]{8}$/.test(value.replace(/\\s/g, '')) || 'Le numéro de téléphone n\\'est pas valide.']"
					/>
					<VBtn type="submit" class="mt-4">Soumettre</VBtn>
				</VForm>
			</div>
		`,
	}),
}
