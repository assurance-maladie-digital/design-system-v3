import { mount, type VueWrapper } from '@vue/test-utils'
import { describe, it, expect, afterEach } from 'vitest'
import DatePicker from '../DatePicker.vue'

// Le ring de focus des boutons du calendrier (cellules de jour, mois/année, navigation,
// « Aujourd'hui ») vient du global `_btns.scss` : ce sont des `.v-btn`. On ne peut pas
// ouvrir le calendrier en jsdom (le VDatePicker fait un OOM) → la grille est validée par
// le test visuel Cypress. Ici on vérifie le prérequis fiable : l'input activateur est
// focusable (point d'entrée clavier).
describe('DatePicker (CalendarMode) - focus', () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let wrapper: VueWrapper<any> | null = null

	afterEach(() => {
		wrapper?.unmount()
		wrapper = null
	})

	it('renders a focusable activator input', () => {
		wrapper = mount(DatePicker, { props: { label: 'Date' }, attachTo: document.body })
		const input = wrapper.find('input')
		expect(input.exists()).toBe(true)
		input.element.focus()
		expect(document.activeElement).toBe(input.element)
	})
})
