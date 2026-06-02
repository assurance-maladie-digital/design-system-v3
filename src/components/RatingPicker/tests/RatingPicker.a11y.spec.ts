// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'

import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import RatingPicker from '../RatingPicker.vue'
import { RatingEnum } from '../Rating'

describe('RatingPicker – accessibility (axe)', () => {
	it('has no obvious axe violations with emotion picker and fieldset label', async () => {
		const wrapper = mount(RatingPicker, {
			props: {
				type: RatingEnum.EMOTION,
				label: 'Êtes-vous satisfait de votre expérience ?',
				itemLabels: ['Pas satisfait', 'Moyen', 'Satisfait'],
				modelValue: -1,
			},
			global: {
				stubs: {
					EmotionPicker: {
						template: `
							<fieldset>
								<legend><slot name="label" /></legend>
								<input id="e1" type="radio" name="emotion" />
								<label for="e1">Option</label>
							</fieldset>
						`,
					},
					StarsPicker: true,
					NumberPicker: true,
					SyAlert: {
						template: `<div role="status"><slot /></div>`,
					},
				},
			},
			attachTo: document.body,
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'RatingPicker – emotion picker with label', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})

	it('has no obvious axe violations when free text is displayed for a low stars rating', async () => {
		const wrapper = mount(RatingPicker, {
			props: {
				type: RatingEnum.STARS,
				label: 'Comment évaluez-vous votre expérience ?',
				modelValue: 2,
				enableFreeText: true,
				freeTextLabel: 'Pouvez-vous nous en dire plus ?',
				freeTextValue: 'Le parcours était peu clair.',
			},
			global: {
				stubs: {
					EmotionPicker: true,
					StarsPicker: {
						template: `
							<fieldset>
								<legend><slot name="label" /></legend>
								<input id="s1" type="radio" name="stars" />
								<label for="s1">1 étoile</label>
							</fieldset>
						`,
					},
					NumberPicker: true,
					SyAlert: {
						template: `<div role="status"><slot /></div>`,
					},
				},
			},
			attachTo: document.body,
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'RatingPicker – stars picker with free text', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})

	it('has no obvious axe violations with number picker', async () => {
		const wrapper = mount(RatingPicker, {
			props: {
				type: RatingEnum.NUMBER,
				label: 'Notez votre expérience de 1 à 10',
				modelValue: 5,
			},
			global: {
				stubs: {
					EmotionPicker: true,
					StarsPicker: true,
					NumberPicker: {
						template: `
						<fieldset>
							<legend><slot name="label" /></legend>
							<input id="n1" type="radio" name="number" />
							<label for="n1">1</label>
						</fieldset>
					`,
					},
					SyAlert: {
						template: `<div role="status"><slot /></div>`,
					},
				},
			},
			attachTo: document.body,
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'RatingPicker – number picker', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})
})
