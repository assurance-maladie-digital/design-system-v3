import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RangeField from '../RangeField.vue'

// jsdom ne calcule pas `:focus-visible` : RangeField délègue le focus aux deux SyTextField
// (min/max, bordure primary) et aux deux thumbs du RangeSlider (`role="slider"`, qui portent
// le cadre de focus DS scopé). On vérifie ici les prérequis structurels ; le rendu du cadre
// est couvert par le test visuel Cypress.
describe('RangeField - Focus', () => {
	it('exposes the two slider thumbs as keyboard-focusable sliders', () => {
		const wrapper = mount(RangeField, {
			props: { min: 0, max: 100, modelValue: [20, 80] },
		})
		const thumbs = wrapper.findAll('[role="slider"]')

		expect(thumbs).toHaveLength(2)
		thumbs.forEach((thumb) => {
			expect(thumb.attributes('tabindex')).toBe('0')
		})
	})

	it('exposes focusable min and max number inputs (primary field border)', () => {
		const wrapper = mount(RangeField, {
			props: { min: 0, max: 100, modelValue: [20, 80] },
		})
		const inputs = wrapper.findAll('input')

		expect(inputs.length).toBeGreaterThanOrEqual(2)
		inputs.forEach((input) => {
			expect(input.attributes('tabindex')).not.toBe('-1')
		})
	})
})
