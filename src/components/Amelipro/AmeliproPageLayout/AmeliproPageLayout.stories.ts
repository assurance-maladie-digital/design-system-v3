import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproPageLayout from './AmeliproPageLayout.vue'

const meta = {
	argTypes: {
		'ameliproPageLayoutInfos': {
			description: 'Objet permettant de remplir tout les composants transverses pour une page classique Amelipro',
			table: {
				type: {
					detail: `{
	ameliproHeaderInfos?: {
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
		}
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
	};
	ameliproFooterInfos?: {
		version?: string;
		a11yCompliance?: string;
		noSiteMap?: boolean;
		siteMapTarget?: string;
		siteMapTo?: RouteLocationRaw;
		siteMapHref?: string;
		noAbout?: boolean;
		aboutTarget?: string;
		aboutTo?: RouteLocationRaw;
		aboutHref?: string;
		noConfiguration?: boolean;
		configurationTarget?: string;
		configurationTo?: RouteLocationRaw;
		configurationHref?: string;
		configurationLabel?: string;
		noLegalNotice?: boolean;
		legalNoticeTarget?: string;
		legalNoticeTo?: RouteLocationRaw;
		legalNoticeHref?: string;
		noCgu?: boolean;
		cguTarget?: string;
		cguTo?: RouteLocationRaw;
		cguHref?: string;
		noA11y?: boolean;
		noLinkA11y?: boolean;
		a11yTarget?: string;
		a11yTo?: RouteLocationRaw;
		a11yHref?: string;
		backOffice?: boolean;
		backOfficeText?: string;
		noPhone?: boolean;
	};
	ameliproPatientBannerInfos?: {
		name?: string;
		birthName?: string;
		birthdate?: string;
		patientStatus?: string;
		patientNir?: string;
		patientSystem?: string;
		patientOrganism?: string;
		moreInformationHref?: string;
		moreInformationTo?: RouteLocationRaw;
		patientDoctorInfos?: string;
		noMoreInformation?: boolean;
		noPatientChange?: boolean;
	};
	displayPatientBanner?: boolean;
}`,
					summary: 'AmeliproPageLayoutInfos',
				},
			},
		},
		'back-btn-click': { description: 'Événement émis lorsque l’utilisateur clique sur le bouton retour présent dans le header.', type: 'void' },
		'click-logo': { description: 'Evénement émit au click sur le logo, utilisable si les properties `homeHref` et `homeLink` ne sont pas définies sur le header et que le slot `header` n\'est pas utilisé' },
		'click:patient-change': { description: 'Événement émis au clic sur le bouton changer de patient dans le bandeau patient.', type: 'void' },
		'customMainContent': { description: 'Permet de personnaliser la partie contenu principal pour les page différentes du format classique' },
		'footer': { description: 'Slot pour ajouter le footer.' },
		'header': { description: 'Slot pour ajouter le header.' },
		'main': { description: 'Slot pour ajouter le contenu principal.' },
		'patientBanner': { description: 'Slot pour ajouter le bandeau patient.' },
		'serviceMenuMsg': { description: 'Renseigne le slot mesage du ServiceMenu' },
		'signatureMenu': { description: 'Renseigne le slot signatureMenu du AmeliproHeader' },
		'skipLinks': {
			description: 'Tableau comprenant la liste des liens d’évitement, chaque lien doit avoir un titre et une ancre qui dirige vers un id dans la page',
			table: {
				type: {
					detail: `Array<{
	label: string,
	href: string
}>`,
					summary: 'SkipLink[]',
				},
			},
		},
		'structureMenuSearchBar': { description: 'Renseigne le slot searchBar du StructureMenu' },
		'uniqueId': { description: 'Identifiant unique du composant' },
		'userMenuComplementaryInfo': { description: 'renseigne le slot complementaryInfo du UserMenu' },
	},
	component: AmeliproPageLayout,
	title: 'Composants/Amelipro/Mise en page/AmeliproPageLayout',
} as Meta<typeof AmeliproPageLayout>
export default meta

type Story = StoryObj<typeof AmeliproPageLayout>

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

const ameliproPatientBannerInfos = {
	birthName: 'Dupont',
	birthdate: '09/11/1992',
	moreInformationHref: '#',
	name: 'Jeanne',
	patientDoctorInfos: 'Vous êtes le médecin traitant',
	patientNir: 'NIR patient',
	patientOrganism: 'CPAM des Alpes de Haute Provence - Centre 103',
	patientStatus: 'Assuré(e)',
	patientSystem: 'Régime Général',
}

const ameliproFooterInfos = {
	a11yCompliance: 'non-conforme',
	a11yHref: '#',
	aboutHref: '#',
	cguHref: '#',
	configurationHref: '#',
	legalNoticeHref: '#',
	siteMapHref: '#',
	version: 'X.X.X',
}

export const Default: Story = {
	args: {
		ameliproPageLayoutInfos: {
			ameliproFooterInfos,
			ameliproHeaderInfos,
			ameliproPatientBannerInfos,
			displayPatientBanner: true,
		},
		uniqueId: 'amelipro-page-layout-id',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproPageLayout
		:amelipro-page-layout-infos="ameliproPageLayoutInfos"
		unique-id="amelipro-page-layout-id"
	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproPageLayout } from '@cnamts/synapse'
	import { ref } from 'vue'

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

	const ameliproPatientBannerInfos = {
		birthName: 'Dupont',
		birthdate: '09/11/1992',
		moreInformationHref: '#',
		name: 'Jeanne',
		patientDoctorInfos: 'Vous êtes le médecin traitant',
		patientNir: 'NIR patient',
		patientOrganism: 'CPAM des Alpes de Haute Provence - Centre 103',
		patientStatus: 'Assuré(e)',
		patientSystem: 'Régime Général',
	}

	const ameliproFooterInfos = {
		a11yCompliance: 'non-conforme',
		a11yHref: '#',
		aboutHref: '#',
		cguHref: '#',
		configurationHref: '#',
		legalNoticeHref: '#',
		siteMapHref: '#',
		version: 'X.X.X',
	}

	const ameliproPageLayoutInfos = {
		ameliproFooterInfos,
		ameliproHeaderInfos,
		ameliproPatientBannerInfos,
		displayPatientBanner: true,
	}
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproPageLayout },
		setup() {
			return { args }
		},
		template: `
			<AmeliproPageLayout
				v-bind="args"
			/>
		`,
	}),
}
