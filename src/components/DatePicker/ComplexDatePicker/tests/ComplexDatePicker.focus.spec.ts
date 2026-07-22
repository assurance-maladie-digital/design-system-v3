import { mount, type VueWrapper } from '@vue/test-utils'
import { describe, it, expect, afterEach } from 'vitest'
import ComplexDatePicker from '../ComplexDatePicker.vue'

// Comme CalendarMode : les boutons du calendrier sont des `.v-btn` → ring via le global
// `_btns.scss`. On ne peut pas ouvrir le calendrier en jsdom (OOM du VDatePicker) → la
// grille est validée par le test visuel Cypress. Ici on vérifie le prérequis fiable :
// l'input est focusable.
describe('ComplexDatePicker - focus', () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let wrapper: VueWrapper<any> | null = null

	afterEach(() => {
		wrapper?.unmount()
		wrapper = null
	})

	it('renders a focusable input', () => {
		wrapper = mount(ComplexDatePicker, { props: { label: 'Date' }, attachTo: document.body })
		const input = wrapper.find('input')
		expect(input.exists()).toBe(true)
		input.element.focus()
		expect(document.activeElement).toBe(input.element)
	})
})
