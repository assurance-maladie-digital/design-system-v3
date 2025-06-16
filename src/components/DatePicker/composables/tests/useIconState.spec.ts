import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useIconState } from '../useIconState'

describe('useIconState', () => {
	// Mocks et setup
	const errorMessages = ref<string[]>([])
	const warningMessages = ref<string[]>([])
	const successMessages = ref<string[]>([])

	describe('getIcon', () => {
		it('devrait retourner undefined si noCalendar est true', () => {
			const { getIcon } = useIconState({
				noCalendar: true,
				errorMessages,
				warningMessages,
				successMessages,
			})

			// Ajouter une erreur pour vérifier que noCalendar a priorité
			errorMessages.value = ['Erreur']

			expect(getIcon.value).toBeUndefined()
		})

		it('devrait retourner undefined si disableErrorHandling est true', () => {
			const { getIcon } = useIconState({
				disableErrorHandling: true,
				errorMessages,
				warningMessages,
				successMessages,
			})

			// Ajouter une erreur pour vérifier que disableErrorHandling a priorité
			errorMessages.value = ['Erreur']

			expect(getIcon.value).toBeUndefined()
		})

		it('devrait retourner "error" si errorMessages contient des erreurs', () => {
			// Réinitialiser les messages
			errorMessages.value = ['Erreur']
			warningMessages.value = []
			successMessages.value = []

			const { getIcon } = useIconState({
				errorMessages,
				warningMessages,
				successMessages,
			})

			expect(getIcon.value).toBe('error')
		})

		it('devrait retourner "warning" si warningMessages contient des avertissements et pas d\'erreurs', () => {
			// Réinitialiser les messages
			errorMessages.value = []
			warningMessages.value = ['Avertissement']
			successMessages.value = []

			const { getIcon } = useIconState({
				errorMessages,
				warningMessages,
				successMessages,
			})

			expect(getIcon.value).toBe('warning')
		})

		it('devrait retourner "success" si successMessages contient des succès et pas d\'erreurs ni d\'avertissements', () => {
			// Réinitialiser les messages
			errorMessages.value = []
			warningMessages.value = []
			successMessages.value = ['Succès']

			const { getIcon } = useIconState({
				errorMessages,
				warningMessages,
				successMessages,
			})

			expect(getIcon.value).toBe('success')
		})

		it('devrait retourner undefined si aucun message n\'est présent', () => {
			// Réinitialiser les messages
			errorMessages.value = []
			warningMessages.value = []
			successMessages.value = []

			const { getIcon } = useIconState({
				errorMessages,
				warningMessages,
				successMessages,
			})

			expect(getIcon.value).toBeUndefined()
		})

		it('devrait prioriser les erreurs sur les avertissements et les succès', () => {
			// Définir tous les types de messages
			errorMessages.value = ['Erreur']
			warningMessages.value = ['Avertissement']
			successMessages.value = ['Succès']

			const { getIcon } = useIconState({
				errorMessages,
				warningMessages,
				successMessages,
			})

			expect(getIcon.value).toBe('error')
		})

		it('devrait prioriser les avertissements sur les succès', () => {
			// Définir des avertissements et des succès, mais pas d'erreurs
			errorMessages.value = []
			warningMessages.value = ['Avertissement']
			successMessages.value = ['Succès']

			const { getIcon } = useIconState({
				errorMessages,
				warningMessages,
				successMessages,
			})

			expect(getIcon.value).toBe('warning')
		})
	})
})
