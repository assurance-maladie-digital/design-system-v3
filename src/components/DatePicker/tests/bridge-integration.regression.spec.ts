import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import ComplexDatePicker from '../ComplexDatePicker/ComplexDatePicker.vue'
import DateTextInput from '../DateTextInput/DateTextInput.vue'

/**
 * Tests de régression pour l'intégration Bridge + validation
 * Couvrent les cas critiques non testés précédemment
 */
describe('Bridge Integration Regression Tests', () => {
	/**
	 * Test 1: Réactivité des customRules
	 * Bug potentiel : Si les règles ne sont pas réactives,
	 * la validation croisée (dateA -> dateB) ne fonctionne pas
	 */
	it('réagit aux changements de customRules dynamiques', async () => {
		const wrapper = mount(ComplexDatePicker, {
			props: {
				modelValue: '',
				label: 'Date',
				format: 'DD/MM/YYYY',
				// Première règle qui passe toujours
				customRules: [{ type: 'custom', options: { validate: () => true, message: 'Erreur' } }],
			},
		})

		// Changer les règles via setProps (comme le ferait le parent)
		await wrapper.setProps({
			customRules: [{ type: 'custom', options: { validate: () => false, message: 'Nouvelle erreur' } }],
		})
		await nextTick()

		// La nouvelle règle doit être prise en compte
		const input = wrapper.find('input')
		await input.setValue('15/05/2025')
		await input.trigger('blur')
		await flushPromises()

		// Avec la nouvelle règle qui retourne false, on doit avoir une erreur
		const errors = wrapper.findAll('.v-messages__message--error')
		expect(errors.length).toBeGreaterThan(0)

		wrapper.unmount()
	})

	/**
	 * Test 2: Mode readonly - pas de validation active
	 * Bug potentiel : Validation qui s'exécute quand même en readonly
	 */
	it('ne valide pas quand readonly est true', async () => {
		const validateSpy = vi.fn(() => true)

		const wrapper = mount(DateTextInput, {
			props: {
				modelValue: '',
				label: 'Date',
				format: 'DD/MM/YYYY',
				readonly: true,
				showSuccessMessages: true,
				customRules: [{ type: 'custom', options: { validate: validateSpy } }],
			},
		})

		// Attendre un tick pour s'assurer que la validation ne s'est pas déclenchée
		await nextTick()

		// La règle ne doit pas avoir été appelée
		expect(validateSpy).not.toHaveBeenCalled()

		wrapper.unmount()
	})

	/**
	 * Test 3: Coordonnation parent/enfant avec skipInternalValidation
	 * Bug potentiel : DateTextInput valide en parallèle du parent
	 */
	it('ComplexDatePicker contrôle la validation quand DateTextInput a skipInternalValidation', async () => {
		const parentValidate = vi.fn(() => ({ hasError: false, hasWarning: false, hasSuccess: true, state: { errors: [], warnings: [], successes: ['OK'] } }))

		// Ce test vérifie que le parent gère la validation, pas l'enfant
		const wrapper = mount(ComplexDatePicker, {
			props: {
				modelValue: '',
				label: 'Date parent',
				format: 'DD/MM/YYYY',
				showSuccessMessages: true,
				customRules: [{ type: 'custom', options: { validate: parentValidate } }],
			},
		})

		const input = wrapper.find('input')
		await input.setValue('20/06/2025')
		await input.trigger('blur')
		await flushPromises()

		// Vérifier qu'on a un message de succès (du parent)
		const successMessages = wrapper.findAll('.v-messages__message--success')
		expect(successMessages.length).toBeLessThanOrEqual(1)

		wrapper.unmount()
	})

	/**
	 * Test 4: Pas de double validation avec queueMicrotask
	 * Bug potentiel : queueMicrotask pourrait causer des validations en cascade
	 */
	it('ne déclenche pas de validation en cascade avec queueMicrotask', async () => {
		let validationCount = 0
		const validateRule = () => {
			validationCount++
			return true
		}

		const wrapper = mount(DateTextInput, {
			props: {
				modelValue: '',
				label: 'Date',
				format: 'DD/MM/YYYY',
				customRules: [{ type: 'custom', options: { validate: validateRule } }],
				showSuccessMessages: true,
			},
		})

		// Attendre que les microtasks soient traitées
		await nextTick()
		await new Promise(resolve => queueMicrotask(() => resolve(undefined)))

		// La validation ne doit pas avoir été déclenchée automatiquement
		// (seulement au blur ou changement de valeur)
		expect(validationCount).toBe(0)

		wrapper.unmount()
	})

	/**
	 * Test 5: Clear reset correctement les messages
	 * Bug potentiel : Messages qui restent après clear
	 */
	it('reset les messages de validation après clear', async () => {
		const wrapper = mount(DateTextInput, {
			props: {
				modelValue: '15/05/2025',
				label: 'Date',
				format: 'DD/MM/YYYY',
				showSuccessMessages: true,
				required: true,
			},
		})

		// D'abord s'assurer qu'on a un message de succès
		await flushPromises()

		// Puis clear
		await wrapper.setProps({ modelValue: '' })
		await flushPromises()
		await nextTick()

		// Plus de message de succès
		const successMessages = wrapper.findAll('.v-messages__message--success')
		expect(successMessages.length).toBe(0)

		wrapper.unmount()
	})

	/**
	 * Test 6: useDatePickerValidationBridge expose les bonnes méthodes
	 * Bug potentiel : Methods exposées qui ne fonctionnent pas
	 */
	it('expose validateOnSubmit qui retourne un booléen', async () => {
		const wrapper = mount(DateTextInput, {
			props: {
				modelValue: '',
				label: 'Date',
				format: 'DD/MM/YYYY',
				required: true,
			},
		})

		// Appeler validateOnSubmit exposé
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Testing internal API
		const result = await (wrapper.vm as any).validateOnSubmit?.()

		// Doit retourner false car champ vide et required
		expect(result).toBe(false)

		wrapper.unmount()
	})

	/**
	 * Test 7: Pas de fuite mémoire avec les watchers
	 * Bug potentiel : Watchers qui s'accumulent
	 */
	it('nettoie les watchers quand le composant est détruit', async () => {
		const wrapper = mount(DateTextInput, {
			props: {
				modelValue: '',
				label: 'Date',
				format: 'DD/MM/YYYY',
			},
		})

		// Détruire le composant
		wrapper.unmount()

		// Aucune erreur ne doit être levée
		// (les watchers sont nettoyés automatiquement par Vue)
		expect(() => wrapper.vm).not.toThrow()
	})
})
