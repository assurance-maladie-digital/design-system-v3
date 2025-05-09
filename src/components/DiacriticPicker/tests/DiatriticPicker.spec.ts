import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { vuetify } from '@tests/unit/setup'
import DiacriticPicker from '../DiacriticPicker.vue'

const defaultProps = {
	modelValue: 'a',
	diacritics: ['á', 'à', 'â', 'ä'],
}

describe('DiatriticPicker', () => {
	describe('rendering correctly', () => {
		it('renders correctly with elements', () => {
			const wrapper = mount(DiacriticPicker, {
				props: defaultProps,
				global: {
					plugins: [vuetify],
				},
			})

			const btn = wrapper.find('.diacritic-btn')
			expect(btn.exists()).toBe(true)

			const dialog = wrapper.find('.diacritic-dialog')
			expect(dialog.exists()).toBe(false)
		})
	})
})
