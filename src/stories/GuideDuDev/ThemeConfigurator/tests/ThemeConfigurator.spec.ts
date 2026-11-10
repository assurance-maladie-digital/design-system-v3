import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import ThemeConfigurator from '../ThemeConfigurator.vue'

const getConfigFile = (wrapper: ReturnType<typeof mount>) => wrapper.findAll('pre code')[0]!.text()

const configFile = (config: string) => `import type { SynapseThemeConfigInput } from '@cnamts/synapse/vuetifyOptions'

export default ${config} satisfies SynapseThemeConfigInput`

const getInput = (wrapper: ReturnType<typeof mount>, label: string) => {
	const field = wrapper.findAll('.v-input').find(input => input.find('label').text().includes(label))
	return field!.get('input')
}

describe('ThemeConfigurator', () => {
	it('starts with an empty, valid configuration', async () => {
		const wrapper = mount(ThemeConfigurator)
		await flushPromises()

		expect(getConfigFile(wrapper)).toBe(configFile('{}'))
		expect(wrapper.text()).toContain('Configuration valide.')
	})

	it('generates only the changed settings', async () => {
		const wrapper = mount(ThemeConfigurator)
		await getInput(wrapper, 'Épaisseur').setValue('3')
		await flushPromises()

		expect(getConfigFile(wrapper)).toBe(configFile('{\n  focus: {\n    width: 3,\n  },\n}'))
		expect(wrapper.text()).toContain('Configuration valide.')
	})

	it('generates a typed file that a project can import', async () => {
		const wrapper = mount(ThemeConfigurator)
		await wrapper.findAll('input[type="radio"][value="pa"]')[0]!.setValue(true)
		await flushPromises()

		expect(getConfigFile(wrapper)).toBe(configFile('{\n  brand: \'pa\',\n}'))
		expect(wrapper.findAll('pre code')[1]!.text()).toContain('import themeConfig from \'./synapse.theme\'')
	})

	it('reports a rejected setting and previews its default value', async () => {
		const wrapper = mount(ThemeConfigurator)
		await getInput(wrapper, 'Épaisseur').setValue('1')
		await flushPromises()

		expect(wrapper.text()).toContain('Réglage refusé, valeur par défaut appliquée')
		expect(wrapper.text()).toContain('focus.width')
		expect(wrapper.get('.theme-configurator__preview > *').attributes('style')).toContain('--v-focus-width: 2px')
	})

	it('applies the fields density to the preview', async () => {
		const wrapper = mount(ThemeConfigurator)
		await flushPromises()
		const preview = () => wrapper.get('.theme-configurator__preview')
		const previewDensities = () => preview().findAll('.v-input')
			.filter(input => input.find('.v-field').exists())
			.map(input => input.classes().find(name => name.startsWith('v-input--density-')))

		expect(new Set(previewDensities())).toEqual(new Set(['v-input--density-default']))

		await wrapper.findAll('input[type="radio"][value="compact"]')[0]!.setValue(true)
		await flushPromises()

		expect(getConfigFile(wrapper)).toBe(configFile('{\n  fields: {\n    density: \'compact\',\n  },\n}'))
		expect(new Set(previewDensities())).toEqual(new Set(['v-input--density-compact']))
		expect(preview().findAll('.v-field').every(field => field.classes().includes('v-field--variant-outlined'))).toBe(true)
	})
})
