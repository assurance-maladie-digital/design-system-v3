import type { Meta, StoryObj } from '@storybook/vue3'
import { fn } from '@storybook/test'
import AmeliproPatientLogged from './AmeliproPatientLogged.vue'
import { ref, watch } from 'vue'

const meta = {
	argTypes: {
        'btnPostalAddress': {description: 'Affiche le bouton adresse postale'},
        'btnPrevention': {description: 'Affiche le bouton prévention'},
		'isRestrictedData': { description: 'affiche la liste des bénéficiaires sans séléction possible' },
		'click': { description: 'Evénement émis au click sur le bouton changer de patient' },
		'click:info': { description: 'Evénement émis au click sur le bouton informations' },
		'click:postal-address': { description: 'Evénement émis au click sur le bouton adresse postale' },
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
						postalAddress: string
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
        'btnPostalAddress': true,
        'btnPrevention': true,
		'doctorTooltipRed': true,
        'isRestrictedData': false,
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
		'onClick:postal-address': fn(),
		'onClick:pdf': fn(),
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<AmeliproPatientLogged
	v-model="myModel"
	:postal-address-info="true"
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

	<template #fundDialog>
		<p>
			Contenu du slot "fundDialog"
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
        template: `
          <div style="display: flex; justify-content: center;">

            <AmeliproPatientLogged
	v-bind="args"
	v-model="model"
	@click="args['onClick']"
	@click:infos="args['onClick:infos']"
    @click:postal-address="args['onClick:postal-address']"
	@click:pdf="args['onClick:pdf']"
    style="width: 350px !important;"
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

	<template #fundDialog>
		<p>
			Contenu du slot "fundDialog"
		</p>
	</template>
            </AmeliproPatientLogged>
          </div>`,
	}),
}
