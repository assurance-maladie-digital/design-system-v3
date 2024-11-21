import HeaderToolbar from '@/components/HeaderToolbar/HeaderToolbar.vue'
import { mdiMapMarker } from '@mdi/js'
import type { Meta, StoryObj } from '@storybook/vue3'
import { VBtn } from 'vuetify/components'
import HeaderBar from '../HeaderBar.vue'
import HeaderBurgerMenu from './HeaderBurgerMenu.vue'
import HeaderMenuItem from './HeaderMenuItem/HeaderMenuItem.vue'
import HeaderMenuSection from './HeaderMenuSection/HeaderMenuSection.vue'
import HeaderSubMenu from './HeaderSubMenu/HeaderSubMenu.vue'

const meta = {
	title: 'Composants/Structure/HeaderBar/HeaderBurgerMenu',
	component: HeaderBurgerMenu,
	tags: ['dev'],
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		'modelValue': {
			table: {
				category: 'props',
				type: {
					summary: 'boolean',
				},
				defaultValue: {
					summary: 'false',
				},
			},
			control: { type: 'boolean' },
			description: 'Avec `v-model` Permet de gérer l\'ouverture et la fermeture du menu.',
		},
		'onUpdate:modelValue': {
			action: 'update:modelValue',
			table: {
				category: 'events',
				type: {
					summary: 'boolean',
				},
			},
			description: 'Évènement émit lors de l\'ouverture ou la fermeture du menu.',
		},
		'default': {
			control: { type: 'text' },
			table: {
				type: {
					summary: '{}',
				},
			},
			description: 'Le contenu du menu, à construire avec les composants `HeaderMenuSection` et `HeaderMenuItem`.',
		},
	},
} satisfies Meta<typeof HeaderBurgerMenu>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		default: 'Menu content',
	},
	render: (args) => {
		return {
			components: { HeaderBurgerMenu, HeaderBar },
			setup() {
				return { args }
			},
			template: `
				<HeaderBar>
					<template #menu>
						<HeaderBurgerMenu v-model="args.modelValue">
							{{ args.default }}
						</HeaderBurgerMenu>
					</template>
				</HeaderBar>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<HeaderBar>
						<template #menu>
							<HeaderBurgerMenu>
								<p>lorem ipsum</p>
							</HeaderBurgerMenu>
						</template>
					</HeaderBar>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { HeaderBurgerMenu, HeaderBar } from '@cnamts/synapse'
				</script>
				`,
			},
		],
	},
}

export const WithAnItem: Story = {
	args: {},
	render: (args) => {
		return {
			components: { HeaderBurgerMenu, HeaderBar, HeaderMenuItem, HeaderMenuSection },
			setup() {
				return { args }
			},
			template: `
				<HeaderBar>
					<template #menu>
						<HeaderBurgerMenu v-model="args.modelValue">
							<HeaderMenuSection>
								<HeaderMenuItem>
									<a href="">Item 1</a>
								</HeaderMenuItem>
							</HeaderMenuSection>
						</HeaderBurgerMenu>
					</template>
				</HeaderBar>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<HeaderBar>
						<template #menu>
							<HeaderBurgerMenu>
								<HeaderMenuSection>
									<HeaderMenuItem>
										<a href="">Item 1</a>
									</HeaderMenuItem>
								</HeaderMenuSection>
							</HeaderBurgerMenu>
						</template>
					</HeaderBar>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { HeaderBurgerMenu, HeaderBar, HeaderMenuSection, HeaderMenuItem } from '@cnamts/synapse'
				</script>
				`,
			},
		],
	},
}

export const Populated: Story = {
	args: {},
	render: (args) => {
		return {
			components: {
				HeaderMenuItem,
				HeaderBurgerMenu,
				HeaderBar,
				HeaderSubMenu,
				HeaderMenuSection,
				VBtn,
			},
			setup() {
				return { args }
			},
			template: `
				<HeaderBar>
					<template #menu>
						<HeaderBurgerMenu v-model="args.modelValue">
							<HeaderMenuSection>
								<template #title>
									Section 1
								</template>
								<HeaderMenuItem>
									<a href="">Item 1</a>
								</HeaderMenuItem>
								<HeaderMenuItem>
									<a href="">Item 2</a>
								</HeaderMenuItem>
								<headerMenuItem>
									<HeaderSubMenu>
										<template #title>
											Menu de premier niveau 1
										</template>
										<HeaderMenuSection>
											<template #title>
												Section
											</template>
											<HeaderMenuItem>
												<a href="">Item</a>
											</HeaderMenuItem>
											<HeaderSubMenu>
												<template #title>
													Menu de deuxième niveau 1
												</template>
												<HeaderMenuItem>
													<a href="">Item</a>
												</HeaderMenuItem>
											</HeaderSubMenu>
										</HeaderMenuSection>
									</HeaderSubMenu>
								</headerMenuItem>
							</HeaderMenuSection>
							<HeaderMenuSection>
								<template #title>
									Section 2
								</template>
								<headerMenuItem>
									<HeaderSubMenu>
										<template #title>
											Menu de premier niveau 2
										</template>
										<HeaderMenuItem>
											<a href="">Item 1</a>
										</HeaderMenuItem>
										<HeaderMenuItem>
											<HeaderSubMenu>
												<template #title>
													Menu de deuxième niveau 2
												</template>
												<HeaderMenuItem>
													<a href="">Item 1</a>
												</HeaderMenuItem>
											</HeaderSubMenu>
										</HeaderMenuItem>
										<HeaderMenuItem>
											<HeaderSubMenu>
												<template #title>
													Menu de deuxième niveau 3
												</template>
												<HeaderMenuSection>
													<template #title>
														Section 1
													</template>
													<HeaderMenuItem>
														<a href="">Item 1</a>
													</HeaderMenuItem>
												</HeaderMenuSection>
											</HeaderSubMenu>
										</HeaderMenuItem>
									</HeaderSubMenu>
								</headerMenuItem>
								<HeaderMenuItem>
									<a href="">Item 3</a>
								</HeaderMenuItem>
							</HeaderMenuSection>
							<div class="pa-4">
								<p class="font-weight-bold">Veillez vous connecter</p>
								<VBtn variant="tonal" class="mt-4 font-weight-medium" color="primary">Je me connecte</VBtn>
							</div>
						</HeaderBurgerMenu>
					</template>
				</HeaderBar>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
				<HeaderBar>
					<template #menu>
						<HeaderBurgerMenu>
							<HeaderMenuSection>
								<template #title>
									Section 1
								</template>
								<HeaderMenuItem>
									<a href="">Item 1</a>
								</HeaderMenuItem>
								<HeaderMenuItem>
									<a href="">Item 2</a>
								</HeaderMenuItem>
								<headerMenuItem>
									<HeaderSubMenu>
										<template #title>
											Menu de premier niveau 1
										</template>
										<HeaderMenuSection>
											<template #title>
												Section
											</template>
											<HeaderMenuItem>
												<a href="">Item</a>
											</HeaderMenuItem>
											<HeaderSubMenu>
												<template #title>
													Menu de deuxième niveau 1
												</template>
												<HeaderMenuItem>
													<a href="">Item</a>
												</HeaderMenuItem>
											</HeaderSubMenu>
										</HeaderMenuSection>
									</HeaderSubMenu>
								</headerMenuItem>
							</HeaderMenuSection>
							<HeaderMenuSection>
								<template #title>
									Section 2
								</template>
								<headerMenuItem>
									<HeaderSubMenu>
										<template #title>
											Menu de premier niveau 2
										</template>
										<HeaderMenuItem>
											<a href="">Item 1</a>
										</HeaderMenuItem>
										<HeaderMenuItem>
											<HeaderSubMenu>
												<template #title>
													Menu de deuxième niveau 2
												</template>
												<HeaderMenuItem>
													<a href="">Item 1</a>
												</HeaderMenuItem>
											</HeaderSubMenu>
										</HeaderMenuItem>
										<HeaderMenuItem>
											<HeaderSubMenu>
												<template #title>
													Menu de deuxième niveau 3
												</template>
												<HeaderMenuSection>
													<template #title>
														Section 1
													</template>
													<HeaderMenuItem>
														<a href="">Item 1</a>
													</HeaderMenuItem>
												</HeaderMenuSection>
											</HeaderSubMenu>
										</HeaderMenuItem>
									</HeaderSubMenu>
								</headerMenuItem>
								<HeaderMenuItem>
									<a href="">Item 3</a>
								</HeaderMenuItem>
							</HeaderMenuSection>
							<div class="pa-4">
								<p class="font-weight-bold">Veillez vous connecter</p>
								<VBtn variant="tonal" class="mt-4 font-weight-medium" color="primary">Je me connecte</VBtn>
							</div>
						</HeaderBurgerMenu>
					</template>
				</HeaderBar>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { HeaderMenuItem, HeaderBurgerMenu, HeaderBar, HeaderSubMenu, HeaderMenuSection } from '@cnamts/synapse'
					import { VBtn } from 'vuetify/components'
				</script>
				`,
			},
		],
	},
}

export const WithScroll: Story = {
	args: {},
	render: (args) => {
		return {
			components: { HeaderBurgerMenu, HeaderBar, HeaderMenuSection, HeaderSubMenu, HeaderMenuItem, HeaderToolbar },
			setup() {
				return { args }
			},
			template: `
			<div class="position: relative">
				<HeaderToolbar />
				<HeaderBar>
					<template #menu>
						<HeaderBurgerMenu v-model="args.modelValue">
							<HeaderMenuSection>
								<HeaderMenuItem>
									<HeaderSubMenu>
										<template #title>
											Sous menu
										</template>
										<HeaderMenuSection>
											<HeaderMenuItem>
												<a href="">Item 1</a>
											</HeaderMenuItem>
										</HeaderMenuSection>
									</HeaderSubMenu>
								</HeaderMenuItem>
							</HeaderMenuSection>
						</HeaderBurgerMenu>
					</template>
				</HeaderBar>
				<div
					style="height: 200vh; background-color: #f5f5f5; margin: auto; margin-top: 2rem; max-width: 1200px; padding: 1em;"
				>Contenu de la page</div>
			</div>`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<HeaderToolbar />
					<HeaderBar>
						<template #menu>
							<HeaderBurgerMenu>
								<HeaderMenuSection>
									<HeaderMenuItem>
										<HeaderSubMenu>
											<template #title>
												Sous menu
											</template>
											<HeaderMenuSection>
												<HeaderMenuItem>
													<a href="">Item 1</a>
												</HeaderMenuItem>
											</HeaderMenuSection>
										</HeaderSubMenu>
									</HeaderMenuItem>
								</HeaderMenuSection>
							</HeaderBurgerMenu>
						</template>
					</HeaderBar>
					<div
						style="height: 200vh; background-color: #f5f5f5; margin: auto; margin-top: 2rem; max-width: 1200px; padding: 1em;"
					>Contenu de la page</div>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { HeaderBurgerMenu, HeaderBar, HeaderMenuSection, HeaderMenuItem, HeaderSubMenu } from '@cnamts/synapse'
				</script>
				`,
			},
		],
	},
}

export const Generated: Story = {
	args: {},
	render: (args) => {
		return {
			components: {
				HeaderBurgerMenu,
				HeaderBar,
				HeaderMenuSection,
				HeaderSubMenu,
				HeaderMenuItem,
			},
			setup() {
				const menu = [
					{
						title: 'Vous informer',
						items: [
							{
								title: 'Actualités',
								href: 'https://www.ameli.fr/assure/actualites',
							},
							{
								subMenuTitle: 'Droits et démarches',
								subMenuSubtitle: 'selon votre situation',
								sections: [
									{
										title: undefined,
										items: [
											{
												title: 'Les essentiels de l’assuré',
												href: 'https://www.ameli.fr/assure/droits-demarches/principes',
											},
											{
												title: 'Parentalité, couple',
												href: 'https://www.ameli.fr/assure/droits-demarches/famille',
											},
											{
												title: 'Fin de vie, deuil',
												href: 'https://www.ameli.fr/assure/droits-demarches/fin-de-vie-deuil',
											},
											{
												title: 'Etudes et stages',
												href: 'https://www.ameli.fr/assure/droits-demarches/etudes-stages',
											},
											{
												title: 'Vie professionnelle, retraite',
												href: 'https://www.ameli.fr/assure/droits-demarches/vie-professionnelle-retraite',
											},
											{
												title: 'Difficultés d\'accès aux droits et aux soins',
												href: 'https://www.ameli.fr/assure/droits-demarches/difficultes-acces-droits-soins',
											},
											{
												title: 'Maladie, accident, hospitalisation',
												href: 'https://www.ameli.fr/assure/droits-demarches/maladie-accident-hospitalisation',
											},
											{
												title: 'invalidité, handicap',
												href: 'https://www.ameli.fr/assure/droits-demarches/invalidite-handicap',
											},
											{
												title: 'situations particulières',
												href: 'https://www.ameli.fr/assure/droits-demarches/situations-particulieres',
											},
											{
												title: 'réclamation, médiation, recours',
												href: 'https://www.ameli.fr/assure/droits-demarches/reclamation-mediation-voies-de-recours',
											},
											{
												title: 'Europe, international',
												href: 'https://www.ameli.fr/assure/droits-demarches/europe-international',
											},
										],
									},
								],
							},
							{
								subMenuTitle: 'Remboursements',
								subMenuSubtitle: 'prestations et aides',
								sections: [
									{
										title: undefined,
										items: [
											{
												title: 'Ce qui est remboursé',
												href: 'https://www.ameli.fr/assure/remboursements/rembourse',
											},
											{
												title: 'ce qui reste à votre charge',
												href: 'https://www.ameli.fr/assure/remboursements/reste-charge',
											},
											{
												title: 'Être bien remboursé',
												href: 'https://www.ameli.fr/assure/remboursements/etre-bien-rembourse',
											},
											{
												title:
                          'Indemnités journalières maladie, maternité, paternité',
												href: 'https://www.ameli.fr/assure/remboursements/indemnites-journalieres-maladie-maternite-paternite',
											},
											{
												title:
                          'Accident du travail : prise en charge et indemnités journalières',
												href: 'https://www.ameli.fr/assure/remboursements/accident-travail',
											},
											{
												title:
                          'Maladie professionnelle : prise en charge et indemnités journalières',
												href: 'https://www.ameli.fr/assure/remboursements/maladie-professionnelle',
											},
											{
												title: 'Pensions, allocations et rentes',
												href: 'https://www.ameli.fr/assure/remboursements/pensions-allocations-rentes',
											},
											{
												title: 'Incapacité permanente',
												href: 'https://www.ameli.fr/assure/remboursements/incapacite-permanente',
											},
											{
												title:
                          'Complémentaire santé solidaire : vous n\'avez rien à payer dans la plupart des cas ',
												href: 'https://www.ameli.fr/assure/remboursements/cmu-aides-financieres/complementaire-sante-solidaire',
											},
											{
												title: 'Aide médicale de l\'État et soins urgents',
												href: 'https://www.ameli.fr/assure/remboursements/aide-medicale-etat-soins-urgents',
											},
											{
												title: 'Compte ameli, mode d\'emploi',
												href: 'https://www.ameli.fr/assure/remboursements/suivre-remboursements',
											},
										],
									},
								],
							},
							{
								subMenuTitle: 'Maladies et prévention',
								sections: [
									{
										title: undefined,
										items: [
											{
												title: 'Tous les thèmes de santé',
												href: 'https://www.ameli.fr/assure/sante/themes',
											},
											{
												title: 'L\'Assurance Maladie vous accompagne',
												href: 'https://www.ameli.fr/assure/remboursements/reste-charge',
											},
											{
												title: 'Mon espace santé',
												href: 'https://www.ameli.fr/assure/sante/mon-espace-sante',
											},
											{
												title: 'Mon bilan prévention',
												href: 'https://www.ameli.fr/assure/sante/mon-bilan-prevention',
											},
											{
												title: 'Réagir en cas d\'urgence ',
												href: 'https://www.ameli.fr/assure/sante/urgence',
											},
											{
												title: 'Accomplir les bons gestes ',
												href: 'https://www.ameli.fr/assure/sante/bons-gestes',
											},
											{
												title: 'Médicaments et vaccins',
												href: 'https://www.ameli.fr/assure/sante/medicaments',
											},
											{
												title: 'Déroulement d\'un examen',
												href: 'https://www.ameli.fr/assure/sante/examen',
											},
											{
												title:
                          'Certificat médical : dans quels cas et pour qui est-il obligatoire ?',
												href: 'https://www.ameli.fr/assure/sante/certificat-medical-quand-et-pour-qui',
											},
											{
												title: 'Devenir parent',
												href: 'https://www.ameli.fr/assure/sante/devenir-parent',
											},
											{
												title: 'Enfants',
												href: 'https://www.ameli.fr/assure/sante/enfants',
											},
											{
												title: 'Jeunes 16-25 ans',
												href: 'https://www.ameli.fr/assure/sante/jeunes-16-25-ans',
											},
											{
												title: 'Seniors',
												href: 'https://www.ameli.fr/assure/sante/seniors',
											},
											{
												title: 'Télésanté, la santé à distance',
												href: 'https://www.ameli.fr/assure/sante/telesante',
											},
										],
									},
								],
							},
						],
					},
					{
						title: 'Besoin d\'aide',
						items: [
							{
								title: 'Contacter l\'Assurance Maladie',
								subtitle:
                  'obtenir une attestation, envoyer une feuille de soins, contacter sa caisse, etc.',
								href: 'https://www.ameli.fr/assure/adresses-contacts',
							},
							{
								title: 'Trouver un professionnel de santé',
								subtitle: 'médecins, infirmiers...',
								href: 'https://www.ameli.fr/assure/adresses-contacts',
							},
							{
								title: 'Télécharger un formulaire (ex: cerfa)',
								href: 'https://www.ameli.fr/assure/droits-demarches/formulaires',
							},
							{
								title: 'Consulter le forum',
								href: 'https://forum-assures.ameli.fr/',
							},
							{
								title: 'Sourds et malentendants',
								href: 'https://elioz.fr/elioz-connect/annuaire/assurance-maladie-annuaire/',
							},
						],
					},
				]
				return { args, menu, marker: mdiMapMarker }
			},
			template: `
				<HeaderBar>
					<template #menu>
						<HeaderBurgerMenu v-model="args.modelValue">
							<HeaderMenuSection v-for="section in menu" :key="section.title">
								<template #title>
									{{ section.title }}
								</template>
								<HeaderMenuItem v-for="item in section.items" :key="item.title">
									<HeaderSubMenu v-if="item.subMenuTitle">
										<template #title>
											{{ item.subMenuTitle }}
											<em v-if="item.subMenuSubtitle" style="font-style: normal; color: #757777;">{{ item.subMenuSubtitle }}</em>
										</template>
										<HeaderMenuSection v-for="subSection in item.sections" :key="subSection.title">
											<template #title v-if="subSection.title">
												{{ subSection.title }}
											</template>
											<HeaderMenuItem v-for="subItem in subSection.items" :key="subItem.title">
												<a :href="subItem.href">{{ subItem.title }}</a>
											</HeaderMenuItem>
										</HeaderMenuSection>
									</HeaderSubMenu>
									<a v-else :href="item.href">
										{{ item.title }}
										<em v-if="item.subtitle" style="font-style: normal; color: #757777;">{{ item.subtitle }}</em>
									</a>
								</HeaderMenuItem>
							</HeaderMenuSection>
							<h2 class="border-b-sm mb-2" style="font-size: 1.1rem; padding: 40px 16px 8px 20px;">Votre caisse</h2>
							<div style="padding: 16px 50px 16px 20px;">
								<div class="d-flex align-center ga-2 font-weight-bold">
									<VIcon aria-label="Localisation" role="img" aria-hidden="false" color="primary">{{marker}}</VIcon>
									<p>Vous n'avez pas sélectionné votre caisse</p>
								</div>
								<VBtn class="mt-3 mb-4 font-weight-bold text-capitalize" base-color="primary" density="comfortable" flat height="37">Sélectionner</VBtn>
								<p class="mb-8">Les pages d'ameli seront alors enrichies des informations locales de votre caisse (contacts, événements régionaux, etc.) </p>
							</div>
						</HeaderBurgerMenu>
					</template>
				</HeaderBar>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<HeaderBar>
						<template #menu>
							<HeaderBurgerMenu>
								<HeaderMenuSection
									v-for="section in menu"
									:key="section.title"
								>
									<template #title>
										{{ section.title }}
									</template>
									<HeaderMenuItem
										v-for="item in section.items"
										:key="item.title"
									>
										<HeaderSubMenu v-if="'subMenuTitle' in item">
											<template #title>
												{{ item.subMenuTitle }}
												<em
													v-if="item.subMenuSubtitle"
													style="font-style: normal; color: #757777;"
												>{{ item.subMenuSubtitle }}</em>
											</template>
											<HeaderMenuSection
												v-for="subSection in item.sections"
												:key="subSection.title"
											>
												<template #title>
													{{ subSection.title }}
												</template>
												<HeaderMenuItem
													v-for="subItem in subSection.items"
													:key="subItem.title"
												>
													<a :href="subItem.href">{{ subItem.title }}</a>
												</HeaderMenuItem>
											</HeaderMenuSection>
										</HeaderSubMenu>
										<a
											v-else
											:href="item.href"
										>
											{{ item.title }}
											<em
												v-if="'subtitle' in item"
												style="font-style: normal; color: #757777;"
											>{{ item.subtitle }}</em>
										</a>
									</HeaderMenuItem>
								</HeaderMenuSection>
								<h2
									class="border-b-sm mb-2"
									style="font-size: 1.1rem; padding: 40px 16px 8px 20px;"
								>
									Votre caisse
								</h2>
								<div style="padding: 16px 50px 16px 20px;">
									<div class="d-flex align-center ga-2 font-weight-bold">
										<VIcon
											aria-label="Localisation"
											role="img"
											aria-hidden="false"
											color="primary"
										>
											{{ marker }}
										</VIcon>
										<p>Vous n'avez pas sélectionné votre caisse</p>
									</div>
									<VBtn
										class="mt-3 mb-4 font-weight-bold text-capitalize"
										base-color="primary"
										density="comfortable"
										flat
										height="37"
									>
										Sélectionner
									</VBtn>
									<p class="mb-8">
										Les pages d'ameli seront alors enrichies des informations locales de votre caisse (contacts, événements régionaux, etc.)
									</p>
								</div>
							</HeaderBurgerMenu>
						</template>
					</HeaderBar>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { HeaderBurgerMenu, HeaderBar, HeaderMenuSection, HeaderSubMenu, HeaderMenuItem } from '@cnamts/synapse'
					import { VBtn, VIcon } from 'vuetify/components'
					import { mdiMapMarker } from '@mdi/js'

					const marker = mdiMapMarker

					const menu = [
					{
						title: 'Vous informer',
						items: [
							{
								title: 'Actualités',
								href: 'https://www.ameli.fr/assure/actualites',
							},
							{
								subMenuTitle: 'Droits et démarches',
								subMenuSubtitle: 'selon votre situation',
								sections: [
									{
										title: undefined,
										items: [
											{
												title: 'Les essentiels de l\\’assuré',
												href: 'https://www.ameli.fr/assure/droits-demarches/principes',
											},
											{
												title: 'Parentalité, couple',
												href: 'https://www.ameli.fr/assure/droits-demarches/famille',
											},
											{
												title: 'Fin de vie, deuil',
												href: 'https://www.ameli.fr/assure/droits-demarches/fin-de-vie-deuil',
											},
											{
												title: 'Etudes et stages',
												href: 'https://www.ameli.fr/assure/droits-demarches/etudes-stages',
											},
											{
												title: 'Vie professionnelle, retraite',
												href: 'https://www.ameli.fr/assure/droits-demarches/vie-professionnelle-retraite',
											},
											{
												title: 'Difficultés d\\'accès aux droits et aux soins',
												href: 'https://www.ameli.fr/assure/droits-demarches/difficultes-acces-droits-soins',
											},
											{
												title: 'Maladie, accident, hospitalisation',
												href: 'https://www.ameli.fr/assure/droits-demarches/maladie-accident-hospitalisation',
											},
											{
												title: 'invalidité, handicap',
												href: 'https://www.ameli.fr/assure/droits-demarches/invalidite-handicap',
											},
											{
												title: 'situations particulières',
												href: 'https://www.ameli.fr/assure/droits-demarches/situations-particulieres',
											},
											{
												title: 'réclamation, médiation, recours',
												href: 'https://www.ameli.fr/assure/droits-demarches/reclamation-mediation-voies-de-recours',
											},
											{
												title: 'Europe, international',
												href: 'https://www.ameli.fr/assure/droits-demarches/europe-international',
											},
										],
									},
								],
							},
							{
								subMenuTitle: 'Remboursements',
								subMenuSubtitle: 'prestations et aides',
								sections: [
									{
										title: undefined,
										items: [
											{
												title: 'Ce qui est remboursé',
												href: 'https://www.ameli.fr/assure/remboursements/rembourse',
											},
											{
												title: 'ce qui reste à votre charge',
												href: 'https://www.ameli.fr/assure/remboursements/reste-charge',
											},
											{
												title: 'Être bien remboursé',
												href: 'https://www.ameli.fr/assure/remboursements/etre-bien-rembourse',
											},
											{
												title:
                          'Indemnités journalières maladie, maternité, paternité',
												href: 'https://www.ameli.fr/assure/remboursements/indemnites-journalieres-maladie-maternite-paternite',
											},
											{
												title:
                          'Accident du travail : prise en charge et indemnités journalières',
												href: 'https://www.ameli.fr/assure/remboursements/accident-travail',
											},
											{
												title:
                          'Maladie professionnelle : prise en charge et indemnités journalières',
												href: 'https://www.ameli.fr/assure/remboursements/maladie-professionnelle',
											},
											{
												title: 'Pensions, allocations et rentes',
												href: 'https://www.ameli.fr/assure/remboursements/pensions-allocations-rentes',
											},
											{
												title: 'Incapacité permanente',
												href: 'https://www.ameli.fr/assure/remboursements/incapacite-permanente',
											},
											{
												title:
                          'Complémentaire santé solidaire : vous n\\'avez rien à payer dans la plupart des cas ',
												href: 'https://www.ameli.fr/assure/remboursements/cmu-aides-financieres/complementaire-sante-solidaire',
											},
											{
												title: 'Aide médicale de l\\'État et soins urgents',
												href: 'https://www.ameli.fr/assure/remboursements/aide-medicale-etat-soins-urgents',
											},
											{
												title: 'Compte ameli, mode d\\'emploi',
												href: 'https://www.ameli.fr/assure/remboursements/suivre-remboursements',
											},
										],
									},
								],
							},
							{
								subMenuTitle: 'Maladies et prévention',
								sections: [
									{
										title: undefined,
										items: [
											{
												title: 'Tous les thèmes de santé',
												href: 'https://www.ameli.fr/assure/sante/themes',
											},
											{
												title: 'L\\'Assurance Maladie vous accompagne',
												href: 'https://www.ameli.fr/assure/remboursements/reste-charge',
											},
											{
												title: 'Mon espace santé',
												href: 'https://www.ameli.fr/assure/sante/mon-espace-sante',
											},
											{
												title: 'Mon bilan prévention',
												href: 'https://www.ameli.fr/assure/sante/mon-bilan-prevention',
											},
											{
												title: 'Réagir en cas d\\'urgence ',
												href: 'https://www.ameli.fr/assure/sante/urgence',
											},
											{
												title: 'Accomplir les bons gestes ',
												href: 'https://www.ameli.fr/assure/sante/bons-gestes',
											},
											{
												title: 'Médicaments et vaccins',
												href: 'https://www.ameli.fr/assure/sante/medicaments',
											},
											{
												title: 'Déroulement d\\'un examen',
												href: 'https://www.ameli.fr/assure/sante/examen',
											},
											{
												title:
                          'Certificat médical : dans quels cas et pour qui est-il obligatoire ?',
												href: 'https://www.ameli.fr/assure/sante/certificat-medical-quand-et-pour-qui',
											},
											{
												title: 'Devenir parent',
												href: 'https://www.ameli.fr/assure/sante/devenir-parent',
											},
											{
												title: 'Enfants',
												href: 'https://www.ameli.fr/assure/sante/enfants',
											},
											{
												title: 'Jeunes 16-25 ans',
												href: 'https://www.ameli.fr/assure/sante/jeunes-16-25-ans',
											},
											{
												title: 'Seniors',
												href: 'https://www.ameli.fr/assure/sante/seniors',
											},
											{
												title: 'Télésanté, la santé à distance',
												href: 'https://www.ameli.fr/assure/sante/telesante',
											},
										],
									},
								],
							},
						],
					},
					{
						title: 'Besoin d\\'aide',
						items: [
							{
								title: 'Contacter l\\'Assurance Maladie',
								subtitle:
                  'obtenir une attestation, envoyer une feuille de soins, contacter sa caisse, etc.',
								href: 'https://www.ameli.fr/assure/adresses-contacts',
							},
							{
								title: 'Trouver un professionnel de santé',
								subtitle: 'médecins, infirmiers...',
								href: 'https://www.ameli.fr/assure/adresses-contacts',
							},
							{
								title: 'Télécharger un formulaire (ex: cerfa)',
								href: 'https://www.ameli.fr/assure/droits-demarches/formulaires',
							},
							{
								title: 'Consulter le forum',
								href: 'https://forum-assures.ameli.fr/',
							},
							{
								title: 'Sourds et malentendants',
								href: 'https://elioz.fr/elioz-connect/annuaire/assurance-maladie-annuaire/',
							},
						],
					},
				]
				</script>
				`,
			},
		],
	},
}
