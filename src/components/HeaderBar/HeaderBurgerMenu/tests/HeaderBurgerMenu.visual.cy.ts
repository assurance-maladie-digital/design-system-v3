import { mdiMapMarker } from '@mdi/js'
import { defineComponent, h } from 'vue'
import { VBtn, VIcon } from 'vuetify/components'
import HeaderBurgerMenu from '../HeaderBurgerMenu.vue'
import HeaderMenuItem from '../HeaderMenuItem/HeaderMenuItem.vue'
import HeaderMenuSection from '../HeaderMenuSection/HeaderMenuSection.vue'
import HeaderSubMenu from '../HeaderSubMenu/HeaderSubMenu.vue'
import { registerHeaderMenuKey } from '../../consts'

type LinkItem = {
	title: string
	href: string
	subtitle?: string
}

type SubMenuSection = {
	title: string
	items: LinkItem[]
}

type MenuItem = LinkItem | {
	subMenuTitle: string
	subMenuSubtitle?: string
	sections: SubMenuSection[]
}

type MenuSection = {
	title: string
	items: MenuItem[]
}

const menu: MenuSection[] = [
	{
		title: 'Vous informer',
		items: [
			{
				title: 'Actualites',
				href: 'https://www.ameli.fr/assure/actualites',
			},
			{
				subMenuTitle: 'Droits et demarches',
				subMenuSubtitle: 'selon votre situation',
				sections: [
					{
						title: 'Droits et demarches',
						items: [
							{
								title: 'Les essentiels de l\'assure',
								href: 'https://www.ameli.fr/assure/droits-demarches/principes',
							},
							{
								title: 'Parentalite, couple',
								href: 'https://www.ameli.fr/assure/droits-demarches/famille',
							},
						],
					},
					{
						title: 'Vie professionnelle',
						items: [
							{
								title: 'Arret de travail pour maladie',
								href: 'https://www.ameli.fr/assure/droits-demarches/maladie-accident-hospitalisation/arret-travail-maladie',
							},
							{
								title: 'Accident du travail ou de trajet',
								href: 'https://www.ameli.fr/assure/droits-demarches/maladie-accident-hospitalisation/accident-travail-trajet',
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
				subtitle: 'obtenir une attestation, envoyer une feuille de soins, contacter sa caisse, etc.',
				href: 'https://www.ameli.fr/assure/adresses-contacts',
			},
			{
				title: 'Trouver un professionnel de sante',
				subtitle: 'medecins, infirmiers...',
				href: 'https://www.ameli.fr/assure/adresses-contacts',
			},
		],
	},
]

function renderLink(item: LinkItem) {
	return h('a', { href: item.href }, [
		item.title,
		item.subtitle
			? h('em', { style: 'font-style: normal; color: #757777;' }, item.subtitle)
			: null,
	])
}

function renderMenuItem(item: MenuItem) {
	if ('subMenuTitle' in item) {
		return h(HeaderMenuItem, { key: item.subMenuTitle }, {
			default: () => h(HeaderSubMenu, { innerTag: 'div' }, {
				title: () => [
					item.subMenuTitle,
					item.subMenuSubtitle
						? h('em', { style: 'font-style: normal; color: #757777;' }, item.subMenuSubtitle)
						: null,
				],
				default: () => item.sections.map(subSection => h(HeaderMenuSection, {
					key: subSection.title,
					tag: 'div',
					showTitle: false,
				}, {
					title: () => subSection.title,
					default: () => subSection.items.map(subItem => h(HeaderMenuItem, { key: subItem.title }, {
						default: () => renderLink(subItem),
					})),
				})),
			}),
		})
	}

	return h(HeaderMenuItem, { key: item.title }, {
		default: () => renderLink(item),
	})
}

const GeneratedMenuContent = defineComponent({
	name: 'GeneratedMenuContent',
	setup() {
		return () => [
			...menu.map(section => h(HeaderMenuSection, { key: section.title }, {
				title: () => section.title,
				default: () => section.items.map(item => renderMenuItem(item)),
			})),
			h(HeaderMenuSection, { innerTag: 'div' }, {
				title: () => 'Votre caisse',
				default: () => h('div', { style: 'padding: 16px 50px 16px 20px;' }, [
					h('div', { class: 'd-flex align-center ga-2 font-weight-bold' }, [
						h(VIcon, {
							ariaLabel: 'Localisation',
							role: 'img',
							ariaHidden: 'false',
							color: 'primary',
						}, () => mdiMapMarker),
						h('p', 'Vous n\'avez pas selectionne votre caisse'),
					]),
					h(VBtn, {
						class: 'mt-3 mb-4 font-weight-bold text-capitalize',
						baseColor: 'primary',
						density: 'comfortable',
						flat: true,
						height: '37',
					}, () => 'Selectionner'),
					h('p', { class: 'mb-8' }, 'Les pages d\'ameli seront alors enrichies des informations locales de votre caisse.'),
				]),
			}),
		]
	},
})

function mountGeneratedMenu(width = 375, height = 900) {
	cy.viewport(width, height)

	cy.mountWithVuetify(HeaderBurgerMenu, {
		global: {
			provide: {
				[registerHeaderMenuKey]: () => {},
			},
		},
		slots: {
			default: GeneratedMenuContent,
		},
	})

	cy.get('.header-menu-btn').first().click()
	cy.get('.overlay').should('be.visible')
	cy.get('.header-menu-wrapper').should('be.visible')
}

describe('HeaderBurgerMenu - Visual regression tests', () => {
	it('displays the generated menu opened', () => {
		mountGeneratedMenu()
		cy.matchImageSnapshot('header-burger-menu-generated')
	})

	it('displays the generated menu with the first submenu opened', () => {
		mountGeneratedMenu(1200, 900)

		cy.contains('.sub-menu-btn', 'Droits et demarches').click()
		cy.get('.sub-menu--open').should('exist')
		cy.get('.sub-menu-content-wrapper').should('be.visible')
		cy.matchImageSnapshot('header-burger-menu-generated-submenu-open')
	})
})
