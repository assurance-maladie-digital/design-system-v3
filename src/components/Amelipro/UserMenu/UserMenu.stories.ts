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
	title: 'Composants/Amelipro/Mise en page/Sous-composants du header/UserMenu',
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
	import { UserMenu } from '@cnamts/synapse'

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
		template: `<div style="height: 400px; background: repeating-linear-gradient(135deg,#fafafa,#fafafa 10px,#f5f5f5 10px,#f5f5f5 20px);">
<UserMenu
	style="margin-left: 250px; top: 15px"
	v-bind="args"
/>
</div>`,
	}),
}

export const AvecSlotComplementaryInfo: Story = {
	name: 'Avec slot complementaryInfo',
	args: {
		userMenuInfos,
		uniqueId: 'user-menu-slot-complementary',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <UserMenu
        :user-menu-infos="userMenuInfos"
        unique-id="user-menu-slot-complementary"
    >
        <template #complementaryInfo>
            <div style="color: #1976d2; font-weight: bold;">
                Informations complémentaires personnalisées
            </div>
        </template>
    </UserMenu>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { UserMenu } from '@cnamts/synapse'

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
</script>  `,
			},
		],
	},
	render: args => ({
		components: { UserMenu },
		setup() { return { args } },
		template: `
<p class="mb-2">Menu utilisateur avec slot <code>complementaryInfo</code> personnalisé.</p>
<UserMenu style="margin-left: 200px" v-bind="args">
    <template #complementaryInfo>
        <div style="color: #1976d2; font-weight: bold;">
            Informations complémentaires personnalisées
        </div>
    </template>
</UserMenu>`,
	}),
}

export const AvecSlotDefault: Story = {
	name: 'Avec slot default',
	args: {
		userMenuInfos,
		uniqueId: 'user-menu-slot-default',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <UserMenu
        :user-menu-infos="userMenuInfos"
        unique-id="user-menu-slot-default"
    >
        <template #default>
            <div>
                Contenu personnalisé via le slot <code>default</code> (remplace le contenu standard).
            </div>
        </template>
    </UserMenu>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { UserMenu } from '@cnamts/synapse'

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
</script>  `,
			},
		],
	},
	render: args => ({
		components: { UserMenu },
		setup() { return { args } },
		template: `
<p class="mb-2">Menu utilisateur avec slot <code>default</code> personnalisé (remplace le contenu standard).</p>
<UserMenu style="margin-left: 200px" v-bind="args">
    <template #default>
        <div>
            Contenu personnalisé via le slot <code>default</code> (remplace le contenu standard).
        </div>
    </template>
</UserMenu>`,
	}),
}

export const AvecSlotStructureMenu: Story = {
	name: 'Avec slot structureMenu',
	args: {
		userMenuInfos,
		uniqueId: 'user-menu-slot-structure',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <UserMenu
        :user-menu-infos="userMenuInfos"
        unique-id="user-menu-slot-structure"
    >
        <template #structureMenu>
            <div>
                StructureMenu personnalisé pour le mode mobile.
            </div>
        </template>
    </UserMenu>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { UserMenu } from '@cnamts/synapse'

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
</script>`,
			},
		],
	},
	render: args => ({
		components: { UserMenu },
		setup() { return { args } },
		template: `
<p class="mb-2">Menu utilisateur avec slot <code>structureMenu</code> personnalisé (affiché en mobile).</p>
<UserMenu style="margin-left: 200px" v-bind="args">
    <template #structureMenu>
        <div>
            StructureMenu personnalisé pour le mode mobile.
        </div>
    </template>
</UserMenu>`,
	}),
}
