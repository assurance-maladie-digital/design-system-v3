import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproHeader from './AmeliproHeader.vue'

const meta: Meta<typeof AmeliproHeader> = {
	argTypes: {
		'ameliproHeaderInfos': {
			description: 'Objet contenant toutes les informations nécessaire pour afficher le Header',
			table: {
				type: {
					detail: `{
	headerTitle?: string;
	serviceName?: string;
	serviceSubTitle?: string;
	homeHref?: string;
	homeLink?: RouteLocationRaw;
	serviceMenuInfos?: {
		icon?: string;
		messageToDisplay?: string;
		servicesContact?: Array<{
			icon?: string;
			imgSrc?: string;
			label: string;
			to?: string;
			href?: string;
			click?: CallableFunction;
		}>;
		servicesPatient?: Array<{
			icon?: string;
			imgSrc?: string;
			label: string;
			to?: string;
			href?: string;
			click?: CallableFunction;
		}>;
		servicesPs: Array<{
			icon?: string;
			imgSrc?: string;
			label: string;
			to?: string;
			href?: string;
			click?: CallableFunction;
		}>;
		uniqueId: string;
		value: boolean;
	};
	signatureInfos?: {
		href?: string;
		to?: RouteLocationRaw;
		clickFn?: CallableFunction;
	};
	structureMenuInfos?: {
		maxStructuresLoadedDefault?: number;
		structuresTabs: Array<{
			label: string;
			structures: Array<{
				address: string;
				idNumber: string;
				value: string;
				defaultStructure?: boolean;
			}>;
			listLabel?: string;
		}>;
		uniqueId: string;
		userAdeli: string;
		userName: string;
		userProfession: string;
		userRpps: string;
		defaultSelected?: {
			activeTab: number;
			activeValue?: string;
		};
		cancel?: CallableFunction;
		change?: CallableFunction;
		input?: CallableFunction;
		validate?: CallableFunction;
	};
	userInformationSummaryInfos?: {
		userName?: string;
		denomination?: string;
		categorieSpecialite?: string;
		nomCabinet?: string;
		adresseLigne1?: string;
		adresseLigne2?: string;
		profil?: string;
	};
	userMenuInfos?: {
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
	};
	backoffice?:boolean;
}`,
					summary: 'AmeliproHeaderInfos',
				},
			},
		},
		'back-btn-click': { description: 'Événement émis au click sur le bouton retour, attention il ne faut pas que les properties href ou to soient renseignées si vous voulez effectuer des actions sur cet event' },
		'backBtnHref': { description: 'Lien pour le bouton de retour, il doit renvoyer à la page précédente, s’il n’y a pas de page précédente connue, il doit renvoyer à la page d’Accueil Amelipro' },
		'backBtnLabel': { description: 'Label du bouton de retour' },
		'backBtnTo': { description: 'Route pour le bouton de retour, elle doit renvoyer à la page précédente, s’il n’y a pas de page précédente connue, elle doit renvoyer à la page d’Accueil Amelipro' },
		'backoffice': { description: 'Définit si nous somme sur une page de backoffice' },
		'headerTitle': { description: 'Titre de site venant remplacer le logo Amelipro' },
		'homeHref': { description: 'Lien pour le bouton de retour vers l’accueil Amelipro' },
		'homeLink': { description: 'Route pour le bouton de retour vers l’accueil Amelipro' },
		'noRightPart': { description: 'Booléen qui masque la partie droite du header' },
		'noSubPart': { description: 'Booléen qui masque la partie inférieure du header' },
		'notificationMenu': { description: 'Slot pour ajouter le menu notification (ce menu n’existe pas encore il ne faut donc pas renseigner ce slot).' },
		'rightPart': { description: 'Slot pour personnaliser la partie droite du header.' },
		'serviceHomeHref': { description: 'Lien pour le bouton de titre de service, il doit renvoyer à l’accueil du service' },
		'serviceHomeTo': { description: 'Route pour le bouton de titre de service, il doit renvoyer à l’accueil du service' },
		'serviceMenu': { description: 'Slot pour ajouter le menu bouquet de services.' },
		'serviceName': { description: 'Nom du service à afficher' },
		'serviceSubTitle': { description: 'Sous titre du service à afficher' },
		'signatureMenu': { description: 'Slot permettant de renseigner un bouton pour la gestion de signature' },
		'structureMenu': { description: 'Slot pour ajouter le menu choix de structure (composant StructureMenu).' },
		'structureMenuActivator': { description: 'Slot pour ajouter le bouton d’ouverture menu choix de structure.' },
		'subMenu': { description: 'Définit si la page a un sous-menu, si oui on affiche le bouton menu sinon on affiche un bouton de retour à l’accueil' },
		'subMenuItems': {
			description: 'Tableau d’objet composant le menu',
			table: {
				type: {
					detail: `Array<{
	actif?: boolean;
	children?: AmeliproMenuItem[];
	href?: string;
	id: string;
	name: string;
	to?: RouteLocationRaw;
}>`,
					summary: 'AmeliproMenuItem[]',
				},
			},
		},
		'uniqueId': { description: 'Identifiant unique du header' },
		'unlogged': { description: 'Affiche la version connecté ou déconnecté du header' },
		'userInformationSummary': { description: 'Slot pour ajouter les informations du professionnel de santé sous son nom' },
		'userMenu': { description: 'Slot pour ajouter le menu utilisateur.' },
	},
	component: AmeliproHeader,
	title: 'Composants/Amelipro/Mise en page/AmeliproHeader',
} as Meta<typeof AmeliproHeader>
export default meta

type Story = StoryObj<typeof AmeliproHeader>

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

const structureItems = [
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

const servicesContact = [
	{
		href: '#',
		icon: 'paiements',
		label: 'Contact 1',
	},
	{
		href: '#',
		icon: 'optam2',
		label: 'Contact 2',
	},
	{
		href: '#',
		icon: 'patientele',
		label: 'Contact 3',
	},
	{
		href: '#',
		icon: 'paiements',
		label: 'Contact 4',
	},
	{
		href: '#',
		icon: 'convention',
		label: 'Contact 5',
	},
]

const servicesPs = [
	{
		href: '#',
		icon: 'paiements',
		label: 'Paiements',
	},
	{
		href: '#',
		icon: 'convention',
		label: 'Conventions',
	},
	{
		href: '#',
		icon: 'patientele',
		label: 'Patientèle',
	},
	{
		href: '#',
		icon: 'perteActiviteCovid',
		label: 'Perte d’activité (Covid)',
	},
	{
		href: '#',
		icon: 'horairesCabinet',
		label: 'Horaires du cabinet',
	},
	{
		href: '#',
		icon: 'pillules',
		label: 'Patientèle SOPHIA',
	},
	{
		href: '#',
		icon: 'commandes',
		label: 'Commandes d’imprimés',
	},
]

const servicesPatient = [
	{
		href: '#',
		icon: 'brasCasse',
		label: 'Arrêt de travail',
	},
	{
		href: '#',
		icon: 'chute',
		label: 'Certificat ATMP',
	},
	{
		href: '#',
		icon: 'prescription',
		label: 'Affection de longue durée',
	},
	{
		href: '#',
		icon: 'contactCovid',
		label: 'Contact COVID',
	},
	{
		href: '#',
		icon: 'vaccination',
		label: 'Vaccination COVID',
	},
	{
		href: '#',
		icon: 'ambulance',
		label: 'Transport',
	},
	{
		href: '#',
		icon: 'horlogeFlecheGauche',
		label: 'Historique',
	},
	{
		href: '#',
		icon: 'seringue',
		label: 'Bilan soins infirmiers',
	},
]

const userInformationSummaryInfos = {
	adresseLigne1: '31 Boulevard des champs',
	adresseLigne2: '75730 Fleurie',
	categorieSpecialite: 'Médecin généraliste',
	denomination: 'Docteur',
	nomCabinet: 'Cabinet des fleurs',
	userName: 'Jean Martin',
}

const ameliproHeaderInfos = {
	serviceMenuInfos: {
		servicesContact,
		servicesPatient,
		servicesPs,
		uniqueId: 'service-menu',
	},
	serviceName: 'Titre du service',
	signatureInfos: { href: '#' },
	structureMenuInfos: {
		defaultSelected: { activeTab: 0, activeValue: 'e' },
		maxStructuresLoadedDefault: 3,
		structuresTabs: structureItems,
		uniqueId: 'structures',
		userAdeli: 'xxxadelixxx',
		userName: 'xxxnamexxx',
		userProfession: 'xxxprofessionxxx',
		userRpps: 'xxxrppsxxx',
	},
	uniqueId: 'logged-page-header',
	userInformationSummaryInfos,
	userMenuInfos,
	userName: 'Dr. Jean Dupont',
}

export const Default: Story = {
	args: {
		ameliproHeaderInfos,
		uniqueId: 'amelipro-header-id',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproHeader
		:amelipro-page-layout-infos="ameliproHeaderInfos"
		unique-id="amelipro-header-id"
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

	const structureItems = [
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

	const servicesContact = [
		{
			href: '#',
			icon: 'paiements',
			label: 'Contact 1',
		},
		{
			href: '#',
			icon: 'releveHonoraires',
			label: 'Contact 2',
		},
		{
			href: '#',
			icon: 'patientele',
			label: 'Contact 3',
		},
		{
			href: '#',
			icon: 'paiements',
			label: 'Contact 4',
		},
		{
			href: '#',
			icon: 'convention',
			label: 'Contact 5',
		},
	];

	const servicesPs = [
		{
			href: '#',
			icon: 'paiements',
			label: 'Paiements',
		},
		{
			href: '#',
			icon: 'convention',
			label: 'Conventions',
		},
		{
			href: '#',
			icon: 'patientele',
			label: 'Patientèle',
		},
		{
			href: '#',
			icon: 'perteActiviteCovid',
			label: 'Perte d’activité (Covid)',
		},
		{
			href: '#',
			icon: 'horairesCabinet',
			label: 'Horaires du cabinet',
		},
		{
			href: '#',
			icon: 'pillules',
			label: 'Patientèle SOPHIA',
		},
		{
			href: '#',
			icon: 'commandes',
			label: 'Commandes d’imprimés',
		},
	];

	const servicesPatient = [
		{
			href: '#',
			icon: 'brasCasse',
			label: 'Arrêt de travail',
		},
		{
			href: '#',
			icon: 'chute',
			label: 'Certificat ATMP',
		},
		{
			href: '#',
			icon: 'prescription',
			label: 'Affection de longue durée',
		},
		{
			href: '#',
			icon: 'contactCovid',
			label: 'Contact COVID',
		},
		{
			href: '#',
			icon: 'vaccination',
			label: 'Vaccination COVID',
		},
		{
			href: '#',
			icon: 'ambulance',
			label: 'Transport',
		},
		{
			href: '#',
			icon: 'horlogeFlecheGauche',
			label: 'Historique',
		},
		{
			href: '#',
			icon: 'seringue',
			label: 'Bilan soins infirmiers',
		},
	];

	const userInformationSummaryInfos = {
		adresseLigne1: '31 Boulevard des champs',
		adresseLigne2: '75730 Fleurie',
		categorieSpecialite: 'Médecin généraliste',
		denomination: 'Docteur',
		nomCabinet: 'Cabinet des fleurs',
		userName: 'Jean Martin',
	};

	const ameliproHeaderInfos = {
		serviceMenuInfos: {
			servicesContact,
			servicesPatient,
			servicesPs,
			uniqueId: 'service-menu',
		},
		serviceName: 'Titre du service',
		signatureInfos: { href: '#' },
		structureMenuInfos: {
			defaultSelected: { activeTab: 0, activeValue: 'e' },
			maxStructuresLoadedDefault: 3,
			structuresTabs: structureItems,
			uniqueId: 'structures',
			userAdeli: 'xxxadelixxx',
			userName: 'xxxnamexxx',
			userProfession: 'xxxprofessionxxx',
			userRpps: 'xxxrppsxxx',
		},
		uniqueId: 'logged-page-header',
		userInformationSummaryInfos,
		userMenuInfos,
		userName: 'Dr. Jean Dupont',
	};
</script>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproHeader },
		setup() {
			return { args }
		},
		template: `
<AmeliproHeader
	v-bind="args"
/>
		`,
	}),
}

export const notLogged: Story = {
	args: {
		noSubPart: true,
		uniqueId: 'amelipro-header-not-logged-id',
		unlogged: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproHeader
		:no-sub-part="true",
		unique-id="amelipro-header-not-logged-id"
		:unlogged="true"
	/>
</template>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproHeader },
		setup() {
			return { args }
		},
		template: `
<AmeliproHeader
	v-bind="args"
/>
		`,
	}),
}

export const other: Story = {
	args: {
		headerTitle: 'Titre du site',
		noSubPart: true,
		serviceSubTitle: 'Sous-titre',
		uniqueId: 'amelipro-header-other-id',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproHeader
		header-title="Titre du site"
		no-sub-part
		service-sub-title="Sous-titre"
		unique-id="amelipro-header-other-id"
	>
		<template #rightPart>
			[Slot: rightPart]
		</template>
	</AmeliproHeader>
</template>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproHeader },
		setup() {
			return { args }
		},
		template: `
<AmeliproHeader
	v-bind="args"
>
	<template #rightPart>
		[Slot: rightPart]
	</template>
</AmeliproHeader>
		`,
	}),
}
