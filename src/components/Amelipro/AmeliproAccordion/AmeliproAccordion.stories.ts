import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproAccordion from './AmeliproAccordion.vue'

const meta = {
	argTypes: {
		accordionTitle: { description: 'Titre du panneau dépliant' },
		borderColor: { description: 'Couleur de bordure du panneau dépliant' },
		bordered: { description: 'Défini une bordure au panneau dépliant' },
		cardColor: { description: 'Couleur de fond du panneau dépliant' },
		default: { description: 'Contenu du panneau dépliant' },
		headerRight: { description: 'Partie droite du header du panneau dépliant' },
		headerRightWidth: { description: 'Défini la largeur de la partie droite du header de la carte. Cette props est utile seulement si le slot headerRight est utilisé' },
		hideSeparator: { description: 'Masque le séparateur entre le titre et le contenu des panneaux dépliants' },
		isOpen: { description: 'Défini si le panneau dépliant est ouvert au chargement du composant' },
		openClose: { description: 'Fonction permettant d’ouvrir ou fermer l’accordéon', type: 'void' },
		titleLevel: { description: 'Niveau du titre du panneau dépliant' },
		titleUppercase: { description: 'Transforme le titre du panneau dépliant en lettres capitales' },
		uniqueId: { description: 'Identifiant unique du panneau dépliant' },
	},
	component: AmeliproAccordion,
	title: 'Composants/Amelipro/Blocs dépliants/AmeliproAccordion',
} as Meta<typeof AmeliproAccordion>
export default meta

type Story = StoryObj<typeof AmeliproAccordion>

export const Default: Story = {
	args: {
		accordionTitle: 'Mon titre',
		default: '[Slot: default]',
		headerRight: '[Slot: headerRight]',
		uniqueId: 'amelipro-accordion-unique-id',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproAccordion
		accordion-title="Mon titre"
		class="w-100"
		unique-id="amelipro-accordion-unique-id"
	>
		<template #default>
			[Slot: default]
		</template>

		<template #headerRight>
			[Slot: headerRight]
		</template>
	</AmeliproAccordion>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproAccordion } from '@cnamts/synapse'
</script>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAccordion },
		setup() {
			return { args }
		},
		template: `
<AmeliproAccordion
	class="w-100"
	v-bind="args"
>
	<template #default>
		{{ args.default }}
	</template>

	<template #headerRight>
		{{ args.headerRight }}
	</template>
</AmeliproAccordion>
`,
	}),
}
