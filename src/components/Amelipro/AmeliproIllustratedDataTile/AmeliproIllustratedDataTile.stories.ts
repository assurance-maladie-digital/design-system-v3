import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproIllustratedDataTile from './AmeliproIllustratedDataTile.vue'

const meta = {
	argTypes: {
		complementaryInformation: { description: 'Informations supplémentaires après le sous-titre' },
		iconName: { description: 'Nom de l’icône pour illustrer la data' },
		imgSrc: { description: 'Chemin vers une image.' },
		labelFirstLine: { description: 'Première ligne de texte de la tuile' },
		labelSecondLine: { description: 'Deuxième ligne de texte de la tuile' },
		tileInfoColor: { description: 'Couleur de l’icône, et des deux lignes de label' },
		tileMinHeight: { description: 'Hauteur minimale du bouton/lien.' },
		tilePadding: { description: 'Padding sur la tuile' },
		tileWidth: { description: 'Largeur de la tuile' },
		titleLevel: { description: 'Niveau de titre de la tuile' },
		uniqueId: { description: 'Identifiant unique du composant' },
	},
	component: AmeliproIllustratedDataTile,
	title: 'Composants/Amelipro/Tuiles/AmeliproIllustratedDataTile',
} as Meta<typeof AmeliproIllustratedDataTile>
export default meta

type Story = StoryObj<typeof AmeliproIllustratedDataTile>

export const Default: Story = {
	args: {
		iconName: 'chrono',
		labelFirstLine: 'Label 1',
		labelSecondLine: 'Label 2',
		tileWidth: '250px',
		uniqueId: 'amelipro-illustrated-data-tile-unique-id',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproIllustratedDataTile
		icon-name="chrono"
		label-first-line="Label 1"
		label-second-line="Label 2"
		tile-width="250px"
		unique-id="amelipro-illustrated-data-tile-unique-id"
	/>
</template>`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
	import { AmeliproIllustratedDataTile } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproIllustratedDataTile },
		setup() {
			return { args }
		},
		template: `
          <AmeliproIllustratedDataTile
              v-bind="args"
          />
        `,
	}),

}

// --- Tuile illustrée avec image personnalisée ---
export const AvecImage: Story = {
	name: 'Avec image',
	args: {
		imgSrc: '/logos/logo-assurance-maladie.svg',
		labelFirstLine: 'Assurance Maladie',
		labelSecondLine: 'Partenaire',
		tileWidth: '250px',
		uniqueId: 'amelipro-illustrated-tile-img',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<AmeliproIllustratedDataTile
  img-src="/logos/logo-assurance-maladie.svg"
  label-first-line="Assurance Maladie"
  label-second-line="Partenaire"
  tile-width="250px"
  unique-id="amelipro-illustrated-tile-img"
/>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproIllustratedDataTile },
		setup() {
			return { args }
		},
		template: `
          <p class="mb-2">Affichage d’une image personnalisée grâce à la prop <code>imgSrc</code>.</p>
          <AmeliproIllustratedDataTile v-bind="args"/>
        `,
	}),
}

// --- Tuile illustrée avec icône ---
export const AvecIcone: Story = {
	name: 'Avec icône',
	args: {
		iconName: 'document',
		labelFirstLine: 'Documents',
		labelSecondLine: 'à traiter',
		tileWidth: '250px',
		uniqueId: 'amelipro-illustrated-tile-icon',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<AmeliproIllustratedDataTile
  icon-name="document"
  label-first-line="Documents"
  label-second-line="à traiter"
  tile-width="250px"
  unique-id="amelipro-illustrated-tile-icon"
/>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproIllustratedDataTile },
		setup() {
			return { args }
		},
		template: `
          <p class="mb-2">Affichage d’une icône grâce à la prop <code>iconName</code>.</p>
          <AmeliproIllustratedDataTile v-bind="args"/>
        `,
	}),
}

// --- Tuile illustrée avec informations complémentaires ---
export const AvecInfosComplements: Story = {
	name: 'Avec infos complémentaires',
	args: {
		iconName: 'chrono',
		labelFirstLine: 'Traitement',
		labelSecondLine: 'en cours',
		tileWidth: '250px',
		uniqueId: 'amelipro-illustrated-tile-complement',
		complementaryInformation: [
			{ label: 'Dossiers', value: '12' },
			{ label: 'Restants', value: '3' },
		],
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<AmeliproIllustratedDataTile
  icon-name="chrono"
  label-first-line="Traitement"
  label-second-line="en cours"
  tile-width="250px"
  unique-id="amelipro-illustrated-tile-complement"
  :complementary-information="[{ label: 'Dossiers', value: '12' }, { label: 'Restants', value: '3' }]"
/>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproIllustratedDataTile },
		setup() {
			return { args }
		},
		template: `
          <p class="mb-2">Affichage d’informations complémentaires sous le sous-titre grâce à la prop <code>complementaryInformation</code>.
          </p>
          <AmeliproIllustratedDataTile v-bind="args"/>
        `,
	}),
}

// --- Tuile illustrée avec niveau de titre personnalisé ---
export const TitreNiveauPersonnalise: Story = {
	name: 'Niveau de titre personnalisé',
	args: {
		iconName: 'document',
		labelFirstLine: 'Titre niveau 4',
		labelSecondLine: 'Sous-titre',
		tileWidth: '250px',
		uniqueId: 'amelipro-illustrated-tile-title-level',
		titleLevel: 4,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<AmeliproIllustratedDataTile
  icon-name="document"
  label-first-line="Titre niveau 4"
  label-second-line="Sous-titre"
  tile-width="250px"
  unique-id="amelipro-illustrated-tile-title-level"
  :title-level="4"
/>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproIllustratedDataTile },
		setup() {
			return { args }
		},
		template: `
          <p class="mb-2">Le niveau du titre est personnalisé grâce à la prop <code>titleLevel</code>.</p>
          <AmeliproIllustratedDataTile v-bind="args"/>
        `,
	}),
}

// --- Tuile illustrée avec padding et min-height personnalisés ---
export const AvecStylePerso: Story = {
	name: 'Style personnalisé',
	args: {
		iconName: 'chrono',
		labelFirstLine: 'Style',
		labelSecondLine: 'personnalisé',
		tileWidth: '250px',
		tilePadding: '3rem 2rem',
		tileMinHeight: '200px',
		uniqueId: 'amelipro-illustrated-tile-style',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<AmeliproIllustratedDataTile
  icon-name="chrono"
  label-first-line="Style"
  label-second-line="personnalisé"
  tile-width="250px"
  tile-padding="3rem 2rem"
  tile-min-height="200px"
  unique-id="amelipro-illustrated-tile-style"
/>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproIllustratedDataTile },
		setup() {
			return { args }
		},
		template: `
          <p class="mb-2">Le padding et la hauteur minimale sont personnalisés grâce aux props <code>tilePadding</code>
            et <code>tileMinHeight</code>.</p>
          <AmeliproIllustratedDataTile v-bind="args"/>
        `,
	}),
}
