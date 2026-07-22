import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RatingPicker from '../RatingPicker.vue'

const itemClass: Record<string, string> = {
	stars: '.sy-stars-picker__item',
	number: '.sy-number-picker__item',
	emotion: '.sy-emotion-picker__item',
}

// Les 3 pickers implémentent un pattern radio-group à roving tabindex : chaque option est un
// `role="radio"`, un seul est dans l'ordre de tabulation (`tabindex=0`), les autres `-1`, et la
// navigation se fait aux flèches. Le ring DS est porté par la CSS scoped de chaque picker (inset
// box-shadow pour les étoiles, outline primary pour nombres/émotions), couvert par le visuel. On
// valide ici le contrat de focusabilité.
describe('RatingPicker - Focus', () => {
	it.each(['stars', 'number', 'emotion'])(
		'exposes %s options as a roving-tabindex radio group',
		(type) => {
			const wrapper = mount(RatingPicker, { props: { type } })
			const items = wrapper.findAll(itemClass[type]!)

			expect(items.length).toBeGreaterThan(0)
			items.forEach((item) => {
				expect(item.attributes('role')).toBe('radio')
			})

			// Un seul élément focusable au clavier (tabindex=0), les autres retirés du flux (-1).
			const tabbable = items.filter(i => i.attributes('tabindex') === '0')
			const removed = items.filter(i => i.attributes('tabindex') === '-1')
			expect(tabbable.length).toBe(1)
			expect(removed.length).toBe(items.length - 1)
		},
	)
})
