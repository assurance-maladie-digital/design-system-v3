import type { Meta, StoryObj } from '@storybook/vue3'
import UserMenu from './UserMenu.vue'

const meta = {
	argTypes: {
		'click:account': { description: 'Événement émis lorsque l’utilisateur clique sur le bouton mon compte.', type: 'void' },
		'click:logout': { description: 'Événement émis lorsque l’utilisateur clique sur le bouton déconnexion.', type: 'void' },
		'complementaryInfo': { description: 'Slot pour ajouter des informations supplémentaires.' },
		'default': { description: 'Slot pour le contenu, il surcharge le contenu de `userMenuDetailsInfos`.' },
		'icon': { description: 'Le nom de l’icône à afficher comme bouton d’ouverture de la popover' },
		'lastConnexion': { description: '_Non documenté_' },
		'structureMenu': { description: 'Slot utilisé pour afficher le StructureMenu en mobile' },
		'uniqueId': { description: 'Identifiant unique du composant' },
		'userMenuInfos': {
			description: 'Objet contenant toutes les informations nécessaire au fonctionnement du menu utilisateur',
			table: {
				type: {
					detail: `{
	lastConnexion?: string;
	logout?: CallableFunction;
	account?: CallableFunction;
	updateSelectionStructure?: CallableFunction;
	userMenuDetailsInfos?: {
		userName?: string;
		profil?: string;
		denomination?: string;
		rpps?: string;
		adeli?: string;
		am?: string;
		finess?: string;
		email?: string;
		adresse?: {
			numero?: string;
			complement?: string;
			type?: string;
			nom?: string;
			codePostal?: string;
			commune?: string;
		};
	};
};`,
					summary: 'UserMenuInfos',
				},
			},
		},
	},
	component: UserMenu,
	title: 'Composants/Mise en page/Sous-composants du header/UserMenu',
} as Meta<typeof UserMenu>
export default meta

type Story = StoryObj<typeof UserMenu>

const userMenuInfos = {
	lastConnexion: '01/01/2024',
	userMenuDetailsInfos: {
		adeli: 'ADELI',
		adresse: {
			codePostal: '35000',
			commune: 'Rennes',
			complement: 'bis',
			nom: 'de la Mayenne',
			numero: '3',
			type: 'rue',
		},
		denomination: 'denomination',
		email: 'email',
		finess: 'FINESS',
		profil: 'profil',
		rpps: 'RPPS',
		userName: 'userName',
	},
}

export const Default: Story = {
	args: {
		userMenuInfos,
		uniqueId: 'user-menu-unique-id',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<UserMenu
		:user-menu-infos="userMenuInfos"
		unique-id="user-menu-unique-id"
	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	const userMenuInfos = {
		lastConnexion: '01/01/2024',
		userMenuDetailsInfos: {
			adeli: 'ADELI',
			adresse: {
				codePostal: '35000',
				commune: 'Rennes',
				complement: 'bis',
				nom: 'de la Mayenne',
				numero: '3',
				type: 'rue',
			},
			denomination: 'denomination',
			email: 'email',
			finess: 'FINESS',
			profil: 'profil',
			rpps: 'RPPS',
			userName: 'userName',
		},
	};
</script>
				`,
			},
		],
	},
	render: args => ({
		components: { UserMenu },
		setup() {
			return { args }
		},
		template: `
<UserMenu
	v-bind="args"
/>
		`,
	}),
}
