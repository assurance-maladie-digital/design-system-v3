import { afterEach, describe, expect, it, vi } from 'vitest'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { composeStories } from '@storybook/vue3-vite'
import * as validationStories from '../Validation/Validation.stories'

const { SyFormValidation, VFormVuetifyValidation, WithCustomRules, WithSuccess } = composeStories(validationStories)

enableAutoUnmount(afterEach)

afterEach(() => {
	vi.unstubAllGlobals()
	vi.useRealTimers()
})

describe('MonthPicker validation stories', () => {
	it('SyFormValidation ne laisse pas args écraser la valeur saisie', async () => {
		const alertMock = vi.fn()
		vi.stubGlobal('alert', alertMock)
		const onUpdate = vi.fn()
		const wrapper = mount(SyFormValidation({ 'onUpdate:modelValue': onUpdate }), { attachTo: document.body })
		const input = wrapper.find('input')

		await input.setValue('03/2026')
		await flushPromises()
		// Vérifie ce qui sort du composant : la saisie est bien émise vers le parent
		expect(onUpdate).toHaveBeenCalledWith('03/2026')

		// La soumission valide la valeur saisie (et non une valeur fantôme) : le résultat remonte à handleSubmit
		await wrapper.find('form').trigger('submit')
		await flushPromises()
		expect(alertMock).toHaveBeenCalledWith('Mois valide !')
	})

	it('VFormVuetifyValidation rend le champ requis, comme le code affiché', () => {
		const wrapper = mount(VFormVuetifyValidation())

		expect(wrapper.find('input').attributes('aria-required')).toBe('true')
	})

	it('WithSuccess affiche le succès pour un mois de l\'année courante', async () => {
		// La règle de succès compare l'année saisie à l'année courante, et non à une année figée.
		vi.useFakeTimers({ toFake: ['Date'] })
		vi.setSystemTime(new Date('2030-06-15'))

		const wrapper = mount(WithSuccess({ modelValue: '06/2030' }))
		await flushPromises()

		expect(wrapper.text()).toContain('année en cours')
	})

	it('WithSuccess ne produit pas de succès pour une année différente de l\'année courante', async () => {
		vi.useFakeTimers({ toFake: ['Date'] })
		vi.setSystemTime(new Date('2030-06-15'))

		const wrapper = mount(WithSuccess({ modelValue: '06/2029' }))
		await flushPromises()

		expect(wrapper.text()).not.toContain('année en cours')
	})
	it('WithCustomRules applique les règles du Control customRules', async () => {
		const customRules = [{
			type: 'custom',
			options: {
				validate: () => false,
				message: 'Règle définie dans le Control.',
				fieldIdentifier: 'selectedMonth',
			},
		}]
		const wrapper = mount(WithCustomRules({ modelValue: '03/2026', customRules }), { attachTo: document.body })
		const input = wrapper.find('input')

		await input.trigger('focus')
		await input.trigger('blur')
		await flushPromises()

		expect(wrapper.text()).toContain('Règle définie dans le Control.')
	})

	it('SyFormValidation valide avec les règles du Control customRules', async () => {
		const alertMock = vi.fn()
		vi.stubGlobal('alert', alertMock)
		const customRules = [{
			type: 'custom',
			options: {
				validate: () => false,
				message: 'Règle définie dans le Control.',
				fieldIdentifier: 'selectedMonth',
			},
		}]
		const wrapper = mount(SyFormValidation({ customRules }), { attachTo: document.body })

		await wrapper.find('input').setValue('03/2026')
		await wrapper.find('form').trigger('submit')
		await flushPromises()

		expect(alertMock).toHaveBeenCalledWith('Veuillez corriger les erreurs.')
		expect(wrapper.text()).toContain('Règle définie dans le Control.')
	})
})
