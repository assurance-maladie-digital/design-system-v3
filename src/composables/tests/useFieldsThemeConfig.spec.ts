import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { VDefaultsProvider } from 'vuetify/components'
import { useFieldsThemeConfig } from '../useFieldsThemeConfig'
import { FIELDS_DEFAULTS_KEY } from '@/themeConfig/constants'

const Probe = defineComponent({
	props: {
		variantStyle: { type: String, default: 'outlined' },
		density: { type: String, default: 'default' },
	},
	setup(props) {
		const { resolveVariant, resolveDensity } = useFieldsThemeConfig()
		const variant = resolveVariant('variantStyle', () => props.variantStyle)
		const density = resolveDensity('density', () => props.density)
		return () => h('span', { 'data-variant': variant.value, 'data-density': density.value })
	},
})

const mountProbe = (probeProps: Record<string, unknown> = {}, fields?: Record<string, string>) => mount({
	render: () => fields
		? h(VDefaultsProvider, { defaults: { [FIELDS_DEFAULTS_KEY]: fields } }, () => h(Probe, probeProps))
		: h(Probe, probeProps),
})

describe('useFieldsThemeConfig', () => {
	it('keeps the prop defaults without theme configuration', () => {
		const span = mountProbe().get('span')

		expect(span.attributes('data-variant')).toBe('outlined')
		expect(span.attributes('data-density')).toBe('default')
	})

	it('applies the project fields settings when the props are not passed', () => {
		const span = mountProbe({}, { variant: 'filled', density: 'compact' }).get('span')

		expect(span.attributes('data-variant')).toBe('filled')
		expect(span.attributes('data-density')).toBe('compact')
	})

	it('keeps explicit props over the project settings', () => {
		const span = mountProbe({ 'variant-style': 'underlined', 'density': 'comfortable' }, { variant: 'filled', density: 'compact' }).get('span')

		expect(span.attributes('data-variant')).toBe('underlined')
		expect(span.attributes('data-density')).toBe('comfortable')
	})

	it('treats a prop passed as undefined as not passed', () => {
		const span = mountProbe({ variantStyle: undefined }, { variant: 'filled' }).get('span')

		expect(span.attributes('data-variant')).toBe('filled')
		expect(span.attributes('data-density')).toBe('default')
	})
})
