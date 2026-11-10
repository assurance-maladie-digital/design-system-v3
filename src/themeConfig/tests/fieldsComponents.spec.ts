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
const projectDefaults = createVuetifyOptions({ fields: { density: 'compact' } }).defaults ?? {}

const mountField = (component: Component, props: Record<string, unknown>, withProjectConfig: boolean) => mount({
	render: () => withProjectConfig
		? h(VDefaultsProvider, { defaults: projectDefaults }, () => h(component, props))
		: h(component, props),
})

// `explicitDensity` : le composant expose une prop `density` que le consommateur peut passer
const fieldCases: { name: string, component: Component, props: Record<string, unknown>, explicitDensity: boolean }[] = [
	{ name: 'SyTextField', component: SyTextField, props: { label: 'Nom' }, explicitDensity: true },
	{ name: 'SySelect', component: SySelect, props: { label: 'Choix', items: ['a', 'b'] }, explicitDensity: true },
	{ name: 'SyAutocomplete', component: SyAutocomplete, props: { label: 'Recherche', items: ['a', 'b'] }, explicitDensity: true },
	{ name: 'SyTextArea', component: SyTextArea, props: { label: 'Message' }, explicitDensity: false },
	{ name: 'PasswordField', component: PasswordField, props: { label: 'Mot de passe' }, explicitDensity: false },
	{ name: 'NirField', component: NirField, props: { label: 'NIR' }, explicitDensity: true },
	{ name: 'PhoneField', component: PhoneField, props: {}, explicitDensity: false },
	{ name: 'LunarCalendar', component: LunarCalendar, props: { label: 'Date' }, explicitDensity: true },
	{ name: 'SearchListField', component: SearchListField, props: { label: 'Filtrer', items: [] }, explicitDensity: false },
	{ name: 'DatePicker (calendrier)', component: DatePicker, props: { label: 'Date' }, explicitDensity: true },
	{ name: 'DatePicker (noCalendar)', component: DatePicker, props: { label: 'Date', noCalendar: true }, explicitDensity: true },
	{ name: 'DatePicker (useCombinedMode)', component: DatePicker, props: { label: 'Date', useCombinedMode: true }, explicitDensity: true },
	{ name: 'PeriodField', component: PeriodField, props: {}, explicitDensity: true },
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

	it.each(fieldCases)('$name applies fields.density from the configuration and keeps its outlined style', async ({ component, props }) => {
		const { variants, densities } = await fieldClasses(component, props, true)

		expect(new Set(variants)).toEqual(new Set(['v-field--variant-outlined']))
		expect(new Set(densities)).toEqual(new Set(['v-input--density-compact']))
	})

	it.each(fieldCases.filter(({ explicitDensity }) => explicitDensity))('$name keeps an explicit density over the configuration', async ({ component, props }) => {
		const { densities } = await fieldClasses(component, { ...props, density: 'comfortable' }, true)

		expect(new Set(densities)).toEqual(new Set(['v-input--density-comfortable']))
	})
})
