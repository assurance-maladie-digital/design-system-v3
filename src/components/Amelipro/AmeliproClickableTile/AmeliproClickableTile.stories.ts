import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproClickableTile from './AmeliproClickableTile.vue'

const meta = {
	argTypes: {
		borderedIcon: { description: 'change le style du pictogramme à gauche de la tuile' },
		click: {
			table: { category: 'events' },
			description: 'Événement émis au click sur le bouton',
		},
		default: { description: 'slot permettant de remplacer la property `tileTitle`, ce slot ne doit contenir que des balises span' },
		disabled: { description: 'désactive la tuile' },
		href: { description: 'Url de destination du lien' },
		icon: { description: 'Nom de l\'icone à afficher' },
		imgMaxWidth: { description: 'Taille maximale de l’image du bouton' },
		imgMinWidth: { description: 'Taille minimale de l’image du bouton' },
		imgSrc: { description: 'Url de l’image du bouton' },
		imgWidth: { description: 'Taille de l’image du bouton' },
		tileTitle: { description: 'Texte à afficher sur la tuile' },
		tileWidth: { description: 'La largeur du bouton/lien' },
		to: { description: 'Route de destination du lien' },
		uniqueId: { description: 'Ajoute un id au bouton' },
	},
	component: AmeliproClickableTile,
	title: 'Composants/Amelipro/Tuiles/AmeliproClickableTile',
} as Meta<typeof AmeliproClickableTile>

export default meta

type Story = StoryObj<typeof AmeliproClickableTile>

export const Default: Story = {
	args: {
		icon: 'utilisateur',
		tileTitle: 'Titre de la tuile',
		uniqueId: 'amelipro-tile-btn-unique-id',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
	<AmeliproClickableTile
		icon="utilisateur"
		tile-title="Titre de la tuile"
		unique-id="amelipro-tile-btn-unique-id"
	/>`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
	import { AmeliproClickableTile } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproClickableTile },
		setup() {
			return { args }
		},
		template: `
          <AmeliproClickableTile
              v-bind="args"
          />`,
	}),
}

// --- Tuile avec image à la place de l’icône ---
export const AvecImage: Story = {
	name: 'Avec image',
	args: {
		imgSrc: '/logos/logo-assurance-maladie.svg',
		tileTitle: 'Tuile avec image',
		uniqueId: 'amelipro-tile-img',
		imgWidth: '40px',
		imgMinWidth: '40px',
		imgMaxWidth: '40px',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<AmeliproClickableTile
  img-src="/logos/logo-assurance-maladie.svg"
  tile-title="Tuile avec image"
  unique-id="amelipro-tile-img"
  img-width="40px"
  img-min-width="40px"
  img-max-width="40px"
/>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproClickableTile },
		setup() {
			return { args }
		},
		template: `
          <p class="mb-2">Affichage d’une image à la place de l’icône grâce à la prop <code>imgSrc</code>.</p>
          <AmeliproClickableTile v-bind="args"/>
        `,
	}),
}

// --- Tuile désactivée ---
export const Desactivee: Story = {
	name: 'Désactivée',
	args: {
		icon: 'utilisateur',
		tileTitle: 'Tuile désactivée',
		uniqueId: 'amelipro-tile-disabled',
		disabled: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<AmeliproClickableTile
  icon="utilisateur"
  tile-title="Tuile désactivée"
  unique-id="amelipro-tile-disabled"
  :disabled="true"
/>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproClickableTile },
		setup() {
			return { args }
		},
		template: `
          <p class="mb-2">La tuile est désactivée grâce à la prop <code>disabled</code>.</p>
          <AmeliproClickableTile v-bind="args"/>
        `,
	}),
}

// --- Tuile avec bordure sur l’icône ---
export const IconeAvecBordure: Story = {
	name: 'Icône avec bordure',
	args: {
		icon: 'utilisateur',
		tileTitle: 'Icône avec bordure',
		uniqueId: 'amelipro-tile-bordered-icon',
		borderedIcon: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<AmeliproClickableTile
  icon="utilisateur"
  tile-title="Icône avec bordure"
  unique-id="amelipro-tile-bordered-icon"
  bordered-icon
/>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproClickableTile },
		setup() {
			return { args }
		},
		template: `
          <p class="mb-2">L’icône est affichée avec une bordure grâce à la prop <code>borderedIcon</code>.</p>
          <AmeliproClickableTile v-bind="args"/>
        `,
	}),
}

// --- Tuile avec navigation (href) ---
export const AvecLien: Story = {
	name: 'Avec lien',
	args: {
		icon: 'utilisateur',
		tileTitle: 'Tuile avec lien',
		uniqueId: 'amelipro-tile-href',
		href: 'https://espacepro.ameli.fr',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<AmeliproClickableTile
  icon="utilisateur"
  tile-title="Tuile avec lien"
  unique-id="amelipro-tile-href"
  href="https://espacepro.ameli.fr"
/>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproClickableTile },
		setup() {
			return { args }
		},
		template: `
          <p class="mb-2">La tuile agit comme un lien grâce à la prop <code>href</code>.</p>
          <AmeliproClickableTile v-bind="args"/>
        `,
	}),
}

// --- Tuile avec slot titre personnalisé ---
export const TitrePersonnalise: Story = {
	name: 'Titre personnalisé (slot)',
	args: {
		icon: 'utilisateur',
		uniqueId: 'amelipro-tile-slot-title',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<AmeliproClickableTile
  icon="utilisateur"
  unique-id="amelipro-tile-slot-title"
>
  <template #default>
    <span style="color: #1976d2;">Titre <strong>personnalisé</strong></span>
  </template>
</AmeliproClickableTile>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproClickableTile },
		setup() {
			return { args }
		},
		template: `
          <p class="mb-2">Le titre de la tuile est personnalisé via le slot <code>default</code>.</p>
          <AmeliproClickableTile v-bind="args">
            <template #default>
              <span style="color: #1976d2;">Titre <strong>personnalisé</strong></span>
            </template>
          </AmeliproClickableTile>
        `,
	}),
}
