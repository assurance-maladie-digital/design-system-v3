import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Accordion from './Accordion.vue'
import { SyIcon } from '@/components'
import SyCheckbox from '@/components/Customs/SyCheckbox/SyCheckbox.vue'
import { mdiCloseCircleOutline } from '@mdi/js'
import { VBtn } from 'vuetify/components'
import {
	VStepper,
	VStepperHeader,
	VStepperItem,
	VStepperWindow,
	VStepperWindowItem,
} from 'vuetify/components'
import { computed, reactive, ref } from 'vue'

const meta: Meta<typeof Accordion> = {
	title: 'Composants/Données/Accordion',
	component: Accordion,
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		items: {
			control: { type: 'object' },
			description: 'Liste des éléments de l\'accordéon',
		},
		headingLevel: {
			control: { type: 'number', min: 1, max: 6 },
			description: 'Niveau de titre pour les boutons de dévoilement',
		},
		groupId: {
			control: { type: 'text' },
			description: 'Identifiant de groupe pour synchroniser le focus entre plusieurs accordions',
		},
		iconPosition: {
			control: { type: 'select' },
			options: ['left', 'right'],
			description: 'Position de l\'icône de flèche (gauche ou droite)',
			table: {
				type: { summary: '\'left\' | \'right\'' },
				defaultValue: { summary: 'left' },
			},
		},
		compact: {
			control: { type: 'boolean' },
			description: 'Active le mode compact (sans espacement entre les éléments)',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		modelValue: {
			control: 'object',
			description: 'Liste des identifiants des éléments ouverts (v-model)',
			table: {
				type: { summary: 'string[]' },
				category: 'props',
				defaultValue: { summary: '[]' },
			},
		},
	},
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				language: 'vue',
				code: `<template>
  <Accordion
    :items="[
      { id: 'item1', title: 'Section 1', content: 'Contenu de la section 1' },
      { id: 'item2', title: 'Section 2', content: 'Contenu de la section 2' }
    ]"
    :heading-level="3"
  />
</template>`,
			},
		],
	},
	args: {
		items: [
			{ id: 'default-story-item1', title: 'Section 1', content: 'Contenu de la section 1' },
			{ id: 'default-story-item2', title: 'Section 2', content: 'Contenu de la section 2' },
		],
		headingLevel: 3,
	},
	render: args => ({
		components: { Accordion },
		setup() {
			return { args }
		},
		template: `
            <div class="pa-4">
                <Accordion v-bind="args" groupId="default-story" />
            </div>
        `,
	}),
}

export const IconPosition: Story = {
	parameters: {
		sourceCode: [
			{
				language: 'vue',
				name: 'Template',
				code: `<template>
  <!-- Icône à droite -->
  <Accordion
    :items="[
      { id: 'right-item1', title: 'Section 1', content: 'Contenu de la section 1' },
      { id: 'right-item2', title: 'Section 2', content: 'Contenu de la section 2' }
    ]"
    icon-position="right"
  />
</template>`,
			},
		],
	},
	args: {
		items: [
			{ id: 'iconposition-story-right-1', title: 'Section 1', content: 'Contenu de la section 1' },
			{ id: 'iconposition-story-right-2', title: 'Section 2', content: 'Contenu de la section 2' },
		],
		headingLevel: 3,
		iconPosition: 'right',
	},
	render: args => ({
		components: { Accordion },
		setup() {
			return { args }
		},
		template: `
            <div class="pa-4"> 
                <h3>Icône à droite</h3>
                <p class="mb-4">L'icône de flèche est positionnée à droite du titre</p>
                <Accordion 
                    v-bind="args"
                    groupId="iconposition-story"
                />
            </div>
        `,
	}),
}

export const CompactMode: Story = {
	parameters: {
		sourceCode: [
			{
				language: 'vue',
				name: 'Template',
				code: `<template>
  <!-- Mode compact sans espacement -->
  <Accordion
    :items="[
      { id: 'compact-item1', title: 'Section 1', content: 'Contenu de la section 1' },
      { id: 'compact-item2', title: 'Section 2', content: 'Contenu de la section 2' },
      { id: 'compact-item3', title: 'Section 3', content: 'Contenu de la section 3' }
    ]"
    compact
  />
</template>`,
			},
		],
	},
	args: {
		items: [
			{ id: 'compact-story-1', title: 'Section 1', content: 'Contenu de la section 1' },
			{ id: 'compact-story-2', title: 'Section 2', content: 'Contenu de la section 2' },
			{ id: 'compact-story-3', title: 'Section 3', content: 'Contenu de la section 3' },
		],
		headingLevel: 3,
		compact: true,
	},
	render: args => ({
		components: { Accordion },
		setup() {
			return { args }
		},
		template: `
            <div class="pa-4">
                <h3>Mode compact (sans espacement)</h3>
                <p class="mb-4">Les éléments sont collés les uns aux autres pour un rendu plus intégré</p>
                <Accordion 
                    v-bind="args" 
                    groupId="compact-story"
                />
            </div>
        `,
	}),
}

export const WithObjectContent: Story = {
	parameters: {
		sourceCode: [
			{
				language: 'vue',
				code: `<template>
  <Accordion
    :items="[
      {
        id: 'item',
        title: 'Section',
        content: { 
          title: 'Sous-titre de la section', 
          content: 'Contenu détaillé de la section' 
        }
      }
    ]"
    :heading-level="3"
  />
</template>`,
			},
		],
	},
	args: {
		items: [
			{
				id: 'withobject-story-item',
				title: 'Section',
				content: {
					title: 'Sous-titre de la section',
					content: 'Contenu détaillé de la section',
				},
			},
		],
		headingLevel: 3,
	},
	render: args => ({
		components: { Accordion },
		setup() {
			return { args }
		},
		template: `
            <div class="pa-4">
                <Accordion v-bind="args" groupId="withobject-story" />
            </div>
        `,
	}),
}

export const CustomColors: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				language: 'vue',
				name: 'Template',
				code: `<template>
  <Accordion
    :items="[
      { id: 'item1', title: 'Couleurs par défaut', content: 'Utilise les couleurs définies dans config.ts' },
    ]"
  />
  <Accordion
    :items="[
      { id: 'item2', title: 'Couleurs personnalisées', content: 'Utilise des couleurs personnalisées via les props' },
    ]"
    :vuetify-options="{
      accordion: {
        titleColor: 'error',
        hoverColor: 'warning',
        focusColor: 'secondary',
        activeColor: 'success',
        backgroundColor: 'grey-lighten-3'
      }
    }"
  />
</template>`,
			},
		],
	},
	args: {
		items: [
			{ id: 'customcolors-story-default', title: 'Couleurs par défaut', content: 'Utilise les couleurs définies dans config.ts' },
		],
	},
	render: args => ({
		components: { Accordion },
		setup() {
			const customItems = [
				{ id: 'customcolors-story-custom', title: 'Couleurs personnalisées', content: 'Utilise des couleurs personnalisées via les props' },
			]
			return { args, customItems }
		},
		template: `
            <div class="pa-4">
                <h3>Couleurs par défaut</h3>
                <p class="mb-4">Cet accordéon utilise les couleurs définies dans le fichier config.ts</p>
                <Accordion v-bind="args" groupId="customcolors-story-default" />
                
                <h3 class="mt-8">Couleurs personnalisées</h3>
                <p class="mb-4">Cet accordéon utilise des couleurs personnalisées via les props</p>
                <Accordion 
                    :items="customItems"
                    groupId="customcolors-story-custom" 
                    :vuetify-options="{
                        accordion: {
                            titleColor: 'error',
                            hoverColor: 'warning',
                            focusColor: 'secondary',
                            activeColor: 'success',
                            backgroundColor: 'grey-lighten-3'
                        }
                    }"
                />
                
                <div class="mt-8">
                    <h3>Guide des couleurs</h3>
                    <ul class="mt-2 ml-4">
                        <li><strong>titleColor</strong> : Couleur du titre quand l'accordéon est fermé</li>
                        <li><strong>hoverColor</strong> : Couleur utilisée au survol</li>
                        <li><strong>focusColor</strong> : Couleur utilisée pour le focus (bordure)</li>
                        <li><strong>activeColor</strong> : Couleur du titre quand l'accordéon est ouvert</li>
                        <li><strong>backgroundColor</strong> : Couleur de fond de l'accordéon</li>
                    </ul>
                </div>
            </div>
        `,
	}),
}

export const CustomHeadingLevel: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				language: 'vue',
				name: 'Template',
				code: `<template>
  <Accordion
    :items="[{ id: 'item1', title: 'Section 1', content: 'Contenu' }]"
    :heading-level="1"
  />
  <Accordion
    :items="[{ id: 'item2', title: 'Section 1', content: 'Contenu' }]"
    :heading-level="2"
  />
  <!-- ... jusqu'à heading-level 6 -->
</template>`,
			},
		],
	},
	args: {
		items: [
			{ id: 'heading-story-item', title: 'Section 1', content: 'Contenu de la section 1' },
		],
	},
	render: args => ({
		components: { Accordion },
		setup() {
			return { args }
		},
		template: `
            <div class="pa-4">
                <Accordion :items="[{ id: 'heading-story-h1', title: 'Heading 1', content: 'Contenu' }]" headingLevel="1" groupId="heading-story-1" />
                <Accordion :items="[{ id: 'heading-story-h2', title: 'Heading 2', content: 'Contenu' }]" headingLevel="2" groupId="heading-story-2" />
                <Accordion :items="[{ id: 'heading-story-h3', title: 'Heading 3', content: 'Contenu' }]" headingLevel="3" groupId="heading-story-3" />
                <Accordion :items="[{ id: 'heading-story-h4', title: 'Heading 4', content: 'Contenu' }]" headingLevel="4" groupId="heading-story-4" />
                <Accordion :items="[{ id: 'heading-story-h5', title: 'Heading 5', content: 'Contenu' }]" headingLevel="5" groupId="heading-story-5" />
                <Accordion :items="[{ id: 'heading-story-h6', title: 'Heading 6', content: 'Contenu' }]" headingLevel="6" groupId="heading-story-6" />
            </div>
        `,
	}),
}

export const WithSlots: Story = {
	parameters: {
		sourceCode: [
			{
				language: 'vue',
				name: 'Template',
				code: `<template>
  <Accordion
    :items="[
      { id: 'item1', title: 'Section 1', content: 'Contenu de la section 1' },
      { id: 'item2', title: 'Section 2', content: 'Contenu de la section 2' }
    ]"
  >
    <template #title="{ item }">
      <span style="font-weight: 700;">{{ item.title }}</span>
    </template>

    <template #right-content>
      <span style="font-size: 12px; opacity: 0.7;">Right content</span>
    </template>

    <template #content="{ item }">
      <div style="padding: 8px 0;">
        <p style="margin: 0;">Contenu custom :</p>
        <p style="margin: 0; font-weight: 600;">{{ typeof item.content === 'string' ? item.content : item.content.content }}</p>
      </div>
    </template>
  </Accordion>
</template>`,
			},
		],
	},
	args: {
		items: [
			{ id: 'withslots-story-item1', title: 'Section 1', content: 'Contenu de la section 1' },
			{ id: 'withslots-story-item2', title: 'Section 2', content: 'Contenu de la section 2' },
		],
		headingLevel: 3,
	},
	render: args => ({
		components: { Accordion },
		setup() {
			return { args }
		},
		template: `
            <div class="pa-4">
                <Accordion v-bind="args" groupId="withslots-story">
                    <template #title="{ item }">
                        <span style="font-weight: 700;">{{ item.title }}</span>
                    </template>

                    <template #right-content>
                        <span style="font-size: 12px; opacity: 0.7;">Right content</span>
                    </template>

                    <template #content="{ item }">
                        <div style="padding: 8px 0;">
                            <p style="margin: 0;">Contenu custom :</p>
                            <p style="margin: 0; font-weight: 600;">{{ typeof item.content === 'string' ? item.content : item.content.content }}</p>
                        </div>
                    </template>
                </Accordion>
            </div>
        `,
	}),
}

export const WithVModel: Story = {
	parameters: {
		sourceCode: [
			{
				language: 'vue',
				name: 'Template',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { Accordion } from '@cnamts/synapse'

  const openItems = ref<string[]>([])

  const items = [
    { id: 'item1', title: 'Section 1', content: 'Contenu de la section 1' },
    { id: 'item2', title: 'Section 2', content: 'Contenu de la section 2' },
    { id: 'item3', title: 'Section 3', content: 'Contenu de la section 3' },
  ]

  function openAll() {
    openItems.value = items.map(i => i.id)
  }

  function closeAll() {
    openItems.value = []
  }
</script>

<template>
  <Accordion
    v-model="openItems"
    :items="items"
    :heading-level="3"
  />

  <p>Éléments ouverts : {{ openItems }}</p>

  <VBtn variant="outlined" color="primary" @click="openAll">Tout ouvrir</VBtn>
  <VBtn variant="outlined" color="primary" @click="closeAll">Tout fermer</VBtn>
</template>`,
			},
		],
	},
	args: {
		items: [
			{ id: 'withvmodel-story-item1', title: 'Section 1', content: 'Contenu de la section 1' },
			{ id: 'withvmodel-story-item2', title: 'Section 2', content: 'Contenu de la section 2' },
			{ id: 'withvmodel-story-item3', title: 'Section 3', content: 'Contenu de la section 3' },
		],
		headingLevel: 3,
	},
	render: args => ({
		components: { Accordion, VBtn },
		setup() {
			const openItems = ref<string[]>([])

			const openAll = () => {
				openItems.value = (args.items ?? []).map((i: { id: string }) => i.id)
			}

			const closeAll = () => {
				openItems.value = []
			}

			return { args, openItems, openAll, closeAll }
		},
		template: `
            <div class="pa-4">
                <Accordion v-bind="args" v-model="openItems" groupId="withvmodel-story" />

                <div class="mt-4" style="font-family: monospace; color: #666;">
                    Éléments ouverts : {{ openItems }}
                </div>

                <div class="mt-2 d-flex ga-2">
                    <VBtn variant="outlined" color="primary" @click="openAll">Tout ouvrir</VBtn>
                    <VBtn variant="outlined" color="primary" @click="closeAll">Tout fermer</VBtn>
                </div>
            </div>
        `,
	}),
}

export const PreOpened: Story = {
	parameters: {
		sourceCode: [
			{
				language: 'vue',
				name: 'Template',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { Accordion } from '@cnamts/synapse'

  // Pré-ouvrir la section 2
  const openItems = ref<string[]>(['item2'])
</script>

<template>
  <Accordion
    v-model="openItems"
    :items="[
      { id: 'item1', title: 'Section 1', content: 'Contenu de la section 1' },
      { id: 'item2', title: 'Section 2', content: 'Contenu de la section 2' },
      { id: 'item3', title: 'Section 3', content: 'Contenu de la section 3' },
    ]"
    :heading-level="3"
  />
</template>`,
			},
		],
	},
	args: {
		items: [
			{ id: 'preopened-story-item1', title: 'Section 1', content: 'Contenu de la section 1' },
			{ id: 'preopened-story-item2', title: 'Section 2', content: 'Contenu de la section 2' },
			{ id: 'preopened-story-item3', title: 'Section 3', content: 'Contenu de la section 3' },
		],
		headingLevel: 3,
	},
	render: args => ({
		components: { Accordion },
		setup() {
			const openItems = ref<string[]>(['preopened-story-item2'])
			return { args, openItems }
		},
		template: `
            <div class="pa-4">
                <Accordion v-bind="args" v-model="openItems" groupId="preopened-story" />

                <div class="mt-4" style="font-family: monospace; color: #666;">
                    Éléments ouverts : {{ openItems }}
                </div>
            </div>
        `,
	}),
}

export const WithCustomContent: Story = {
	parameters: {
		sourceCode: [
			{
				language: 'vue',
				code: `<template>
  <Accordion
    :items="[
      { id: 'item1', title: 'Section 1', content: 'Contenu de la section 1' },
    ]"
    :heading-level="3"
  >
    <template #right-content>
      <SyIcon v-if="hasError" :icon="mdiCloseCircleOutline" color="error" />
    </template>
    <template #content>
      <VStepper v-model="step">
        <!-- Contenu du stepper -->
      </VStepper>
    </template>
  </Accordion>
</template>`,
			},
		],
	},
	args: {
		items: [
			{ id: 'withcustom-story-item', title: 'Section 1', content: 'Contenu de la section 1' },
		],
		headingLevel: 3,
	},
	render: args => ({
		components: {
			Accordion,
			VStepper,
			VStepperHeader,
			VStepperItem,
			VStepperWindow,
			VStepperWindowItem,
			SyCheckbox,
			SyIcon,
		},
		setup() {
			const steps = reactive([
				{ id: 1, error: false, complete: true, editable: true },
				{ id: 2, error: true, complete: false, editable: true },
				{ id: 3, error: false, complete: false, editable: true },
			])
			const step = ref(2)

			const close = mdiCloseCircleOutline

			const hasError = computed(() =>
				steps.some(s => s.error),
			)
			return { args, step, close, steps, hasError }
		},
		template: `
            <div class="pa-4">
                <Accordion v-bind="args" groupId="withcustom-story">
                  <template #right-content>
                    <SyIcon
                        v-if="hasError"
                        :icon="close"
                        color="rgb(var(--v-theme-error))"
                    />
                  </template>
                  <template #content="{ item }">
                    <VStepper v-model="step">
                      <template #default="{ prev, next }">
                        <VStepperHeader>
                          <VStepperItem
                              v-for="stepItem in steps"
                              :key="stepItem.id"
                              :value="stepItem.id"
                              :error="stepItem.error"
                              :editable="stepItem.editable"
                              :complete="stepItem.complete"
                              :title="'Étape ' + stepItem.id"                        
                              />
                        </VStepperHeader>

                        <VStepperWindow>
                          <VStepperWindowItem
                              v-for="(step) in steps"
                              :key="step.id"
                              :value="step.id"
                          >
                            <div style="padding: 24px;">
                              <h3>Contenu de l'étape {{ step.id }}</h3>

                              <SyCheckbox
                                  v-model="step.error"
                                  label="Cochez pour obtenir une erreur"
                              />

                              <p v-if="step.error" style="color: rgb(var(--v-theme-error));">
                                Cette étape contient des erreurs.
                              </p>

                              <p v-else-if="step.complete">
                                Cette étape est complétée.
                              </p>

                              <p v-else>
                                Ceci est le contenu de l'étape {{ step.id }}.
                              </p>
                            </div>
                          </VStepperWindowItem>
                        </VStepperWindow>
                      </template>
                    </VStepper>
                  </template>
                </Accordion>
            </div>
        `,
	}),
}
