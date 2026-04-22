import type { Meta, StoryObj } from '@storybook/vue3'
import DiacriticPicker from './DiacriticPicker.vue'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
import SyTextArea from '@/components/SyTextArea/SyTextArea.vue'
import { ref } from 'vue'

const meta = {
	title: 'Composants/Formulaires/DiacriticPicker',
	component: DiacriticPicker,
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['modelValue'] },
	},
	argTypes: {
		modelValue: {
			control: 'text',
			description: 'Valeur du champ',
		},
		btnTitle: {
			control: 'text',
			description: 'Texte du bouton d\'ouverture',
		},
		diacritics: {
			control: 'object',
			description: 'Liste des caractères diacritiques',
		},
		vuetifyOptions: {
			control: 'object',
			description: 'Options de personnalisation Vuetify',
		},
	},
} satisfies Meta<typeof DiacriticPicker>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <DiacriticPicker v-model="nom">
    <SyTextField
      v-model="nom"
      label="Nom avec accents"
    />
  </DiacriticPicker>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { DiacriticPicker, SyTextField } from '@cnamts/synapse'
  
  const nom = ref('')
</script>`,
			},
		],
	},
	args: {
		modelValue: '',
		btnTitle: 'éÉ',
		diacritics: [
			'é', 'è', 'ê', 'ë',
			'à', 'â', 'ä', 'æ',
			'î', 'ï',
			'ô', 'ö', 'œ',
			'ù', 'û', 'ü',
			'ÿ',
			'ç',
		],
		vuetifyOptions: {
			btn: {
				color: 'primary',
				size: 'small',
				variant: 'tonal',
			},
			dialog: {
				maxWidth: 400,
				persistent: false,
			},
		},
	},
	render: (args) => {
		return {
			components: { DiacriticPicker, SyTextField },
			setup() {
				const value = ref('')
				return { args, value }
			},
			template: `
				<div class="pa-4">
					<DiacriticPicker 
						v-model="value"
						:btn-title="args.btnTitle"
						:diacritics="args.diacritics"
						:vuetify-options="args.vuetifyOptions"
					>
						<SyTextField
							v-model="value"
							label="Nom avec accents"
						/>
					</DiacriticPicker>
					<div class="mt-2">Valeur actuelle: {{ value }}</div>
				</div>
			`,
		}
	},
}

export const Required: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <DiacriticPicker v-model="nom">
    <SyTextField
      v-model="nom"
      label="Nom requis"
      required
    />
  </DiacriticPicker>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { DiacriticPicker, SyTextField } from '@cnamts/synapse'
  
  const nom = ref('')
</script>`,
			},
		],
	},
	args: {
		modelValue: '',
		btnTitle: 'éÉ',
		diacritics: [
			'é', 'è', 'ê', 'ë',
			'à', 'â', 'ä', 'æ',
			'î', 'ï',
			'ô', 'ö', 'œ',
			'ù', 'û', 'ü',
			'ÿ',
			'ç',
		],
		vuetifyOptions: {
			btn: {
				color: 'primary',
				size: 'small',
				variant: 'tonal',
			},
			dialog: {
				maxWidth: 400,
				persistent: false,
			},
		},
	},
	render: (args) => {
		return {
			components: { DiacriticPicker, SyTextField },
			setup() {
				const value = ref('')
				return { args, value }
			},
			template: `
				<div class="pa-4">
					<DiacriticPicker 
						v-model="value"
						:btn-title="args.btnTitle"
						:diacritics="args.diacritics"
						:vuetify-options="args.vuetifyOptions"
					>
						<SyTextField
							v-model="value"
							label="Nom requis"
							required
						/>
					</DiacriticPicker>
					<div class="mt-2">Valeur actuelle: {{ value }}</div>
				</div>
			`,
		}
	},
}

export const WithError: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <DiacriticPicker v-model="nom">
    <SyTextField
      v-model="nom"
      label="Nom avec accents"
      :error-messages="['Ce champ contient une erreur']"
    />
  </DiacriticPicker>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { DiacriticPicker, SyTextField } from '@cnamts/synapse'
  
  const nom = ref('Texte invalide')
</script>`,
			},
		],
	},
	args: {
		modelValue: 'Texte invalide',
		btnTitle: 'éÉ',
		diacritics: [
			'é', 'è', 'ê', 'ë',
			'à', 'â', 'ä', 'æ',
			'î', 'ï',
			'ô', 'ö', 'œ',
			'ù', 'û', 'ü',
			'ÿ',
			'ç',
		],
		vuetifyOptions: {
			btn: {
				color: 'primary',
				size: 'small',
				variant: 'tonal',
			},
			dialog: {
				maxWidth: 400,
				persistent: false,
			},
		},
	},
	render: (args) => {
		return {
			components: { DiacriticPicker, SyTextField },
			setup() {
				const value = ref('Texte invalide')
				return { args, value }
			},
			template: `
				<div class="pa-4">
					<DiacriticPicker 
						v-model="value"
						:btn-title="args.btnTitle"
						:diacritics="args.diacritics"
						:vuetify-options="args.vuetifyOptions"
					>
						<SyTextField
							v-model="value"
							label="Nom avec accents"
							:error-messages="['Ce champ contient une erreur']"
						/>
					</DiacriticPicker>
					<div class="mt-2">Valeur actuelle: {{ value }}</div>
				</div>
			`,
		}
	},
}

export const WithWarning: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <DiacriticPicker v-model="nom">
    <SyTextField
      v-model="nom"
      label="Nom avec accents"
      :warning-messages="['Ce contenu nécessite une vérification']"
    />
  </DiacriticPicker>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { DiacriticPicker, SyTextField } from '@cnamts/synapse'
  
  const nom = ref('Texte avec avertissement')
</script>`,
			},
		],
	},
	args: {
		modelValue: 'Texte avec avertissement',
		btnTitle: 'éÉ',
		diacritics: [
			'é', 'è', 'ê', 'ë',
			'à', 'â', 'ä', 'æ',
			'î', 'ï',
			'ô', 'ö', 'œ',
			'ù', 'û', 'ü',
			'ÿ',
			'ç',
		],
		vuetifyOptions: {
			btn: {
				color: 'primary',
				size: 'small',
				variant: 'tonal',
			},
			dialog: {
				maxWidth: 400,
				persistent: false,
			},
		},
	},
	render: (args) => {
		return {
			components: { DiacriticPicker, SyTextField },
			setup() {
				const value = ref('Texte avec avertissement')
				return { args, value }
			},
			template: `
				<div class="pa-4">
					<DiacriticPicker 
						v-model="value"
						:btn-title="args.btnTitle"
						:diacritics="args.diacritics"
						:vuetify-options="args.vuetifyOptions"
					>
						<SyTextField
							v-model="value"
							label="Nom avec accents"
							:warning-messages="['Ce contenu nécessite une vérification']"
						/>
					</DiacriticPicker>
					<div class="mt-2">Valeur actuelle: {{ value }}</div>
				</div>
			`,
		}
	},
}

export const WithSuccess: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <DiacriticPicker v-model="nom">
    <SyTextField
      v-model="nom"
      label="Nom avec accents"
      :success-messages="['Contenu valide']"
    />
  </DiacriticPicker>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { DiacriticPicker, SyTextField } from '@cnamts/synapse'
  
  const nom = ref('Texte valide')
</script>`,
			},
		],
	},
	args: {
		modelValue: 'Texte valide',
		btnTitle: 'éÉ',
		diacritics: [
			'é', 'è', 'ê', 'ë',
			'à', 'â', 'ä', 'æ',
			'î', 'ï',
			'ô', 'ö', 'œ',
			'ù', 'û', 'ü',
			'ÿ',
			'ç',
		],
		vuetifyOptions: {
			btn: {
				color: 'primary',
				size: 'small',
				variant: 'tonal',
			},
			dialog: {
				maxWidth: 400,
				persistent: false,
			},
		},
	},
	render: (args) => {
		return {
			components: { DiacriticPicker, SyTextField },
			setup() {
				const value = ref('Texte valide')
				return { args, value }
			},
			template: `
				<div class="pa-4">
					<DiacriticPicker 
						v-model="value"
						:btn-title="args.btnTitle"
						:diacritics="args.diacritics"
						:vuetify-options="args.vuetifyOptions"
					>
						<SyTextField
							v-model="value"
							label="Nom avec accents"
							:success-messages="['Contenu valide']"
						/>
					</DiacriticPicker>
					<div class="mt-2">Valeur actuelle: {{ value }}</div>
				</div>
			`,
		}
	},
}

export const WithTextarea: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <DiacriticPicker v-model="adresse">
    <SyTextArea
      v-model="adresse"
      label="Adresse"
    />
  </DiacriticPicker>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { DiacriticPicker, SyTextArea } from '@cnamts/synapse'
  
  const adresse = ref('')
</script>`,
			},
		],
	},
	args: {
		modelValue: '',
		btnTitle: 'éÉ',
		diacritics: [
			'é', 'è', 'ê', 'ë',
			'à', 'â', 'ä', 'æ',
			'î', 'ï',
			'ô', 'ö', 'œ',
			'ù', 'û', 'ü',
			'ÿ',
			'ç',
		],
		vuetifyOptions: {
			btn: {
				color: 'primary',
				size: 'small',
				variant: 'tonal',
			},
			dialog: {
				maxWidth: 400,
				persistent: false,
			},
		},
	},
	render: (args) => {
		return {
			components: { DiacriticPicker, SyTextArea },
			setup() {
				const value = ref('')
				return { args, value }
			},
			template: `
				<div class="pa-4">
					<DiacriticPicker 
						v-model="value"
						:btn-title="args.btnTitle"
						:diacritics="args.diacritics"
						:vuetify-options="args.vuetifyOptions"
					>
						<SyTextArea
							v-model="value"
							label="Adresse"
						/>
					</DiacriticPicker>
					<div class="mt-2">Valeur actuelle: {{ value }}</div>
				</div>
			`,
		}
	},
}

export const CustomDiacritics: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <DiacriticPicker v-model="text" :diacritics="caracteres">
    <SyTextField
      v-model="text"
      label="Texte avec accents personnalisés"
    />
  </DiacriticPicker>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { DiacriticPicker, SyTextField } from '@cnamts/synapse'
  
  const text = ref('')
  const caracteres = ['é', 'è', 'ê', 'à', 'ç', 'ù']
</script>`,
			},
		],
	},
	args: {
		modelValue: '',
		btnTitle: 'éÉ',
		diacritics: ['é', 'è', 'ê', 'à', 'ç', 'ù'],
		vuetifyOptions: {
			btn: {
				color: 'primary',
				size: 'small',
				variant: 'tonal',
			},
			dialog: {
				maxWidth: 400,
				persistent: false,
			},
		},
	},
	render: (args) => {
		return {
			components: { DiacriticPicker, SyTextField },
			setup() {
				const value = ref('')
				return { args, value }
			},
			template: `
				<div class="pa-4">
					<DiacriticPicker 
						v-model="value"
						:btn-title="args.btnTitle"
						:diacritics="args.diacritics"
						:vuetify-options="args.vuetifyOptions"
					>
						<SyTextField
							v-model="value"
							label="Texte avec accents personnalisés"
						/>
					</DiacriticPicker>
					<div class="mt-2">Valeur actuelle: {{ value }}</div>
				</div>
			`,
		}
	},
}

export const CustomButtonTitle: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <DiacriticPicker v-model="text" btn-title="àéç">
    <SyTextField
      v-model="text"
      label="Texte avec bouton personnalisé"
    />
  </DiacriticPicker>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { DiacriticPicker, SyTextField } from '@cnamts/synapse'
  
  const text = ref('')
</script>`,
			},
		],
	},
	args: {
		modelValue: '',
		btnTitle: 'àéç',
		diacritics: [
			'é', 'è', 'ê', 'ë',
			'à', 'â', 'ä', 'æ',
			'î', 'ï',
			'ô', 'ö', 'œ',
			'ù', 'û', 'ü',
			'ÿ',
			'ç',
		],
		vuetifyOptions: {
			btn: {
				color: 'primary',
				size: 'small',
				variant: 'tonal',
			},
			dialog: {
				maxWidth: 400,
				persistent: false,
			},
		},
	},
	render: (args) => {
		return {
			components: { DiacriticPicker, SyTextField },
			setup() {
				const value = ref('')
				return { args, value }
			},
			template: `
				<div class="pa-4">
					<DiacriticPicker 
						v-model="value"
						:btn-title="args.btnTitle"
						:diacritics="args.diacritics"
						:vuetify-options="args.vuetifyOptions"
					>
						<SyTextField
							v-model="value"
							label="Texte avec bouton personnalisé"
						/>
					</DiacriticPicker>
					<div class="mt-2">Valeur actuelle: {{ value }}</div>
				</div>
			`,
		}
	},
}

export const Customization: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <DiacriticPicker 
    v-model="text" 
    :vuetify-options="{
      btn: {
        color: 'secondary',
        size: 'large',
        variant: 'outlined'
      },
      dialog: {
        maxWidth: 500,
        persistent: true
      }
    }"
  >
    <SyTextField
      v-model="text"
      label="Options Vuetify personnalisées"
      color="secondary"
    />
  </DiacriticPicker>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { DiacriticPicker, SyTextField } from '@cnamts/synapse'
  
  const text = ref('')
</script>`,
			},
		],
	},
	args: {
		modelValue: '',
		btnTitle: 'éÉ',
		diacritics: [
			'é', 'è', 'ê', 'ë',
			'à', 'â', 'ä', 'æ',
			'î', 'ï',
			'ô', 'ö', 'œ',
			'ù', 'û', 'ü',
			'ÿ',
			'ç',
		],
		vuetifyOptions: {
			btn: {
				color: 'secondary',
				size: 'large',
				variant: 'outlined',
			},
			dialog: {
				maxWidth: 500,
			},
		},
	},
	render: (args) => {
		return {
			components: { DiacriticPicker, SyTextField },
			setup() {
				const value = ref('')
				return { args, value }
			},
			template: `
				<div class="pa-4">
					<DiacriticPicker 
						v-model="value"
						:btn-title="args.btnTitle"
						:diacritics="args.diacritics"
						:vuetify-options="args.vuetifyOptions"
					>
						<SyTextField
							v-model="value"
							label="Options Vuetify personnalisées"
							color="secondary"
						/>
					</DiacriticPicker>
					<div class="mt-2">Valeur actuelle: {{ value }}</div>
				</div>
			`,
		}
	},
}
