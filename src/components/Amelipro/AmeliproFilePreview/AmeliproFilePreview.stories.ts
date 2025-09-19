import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproFilePreview from './AmeliproFilePreview.vue'

const meta = {
	argTypes: {
		cardTitle: { description: 'Titre de la carte du FilePreview' },
		downloadBtnText: { description: 'Texte du bouton de téléchargement' },
		fileName: { description: 'Nom du fichier PDF' },
		fileSrc: { description: 'Url du fichier PDF' },
		foldable: { description: 'Transforme la carte en carte dépliante' },
		iframeTitle: { description: 'Titre de l’iframe contenant l’aperçu du fichier' },
		isOpen: { description: 'Statut par défaut de la carte dépliante' },
		linkTitle: { description: 'Titre du lien de téléchargement du fichier, il doit reprendre l’intitulé du bouton et informer si possible sur le format du fichier à télécharger ainsi que sur sa taille (exemple : Télécharger le fichier au format PDF - 3Mo)' },
		previewHeight: { description: 'Hauteur de l’iframe' },
		uniqueId: { description: 'Identifiant unique' },
	},
	component: AmeliproFilePreview,
	title: 'Composants/AmeliproFilePreview',
} as Meta<typeof AmeliproFilePreview>
export default meta

type Story = StoryObj<typeof AmeliproFilePreview>

export const Default: Story = {
	args: {
		cardTitle: 'Titre de la carte',
		downloadBtnText: 'Télécharger',
		fileName: 'Nom du fichier',
		fileSrc: '/amelipro/pdf/charte-pour-pdf.pdf',
		foldable: false,
		iframeTitle: 'Aperçu du fichier PDF',
		isOpen: false,
		linkTitle: 'Télécharger le fichier au Format PDF',
		previewHeight: 550,
		uniqueId: 'amelipro-file-preview-unique-id',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproFilePreview
		card-title="Titre de la carte"
		download-btn-text="Télécharger"
		file-name="Nom du fichier"
		file-src="/amelipro/pdf/charte-pour-pdf.pdf"
		:foldable="false"
		iframe-title="Aperçu du fichier PDF"
		:is-open="false"
		link-title="Télécharger le fichier au Format PDF"
		:preview-height="550"
		unique-id="amelipro-file-preview-unique-id"
	/>
</template>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproFilePreview },
		setup() {
			return { args }
		},
		template: `
<AmeliproFilePreview
	v-bind="args"
/>
		`,
	}),

}
