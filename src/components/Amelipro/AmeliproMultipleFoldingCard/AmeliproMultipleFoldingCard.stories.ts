import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproMultipleFoldingCard from './AmeliproMultipleFoldingCard.vue'
import type { AmeliproMultipleFoldingCardItem } from './types'

const meta = {
	argTypes: {
		'borderColor': { description: 'Couleur de bordure de la carte' },
		'bordered': { description: 'Permet d’activer ou de désactiver les bordures de la carte' },
		'cardColor': { description: 'Couleur de fond de la carte' },
		'defaultItemOpened': { description: 'Index du bloc ouvert par défaut au chargement du composant' },
		'headerRight': { description: 'le contenu de la partie droite du header' },
		'headerRightWidth': { description: 'Défini la largeur de la partie droite du header de la carte. Cette props est utile seulement si le slot header-right est utilisé' },
		'item': { description: 'Slot généré automatiquement pour tous les blocs dépliants afin d’y insérer le contenu principal du bloc' },
		'item.id': { description: 'Slot généré automatiquement pour chaque bloc dépliant afin d’y insérer le contenu principal du bloc' },
		'manualValidation': { description: 'Active le fonctionnement manuel de la validation des items' },
		'tab-clicked': { description: 'Événement émis au click sur les boutons ouverture/fermeture des cards, renvoie l’id de l’item cliqué' },
		'tabs': {
			description: 'Tableau comprenant la liste des blocs dépliant avec leur identifiant( doit être unique dans la page) et leurs titres',
			table: {
				type: {
					detail: `Array<{
	id: string;
	title: string;
	valid?: boolean;
	error?: boolean;
}>`,
					summary: 'AmeliproMultipleFoldingCardItem[]',
				},
			},
		},
		'title': { description: 'Titre de la carte autour des panneaux dépliants' },
		'titleLevel': { description: 'Niveau de titre des panneaux dépliants' },
		'titleUppercase': { description: 'Transforme le titre de la carte en lettres capitales' },
		'uniqueId': { description: 'identifiant unique du composant' },
	},
	component: AmeliproMultipleFoldingCard,
	title: 'Composants/Amelipro/Cartes/AmeliproMultipleFoldingCard',
} as Meta<typeof AmeliproMultipleFoldingCard>

export default meta

type Story = StoryObj<typeof meta>

const items: AmeliproMultipleFoldingCardItem[] = [
	{
		id: 'amelipro-multiple-folding-card-item-1',
		title: 'Exemple 1',
		valid: true,
	},
	{
		error: true,
		id: 'amelipro-multiple-folding-card-item-2',
		title: 'Exemple 2',
	},
	{
		id: 'amelipro-multiple-folding-card-item-3',
		title: 'Exemple 3',
	},
	{
		id: 'amelipro-multiple-folding-card-item-4',
		title: 'Exemple 4',
	},
]

export const Default: Story = {
	args: {
		tabs: items,
		title: 'Titre de la carte',
		uniqueId: 'amelipro-multiple-folding-card-unique-id',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproMultipleFoldingCard
		:tabs="items"
		title="Titre de la Carte"
		unique-id="amelipro-multiple-folding-card-unique-id"
	>
		<template #amelipro-multiple-folding-card-item-1>
			<p>Mon test 1</p>
		</template>

		<template #amelipro-multiple-folding-card-item-2>
			<p>Mon test 2</p>
		</template>

		<template #item>
			<p>Mon test global</p>
		</template>
	</AmeliproMultipleFoldingCard>
</template>`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
	import { AmeliproMultipleFoldingCard } from '@cnamts/synapse'

	const items = [
		{
			id: 'amelipro-multiple-folding-card-item-1',
			title: 'Exemple 1',
			valid: true,
		},
		{
			error: true,
			id: 'amelipro-multiple-folding-card-item-2',
			title: 'Exemple 2',
		},
		{
			id: 'amelipro-multiple-folding-card-item-3',
			title: 'Exemple 3',
		},
		{
			id: 'amelipro-multiple-folding-card-item-4',
			title: 'Exemple 4',
		},
	]
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproMultipleFoldingCard },
		setup() {
			return { args }
		},
		template: `
<AmeliproMultipleFoldingCard
	v-bind="args"
>
	<template #amelipro-multiple-folding-card-item-1>
		<p>Mon test 1</p>
	</template>

	<template #amelipro-multiple-folding-card-item-2>
		<p>Mon test 2</p>
	</template>

	<template #item>
		<p>Mon test global</p>
	</template>
</AmeliproMultipleFoldingCard>`,
	}),
}

// --- Carte avec titre en capitales et niveau de titre personnalisé ---
export const TitreCapitalesNiveau: Story = {
	name: 'Titre capitales et niveau',
	args: {
		tabs: items,
		title: 'Titre capitales H3',
		titleUppercase: true,
		titleLevel: 3,
		uniqueId: 'amelipro-multiple-folding-card-uppercase',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le titre de la carte est en capitales et le niveau de titre est personnalisé grâce aux props <code>titleUppercase</code> et <code>titleLevel</code>.</p>
  <AmeliproMultipleFoldingCard
    :tabs="items"
    title="Titre capitales H3"
    title-uppercase
    :title-level="3"
    unique-id="amelipro-multiple-folding-card-uppercase"
  >
    <template #item>
      <p>Contenu global</p>
    </template>
  </AmeliproMultipleFoldingCard>
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproMultipleFoldingCard },
		setup() { return { args } },
		template: `
<p class="mb-2">Le titre de la carte est en capitales et le niveau de titre est personnalisé grâce aux props <code>titleUppercase</code> et <code>titleLevel</code>.</p>
<AmeliproMultipleFoldingCard v-bind="args">
  <template #item>
    <p>Contenu global</p>
  </template>
</AmeliproMultipleFoldingCard>
`,
	}),
}

// --- Carte avec bordure et couleur personnalisées ---
export const BordureEtCouleur: Story = {
	name: 'Bordure et couleur',
	args: {
		tabs: items,
		title: 'Carte colorée',
		bordered: true,
		borderColor: '#1976d2',
		cardColor: '#e3f2fd',
		uniqueId: 'amelipro-multiple-folding-card-colored',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>La carte possède une bordure et une couleur de fond personnalisées grâce aux props <code>bordered</code>, <code>borderColor</code> et <code>cardColor</code>.</p>
  <AmeliproMultipleFoldingCard
    :tabs="items"
    title="Carte colorée"
    bordered
    border-color="#1976d2"
    card-color="#e3f2fd"
    unique-id="amelipro-multiple-folding-card-colored"
  >
    <template #item>
      <p>Contenu global</p>
    </template>
  </AmeliproMultipleFoldingCard>
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproMultipleFoldingCard },
		setup() { return { args } },
		template: `
<p class="mb-2">La carte possède une bordure et une couleur de fond personnalisées grâce aux props <code>bordered</code>, <code>borderColor</code> et <code>cardColor</code>.</p>
<AmeliproMultipleFoldingCard v-bind="args">
  <template #item>
    <p>Contenu global</p>
  </template>
</AmeliproMultipleFoldingCard>
`,
	}),
}

// --- Carte avec ouverture manuelle et gestion de validation ---
export const ValidationManuelle: Story = {
	name: 'Validation manuelle',
	args: {
		tabs: [
			{ id: 'item-1', title: 'Étape 1', valid: false },
			{ id: 'item-2', title: 'Étape 2', error: true },
			{ id: 'item-3', title: 'Étape 3' },
		],
		title: 'Validation manuelle',
		manualValidation: true,
		uniqueId: 'amelipro-multiple-folding-card-manual',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Activation de la validation manuelle des étapes via la prop <code>manualValidation</code>.</p>
  <AmeliproMultipleFoldingCard
    :tabs="tabs"
    title="Validation manuelle"
    manual-validation
    unique-id="amelipro-multiple-folding-card-manual"
  >
    <template #item>
      <p>Contenu global</p>
    </template>
  </AmeliproMultipleFoldingCard>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { AmeliproMultipleFoldingCard } from '@cnamts/synapse'
  const tabs = [
    { id: 'item-1', title: 'Étape 1', valid: false },
    { id: 'item-2', title: 'Étape 2', error: true },
    { id: 'item-3', title: 'Étape 3' },
  ]
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproMultipleFoldingCard },
		setup() { return { args } },
		template: `
<p class="mb-2">Activation de la validation manuelle des étapes via la prop <code>manualValidation</code>.</p>
<AmeliproMultipleFoldingCard v-bind="args">
  <template #item>
    <p>Contenu global</p>
  </template>
</AmeliproMultipleFoldingCard>
`,
	}),
}

// --- Carte avec header droit personnalisé ---
export const HeaderDroit: Story = {
	name: 'Header droit personnalisé',
	args: {
		tabs: items,
		title: 'Header droit',
		headerRightWidth: '120px',
		uniqueId: 'amelipro-multiple-folding-card-header-right',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Personnalisation de la partie droite du header via le slot <code>headerRight</code> et la prop <code>headerRightWidth</code>.</p>
  <AmeliproMultipleFoldingCard
    :tabs="items"
    title="Header droit"
    header-right-width="120"
    unique-id="amelipro-multiple-folding-card-header-right"
  >
    <template #headerRight>
      <span style="color: #1976d2;">Contenu header droit</span>
    </template>
    <template #item>
      <p>Contenu global</p>
    </template>
  </AmeliproMultipleFoldingCard>
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproMultipleFoldingCard },
		setup() { return { args } },
		template: `
<p class="mb-2">Personnalisation de la partie droite du header via le slot <code>headerRight</code> et la prop <code>headerRightWidth</code>.</p>
<AmeliproMultipleFoldingCard v-bind="args">
  <template #headerRight>
    <span style="color: #1976d2;">Contenu header droit</span>
  </template>
  <template #item>
    <p>Contenu global</p>
  </template>
</AmeliproMultipleFoldingCard>
`,
	}),
}
