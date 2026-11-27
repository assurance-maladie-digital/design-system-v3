// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RatingPicker from '../RatingPicker.vue'
import { RatingEnum } from '../Rating'

export const ratingPickerRgaaCriteria = ['1.2', '3.3', '7.1', '7.3', '7.5', '8.2', '10.7', '10.8'] as const

describe('RatingPicker – executable RGAA contracts', () => {
	it('keeps the rating question available to the picker implementation', () => {
		const wrapper = mount(RatingPicker, { props: { type: RatingEnum.EMOTION, label: 'Votre satisfaction ?', itemLabels: ['Non', 'Oui'], modelValue: -1 }, global: { stubs: { EmotionPicker: { template: '<fieldset><legend>{{ label }}</legend></fieldset>', props: ['label'] }, StarsPicker: true, NumberPicker: true, SyAlert: true } } })
		expect(wrapper.text()).toContain('Votre satisfaction')
	})
})
