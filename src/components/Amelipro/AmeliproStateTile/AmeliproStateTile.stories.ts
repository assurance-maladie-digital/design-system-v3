import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproStateTile from './AmeliproStateTile.vue'

const meta = {
	argTypes: {
		btnStyledText: { description: 'Partie du texte qui s’affiche dans la tuile sous forme de bouton' },
		click: { description: 'Événement émis au click sur les tuiles cliquables. Retourne `uniqueId`', type: 'string | undefined' },
		contentMinHeight: { description: 'Hauteur minimale du contenu de la tuile' },
		disabled: { description: 'Pour désactiver la tuile' },
		href: { description: 'Url de destination du lien.' },
		labelFirstLine: { description: 'Première ligne de texte de la tuile' },
		labelSecondLine: { description: 'Deuxième ligne de texte de la tuile' },
		labelThirdLine: { description: 'Troisième ligne de texte de la tuile' },
		linkStyleText: { description: 'Ligne de texte dans un style de lien, qui apparaît sur certains types de tuile' },
		noPdfIcon: { description: 'Pour masquer l’icône "PDF"' },
		tileMinHeight: { description: 'La hauteur minimale du bouton/lien.' },
		tilePaddingX: { description: 'Padding sur les côtés de la tuile.' },
		tileType: {
			description: 'Type de la tuile parmi : `date`, `toDo`, `toDoNoCertificate`, `toDoNoCertificateBlue`, `optionnal`, `done`, `doneNoCertificate` et `doneNoCertificateBlue`.',
			options: [
				'date',
				'toDo',
				'toDoNoCertificate',
				'toDoNoCertificateBlue',
				'optionnal',
				'done',
				'doneNoCertificate',
				'doneNoCertificateBlue',
				'doneToCorrect',
			],
		},
		tileWidth: { description: 'La largeur de la tuile.' },
		to: { description: 'Route de destination du lien.' },
		uniqueId: { description: 'Ajoute un id au bouton' },
	},
	component: AmeliproStateTile,
	title: 'Composants/Amelipro/Tuiles/AmeliproStateTile',
} as Meta<typeof AmeliproStateTile>
export default meta

type Story = StoryObj<typeof AmeliproStateTile>

export const Default: Story = {
	args: {
		btnStyledText: 'Réaliser cet examen',
		labelFirstLine: 'Au cours de',
		labelSecondLine: 'Xème période',
		tileMinHeight: '100%',
		tileType: 'toDoNoCertificate',
		tileWidth: '300px',
		uniqueId: 'amelipro-state-tile-unique-id',
	},
	parameters: {
		args: {},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproStateTile
		btn-styled-text="Réaliser cet examen"
		label-first-line="Au cours de"
		label-second-line="Xème période"
		tile-min-height="100%"
		tile-type="toDoNoCertificate"
		tile-width="300px"
		unique-id="amelipro-state-tile-unique-id"
	/>
</template>`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
	import { AmeliproStateTile } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproStateTile },
		setup() {
			return { args }
		},
		template: `
<AmeliproStateTile
	v-bind="args"
/>`,
	}),
}

// --- Tuile désactivée ---
export const Desactivee: Story = {
	name: 'Désactivée',
	args: {
		btnStyledText: 'Action désactivée',
		labelFirstLine: 'Tuile',
		labelSecondLine: 'désactivée',
		tileType: 'toDo',
		tileWidth: '300px',
		tileMinHeight: '100%',
		disabled: true,
		uniqueId: 'amelipro-state-tile-disabled',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <AmeliproStateTile
    btn-styled-text="Action désactivée"
    label-first-line="Tuile"
    label-second-line="désactivée"
    tile-type="toDo"
    tile-width="300px"
    tile-min-height="100%"
    :disabled="true"
    unique-id="amelipro-state-tile-disabled"
  />
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproStateTile },
		setup() { return { args } },
		template: `
<p class="mb-2">La tuile est désactivée grâce à la prop <code>disabled</code>.</p>
<AmeliproStateTile v-bind="args" />
`,
	}),
}

// --- Tuile avec lien externe (href) ---
export const AvecLien: Story = {
	name: 'Avec lien',
	args: {
		btnStyledText: 'Voir le détail',
		labelFirstLine: 'Lien externe',
		labelSecondLine: 'vers ameli pro',
		tileType: 'done',
		tileWidth: '300px',
		tileMinHeight: '100%',
		href: 'https://espacepro.ameli.fr',
		uniqueId: 'amelipro-state-tile-href',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <AmeliproStateTile
    btn-styled-text="Voir le détail"
    label-first-line="Lien externe"
    label-second-line="vers ameli pro"
    tile-type="done"
    tile-width="300px"
    tile-min-height="100%"
    href="https://espacepro.ameli.fr"
    unique-id="amelipro-state-tile-href"
  />
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproStateTile },
		setup() { return { args } },
		template: `
<p class="mb-2">La tuile agit comme un lien externe grâce à la prop <code>href</code>.</p>
<AmeliproStateTile v-bind="args" />
`,
	}),
}

// --- Tuile avec route interne (to) ---
export const AvecRouteInterne: Story = {
	name: 'Avec route interne',
	args: {
		btnStyledText: 'Accéder à la page',
		labelFirstLine: 'Navigation interne',
		labelSecondLine: 'avec "to"',
		tileType: 'doneNoCertificate',
		tileWidth: '300px',
		tileMinHeight: '100%',
		to: '/ma-route-interne',
		uniqueId: 'amelipro-state-tile-to',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <AmeliproStateTile
    btn-styled-text="Accéder à la page"
    label-first-line="Navigation interne"
    label-second-line="avec \\"to\\""
    tile-type="doneNoCertificate"
    tile-width="300px"
    tile-min-height="100%"
    to="/ma-route-interne"
    unique-id="amelipro-state-tile-to"
  />
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproStateTile },
		setup() { return { args } },
		template: `
<p class="mb-2">La tuile utilise la navigation interne grâce à la prop <code>to</code>.</p>
<AmeliproStateTile v-bind="args" />
`,
	}),
}

// --- Tuile avec 3 lignes de texte ---
export const TroisLignes: Story = {
	name: 'Trois lignes de texte',
	args: {
		btnStyledText: 'Action',
		labelFirstLine: 'Première ligne',
		labelSecondLine: 'Deuxième ligne',
		labelThirdLine: 'Troisième ligne',
		tileType: 'optionnal',
		tileWidth: '300px',
		tileMinHeight: '100%',
		uniqueId: 'amelipro-state-tile-3lignes',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <AmeliproStateTile
    btn-styled-text="Action"
    label-first-line="Première ligne"
    label-second-line="Deuxième ligne"
    label-third-line="Troisième ligne"
    tile-type="optionnal"
    tile-width="300px"
    tile-min-height="100%"
    unique-id="amelipro-state-tile-3lignes"
  />
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproStateTile },
		setup() { return { args } },
		template: `
<p class="mb-2">Affichage d’une tuile avec trois lignes de texte.</p>
<AmeliproStateTile v-bind="args" />
`,
	}),
}

// --- Tuile sans icône PDF ---
export const SansIconePdf: Story = {
	name: 'Sans icône PDF',
	args: {
		btnStyledText: 'Télécharger',
		labelFirstLine: 'Sans PDF',
		labelSecondLine: 'Icône masquée',
		tileType: 'doneNoCertificateBlue',
		tileWidth: '300px',
		tileMinHeight: '100%',
		noPdfIcon: true,
		uniqueId: 'amelipro-state-tile-no-pdf',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <AmeliproStateTile
    btn-styled-text="Télécharger"
    label-first-line="Sans PDF"
    label-second-line="Icône masquée"
    tile-type="doneNoCertificateBlue"
    tile-width="300px"
    tile-min-height="100%"
    :no-pdf-icon="true"
    unique-id="amelipro-state-tile-no-pdf"
  />
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproStateTile },
		setup() { return { args } },
		template: `
<p class="mb-2">La tuile est affichée sans l’icône PDF grâce à la prop <code>noPdfIcon</code>.</p>
<AmeliproStateTile v-bind="args" />
`,
	}),
}
