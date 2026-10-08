import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import HeaderToolbar from '../HeaderToolbar.vue'

const vuetify = createVuetify({ components, directives })

const mountToolbar = (props: Record<string, unknown> = {}) =>
	mount(HeaderToolbar, {
		props,
		global: { plugins: [vuetify] },
		attachTo: document.body,
	})

/** `openMenuWithKeyboard` déclenche un `setTimeout(30)` interne. */
const flush = (ms = 60) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * On restreint l'analyse aux règles ARIA : le contraste et les landmarks
 * dépendent du contexte applicatif (`VApp`), absent en test unitaire.
 */
const runAriaRules = () =>
	axe(document.body, {
		runOnly: {
			type: 'rule',
			values: [
				'aria-allowed-attr',
				'aria-valid-attr',
				'aria-valid-attr-value',
				'aria-required-attr',
				'aria-allowed-role',
				'button-name',
				'link-name',
			],
		},
	})

const expectNoViolations = (results: Awaited<ReturnType<typeof axe>>, context: string) => {
	const violations = results.violations ?? []
	const summary = violations
		.map(v => `${v.id} (${v.impact}) – ${v.help} [${v.nodes.map(n => n.target.join(',')).join(' | ')}]`)
		.join('\n')
	expect(violations, `[a11y][${context}]\n${summary}`).toHaveLength(0)
}

/** Activateur du menu déroulant gauche (2e item : « Professionnel de santé »). */
const findActivator = () =>
	document.querySelector('#left-menu li:nth-child(2) > button, #left-menu li:nth-child(2) > a') as HTMLElement | null

afterEach(() => {
	document.body.innerHTML = ''
})

describe('HeaderToolbar – accessibility', () => {
	it('should have no ARIA violations in default state', async () => {
		mountToolbar()

		expectNoViolations(await runAriaRules(), 'default state')
	})

	it('should render the dropdown activator as a button, not a link without href', () => {
		mountToolbar()

		const activator = findActivator()

		expect(activator).not.toBeNull()
		expect(activator?.tagName).toBe('BUTTON')
		// Un <a> sans href n'expose pas le rôle `link` et n'autorise aucun attribut ARIA
		expect(document.querySelector('#left-menu a:not([href])')).toBeNull()
	})

	it('should expose a valid button pattern on the activator', () => {
		mountToolbar()

		const activator = findActivator()

		expect(activator?.getAttribute('type')).toBe('button')
		expect(activator?.getAttribute('aria-haspopup')).toBe('menu')
		expect(activator?.getAttribute('aria-expanded')).toBe('false')
		expect(activator?.getAttribute('aria-label')).toBe('Professionnel de santé')
	})

	it('should keep an accessible name on the activator', () => {
		mountToolbar()

		const activator = findActivator()
		const name = activator?.getAttribute('aria-label') ?? activator?.textContent

		expect(name?.trim()).toBe('Professionnel de santé')
	})

	it('should reference an existing element through aria-controls when opened', async () => {
		const wrapper = mountToolbar()

		await wrapper.vm.openMenuWithKeyboard()
		await flush()

		const activator = findActivator()
		const controls = activator?.getAttribute('aria-controls') ?? activator?.getAttribute('aria-owns')

		expect(activator?.getAttribute('aria-expanded')).toBe('true')
		// L'id est généré par VMenu : on vérifie qu'il résout bien vers un nœud du DOM
		expect(controls).toBeTruthy()
		expect(document.getElementById(controls as string)).not.toBeNull()
	})

	it('should have no ARIA violations when the dropdown is open', async () => {
		const wrapper = mountToolbar()

		await wrapper.vm.openMenuWithKeyboard()
		await flush()

		expectNoViolations(await runAriaRules(), 'open dropdown')
	}, 15000)

	it('should apply the menu pattern on the dropdown list', async () => {
		const wrapper = mountToolbar()

		await wrapper.vm.openMenuWithKeyboard()
		await flush()

		const menu = document.getElementById('left-dropdown-menu')
		const items = menu?.querySelectorAll('[role="menuitem"]')

		expect(menu?.getAttribute('role')).toBe('menu')
		expect(items?.length).toBeGreaterThan(0)
		items?.forEach(item => expect(item.id).toMatch(/^menu-item-\d+$/))
	})

	it('should expose labelled navigation landmarks', () => {
		const wrapper = mountToolbar()

		expect(wrapper.find('#left-menu').attributes('aria-label')).toBe('Choix du public')
		expect(wrapper.find('#right-menu').attributes('aria-label')).toBe('Menu institutionnel')
	})

	it('should support custom landmark labels', async () => {
		const wrapper = mountToolbar({
			ariaLeftLabel: 'Navigation principale',
			ariaRightLabel: 'Liens institutionnels',
		})

		expect(wrapper.find('#left-menu').attributes('aria-label')).toBe('Navigation principale')
		expect(wrapper.find('#right-menu').attributes('aria-label')).toBe('Liens institutionnels')
		expectNoViolations(await runAriaRules(), 'custom labels')
	})

	it('should mark the current page with aria-current', async () => {
		const wrapper = mountToolbar({ currentPageIndex: 0 })

		const links = wrapper.findAll('#left-menu li > a')

		expect(links[0]?.attributes('aria-current')).toBe('page')
		expectNoViolations(await runAriaRules(), 'current page')
	})

	it('should secure links opening in a new tab', () => {
		const wrapper = mountToolbar()

		const externalLinks = wrapper.findAll('a[target="_blank"]')

		expect(externalLinks.length).toBeGreaterThan(0)
		externalLinks.forEach(link => expect(link.attributes('rel')).toBe('noopener noreferrer'))
	})

	it('should announce dropdown items opening in a new window', () => {
		mountToolbar({
			itemsSelectMenu: [
				{ text: 'Médecin', value: 'medecin', href: 'https://example.com/medecin', openInNewTab: true },
				{ text: 'Infirmier', value: 'infirmier', href: 'https://example.com/infirmier' },
			],
		})

		const items = document.querySelectorAll('#left-dropdown-menu [role="menuitem"]')

		expect(items[0]?.querySelector('.d-sr-only')?.textContent?.trim()).toBe('(nouvelle fenêtre)')
		expect(items[1]?.querySelector('.d-sr-only')).toBeNull()
	})

	it('should label the overlay close button', async () => {
		const wrapper = mountToolbar()

		wrapper.vm.showOverlay = true
		await wrapper.vm.$nextTick()

		const overlay = wrapper.find('button.overlay')

		expect(overlay.exists()).toBe(true)
		expect(overlay.attributes('aria-label')).toBeTruthy()
		expectNoViolations(await runAriaRules(), 'overlay visible')
	})

	it('should close the menu on Escape', async () => {
		const wrapper = mountToolbar()

		await wrapper.vm.openMenuWithKeyboard()
		await flush()

		document.getElementById('left-dropdown-menu')
			?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
		await wrapper.vm.$nextTick()

		expect(wrapper.vm.showOverlay).toBe(false)
	})

	it('should hide decorative icons from assistive technologies', () => {
		mountToolbar()

		document.querySelectorAll('.toolbar svg').forEach((icon) => {
			const hidden = icon.getAttribute('aria-hidden') === 'true'
				|| icon.closest('[aria-hidden="true"]') !== null
			expect(hidden).toBe(true)
		})
	})
})
