import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproBtn from './AmeliproBtn.vue'

const meta = {
	argTypes: {
		badge: { description: 'Ajoute un badge avec un nombre ou du texte à côté de l’icône.' },
		badgeBgColor: { description: 'Gère la couleur de fond du badge.' },
		badgeColor: { description: 'Gère la couleur de texte du badge.' },
		bordered: { description: 'Applique une bordure de 1px autour du bouton de la même couleur que hoverColor' },
		classes: { description: 'Classes personnalisées du bouton' },
		click: {
			table: { category: 'events' },
			description: 'Événement émis au click sur le bouton',
		},
		color: { description: 'La couleur de fond du bouton/lien ou la couleur du texte si la propriété `text` est activée.' },
		default: { description: 'Intitulé du bouton' },
		disabled: { description: 'Désactive le bouton.' },
		hoverColor: { description: 'Cette propriété est similaire à la propriété `color` mais pour le survol du bouton/lien.' },
		hoverUnderline: { description: 'Souligne le texte du bouton/lien au survol.' },
		href: {
			table: { category: 'props' },
			description: 'Ajoute une url au bouton',
		},
		icon: {
			table: { category: 'props' },
			description: 'Slot pour utiliser une icône MDI',
		},
		iconBgColor: { description: 'Applique une couleur de fond à l’icône' },
		iconBordered: { description: 'Applique une bordure de 1px autour de l’icône' },
		iconColor: { description: 'Applique une couleur à l’icône si la propriété infoBlock est activée' },
		iconFocusColor: { description: 'Applique une couleur de focus à l’icône' },
		iconHoverColor: { description: 'Applique une couleur de survol à l’icône si la propriété infoBlock est activée' },
		iconLeft: { description: 'S’il y a un icône le place à gauche.' },
		iconName: { description: 'Nom de l’icône à rajouter au bouton/lien à droite du texte.' },
		infoBlock: { description: 'Change la forme du bouton/lien et le positionnement de l’icône pour correspondre à l’affichage `bloc d’information`.' },
		minHeight: { description: 'La hauteur minimale du bouton/lien.' },
		size: { description: 'Change la taille de l’icône pour l’affichage `bloc d’information`.' },
		text: { description: 'Supprime la couleur de fond du bouton pour l’appliquer directement au texte.' },
		textColor: { description: 'La couleur du texte si la propriété `text` est désactivée.' },
		textFocusColor: { description: 'La couleur du texte au focus si la propriété `text` est désactivée.' },
		textHoverColor: { description: 'La couleur du texte au survol si la propriété `text` est désactivée.' },
		to: {
			table: { category: 'props' },
			description: 'Ajoute une route au bouton',
		},
		underline: { description: 'Souligne le texte du bouton/lien.' },
	},
	component: AmeliproBtn,
	title: 'Composants/Amelipro/AmeliproBtn',
} as Meta<typeof AmeliproBtn>

export default meta

type Story = StoryObj<typeof AmeliproBtn>

export const Default: Story = {
	args: {
		default: 'My Button',
		uniqueId: 'my-btn-id',
	},
	parameters: {
		render: args => ({
			components: { AmeliproBtn },
			setup() {
				return { args }
			},
			template: `
				<AmeliproBtn
					v-bind="args"
				>
					{{ args.default }}
				</AmeliproBtn>
			`,
		}),
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproBtn unique-id="my-btn-id">
		My Button
	</AmeliproBtn>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproBtn } from '@cnamts/synapse';
</script>
				`,
			},
		],
	},
}

export const Badge: Story = {
	args: {
		badge: 1,
		badgeBgColor: 'ap-pink',
		badgeColor: 'ap-white',
		default: 'My Button',
		iconBordered: true,
		iconName: 'notifications',
		textColor: 'ap-white',
	},
	parameters: {
		render: args => ({
			components: { AmeliproBtn },
			setup() {
				return { args }
			},
		}),
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproBtn
		:badge="1"
		badge-bg-color="ap-pink"
		badge-text-color="ap-white"
		icon-bordered
		icon-name="notifications"
		unique-id="my-btn-id-2"
	>
		My Button
	</AmeliproBtn>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproBtn } from '@cnamts/synapse';
</script>
				`,
			},
		],
	},
}

export const SecundaryBtn: Story = {
	args: {
		bordered: true,
		color: 'ap-white',
		default: 'My Button',
		hoverColor: 'ap-blue-lighten-3',
		textColor: 'ap-blue-darken-1',
	},

	parameters: {
		render: () => ({
			components: { AmeliproBtn },
			setup() {
				return {}
			},
		}),
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproBtn
		bordered
		color="ap-white"
		hover-color="ap-blue-lighten-3"
		text-color="ap-blue-darken-1"
		unique-id="my-btn-id-3"
	>
		My Button
	</AmeliproBtn>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproBtn } from '@cnamts/synapse';
</script>
				`,
			},
		],
	},
}
