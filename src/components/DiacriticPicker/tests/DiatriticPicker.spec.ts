import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { vuetify } from '@tests/unit/setup'
import { ref, nextTick, defineComponent, h } from 'vue'
import DiacriticPicker from '../DiacriticPicker.vue'

const defaultProps = {
	modelValue: '',
	diacritics: ['á', 'à', 'â', 'ä'],
}

describe('DiacriticPicker.vue', () => {
	let wrapper: ReturnType<typeof mount>

	beforeEach(async () => {
		// Mount component with a slot containing an input
		wrapper = mount(DiacriticPicker, {
			props: defaultProps,
			slots: {
				default: `<input id="diacritic-input-${Math.random().toString(36).substr(2, 9)}" type="text" value="a" />`,
			},
			global: {
				plugins: [vuetify],
			},
		})
		await nextTick()
	})

	it('renders the diacritic button', () => {
		const btn = wrapper.find('.sy-diacritic-btn')
		expect(btn.exists()).toBe(true)
	})

	it('initially hides the dialog', () => {
		const dialog = wrapper.find('.sy-diacritic-dialog')
		expect(dialog.exists()).toBe(false)
	})

	it('shows dialog when button is clicked', async () => {
		await wrapper.find('.sy-diacritic-btn').trigger('click')
		await nextTick()

		expect(wrapper.findComponent({ name: 'VDialog' }).vm.$props.modelValue).toBe(true)
	})

	it('inserts selected character into the input', async () => {
		const model = ref('a')

		const wrapper = mount(DiacriticPicker, {
			global: { plugins: [vuetify] },
			props: {
				modelValue: model.value,
				onUpdateModelValue: (val: string) => {
					model.value = val
				},
				diacritics: ['á', 'à', 'â', 'ä'],
			},
			slots: {
				default: defineComponent({
					setup() {
						return () => h('input', {
							id: 'sy-diacritic-input',
							value: model.value,
						})
					},
				}),
			},
		})

		await wrapper.find('.sy-diacritic-btn').trigger('click')
		await nextTick()

		const buttons = wrapper.findAllComponents({ name: 'VBtn' })
		const button = buttons.find(btn => btn.text() === 'á')
		expect(button).toBeTruthy()

		await button!.trigger('click')
		await nextTick()

		expect(wrapper.emitted('update:modelValue')?.[0][0]).toBe('aá')
	})

	it('sets correct ARIA attributes', () => {
		const btn = wrapper.find('.sy-diacritic-btn')
		expect(btn.attributes('aria-haspopup')).toBe('dialog')
		expect(btn.attributes('aria-expanded')).toBe('false')
		expect(btn.attributes('aria-controls')).toContain('diacritic-dialog')
	})

	it('closes dialog on click:outside', async () => {
		await wrapper.find('.sy-diacritic-btn').trigger('click')
		await nextTick()

		const card = wrapper.findComponent({ name: 'VCard' })
		await card.trigger('click:outside')
		await nextTick()

		expect(wrapper.findComponent({ name: 'VDialog' }).vm.$props.modelValue).toBe(false)
	})

	it('selects next diacritic on keydown', async () => {
		const model1 = ref('a')

		const wrapper = mount(DiacriticPicker, {
			global: { plugins: [vuetify] },
			props: {
				modelValue: model1.value,
				onUpdateModelValue: (val: string) => {
					model1.value = val
				},
				diacritics: ['á', 'à', 'â', 'ä'],
			},
			slots: {
				default: defineComponent({
					setup() {
						return () => h('input', {
							id: 'sy-diacritic-input',
							value: model1.value,
						})
					},
				}),
			},
		})

		const input = wrapper.find('#sy-diacritic-input')
		await input.trigger('keydown', { key: '=' })
		await nextTick()

		expect(wrapper.emitted('update:modelValue')?.[0][0]).toBe('á')
	})
})
