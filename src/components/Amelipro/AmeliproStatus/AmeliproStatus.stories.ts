import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproStatus from './AmeliproStatus.vue'

const meta = {
	argTypes: {
		isSpan: { description: 'Change la balise qui entoure le statut en balise span' },
		label: { description: 'Change le texte du statut' },
		paddingX: { description: 'Padding à gauche et à droite du statut' },
		paddingY: { description: 'Padding en haut et en bas du statut' },
		type: {
			control: 'select',
			description: 'Type de statut parmi ces choix : `success`, `failure`, `action`, `progress`, `closed`, `draft`, `archive` et `canceled`',
			options: ['action', 'archive', 'canceled', 'closed', 'draft', 'failure', 'progress', 'success'],
			table: { type: { summary: 'string' } },
		},
		uniqueId: { description: 'Identifiant unique du statut' },
	},
	component: AmeliproStatus,
	title: 'Composants/Amelipro/AmeliproStatus',
} as Meta<typeof AmeliproStatus>
export default meta

type Story = StoryObj<typeof AmeliproStatus>

export const Default: Story = {
	args: { type: 'draft' },
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproStatus
		type="draft"
	/>
</template>`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
	import { AmeliproStatus } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproStatus },
		setup() {
			return { args }
		},
		template: `
<AmeliproStatus
	v-bind="args"
/>
		`,
	}),
}

export const TypeSuccess: Story = {
	name: 'Succès',
	args: {
		type: 'success',
		label: 'Succès',
		uniqueId: 'status-success',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <p>Statut de type <code>success</code> (vert) avec label personnalisé.</p>
    <AmeliproStatus
        type="success"
        label="Succès"
        unique-id="status-success"
    />
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproStatus },
		setup() { return { args } },
		template: `
<p class="mb-2">Statut de type <code>success</code> (vert) avec label personnalisé.</p>
<AmeliproStatus v-bind="args" />
        `,
	}),
}

export const TypeErreur: Story = {
	name: 'Erreur',
	args: {
		type: 'failure',
		label: 'Erreur détectée',
		uniqueId: 'status-error',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <p>Statut de type <code>failure</code> (rouge) avec label personnalisé.</p>
    <AmeliproStatus
        type="failure"
        label="Erreur détectée"
        unique-id="status-error"
    />
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproStatus },
		setup() { return { args } },
		template: `
<p class="mb-2">Statut de type <code>failure</code> (rouge) avec label personnalisé.</p>
<AmeliproStatus v-bind="args" />
        `,
	}),
}

export const TypeArchive: Story = {
	name: 'Archivé',
	args: {
		type: 'archive',
		label: 'Archivé',
		uniqueId: 'status-archive',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <p>Statut de type <code>archive</code> (gris) avec label personnalisé.</p>
    <AmeliproStatus
        type="archive"
        label="Archivé"
        unique-id="status-archive"
    />
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproStatus },
		setup() { return { args } },
		template: `
<p class="mb-2">Statut de type <code>archive</code> (gris) avec label personnalisé.</p>
<AmeliproStatus v-bind="args" />
        `,
	}),
}

export const TypeEnCours: Story = {
	name: 'En cours',
	args: {
		type: 'progress',
		label: 'Traitement en cours',
		uniqueId: 'status-progress',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <p>Statut de type <code>progress</code> (bleu) avec label personnalisé.</p>
    <AmeliproStatus
        type="progress"
        label="Traitement en cours"
        unique-id="status-progress"
    />
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproStatus },
		setup() { return { args } },
		template: `
<p class="mb-2">Statut de type <code>progress</code> (bleu) avec label personnalisé.</p>
<AmeliproStatus v-bind="args" />
        `,
	}),
}

export const TypeBrouillon: Story = {
	name: 'Brouillon',
	args: {
		type: 'draft',
		label: 'Brouillon',
		uniqueId: 'status-draft',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <p>Statut de type <code>draft</code> (jaune) avec label personnalisé.</p>
    <AmeliproStatus
        type="draft"
        label="Brouillon"
        unique-id="status-draft"
    />
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproStatus },
		setup() { return { args } },
		template: `
<p class="mb-2">Statut de type <code>draft</code> (jaune) avec label personnalisé.</p>
<AmeliproStatus v-bind="args" />
        `,
	}),
}

export const TypeFerme: Story = {
	name: 'Fermé',
	args: {
		type: 'closed',
		label: 'Fermé',
		uniqueId: 'status-closed',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <p>Statut de type <code>closed</code> (violet) avec label personnalisé.</p>
    <AmeliproStatus
        type="closed"
        label="Fermé"
        unique-id="status-closed"
    />
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproStatus },
		setup() { return { args } },
		template: `
<p class="mb-2">Statut de type <code>closed</code> (violet) avec label personnalisé.</p>
<AmeliproStatus v-bind="args" />
        `,
	}),
}

export const TypeAction: Story = {
	name: 'Action',
	args: {
		type: 'action',
		label: 'Action requise',
		uniqueId: 'status-action',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <p>Statut de type <code>action</code> (bleu foncé) avec label personnalisé.</p>
    <AmeliproStatus
        type="action"
        label="Action requise"
        unique-id="status-action"
    />
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproStatus },
		setup() { return { args } },
		template: `
<p class="mb-2">Statut de type <code>action</code> (bleu foncé) avec label personnalisé.</p>
<AmeliproStatus v-bind="args" />
        `,
	}),
}

export const TypeAnnule: Story = {
	name: 'Annulé',
	args: {
		type: 'canceled',
		label: 'Annulé',
		uniqueId: 'status-canceled',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <p>Statut de type <code>canceled</code> (rouge clair) avec label personnalisé.</p>
    <AmeliproStatus
        type="canceled"
        label="Annulé"
        unique-id="status-canceled"
    />
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproStatus },
		setup() { return { args } },
		template: `
<p class="mb-2">Statut de type <code>canceled</code> (rouge clair) avec label personnalisé.</p>
<AmeliproStatus v-bind="args" />
        `,
	}),
}

export const BaliseSpan: Story = {
	name: 'Balise span',
	args: {
		type: 'success',
		label: 'Statut en span',
		isSpan: true,
		uniqueId: 'status-span',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <p>Statut affiché dans une balise <code>span</code> (<code>isSpan</code>).</p>
    <AmeliproStatus
        type="success"
        label="Statut en span"
        is-span
        unique-id="status-span"
    />
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproStatus },
		setup() { return { args } },
		template: `
<p class="mb-2">Statut affiché dans une balise <code>span</code> (<code>isSpan</code>).</p>
<AmeliproStatus v-bind="args" />
        `,
	}),
}

export const PaddingPersonnalise: Story = {
	name: 'Padding personnalisé',
	args: {
		type: 'draft',
		label: 'Padding personnalisé',
		paddingX: '32px',
		paddingY: '12px',
		uniqueId: 'status-padding',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <p>Statut avec padding horizontal et vertical personnalisé (<code>paddingX</code> et <code>paddingY</code>).</p>
    <AmeliproStatus
        type="draft"
        label="Padding personnalisé"
        padding-x="32px"
        padding-y="12px"
        unique-id="status-padding"
    />
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproStatus },
		setup() { return { args } },
		template: `
<p class="mb-2">Statut avec padding horizontal et vertical personnalisé (<code>paddingX</code> et <code>paddingY</code>).</p>
<AmeliproStatus v-bind="args" />
        `,
	}),
}
