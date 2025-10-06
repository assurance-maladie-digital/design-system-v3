import type { Meta, StoryObj } from '@storybook/vue3'
import { fn } from '@storybook/test'
import AmeliproPatientLogin from './AmeliproPatientLogin.vue'
import { ref, watch } from 'vue'

const meta = {
	argTypes: {
		'autoCompleteCardItems': {
			description: 'Liste des items pour le champ d\'autocomplétion',
			table: {
				type: {
					detail: `[
						{
							disabled?: boolean
							title: string
							value: string | object
						}
					]`,
					summary: 'AutoCompleteItem',
				},
			},
		},
		'click:vital-card': { description: 'Evénement émis au click sur le bouton "Lire carte"' },
		'click:vital-card-app': { description: 'Evénement émis au click sur le bouton "Lire appli carte vitale"' },
		'disableBtnAppVitalCard': { description: 'Désactive le bouton "Lire appli carte vitale"' },
		'disableBtnNir': { description: 'Désactive le bouton "Valider NIR"' },
		'disableBtnVitalCard': { description: 'Désactive le bouton "Lire carte"' },
		'errorMessageAppVitalCard': { description: 'Message d\'erreur personnalisé concernant la partie Application carte vitale' },
		'errorMessageNir': { description: 'Message d\'erreur personnalisé concernant la partie NIR' },
		'errorMessageVitalCard': { description: 'Message d\'erreur personnalisé concernant la partie carte vitale' },
		'loading': { description: 'Passe le composant dans un affichage en chargement' },
		'messageAppVitalCard': { description: 'Slot pour un message personnalisé concernant la partie application carte vitale' },
		'messageNir': { description: 'Slot pour un message personnalisé concernant la partie NIR' },
		'messageVitalCard': { description: 'Slot pour un message personnalisé concernant la partie carte vitale' },
		'modelValue': {
			description: 'Valeur des champs du formulaire et le la modale pour la version mobile',
			table: {
				type: {
					detail: `{
						dialog: boolean
						formValue?: {
							fieldValue?: string | number
							autoCompleteValue?: AutoCompleteItem | string
						}
					}`,
					summary: 'IPatientLogin',
				},
			},
		},
		'noAppVitalCard': { description: 'Masque la partie Application carte vitale' },
		'noNir': { description: 'Masque la partie NIR' },
		'noVitalCard': { description: 'Masque la partie Carte vitale' },
		'rulesAutoCompleteCard': { description: 'Règles appliquées au champ d\'autocomplétion' },
		'rulesNir': { description: 'Règles appliquées au champ NIR' },
		'submit:nir': { description: 'Evénement émis au click sur le bouton "Valider Le NIR" ou sur la touche "Entrée" dans le champ NIR' },
		'uniqueId': { description: 'Identifiant unique du composant.' },
		'update:model-value': { description: 'Evénement émis au lors de la mise à jour du v-model' },
	},
	component: AmeliproPatientLogin,
	title: 'Composants/Amelipro/IDPA/AmeliproPatientLogin',
} as Meta<typeof AmeliproPatientLogin>

export default meta

type Story = StoryObj<typeof AmeliproPatientLogin>

export const Default: Story = {
	args: {
		'autoCompleteCardItems': [
			{
				title: 'Carte 1',
				value: '1',
			},
			{
				title: 'Carte 2',
				value: '2',
			},
			{
				title: 'Carte 3',
				value: '3',
			},
		],
		'modelValue': {
			dialog: false,
			formValue: {},
		},
		'uniqueId': 'test-id',
		'onClick:vital-card': fn(),
		'onClick:vital-card-app': fn(),
		'onSubmit:nir': fn(),
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<AmeliproPatientLogin
	v-model="myModel"
	:autocomplete-card-items="autocompleteCardItems"
	unique-id="test-id"
/>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproPatientLogin } from '@cnamts/synapse'
	import { ref } from 'vue'

	const autoCompleteCardItems = [
		{
			title: 'Carte 1',
			value: '1',
		},
		{
			title: 'Carte 2',
			value: '2',
		},
		{
			title: 'Carte 3',
			value: '3',
		},
	];

	const myModel = ref({
		dialog: false,
		formValue: {},
	})
</script>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproPatientLogin },
		setup() {
			const model = ref(args.modelValue)

			// Optional: Keeps v-model in sync with storybook args
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<AmeliproPatientLogin
	v-bind="args"
	v-model="model"
	@click:vital-card="args['onClick:vital-card']"
	@click:vital-card-app="args['onClick:vital-card-app']"
	@submit:nir="args['onSubmit:nir']"
/>`,
	}),
}
