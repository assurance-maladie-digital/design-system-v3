/* eslint-disable @typescript-eslint/no-explicit-any */
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { VApp } from 'vuetify/components'
import * as DesignSystem from '@/components'
import { generateRequiredProps, isMountableComponent } from '@tests/helpers/attrsFallthrough'
import { registerHeaderMenuKey } from '@/components/HeaderBar/consts'
import { registerSubMenuKey } from '@/components/HeaderBar/HeaderBurgerMenu/conts'

// Mock nécessaire pour les composants s'appuyant sur MutationObserver (ex: dialogs, onboarding)
class NoopMutationObserver {
	observe = vi.fn()
	disconnect = vi.fn()
	takeRecords = vi.fn(() => [])
}
global.MutationObserver = NoopMutationObserver as any

// Des composants (ex: Captcha) appellent fetch() dès le montage. Sans mock, la valeur de
// stub passée en urlCreate est résolue par happy-dom sur http://localhost:3000 et déclenche
// une vraie tentative de connexion réseau (ECONNREFUSED) à chaque test.
vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 200 })))

const ATTR_NAME = 'data-attrs-fallthrough-test'
const ATTR_VALUE = 'fallthrough-ok'

// Valeurs de props additionnelles nécessaires pour que le composant rende réellement
// du contenu (le générateur générique ne remplit que les props "required", certains
// composants conditionnent leur rendu à des props optionnelles).
const PROP_OVERRIDES: Record<string, Record<string, unknown>> = {
	ChipList: { items: [{ text: 'stub-value', value: 'stub-value' }] },
	CookiesInformation: { type: 'essentials', tableItems: [] },
	CookiesSelection: { items: { essentials: [] } },
	FilePreview: { file: new Blob(['stub'], { type: 'text/plain' }) },
	UserInformationSummary: { userInformationSummaryInfos: { userName: 'stub-value' } },
	AmeliproIconBtn: { btnLabel: 'stub-value' },
	// Props avec validation stricte : la valeur générique générée par le stub générateur échoue le validator
	SyIcon: { icon: 'mdi-alert-circle', label: 'stub-value' },
	RatingPicker: { type: 'stars' },
	MonthPicker: { label: 'stub-value' },
	// Dialogs/onboardings : rien n'est rendu (teleport vide) tant que le modèle d'ouverture n'est pas actif
	DialogBox: { modelValue: true },
	AmeliproDialog: { modelValue: true },
	AmeliproOnboarding: { modelValue: true, steps: [{ img: 'stub.png', title: 'stub-value', content: ['stub-value'] }] },
	StructureMenu: { modelValue: { dialog: true } },
}

// Composants qui rendent un VNavigationDrawer : celui-ci requiert une injection de layout
// Vuetify normalement fournie par VApp, absente d'un montage isolé.
const NEEDS_VAPP_LAYOUT = new Set(['FilterSideBar', 'AmeliproMenu'])

// Composants exclus : incompatibilités structurelles avec un montage générique isolé,
// chacune documentée individuellement. Ne pas ajouter d'entrée sans raison précise.
const EXCLUDED_COMPONENTS: Record<string, string> = {}

const componentEntries = Object.entries(DesignSystem)
	.filter(([, value]) => isMountableComponent(value))
	.filter(([name]) => !(name in EXCLUDED_COMPONENTS))

describe('Attributs HTML transmis (fallthrough) sur tous les composants', () => {
	it.each(componentEntries)('%s restitue les attributs HTML passés dans le DOM', async (name, component) => {
		const props = {
			...generateRequiredProps(component as any),
			...(PROP_OVERRIDES[name] ?? {}),
		}

		// VNavigationDrawer a besoin d'un ancêtre VApp pour l'injection de layout Vuetify
		const target = NEEDS_VAPP_LAYOUT.has(name)
			? defineComponent({
					components: { VApp, Target: component as any },
					inheritAttrs: false,
					template: '<VApp><Target v-bind="$attrs" /></VApp>',
				})
			: (component as any)

		const wrapper = mount(target, {
			props,
			attrs: { [ATTR_NAME]: ATTR_VALUE },
			attachTo: document.body,
			global: {
				// RouterLink n'est pas résolvable hors contexte vue-router ; registerHeaderMenu/registerSubMenu
				// sont normalement fournis par HeaderBar/HeaderBurgerMenu
				stubs: { RouterLink: true },
				provide: {
					[registerHeaderMenuKey]: () => {},
					[registerSubMenuKey]: () => {},
				},
			},
		})

		// Certains composants (dialogs, menus…) rendent via Teleport dans le <body> :
		// wrapper.html() ne restitue que la racine du composant, il faut aussi vérifier le body.
		const renderedHtml = `${wrapper.html()}\n${document.body.innerHTML}`
		expect(renderedHtml).toContain(`${ATTR_NAME}="${ATTR_VALUE}"`)

		// Laisse les effets async d'onMounted se résoudre avant de démonter, sinon certains
		// composants (ex: RangeSlider) accèdent à des refs de template devenues nulles.
		await flushPromises()
		wrapper.unmount()
	})

	describe.skip('Composants exclus (raisons documentées)', () => {
		for (const [name, reason] of Object.entries(EXCLUDED_COMPONENTS)) {
			it(`${name}: ${reason}`, () => {})
		}
	})
})
