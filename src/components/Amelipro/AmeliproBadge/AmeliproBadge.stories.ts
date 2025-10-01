import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproBadge from './AmeliproBadge.vue'

const meta = {
	argTypes: {
		badgeColor: { description: 'Défini la couleur du badge' },
		badgeContent: { description: 'Texte à l’intérieur du badge' },
		badgeTextColor: { description: 'Défini la couleur du text du badge' },
		isSpan: { description: 'Gère le type de balise HTML du composant, `p` ou `span`' },
		roundedRight: { description: 'Active l’apparence label avec un border radius a droite' },
		uniqueId: { description: 'Identifiant unique du badge' },
	},
	component: AmeliproBadge,
	title: 'Composants/Amelipro/AmeliproBadge',
} as Meta<typeof AmeliproBadge>
export default meta

type Story = StoryObj<typeof AmeliproBadge>

export const Default: Story = {
	args: { badgeContent: 'Contenu du badge' },
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproBadge
		badge-content="Contenu du badge"
	/>
</template>
				`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
	import { AmeliproBadge } from '@cnamts/synapse'
</script>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproBadge },
		setup() {
			return { args }
		},
		template: `
			<AmeliproBadge
				v-bind="args"
			/>
		`,
	}),
}

export const CouleurPersonnalisee: Story = {
	name: 'Couleur personnalisée',
	args: {
		badgeContent: 'Badge vert',
		badgeColor: '#007863',
		badgeTextColor: '#fff',
		uniqueId: 'badge-vert',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <AmeliproBadge
        badge-content="Badge vert"
        badge-color="#007863"
        badge-text-color="#fff"
        unique-id="badge-vert"
    />
</template>
                `,
			},
		],
	},
	render: args => ({
		components: { AmeliproBadge },
		setup() { return { args } },
		template: `
<p class="mb-2">Badge avec couleur de fond et couleur de texte personnalisées.</p>
<AmeliproBadge v-bind="args" />
        `,
	}),
}

export const ArrondiDroite: Story = {
	name: 'Arrondi à droite',
	args: {
		badgeContent: 'Arrondi à droite',
		roundedRight: true,
		uniqueId: 'badge-arrondi',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <AmeliproBadge
        badge-content="Arrondi à droite"
        rounded-right
        unique-id="badge-arrondi"
    />
</template>
                `,
			},
		],
	},
	render: args => ({
		components: { AmeliproBadge },
		setup() { return { args } },
		template: `
<p class="mb-2">Badge avec arrondi à droite (<code>roundedRight</code>).</p>
<AmeliproBadge v-bind="args" />
        `,
	}),
}

export const BaliseSpan: Story = {
	name: 'Balise span',
	args: {
		badgeContent: 'Badge en span',
		isSpan: true,
		uniqueId: 'badge-span',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <AmeliproBadge
        badge-content="Badge en span"
        is-span
        unique-id="badge-span"
    />
</template>
                `,
			},
		],
	},
	render: args => ({
		components: { AmeliproBadge },
		setup() { return { args } },
		template: `
<p class="mb-2">Badge affiché avec une balise <code>span</code> (<code>isSpan</code>).</p>
<AmeliproBadge v-bind="args" />
        `,
	}),
}
