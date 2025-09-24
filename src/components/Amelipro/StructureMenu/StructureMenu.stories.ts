import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, watch } from 'vue'
import AmeliproIconBtn from '../AmeliproIconBtn/AmeliproIconBtn.vue'
import StructureMenu from './StructureMenu.vue'
import type { StructureTab } from './StructureTabs/types'

const meta = {
	argTypes: {
		'cancel': { description: 'event émis à la fermeture de la modale par le bouton annuler' },
		'change': { description: 'event émis à la fermeture de la modale par un autre moyen que le bouton de confirmation' },
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
		'update:model-value': { description: 'event emis lorsque le modèle change' },
		'userAdeli': { description: 'Le numéro Adeli de l’utilisateur connecté' },
		'userName': { description: 'Le nom de l’utilisateur connecté' },
		'userProfession': { description: 'Le métier de l’utilisateur connecté' },
		'userRpps': { description: 'Le numéro RPPS de l’utilisateur connecté' },
		'validate': { description: 'event émis au clic sur le bouton de confirmation de la modale' },

	},
	component: StructureMenu,
	title: 'Composants/Amelipro/Mise en page/Sous-composants du header/StructureMenu',
} as Meta<typeof StructureMenu>
export default meta

type Story = StoryObj<typeof StructureMenu>

const structuresTabs: StructureTab[] = [
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
					:structures-tabs="structuresTabs"
					unique-id="structure-menu-unique-id"
					user-adeli="n° Adeli"
					user-name="Jean Martin"
					user-profession="Médecin génraliste"
					user-rpps="n° RPPS"
				/>
	</div>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproIconBtn, StructureMenu } from '@cnamts/synapse'
	import { ref } from 'vue'

	const model = ref({ dialog: false, activeTab: 0 })
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
				if (newValue !== undefined) {
					model.value = newValue
				}
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
	/>
</div>`,
	}),
}

// --- Exemple avec plus de structures et maxStructuresLoadedDefault personnalisé ---
export const PlusieursStructures: Story = {
	name: 'Plusieurs structures (maxStructuresLoadedDefault)',
	args: {
		uniqueId: 'structure-menu-max',
		userAdeli: '2345678',
		userName: 'Dr. Max',
		userProfession: 'Chirurgien',
		userRpps: '8765432',
		structuresTabs: [
			{
				label: 'Structures A à C',
				structures: [
					{ address: '1 rue A', idNumber: 'A001', value: 'A' },
					{ address: '2 rue B', idNumber: 'B002', value: 'B' },
					{ address: '3 rue C', idNumber: 'C003', value: 'C' },
				],
			},
			{
				label: 'Structures D à F',
				structures: [
					{ address: '4 rue D', idNumber: 'D004', value: 'D' },
					{ address: '5 rue E', idNumber: 'E005', value: 'E' },
					{ address: '6 rue F', idNumber: 'F006', value: 'F' },
				],
			},
		],
		modelValue: { dialog: false, activeTab: 0, activeValue: 'A' },
		maxStructuresLoadedDefault: 3,
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
            unique-id="structure-menu-max-open-btn"
            @click="model.dialog = true"
        />
        <StructureMenu
            v-model="model"
            :structures-tabs="structuresTabs"
            unique-id="structure-menu-max"
            user-adeli="2345678"
            user-name="Dr. Max"
            user-profession="Chirurgien"
            user-rpps="8765432"
            :max-structures-loaded-default="3"
        />
    </div>
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproIconBtn, StructureMenu },
		setup() {
			const model = ref({ ...args.modelValue })
			watch(() => args.modelValue, (newValue) => {
				if (newValue !== undefined) {
					model.value = newValue
				}
			})
			return { args, model }
		},
		template: `
<p class="mb-2">Affichage du sélecteur avec plus de structures et une limite personnalisée (<code>maxStructuresLoadedDefault</code>).</p>
<div>
    <AmeliproIconBtn
        btn-label="Sélection de structure"
        icon="localisation"
        icon-bg-color="ap-blue-darken-1"
        icon-color="ap-white"
        icon-hover-bg-color="ap-blue-darken-2"
        icon-hover-color="ap-white"
        size="2rem"
        unique-id="structure-menu-max-open-btn"
        @click="model.dialog = true"
    />
    <StructureMenu
        v-bind="args"
        v-model="model"
    />
</div>
        `,
	}),
}

export const SwitchValuePersonnalise: Story = {
	name: 'Switch value personnalisé',
	args: {
		uniqueId: 'structure-menu-switch',
		userAdeli: '3456789',
		userName: 'Dr. Switch',
		userProfession: 'Pédiatre',
		userRpps: '9876543',
		structuresTabs: [
			{
				label: 'Structures X et Y',
				structures: [
					{ address: '10 rue X', idNumber: 'X010', value: 'X' },
					{ address: '20 rue Y', idNumber: 'Y020', value: 'Y' },
				],
			},
		],
		modelValue: { dialog: false, activeTab: 1, activeValue: 'Y' },
		switchValue: 'Valeur personnalisée',
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
            unique-id="structure-menu-switch-open-btn"
            @click="model.dialog = true"
        />
        <StructureMenu
            v-model="model"
            :structures-tabs="structuresTabs"
            unique-id="structure-menu-switch"
            user-adeli="3456789"
            user-name="Dr. Switch"
            user-profession="Pédiatre"
            user-rpps="9876543"
            switch-value="Valeur personnalisée"
        />
    </div>
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproIconBtn, StructureMenu },
		setup() {
			const model = ref({ ...args.modelValue })
			watch(() => args.modelValue, (newValue) => {
				if (newValue !== undefined) {
					model.value = newValue
				}
			})
			return { args, model }
		},
		template: `
<p class="mb-2">Switch avec une valeur personnalisée (<code>switchValue</code>).</p>
<div>
    <AmeliproIconBtn
        btn-label="Sélection de structure"
        icon="localisation"
        icon-bg-color="ap-blue-darken-1"
        icon-color="ap-white"
        icon-hover-bg-color="ap-blue-darken-2"
        icon-hover-color="ap-white"
        size="2rem"
        unique-id="structure-menu-switch-open-btn"
        @click="model.dialog = true"
    />
    <StructureMenu
        v-bind="args"
        v-model="model"
    />
</div>
        `,
	}),
}

export const AvecSlotSearchBar: Story = {
	name: 'Avec slot searchBar',
	args: {
		uniqueId: 'structure-menu-searchbar',
		userAdeli: '4567890',
		userName: 'Dr. Recherche',
		userProfession: 'Dermatologue',
		userRpps: '0987654',
		structuresTabs: [
			{
				label: 'Structures Alpha et Beta',
				structures: [
					{ address: 'Alpha street', idNumber: 'ALPHA', value: 'Alpha' },
					{ address: 'Beta avenue', idNumber: 'BETA', value: 'Beta' },
				],
			},
		],
		modelValue: { dialog: false, activeTab: 0, activeValue: 'Alpha' },
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
            unique-id="structure-menu-searchbar-open-btn"
            @click="model.dialog = true"
        />
        <StructureMenu
            v-model="model"
            :structures-tabs="structuresTabs"
            unique-id="structure-menu-searchbar"
            user-adeli="4567890"
            user-name="Dr. Recherche"
            user-profession="Dermatologue"
            user-rpps="0987654"
        >
            <template #searchBar>
                <input type="text" placeholder="Recherche personnalisée..." class="form-control" />
            </template>
        </StructureMenu>
    </div>
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproIconBtn, StructureMenu },
		setup() {
			const model = ref({ ...args.modelValue })
			watch(() => args.modelValue, (newValue) => {
				if (newValue !== undefined) {
					model.value = newValue
				}
			})
			return { args, model }
		},
		template: `
<p class="mb-2">Affichage du sélecteur avec une barre de recherche personnalisée via le slot <code>searchBar</code>.</p>
<div>
    <AmeliproIconBtn
        btn-label="Sélection de structure"
        icon="localisation"
        icon-bg-color="ap-blue-darken-1"
        icon-color="ap-white"
        icon-hover-bg-color="ap-blue-darken-2"
        icon-hover-color="ap-white"
        size="2rem"
        unique-id="structure-menu-searchbar-open-btn"
        @click="model.dialog = true"
    />
    <StructureMenu
        v-bind="args"
        v-model="model"
    >
        <template #searchBar>
            <input type="text" placeholder="Recherche personnalisée..." class="form-control" />
        </template>
    </StructureMenu>
</div>
        `,
	}),
}
