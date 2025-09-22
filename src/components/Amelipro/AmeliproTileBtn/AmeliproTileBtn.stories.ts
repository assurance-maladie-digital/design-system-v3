import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproTileBtn from './AmeliproTileBtn.vue'

const meta = {
	argTypes: {
		alignTopStyle: { description: 'Change l’alignement des éléments de la tuile pour les mettre en haut (les differents éléments ne seront plus forcément alignés cela dépendra du contenu au-dessus)' },
		borderDash: { description: 'Change la bordure appliquée à la tuile pour une bordure en tirets' },
		click: {
			table: { category: 'events' },
			description: 'Événement émis au click sur le bouton',
		},
		complementaryInfoLine1: { description: 'Ligne dédiée à ajouter des informations supplémentaires (les differents éléments ne seront plus forcément alignés cela dépendra du contenu au-dessus)' },
		complementaryInfoLine2: { description: 'Ligne dédiée à ajouter des informations supplémentaires (les differents éléments ne seront plus forcément alignés cela dépendra du contenu au-dessus)' },
		disabled: { description: 'Désactive le bouton' },
		href: { description: 'Url de destination du lien' },
		imgMaxWidth: { description: 'Taille maximale de l’image du bouton' },
		imgMinWidth: { description: 'Taille minimale de l’image du bouton' },
		imgSrc: { description: 'Url de l’image du bouton' },
		imgWidth: { description: 'Taille de l’image du bouton' },
		invalid: { description: 'Ajoute une icône croix en bas du bouton ainsi qu’une bordure rouge' },
		label: { description: 'Texte à afficher sur le bouton' },
		message: { description: 'Message informatif à intégrer au bouton' },
		messageType: {
			control: 'select',
			description: 'Type du message informatif à intégrer au bouton, accepte les valeur "info", "warning" ou "error"',
			options: ['info', 'error', 'warning'],
		},
		tileMinHeight: { description: 'La hauteur minimale du bouton/lien' },
		tilePadding: { description: 'Padding du bouton' },
		tileWidth: { description: 'La largeur du bouton/lien' },
		to: { description: 'Route de destination du lien' },
		uniqueId: { description: 'Ajoute un id au bouton' },
		valid: { description: 'Ajoute une icône check en bas du bouton' },
	},
	component: AmeliproTileBtn,
	title: 'Composants/Amelipro/Tuiles/AmeliproTileBtn',
} as Meta<typeof AmeliproTileBtn>

export default meta

type Story = StoryObj<typeof AmeliproTileBtn>

export const Default: Story = {
	args: { uniqueId: 'amelipro-tile-btn-unique-id' },
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<ul class="list-style-none d-flex flex-wrap">
	<li>
		<AmeliproTileBtn
			img-src="/tile-example.svg"
			label="Appareil de mesure Tensiomètre"
			tile-min-height="100%"
			unique-id="tile-btn-example-1"
		/>
	</li>
	<li>
		<AmeliproTileBtn
			img-src="/tile-example.svg"
			label="Appareil de mesure Tensiomètre"
			tile-min-height="100%"
			unique-id="tile-btn-example-2"
			valid
		/>
	</li>
	<li>
		<AmeliproTileBtn
			img-src="/tile-example.svg"
			invalid
			label="Appareil de mesure Tensiomètre"
			tile-min-height="100%"
			unique-id="tile-btn-example-3"
		/>
	</li>
</ul>
				`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
	import { AmeliproTileBtn } from '@cnamts/synapse'
</script>`,
			},
			{
				name: 'Style',
				code: `<style lang="scss" scoped>
	li {
		margin: 10px;
		width: calc((100% / 3) - 20px);
	}
</style>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTileBtn },
		setup() {
			return { args }
		},
		template: `
			<ul class="list-style-none d-flex flex-wrap">
				<li style="margin: 10px; width: calc((100% / 3) - 20px);">
					<AmeliproTileBtn
						img-src="/tile-example.svg"
						label="Appareil de mesure Tensiomètre"
						tile-min-height="100%"
						unique-id="tile-btn-example-1"
						v-bind="args"
					/>
				</li>
				<li style="margin: 10px; width: calc((100% / 3) - 20px);">
					<AmeliproTileBtn
						img-src="/tile-example.svg"
						label="Appareil de mesure Tensiomètre"
						tile-min-height="100%"
						unique-id="tile-btn-example-2"
						valid
						v-bind="args"
					/>
				</li>
				<li style="margin: 10px; width: calc((100% / 3) - 20px);">
					<AmeliproTileBtn
						img-src="/tile-example.svg"
						invalid
						label="Appareil de mesure Tensiomètre"
						tile-min-height="100%"
						unique-id="tile-btn-example-3"
						v-bind="args"
					/>
				</li>
			</ul>
		`,
	}),
}

// --- Tuile bouton désactivée ---
export const Desactivee: Story = {
	name: 'Désactivée',
	args: {
		imgSrc: '/tile-example.svg',
		label: 'Bouton désactivé',
		tileMinHeight: '100%',
		uniqueId: 'tile-btn-disabled',
		disabled: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<AmeliproTileBtn
  img-src="/tile-example.svg"
  label="Bouton désactivé"
  tile-min-height="100%"
  unique-id="tile-btn-disabled"
  :disabled="true"
/>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTileBtn },
		setup() { return { args } },
		template: `
<p class="mb-2">Le bouton est désactivé grâce à la prop <code>disabled</code>.</p>
<AmeliproTileBtn v-bind="args" />
`,
	}),
}

// --- Tuile bouton avec message informatif ---
export const AvecMessageInfo: Story = {
	name: 'Avec message informatif',
	args: {
		imgSrc: '/tile-example.svg',
		label: 'Bouton avec info',
		tileMinHeight: '100%',
		uniqueId: 'tile-btn-info',
		message: 'Information complémentaire',
		messageType: 'info',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<AmeliproTileBtn
  img-src="/tile-example.svg"
  label="Bouton avec info"
  tile-min-height="100%"
  unique-id="tile-btn-info"
  message="Information complémentaire"
  message-type="info"
/>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTileBtn },
		setup() { return { args } },
		template: `
<p class="mb-2">Affichage d’un message informatif grâce aux props <code>message</code> et <code>messageType</code>.</p>
<AmeliproTileBtn v-bind="args" />
`,
	}),
}

// --- Tuile bouton avec message d’erreur ---
export const AvecMessageErreur: Story = {
	name: 'Avec message d’erreur',
	args: {
		imgSrc: '/tile-example.svg',
		label: 'Bouton avec erreur',
		tileMinHeight: '100%',
		uniqueId: 'tile-btn-error',
		message: 'Erreur détectée',
		messageType: 'error',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<AmeliproTileBtn
  img-src="/tile-example.svg"
  label="Bouton avec erreur"
  tile-min-height="100%"
  unique-id="tile-btn-error"
  message="Erreur détectée"
  message-type="error"
/>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTileBtn },
		setup() { return { args } },
		template: `
<p class="mb-2">Affichage d’un message d’erreur grâce à la prop <code>messageType="error"</code>.</p>
<AmeliproTileBtn v-bind="args" />
`,
	}),
}

// --- Tuile bouton avec informations complémentaires ---
export const AvecInfosComplements: Story = {
	name: 'Avec infos complémentaires',
	args: {
		imgSrc: '/tile-example.svg',
		label: 'Bouton avec infos',
		tileMinHeight: '100%',
		uniqueId: 'tile-btn-complement',
		complementaryInfoLine1: 'Complément 1',
		complementaryInfoLine2: 'Complément 2',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<AmeliproTileBtn
  img-src="/tile-example.svg"
  label="Bouton avec infos"
  tile-min-height="100%"
  unique-id="tile-btn-complement"
  complementary-info-line1="Complément 1"
  complementary-info-line2="Complément 2"
/>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTileBtn },
		setup() { return { args } },
		template: `
<p class="mb-2">Affichage de deux lignes d’informations complémentaires grâce aux props <code>complementaryInfoLine1</code> et <code>complementaryInfoLine2</code>.</p>
<AmeliproTileBtn v-bind="args" />
`,
	}),
}

// --- Tuile bouton avec navigation externe (href) ---
export const AvecLien: Story = {
	name: 'Avec lien externe',
	args: {
		imgSrc: '/tile-example.svg',
		label: 'Bouton avec lien',
		tileMinHeight: '100%',
		uniqueId: 'tile-btn-href',
		href: 'https://espacepro.ameli.fr',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<AmeliproTileBtn
  img-src="/tile-example.svg"
  label="Bouton avec lien"
  tile-min-height="100%"
  unique-id="tile-btn-href"
  href="https://espacepro.ameli.fr"
/>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTileBtn },
		setup() { return { args } },
		template: `
<p class="mb-2">Le bouton agit comme un lien externe grâce à la prop <code>href</code>.</p>
<AmeliproTileBtn v-bind="args" />
`,
	}),
}

// --- Tuile bouton avec navigation interne (to) ---
export const AvecRouteInterne: Story = {
	name: 'Avec route interne',
	args: {
		imgSrc: '/tile-example.svg',
		label: 'Bouton avec route',
		tileMinHeight: '100%',
		uniqueId: 'tile-btn-to',
		to: '/ma-route-interne',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<AmeliproTileBtn
  img-src="/tile-example.svg"
  label="Bouton avec route"
  tile-min-height="100%"
  unique-id="tile-btn-to"
  to="/ma-route-interne"
/>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTileBtn },
		setup() { return { args } },
		template: `
<p class="mb-2">Le bouton utilise la navigation interne grâce à la prop <code>to</code>.</p>
<AmeliproTileBtn v-bind="args" />
`,
	}),
}
