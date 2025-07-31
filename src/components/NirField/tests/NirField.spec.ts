import { mount } from '@vue/test-utils'
import NirField from '../NirField.vue'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { useValidation } from '@/composables/validation/useValidation'

const vuetify = createVuetify({
	components,
	directives,
})

describe('NirField.vue', () => {
	let wrapper: ReturnType<typeof mount<typeof NirField & {
		numberValidation: ReturnType<typeof useValidation>
		keyValidation: ReturnType<typeof useValidation>
	}>>

	// Tableau pour suivre tous les wrappers créés pendant les tests
	let activeWrappers: ReturnType<typeof mount>[] = []

	// Helper pour attendre que les opérations asynchrones soient terminées
	async function flushPromises() {
		return new Promise(resolve => setTimeout(resolve, 0))
	}

	beforeEach(async () => {
		wrapper = mount(NirField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: undefined,
				required: true,
				showSuccessMessages: true,
				outlined: true,
			},
		})

		// Ajouter le wrapper à la liste pour le démontage
		activeWrappers.push(wrapper)

		// Attendre que le montage initial soit terminé
		await wrapper.vm.$nextTick()
		await flushPromises()
	})

	afterEach(async () => {
		// Attendre que toutes les promesses soient résolues avant de démonter
		await flushPromises()

		// Démonter tous les composants pour éviter les fuites mémoire
		for (const wrapper of activeWrappers) {
			if (wrapper && typeof wrapper.unmount === 'function') {
				wrapper.unmount()
				// Attendre après chaque démontage pour permettre le nettoyage
				await flushPromises()
			}
		}
		activeWrappers = []

		// Réinitialiser tous les mocks
		vi.resetAllMocks()

		// Attendre une dernière fois pour s'assurer que tout est nettoyé
		await flushPromises()
	})

	it('renders correctly', async () => {
		// Attendre que tous les effets asynchrones soient terminés
		await wrapper.vm.$nextTick()
		await flushPromises()

		expect(wrapper.exists()).toBe(true)
		expect(wrapper.find('.number-field').exists()).toBe(true)
		expect(wrapper.find('.key-field').exists()).toBe(true)
	})

	it('displays error message for invalid NIR length', async () => {
		await wrapper.find('.number-field input').setValue('123')
		await wrapper.vm.$nextTick()
		await wrapper.find('.number-field input').trigger('blur')
		await wrapper.vm.$nextTick()
		await flushPromises()
		expect(wrapper.vm.numberValidation.errors.value[0]).toBe('Le numéro de sécurité sociale est invalide.')
	})

	it('validates the NIR field successfully', async () => {
		await wrapper.find('.number-field input').setValue('2940375120005')
		await wrapper.vm.$nextTick()
		await wrapper.find('.number-field input').trigger('blur')
		await wrapper.vm.$nextTick()
		await flushPromises()
		expect(wrapper.vm.numberValidation.successes.value).toContain('Le numéro de sécurité sociale est valide.')
	})

	it('displays error message for invalid key length', async () => {
		await wrapper.find('.number-field input').setValue('2940375120005')
		await wrapper.vm.$nextTick()
		await wrapper.find('.key-field input').setValue('1')
		await wrapper.vm.$nextTick()
		await wrapper.find('.key-field input').trigger('blur')
		await wrapper.vm.$nextTick()
		await flushPromises()
		expect(wrapper.vm.keyValidation.errors.value[0]).toBe('Le numéro de sécurité sociale est invalide.')
	})

	it('validates the key field successfully', async () => {
		await wrapper.find('.number-field input').setValue('2940375120005')
		await wrapper.vm.$nextTick()
		await wrapper.find('.key-field input').setValue('91')
		await wrapper.vm.$nextTick()
		await wrapper.find('.key-field input').trigger('blur')
		await wrapper.vm.$nextTick()
		await flushPromises()
		expect(wrapper.vm.keyValidation.successes.value).toContain('Le numéro de sécurité sociale est valide.')
	})

	it('hides the key field when displayKey is false', async () => {
		await wrapper.setProps({ displayKey: false })
		await wrapper.vm.$nextTick()
		await flushPromises()
		expect(wrapper.find('.key-field').exists()).toBe(false)
	})

	it('calls validateOnSubmit and returns true if no errors', async () => {
		const testWrapper = mount(NirField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: undefined,
				required: false,
				outlined: true,
			},
		})

		// Ajouter le wrapper à la liste pour le démontage
		activeWrappers.push(testWrapper)

		const numberField = testWrapper.find('.number-field input')
		await numberField.setValue('2940375120005')
		await numberField.trigger('blur')

		await testWrapper.vm.$nextTick()
		await flushPromises()
		const isValid = await testWrapper.vm.validateOnSubmit()

		expect(isValid).toBe(true)
	})

	it('applies custom key rules when provided', async () => {
		const customKeyRules = [{
			type: 'custom',
			options: {
				validate: (value: string) => value === '91',
				message: 'Custom key validation failed.',
				successMessage: 'Custom key validation passed.',
				fieldIdentifier: 'clé',
			},
		}]

		const customWrapper = mount(NirField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: undefined,
				customKeyRules,
				showSuccessMessages: true,
				outlined: true,
			},
		})

		activeWrappers.push(customWrapper)

		await customWrapper.vm.$nextTick()
		await flushPromises()

		const numberField = customWrapper.find('.number-field input')
		const keyField = customWrapper.find('.key-field input')
		await numberField.setValue('2940375120005')
		await keyField.setValue('91')
		await keyField.trigger('blur')
		await customWrapper.vm.$nextTick()
		await flushPromises()
		expect(customWrapper.vm.keyValidation.successes.value).toContain('Custom key validation passed.')
	})

	it('emits update:modelValue with correct format', async () => {
		const numberField = wrapper.find('.number-field input')
		const keyField = wrapper.find('.key-field input')
		await numberField.setValue('2940375120005')
		await wrapper.vm.$nextTick()
		await flushPromises()
		await keyField.setValue('91')
		await wrapper.vm.$nextTick()
		await flushPromises()
		expect(wrapper.emitted('update:modelValue')?.slice(-1)[0]).toEqual(['294037512000591'])
	})

	it('emits undefined when both fields are empty', async () => {
		const numberField = wrapper.find('.number-field input')
		const keyField = wrapper.find('.key-field input')
		await numberField.setValue('')
		await keyField.setValue('')
		await wrapper.vm.$nextTick()
		await flushPromises()
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([undefined])
	})

	it('splits modelValue correctly when provided', async () => {
		await wrapper.setProps({ modelValue: '294037512000591' })
		await wrapper.vm.$nextTick()
		await flushPromises()
		const numberInput = wrapper.find('.number-field input').element as Element & { value: string }
		const keyInput = wrapper.find('.key-field input').element as Element & { value: string }
		expect(numberInput.value.replace(/\s/g, '')).toBe('2940375120005')
		expect(keyInput.value).toBe('91')
	})
})
