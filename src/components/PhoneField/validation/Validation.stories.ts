import SyForm from '@/components/Customs/SyForm/SyForm.vue'
import PhoneField from '../PhoneField.vue'
import type { StoryObj, Meta } from '@storybook/vue3-vite'
import { ref, onMounted } from 'vue'
import { VBtn } from 'vuetify/components'
import { VForm } from 'vuetify/components/VForm'
import { default as phoneFieldMeta } from '../PhoneField.stories'

const meta: Meta<typeof PhoneField> = {
	...phoneFieldMeta,
	title: 'Composants/Formulaires/PhoneField/Validation',
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
	},
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
      :show-success-messages="true"
      :custom-rules="[{
        type: 'custom',
        options: {
          validate: (value) => /^0[1-9][0-9]{8}$/.test(value.replace(/\\s/g, '')),
          message: 'Le numéro de téléphone n\\'est pas valide.'
        }
      }]"
      :custom-success-rules="[{
        type: 'custom',
        options: {
          validate: (value) => /^0[1-9][0-9]{8}$/.test(value.replace(/\\s/g, '')),
          successMessage: 'Numéro de téléphone valide.'
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
		showSuccessMessages: true,
	},
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
					:custom-success-rules="[{
						type: 'custom',
						options: {
							validate: (value) => /^0[1-9][0-9]{8}$/.test(value.replace(/\\s/g, '')),
							successMessage: 'Numéro de téléphone valide.'
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
				story: 'Avec `disableErrorHandling: true`, la validation Synapse du champ est désactivée : les règles intégrées et les `customRules`, `customWarningRules` et `customSuccessRules` ne sont pas exécutées, ni à la saisie, ni au blur, ni à la soumission. Aucun message d\'erreur, d\'avertissement ou de succès issu de ces règles n\'est donc affiché, et ces règles ne bloquent pas la soumission. Les messages injectés par le parent (`errorMessages`, `warningMessages`, `successMessages`) restent affichés, et une erreur injectée ou l\'état forcé `hasError` fait toujours échouer `validateOnSubmit()`. Utile lorsque la gestion des erreurs est assurée par le parent.\n\nDans cet exemple, la valeur `123` ne respecte pas les règles du champ (longueur attendue et format personnalisé) : même après être entré puis sorti du champ, aucune erreur n\'apparaît. Désactivez le control `disableErrorHandling` pour comparer : une erreur s\'affiche alors à la sortie du champ.',
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
	},
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
				story: 'Le champ peut être intégré dans un formulaire utilisant `SyForm` pour bénéficier de la validation globale du formulaire. Dans cet exemple, la validité du formulaire est vérifiée à la soumission.',
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
	<VBtn type="submit" color="primary">Soumettre</VBtn>
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
	args: {
		required: true,
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
						:custom-rules="[{
							type: 'custom',
							options: {
								validate: (value) => /^0[1-9][0-9]{8}$/.test(value.replace(/\\s/g, '')),
								message: 'Le numéro de téléphone n\\'est pas valide.'
							}
						}]"
					/>
					<VBtn type="submit" class="mt-4" color="primary">Soumettre</VBtn>
				</SyForm>
			</div>
		`,
	}),
}

export const VFormValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Le champ peut également être utilisé dans un formulaire classique de Vuetify (`VForm`). Dans cet exemple, la validité du champ est vérifiée à la soumission en appelant `validateOnSubmit()` sur sa référence.\n\nIl est préférable d\'utiliser `SyForm` pour bénéficier de la validation globale du formulaire.',
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
	  ref="phoneFieldRef"
	  required
	  :custom-rules="[{
		type: 'custom',
		options: {
		  validate: (value) => /^0[1-9][0-9]{8}$/.test(value.replace(/\\s/g, '')),
		  message: 'Le numéro de téléphone n\\'est pas valide.'
		}
	  }]"
	/>
	<VBtn color="primary" type="submit">Soumettre</VBtn>
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

const phoneFieldRef = ref(null)
const phone = ref('')
async function onSubmit() {
  const result = await phoneFieldRef.value.validateOnSubmit()
  alert('Le formulaire est : ' + (result ? 'valide' : 'invalide'))
}
</script>`,
			},
		],
	},
	args: {
		required: true,
	},
	render: args => ({
		components: { PhoneField, VForm, VBtn },
		setup() {
			const phone = ref('')
			const phoneFieldRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)
			async function onSubmit() {
				const result = await phoneFieldRef.value!.validateOnSubmit()
				alert('Le formulaire est : ' + (result ? 'valide' : 'invalide'))
			}
			return { args, phone, phoneFieldRef, onSubmit }
		},
		template: `
			<div class="pa-4">
				<VForm @submit.prevent="onSubmit">
					<PhoneField
						v-model="phone"
						v-bind="args"
						ref="phoneFieldRef"
						:custom-rules="[{
							type: 'custom',
							options: {
								validate: (value) => {
									return /^0[1-9][0-9]{8}$/.test(value.replace(/\\s/g, ''))
								},
								message: 'Le numéro de téléphone n\\'est pas valide.'
							}
						}]"
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
				story: 'Validation native Vuetify (`useVuetifyValidation` + `rules`) dans un `SyForm` : les règles Vuetify du champ sont intégrées automatiquement à la validation globale du `SyForm`. La soumission déclenche la validation de tous les champs enregistrés et transmet le résultat dans `isValid`, sans appel manuel à `validateOnSubmit()`.\n\nEn mode Vuetify, `required` n\'ajoute que l\'astérisque et l\'attribut ARIA : la règle requise doit figurer dans `rules`.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<SyForm @submit="onSyFormSubmit">
		<PhoneField
			v-model="phone"
			required
			display-asterisk
			class="mb-4"
			use-vuetify-validation
			:rules="rules"
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
import { SyForm, PhoneField } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'

const phone = ref('')

// En mode Vuetify, \`required\` n'ajoute que l'astérisque et l'attribut ARIA :
// la règle requise doit figurer dans \`rules\`.
const rules = [
  (value) => !!value || 'Le numéro de téléphone est requis.',
  (value) => /^0[1-9][0-9]{8}$/.test(value.replace(/\\s/g, '')) || 'Le numéro de téléphone n\\'est pas valide.'
]

function onSyFormSubmit(event: { isValid: boolean }) {
  if (event.isValid) {
    alert('SyForm valide : ' + phone.value)
  } else {
    alert('SyForm invalide : veuillez corriger les erreurs.')
  }
}

</script>`,
			},
		],
	},
	args: {
		required: true,
		displayAsterisk: true,
		useVuetifyValidation: true,
	},
	render: args => ({
		components: { SyForm, PhoneField, VBtn },
		setup() {
			const phone = ref('')

			function onSyFormSubmit(event: { isValid: boolean }) {
				if (event.isValid) {
					alert(`SyForm valide : ${phone.value}`)
				}
				else {
					alert('SyForm invalide : veuillez corriger les erreurs.')
				}
			}

			// En mode Vuetify, `required` n'ajoute que l'astérisque et l'attribut ARIA :
			// la règle requise doit figurer dans `rules`.
			const rules = [
				value => !!value || 'Le numéro de téléphone est requis.',
				value => /^0[1-9][0-9]{8}$/.test(value.replace(/\s/g, '')) || 'Le numéro de téléphone n\'est pas valide.',
			]

			return { args, phone, rules, onSyFormSubmit }
		},
		template: `
			<SyForm @submit="onSyFormSubmit" class="pa-4">
				<PhoneField
					v-model="phone"
					v-bind="args"
					class="mb-4"
					:rules="rules"
				/>
				<VBtn type="submit" color="primary">Soumettre</VBtn>
			</SyForm>
		`,
	}),
}

export const VFormAndVuetifyValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Validation native Vuetify (`useVuetifyValidation` + `rules`) dans un `VForm` : le résultat est lu à la soumission.',
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
      :use-vuetify-validation="true"
      required
      display-asterisk
      :rules="rules"
    />
    <VBtn type="submit" class="mt-4" color="primary">Soumettre</VBtn>
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

// En mode Vuetify, \`required\` n'ajoute que l'astérisque et l'attribut ARIA :
// la règle requise doit figurer dans \`rules\`.
const rules = [
  (value) => !!value || 'Le numéro de téléphone est requis.',
  (value) => /^0[1-9][0-9]{8}$/.test(value.replace(/\\s/g, '')) || 'Le numéro de téléphone n\\'est pas valide.'
]

async function onSubmit(e) {
  const result = await e
  alert('Le formulaire est : ' + (result.valid ? 'valide' : 'invalide'))
}
</script>`,
			},
		],
	},
	args: {
		required: true,
		displayAsterisk: true,
	},
	argTypes: {
		useVuetifyValidation: {
			control: false,
			description: 'Figé à `true` dans cette story : un `VForm` ne prend en compte que les règles Vuetify (`rules`). En mode Synapse, ces règles sont ignorées et le `VForm` ne voit aucune erreur : la soumission serait toujours valide.',
		},
	},
	render: args => ({
		components: { PhoneField, VForm, VBtn },
		setup() {
			const phone = ref('')
			// En mode Vuetify, `required` n'ajoute que l'astérisque et l'attribut ARIA :
			// la règle requise doit figurer dans `rules`.
			const rules = [
				(value: string) => !!value || 'Le numéro de téléphone est requis.',
				(value: string) => /^0[1-9][0-9]{8}$/.test(value.replace(/\s/g, '')) || 'Le numéro de téléphone n\'est pas valide.',
			]
			async function onSubmit(e: Promise<{ valid: boolean }>) {
				const result = await e
				alert('Le formulaire est : ' + (result.valid ? 'valide' : 'invalide'))
			}
			return { args, phone, rules, onSubmit }
		},
		template: `
			<div class="pa-4">
				<VForm @submit.prevent="onSubmit">
					<PhoneField
						v-model="phone"
						v-bind="args"
						use-vuetify-validation
						:rules="rules"
					/>
					<VBtn type="submit" class="mt-4" color="primary">Soumettre</VBtn>
				</VForm>
			</div>
		`,
	}),
}
