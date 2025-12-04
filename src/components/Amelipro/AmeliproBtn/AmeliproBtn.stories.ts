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
		underline: { description: 'Souligne le texte du bouton/lien.' },
		uniqueId: { description: 'Identifiant unique du bouton/lien' },
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

export const AvecBadge: Story = {
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

export const CouleurEtTexteParDefaut: Story = {
	name: 'Couleur et texte par défaut',
	args: {
		default: 'Bouton par défaut',
		uniqueId: 'btn-default',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <AmeliproBtn unique-id="btn-default">
        Bouton par défaut
    </AmeliproBtn>
</template>
                `,
			},
		],
	},
	render: args => ({
		components: { AmeliproBtn },
		setup() { return { args } },
		template: `
<p class="mb-2">Bouton avec couleur et texte par défaut.</p>
<AmeliproBtn v-bind="args">
    {{ args.default }}
</AmeliproBtn>
        `,
	}),
}

export const AvecIconeAGauche: Story = {
	name: 'Icône à gauche',
	args: {
		default: 'Bouton avec icône à gauche',
		iconName: 'chrono',
		iconLeft: true,
		uniqueId: 'btn-icon-left',
		color: 'ap-blue-darken-1',
		textColor: 'ap-white',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <AmeliproBtn
        icon-name="chrono"
        icon-left
        unique-id="btn-icon-left"
        color="ap-blue-darken-1"
        text-color="ap-white"
    >
        Bouton avec icône à gauche
    </AmeliproBtn>
</template>
                `,
			},
		],
	},
	render: args => ({
		components: { AmeliproBtn },
		setup() { return { args } },
		template: `
<p class="mb-2">Bouton avec une icône à gauche (<code>iconLeft</code>).</p>
<AmeliproBtn v-bind="args">
    {{ args.default }}
</AmeliproBtn>
        `,
	}),
}

export const Desactive: Story = {
	name: 'Désactivé',
	args: {
		default: 'Bouton désactivé',
		disabled: true,
		uniqueId: 'btn-disabled',
		color: 'ap-blue-darken-1',
		textColor: 'ap-white',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <AmeliproBtn
        disabled
        unique-id="btn-disabled"
        color="ap-blue-darken-1"
        text-color="ap-white"
    >
        Bouton désactivé
    </AmeliproBtn>
</template>
                `,
			},
		],
	},
	render: args => ({
		components: { AmeliproBtn },
		setup() { return { args } },
		template: `
<p class="mb-2">Bouton désactivé (<code>disabled</code>).</p>
<AmeliproBtn v-bind="args">
    {{ args.default }}
</AmeliproBtn>
        `,
	}),
}

export const TexteSeul: Story = {
	name: 'Texte seul',
	args: {
		default: 'Bouton texte seul',
		text: true,
		color: 'ap-blue-darken-1',
		textColor: 'ap-blue-darken-1',
		uniqueId: 'btn-text-only',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <AmeliproBtn
        text
        color="ap-blue-darken-1"
        text-color="ap-blue-darken-1"
        unique-id="btn-text-only"
    >
        Bouton texte seul
    </AmeliproBtn>
</template>
                `,
			},
		],
	},
	render: args => ({
		components: { AmeliproBtn },
		setup() { return { args } },
		template: `
<p class="mb-2">Bouton affiché sans fond, uniquement en texte (<code>text</code>).</p>
<AmeliproBtn v-bind="args">
    {{ args.default }}
</AmeliproBtn>
        `,
	}),
}
