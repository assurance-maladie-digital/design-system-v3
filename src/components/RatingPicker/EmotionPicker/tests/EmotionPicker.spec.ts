import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import EmotionPicker from '../EmotionPicker.vue'

describe('EmotionPicker', () => {
	it('renders correctly', () => {
		const wrapper = mount(EmotionPicker, {
			props: {
				label: 'Pourriez-vous donner une note ?',
				itemLabels: ['Pas du tout', 'Peut-être', 'Oui super'],
			},
		})

		expect(wrapper.html()).toContain('Pourriez-vous donner une note ?')
		expect(wrapper.html()).toContain('Pas du tout')
		expect(wrapper.html()).toContain('Peut-être')
		expect(wrapper.html()).toContain('Oui super')
		expect(wrapper.html()).toMatchSnapshot()
	})

	it('renders correctly with only 2 items', () => {
		const wrapper = mount(EmotionPicker, {
			props: {
				label: 'Pourriez-vous donner une note ?',
				itemLabels: ['Pas du tout', 'Not used', 'Oui super'],
				length: 2,
			},
		})

		expect(wrapper.html()).toContain('Pourriez-vous donner une note ?')
		expect(wrapper.html()).toContain('Pas du tout')
		expect(wrapper.html()).toContain('Oui super')
		expect(wrapper.html()).not.toContain('Not used')
		expect(wrapper.html()).toMatchSnapshot()
	})

	it('renders in mobile mode', async () => {
		// @ts-expect-error  - Property 'happyDOM' does not exist on type 'Window & typeof globalThis'.
		window.happyDOM.setInnerWidth(600)

		const wrapper = mount(EmotionPicker, {
			props: {
				label: 'Pourriez-vous donner une note ?',
				itemLabels: ['Pas du tout', 'Peut-être', 'Oui super'],
			},
		})

		await wrapper.vm.$nextTick()

		expect(wrapper.html()).toContain('70px')
	})

	it('emit the right value when an item is clicked', async () => {
		const wrapper = mount(EmotionPicker)

		const items = wrapper.findAll('[role="radio"]')
		await items[0]?.trigger('click')
		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
		expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe(1)
	})

	it('have no labels when no labels are provided', () => {
		const wrapper = mount(EmotionPicker, {
			props: {
				itemLabels: [],
			},
		})

		wrapper.findAll('[role="radio"]').forEach((button) => {
			expect(button.text()).toBe('')
		})
	})

	it('change the style of the buttons when an item is clicked', async () => {
		const wrapper = mount(EmotionPicker)

		const items = wrapper.findAll('[role="radio"]')

		await wrapper.setProps({ modelValue: 1 })
		expect(items[0]?.classes()).toContain('sy-emotion-picker__item--active')
	})

	it('does not render the locking state when readonly', () => {
		const wrapper = mount(EmotionPicker, {
			props: {
				modelValue: 1,
				readonly: true,
			},
		})

		expect(wrapper.find('.locking-state').exists()).toBe(false)
		expect(wrapper.find('[role="radiogroup"]').attributes('aria-describedby')).toBeUndefined()
	})

	describe('when it do not lock the field after selection', () => {
		it('can change the value after selection', async () => {
			const wrapper = mount(EmotionPicker, {
				props: {
					lockAfterSelection: false,
				},
			})

			const items = wrapper.findAll('[role="radio"]')

			await items[0]?.trigger('click')
			expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe(1)

			await items[2]?.trigger('click')
			expect(wrapper.emitted('update:modelValue')?.[1]?.[0]).toBe(3)
		})

		it('can change the value after selection when the modelValue is updated', async () => {
			const wrapper = mount(EmotionPicker, {
				props: {
					lockAfterSelection: false,
				},
			})

			const items = wrapper.findAll('[role="radio"]')

			await items[0]?.trigger('click')
			expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe(1)

			await wrapper.setProps({ modelValue: 1 })
			await items[2]?.trigger('click')
			expect(wrapper.emitted('update:modelValue')?.[1]?.[0]).toBe(3)
		})

		it('can change the value after selection in two emotions mode', async () => {
			const wrapper = mount(EmotionPicker, {
				props: {
					lockAfterSelection: false,
					length: 2,
				},
			})

			const items = wrapper.findAll('[role="radio"]')

			await items[0]?.trigger('click')
			expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe(1)

			await items[1]?.trigger('click')
			expect(wrapper.emitted('update:modelValue')?.[1]?.[0]).toBe(2)
		})

		it('do not define the radio as disabled when the modelValue is updated', async () => {
			const wrapper = mount(EmotionPicker, {
				props: {
					lockAfterSelection: false,
				},
			})

			const items = wrapper.findAll('[role="radio"]')

			await items[0]?.trigger('click')
			expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe(1)

			await wrapper.setProps({ modelValue: 1 })
			expect(items[0]?.attributes('aria-checked')).toBe('true')
			expect(items[0]?.attributes('disabled')).toBeUndefined()
			expect(items[1]?.attributes('aria-checked')).toBe('false')
			expect(items[1]?.attributes('disabled')).toBeUndefined()
		})

		it('allows to update the selected value with the keyord navigation', async () => {
			const wrapper = mount(EmotionPicker, {
				props: {
					lockAfterSelection: false,
				},
			})

			const items = wrapper.findAll('[role="radio"]')

			await items[0]?.trigger('keydown', { key: 'ArrowRight' })
			await wrapper.vm.$nextTick()
			expect(items[0]?.attributes('tabindex')).toBe('-1')
			expect(items[1]?.attributes('tabindex')).toBe('0')

			await items[1]?.trigger('keydown', { key: 'Enter' })
			expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe(2)

			expect(items[0]?.attributes('aria-checked')).toBe('false')
			expect(items[1]?.attributes('aria-checked')).toBe('true')

			await items[1]?.trigger('keydown', { key: 'ArrowLeft' })
			await wrapper.vm.$nextTick()
			expect(items[0]?.attributes('tabindex')).toBe('0')
			expect(items[1]?.attributes('tabindex')).toBe('-1')

			await items[0]?.trigger('keydown', { key: ' ' })
			expect(wrapper.emitted('update:modelValue')?.[1]?.[0]).toBe(1)

			expect(items[0]?.attributes('aria-checked')).toBe('true')
			expect(items[1]?.attributes('aria-checked')).toBe('false')
		})
	})

	describe('locales', () => {
		it('utilise la locale `defaultEmotionLabels` quand `itemLabels` n\'est pas fourni', () => {
			const wrapper = mount(EmotionPicker, {
				props: {
					locales: { defaultEmotionLabels: ['AAA', 'BBB', 'CCC'] },
				},
			})

			const html = wrapper.html()
			expect(html).toContain('AAA')
			expect(html).toContain('CCC')
		})

		it('la prop `itemLabels` reste prioritaire sur la locale', () => {
			const wrapper = mount(EmotionPicker, {
				props: {
					itemLabels: ['P1', 'P2', 'P3'],
					locales: { defaultEmotionLabels: ['L1', 'L2', 'L3'] },
				},
			})

			const html = wrapper.html()
			expect(html).toContain('P3')
			expect(html).not.toContain('L3')
		})
	})
})
