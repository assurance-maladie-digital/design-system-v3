import type { Meta, StoryObj } from '@storybook/vue3'
import SyMonthPicker from './SyMonthPicker.vue'
import { ref } from 'vue'

/**
 * `SyMonthPicker` est un composant de sélection de mois et d'année qui permet à l'utilisateur de choisir uniquement un mois et une année, sans jour spécifique.
 * Il est basé sur le DatePicker de Vuetify mais optimisé pour la sélection de mois.
 */
const meta = {
	title: 'Composants/Formulaires/SyMonthPicker',
	component: SyMonthPicker,
	parameters: {
		layout: 'centered',
	},
	argTypes: {
		modelValue: {
			description: 'Valeur actuellement sélectionnée (utilisé avec v-model)',
			control: 'text',
		},
		label: {
			description: 'Étiquette affichée pour le champ',
			control: 'text',
		},
		placeholder: {
			description: 'Texte de placeholder quand aucune valeur n\'est sélectionnée',
			control: 'text',
		},
		format: {
			description: 'Format de la date (mois/année) à utiliser',
			control: 'text',
		},
		required: {
			description: 'Indique si le champ est obligatoire',
			control: 'boolean',
		},
		disabled: {
			description: 'Désactive le champ de sélection',
			control: 'boolean',
		},
		readonly: {
			description: 'Rend le champ en lecture seule',
			control: 'boolean',
		},
		displayAsterisk: {
			description: 'Affiche un astérisque à côté du label quand le champ est obligatoire',
			control: 'boolean',
		},
		isOutlined: {
			description: 'Affiche le champ avec un contour',
			control: 'boolean',
		},
		displayIcon: {
			description: 'Affiche ou non l\'icône de calendrier',
			control: 'boolean',
		},
		displayAppendIcon: {
			description: 'Affiche l\'icône de calendrier à droite',
			control: 'boolean',
		},
		displayPrependIcon: {
			description: 'Affiche l\'icône de calendrier à gauche',
			control: 'boolean',
		},
		clearable: {
			description: 'Permet d\'effacer la sélection via un bouton clear',
			control: 'boolean',
		},
	},
	args: {
		label: 'Sélectionner un mois',
		placeholder: 'MM/YYYY',
		format: 'MM/YYYY',
		required: false,
		disabled: false,
		readonly: false,
		isOutlined: true,
		displayAsterisk: false,
		displayIcon: true,
		displayAppendIcon: false,
		displayPrependIcon: true,
		clearable: false,
	},
} as Meta<typeof SyMonthPicker>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Exemple de base du composant SyMonthPicker.
 */
export const Default: Story = {
	args: {},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<SyMonthPicker label="Sélectionner un mois" />`,
			},
		],
	},
}

/**
 * Exemple avec v-model pour contrôler la valeur sélectionnée.
 */
export const WithVModel: Story = {
	render: args => ({
		components: { SyMonthPicker },
		setup() {
			const selectedMonth = ref('03/2023')

			return { args, selectedMonth }
		},
		template: `
      <div>
        <div class="mb-4">
          Mois sélectionné: {{ selectedMonth }}
          <button 
            class="ml-4 px-2 py-1 bg-primary text-white rounded" 
            @click="selectedMonth = selectedMonth === '03/2023' ? '06/2023' : '03/2023'"
          >
            Changer le mois
          </button>
        </div>
        <SyMonthPicker v-model="selectedMonth" :label="args.label" />
      </div>
    `,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <div>
    <div class="mb-4">
      Mois sélectionné: {{ selectedMonth }}
      <button 
        class="ml-4 px-2 py-1 bg-primary text-white rounded" 
        @click="selectedMonth = selectedMonth === '03/2023' ? '06/2023' : '03/2023'"
      >
        Changer le mois
      </button>
    </div>
    <SyMonthPicker v-model="selectedMonth" label="Sélectionner un mois" />
  </div>
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup>
import { ref } from 'vue'

const selectedMonth = ref('03/2023')
</script>`,
			},
		],
	},
}

/**
 * Exemple avec champ obligatoire et affichage d'astérisque.
 */
export const RequiredWithAsterisk: Story = {
	args: {
		required: true,
		displayAsterisk: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<SyMonthPicker label="Sélectionner un mois" required displayAsterisk />`,
			},
		],
	},
}

/**
 * Exemple avec position d'icône différente.
 */
export const IconPositionAppend: Story = {
	args: {
		displayPrependIcon: false,
		displayAppendIcon: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<SyMonthPicker label="Sélectionner un mois" :displayPrependIcon="false" :displayAppendIcon="true" />`,
			},
		],
	},
}

/**
 * Exemple désactivé.
 */
export const Disabled: Story = {
	args: {
		disabled: true,
		modelValue: '04/2023',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<SyMonthPicker label="Sélectionner un mois" disabled modelValue="04/2023" />`,
			},
		],
	},
}

/**
 * Exemple en lecture seule.
 */
export const ReadOnly: Story = {
	args: {
		readonly: true,
		modelValue: '07/2023',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<SyMonthPicker label="Sélectionner un mois" readonly modelValue="07/2023" />`,
			},
		],
	},
}

/**
 * Exemple avec la fonctionnalité d'effacement (clear).
 */
export const WithClearable: Story = {
	render: args => ({
		components: { SyMonthPicker },
		setup() {
			const selectedMonth = ref('05/2023')
			const handleClear = () => {
				console.log('Sélection effacée')
			}

			return { args, selectedMonth, handleClear }
		},
		template: `
      <div>
        <div class="mb-4">Mois sélectionné: {{ selectedMonth || 'Aucun' }}</div>
        <SyMonthPicker 
          v-model="selectedMonth" 
          :label="args.label" 
          clearable 
          @clear="handleClear" 
        />
      </div>
    `,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <div>
    <div class="mb-4">Mois sélectionné: {{ selectedMonth || 'Aucun' }}</div>
    <SyMonthPicker 
      v-model="selectedMonth" 
      label="Sélectionner un mois" 
      clearable 
      @clear="handleClear" 
    />
  </div>
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup>
import { ref } from 'vue'

const selectedMonth = ref('05/2023')
const handleClear = () => {
  console.log('Sélection effacée')
}
</script>`,
			},
		],
	},
}
