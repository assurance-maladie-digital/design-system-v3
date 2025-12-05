import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproPostalAddressField from './AmeliproPostalAddressField.vue'
import { ref, watch } from 'vue'

const meta = {
	argTypes: {
		'addressRules': { description: 'Liste des règles à respecter pour valider le champ' },
		'required': { description: 'Défini que le groupe de champs est obligatoire' },
		'autoCompleteList': {
			description: 'Liste de villes et codes postaux pour l’autocomplétion',
			table: {
				type: {
					detail: `Array<{
	postalCode: string
	city: string
}>`,
					summary: 'InputPostalAddressAutoCompleteList[]',
				},
			},
		},
		'blur': { description: 'Evénement émit lorsque le focus quitte un champ' },
		'cityRules': { description: 'Liste des règles à respecter pour valider le champ' },
		'disabled': { description: 'Défini le groupe de champs comme désactivé' },
		'groupLabel': { description: 'Défini le label du groupe de champs' },
		'modelValue': {
			description: 'Les valeurs des champs du groupe',
			table: {
				type: {
					detail: `{
	address: string | undefined
	postalCode: string | InputPostalAddressAutoCompleteItem | undefined
	city: string | InputPostalAddressAutoCompleteItem | undefined
	additionalInfo?: string | undefined
}`,
					summary: 'InputPostalAddressGroup',
				},
			},
		},
		'noAdditionalInfo': { description: 'Masque le champs complément d’adresse' },
		'postalCodeRules': { description: 'Liste des règles à respecter pour valider le champ' },
		'readonly': { description: 'Défini que le groupe de champs est en lecture seule' },
		'uniqueId': { description: 'Défini un id pour le groupe de champs' },
		'update:error': { description: 'Evénement émit à la mise à jour de l\'état de validité des champs' },
		'update:model-value': { description: 'Evénement émit à la mise à jour du v-model' },
		'validateOn': { description: 'Défini le moment où la validation du champ se fait, voir la documentation de Vuetify pour plus d’informtations' },
	},
	component: AmeliproPostalAddressField,
	title: 'Composants/Amelipro/Formulaires/AmeliproPostalAddressField',
} as Meta<typeof AmeliproPostalAddressField>
export default meta

type Story = StoryObj<typeof AmeliproPostalAddressField>

export const Default: Story = {
	args: {
		required: true,
		autoCompleteList: [
			{
				city: 'Nantes',
				postalCode: '44000',
			},
			{
				city: 'Paris',
				postalCode: '75000',
			},
			{
				city: 'Marseille',
				postalCode: '13000',
			},
		],
		groupLabel: 'Label du groupe de champs',
		uniqueId: 'my-id',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproPostalAddressField
		v-model="model"
		required
		:auto-complete-list="autoCompleteList"
		group-label="Label du groupe de champs"
		unique-id="my-id"
	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import AmeliproPostalAddressField from '@cnamts/synapse'
	import { ref } from 'vue'

	const model = ref()

	const autoCompleteList = [
		{
			city: 'Nantes',
			postalCode: '44000',
		},
		{
			city: 'Paris',
			postalCode: '75000',
		},
		{
			city: 'Marseille',
			postalCode: '13000',
		},
	] 
</script>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproPostalAddressField },
		setup() {
			const model = ref()
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `
			<AmeliproPostalAddressField
				v-bind="args"
				v-model="model"
			/>
		`,
	}),

}
