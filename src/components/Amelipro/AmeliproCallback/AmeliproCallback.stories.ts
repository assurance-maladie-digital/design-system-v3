import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproCallback from './AmeliproCallback.vue'

const meta = {
	argTypes: {
		'cardActions': { description: 'Permet de modifier la zone prévu pour les boutons cardActions' },
		'cardTitle': { description: 'Titre de la carte' },
		'click:transmission': { description: 'Événement émis au clic sur le bouton "Réessayer".', type: 'void' },
		'contentBottom': { description: 'Permet de rajouter du contenu sous le contenu principal de la carte' },
		'contentText': { description: 'Text de la carte (contenu)' },
		'contentTitle': { description: 'Titre du contenu' },
		'contentTitleColor': { description: 'Permet de définir la couleur du titre du contenu' },
		'defaultContent': { description: 'Permet de modifier le contenu central par défaut à l’intérieur de la card' },
		'failure': { description: 'Affiche un icône en forme de croix pour signifier un échec de transmission' },
		'imgMinWidth': { description: 'Permet de définir la taille minimale de l’image' },
		'imgUrl': { description: 'Url permettant l’affichage d’une image en remplacement des icônes par défaut' },
		'imgWidth': { description: 'Permet de définir la taille de l’image' },
		'retryBtn': { description: 'Affiche le bouton réessayer' },
		'text': { description: 'Permet de modifier la zone de texte par défaut à l’intérieur de la card si le slot defaultContent n’est pas renseigné' },
		'transmissionHref': { description: 'Url du bouton réessayer' },
		'transmissionTo': { description: 'Route du bouton réessayer' },
		'uniqueId': { description: 'Identifiant unique du composant' },
	},
	component: AmeliproCallback,
	title: 'Composants/Amelipro/Cartes/AmeliproCallback',
} as Meta<typeof AmeliproCallback>
export default meta

type Story = StoryObj<typeof AmeliproCallback>

export const Default: Story = {
	args: {
		cardTitle: 'Titre de la carte',
		contentText: 'Texte du contenu',
		contentTitle: 'Titre du contenu',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproCallback 
		card-title="Titre de la carte"
		content-text="Texte du contenu"
		content-title="Titre du contenu"
	/>
</template>
				`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
	import { AmeliproCallback } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCallback },
		setup() {
			return { args }
		},
		template: `
<AmeliproCallback
	v-bind="args"
/>
		`,
	}),
}

// --- Carte avec bouton Réessayer (retryBtn) ---
export const AvecBoutonReessayer: Story = {
	name: 'Avec bouton Réessayer',
	args: {
		cardTitle: 'Transmission échouée',
		contentText: 'Une erreur est survenue lors de la transmission.',
		contentTitle: 'Erreur',
		retryBtn: true,
		failure: true,
		uniqueId: 'amelipro-callback-retry',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Affichage du bouton <code>Réessayer</code> grâce à la prop <code>retryBtn</code> et gestion de l’échec avec <code>failure</code>.</p>
  <AmeliproCallback
    card-title="Transmission échouée"
    content-text="Une erreur est survenue lors de la transmission."
    content-title="Erreur"
    retry-btn
    failure
    unique-id="amelipro-callback-retry"
  />
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { AmeliproCallback } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCallback },
		setup() { return { args } },
		template: `
<p class="mb-2">Affichage du bouton <code>Réessayer</code> grâce à la prop <code>retryBtn</code> et gestion de l’échec avec <code>failure</code>.</p>
<AmeliproCallback v-bind="args" />
`,
	}),
}

// --- Carte avec image personnalisée ---
export const AvecImage: Story = {
	name: 'Avec image personnalisée',
	args: {
		cardTitle: 'Carte avec image',
		contentText: 'Une image personnalisée est affichée.',
		contentTitle: 'Image',
		imgUrl: '/amelipro/img/tile-example.svg',
		imgWidth: '80px',
		imgMinWidth: '80px',
		uniqueId: 'amelipro-callback-image',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Affichage d’une image personnalisée grâce aux props <code>imgUrl</code>, <code>imgWidth</code> et <code>imgMinWidth</code>.</p>
  <AmeliproCallback
    card-title="Carte avec image"
    content-text="Une image personnalisée est affichée."
    content-title="Image"
    img-url="/amelipro/img/tile-example.svg"
    :img-width="80px"
    :img-min-width="80px"
    unique-id="amelipro-callback-image"
  />
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { AmeliproCallback } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCallback },
		setup() { return { args } },
		template: `
<p class="mb-2">Affichage d’une image personnalisée grâce aux props <code>imgUrl</code>, <code>imgWidth</code> et <code>imgMinWidth</code>.</p>
<AmeliproCallback v-bind="args" />
`,
	}),
}

// --- Carte avec couleur de titre personnalisée ---
export const TitreCouleurPersonnalisee: Story = {
	name: 'Titre couleur personnalisée',
	args: {
		cardTitle: 'Carte avec titre coloré',
		contentText: 'Le titre du contenu est en couleur personnalisée.',
		contentTitle: 'Titre coloré',
		contentTitleColor: '#1976d2',
		uniqueId: 'amelipro-callback-title-color',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le titre du contenu est coloré grâce à la prop <code>contentTitleColor</code>.</p>
  <AmeliproCallback
    card-title="Carte avec titre coloré"
    content-text="Le titre du contenu est en couleur personnalisée."
    content-title="Titre coloré"
    content-title-color="#1976d2"
    unique-id="amelipro-callback-title-color"
  />
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { AmeliproCallback } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCallback },
		setup() { return { args } },
		template: `
<p class="mb-2">Le titre du contenu est coloré grâce à la prop <code>contentTitleColor</code>.</p>
<AmeliproCallback v-bind="args" />
`,
	}),
}

// --- Carte avec slot defaultContent ---
export const AvecSlotDefaultContent: Story = {
	name: 'Slot defaultContent',
	args: {
		cardTitle: 'Carte avec slot',
		uniqueId: 'amelipro-callback-slot',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le slot <code>defaultContent</code> permet de personnaliser le contenu central de la carte.</p>
  <AmeliproCallback
    card-title="Carte avec slot"
    unique-id="amelipro-callback-slot"
  >
    <template #defaultContent>
      <div style="color: #1976d2;" class="d-flex align-center">Contenu personnalisé via le slot <code>defaultContent</code>.</div>
    </template>
  </AmeliproCallback>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { AmeliproCallback } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCallback },
		setup() { return { args } },
		template: `
<p class="mb-2">Le slot <code>defaultContent</code> permet de personnaliser le contenu central de la carte.</p>
<AmeliproCallback v-bind="args">
  <template #defaultContent>
    <div style="color: #1976d2;" class="d-flex align-center">Contenu personnalisé via le slot
      <code>defaultContent</code>.
    </div>
  </template>
</AmeliproCallback>
`,
	}),
}

// --- Carte avec slot cardActions ---
export const AvecSlotCardActions: Story = {
	name: 'Slot cardActions',
	args: {
		cardTitle: 'Carte avec actions',
		contentText: 'Des actions personnalisées sont ajoutées.',
		uniqueId: 'amelipro-callback-actions',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le slot <code>cardActions</code> permet d’ajouter des boutons ou actions personnalisées en bas de la carte.</p>
  <AmeliproCallback
    card-title="Carte avec actions"
    content-text="Des actions personnalisées sont ajoutées."
    unique-id="amelipro-callback-actions"
  >
    <template #cardActions>
      <button type="button" style="margin-right: 8px;">Action 1</button>
      <button type="button">Action 2</button>
    </template>
  </AmeliproCallback>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { AmeliproCallback } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCallback },
		setup() { return { args } },
		template: `
<p class="mb-2">Le slot <code>cardActions</code> permet d’ajouter des boutons ou actions personnalisées en bas de la carte.</p>
<AmeliproCallback v-bind="args">
  <template #cardActions>
    <button type="button" style="margin-right: 8px;">Action 1</button>
    <button type="button">Action 2</button>
  </template>
</AmeliproCallback>
`,
	}),
}

// --- Carte avec contenu en bas (slot contentBottom) ---
export const AvecSlotContentBottom: Story = {
	name: 'Slot contentBottom',
	args: {
		cardTitle: 'Carte avec contenu bas',
		contentText: 'Un contenu supplémentaire est affiché en bas.',
		uniqueId: 'amelipro-callback-content-bottom',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le slot <code>contentBottom</code> permet d’ajouter du contenu sous le contenu principal de la carte.</p>
  <AmeliproCallback
    card-title="Carte avec contenu bas"
    content-text="Un contenu supplémentaire est affiché en bas."
    unique-id="amelipro-callback-content-bottom"
  >
    <template #contentBottom>
      <div style="font-size: 0.9em; color: #1976d2;">Contenu additionnel en bas de la carte.</div>
    </template>
  </AmeliproCallback>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { AmeliproCallback } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCallback },
		setup() { return { args } },
		template: `
<p class="mb-2">Le slot <code>contentBottom</code> permet d’ajouter du contenu sous le contenu principal de la carte.</p>
<AmeliproCallback v-bind="args">
  <template #contentBottom>
    <div style="font-size: 0.9em; color: #1976d2;">Contenu additionnel en bas de la carte.</div>
  </template>
</AmeliproCallback>
`,
	}),
}

// --- Bouton Réessayer avec navigation (transmissionHref) ---
export const AvecNavigationHref: Story = {
	name: 'Bouton Réessayer avec lien',
	args: {
		cardTitle: 'Session expirée',
		contentText: 'Votre session a expiré. Veuillez vous reconnecter.',
		contentTitle: 'Session expirée',
		retryBtn: true,
		transmissionHref: '#espacepro-ameli-fr',
		uniqueId: 'amelipro-callback-href',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le bouton <code>Réessayer</code> redirige vers une URL grâce à la prop <code>transmissionHref</code>.</p>
  <AmeliproCallback
    card-title="Session expirée"
    content-text="Votre session a expiré. Veuillez vous reconnecter."
    content-title="Session expirée"
    retry-btn
    transmission-href="#espacepro-ameli-fr"
    unique-id="amelipro-callback-href"
  />
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { AmeliproCallback } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCallback },
		setup() { return { args } },
		template: `
<p class="mb-2">Le bouton <code>Réessayer</code> redirige vers une URL grâce à la prop <code>transmissionHref</code>.</p>
<AmeliproCallback v-bind="args" />
`,
	}),
}
