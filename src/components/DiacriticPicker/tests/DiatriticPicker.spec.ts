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
				default: `<input id="diacritique-input" type="text" value="a" />`,
			},
			global: {
				plugins: [vuetify],
			},
		})
		await nextTick()
	})

	it('renders the diacritic button', () => {
		const btn = wrapper.find('.diacritic-btn')
		expect(btn.exists()).toBe(true)
	})

	it('initially hides the dialog', () => {
		const dialog = wrapper.find('.diacritic-dialog')
		expect(dialog.exists()).toBe(false)
	})

	it('shows dialog when button is clicked', async () => {
		await wrapper.find('.diacritic-btn').trigger('click')
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
							id: 'diacritique-input',
							value: model.value,
						})
					},
				}),
			},
		})

		await wrapper.find('.diacritic-btn').trigger('click')
		await nextTick()

		const buttons = wrapper.findAllComponents({ name: 'VBtn' })
		const button = buttons.find(btn => btn.text() === 'á')
		expect(button).toBeTruthy()

		await button!.trigger('click')
		await nextTick()

		expect(wrapper.emitted('update:modelValue')?.[0][0]).toBe('aá')
	})

	it('sets correct ARIA attributes', () => {
		const btn = wrapper.find('.diacritic-btn')
		expect(btn.attributes('aria-haspopup')).toBe('dialog')
		expect(btn.attributes('aria-expanded')).toBe('false')
		expect(btn.attributes('aria-controls')).toBe('diacritique-dialog')
	})

	it('closes dialog on click:outside', async () => {
		await wrapper.find('.diacritic-btn').trigger('click')
		await nextTick()

		const card = wrapper.findComponent({ name: 'VCard' })
		await card.trigger('click:outside')
		await nextTick()

		expect(wrapper.findComponent({ name: 'VDialog' }).vm.$props.modelValue).toBe(false)
	})
})
