import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FileUpload from '../FileUpload.vue'

// jsdom ne calcule pas `:focus-visible` ni l'`outline` : on vérifie ici les prérequis
// structurels du ring DS scopé (la dropzone est un `role="button"` atteignable au clavier),
// le rendu du ring étant couvert par le test visuel Cypress.
describe('FileUpload - Focus', () => {
	it('exposes the dropzone as a keyboard-focusable button', () => {
		const wrapper = mount(FileUpload, {
			props: { modelValue: [] },
		})
		const dropzone = wrapper.find('.sy-file-upload')

		expect(dropzone.exists()).toBe(true)
		expect(dropzone.attributes('role')).toBe('button')
		// tabindex 0 => atteignable au clavier, donc éligible au ring DS scopé.
		expect(dropzone.attributes('tabindex')).toBe('0')
	})

	it('removes the dropzone from the tab order when disabled', () => {
		const wrapper = mount(FileUpload, {
			props: { modelValue: [], disabled: true },
		})
		const dropzone = wrapper.find('.sy-file-upload')

		expect(dropzone.attributes('tabindex')).toBe('-1')
	})

	it('keeps the native file input out of the tab order (triggered programmatically)', () => {
		const wrapper = mount(FileUpload, {
			props: { modelValue: [] },
		})
		const input = wrapper.find('input.sy-file-upload-input')

		expect(input.exists()).toBe(true)
		// Input visuellement masqué et piloté au clic/clavier via la dropzone => hors Tab.
		expect(input.attributes('tabindex')).toBe('-1')
	})
})
