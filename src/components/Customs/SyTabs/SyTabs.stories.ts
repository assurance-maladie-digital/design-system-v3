import type { Meta, StoryObj } from '@storybook/vue3'

import SyTabs from './SyTabs.vue'
import { ref } from 'vue'
import { mdiHome } from '@mdi/js'

// Plus d'informations sur la configuration de Storybook pour Vue:
// https://storybook.js.org/docs/vue/writing-stories/introduction

/**
 * `SyTabs` est un composant de navigation par onglets accessible et personnalisable.
 * Il permet d'organiser le contenu en sections navigables facilement via une interface à onglets.
 * Le composant implémente toutes les bonnes pratiques d'accessibilité ARIA et supporte la navigation complète au clavier.
 */
const meta = {
	title: 'Composants/Navigation/SyTabs',
	component: SyTabs,
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['confirmationMessage'] },
	},
	argTypes: {
		items: {
			description: 'Liste des éléments à afficher dans les onglets',
			control: 'object',
		},
		modelValue: {
			description: 'Index ou valeur de l\'onglet actuellement sélectionné (utilisé avec v-model)',
			control: 'text',
		},
		confirmTabChange: {
			description: 'Si activé, une confirmation sera demandée avant de changer d\'onglet',
			control: 'boolean',
		},
	},
	args: {
		items: [
			{ label: 'Onglet 1', value: 'tab1', content: 'Contenu de l\'onglet 1' },
			{ label: 'Onglet 2', value: 'tab2', content: 'Contenu de l\'onglet 2' },
			{ label: 'Onglet 3', value: 'tab3', content: 'Contenu de l\'onglet 3' },
		],
	},
} as Meta<typeof SyTabs>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Exemple de base du composant SyTabs avec des onglets simples.
 */
export const Default: Story = {
	args: {},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<SyTabs :items="items" />`,
			},
			{
				name: 'Script',
				code: `
const items = [
	{ label: 'Onglet 1', value: 'tab1', content: "Contenu de l'onglet 1" },
	{ label: 'Onglet 2', value: 'tab2', content: "Contenu de l'onglet 2" },
	{ label: 'Onglet 3', value: 'tab3', content: "Contenu de l'onglet 3" },
]
`,
			},
		],
	},
}

/**
 * Exemple de base du composant SyTabs avecun onglet disabled.
 */
export const Disabled: Story = {
	args: {
		items: [
			{ label: 'Onglet 1', value: 'tab1', content: 'Contenu de l\'onglet 1' },
			{ label: 'Onglet 2', value: 'tab2', content: 'Contenu de l\'onglet 2', disabled: true },
			{ label: 'Onglet 3', value: 'tab3', content: 'Contenu de l\'onglet 3' },
		],
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<SyTabs :items="items" />`,
			},
			{
				name: 'Script',
				code: `
					const items = [
						{ label: 'Onglet 1', value: 'tab1', content: "Contenu de l'onglet 1" },
						{ label: 'Onglet 2', value: 'tab2', content: "Contenu de l'onglet 2", disabled: true },
						{ label: 'Onglet 3', value: 'tab3', content: "Contenu de l'onglet 3" },
					]
				`,
			},
		],
	},
}

/**
 * Exemple avec v-model pour contrôler l'onglet actif de façon externe.
 */
export const WithVModel: Story = {
	render: args => ({
		components: { SyTabs },
		setup() {
			const activeTab = ref('tab2')

			return { args, activeTab }
		},
		template: `
      <div>
        <div class="mb-4">
          Onglet actif: {{ activeTab }}
          <button 
            class="ml-4 px-2 py-1 bg-primary text-white rounded" 
            @click="activeTab = activeTab === 'tab1' ? 'tab2' : 'tab1'"
          >
            Changer d'onglet
          </button>
        </div>
        <SyTabs v-model="activeTab" :items="args.items" />
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
      Onglet actif: {{ activeTab }}
      <button 
        class="ml-4 px-2 py-1 bg-primary text-white rounded" 
        @click="activeTab = activeTab === 'tab1' ? 'tab2' : 'tab1'"
      >
        Changer d'onglet
      </button>
    </div>
    <SyTabs v-model="activeTab" :items="items" />
  </div>
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup>
import { ref } from 'vue'

const activeTab = ref('tab2')
const items = [
  { label: 'Onglet 1', value: 'tab1', content: "Contenu de l'onglet 1" },
  { label: 'Onglet 2', value: 'tab2', content: "Contenu de l'onglet 2" },
  { label: 'Onglet 3', value: 'tab3', content: "Contenu de l'onglet 3" }
]
</script>`,
			},
		],
	},
}

/**
 * Exemple avec slot tabs prepend
 */
export const WithTabsPrependSlot: Story = {
	render: args => ({
		components: { SyTabs },
		setup() {
			return { args }
		},
		template: `
      <SyTabs :items="args.items">
        <template #tabs-prepend>
            <div class="p-4 bg-info-light rounded">
              <p class="mr-4">Tabs prepend content</p>
            </div>
        </template>
      </SyTabs>
    `,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: ` 
              <SyTabs :items="args.items">
        <template #tabs-prepend>
            <div class="p-4 bg-info-light rounded">
                <p class="mr-4">Tabs prepend content</p>
            </div>
        </template>
      </SyTabs>
      `,
			},
		],
	},
}

/**
 * Exemple avec slot tabs append
 */
export const WithTabsAppendSlot: Story = {
	render: args => ({
		components: { SyTabs },
		setup() {
			return { args }
		},
		template: `
      <SyTabs :items="args.items">
        <template #tabs-append>
            <div class="p-4 bg-info-light rounded">
              <p class="mr-4">Tabs append content</p>
            </div>
        </template>
      </SyTabs>
    `,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: ` 
              <SyTabs :items="args.items">
        <template #tabs-append>
            <div class="p-4 bg-info-light rounded">
                <p class="mr-4">Tabs append content</p>
            </div>
        </template>
      </SyTabs>
      `,
			},
		],
	},
}

/**
 * Exemple avec slot tab prepend
 */
export const WithTabPrependSlot: Story = {
	render: args => ({
		components: { SyTabs },
		setup() {
			return { args, mdiHome }
		},
		template: `
      <SyTabs :items="args.items">
        <template #tab-prepend="{ item, index, isActive }">
          <VIcon
              v-if="index === 0"
              class="mr-2"
              :color="isActive ? 'primary' : 'grey'"
              :icon="mdiHome"
          />
        </template>
      </SyTabs>
    `,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: ` 
              <SyTabs :items="args.items">
        <template #tab-prepend="{ item, index, isActive }">
          <VIcon
              v-if="index === 0"
              class="mr-2"
              :color="isActive ? 'primary' : 'grey'"
              :icon="mdiHome"
          />
        </template>
      </SyTabs>
      `,
				script: `
<script setup>
import { mdiHome } from '@mdi/js'
</script>
                `,
			},
		],
	},
}

/**
 * Exemple avec slot tab append
 */
export const WithTabAppendSlot: Story = {
	render: args => ({
		components: { SyTabs },
		setup() {
			return { args, mdiHome }
		},
		template: `
      <SyTabs :items="args.items">
        <template #tab-append="{ item, index, isActive }">
          <VIcon
              v-if="index === 0"
              class="ml-2"
              :color="isActive ? 'primary' : 'grey'"
              :icon="mdiHome"
          />
        </template>
      </SyTabs>
    `,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: ` 
              <SyTabs :items="args.items">
        <template #tab-append="{ item, index, isActive }">
        <VIcon
              v-if="index === 0"
              class="ml-2"
              :color="isActive ? 'primary' : 'grey'"
              :icon="mdiHome"
          />
      </template>
      </SyTabs>
      `,
				script: `
        <script setup>
        import { mdiHome } from '@mdi/js'
        </script>
                `,
			},
		],
	},
}

/**
 * Exemple avec slot pannel
 */
export const WithCustomContent: Story = {
	render: args => ({
		components: { SyTabs },
		setup() {
			return { args }
		},
		template: `
      <SyTabs :items="args.items">
        <template #panel-0>
          <div class="p-4 bg-info-light rounded">
            <h3 class="text-h6 font-weight-bold">Contenu personnalisé pour l'onglet 1</h3>
            <p>Vous pouvez utiliser des slots nommés <code>panel-{index}</code> pour personnaliser le contenu de chaque onglet.</p>
          </div>
        </template>
        <template #panel-1>
          <div class="p-4 bg-success-light rounded">
            <h3 class="text-h6 font-weight-bold text-secondary">Contenu personnalisé pour l'onglet 2</h3>
            <p>Ce panneau utilise un style différent.</p>
          </div>
        </template>
      </SyTabs>
    `,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: ` 
              <SyTabs :items="args.items">
        <template #panel-0>
          <div class="p-4 bg-info-light rounded">
            <h3 class="text-h6 font-weight-bold">Contenu personnalisé pour l'onglet 1</h3>
            <p>Vous pouvez utiliser des slots nommés <code>panel-{index}</code> pour personnaliser le contenu de chaque onglet.</p>
          </div>
        </template>
        <template #panel-1>
          <div class="p-4 bg-success-light rounded">
            <h3 class="text-h6 font-weight-bold text-secondary">Contenu personnalisé pour l'onglet 2</h3>
            <p>Ce panneau utilise un style différent.</p>
          </div>
        </template>
      </SyTabs>
      `,
			},
		],
	},
}

/**
 * Exemple avec de nombreux onglets pour démontrer le comportement de scrolling.
 */
export const ManyTabs: Story = {
	args: {
		items: Array.from({ length: 10 }, (_, i) => ({
			label: `Onglet ${i + 1}`,
			value: `tab${i + 1}`,
			content: `Contenu de l'onglet ${i + 1}`,
		})),
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<SyTabs :items="items" />`,
			},
			{
				name: 'Script',
				code: `
// Création d'un grand nombre d'onglets pour tester le comportement de défilement
const items = Array.from({ length: 10 }, (_, i) => ({
  label: \`Onglet \${i + 1}\`,
  value: \`tab\${i + 1}\`,
  content: \`Contenu de l'onglet \${i + 1}\`,
}))
`,
			},
		],
	},
}

/**
 * Exemple avec des options de personnalisation du thème.
 */
export const CustomTheme: Story = {
	render: args => ({
		components: { SyTabs },
		setup() {
			return { args }
		},
		template: `
      <SyTabs 
        :items="args.items"
        :vuetifyOptions="{
          sheet: { theme: 'dark', color: '#0C419A' },
          tab: { 'base-color': '#ffffff', 'active-color': '#ffffff', 'slider-color': '#42b983' },
          tabs: { height: '60' }
        }"
      />
    `,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<SyTabs 
  :items="items"
  :vuetifyOptions="{
    sheet: { theme: 'dark', color: '#0C419A' },
    tab: { 'base-color': '#ffffff', 'active-color': '#ffffff', 'slider-color': '#42b983' },
    tabs: { height: '60' }
  }"
/>
`,
			},
			{
				name: 'Script',
				code: `
<script setup>
const items = [
  { label: 'Onglet 1', value: 'tab1', content: "Contenu de l'onglet 1" },
  { label: 'Onglet 2', value: 'tab2', content: "Contenu de l'onglet 2" },
  { label: 'Onglet 3', value: 'tab3', content: "Contenu de l'onglet 3" },
]
</script>
`,
			},
		],
	},
}

/**
 * Exemple avec confirmation avant changement d'onglet.
 * Démontre comment utiliser la propriété confirmTabChange et gérer l'événement confirm-tab-change.
 */
export const WithTabConfirmation: Story = {
	render: args => ({
		components: { SyTabs },
		setup() {
			return {
				args,
				showConfirmDialog: (message: string, callback: (confirmed: boolean) => void) => {
					// Dans un cas réel, vous afficheriez une boîte de dialogue personnalisée
					// Ici nous utilisons window.confirm pour la démonstration
					const confirmed = window.confirm('Voulez-vous vraiment changer d\'onglet ?')
					// Appelons le callback avec le résultat de la confirmation
					callback(confirmed)
				},
			}
		},
		template: `
      <div>
        <div class="mb-4 pa-2 bg-warning-light">
          <strong>Note :</strong> Essayez de changer d'onglet. Une boîte de dialogue de confirmation s'affichera.
        </div>

        <SyTabs
          :items="args.items"
          :confirmTabChange="true"
          @confirm-tab-change="showConfirmDialog"
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
    <div class="mb-4 pa-2 bg-warning-light">
      <strong>Note :</strong> Essayez de changer d'onglet. Une boîte de dialogue de confirmation s'affichera.
    </div>
      <SyTabs 
      :items="items" 
      :confirmTabChange="true"
      @confirm-tab-change="showConfirmDialog"
    />
  </div>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup>
import { ref } from 'vue'

const items = [
  { label: 'Onglet 1', value: 'tab1', content: "Contenu de l'onglet 1" },
  { label: 'Onglet 2', value: 'tab2', content: "Contenu de l'onglet 2" },
  { label: 'Onglet 3', value: 'tab3', content: "Contenu de l'onglet 3" }
]

// Fonction pour afficher une boîte de dialogue de confirmation
function showConfirmDialog(message, callback) {
  // Dans un cas réel, vous afficheriez une boîte de dialogue personnalisée
  // Ici nous utilisons window.confirm pour la démonstration
  const confirmed = window.confirm("Voulez-vous vraiment changer d'onglet ?")
  // Appelons le callback avec le résultat de la confirmation
  callback(confirmed)
}
</script>
`,
			},
		],
	},
}
