import type { Meta, StoryObj } from '@storybook/vue3'
import DiacriticPicker from './DiacriticPicker.vue'
import { VTextField, VTextarea } from 'vuetify/components'
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
    <v-text-field
      v-model="nom"
      label="Nom avec accents"
      color="primary"
      variant="outlined"
    />
  </DiacriticPicker>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { DiacriticPicker } from '@cnamts/synapse'
  
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
			components: { DiacriticPicker, VTextField },
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
						<v-text-field
							v-model="value"
							label="Nom avec accents"
							color="primary"
							variant="outlined"
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
    <v-textarea
      v-model="adresse"
      label="Adresse"
      color="primary"
      variant="outlined"
      auto-grow
    />
  </DiacriticPicker>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { DiacriticPicker } from '@cnamts/synapse'
  
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
			components: { DiacriticPicker, VTextarea },
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
						<v-textarea
							v-model="value"
							label="Adresse"
							color="primary"
							variant="outlined"
							auto-grow
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
    <v-text-field
      v-model="text"
      label="Texte avec accents personnalisés"
      color="primary"
      variant="outlined"
    />
  </DiacriticPicker>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { DiacriticPicker } from '@cnamts/synapse'
  
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
			components: { DiacriticPicker, VTextField },
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
						<v-text-field
							v-model="value"
							label="Texte avec accents personnalisés"
							color="primary"
							variant="outlined"
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
    <v-text-field
      v-model="text"
      label="Texte avec bouton personnalisé"
      color="primary"
      variant="outlined"
    />
  </DiacriticPicker>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { DiacriticPicker } from '@cnamts/synapse'
  
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
			components: { DiacriticPicker, VTextField },
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
						<v-text-field
							v-model="value"
							label="Texte avec bouton personnalisé"
							color="primary"
							variant="outlined"
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
    <v-text-field
      v-model="text"
      label="Options Vuetify personnalisées"
      color="secondary"
      variant="outlined"
    />
  </DiacriticPicker>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { DiacriticPicker } from '@cnamts/synapse'
  
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
				persistent: true,
			},
		},
	},
	render: (args) => {
		return {
			components: { DiacriticPicker, VTextField },
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
						<v-text-field
							v-model="value"
							label="Options Vuetify personnalisées"
							color="secondary"
							variant="outlined"
						/>
					</DiacriticPicker>
					<div class="mt-2">Valeur actuelle: {{ value }}</div>
				</div>
			`,
		}
	},
}
