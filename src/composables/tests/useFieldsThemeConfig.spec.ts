import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { VDefaultsProvider } from 'vuetify/components'
import { useFieldsThemeConfig } from '../useFieldsThemeConfig'
import { FIELDS_DEFAULTS_KEY } from '@/themeConfig/constants'

const Probe = defineComponent({
	props: {
		density: { type: String, default: 'default' },
	},
	setup(props) {
		const { resolveDensity } = useFieldsThemeConfig()
		const density = resolveDensity('density', () => props.density)
		return () => h('span', { 'data-density': density.value })
	},
})

const mountProbe = (probeProps: Record<string, unknown> = {}, fields?: Record<string, string>) => mount({
	render: () => fields
		? h(VDefaultsProvider, { defaults: { [FIELDS_DEFAULTS_KEY]: fields } }, () => h(Probe, probeProps))
		: h(Probe, probeProps),
})

describe('useFieldsThemeConfig', () => {
	it('keeps the prop default without theme configuration', () => {
		expect(mountProbe().get('span').attributes('data-density')).toBe('default')
	})

	it('applies the project density when the prop is not passed', () => {
		expect(mountProbe({}, { density: 'compact' }).get('span').attributes('data-density')).toBe('compact')
	})

	it('keeps an explicit prop over the project density', () => {
		expect(mountProbe({ density: 'comfortable' }, { density: 'compact' }).get('span').attributes('data-density')).toBe('comfortable')
	})

	it('treats a prop passed as undefined as not passed', () => {
		expect(mountProbe({ density: undefined }, { density: 'compact' }).get('span').attributes('data-density')).toBe('compact')
	})
})
