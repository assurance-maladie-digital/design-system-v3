import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproTransmission from './AmeliproTransmission.vue'

const meta = {
	argTypes: {
		'actions': { description: 'Pour remplacer les boutons inclus par défaut dans le composant`' },
		'alternateButtonLabel': { description: 'Label du bouton alternatif' },
		'click:confirm': { description: 'Événement émis au clic sur le bouton confirmer', type: 'void' },
		'click:modify': { description: 'Événement émis au clic sur le bouton modifier', type: 'void' },
		'click:print': { description: 'Événement émis au clic sur le bouton imprimer', type: 'void' },
		'confirmButtonLabel': { description: 'Label du bouton de confirmation' },
		'confirmHref': { description: 'Url du bouton confirmer' },
		'confirmTo': { description: 'Route du bouton confirmer' },
		'default': { description: 'Slot par défaut qui permet de mettre du contenu dans le composant' },
		'modifyHref': { description: 'Url du bouton modifier' },
		'modifyTo': { description: 'Route du bouton modifier' },
		'printHref': { description: 'Url du bouton imprimer' },
		'printTo': { description: 'Route du bouton imprimer' },
		'transmissionActions': { description: 'Activation des boutons d’actions se désactive automatiquement si on rempli le slot actions' },
		'transmissionCardTitle': { description: 'Titre de la card' },
		'uniqueId': { description: 'Identifiant unique du composant' },
	},
	component: AmeliproTransmission,
	title: 'Composants/Amelipro/Cartes/AmeliproTransmission',
} as Meta<typeof AmeliproTransmission>
export default meta

type Story = StoryObj<typeof AmeliproTransmission>

export const Default: Story = {
	args: { transmissionCardTitle: 'Titre de la carte' },
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproTransmission
		transmission-card-title="Titre de la carte"
	>
		Contenu principal
	</AmeliproTransmission>
</template>
				`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
	import { AmeliproTransmission } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTransmission },
		setup() {
			return { args }
		},
		template: `
<AmeliproTransmission
	v-bind="args"
>
	Contenu principal
</AmeliproTransmission>
		`,
	}),

}

// --- Carte avec actions personnalisées via le slot ---
export const ActionsPersonnalisees: Story = {
	name: 'Actions personnalisées',
	args: {
		transmissionCardTitle: 'Carte avec actions personnalisées',
		uniqueId: 'transmission-actions-slot',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Les actions sont personnalisées grâce au slot <code>actions</code>.</p>
  <AmeliproTransmission
    transmission-card-title="Carte avec actions personnalisées"
    unique-id="transmission-actions-slot"
  >
    <template #actions>
      <button type="button" class="mr-2">Action 1</button>
      <button type="button">Action 2</button>
    </template>
    <template #default>
      Contenu principal
    </template>
  </AmeliproTransmission>
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTransmission },
		setup() { return { args } },
		template: `
<p class="mb-2">Les actions sont personnalisées grâce au slot <code>actions</code>.</p>
<AmeliproTransmission v-bind="args">
  <template #actions>
    <button type="button" class="mr-2">Action 1</button>
    <button type="button">Action 2</button>
  </template>
  <template #default>
    Contenu principal
  </template>
</AmeliproTransmission>
`,
	}),
}

// --- Carte avec navigation sur le bouton de confirmation ---
export const BoutonConfirmerNavigation: Story = {
	name: 'Bouton confirmer avec navigation',
	args: {
		transmissionCardTitle: 'Carte avec navigation',
		confirmButtonLabel: 'Confirmer',
		confirmHref: 'https://espacepro.ameli.fr',
		uniqueId: 'transmission-confirm-href',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le bouton <code>Confirmer</code> redirige vers une URL grâce à la prop <code>confirmHref</code>.</p>
  <AmeliproTransmission
    transmission-card-title="Carte avec navigation"
    confirm-button-label="Confirmer"
    confirm-href="https://espacepro.ameli.fr"
    unique-id="transmission-confirm-href"
  >
    Contenu principal
  </AmeliproTransmission>
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTransmission },
		setup() { return { args } },
		template: `
<p class="mb-2">Le bouton <code>Confirmer</code> redirige vers une URL grâce à la prop <code>confirmHref</code>.</p>
<AmeliproTransmission v-bind="args">
  Contenu principal
</AmeliproTransmission>
`,
	}),
}

// --- Carte avec label personnalisé pour le bouton alternatif ---
export const LabelBoutonAlternatif: Story = {
	name: 'Label bouton alternatif',
	args: {
		transmissionCardTitle: 'Carte avec bouton alternatif',
		alternateButtonLabel: 'Annuler',
		uniqueId: 'transmission-alternate-label',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le label du bouton alternatif est personnalisé grâce à la prop <code>alternateButtonLabel</code>.</p>
  <AmeliproTransmission
    transmission-card-title="Carte avec bouton alternatif"
    alternate-button-label="Annuler"
    unique-id="transmission-alternate-label"
  >
    Contenu principal
  </AmeliproTransmission>
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTransmission },
		setup() { return { args } },
		template: `
<p class="mb-2">Le label du bouton alternatif est personnalisé grâce à la prop <code>alternateButtonLabel</code>.</p>
<AmeliproTransmission v-bind="args">
  Contenu principal
</AmeliproTransmission>
`,
	}),
}

// --- Carte avec désactivation des actions automatiques ---
export const SansActionsAutomatiques: Story = {
	name: 'Sans actions automatiques',
	args: {
		transmissionCardTitle: 'Carte sans actions automatiques',
		transmissionActions: false,
		uniqueId: 'transmission-no-actions',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Les boutons d’actions par défaut sont désactivés grâce à la prop <code>transmissionActions</code> à <code>false</code>.</p>
  <AmeliproTransmission
    transmission-card-title="Carte sans actions automatiques"
    :transmission-actions="false"
    unique-id="transmission-no-actions"
  >
    Contenu principal
  </AmeliproTransmission>
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTransmission },
		setup() { return { args } },
		template: `
<p class="mb-2">Les boutons d’actions par défaut sont désactivés grâce à la prop <code>transmissionActions</code> à <code>false</code>.</p>
<AmeliproTransmission v-bind="args">
  Contenu principal
</AmeliproTransmission>
`,
	}),
}
