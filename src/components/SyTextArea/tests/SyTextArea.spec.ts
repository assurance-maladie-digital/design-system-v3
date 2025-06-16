import { it, describe, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SyTextArea from '../SyTextArea.vue'
import { vuetify } from '@tests/unit/setup'

describe('SyTextArea', () => {
	it('renders correctly', () => {
		const wrapper = mount(SyTextArea, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: '',
				label: 'Description des symptomes',
			},
		})
		expect(wrapper.exists()).toBe(true)
		expect(wrapper.text()).toContain('Description des symptomes')
	})

	it('remove the white spaces at the beginning of the text as we try to add them', async () => {
		const wrapper = mount(SyTextArea, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: '',
				trim: true,
				label: 'Description des symptomes',
			},
		})
		const textarea = wrapper.find('textarea')
		await textarea.setValue('    \n\ta')

		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['a'])
		expect(textarea.element.value).toBe('a')
	})

	it('does not remove the white spaces at the middle of the text', async () => {
		const wrapper = mount(SyTextArea, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: '',
				trim: true,
				label: 'Description des symptomes',
			},
		})
		const textarea = wrapper.find('textarea')
		await textarea.setValue('a\n\t b\n\t ')

		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['a\n\t b\n\t '])
		expect(textarea.element.value).toBe('a\n\t b\n\t ')
	})

	it('removes the white spaces at the end of the text at blur', async () => {
		const wrapper = mount(SyTextArea, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: '',
				trim: true,
				label: 'Description des symptomes',
			},
		})
		const textarea = wrapper.find('textarea')
		await textarea.trigger('focus')
		await textarea.setValue('a\n\t b\n\t ')
		await textarea.trigger('blur')

		expect(wrapper.emitted('update:modelValue')?.[1]).toEqual(['a\n\t b'])
		expect(textarea.element.value).toBe('a\n\t b')
	})

	it('removes the tabs with the number of spaces defined in the prop', async () => {
		const wrapper = mount(SyTextArea, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: '',
				replaceTabs: 2,
				label: 'Description des symptomes',
			},
		})
		const textarea = wrapper.find('textarea')
		await textarea.setValue('\tcontent\t\tcontent \t')

		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['  content    content   '])
		expect(textarea.element.value).toBe('  content    content   ')
	})

	it('show an error message when the text is too long', async () => {
		const wrapper = mount(SyTextArea, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: '',
				maxLines: 5,
				label: 'Description des symptomes',
			},
		})
		const textarea = wrapper.find('textarea')
		await textarea.setValue('content\ncontent\ncontent\ncontent\ncontent\ncontent')
		expect(wrapper.text()).toContain('Ce champ ne peut pas dépasser 5 lignes')

		await textarea.setValue('content\ncontent\ncontent\ncontent\ncontent')
		expect(wrapper.text()).not.toContain('Ce champ ne peut pas dépasser 5 lignes')
	})

	it('adds a line break when a line is too long', async () => {
		const wrapper = mount(SyTextArea, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: '',
				autoWrap: 50,
				label: 'Description des symptomes',
			},
		})
		const textarea = wrapper.find('textarea')
		await textarea.trigger('focus')
		await textarea.setValue('voici un text probablement trop long pour ce champ fdgssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss top')
		await textarea.trigger('blur')

		const expectedValue = 'voici un text probablement trop long pour ce champ\nfdgssssssssssssssssssssssssssssssssssssssssssssss-\nsssssssssssssssssssssssssssssssssssssssssssssssss-\nsssssss top'

		expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([expectedValue])
		expect(textarea.element.value).toBe(expectedValue)
	})

	it('adds a line break when a line is too long 2', async () => {
		const wrapper = mount(SyTextArea, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: '',
				autoWrap: 50,
				label: 'Description des symptomes',
			},
		})
		const textarea = wrapper.find('textarea')
		await textarea.trigger('focus')
		await textarea.setValue('Bonjour,\nceci est une lettre\nIl contemple l’horizon avec une sérénité inébranlablement\ncalme, comme un sage qui a vu le monde et ses\ntroubles, mais qui sait que la paix intérieure est\nla seule véritable richesse.')
		await textarea.trigger('blur')

		const expectedValue = 'Bonjour,\nceci est une lettre\nIl contemple l’horizon avec une sérénité\ninébranlablement\ncalme, comme un sage qui a vu le monde et ses\ntroubles, mais qui sait que la paix intérieure est\nla seule véritable richesse.'

		expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([expectedValue])
		expect(textarea.element.value).toBe(expectedValue)
	})

	it('normalizes the text to NFC', async () => {
		const wrapper = mount(SyTextArea, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: '',
				normalize: true,
				label: 'Description des symptomes',
			},
		})
		const textarea = wrapper.find('textarea')
		await textarea.setValue('\u006E\u0303')

		const result = wrapper.emitted('update:modelValue')?.[0]?.[0]
		expect(result).toBe('\u00F1')
	})

	it('updates the text when the modelValue prop changes', async () => {
		const wrapper = mount(SyTextArea, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: '',
				replaceTabs: 2,
				trim: true,
				label: 'Description des symptomes',
			},
		})
		const textarea = wrapper.find('textarea')
		await wrapper.setProps({ modelValue: 'new	value\n' })

		expect(textarea.element.value).toBe('new  value')
	})
})
