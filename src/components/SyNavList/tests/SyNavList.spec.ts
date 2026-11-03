import { afterEach, describe, expect, it, vi } from 'vitest'
import { type DOMWrapper, enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { mdiCogOutline, mdiFolderOutline, mdiSquareEditOutline } from '@mdi/js'
import { defineComponent, h, ref } from 'vue'
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

	it('affiche toutes les icônes en couleur primaire par défaut', () => {
		const wrapper = mountNavList()

		expect(wrapper.get('a[href="/droit-de-base"] .v-icon').classes()).toContain('text-primary')
		expect(wrapper.get('button[aria-label="Modifier (Droit de base)"]').classes()).toContain('text-primary')
		expect(toggleOf(wrapper, 'Droit de base').classes()).toContain('text-primary')
	})

	it('applique iconColor aux icônes d\'entrée, aux actions et aux chevrons, à tous les niveaux', () => {
		const nested: SyNavListItem[] = [
			{
				id: 'parent',
				label: 'Parent',
				icon: mdiFolderOutline,
				actions: [edit],
				children: [{ id: 'enfant', label: 'Enfant', icon: mdiFolderOutline, actions: [edit], children: [{ id: 'petit-enfant', label: 'Petit-enfant' }] }],
			},
		]
		const wrapper = mountNavList({ items: nested, iconColor: 'secondary' })

		const colored = [
			...wrapper.findAll('.sy-nav-list-panel__icon'),
			...wrapper.findAll('.sy-nav-list-panel__actions button'),
			...wrapper.findAll('button[aria-controls]'),
		]

		expect(colored).toHaveLength(6)
		for (const element of colored) {
			expect(element.classes()).toContain('text-secondary')
			expect(element.classes()).not.toContain('text-primary')
		}
	})

	it('réserve la place du chevron sur les entrées sans sous-niveau d\'un niveau qui en a', () => {
		const wrapper = mountNavList()
		const rootRows = wrapper.findAll('.sy-nav-list > .sy-nav-list-panel > .sy-nav-list-panel__row')

		const placeholders = rootRows.map(row => row.find(':scope > .v-list-item__append > .sy-nav-list-panel__controls > .sy-nav-list-panel__toggle-placeholder').exists())

		// Droit de base a un sous-niveau ; AME et CMU-C/AS non.
		expect(placeholders).toEqual([false, true, true])
		expect(wrapper.get('.sy-nav-list-panel__toggle-placeholder').attributes('aria-hidden')).toBe('true')
	})

	it('ne réserve pas la place du chevron dans un niveau sans sous-niveau', () => {
		const wrapper = mountNavList({ items: [{ id: 'a', label: 'A', href: '/a' }, { id: 'b', label: 'B', href: '/b' }] })

		expect(wrapper.find('.sy-nav-list-panel__toggle-placeholder').exists()).toBe(false)
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

	it('referme les sous-niveaux au clic hors de la liste, même sans focus sur le chevron (Safari)', async () => {
		const outside = document.createElement('button')
		document.body.append(outside)
		const wrapper = mountNavList()
		const parent = toggleOf(wrapper, 'Droit de base')
		await parent.trigger('click')
		const child = toggleOf(wrapper, 'Demande d’affiliation')
		await child.trigger('click')

		wrapper.get('a[href="/pieces"]').element.closest('[role="list"]')!.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
		await flushPromises()

		expect(child.attributes('aria-expanded')).toBe('true')

		outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
		await flushPromises()

		expect(child.attributes('aria-expanded')).toBe('false')
		expect(parent.attributes('aria-expanded')).toBe('false')
	})

	it('referme tous les sous-niveaux quand on suit un lien d\'un sous-niveau, et rend le focus au premier chevron', async () => {
		const wrapper = mountNavList()
		const parent = toggleOf(wrapper, 'Droit de base')
		await parent.trigger('click')
		const child = toggleOf(wrapper, 'Demande d’affiliation')
		await child.trigger('click')
		const link = wrapper.get<HTMLAnchorElement>('a[href="/pieces"]')
		link.element.addEventListener('click', event => event.preventDefault())

		link.element.focus()
		await link.trigger('click', { ctrlKey: true })

		expect(child.attributes('aria-expanded')).toBe('true')

		await link.trigger('click')

		expect(child.attributes('aria-expanded')).toBe('false')
		expect(parent.attributes('aria-expanded')).toBe('false')
		expect(document.activeElement).toBe(parent.element)
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

	describe('survol à la souris sur grand écran', () => {
		afterEach(() => {
			vi.useRealTimers()
		})

		function rowOf(wrapper: ReturnType<typeof mountNavList>, label: string): DOMWrapper<Element> {
			return wrapper.findAll('.sy-nav-list > .sy-nav-list-panel > .sy-nav-list-panel__row').find(row => row.text().startsWith(label))!
		}

		async function wait(ms: number): Promise<void> {
			vi.advanceTimersByTime(ms)
			await flushPromises()
		}

		const twoParents: SyNavListItem[] = [
			{ id: 'a', label: 'A', href: '/a', children: [{ id: 'a1', label: 'A1', href: '/a1' }] },
			{ id: 'b', label: 'B', href: '/b', children: [{ id: 'b1', label: 'B1', href: '/b1' }] },
			{ id: 'c', label: 'C', href: '/c' },
		]

		it('ouvre le sous-niveau après un court délai, et le referme après la sortie du pointeur', async () => {
			vi.useFakeTimers()
			const wrapper = mountNavList()
			const row = rowOf(wrapper, 'Droit de base')

			await row.trigger('pointerenter', { pointerType: 'mouse' })
			await wait(100)

			expect(toggleOf(wrapper, 'Droit de base').attributes('aria-expanded')).toBe('false')

			await wait(100)

			expect(toggleOf(wrapper, 'Droit de base').attributes('aria-expanded')).toBe('true')

			await row.trigger('pointerleave', { pointerType: 'mouse' })
			await wait(350)

			expect(toggleOf(wrapper, 'Droit de base').attributes('aria-expanded')).toBe('false')
		})

		it('n\'ouvre rien sur un simple passage du pointeur', async () => {
			vi.useFakeTimers()
			const wrapper = mountNavList()
			const row = rowOf(wrapper, 'Droit de base')

			await row.trigger('pointerenter', { pointerType: 'mouse' })
			await wait(50)
			await row.trigger('pointerleave', { pointerType: 'mouse' })
			await wait(400)

			expect(toggleOf(wrapper, 'Droit de base').attributes('aria-expanded')).toBe('false')
		})

		it('garde le sous-niveau ouvert quand le pointeur le rejoint en diagonale en traversant une autre entrée', async () => {
			vi.useFakeTimers()
			const wrapper = mountNavList({ items: twoParents })
			const rowA = rowOf(wrapper, 'A')
			const rowB = rowOf(wrapper, 'B')
			await rowA.trigger('pointerenter', { pointerType: 'mouse' })
			await wait(200)

			// Trajet : A, puis B traversée, puis le sous-niveau de A (qui fait partie de la ligne A)
			await rowA.trigger('pointerleave', { pointerType: 'mouse' })
			await rowB.trigger('pointerenter', { pointerType: 'mouse' })
			await wait(150)

			// Pendant la traversée de B, le sous-niveau de A reste affiché : le pointeur peut l'atteindre.
			expect(toggleOf(wrapper, 'A').attributes('aria-expanded')).toBe('true')
			expect(toggleOf(wrapper, 'B').attributes('aria-expanded')).toBe('false')

			await rowB.trigger('pointerleave', { pointerType: 'mouse' })
			await rowA.trigger('pointerenter', { pointerType: 'mouse' })
			await wait(400)

			expect(toggleOf(wrapper, 'A').attributes('aria-expanded')).toBe('true')
			expect(toggleOf(wrapper, 'B').attributes('aria-expanded')).toBe('false')
		})

		it('bascule sur une autre entrée quand le pointeur s\'y attarde', async () => {
			vi.useFakeTimers()
			const wrapper = mountNavList({ items: twoParents })
			const rowA = rowOf(wrapper, 'A')
			const rowB = rowOf(wrapper, 'B')
			await rowA.trigger('pointerenter', { pointerType: 'mouse' })
			await wait(200)

			await rowA.trigger('pointerleave', { pointerType: 'mouse' })
			await rowB.trigger('pointerenter', { pointerType: 'mouse' })
			await wait(350)

			expect(toggleOf(wrapper, 'A').attributes('aria-expanded')).toBe('false')
			expect(toggleOf(wrapper, 'B').attributes('aria-expanded')).toBe('true')
		})

		it('referme le sous-niveau quand le pointeur sort de la liste en traversant une entrée sans sous-niveau', async () => {
			vi.useFakeTimers()
			const wrapper = mountNavList({ items: twoParents })
			const rowA = rowOf(wrapper, 'A')
			const rowC = rowOf(wrapper, 'C')
			await rowA.trigger('pointerenter', { pointerType: 'mouse' })
			await wait(200)

			await rowA.trigger('pointerleave', { pointerType: 'mouse' })
			await rowC.trigger('pointerenter', { pointerType: 'mouse' })
			await wait(50)
			await rowC.trigger('pointerleave', { pointerType: 'mouse' })
			await wait(400)

			expect(toggleOf(wrapper, 'A').attributes('aria-expanded')).toBe('false')
		})

		it('Échap annule une ouverture au survol en attente', async () => {
			vi.useFakeTimers()
			const wrapper = mountNavList({ items: twoParents })
			const rowA = rowOf(wrapper, 'A')
			const rowB = rowOf(wrapper, 'B')
			await rowA.trigger('pointerenter', { pointerType: 'mouse' })
			await wait(200)
			await rowA.trigger('pointerleave', { pointerType: 'mouse' })
			await rowB.trigger('pointerenter', { pointerType: 'mouse' })

			pressEscapeOnDocument()
			await wait(400)

			expect(toggleOf(wrapper, 'A').attributes('aria-expanded')).toBe('false')
			expect(toggleOf(wrapper, 'B').attributes('aria-expanded')).toBe('false')
		})

		it('garde ouvert au clic un sous-niveau ouvert au survol, même après la sortie du pointeur', async () => {
			vi.useFakeTimers()
			const wrapper = mountNavList()
			const row = rowOf(wrapper, 'Droit de base')
			const toggle = toggleOf(wrapper, 'Droit de base')

			await row.trigger('pointerenter', { pointerType: 'mouse' })
			await wait(200)
			await toggle.trigger('click')

			expect(toggle.attributes('aria-expanded')).toBe('true')

			await row.trigger('pointerleave', { pointerType: 'mouse' })
			await wait(400)

			expect(toggle.attributes('aria-expanded')).toBe('true')

			await toggle.trigger('click')

			expect(toggle.attributes('aria-expanded')).toBe('false')
		})
	})

	it('émet sub-level-change à l\'ouverture du premier sous-niveau et à la fermeture du dernier', async () => {
		const wrapper = mountNavList()
		const parent = toggleOf(wrapper, 'Droit de base')

		await parent.trigger('click')
		await toggleOf(wrapper, 'Demande d’affiliation').trigger('click')

		expect(wrapper.emitted('subLevelChange')).toEqual([[true]])

		pressEscapeOnDocument()
		await flushPromises()

		expect(wrapper.emitted('subLevelChange')).toEqual([[true]])

		pressEscapeOnDocument()
		await flushPromises()

		expect(wrapper.emitted('subLevelChange')).toEqual([[true], [false]])
	})

	it('ferme le sous-niveau d\'une entrée retirée de items, et émet sub-level-change', async () => {
		const wrapper = mountNavList()
		await toggleOf(wrapper, 'Droit de base').trigger('click')
		await toggleOf(wrapper, 'Demande d’affiliation').trigger('click')

		await wrapper.setProps({ items: items.slice(1) })

		expect(wrapper.emitted('subLevelChange')).toEqual([[true], [false]])

		// Entrée remise dans la liste : elle revient fermée, et Échap ne vise plus l'ancien sous-niveau
		await wrapper.setProps({ items })
		const parent = toggleOf(wrapper, 'Droit de base')
		expect(parent.attributes('aria-expanded')).toBe('false')
		await parent.trigger('click')
		pressEscapeOnDocument()
		await flushPromises()
		expect(parent.attributes('aria-expanded')).toBe('false')
	})

	it('ferme le sous-niveau d\'une entrée devenue désactivée, ou sans sous-niveau', async () => {
		const wrapper = mountNavList()
		const parent = toggleOf(wrapper, 'Droit de base')
		await parent.trigger('click')

		await wrapper.setProps({ items: [{ ...items[0]!, disabled: true }, ...items.slice(1)] })

		expect(parent.attributes('aria-expanded')).toBe('false')

		await wrapper.setProps({ items })
		await parent.trigger('click')
		await wrapper.setProps({ items: [{ ...items[0]!, children: [] }, ...items.slice(1)] })

		expect(wrapper.emitted('subLevelChange')).toEqual([[true], [false], [true], [false]])
	})

	it('émet sub-level-change à chaque ouverture et fermeture au chevron', async () => {
		const wrapper = mountNavList()
		const parent = toggleOf(wrapper, 'Droit de base')

		await parent.trigger('click')
		await parent.trigger('click')

		expect(wrapper.emitted('subLevelChange')).toEqual([[true], [false]])
	})

	it('n\'émet pas sub-level-change quand on passe d\'un sous-niveau à un autre du même niveau', async () => {
		const wrapper = mountNavList({
			items: [
				{ id: 'a', label: 'A', children: [{ id: 'a1', label: 'A1' }] },
				{ id: 'b', label: 'B', children: [{ id: 'b1', label: 'B1' }] },
			],
		})

		await toggleOf(wrapper, 'A').trigger('click')
		await toggleOf(wrapper, 'B').trigger('click')

		expect(wrapper.emitted('subLevelChange')).toEqual([[true]])
	})

	it('émet sub-level-change à false quand la liste est démontée avec un sous-niveau ouvert', async () => {
		// Liste dans un menu refermé par le projet : sans cette émission, son état resterait à true
		const shown = ref(true)
		const subLevelOpen = ref(false)
		const Host = defineComponent(() => () => shown.value
			? h(SyNavList, { items, onSubLevelChange: (open: boolean) => { subLevelOpen.value = open } })
			: null)
		const wrapper = mount(Host, { attachTo: document.body })
		await wrapper.get('button[aria-label^="Droit de base :"]').trigger('click')
		expect(subLevelOpen.value).toBe(true)

		shown.value = false
		await flushPromises()

		expect(subLevelOpen.value).toBe(false)
	})

	it('referme le sous-niveau ouvert à droite quand le focus quitte son entrée', async () => {
		const wrapper = mountNavList()
		const parent = toggleOf(wrapper, 'Droit de base')
		await parent.trigger('click')

		await parent.trigger('focusout', { relatedTarget: wrapper.get('a[href="/ame"]').element })

		expect(parent.attributes('aria-expanded')).toBe('false')
	})

	it('garde l\'accordéon ouvert quand le focus quitte son entrée, sous 960 px', async () => {
		const width = window.innerWidth
		try {
			window.innerWidth = 800
			const wrapper = mountNavList()
			await flushPromises()
			const parent = toggleOf(wrapper, 'Droit de base')
			await parent.trigger('click')

			await parent.trigger('focusout', { relatedTarget: wrapper.get('a[href="/ame"]').element })

			expect(parent.attributes('aria-expanded')).toBe('true')
		}
		finally {
			window.innerWidth = width
		}
	})

	it('en accordéon, ne ferme le sous-niveau à Échap que si le focus est dans la navigation, sous 960 px', async () => {
		const width = window.innerWidth
		try {
			window.innerWidth = 800
			const wrapper = mountNavList()
			await flushPromises()
			const parent = toggleOf(wrapper, 'Droit de base')
			await parent.trigger('click')
			const outside = document.createElement('input')
			document.body.append(outside)

			// Focus dans un champ de la page : Échap lui revient
			outside.focus()
			pressEscapeOnDocument()
			await flushPromises()
			expect(parent.attributes('aria-expanded')).toBe('true')

			parent.element.focus()
			pressEscapeOnDocument()
			await flushPromises()
			expect(parent.attributes('aria-expanded')).toBe('false')
		}
		finally {
			window.innerWidth = width
		}
	})

	it('n\'ouvre pas le sous-niveau au survol en largeur réduite ni au toucher', async () => {
		const wrapper = mountNavList()
		const row = wrapper.findAll('.sy-nav-list-panel__row')[0]!

		vi.useFakeTimers()
		try {
			await row.trigger('pointerenter', { pointerType: 'touch' })
			vi.advanceTimersByTime(400)
			await flushPromises()

			expect(toggleOf(wrapper, 'Droit de base').attributes('aria-expanded')).toBe('false')

			const width = window.innerWidth
			try {
				window.innerWidth = 800
				await row.trigger('pointerenter', { pointerType: 'mouse' })
				vi.advanceTimersByTime(400)
				await flushPromises()
			}
			finally {
				window.innerWidth = width
			}

			expect(toggleOf(wrapper, 'Droit de base').attributes('aria-expanded')).toBe('false')
		}
		finally {
			vi.useRealTimers()
		}
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

	it.each([
		{ width: 360, expected: '360px' },
		{ width: '20rem', expected: '20rem' },
	])('transmet la largeur $width aux niveaux par la variable --sy-nav-list-width', ({ width, expected }) => {
		const wrapper = mountNavList({ width })

		expect((wrapper.get('nav').element as HTMLElement).style.getPropertyValue('--sy-nav-list-width')).toBe(expected)
	})

	it('ne pose pas la variable de largeur sans prop width : le projet peut la définir en CSS', () => {
		const wrapper = mountNavList()

		expect(wrapper.get('nav').attributes('style')).toBeUndefined()
	})

	it('pose aria-current="page" sur le lien href d\'une entrée active, et sur lui seul', () => {
		const wrapper = mountNavList({
			items: [
				{ id: 'a', label: 'A', href: '/a', children: [{ id: 'a1', label: 'A1', href: '/a1', active: true }] },
				{ id: 'b', label: 'B', href: '/b' },
			],
		})

		expect(wrapper.findAll('[aria-current="page"]').map(link => link.attributes('href'))).toEqual(['/a1'])
	})

	it('affiche les actions en permanence à tous les niveaux avec actionsVisibility always', () => {
		expect(mountNavList().findAll('.sy-nav-list-panel--actions-always')).toHaveLength(0)

		const wrapper = mountNavList({ actionsVisibility: 'always' })

		expect(wrapper.findAll('.sy-nav-list-panel--actions-always')).toHaveLength(wrapper.findAll('.sy-nav-list-panel').length)
	})

	it('retire l\'ombre du seul premier niveau avec flat', async () => {
		const wrapper = mountNavList({ flat: true })
		await flushPromises()
		const panels = wrapper.findAll('.sy-nav-list-panel')

		expect(panels[0]!.classes()).not.toContain('elevation-2')
		expect(panels.slice(1).every(panel => panel.classes().includes('elevation-2'))).toBe(true)
		expect(mountNavList().findAll('.sy-nav-list-panel')[0]!.classes()).toContain('elevation-2')
	})

	it('affiche les sous-niveaux sans ombre en accordéon, sous 960 px', async () => {
		const width = window.innerWidth
		try {
			window.innerWidth = 800
			const wrapper = mountNavList()
			await flushPromises()
			const panels = wrapper.findAll('.sy-nav-list-panel')

			expect(panels[0]!.classes()).toContain('elevation-2')
			expect(panels.slice(1).some(panel => panel.classes().includes('elevation-2'))).toBe(false)
		}
		finally {
			window.innerWidth = width
		}
	})

	it('garde l\'accordéon ouvert au toucher de la page et au clic sur un lien, sous 960 px', async () => {
		const width = window.innerWidth
		try {
			window.innerWidth = 800
			const wrapper = mountNavList()
			await flushPromises()
			const parent = toggleOf(wrapper, 'Droit de base')
			await parent.trigger('click')
			const link = wrapper.get<HTMLAnchorElement>('a[href="/demande-affiliation"]')
			link.element.addEventListener('click', event => event.preventDefault())

			document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
			await link.trigger('click')

			expect(parent.attributes('aria-expanded')).toBe('true')
		}
		finally {
			window.innerWidth = width
		}
	})

	it('affiche l\'intitulé des actions dans l\'infobulle native (title), comme les autres boutons icônes du DS', () => {
		const wrapper = mountNavList()

		expect(wrapper.get('button[aria-label="Modifier (AME)"]').attributes('title')).toBe('Modifier (AME)')
	})

	describe('entrée désactivée', () => {
		const disabledItems: SyNavListItem[] = [
			{ id: 'a', label: 'A', href: '/a', actions: [edit], disabled: true, children: [{ id: 'a1', label: 'A1', href: '/a1' }] },
			{ id: 'b', label: 'B', href: '/b', actions: [edit] },
		]

		it('est annoncée comme lien indisponible, hors de l\'ordre de tabulation', () => {
			const link = mountNavList({ items: disabledItems }).get('.sy-nav-list-panel__link--disabled')

			expect(link.element.tagName).toBe('A')
			expect(link.attributes('href')).toBeUndefined()
			expect(link.attributes('role')).toBe('link')
			expect(link.attributes('aria-disabled')).toBe('true')
		})

		it('n\'a pas d\'actions, et son chevron est désactivé', async () => {
			const wrapper = mountNavList({ items: disabledItems })
			const toggle = toggleOf(wrapper, 'A')

			expect(wrapper.find('button[aria-label="Modifier (A)"]').exists()).toBe(false)
			expect(wrapper.find('button[aria-label="Modifier (B)"]').exists()).toBe(true)
			expect(toggle.attributes('disabled')).toBeDefined()

			await toggle.trigger('click')

			expect(toggle.attributes('aria-expanded')).toBe('false')
		})

		it('n\'ouvre pas son sous-niveau au survol', async () => {
			vi.useFakeTimers()
			try {
				const wrapper = mountNavList({ items: disabledItems })
				await wrapper.findAll('.sy-nav-list-panel__row')[0]!.trigger('pointerenter', { pointerType: 'mouse' })
				vi.advanceTimersByTime(400)
				await flushPromises()

				expect(toggleOf(wrapper, 'A').attributes('aria-expanded')).toBe('false')
			}
			finally {
				vi.useRealTimers()
			}
		})
	})

	it('accepte une surcharge partielle des libellés', () => {
		const wrapper = mountNavList({
			locales: { openSubMenu: (label: string) => `Ouvrir ${label}` },
		})

		expect(wrapper.get('button[aria-controls]').attributes('aria-label')).toBe('Ouvrir Droit de base')
		expect(wrapper.get('nav').attributes('aria-label')).toBe('Navigation secondaire')
	})
})
