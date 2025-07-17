import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, watch } from 'vue'
import AmeliproIconBtn from '../AmeliproIconBtn/AmeliproIconBtn.vue'
import StructureMenu from './StructureMenu.vue'

const meta = {
	argTypes: {
		'cancel': {
			action: 'cancel',
			description: 'event émis à la fermeture de la modale par le bouton annuler',
			type: 'void',
		},
		'change': {
			action: 'change',
			description: 'event émis à la fermeture de la modale par un autre moyen que le bouton de confirmation',
			type: 'boolean',
		},
		'maxStructuresLoadedDefault': { description: 'Le nombre de structures affichées par défaut dans les onglets' },
		'modelValue': {
			description: 'Objet contenant la valeur d’affichage de la modale ainsi que la structure sélectionnée',
			table: {
				type: {
					detail: `{
	dialog: boolean;
	activeTab: number;
	activeValue?: string;
					}`,
					summary: 'IStructureMenuValue',
				},
			},
		},
		'searchBar': { description: 'Slot permettant de rajouter une barre de recherche dans le composant' },
		'structuresTabs': {
			description: 'Onglets et listes de structures associées',
			table: {
				type: {
					detail: `Array<{
	label: string;
	structures: Array<{
		address: string;
		idNumber: string;
		value: string;
		defaultStructure?: boolean;
	}>;
	listLabel?: string;
}>;`,
					summary: 'StructureTab[]',
				},
			},
		},
		'switchValue': { description: 'Valeur du switch' },
		'uniqueId': { description: 'Identifiant unique du composant' },
		'update:model-value': {
			action: 'update:model-value',
			description: 'event emis lorsque le modèle change',
			type: 'IStructureMenuValue + IStructureTabs',
		},
		'userAdeli': { description: 'Le numéro Adeli de l’utilisateur connecté' },
		'userName': { description: 'Le nom de l’utilisateur connecté' },
		'userProfession': { description: 'Le métier de l’utilisateur connecté' },
		'userRpps': { description: 'Le numéro RPPS de l’utilisateur connecté' },
		'validate': {
			action: 'validate',
			description: 'event émis au clic sur le bouton de confirmation de la modale',
			type: `{
	defaultStructure: boolean;
	selected: IStructureTabs;
			}`,
		},

	},
	component: StructureMenu,
	title: 'Composants/Amelipro/Mise en page/Sous-composants du header/StructureMenu',
} as Meta<typeof StructureMenu>
export default meta

type Story = StoryObj<typeof StructureMenu>

const structuresTabs = [
	{
		structures: [
			{
				address: '70 rue de Lyon',
				idNumber: 'XXXXXXXXXX',
				value: 'titu',
			},
			{
				address: '34 avenue de Bordeaux',
				idNumber: 'XXXXXXXXXX',
				value: 'titi',
			},
			{
				address: '47 boulevard du Mans',
				idNumber: 'XXXXXXXXXX',
				value: 'a',
			},
			{
				address: '84 bis rue de Toulouse',
				idNumber: 'XXXXXXXXXX',
				value: 'b',
			},
			{
				address: '103 rue de Paris',
				idNumber: 'XXXXXXXXXX',
				value: 'c',
			},
			{
				address: '21 rue de Nantes',
				idNumber: 'XXXXXXXXXX',
				value: 'd',
			},
		],
		label: 'Mes structures',
	},
	{
		structures: [
			{
				address: '39 rue de Rennes',
				idNumber: 'XXXXXXXXXX',
				value: 'e',
			},
			{
				address: '40 rue de Vannes',
				idNumber: 'XXXXXXXXXX',
				value: 'f',
			},
			{
				address: '50 Avenue de Marseille',
				idNumber: 'XXXXXXXXXX',
				value: 'g',
			},
			{
				address: '62 Boulevard de Lille',
				idNumber: 'XXXXXXXXXX',
				value: 'h',
			},
		],
		label: 'Mes délégués',
	},
]

export const Default: Story = {
	args: {
		modelValue: { dialog: false, activeTab: 0 },
		structuresTabs,
		uniqueId: 'structure-menu-unique-id',
		userAdeli: 'n° Adeli',
		userName: 'Jean Martin',
		userProfession: 'Médecin génraliste',
		userRpps: 'n° RPPS',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div>
				<AmeliproIconBtn
					btn-label="Sélection de structure"
					icon="localisation"
					icon-bg-color="ap-blue-darken-1"
					icon-color="ap-white"
					icon-hover-bg-color="ap-blue-darken-2"
					icon-hover-color="ap-white"
					size="2rem"
					unique-id="structure-menu-unique-id-open-btn"
					@click="model.dialog = true"
				/>
				<StructureMenu
					v-model="model"
					unique-id="structure-menu-unique-id"
					user-adeli="n° Adeli"
					user-name="Jean Martin"
					user-profession="Médecin génraliste"
					user-rpps="n° RPPS"
					@cancel="args['cancel']"
					@change="args['change']"
					@validate="args['validate']"
					@update:model-value="args['update:model-value']"
				/>
	</div>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import StructureMenu from '@cnamts/synapse';
	import { ref } from 'vue';

	const model = ref({ dialog: false, activeTab: 0 });
	const structuresTabs = [
		{
			structures: [
				{
					address: '70 rue de Lyon',
					idNumber: 'XXXXXXXXXX',
					value: 'titu',
				},
				{
					address: '34 avenue de Bordeaux',
					idNumber: 'XXXXXXXXXX',
					value: 'titi',
				},
				{
					address: '47 boulevard du Mans',
					idNumber: 'XXXXXXXXXX',
					value: 'a',
				},
				{
					address: '84 bis rue de Toulouse',
					idNumber: 'XXXXXXXXXX',
					value: 'b',
				},
				{
					address: '103 rue de Paris',
					idNumber: 'XXXXXXXXXX',
					value: 'c',
				},
				{
					address: '21 rue de Nantes',
					idNumber: 'XXXXXXXXXX',
					value: 'd',
				},
			],
			label: 'Mes structures',
		},
		{
			structures: [
				{
					address: '39 rue de Rennes',
					idNumber: 'XXXXXXXXXX',
					value: 'e',
				},
				{
					address: '40 rue de Vannes',
					idNumber: 'XXXXXXXXXX',
					value: 'f',
				},
				{
					address: '50 Avenue de Marseille',
					idNumber: 'XXXXXXXXXX',
					value: 'g',
				},
				{
					address: '62 Boulevard de Lille',
					idNumber: 'XXXXXXXXXX',
					value: 'h',
				},
			],
			label: 'Mes délégués',
		},
	];
</script>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproIconBtn, StructureMenu },
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
	<AmeliproIconBtn
		btn-label="Sélection de structure"
		icon="localisation"
		icon-bg-color="ap-blue-darken-1"
		icon-color="ap-white"
		icon-hover-bg-color="ap-blue-darken-2"
		icon-hover-color="ap-white"
		size="2rem"
		:unique-id="\`\${args.uniqueId}-open-btn\`"
		@click="model.dialog = true"
	/>
	<StructureMenu
		v-bind="args"
		v-model="model"
		@cancel="args['cancel']"
		@change="args['change']"
		@validate="args['validate']"
		@update:model-value="args['update:model-value']"
	/>
</div>`,
	}),
}
