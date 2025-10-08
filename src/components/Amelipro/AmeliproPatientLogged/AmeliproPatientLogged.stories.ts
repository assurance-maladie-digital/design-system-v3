import type { Meta, StoryObj } from '@storybook/vue3'
import { fn } from '@storybook/test'
import AmeliproPatientLogged from './AmeliproPatientLogged.vue'
import { ref, watch } from 'vue'

const meta = {
	argTypes: {
		'btnMoreInfo': { description: 'Affiche le bouton plus d\'informations' },
		'click': { description: 'Evénement émis au click sur le bouton changer de patient' },
		'click:info': { description: 'Evénement émis au click sur le bouton informations' },
		'click:more-info': { description: 'Evénement émis au click sur le bouton plus d\'informations' },
		'click:pdf': { description: 'Evénement émis au click sur le bouton pdf' },
		'default': { description: 'Espace libre avant le bouton informations supplémentaire au cas où il y aurait besoin de lignes supplémentaires' },
		'doctor': { description: 'Slot permettant de remplacer le contenu de la ligne médecin traitant au besoin' },
		'doctorDialog': { description: 'Slot permettant de renseigner le contenu de la modale médecin traitant' },
		'doctorDialogFooter': { description: 'Slot permettant de renseigner le contenu du footer de la modale médecin traitant' },
		'doctorTooltipRed': { description: 'Change la couleur du bouton de la tooltip pour la ligne médecin traitant' },
		'exemptionDialog': { description: 'Slot permettant de renseigner le contenu de la modale exonération TM' },
		'errorMessage': { description: 'Change le type du message affiché ne sert que si le slot `message` est rempli' },
		'fundDialog': { description: 'Slot permettant de renseigner le contenu de la modale caisse' },
		'labels': {
			description: 'Valeur des titres pour chaque ligne',
			table: {
				type: {
					detail: `{
						ame: string
						birthdate: string
						btnLabel: string
						center: string
						c2s: string
						doctor: string
						doctorDialogBtn: string
						doctorDialogTitle: string
						exemption: string
						exemptionDialogTitle: string
						exemptionLine2: string
						firstName: string
						fund: string
						fundDialogTitle: string
						moreInfo: string
						mtm: string
						name: string
						nir: string
						plan: string
						rank: string
						rights: string
						selectLabel: string
					}`,
					summary: 'IPatientInfoLabels',
				},
			},
		},
		'message': { description: 'Slot permettant de renseigner un message d\'information ou d\'erreur' },
		'modelValue': { description: 'Valeur du select permettant de choisir un autre bénéficiaire' },
		'noPdfBtn': { description: 'Masque le bouton pdf' },
		'patientInfos': {
			description: 'Informations concernant le patient',
			table: {
				type: {
					detail: `{
						birthdate?: string
						center?: string
						exemptionDialogBtnText?: string
						firstName?: string
						name?: string
						nir?: string
						rank?: string
						fund?: string
						fundTooltip?: string
						doctor?: string
						doctorTooltip?: string
						exemption?: string
						exemptionLine2?: string
						plan?: string
						rights?: string
						c2s?: string
						c2sTooltip?: string
						ame?: string
						mtm?: string
						selectItems?: SelectItem[]
					}`,
					summary: 'IPatientInfos',
				},
			},
		},
		'uniqueId': { description: 'Identifiant unique du composant' },
		'update:model-value': { description: 'Evénement émis à la mise à jour du v-model' },
	},
	component: AmeliproPatientLogged,
	title: 'Composants/Amelipro/IDPA/AmeliproPatientLogged',
} as Meta<typeof AmeliproPatientLogged>

export default meta

type Story = StoryObj<typeof AmeliproPatientLogged>

export const Default: Story = {
	args: {
		'btnMoreInfo': true,
		'doctorTooltipRed': true,
		'patientInfos': {
			ame: 'oui',
			birthdate: '09/11/1992 (32 ans)',
			c2s: 'non',
			c2sTooltip: 'c2s tooltip',
			doctor: 'Voir détail MT',
			doctorTooltip: 'doctor tooltip',
			exemption: 'ALD hors liste',
			firstName: 'prénom',
			fund: 'CPAM du Puy de Dome',
			fundTooltip: 'fund tooltip',
			mtm: 'Allocation de solidarité aux personnes âgées',
			name: 'nom',
			nir: '123456789012345',
			plan: 'Régime Général',
			rank: '1',
			rights: 'oui',
			selectItems: [
				{
					title: 'Patient 1',
					value: 1,
				},
				{
					title: 'Patient 2',
					value: 2,
				},
				{
					title: 'Patient 3',
					value: 3,
				},
			],
		},
		'uniqueId': 'test-id',
		'onClick': fn(),
		'onClick:info': fn(),
		'onClick:more-info': fn(),
		'onClick:pdf': fn(),
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<AmeliproPatientLogged
	v-model="myModel"
	:btn-more-info="true"
	:doctor-tooltip-red="true"
	:patient-infos="{
		ame: 'oui',
		birthdate: '09/11/1992 (32 ans)',
		c2s: 'non',
		c2sTooltip: 'c2s tooltip',
		doctor: 'Voir détail MT',
		doctorTooltip: 'doctor tooltip',
		exemption: 'ALD hors liste',
		firstName: 'prénom',
		fund: 'CPAM du Puy de Dome',
		fundTooltip: 'fund tooltip',
		mtm: 'Allocation de solidarité aux personnes âgées',
		name: 'nom',
		nir: '123456789012345',
		plan: 'Régime Général',
		rank: '1',
		rights: 'oui',
		selectItems: [
			{
				title: 'Patient 1',
				value: 1,
			},
			{
				title: 'Patient 2',
				value: 2,
			},
			{
				title: 'Patient 3',
				value: 3,
			},
		],
	}"
	unique-id="test-id"
>
	<template #doctor>
		<p>
			Contenu du slot "doctorDialog"
		</p>
	</template>

	<template #doctorDialogFooter>
		<p>
			Contenu du slot "doctorDialogFooter"
		</p>
	</template>
</AmeliproPatientLogged>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproPatientLogged } from '@cnamts/synapse'
	import { ref } from 'vue'

	const myModel = ref()
</script>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproPatientLogged },
		setup() {
			const model = ref(args.modelValue)

			// Optional: Keeps v-model in sync with storybook args
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<AmeliproPatientLogged
	v-bind="args"
	v-model="model"
	@click="args['onClick']"
	@click:infos="args['onClick:infos']"
	@click:more-infos="args['onClick:more-infos']"
	@click:pdf="args['onClick:pdf']"
>
	<template #doctorDialog>
		<p>
			Contenu du slot "doctorDialog"
		</p>
	</template>

	<template #doctorDialogFooter>
		<p>
			Contenu du slot "doctorDialogFooter"
		</p>
	</template>
</AmeliproPatientLogged>`,
	}),
}
