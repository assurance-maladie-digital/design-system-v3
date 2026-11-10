import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { type Component, h } from 'vue'
import { VDefaultsProvider } from 'vuetify/components'
import { createVuetifyOptions } from '@/vuetifyOptions'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
import SySelect from '@/components/Customs/Selects/SySelect/SySelect.vue'
import SyAutocomplete from '@/components/Customs/Selects/SyAutocomplete/SyAutocomplete.vue'
import SyTextArea from '@/components/SyTextArea/SyTextArea.vue'
import PasswordField from '@/components/PasswordField/PasswordField.vue'
import NirField from '@/components/NirField/NirField.vue'
import PhoneField from '@/components/PhoneField/PhoneField.vue'
import LunarCalendar from '@/components/LunarCalendar/LunarCalendar.vue'
import SearchListField from '@/components/SearchListField/SearchListField.vue'
import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
import PeriodField from '@/components/PeriodField/PeriodField.vue'

// Defaults Vuetify produits par la configuration de thème d'un projet
const projectDefaults = createVuetifyOptions({ fields: { variant: 'filled', density: 'compact' } }).defaults ?? {}

const mountField = (component: Component, props: Record<string, unknown>, withProjectConfig: boolean) => mount({
	render: () => withProjectConfig
		? h(VDefaultsProvider, { defaults: projectDefaults }, () => h(component, props))
		: h(component, props),
})

const fieldCases: { name: string, component: Component, props: Record<string, unknown>, explicit: Record<string, unknown> }[] = [
	{ name: 'SyTextField', component: SyTextField, props: { label: 'Nom' }, explicit: { variantStyle: 'underlined', density: 'comfortable' } },
	{ name: 'SySelect', component: SySelect, props: { label: 'Choix', items: ['a', 'b'] }, explicit: { outlined: false, density: 'comfortable' } },
	{ name: 'SyAutocomplete', component: SyAutocomplete, props: { label: 'Recherche', items: ['a', 'b'] }, explicit: { density: 'comfortable' } },
	{ name: 'SyTextArea', component: SyTextArea, props: { label: 'Message' }, explicit: { variant: 'underlined' } },
	{ name: 'PasswordField', component: PasswordField, props: { label: 'Mot de passe' }, explicit: { variantStyle: 'underlined' } },
	{ name: 'NirField', component: NirField, props: { label: 'NIR' }, explicit: { variant: 'underlined', density: 'comfortable' } },
	{ name: 'PhoneField', component: PhoneField, props: {}, explicit: { outlined: false } },
	{ name: 'LunarCalendar', component: LunarCalendar, props: { label: 'Date' }, explicit: { variantStyle: 'underlined', density: 'comfortable' } },
	{ name: 'SearchListField', component: SearchListField, props: { label: 'Filtrer', items: [] }, explicit: { outlined: false } },
	{ name: 'DatePicker (calendrier)', component: DatePicker, props: { label: 'Date' }, explicit: { isOutlined: false, density: 'comfortable' } },
	{ name: 'DatePicker (noCalendar)', component: DatePicker, props: { label: 'Date', noCalendar: true }, explicit: { isOutlined: false, density: 'comfortable' } },
	{ name: 'DatePicker (useCombinedMode)', component: DatePicker, props: { label: 'Date', useCombinedMode: true }, explicit: { isOutlined: false, density: 'comfortable' } },
	{ name: 'PeriodField', component: PeriodField, props: {}, explicit: { isOutlined: false, density: 'comfortable' } },
]

const fieldClasses = async (component: Component, props: Record<string, unknown>, withProjectConfig: boolean) => {
	const wrapper = mountField(component, props, withProjectConfig)
	await flushPromises()
	const fields = wrapper.findAll('.v-field')
	expect(fields.length).toBeGreaterThan(0)
	const inputs = wrapper.findAll('.v-input').filter(input => input.find('.v-field').exists())
	return {
		variants: fields.map(field => field.classes().find(name => name.startsWith('v-field--variant-'))),
		densities: inputs.map(input => input.classes().find(name => name.startsWith('v-input--density-'))),
	}
}

describe('Synapse fields and the project fields configuration', () => {
	it.each(fieldCases)('$name keeps its current look without configuration', async ({ component, props }) => {
		const { variants, densities } = await fieldClasses(component, props, false)

		expect(new Set(variants)).toEqual(new Set(['v-field--variant-outlined']))
		expect(new Set(densities)).toEqual(new Set(['v-input--density-default']))
	})

	it.each(fieldCases)('$name applies fields.variant and fields.density from the configuration', async ({ component, props }) => {
		const { variants, densities } = await fieldClasses(component, props, true)

		expect(new Set(variants)).toEqual(new Set(['v-field--variant-filled']))
		expect(new Set(densities)).toEqual(new Set(['v-input--density-compact']))
	})

	it.each(fieldCases)('$name keeps explicit props over the configuration', async ({ component, props, explicit }) => {
		const { variants, densities } = await fieldClasses(component, { ...props, ...explicit }, true)

		// Sans prop de variante (SyAutocomplete), la variante reste celle de la configuration
		const hasVariantProp = ['variant', 'variantStyle', 'outlined', 'isOutlined'].some(name => name in explicit)
		expect(new Set(variants)).toEqual(new Set([hasVariantProp ? 'v-field--variant-underlined' : 'v-field--variant-filled']))
		expect(new Set(densities)).toEqual(new Set(['density' in explicit ? 'v-input--density-comfortable' : 'v-input--density-compact']))
	})
})
