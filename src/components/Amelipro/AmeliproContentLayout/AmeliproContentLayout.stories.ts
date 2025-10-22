import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproContentLayout from './AmeliproContentLayout.vue'

const meta = {
	argTypes: {
		bgColor: { description: 'Couleur de fond du contenu' },
		default: { description: 'Slot par défaut' },
		uniqueId: { description: 'Identifiant unique du composant' },
	},
	component: AmeliproContentLayout,
	title: 'Composants/Amelipro/Mise en page/AmeliproContentLayout',
} as Meta<typeof AmeliproContentLayout>
export default meta

type Story = StoryObj<typeof AmeliproContentLayout>

export const Default: Story = {
	args: { default: 'Mon contenu test' },
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproContentLayout />
</template>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproContentLayout },
		setup() {
			return { args }
		},
		template: `
<AmeliproContentLayout
	v-bind="args"
>
	{{ args.default }}
</AmeliproContentLayout>
		`,
	}),

}

// --- Mise en page avec couleur de fond personnalisée ---
export const AvecCouleurFond: Story = {
	name: 'Avec couleur de fond',
	args: {
		bgColor: '#e3f2fd',
		default: 'Contenu avec fond personnalisé',
		uniqueId: 'amelipro-content-layout-bg',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <AmeliproContentLayout
    bg-color="#e3f2fd"
    unique-id="amelipro-content-layout-bg"
  >
    Contenu avec fond personnalisé
  </AmeliproContentLayout>
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproContentLayout },
		setup() { return { args } },
		template: `
<p class="mb-2">Affichage d’un contenu avec une couleur de fond personnalisée grâce à la prop <code>bgColor</code>.</p>
<AmeliproContentLayout v-bind="args">
  {{ args.default }}
</AmeliproContentLayout>
`,
	}),
}

// --- Mise en page avec contenu HTML complexe ---
export const ContenuHtmlComplexe: Story = {
	name: 'Contenu HTML complexe',
	args: {
		bgColor: '#fff',
		uniqueId: 'amelipro-content-layout-html',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <AmeliproContentLayout
    bg-color="#fff"
    unique-id="amelipro-content-layout-html"
  >
    <h2>Un titre</h2>
    <ul>
      <li>Élément 1</li>
      <li>Élément 2</li>
    </ul>
    <p>Un paragraphe de texte.</p>
  </AmeliproContentLayout>
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproContentLayout },
		setup() { return { args } },
		template: `
<p class="mb-2">Affichage d’un contenu HTML complexe dans le slot par défaut.</p>
<AmeliproContentLayout v-bind="args">
  <h2>Un titre</h2>
  <ul>
    <li>Élément 1</li>
    <li>Élément 2</li>
  </ul>
  <p>Un paragraphe de texte.</p>
</AmeliproContentLayout>
`,
	}),
}
