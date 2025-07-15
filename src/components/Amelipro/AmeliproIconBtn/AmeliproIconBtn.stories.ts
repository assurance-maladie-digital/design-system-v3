import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproIconBtn from './AmeliproIconBtn.vue'

const meta = {
	argTypes: {
		append: { description: 'texte à afficher à droite de l’icône' },
		badge: { description: 'Ajoute un badge avec un nombre ou du texte à côté de l’icône.' },
		badgeBgColor: { description: 'Gère la couleur de fond du badge.' },
		badgeColor: { description: 'Gère la couleur de texte du badge.' },
		bordered: { description: 'Active le mode bordered' },
		btnLabel: { description: 'Label masqué du bouton à remplir si les slots `prepend`, `append` et la property `btnTitle` ne sont pas utilisés' },
		btnTitle: { description: 'Title du bouton à remplir si le slots `prepend`, `append` et la property `btnLabel` ne sont pas utilisés. Est affiché au survol du bouton' },
		click: { description: 'Event émis au click sur le bouton, ne fonctionne correctement que si `href` et `to` ne sont pas renseignés.' },
		href: { description: 'Url du lien' },
		icon: { description: 'Nom de l’icône personnalisée' },
		iconBgColor: { description: 'Couleur de l’arrière plan de l’icône' },
		iconBorderColor: { description: 'Couleur de bordure de l’icône' },
		iconColor: { description: 'Couleur de l’icône' },
		iconHoverBgColor: { description: 'Couleur d’arrière plan de l’icône au survol' },
		iconHoverBorderColor: { description: 'Couleur de bordure de l’icône au survol' },
		iconHoverColor: { description: 'Couleur de l’icône au survol' },
		prepend: { description: 'texte à afficher à gauche de l’icône' },
		size: { description: 'Défini la hauteur et la largeur de l’icône' },
		to: { description: 'Route du lien' },
		uniqueId: { description: 'Ajoute un id au bouton' },
	},
	component: AmeliproIconBtn,
	title: 'Composants/Amelipro/AmeliproIconBtn',
} as Meta<typeof AmeliproIconBtn>
export default meta

type Story = StoryObj<typeof AmeliproIconBtn>

export const Default: Story = {
	args: {
		btnLabel: 'informations utilisateur',
		icon: 'utilisateur',
		iconBgColor: 'ap-blue-darken-1',
		iconColor: 'ap-white',
		iconHoverBgColor: 'ap-blue-darken-2',
		iconHoverColor: 'ap-white',
		uniqueId: 'amelipro-icon-btn-id',
		xLarge: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproIconBtn
		btn-label="informations utilisateur"
		icon="utilisateur"
		icon-bg-color="ap-blue-darken-1"
		icon-color="ap-white"
		icon-hover-bg-color="ap-blue-darken-2"
		icon-hover-color="ap-white"
		unique-id="amelipro-icon-btn-id"
		x-large
	/>
</template>
				`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
	import { AmeliproIconBtn } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproIconBtn },
		setup() {
			return { args }
		},
		template: `
<AmeliproIconBtn
	v-bind="args"
/>`,
	}),
}
