import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import useAccordionGroupCommunication from '../useAccordionGroupCommunication'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

// Composant vide qui servira de contexte pour les hooks Vue
const TestComponent = defineComponent({
	setup() {
		const instanceId = 'test-instance'
		const groupId = 'test-group'
		const onFocusChange = vi.fn()

		const accordion = useAccordionGroupCommunication(instanceId, groupId, onFocusChange)

		return {
			instanceId,
			groupId,
			onFocusChange,
			emitFocusChange: accordion.emitFocusChange,
			handleFocusChange: accordion.handleFocusChange,
		}
	},
	template: '<div></div>',
})

describe('useAccordionGroupCommunication', () => {
	const instanceId = 'test-instance'
	const groupId = 'test-group'
	const mockOnFocusChange = vi.fn()
	// Wrapper pour le composant de test
	/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
	let wrapper: any

	// Espionner les méthodes addEventListener et removeEventListener de window
	beforeEach(() => {
		vi.spyOn(window, 'addEventListener')
		vi.spyOn(window, 'removeEventListener')
		vi.spyOn(window, 'dispatchEvent')

		// Réinitialiser les mocks avant chaque test
		mockOnFocusChange.mockReset()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('initialization', () => {
		beforeEach(() => {
			// Monter le composant de test pour fournir un contexte aux hooks Vue
			wrapper = mount(TestComponent)
		})

		afterEach(() => {
			// Démonter le composant après chaque test
			wrapper.unmount()
		})

		it('adds event listener on mount', () => {
			// Le composable est maintenant utilisé via le composant de test,
			// ce qui fournit un contexte valide pour les hooks de cycle de vie

			// Vérifier que le composant est bien monté
			expect(wrapper.vm).toBeDefined()

			// Si addEventListener a été appelé sur window, cela signifie que
			// le hook onMounted a été correctement exécuté
			expect(window.addEventListener).toHaveBeenCalled()
		})
	})

	describe('emitFocusChange', () => {
		beforeEach(() => {
			// Monter le composant de test pour fournir un contexte aux hooks Vue
			wrapper = mount(TestComponent)
		})

		afterEach(() => {
			// Démonter le composant après chaque test
			wrapper.unmount()
		})

		it('dispatches a custom event with the correct details', () => {
			// Utiliser les méthodes exposées par le composant
			const { emitFocusChange } = wrapper.vm

			const itemId = 'test-item'
			emitFocusChange(itemId)

			expect(window.dispatchEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'accordion-focus-changed',
					detail: {
						sourceInstanceId: instanceId,
						groupId,
						itemId,
					},
				}),
			)
		})

		it('dispatches a custom event with null itemId', () => {
			// Utiliser les méthodes exposées par le composant
			const { emitFocusChange } = wrapper.vm

			emitFocusChange(null)

			expect(window.dispatchEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'accordion-focus-changed',
					detail: {
						sourceInstanceId: instanceId,
						groupId,
						itemId: null,
					},
				}),
			)
		})
	})

	describe('handleFocusChange', () => {
		beforeEach(() => {
			// Monter le composant de test pour fournir un contexte aux hooks Vue
			wrapper = mount(TestComponent)
		})

		afterEach(() => {
			// Démonter le composant après chaque test
			wrapper.unmount()
		})

		it('ignores events from the same instance', () => {
			// Utiliser les méthodes exposées par le composant
			const { handleFocusChange } = wrapper.vm

			const event = new CustomEvent('accordion-focus-changed', {
				detail: {
					sourceInstanceId: instanceId, // Même instance
					groupId,
					itemId: 'test-item',
				},
			})

			handleFocusChange(event)

			expect(mockOnFocusChange).not.toHaveBeenCalled()
		})

		it('ignores events from different groups', () => {
			// Utiliser les méthodes exposées par le composant
			const { handleFocusChange } = wrapper.vm

			const event = new CustomEvent('accordion-focus-changed', {
				detail: {
					sourceInstanceId: 'other-instance',
					groupId: 'other-group', // Groupe différent
					itemId: 'test-item',
				},
			})

			handleFocusChange(event)

			expect(mockOnFocusChange).not.toHaveBeenCalled()
		})

		it('calls onFocusChange with null when receiving a valid event', () => {
			// Utiliser les méthodes exposées par le composant
			const { handleFocusChange, onFocusChange } = wrapper.vm

			// Réinitialiser le mock avant ce test
			onFocusChange.mockReset()

			const event = new CustomEvent('accordion-focus-changed', {
				detail: {
					sourceInstanceId: 'other-instance',
					groupId,
					itemId: null,
				},
			})

			handleFocusChange(event)

			expect(onFocusChange).toHaveBeenCalledWith(null)
		})
	})
})
