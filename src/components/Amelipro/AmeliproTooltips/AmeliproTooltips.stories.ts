import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproTooltips from './AmeliproTooltips.vue'

const meta = {
	argTypes: {
		btnLabel: { description: 'Libellé du bouton d’ouverture de la bulle d’information' },
		iconBgColor: { description: 'Couleur de fond pour l’icône du bouton d’ouverture de la bulle d’information' },
		iconColor: { description: 'Couleur de l’icône du bouton d’ouverture de la bulle d’information' },
		iconHoverBgColor: { description: 'Couleur de fond pour l’icône au survol du bouton d’ouverture de la bulle d’information' },
		iconHoverColor: { description: 'Couleur de l’icône au survol du bouton d’ouverture de la bulle d’information' },
		iconName: { description: 'Nom de l’icône personnalisée' },
		tooltipBg: { description: 'Couleur de fond du Tooltips' },
		tooltipText: { description: 'Texte du Tooltips' },
		tooltipTextColor: { description: 'Couleur du text du Tooltips' },
		uniqueId: { description: 'Défini l’id du tooltip dans le DOM' },
	},
	component: AmeliproTooltips,
	title: 'Composants/Amelipro/AmeliproTooltips',
} as Meta<typeof AmeliproTooltips>
export default meta

type Story = StoryObj<typeof AmeliproTooltips>

export const Default: Story = {
	args: {
		tooltipText: 'Contenu de mon infobulle',
		uniqueId: 'amelipro-tooltip-id',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproTooltips
		tooltip-text="Contenu de mon infobulle"
		unique-id="amelipro-tooltip-id"
	/>
</template>
				`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
	import { AmeliproTooltips } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTooltips },
		setup() {
			return { args }
		},
		template: `
<AmeliproTooltips
	v-bind="args"
/>
		`,
	}),
}

export const CouleursPersonnalisees: Story = {
	name: 'Couleurs personnalisées',
	args: {
		tooltipText: 'Info-bulle personnalisée avec couleurs',
		tooltipBg: 'ap-parme-darken-1',
		tooltipTextColor: 'ap-white',
		iconBgColor: 'ap-parme-darken-1',
		iconColor: 'ap-white',
		iconHoverBgColor: 'ap-white',
		iconHoverColor: 'ap-parme-darken-1',
		uniqueId: 'tooltip-couleurs',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <p>Info-bulle avec couleurs personnalisées pour l’icône et le fond de l’infobulle.</p>
    <AmeliproTooltips
        tooltip-text="Info-bulle personnalisée avec couleurs"
        tooltip-bg="ap-parme-darken-1"
        tooltip-text-color="ap-white"
        icon-bg-color="ap-parme-darken-1"
        icon-color="ap-white"
        icon-hover-bg-color="ap-white"
        icon-hover-color="ap-parme-darken-1"
        unique-id="tooltip-couleurs"
    />
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTooltips },
		setup() { return { args } },
		template: `
<p class="mb-2">Info-bulle avec couleurs personnalisées pour l’icône et le fond de l’infobulle.</p>
<AmeliproTooltips v-bind="args" />
        `,
	}),
}

export const TexteLong: Story = {
	name: 'Texte long',
	args: {
		tooltipText: 'Ceci est un texte très long pour tester l’affichage de l’info-bulle sur plusieurs lignes. Le composant doit gérer correctement le retour à la ligne et la largeur maximale.',
		uniqueId: 'tooltip-long',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <p>Info-bulle avec un texte très long pour vérifier le retour à la ligne et la largeur maximale.</p>
    <AmeliproTooltips
        tooltip-text="Ceci est un texte très long pour tester l’affichage de l’info-bulle sur plusieurs lignes. Le composant doit gérer correctement le retour à la ligne et la largeur maximale."
        unique-id="tooltip-long"
    />
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTooltips },
		setup() { return { args } },
		template: `
<p class="mb-2">Info-bulle avec un texte très long pour vérifier le retour à la ligne et la largeur maximale.</p>
<AmeliproTooltips v-bind="args" />
        `,
	}),
}

export const IconePersonnalisee: Story = {
	name: 'Icône personnalisée',
	args: {
		iconName: 'plus',
		iconBgColor: 'ap-blue-darken-1',
		iconColor: 'ap-white',
		iconHoverBgColor: 'ap-white',
		iconHoverColor: 'ap-blue-darken-1',
		tooltipText: 'Icône personnalisée',
		uniqueId: 'tooltip-icon-custom',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <p>Info-bulle avec une icône personnalisée (<code>iconName</code>).</p>
    <AmeliproTooltips
        icon-name="plus"
        icon-bg-color="ap-blue-darken-1"
        icon-color="ap-white"
        icon-hover-bg-color="ap-white"
        icon-hover-color="ap-blue-darken-1"
        tooltip-text="Icône personnalisée"
        unique-id="tooltip-icon-custom"
    />
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTooltips },
		setup() { return { args } },
		template: `
<p class="mb-2">Info-bulle avec une icône personnalisée (<code>iconName</code>).</p>
<AmeliproTooltips v-bind="args" />
        `,
	}),
}

export const SlotDefault: Story = {
	name: 'Slot default',
	args: {
		tooltipText: '',
		uniqueId: 'tooltip-slot-default',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <p>Utilisation du slot <code>default</code> pour personnaliser le contenu de l’info-bulle.</p>
    <AmeliproTooltips
        tooltip-text=""
        unique-id="tooltip-slot-default"
    >
        <template #default>
            <div style="max-width:220px">
                <strong>Contenu riche</strong><br>
                <ul style="margin:0;padding-left:1em;">
                    <li>Point 1</li>
                    <li>Point 2</li>
                </ul>
            </div>
        </template>
    </AmeliproTooltips>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { AmeliproTooltips } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTooltips },
		setup() { return { args } },
		template: `
<p class="mb-2">Utilisation du slot <code>default</code> pour personnaliser le contenu de l’info-bulle.</p>
<AmeliproTooltips v-bind="args">
    <template #default>
        <div style="max-width:220px">
            <strong>Contenu riche</strong><br>
            <ul style="margin:0;padding-left:1em;">
                <li>Point 1</li>
                <li>Point 2</li>
            </ul>
        </div>
    </template>
</AmeliproTooltips>
        `,
	}),
}

export const SlotActivator: Story = {
	name: 'Slot tooltipActivator',
	args: {
		tooltipText: 'Info-bulle déclenchée par un bouton personnalisé',
		uniqueId: 'tooltip-activator',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <p>Utilisation du slot <code>tooltipActivator</code> pour personnaliser l’élément déclencheur de l’info-bulle.</p>
    <AmeliproTooltips
        tooltip-text="Info-bulle déclenchée par un bouton personnalisé"
        unique-id="tooltip-activator"
    >
        <template #tooltipActivator="{ props, show }">
            <button class="btn btn-primary" @click="show = !show">Survolez-moi</button>
        </template>
    </AmeliproTooltips>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { AmeliproTooltips } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTooltips },
		setup() { return { args } },
		template: `
<p class="mb-2">Utilisation du slot <code>tooltipActivator</code> pour personnaliser l’élément déclencheur de l’info-bulle.</p>
<AmeliproTooltips v-bind="args">
    <template #tooltipActivator="{ props, show }">
        <button class="btn btn-primary" @click="show = !show">Survolez-moi</button>
    </template>
</AmeliproTooltips>
        `,
	}),
}
