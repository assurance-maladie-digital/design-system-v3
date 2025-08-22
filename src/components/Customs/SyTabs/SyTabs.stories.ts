import type { Meta, StoryObj } from '@storybook/vue3'

import SyTabs from './SyTabs.vue'
import { ref } from 'vue'

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
	argTypes: {
		items: {
			description: 'Liste des éléments à afficher dans les onglets',
			control: 'object',
		},
		modelValue: {
			description: 'Index ou valeur de l\'onglet actuellement sélectionné (utilisé avec v-model)',
			control: 'text',
		},
		// Les événements sont gérés différemment dans Storybook Vue 3
		// Les slots ne peuvent pas être définis directement dans argTypes
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
 * Exemple avec slots personnalisés pour le contenu des onglets.
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
            <h3 class="text-h6 font-weight-bold">Contenu personnalisé pour l'onglet 2</h3>
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
            <h3 class="text-h6 font-weight-bold">Contenu personnalisé pour l'onglet 2</h3>
            <p>Ce panneau utilise un style différent.</p>
          </div>
        </template>
      </SyTabs>
      `,
			},
			{
				name: 'Script',
				code: `

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
 * Exemple démontrant la fonctionnalité de validation d'URL.
 * Cette story simule un scénario où la validation d'URL est activée pour vérifier
 * si l'onglet sélectionné correspond à l'URL actuelle avant de permettre le changement d'onglet.
 */
export const WithUrlValidation: Story = {
	render: () => ({
		components: { SyTabs },
		setup() {
			const activeTab = ref('tab1')
			const currentUrl = ref('/page1')
			const tabItems = [
				{ label: 'Page 1', value: 'tab1', content: 'Contenu de la page 1' },
				{ label: 'Page 2', value: 'tab2', content: 'Contenu de la page 2' },
				{ label: 'Page 3', value: 'tab3', content: 'Contenu de la page 3' },
			]

			const messages = ref([
				{ type: 'info', text: 'Démonstration de la validation d\'URL avec les onglets.' },
			])

			// Simulateur d'URL pour la démonstration
			const urlValidator = {
				validateUrl: (tabValue: string | number) => {
					// Correspondance entre les valeurs d'onglet et les URLs simulées
					const urlMap: Record<string, string> = {
						tab1: '/page1',
						tab2: '/page2',
						tab3: '/page3',
					}

					// Vérifier si l'URL actuelle correspond à l'onglet
					const tabUrl = urlMap[String(tabValue)] || ''
					return tabUrl === currentUrl.value
				},
			}

			// Simulation de changement d'URL
			function changeUrl(url: string) {
				currentUrl.value = url

				// Mettre à jour l'onglet actif en fonction de l'URL
				const urlMap: Record<string, string> = {
					'/page1': 'tab1',
					'/page2': 'tab2',
					'/page3': 'tab3',
				}

				activeTab.value = urlMap[url] || 'tab1'

				messages.value.push({
					type: 'success',
					text: `URL changée pour: ${url}`,
				})
			}

			function handleTabChangeAttempt(newValue: string) {
				// Utiliser la même validation que dans le composant
				const isValid = urlValidator.validateUrl(newValue)

				if (isValid) {
					activeTab.value = newValue
					messages.value.push({
						type: 'success',
						text: `Onglet changé pour: ${newValue}`,
					})
				}
				else {
					messages.value.push({
						type: 'error',
						text: `⚠️ Changement d"onglet bloqué: l"URL actuelle (${currentUrl.value}) ne correspond pas à l"onglet ${newValue}`,
					})
				}
			}

			function handleTabCanceled(value: string) {
				messages.value.push({
					type: 'warning',
					text: `Changement d"onglet annulé pour: ${value}`,
				})
			}

			return {
				activeTab,
				tabItems,
				urlValidator,
				currentUrl,
				changeUrl,
				messages,
				handleTabCanceled,
				handleTabChangeAttempt,
			}
		},
		template: `
      <div class="demo-container">
        <div class="url-bar mb-4 p-2 border rounded">
          <strong>URL actuelle:</strong> {{ currentUrl }}
          <div class="mt-2 d-flex gap-2">
            <button 
              class="px-3 py-1 rounded" 
              :class="currentUrl === '/page1' ? 'bg-primary text-white' : 'bg-grey-lighten-3'" 
              @click="changeUrl('/page1')">Page 1</button>
            <button 
              class="px-3 py-1 rounded" 
              :class="currentUrl === '/page2' ? 'bg-primary text-white' : 'bg-grey-lighten-3'" 
              @click="changeUrl('/page2')">Page 2</button>
            <button 
              class="px-3 py-1 rounded" 
              :class="currentUrl === '/page3' ? 'bg-primary text-white' : 'bg-grey-lighten-3'" 
              @click="changeUrl('/page3')">Page 3</button>
          </div>
        </div>
        
        <div class="demo-tabs mb-4">
          <h4>Navigation par onglets (avec vérification d'URL)</h4>
          <p>Essayez de changer d'onglet sans changer d'URL pour voir l'effet de la validation.</p>
          <SyTabs 
            v-model="activeTab" 
            :items="tabItems" 
            :url-validator="urlValidator" 
            :sync-with-url="true"
            @tab-change-canceled="handleTabCanceled"
            @update:model-value="handleTabChangeAttempt"
          />
        </div>
        
        <div class="log-container p-3 border rounded bg-grey-lighten-4" style="max-height: 200px; overflow-y: auto;">
          <h4>Journal des événements:</h4>
          <div 
            v-for="(msg, index) in messages" 
            :key="index" 
            class="log-entry py-1 px-2 my-1 rounded" 
            :class="{
              'bg-success-lighten-4': msg.type === 'success',
              'bg-error-lighten-4': msg.type === 'error',
              'bg-warning-lighten-4': msg.type === 'warning',
              'bg-info-lighten-4': msg.type === 'info'
            }">
            {{ msg.text }}
          </div>
        </div>
      </div>
    `,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <div class="demo-container">
    <div class="url-bar mb-4 p-2 border rounded">
      <strong>URL actuelle:</strong> {{ currentUrl }}
      <div class="mt-2 d-flex gap-2">
        <button 
          class="px-3 py-1 rounded" 
          :class="currentUrl === '/page1' ? 'bg-primary text-white' : 'bg-grey-lighten-3'" 
          @click="changeUrl('/page1')">Page 1</button>
        <button 
          class="px-3 py-1 rounded" 
          :class="currentUrl === '/page2' ? 'bg-primary text-white' : 'bg-grey-lighten-3'" 
          @click="changeUrl('/page2')">Page 2</button>
        <button 
          class="px-3 py-1 rounded" 
          :class="currentUrl === '/page3' ? 'bg-primary text-white' : 'bg-grey-lighten-3'" 
          @click="changeUrl('/page3')">Page 3</button>
      </div>
    </div>
    
    <div class="demo-tabs mb-4">
      <h4>Navigation par onglets (avec vérification d'URL)</h4>
      <p>Essayez de changer d'onglet sans changer d'URL pour voir l'effet de la validation.</p>
      <SyTabs 
        v-model="activeTab" 
        :items="tabItems" 
        :url-validator="urlValidator" 
        :sync-with-url="true"
        @tab-change-canceled="handleTabCanceled"
        @update:model-value="handleTabChangeAttempt"
      />
    </div>
    
    <div class="log-container p-3 border rounded bg-grey-lighten-4" style="max-height: 200px; overflow-y: auto;">
      <h4>Journal des événements:</h4>
      <div 
        v-for="(msg, index) in messages" 
        :key="index" 
        class="log-entry py-1 px-2 my-1 rounded" 
        :class="{
          'bg-success-lighten-4': msg.type === 'success',
          'bg-error-lighten-4': msg.type === 'error',
          'bg-warning-lighten-4': msg.type === 'warning',
          'bg-info-lighten-4': msg.type === 'info'
        }">
        {{ msg.text }}
      </div>
    </div>
  </div>
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup>
import { ref } from 'vue'

const activeTab = ref('tab1')
const currentUrl = ref('/page1')
const tabItems = [
  { label: 'Page 1', value: 'tab1', content: 'Contenu de la page 1' },
  { label: 'Page 2', value: 'tab2', content: 'Contenu de la page 2' },
  { label: 'Page 3', value: 'tab3', content: 'Contenu de la page 3' },
]

const messages = ref([
  { type: 'info', text: "Démonstration de la validation d'URL avec les onglets." }
])

// Simulateur d'URL pour la démonstration
const urlValidator = {
  validateUrl: (tabValue) => {
    // Correspondance entre les valeurs d'onglet et les URLs simulées
    const urlMap = {
      tab1: '/page1',
      tab2: '/page2',
      tab3: '/page3',
    }
    
    // Vérifier si l'URL actuelle correspond à l'onglet
    const tabUrl = urlMap[String(tabValue)] || ''
    return tabUrl === currentUrl.value
  }
}

// Simulation de changement d'URL
function changeUrl(url) {
  currentUrl.value = url
  
  // Mettre à jour l'onglet actif en fonction de l'URL
  const urlMap = {
    '/page1': 'tab1',
    '/page2': 'tab2',
    '/page3': 'tab3',
  }
  
  activeTab.value = urlMap[url] || 'tab1'
  
  messages.value.push({
    type: 'success',
    text: 'URL changée pour: ' + url
  })
}

function handleTabChangeAttempt(newValue) {
  // Utiliser la même validation que dans le composant
  const isValid = urlValidator.validateUrl(newValue)
  
  if (isValid) {
    activeTab.value = newValue
    messages.value.push({
      type: 'success',
      text: 'Onglet changé pour: ' + newValue
    })
  }
  else {
    messages.value.push({
      type: 'error',
      text: "⚠️ Changement d'onglet bloqué: l'URL actuelle (" + currentUrl.value + ") ne correspond pas à l'onglet " + newValue
    })
  }
}

function handleTabCanceled(value) {
  messages.value.push({
    type: 'warning',
    text: "Changement d'onglet annulé pour: " + value
  })
}
</script>`,
			},
		],
	},
}
