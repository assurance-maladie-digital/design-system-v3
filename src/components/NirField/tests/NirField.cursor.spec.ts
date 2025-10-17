import { mount } from '@vue/test-utils'
import NirField from '../NirField.vue'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
	components,
	directives,
})

/**
 * Tests spécifiques pour la préservation de la position du curseur
 * quand displayKey=false
 */
describe('NirField - Cursor Position Preservation', () => {
	let wrapper: ReturnType<typeof mount<typeof NirField>>
	let activeWrappers: ReturnType<typeof mount>[] = []

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
				displayKey: false, // ⚠️ Mode sans clé
				required: false,
				outlined: true,
			},
		})

		activeWrappers.push(wrapper)
		await wrapper.vm.$nextTick()
		await flushPromises()
	})

	afterEach(async () => {
		await flushPromises()
		for (const wrapper of activeWrappers) {
			if (wrapper && typeof wrapper.unmount === 'function') {
				wrapper.unmount()
				await flushPromises()
			}
		}
		activeWrappers = []
		vi.resetAllMocks()
		await flushPromises()
	})

	it('should not reposition cursor when editing middle of NIR', async () => {
		const numberInput = wrapper.find('.number-field input')
		const inputElement = numberInput.element as HTMLInputElement

		// 1. Saisir un NIR complet
		await numberInput.setValue('2940375120005')
		await wrapper.vm.$nextTick()
		await flushPromises()

		// 2. Positionner le curseur au milieu (après "2940")
		inputElement.focus()
		inputElement.setSelectionRange(4, 4)

		// Vérifier la position initiale
		expect(inputElement.selectionStart).toBe(4)

		// 3. Spy sur les méthodes qui pourraient repositionner le curseur
		const focusSpy = vi.spyOn(inputElement, 'focus')
		const clickSpy = vi.spyOn(inputElement, 'click')

		// 4. Simuler la suppression d'un chiffre au milieu
		// Supprimer le "4" dans "2940" -> "290"
		const currentValue = inputElement.value.replace(/\s/g, '') // Enlever les espaces
		const newValue = currentValue.slice(0, 3) + currentValue.slice(4) // Supprimer le 4ème caractère

		await numberInput.setValue(newValue)
		await wrapper.vm.$nextTick()
		await flushPromises()

		// 5. Vérifier qu'aucun focus/click automatique n'a été déclenché
		expect(focusSpy).not.toHaveBeenCalled()
		expect(clickSpy).not.toHaveBeenCalled()

		focusSpy.mockRestore()
		clickSpy.mockRestore()
	})

	it('should not trigger watchers when displayKey is false', async () => {
		// Spy sur console.log pour détecter d'éventuels logs de debug
		const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
		const focusSpy = vi.spyOn(HTMLElement.prototype, 'focus')

		const numberInput = wrapper.find('.number-field input')

		// Simuler des modifications qui déclencheraient normalement les watchers
		await numberInput.setValue('123')
		await wrapper.vm.$nextTick()

		// Effacer complètement
		await numberInput.setValue('')
		await wrapper.vm.$nextTick()
		await flushPromises()

		// Vérifier qu'aucun focus automatique n'a été déclenché
		expect(focusSpy).not.toHaveBeenCalled()

		consoleSpy.mockRestore()
		focusSpy.mockRestore()
	})

	it('should not add our custom keydown listeners when displayKey is false', async () => {
		// Créer un nouveau wrapper pour tester onMounted
		const addEventListenerSpy = vi.spyOn(HTMLElement.prototype, 'addEventListener')

		const newWrapper = mount(NirField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				displayKey: false,
				required: false,
			},
		})
		activeWrappers.push(newWrapper)

		await newWrapper.vm.$nextTick()
		await flushPromises()

		// Filtrer seulement nos appels keydown spécifiques (avec handleNumberKeydown)
		const ourKeydownListeners = addEventListenerSpy.mock.calls.filter(
			call => call[0] === 'keydown'
				&& call[1]
				&& call[1].toString().includes('handleNumberKeydown'),
		)

		// Aucun de nos listeners keydown ne devrait être ajouté
		expect(ourKeydownListeners).toHaveLength(0)

		addEventListenerSpy.mockRestore()
	})

	it('should handle input changes without cursor interference', async () => {
		const numberInput = wrapper.find('.number-field input')
		const inputElement = numberInput.element as HTMLInputElement

		// Test avec plusieurs modifications successives
		const testValues = [
			'1',
			'12',
			'123',
			'1234',
			'12345',
			'123456',
			'1234567',
			'12345678',
			'123456789',
			'1234567890',
			'12345678901',
			'123456789012',
			'1234567890123',
		]

		const focusSpy = vi.spyOn(inputElement, 'focus')

		for (const value of testValues) {
			await numberInput.setValue(value)
			await wrapper.vm.$nextTick()
			await flushPromises()
		}

		// Aucun focus automatique ne devrait avoir été déclenché
		expect(focusSpy).not.toHaveBeenCalled()

		focusSpy.mockRestore()
	})

	it('should emit correct modelValue without cursor side effects', async () => {
		const numberInput = wrapper.find('.number-field input')

		// Saisir un NIR complet
		await numberInput.setValue('2940375120005')
		await wrapper.vm.$nextTick()
		await flushPromises()

		// Vérifier que la valeur émise est correcte
		const emittedValues = wrapper.emitted('update:modelValue')
		expect(emittedValues).toBeDefined()

		// La dernière valeur émise devrait être le NIR complet
		const lastEmittedValue = emittedValues?.[emittedValues.length - 1]?.[0]
		expect(lastEmittedValue).toBe('2940375120005')

		// Vérifier qu'il n'y a pas de champ clé
		expect(wrapper.find('.key-field').exists()).toBe(false)
	})

	it('should preserve input behavior during rapid typing', async () => {
		const numberInput = wrapper.find('.number-field input')
		const focusSpy = vi.spyOn(HTMLElement.prototype, 'focus')

		// Simuler une saisie rapide
		const rapidValues = ['1', '12', '123', '1234', '12345']

		for (const value of rapidValues) {
			await numberInput.setValue(value)
			// Pas d'attente pour simuler la saisie rapide
		}

		await wrapper.vm.$nextTick()
		await flushPromises()

		// Aucun focus automatique ne devrait interférer
		expect(focusSpy).not.toHaveBeenCalled()

		focusSpy.mockRestore()
	})

	it('should not trigger watchers on keyValue changes when displayKey is false', async () => {
		// Spy sur les watchers internes
		const focusSpy = vi.spyOn(HTMLElement.prototype, 'focus')

		// Accéder aux valeurs internes du composant
		const vm = wrapper.vm as { keyValue?: string }

		// Simuler un changement de keyValue (qui ne devrait pas déclencher de focus)
		if (vm.keyValue !== undefined) {
			vm.keyValue = '12'
			await wrapper.vm.$nextTick()
			vm.keyValue = ''
			await wrapper.vm.$nextTick()
			await flushPromises()
		}

		// Aucun focus ne devrait être déclenché
		expect(focusSpy).not.toHaveBeenCalled()

		focusSpy.mockRestore()
	})

	it('should not interfere with masked input behavior', async () => {
		const numberInput = wrapper.find('.number-field input')
		const inputElement = numberInput.element as HTMLInputElement

		// Spy sur les méthodes de focus qui pourraient interférer
		const focusSpy = vi.spyOn(inputElement, 'focus')
		const clickSpy = vi.spyOn(inputElement, 'click')

		// Saisir un NIR avec masque (le masque peut gérer sa propre logique de curseur)
		await numberInput.setValue('123456789')
		await wrapper.vm.$nextTick()
		await flushPromises()

		// Simuler une modification
		await numberInput.trigger('input')
		await wrapper.vm.$nextTick()
		await flushPromises()

		// Vérifier que notre logique NirField n'interfère pas avec le masque
		expect(focusSpy).not.toHaveBeenCalled()
		expect(clickSpy).not.toHaveBeenCalled()

		focusSpy.mockRestore()
		clickSpy.mockRestore()
	})

	it('should handle backspace and delete without cursor jump', async () => {
		const numberInput = wrapper.find('.number-field input')
		const inputElement = numberInput.element as HTMLInputElement

		// Saisir un NIR complet
		await numberInput.setValue('2940375120005')
		await wrapper.vm.$nextTick()
		await flushPromises()

		// Positionner le curseur au milieu
		inputElement.focus()
		inputElement.setSelectionRange(7, 7)

		const focusSpy = vi.spyOn(inputElement, 'focus')

		// Simuler une suppression (backspace)
		const backspaceEvent = new KeyboardEvent('keydown', {
			key: 'Backspace',
			code: 'Backspace',
			keyCode: 8,
		})
		inputElement.dispatchEvent(backspaceEvent)

		await wrapper.vm.$nextTick()
		await flushPromises()

		// Vérifier qu'aucun focus automatique n'a été déclenché
		expect(focusSpy).not.toHaveBeenCalled()

		focusSpy.mockRestore()
	})

	it('should not interfere with normal input events', async () => {
		const numberInput = wrapper.find('.number-field input')
		const inputElement = numberInput.element as HTMLInputElement

		// Spy sur les événements qui pourraient interférer
		const focusSpy = vi.spyOn(inputElement, 'focus')
		const clickSpy = vi.spyOn(inputElement, 'click')

		// Simuler plusieurs événements input successifs
		await numberInput.setValue('1')
		await numberInput.trigger('input')
		await numberInput.setValue('12')
		await numberInput.trigger('input')
		await numberInput.setValue('123')
		await numberInput.trigger('input')

		await wrapper.vm.$nextTick()
		await flushPromises()

		// Aucune interférence ne devrait avoir lieu
		expect(focusSpy).not.toHaveBeenCalled()
		expect(clickSpy).not.toHaveBeenCalled()

		focusSpy.mockRestore()
		clickSpy.mockRestore()
	})
})
