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
		disabled: { description: 'Url de destination du lien' },
		href: { description: 'Désactive le bouton' },
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
	title: 'Composants/Tuiles/AmeliproTileBtn',
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
