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
	title: 'Composants/AmeliproTooltips',
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
