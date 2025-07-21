import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproCard from './AmeliproCard.vue'

const meta = {
	argTypes: {
		borderColor: { description: 'Couleur des bordures de la card' },
		bordered: { description: 'Permet d’activer ou de desactiver les bordures de la card' },
		cardColor: { description: 'Couleur du background de la card' },
		cardTitle: { description: 'Valeur du titre de la card' },
		classes: { description: 'Classes personnalisée de la card' },
		contentClasses: { description: 'Partie droite du header du panneau dépliant' },
		default: { description: 'Contenu de la card' },
		divider: { description: 'Permet d’activer ou de desactiver le divider de la card entre le titre et le contenu' },
		fullSizeImg: { description: 'Slot permettant d’ajouter une image qui couvre toute la largeur du bloc entre le header et le contenu' },
		headerLeft: { description: 'Titre de la card' },
		headerRight: { description: 'Header droit de la card' },
		headerRightWidth: { description: 'Défini la largeur de la partie droite des headers des cartes. Cette props est utile seulement si le slot accordion-header-right est utilisé' },
		noCardHeader: { description: 'Permet de supprimer la partie header de la card' },
		rightPart: { description: 'Permet de créer un encart à droite de la card' },
		rightPartClasses: { description: 'Permet des classes sur l’encart à droite de la card' },
		rightPartContent: { description: 'Contenu de la partie droite de la carte, ne sert que si la propriété rightPart est activée' },
		rightPartWidth: { description: 'Permet de gérer la largeur l’encart à droite de la card' },
		titleColor: { description: 'Couleur du titre de la card' },
		titleLevel: { description: 'Permet de changer le niveau du titre' },
		uniqueId: { description: 'Identifiant unique de la carte' },

	},
	component: AmeliproCard,
	title: 'Composants/Amelipro/Cartes/AmeliproCard',
} as Meta<typeof AmeliproCard>
export default meta

type Story = StoryObj<typeof AmeliproCard>

export const Default: Story = {
	args: {
		cardTitle: 'Mon titre',
		default: '[Slot: default]',
		headerRight: '[Slot: headerRight]',
		uniqueId: 'amelipro-card-unique-id',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproCard
		card-title="Mon titre"
		unique-id="amelipro-card-unique-id"
	>
		<template #headerRight>
			<p class="mb-0">
				[Slot: headerRight]
			</p>
		</template>

		<template #default>
			<p class="mb-0">
				[Slot: default]
			</p>
		</template>
	</AmeliproCard>
</template>`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
	import { AmeliproCard } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCard },
		setup() {
			return { args }
		},
		template: `
<AmeliproCard
	v-bind="args"
>
	<template #headerRight>
		<p class="mb-0">
			[Slot: headerRight]
		</p>
	</template>

	<template #default>
		<p class="mb-0">
			[Slot: default]
		</p>
	</template>
</AmeliproCard>`,
	}),
}
