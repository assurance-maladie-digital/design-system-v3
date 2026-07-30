import { resolve } from 'node:path'
import { compile } from 'sass'
import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import { VBtn, VTooltip } from 'vuetify/components'
import { createVuetifyInstance } from '@/vuetifyConfig'

describe('VTooltip – accessibilité', () => {
	describe('survol (RGAA 10.13.2)', () => {
		const TooltipHost = defineComponent({
			render() {
				return h(VTooltip, { text: 'Contenu du tooltip', location: 'top' }, {
					activator: ({ props }: { props: Record<string, unknown> }) =>
						h(VBtn, { ...props, class: 'test-activator' }, () => 'Hover me'),
				})
			},
		})

		// Vuetify téléporte le contenu de l'overlay dans `document.body` : sans nettoyage, une
		// infobulle laissée ouverte par un test en échec fausserait les suivants.
		let wrapper: ReturnType<typeof mount> | undefined

		afterEach(() => {
			wrapper?.unmount()
			wrapper = undefined
			document.body.innerHTML = ''
		})

		const mountHost = () => {
			wrapper = mount(TooltipHost, {
				global: { plugins: [createVuetifyInstance()] },
				attachTo: document.body,
			})

			return wrapper
		}

		const isOpen = () => Boolean(document.querySelector('.v-overlay--active'))

		it('exposes the accessible defaults on VTooltip', () => {
			const defaults = createVuetifyInstance().defaults.value.VTooltip

			expect(defaults?.interactive).toBe(true)
			expect(Number(defaults?.closeDelay)).toBeGreaterThan(0)
		})

		it('keeps the tooltip open when the pointer leaves the activator to reach it', async () => {
			const host = mountHost()

			await host.find('.test-activator').trigger('mouseenter')
			await nextTick()
			expect(isOpen(), 'le tooltip doit s’ouvrir au survol de l’activateur').toBe(true)

			// Sans `closeDelay`, cette fermeture était synchrone : le curseur n'avait pas le temps
			// d'atteindre l'infobulle.
			await host.find('.test-activator').trigger('mouseleave')
			await nextTick()
			expect(isOpen(), 'le tooltip doit rester ouvert le temps d’être atteint').toBe(true)
		})

		it('stays open while the tooltip content itself is hovered', async () => {
			const host = mountHost()

			await host.find('.test-activator').trigger('mouseenter')
			await nextTick()

			// `v-tooltip--interactive` est le seul point d'accroche du `pointer-events: none` que
			// Vuetify pose sur le contenu ; sans cette classe, l'infobulle est intraversable à la
			// souris (non vérifiable via le style calculé : happy-dom n'applique pas les feuilles CSS).
			expect(
				document.querySelector('.v-tooltip')?.classList.contains('v-tooltip--interactive'),
				'le contenu du tooltip doit recevoir les événements souris',
			).toBe(true)

			await host.find('.test-activator').trigger('mouseleave')
			await nextTick()

			const content = document.querySelector('.v-overlay__content')
			expect(content, 'le contenu du tooltip doit être présent').not.toBeNull()
			content?.dispatchEvent(new MouseEvent('mouseenter'))

			// Bien au-delà du `closeDelay` : le survol du contenu doit maintenir l'infobulle ouverte.
			await new Promise(resolve => setTimeout(resolve, 500))
			expect(isOpen(), 'le tooltip doit rester ouvert tant qu’il est survolé').toBe(true)
		})

		it('closes once the pointer leaves the tooltip content', async () => {
			const host = mountHost()

			await host.find('.test-activator').trigger('mouseenter')
			await nextTick()
			await host.find('.test-activator').trigger('mouseleave')
			await nextTick()

			const content = document.querySelector('.v-overlay__content')
			content?.dispatchEvent(new MouseEvent('mouseenter'))
			await nextTick()
			content?.dispatchEvent(new MouseEvent('mouseleave'))

			await new Promise(resolve => setTimeout(resolve, 500))
			expect(isOpen(), 'le tooltip doit se refermer une fois quitté').toBe(false)
		})
	})

	describe('racine masquée quand l’infobulle est fermée (aria-tooltip-name)', () => {
		// Vitest s'exécute depuis la racine du projet.
		const css = compile(
			resolve(process.cwd(), 'src/assets/overrides/_tooltips.scss'),
			{ style: 'compressed' },
		).css

		it('hides the inactive tooltip root from the accessibility tree', () => {
			expect(css).toMatch(/\.v-tooltip\[role=["']?tooltip["']?\]:not\(\.v-overlay--active\)\{display:none\}/)
		})

		it('leaves the open tooltip and its content untouched', () => {
			// La règle ne doit cibler que la racine inactive : ni l'infobulle ouverte (son nom accessible
			// vient du texte affiché), ni le contenu (dont Vuetify gère affichage et transitions).
			expect(css).not.toMatch(/\.v-tooltip\[role=["']?tooltip["']?\][^{]*\.v-overlay__content/)
			expect(css).not.toMatch(/display:block\s*!important/)
		})
	})
})
