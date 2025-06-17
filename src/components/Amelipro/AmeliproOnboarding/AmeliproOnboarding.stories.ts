import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, watch } from 'vue'
import AmeliproBtn from '../AmeliproBtn/AmeliproBtn.vue'
import AmeliproOnboarding from './AmeliproOnboarding.vue'

const meta = {
	argTypes: {
		'attach': { description: 'attache le contenu de la boite de dialogue et son overlay à l\'intérieur de v-app' },
		'displayImgMobile': { description: 'Affiche l’image en version mobile' },
		'eager': { description: 'Property héritée de Vuetify permettant de charger le contenu de la modale dans le DOM même lorsque la modale est fermée' },
		'finalBtnLabel': { description: 'Label du bouton de fin de tutoriel' },
		'imgHeight': { description: 'Hauteur de l’image' },
		'imgWidth': { description: 'Largeur de l’image' },
		'modelValue': { description: 'État d’ouverture de la modale' },
		'persistent': { description: 'Masque la croix de fermeture ainsi que le bouton "Passer"' },
		'skipBtnLabel': { description: 'Label du bouton permettant de passer le tutoriel' },
		'steps': {
			description: 'Items du tutoriel, chaque item correspond à une étape',
			table: {
				type: {
					detail: `Array<{
	img: string;
	title: string;
	content: string[];
}>`,
					summary: 'IOnboarding[]',
				},
			},
		},
		'title': { description: 'Titre de la modale' },
		'uniqueId': { description: 'Id de la modale' },
		'update:model-value': { description: 'Événement émis au changement à l’ouverture ou la fermeture du tutoriel quand le v-model est mis à jour. Retourne `value`', type: 'boolean' },
		'width': { description: 'Largeur de la fenêtre de dialogue' },
	},
	component: AmeliproOnboarding,
	title: 'Composants/Amelipro/Boites de dialogue/AmeliproOnboarding',
} as Meta<typeof AmeliproOnboarding>
export default meta

type Story = StoryObj<typeof AmeliproOnboarding>

const steps = [
	{
		content: [
			'Dans cet espace, vous allez pouvoir souscrire un contrat d’engagement au dispositif AIR afin de permettre aux professionnels de santé '
			+ 'de votre établissement de consulter le DMP de leurs patients.',
		],
		img: './public/tile-example.svg',
		title: 'Gérez votre contrat d\'accès au DMP en toute simplicité',
	},
	{
		content: [
			'Vous avez la possibilité de désigner les personnes qui seront les contacts privilégiés de l\'Assurance Maladie dans la gestion au quotidien de la solution AIR.',
		],
		img: './public/tile-example.svg',
		title: 'Ajoutez ou modifiez des contacts',
	},
	{
		content: [
			'A partir de la page principale, vous pouvez consulter vos conditions d’engagement et retrouver les documents  '
			+ 'utiles à l’application des conditions de mise en œuvre de la solution AIR.',
		],
		img: './public/tile-example.svg',
		title: 'Retrouvez les informations utiles à la gestion de vos contrats',
	},
]

export const Default: Story = {
	args: {
		modelValue: false,
		steps,
		title: 'Tutoriel',
		uniqueId: 'amelipro-onboarding-unique-id',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div>
		<AmeliproBtn
			unique-id="open-onboarding-btn"
			@click="model = true"
		>
			Ouvrir le tutoriel
		</AmeliproBtn>

		<AmeliproOnboarding
			v-model="model"
			:steps="steps"
			title="Tutoriel"
			unique-id="amelipro-onboarding-unique-id"
		/>
	</div>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	const steps = [
		{
			content: [
				'Dans cet espace, vous allez pouvoir souscrire un contrat d’engagement au dispositif AIR afin de permettre aux professionnels de santé ' 
				+ 'de votre établissement de consulter le DMP de leurs patients.',
			],
			img: './public/tile-example.svg',
			title: 'Gérez votre contrat d’accès au DMP en toute simplicité',
		},
		{
			content: [
				'Vous avez la possibilité de désigner les personnes qui seront les contacts privilégiés de l’Assurance Maladie dans la gestion au quotidien de la solution AIR.',
			],
			img: './public/tile-example.svg',
			title: 'Ajoutez ou modifiez des contacts',
		},
		{
			content: [
				'A partir de la page principale, vous pouvez consulter vos conditions d’engagement et retrouver les documents  ' 
				+ 'utiles à l’application des conditions de mise en œuvre de la solution AIR.',
			],
			img: './public/tile-example.svg',
			title: 'Retrouvez les informations utiles à la gestion de vos contrats',
		},
	];
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproBtn, AmeliproOnboarding },
		setup() {
			const model = ref(args.modelValue)

			// Optional: Keeps v-model in sync with storybook args
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})

			return { args, model }
		},
		template: `
<div>
	<AmeliproBtn
		unique-id="open-onboarding-btn"
		@click="model = true"
	>
		Ouvrir le tutoriel
	</AmeliproBtn>

	<AmeliproOnboarding
		v-bind="args"
		v-model="model"
	/>
</div>
		`,
	}),
}
