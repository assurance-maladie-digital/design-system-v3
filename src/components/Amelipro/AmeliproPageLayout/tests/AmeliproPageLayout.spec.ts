import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproPageLayout from '../AmeliproPageLayout.vue'

describe('AmeliproPageLayout', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproPageLayout, {
			props: {
				ameliproPageLayoutInfos: {
					ameliproFooterInfos: {
						a11yCompliance: 'non-conforme',
						a11yHref: '#',
						aboutHref: '#',
						cguHref: '#',
						configurationHref: '#',
						legalNoticeHref: '#',
						siteMapHref: '#',
						version: 'X.X.X',
					},
					ameliproHeaderInfos: {
						serviceMenuInfos: {
							servicesContact: [
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
							],
							servicesPatient: [
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
							],
							servicesPs: [
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
							],
							uniqueId: 'service-menu',
						},
						serviceName: 'Titre du service',
						signatureInfos: { href: '#' },
						structureMenuInfos: {
							defaultSelected: { activeTab: 0, activeValue: 'e' },
							maxStructuresLoadedDefault: 3,
							structuresTabs: [
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
							],
							uniqueId: 'structures',
							userAdeli: 'xxxadelixxx',
							userName: 'xxxnamexxx',
							userProfession: 'xxxprofessionxxx',
							userRpps: 'xxxrppsxxx',
						},
						uniqueId: 'logged-page-header',
						userInformationSummaryInfos: {
							adresseLigne1: '31 Boulevard des champs',
							adresseLigne2: '75730 Fleurie',
							categorieSpecialite: 'Médecin généraliste',
							denomination: 'Docteur',
							nomCabinet: 'Cabinet des fleurs',
							userName: 'Jean Martin',
						},
						userMenuInfos: {
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
						},
						userName: 'Dr. Jean Dupont',
					},
					ameliproPatientBannerInfos: {
						birthName: 'Dupont',
						birthdate: '09/11/1992',
						moreInformationHref: '#',
						name: 'Jeanne',
						patientDoctorInfos: 'Vous êtes le médecin traitant',
						patientNir: 'NIR patient',
						patientOrganism: 'CPAM des Alpes de Haute Provence - Centre 103',
						patientStatus: 'Assuré(e)',
						patientSystem: 'Régime Général',
					},
					displayPatientBanner: true,
				},
				uniqueId: 'my-page-layout-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
