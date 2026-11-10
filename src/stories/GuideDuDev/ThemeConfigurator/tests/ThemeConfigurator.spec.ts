import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import ThemeConfigurator from '../ThemeConfigurator.vue'

const getConfigJson = (wrapper: ReturnType<typeof mount>) => JSON.parse(wrapper.findAll('pre code')[0]!.text())

const getInput = (wrapper: ReturnType<typeof mount>, label: string) => {
	const field = wrapper.findAll('.v-input').find(input => input.find('label').text().includes(label))
	return field!.get('input')
}

describe('ThemeConfigurator', () => {
	it('starts with an empty, valid configuration', async () => {
		const wrapper = mount(ThemeConfigurator)
		await flushPromises()

		expect(getConfigJson(wrapper)).toEqual({})
		expect(wrapper.text()).toContain('Configuration valide.')
	})

	it('generates only the changed settings', async () => {
		const wrapper = mount(ThemeConfigurator)
		await getInput(wrapper, 'Épaisseur').setValue('3')
		await flushPromises()

		expect(getConfigJson(wrapper)).toEqual({ focus: { width: 3 } })
		expect(wrapper.text()).toContain('Configuration valide.')
	})

	it('reports a rejected setting and previews its default value', async () => {
		const wrapper = mount(ThemeConfigurator)
		await getInput(wrapper, 'Épaisseur').setValue('1')
		await flushPromises()

		expect(wrapper.text()).toContain('Réglage refusé, valeur par défaut appliquée')
		expect(wrapper.text()).toContain('focus.width')
		expect(wrapper.get('.theme-configurator__preview > *').attributes('style')).toContain('--v-focus-width: 2px')
	})

	it('applies the fields settings to the preview only when they are customized', async () => {
		const wrapper = mount(ThemeConfigurator)
		await flushPromises()
		const previewVariants = () => wrapper.get('.theme-configurator__preview').findAll('.v-field')
			.map(field => field.classes().find(name => name.startsWith('v-field--variant-')))

		expect(new Set(previewVariants())).toEqual(new Set(['v-field--variant-outlined']))

		await wrapper.findAll('input[type="checkbox"]')[0]!.setValue(true)
		await wrapper.findAll('input[type="radio"][value="filled"]')[0]!.setValue(true)
		await flushPromises()

		expect(getConfigJson(wrapper)).toEqual({ fields: { variant: 'filled', density: 'default' } })
		expect(new Set(previewVariants())).toEqual(new Set(['v-field--variant-filled']))
	})
})
