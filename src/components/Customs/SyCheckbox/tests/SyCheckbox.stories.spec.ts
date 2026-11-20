import { afterEach, describe, expect, it, vi } from 'vitest'
import { type VueWrapper, enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { composeStories } from '@storybook/vue3-vite'
import * as validationStories from '../Validation/Validation.stories'
import { getValidationDocumentation } from '@/composables/unifyValidation/documentationValidationProps'

const { WithCustomRules } = composeStories(validationStories)

const prerequisiteError = 'Vous devez d\'abord valider le prérequis'

function findField(wrapper: VueWrapper, label: string) {
	const field = wrapper.findAll('.v-input').find(input => input.find('label').text().includes(label))
	if (!field) throw new Error(`Champ « ${label} » introuvable`)
	return field
}

function findCheckbox(wrapper: VueWrapper, label: string) {
	return findField(wrapper, label).find('input[type="checkbox"]')
}

enableAutoUnmount(afterEach)

afterEach(() => {
	vi.unstubAllGlobals()
	vi.restoreAllMocks()
})

describe('SyCheckbox stories', () => {
	it('WithCustomRules suit le prérequis dans les deux sens sans toucher à la case', async () => {
		const wrapper = mount(WithCustomRules(), { attachTo: document.body })
		await flushPromises()

		const prerequisite = findCheckbox(wrapper, 'Prérequis')
		const accepted = findCheckbox(wrapper, 'J\'accepte')

		// Cocher la case sans valider le prérequis déclenche l'erreur
		await accepted.setValue(true)
		await flushPromises()
		expect(wrapper.text()).toContain(prerequisiteError)

		// Cycle répété pour détecter une valeur périmée du prérequis
		for (let i = 0; i < 2; i++) {
			await prerequisite.setValue(true)
			await flushPromises()
			expect(wrapper.text()).not.toContain(prerequisiteError)

			await prerequisite.setValue(false)
			await flushPromises()
			expect(wrapper.text()).toContain(prerequisiteError)
		}
	})

	it('WithCustomRules transmet ses args au champ et alimente l\'action update:modelValue', async () => {
		const onUpdate = vi.fn()
		const wrapper = mount(WithCustomRules({ 'label': 'Libellé piloté', 'onUpdate:modelValue': onUpdate }))
		await flushPromises()

		await findCheckbox(wrapper, 'Libellé piloté').setValue(true)
		expect(onUpdate).toHaveBeenCalledWith(true)
		// La règle de la démo reste appliquée malgré le v-bind des args
		await flushPromises()
		expect(wrapper.text()).toContain(prerequisiteError)
	})

	it('WithCustomRules n\'exige pas la case par défaut et désactive les controls pilotés par la démo', () => {
		expect(WithCustomRules.args.required).toBe(false)
		expect(WithCustomRules.args['onUpdate:modelValue']).toEqual(expect.any(Function))
		for (const prop of ['customRules', 'modelValue', 'useVuetifyValidation']) {
			expect(WithCustomRules.argTypes[prop]?.control, prop).toMatchObject({ disable: true })
		}
		// La doc générique de la prop est conservée, la précision de la démo est ajoutée à la suite
		const validationDoc = getValidationDocumentation()
		for (const prop of ['customRules', 'useVuetifyValidation'] as const) {
			expect(WithCustomRules.argTypes[prop]?.description, prop).toContain(validationDoc[prop].description)
			expect(WithCustomRules.argTypes[prop]?.description, prop).toContain('cette démo')
		}
	})
})
