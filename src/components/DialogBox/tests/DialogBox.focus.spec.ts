import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import DialogBox from '../DialogBox.vue'

const baseProps = {
	'modelValue': true,
	'title': 'Titre',
	'onUpdate:modelValue': () => {},
}

// Le contenu de VDialog est téléporté dans le <body> : on interroge donc `document.body`. Le rendu
// des rings est couvert par le visuel ; on valide ici le contrat de focus au niveau du DOM.
describe('DialogBox - Focus', () => {
	afterEach(() => {
		document.body.innerHTML = ''
	})

	it('renders real focusable action buttons (covered by the global ring)', () => {
		const wrapper = mount(DialogBox, {
			props: baseProps,
			slots: { default: () => h('p', 'Contenu') },
			attachTo: document.body,
		})

		const confirm = document.body.querySelector('[data-test-id="confirm-btn"]')
		expect(confirm).not.toBeNull()
		expect(confirm!.tagName).toBe('BUTTON')

		wrapper.unmount()
	})

	it('makes the scrollable content region a focusable region (target of the DS ring)', () => {
		const wrapper = mount(DialogBox, {
			props: { ...baseProps, scrollable: true },
			slots: { default: () => h('p', 'Contenu') },
			attachTo: document.body,
		})

		const region = document.body.querySelector('.sy-dialog-box-content--scrollable')
		expect(region).not.toBeNull()
		expect(region!.getAttribute('tabindex')).toBe('0')
		expect(region!.getAttribute('role')).toBe('region')

		wrapper.unmount()
	})

	it('does not make the content region focusable when not scrollable', () => {
		const wrapper = mount(DialogBox, {
			props: baseProps,
			slots: { default: () => h('p', 'Contenu') },
			attachTo: document.body,
		})

		const region = document.body.querySelector('.sy-dialog-box-content--scrollable')
		expect(region).toBeNull()

		wrapper.unmount()
	})

	it('flags the autofocus confirm button (target of the :focus ring on open)', () => {
		const wrapper = mount(DialogBox, {
			props: { ...baseProps, autofocusValidateBtn: true },
			slots: { default: () => h('p', 'Contenu') },
			attachTo: document.body,
		})

		const confirm = document.body.querySelector('[data-test-id="confirm-btn"]')
		expect(confirm).not.toBeNull()
		expect(confirm!.classList.contains('sy-dialog-box-confirm-btn--autofocus')).toBe(true)

		wrapper.unmount()
	})
})
