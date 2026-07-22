import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CookiesInformation from '../CookiesInformation.vue'

const tableItems = [
	{ name: 'Matomo', description: 'Mesure d\'audience', conservation: '13 mois' },
]

// CookiesInformation expose deux cibles focusables non couvertes par les overrides globaux, donc
// dotées d'un ring DS scoped (couvert par le visuel) : le `<summary>` du bloc `<details>` (ni
// `button` ni `a`) et les `VRadio` bruts (`.v-selection-control--focus-visible`). On valide ici que
// ces cibles sont bien focusables.
describe('CookiesInformation - Focus', () => {
	it('renders a focusable details summary (target of the DS ring)', () => {
		const wrapper = mount(CookiesInformation, {
			props: { type: 'analytics', tableItems },
		})

		const summary = wrapper.find('details > summary')
		expect(summary.exists()).toBe(true)
		// Un <summary> est nativement focusable et ne doit pas être retiré du flux clavier.
		expect(summary.attributes('tabindex')).not.toBe('-1')
	})

	it('renders real focusable radio inputs', () => {
		const wrapper = mount(CookiesInformation, {
			props: { type: 'analytics', tableItems },
		})

		const radios = wrapper.findAll('input[type="radio"]')
		expect(radios.length).toBe(2)
		radios.forEach((radio) => {
			expect(radio.attributes('tabindex')).not.toBe('-1')
		})
	})

	it('renders no radio group for the essentials type', () => {
		const wrapper = mount(CookiesInformation, {
			props: { type: 'essentials', tableItems },
		})

		expect(wrapper.find('[data-test-id="radio-group"]').exists()).toBe(false)
		// Le <summary> reste présent et focusable pour tous les types.
		expect(wrapper.find('details > summary').exists()).toBe(true)
	})
})
