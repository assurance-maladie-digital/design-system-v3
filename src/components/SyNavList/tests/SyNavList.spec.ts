import { afterEach, describe, expect, it } from 'vitest'
import { type DOMWrapper, enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { mdiCogOutline, mdiFolderOutline, mdiSquareEditOutline } from '@mdi/js'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import SyNavList from '../SyNavList.vue'
import type { SyNavListItem } from '../types'

const edit = { id: 'edit', icon: mdiSquareEditOutline, label: 'Modifier' }
const settings = { id: 'settings', icon: mdiCogOutline, label: 'Paramètres' }

const items: SyNavListItem[] = [
	{
		id: 'droit-de-base',
		label: 'Droit de base',
		href: '/droit-de-base',
		icon: mdiFolderOutline,
		actions: [edit],
		children: [
			{
				id: 'demande-affiliation',
				label: 'Demande d’affiliation',
				href: '/demande-affiliation',
				children: [{ id: 'pieces', label: 'Pièces justificatives', href: '/pieces' }],
			},
		],
	},
	{ id: 'ame', label: 'AME', href: '/ame', actions: [settings, edit] },
	{ id: 'cmu-c', label: 'CMU-C/AS' },
]

enableAutoUnmount(afterEach)

afterEach(() => {
	document.body.innerHTML = ''
})

function mountNavList(props: Partial<InstanceType<typeof SyNavList>['$props']> = {}) {
	return mount(SyNavList, {
		props: { items, ...props },
		attachTo: document.body,
	})
}

function toggleOf(wrapper: ReturnType<typeof mountNavList>, label: string): DOMWrapper<HTMLButtonElement> {
	return wrapper.get<HTMLButtonElement>(`button[aria-label^="${label} :"]`)
}

function pressEscapeOnDocument(): void {
	document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
}

describe('SyNavList', () => {
	it('nomme la navigation sur le <nav>, sans répéter le nom sur la liste racine', () => {
		const wrapper = mountNavList()

		expect(wrapper.get('nav').attributes('aria-label')).toBe('Navigation secondaire')
		expect(wrapper.get('nav > [role="list"]').attributes('aria-label')).toBeUndefined()
	})

	it('utilise la prop label comme nom de la navigation', () => {
		const wrapper = mountNavList({ label: 'Dossiers client' })

		expect(wrapper.get('nav').attributes('aria-label')).toBe('Dossiers client')
	})

	it('ne rend rien quand la liste est vide', () => {
		const wrapper = mountNavList({ items: [] })

		expect(wrapper.find('nav').exists()).toBe(false)
	})

	it('rend un lien par entrée qui a une adresse, et un simple texte sinon', () => {
		const wrapper = mountNavList()

		expect(wrapper.get('a[href="/droit-de-base"]').text()).toBe('Droit de base')
		expect(wrapper.get('a[href="/ame"]').text()).toBe('AME')
		expect(wrapper.find('a[href=""]').exists()).toBe(false)
		expect(wrapper.get('span.sy-nav-list-panel__link').text()).toBe('CMU-C/AS')
	})

	it('pose aria-current="page" sur l\'entrée de la route active (RouterLink)', async () => {
		const router = createRouter({
			history: createMemoryHistory(),
			routes: [
				{ path: '/', component: { template: '<div />' } },
				{ path: '/dossiers', component: { template: '<div />' } },
			],
		})
		await router.push('/dossiers')
		await router.isReady()

		const wrapper = mount(SyNavList, {
			props: {
				items: [
					{ id: 'accueil', label: 'Accueil', to: '/' },
					{ id: 'dossiers', label: 'Dossiers', to: '/dossiers' },
				],
			},
			global: { plugins: [router] },
		})

		expect(wrapper.get('a[href="/dossiers"]').attributes('aria-current')).toBe('page')
		expect(wrapper.get('a[href="/"]').attributes('aria-current')).toBeUndefined()
	})

	it('n\'imbrique aucun bouton dans un lien (RGAA 8.2)', () => {
		const wrapper = mountNavList()

		expect(wrapper.findAll('a button')).toHaveLength(0)
		expect(wrapper.findAll('button').length).toBeGreaterThan(0)
	})

	it('donne à chaque action un nom qui reprend celui de l\'entrée', () => {
		const wrapper = mountNavList()

		const labels = wrapper.findAll('.sy-nav-list-panel__actions button').map(button => button.attributes('aria-label'))

		expect(labels).toEqual(expect.arrayContaining([
			'Modifier (Droit de base)',
			'Paramètres (AME)',
			'Modifier (AME)',
		]))
	})

	it('émet action sans ouvrir le sous-niveau', async () => {
		const wrapper = mountNavList()

		await wrapper.get('button[aria-label="Modifier (Droit de base)"]').trigger('click')

		expect(wrapper.emitted('action')).toEqual([[items[0], edit]])
		expect(toggleOf(wrapper, 'Droit de base').attributes('aria-expanded')).toBe('false')
	})

	it('remonte les actions des sous-niveaux', async () => {
		const nested: SyNavListItem[] = [
			{ id: 'parent', label: 'Parent', children: [{ id: 'enfant', label: 'Enfant', actions: [edit] }] },
		]
		const wrapper = mountNavList({ items: nested })

		await wrapper.get('button[aria-label="Modifier (Enfant)"]').trigger('click')

		expect(wrapper.emitted('action')).toEqual([[nested[0]!.children![0], edit]])
	})

	it('garde dans la page la cible de aria-controls, sous-niveau fermé (RGAA 8.2)', () => {
		const wrapper = mountNavList()

		const toggles = wrapper.findAll('button[aria-controls]')

		expect(toggles).toHaveLength(2)
		for (const toggle of toggles) {
			expect(toggle.attributes('aria-expanded')).toBe('false')
			expect(document.getElementById(toggle.attributes('aria-controls')!)).not.toBeNull()
		}
	})

	it('ouvre et ferme le sous-niveau avec le chevron, en mettant à jour son état et son intitulé', async () => {
		const wrapper = mountNavList()
		const toggle = toggleOf(wrapper, 'Droit de base')
		const panel = document.getElementById(toggle.attributes('aria-controls')!)!

		expect(toggle.attributes('aria-label')).toBe('Droit de base : afficher le sous-menu')
		expect(panel.style.display).toBe('none')

		await toggle.trigger('click')

		expect(toggle.attributes('aria-expanded')).toBe('true')
		expect(toggle.attributes('aria-label')).toBe('Droit de base : masquer le sous-menu')
		expect(panel.style.display).toBe('')

		await toggle.trigger('click')

		expect(toggle.attributes('aria-expanded')).toBe('false')
		expect(panel.style.display).toBe('none')
	})

	it('nomme chaque sous-niveau d\'après son entrée', () => {
		const wrapper = mountNavList()

		const panel = document.getElementById(toggleOf(wrapper, 'Droit de base').attributes('aria-controls')!)!

		expect(panel.querySelector('[role="list"]')?.getAttribute('aria-label')).toBe('Sous-menu Droit de base')
	})

	it('masque toutes les icônes aux technologies d\'assistance, sans role="img" (RGAA 1.1)', async () => {
		// Jeu d'icônes SVG du DS : celui du setup de test rend des <i> sans SVG.
		const wrapper = mount(SyNavList, {
			props: { items },
			global: { plugins: [createVuetify({ icons: { defaultSet: 'mdi', aliases, sets: { mdi } } })] },
		})
		await flushPromises()

		const svgs = wrapper.findAll('svg')

		expect(svgs.length).toBeGreaterThan(0)
		for (const svg of svgs) {
			expect(svg.attributes('role')).not.toBe('img')
			expect(svg.attributes('aria-hidden')).toBe('true')
		}
	})

	it('retire les listes de l\'ordre de tabulation : seuls liens et boutons le sont', () => {
		const wrapper = mountNavList()

		for (const list of wrapper.findAll('[role="list"]')) {
			expect(list.attributes('tabindex')).toBe('-1')
		}
	})

	it('Échap ferme le sous-niveau le plus profond, même focus ailleurs (RGAA 10.13)', async () => {
		const wrapper = mountNavList()
		const parent = toggleOf(wrapper, 'Droit de base')
		await parent.trigger('click')
		const child = toggleOf(wrapper, 'Demande d’affiliation')
		await child.trigger('click')

		pressEscapeOnDocument()
		await flushPromises()

		expect(child.attributes('aria-expanded')).toBe('false')
		expect(parent.attributes('aria-expanded')).toBe('true')

		pressEscapeOnDocument()
		await flushPromises()

		expect(parent.attributes('aria-expanded')).toBe('false')
	})

	it('referme les sous-niveaux d\'une entrée qui se ferme', async () => {
		const wrapper = mountNavList()
		const parent = toggleOf(wrapper, 'Droit de base')
		await parent.trigger('click')
		const child = toggleOf(wrapper, 'Demande d’affiliation')
		await child.trigger('click')

		await parent.trigger('click')

		expect(child.attributes('aria-expanded')).toBe('false')

		// Plus rien dans la pile d'Échap : rouvrir le parent ne rouvre pas l'enfant.
		await parent.trigger('click')
		pressEscapeOnDocument()
		await flushPromises()

		expect(parent.attributes('aria-expanded')).toBe('false')
	})

	it('Échap dans un sous-niveau le referme et rend le focus au chevron', async () => {
		const wrapper = mountNavList()
		const toggle = toggleOf(wrapper, 'Droit de base')
		await toggle.trigger('click')
		const childLink = wrapper.get<HTMLAnchorElement>('a[href="/demande-affiliation"]')
		childLink.element.focus()

		await childLink.trigger('keydown', { key: 'Escape' })

		expect(toggle.attributes('aria-expanded')).toBe('false')
		expect(document.activeElement).toBe(toggle.element)
	})

	it('n\'étend pas les flèches d\'un sous-niveau à la liste parente', async () => {
		const wrapper = mountNavList()
		await toggleOf(wrapper, 'Droit de base').trigger('click')
		const received: string[] = []
		wrapper.get('nav').element.addEventListener('keydown', event => received.push(event.key))

		for (const key of ['ArrowDown', 'ArrowUp', 'Home', 'End']) {
			await wrapper.get('a[href="/demande-affiliation"]').trigger('keydown', { key })
		}
		await wrapper.get('a[href="/ame"]').trigger('keydown', { key: 'ArrowDown' })

		expect(received).toEqual(['ArrowDown'])
	})

	it('ouvre le sous-niveau au survol à la souris sur grand écran, et le referme en sortie', async () => {
		const wrapper = mountNavList()
		const row = wrapper.findAll('.sy-nav-list-panel__row')[0]!

		await row.trigger('pointerenter', { pointerType: 'mouse' })

		expect(toggleOf(wrapper, 'Droit de base').attributes('aria-expanded')).toBe('true')

		await row.trigger('pointerleave', { pointerType: 'mouse' })

		expect(toggleOf(wrapper, 'Droit de base').attributes('aria-expanded')).toBe('false')
	})

	it('garde ouvert au clic un sous-niveau ouvert au survol, même après la sortie du pointeur', async () => {
		const wrapper = mountNavList()
		const row = wrapper.findAll('.sy-nav-list-panel__row')[0]!
		const toggle = toggleOf(wrapper, 'Droit de base')

		await row.trigger('pointerenter', { pointerType: 'mouse' })
		await toggle.trigger('click')

		expect(toggle.attributes('aria-expanded')).toBe('true')

		await row.trigger('pointerleave', { pointerType: 'mouse' })

		expect(toggle.attributes('aria-expanded')).toBe('true')

		await toggle.trigger('click')

		expect(toggle.attributes('aria-expanded')).toBe('false')
	})

	it('n\'ouvre pas le sous-niveau au survol en largeur réduite ni au toucher', async () => {
		const wrapper = mountNavList()
		const row = wrapper.findAll('.sy-nav-list-panel__row')[0]!

		await row.trigger('pointerenter', { pointerType: 'touch' })

		expect(toggleOf(wrapper, 'Droit de base').attributes('aria-expanded')).toBe('false')

		const width = window.innerWidth
		try {
			window.innerWidth = 800
			await row.trigger('pointerenter', { pointerType: 'mouse' })
		}
		finally {
			window.innerWidth = width
		}

		expect(toggleOf(wrapper, 'Droit de base').attributes('aria-expanded')).toBe('false')
	})

	it('remplace les actions par le slot actions, à tous les niveaux', async () => {
		const wrapper = mount(SyNavList, {
			props: { items },
			slots: {
				actions: ({ item }: { item: SyNavListItem }) => `Actions de ${item.label}`,
			},
		})

		expect(wrapper.text()).toContain('Actions de Droit de base')
		expect(wrapper.text()).toContain('Actions de Demande d’affiliation')
		expect(wrapper.text()).toContain('Actions de CMU-C/AS')
		expect(wrapper.find('button[aria-label="Modifier (Droit de base)"]').exists()).toBe(false)
	})

	it('affiche les actions déclarées dans items pour une entrée où le slot ne rend rien', () => {
		const wrapper = mount(SyNavList, {
			props: { items },
			slots: {
				actions: ({ item }: { item: SyNavListItem }) => item.id === 'droit-de-base' ? 'Action personnalisée' : [],
			},
		})

		expect(wrapper.text()).toContain('Action personnalisée')
		expect(wrapper.find('button[aria-label="Modifier (Droit de base)"]').exists()).toBe(false)
		expect(wrapper.find('button[aria-label="Modifier (AME)"]').exists()).toBe(true)
	})

	it('accepte une surcharge partielle des libellés', () => {
		const wrapper = mountNavList({
			locales: { openSubMenu: (label: string) => `Ouvrir ${label}` },
		})

		expect(wrapper.get('button[aria-controls]').attributes('aria-label')).toBe('Ouvrir Droit de base')
		expect(wrapper.get('nav').attributes('aria-label')).toBe('Navigation secondaire')
	})
})
