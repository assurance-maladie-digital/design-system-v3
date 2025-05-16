import type { Meta, StoryObj } from '@storybook/vue3'
import Accordion from './Accordion.vue'

const meta = {
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
			default: 3,
		},
		groupId: {
			control: { type: 'text' },
			description: 'Identifiant de groupe pour synchroniser le focus entre plusieurs accordions',
			default: 'default',
		},
	},
} satisfies Meta<typeof Accordion>

export default meta

type Story = StoryObj<typeof meta>

const defaultItems = [
	{ id: 'item1', title: 'Section 1', content: 'Contenu de la section 1' },
	{ id: 'item2', title: 'Section 2', content: 'Contenu de la section 2' },
	{
		id: 'item3',
		title: 'Section 3',
		content: {
			title: 'Sous-titre de la section 3',
			content: 'Contenu détaillé de la section 3',
		},
	},
]

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
		items: defaultItems.slice(0, 2),
		headingLevel: 3,
	},
	render: args => ({
		components: { Accordion },
		setup() {
			return { args }
		},
		template: `
			<div class="pa-4">
				<Accordion v-bind="args" />
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
        id: 'item3', 
        title: 'Section 3', 
        content: { 
          title: 'Sous-titre de la section 3', 
          content: 'Contenu détaillé de la section 3' 
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
		items: [defaultItems[2]],
		headingLevel: 3,
	},
	render: args => ({
		components: { Accordion },
		setup() {
			return { args }
		},
		template: `
			<div class="pa-4">
				<Accordion v-bind="args" />
			</div>
		`,
	}),
}

export const CustomColors: Story = {
	parameters: {
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
      { id: 'item1', title: 'Couleurs personnalisées', content: 'Utilise des couleurs personnalisées via les props' },
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
			{ id: 'item1', title: 'Couleurs par défaut', content: 'Utilise les couleurs définies dans config.ts' },
		],
	},
	render: args => ({
		components: { Accordion },
		setup() {
			return { args }
		},
		template: `
			<div class="pa-4">
				<h3>Couleurs par défaut</h3>
				<p class="mb-4">Cet accordéon utilise les couleurs définies dans le fichier config.ts</p>
				<Accordion v-bind="args" groupId="custom-colors-story" />
				
				<h3 class="mt-8">Couleurs personnalisées</h3>
				<p class="mb-4">Cet accordéon utilise des couleurs personnalisées via les props</p>
				<Accordion 
					v-bind="args" 
					groupId="custom-colors-story" 
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
		sourceCode: [
			{
				language: 'vue',
				name: 'Template',
				code: `<template>
  <Accordion
    :items="[
      { id: 'item1', title: 'Section 1', content: 'Contenu de la section 1' },
    ]"
    :heading-level="1"
  />
    <Accordion
    :items="[
      { id: 'item1', title: 'Section 1', content: 'Contenu de la section 1' },
    ]"
    :heading-level="2"
  />
    <Accordion
    :items="[
      { id: 'item1', title: 'Section 1', content: 'Contenu de la section 1' },
    ]"
    :heading-level="3"
  />
    <Accordion
    :items="[
      { id: 'item1', title: 'Section 1', content: 'Contenu de la section 1' },
    ]"
    :heading-level="4"
  />
    <Accordion
    :items="[
      { id: 'item1', title: 'Section 1', content: 'Contenu de la section 1' },
    ]"
    :heading-level="5"
  />
    <Accordion
    :items="[
      { id: 'item1', title: 'Section 1', content: 'Contenu de la section 1' },
    ]"
    :heading-level="6"
  />
</template>`,
			},
		],
	},
	args: {
		items: defaultItems.slice(0, 1),
	},
	render: args => ({
		components: { Accordion },
		setup() {
			return { args }
		},
		template: `
			<div class="pa-4">
				<Accordion v-bind="args" headingLevel="1" groupId="custom-heading-story" />
				<Accordion v-bind="args" headingLevel="2" groupId="custom-heading-story" />
				<Accordion v-bind="args" headingLevel="3" groupId="custom-heading-story" />
				<Accordion v-bind="args" headingLevel="4" groupId="custom-heading-story" />
				<Accordion v-bind="args" headingLevel="5" groupId="custom-heading-story" />
				<Accordion v-bind="args" headingLevel="6" groupId="custom-heading-story" />
			</div>
		`,
	}),
}
