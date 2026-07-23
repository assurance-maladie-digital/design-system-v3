import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SyRadioGroup from '../SyRadioGroup.vue'

const options = [
	{ label: 'Option A', value: 'A' },
	{ label: 'Option B', value: 'B' },
	{ label: 'Option C', value: 'C' },
]

// jsdom ne calcule pas `:focus-visible` : on vérifie ici les prérequis structurels du ring DS
// ajouté (`.v-selection-control--focus-visible`, 2px primary, offset 2px) — un vrai radio par
// option. Le rendu du ring est couvert par le test visuel Cypress.
describe('SyRadioGroup - Focus', () => {
	it('renders one native radio input per option', () => {
		const wrapper = mount(SyRadioGroup, {
			props: { options, label: 'Choix' },
		})
		const radios = wrapper.findAll('input[type="radio"]')

		expect(radios).toHaveLength(options.length)
	})

	it('exposes the options as radios reachable by keyboard (roving tabindex)', () => {
		const wrapper = mount(SyRadioGroup, {
			props: { options, label: 'Choix' },
		})
		const radios = wrapper.findAll('input[type="radio"]')

		// Un groupe radio natif : au moins un radio est dans l'ordre de tabulation
		// (les flèches naviguent entre eux) ; c'est lui qui reçoit le ring `:focus-visible`.
		const reachable = radios.filter(r => r.attributes('tabindex') !== '-1')
		expect(reachable.length).toBeGreaterThan(0)
	})
})
