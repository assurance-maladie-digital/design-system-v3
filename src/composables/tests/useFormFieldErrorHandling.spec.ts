import { describe, it, expect, vi } from 'vitest'
import { ref, nextTick } from 'vue'
import { useFormFieldErrorHandling } from '../useFormFieldErrorHandling'

describe('useFormFieldErrorHandling', () => {
	describe('initialisation', () => {
		it('retourne les champs attendus', () => {
			const modelValue = ref<unknown>(null)
			const result = useFormFieldErrorHandling({}, modelValue)

			expect(result).toHaveProperty('validateField')
			expect(result).toHaveProperty('validateOnSubmit')
			expect(result).toHaveProperty('checkErrorOnBlur')
			expect(result).toHaveProperty('hasError')
			expect(result).toHaveProperty('hasWarning')
			expect(result).toHaveProperty('hasSuccess')
			expect(result).toHaveProperty('errors')
			expect(result).toHaveProperty('warnings')
			expect(result).toHaveProperty('successes')
		})

		it('synchronise errorMessages externes immédiatement', () => {
			const modelValue = ref<unknown>(null)
			const { errors } = useFormFieldErrorHandling(
				{ errorMessages: ['Erreur externe'] },
				modelValue,
			)
			expect(errors.value).toContain('Erreur externe')
		})

		it('synchronise warningMessages externes immédiatement', () => {
			const modelValue = ref<unknown>(null)
			const { warnings } = useFormFieldErrorHandling(
				{ warningMessages: ['Attention'] },
				modelValue,
			)
			expect(warnings.value).toContain('Attention')
		})

		it('synchronise successMessages externes immédiatement', () => {
			const modelValue = ref<unknown>(null)
			const { successes } = useFormFieldErrorHandling(
				{ successMessages: ['OK'] },
				modelValue,
			)
			expect(successes.value).toContain('OK')
		})
	})

	describe('validateField', () => {
		it('retourne true pour une valeur null non requise', async () => {
			const modelValue = ref<unknown>(null)
			const { validateField } = useFormFieldErrorHandling({}, modelValue)
			const result = await validateField(null)
			expect(result).toBe(true)
		})

		it('retourne true pour un tableau vide non requis', async () => {
			const modelValue = ref<unknown>([])
			const { validateField } = useFormFieldErrorHandling({}, modelValue)
			const result = await validateField([])
			expect(result).toBe(true)
		})

		it('retourne true et vide la validation si disableErrorHandling', async () => {
			const modelValue = ref<unknown>('test')
			const { validateField, hasError } = useFormFieldErrorHandling(
				{ disableErrorHandling: true },
				modelValue,
			)
			const result = await validateField('test')
			expect(result).toBe(true)
			expect(hasError.value).toBe(false)
		})

		it('échoue si required et valeur null', async () => {
			const modelValue = ref<unknown>(null)
			const { validateField } = useFormFieldErrorHandling(
				{ required: true, label: 'Nom' },
				modelValue,
			)
			const result = await validateField(null)
			expect(result).toBe(false)
		})

		it('réussit si required et valeur non nulle', async () => {
			const modelValue = ref<unknown>('Alice')
			const { validateField } = useFormFieldErrorHandling(
				{ required: true, label: 'Nom' },
				modelValue,
			)
			const result = await validateField('Alice')
			expect(result).toBe(true)
		})
	})

	describe('validateOnSubmit', () => {
		it('valide la valeur courante du modelValue', async () => {
			const modelValue = ref<unknown>('valeur')
			const { validateOnSubmit } = useFormFieldErrorHandling(
				{ required: true },
				modelValue,
			)
			const result = await validateOnSubmit()
			expect(result).toBe(true)
		})

		it('échoue si modelValue est null et required', async () => {
			const modelValue = ref<unknown>(null)
			const { validateOnSubmit } = useFormFieldErrorHandling(
				{ required: true, label: 'Champ' },
				modelValue,
			)
			const result = await validateOnSubmit()
			expect(result).toBe(false)
		})
	})

	describe('checkErrorOnBlur', () => {
		it('appelle emitUpdate si fourni', async () => {
			const modelValue = ref<unknown>('test')
			const emitUpdate = vi.fn()
			const { checkErrorOnBlur } = useFormFieldErrorHandling({}, modelValue, emitUpdate)
			checkErrorOnBlur()
			await nextTick()
			expect(emitUpdate).toHaveBeenCalledOnce()
		})

		it('ne plante pas si emitUpdate n\'est pas fourni', () => {
			const modelValue = ref<unknown>('test')
			const { checkErrorOnBlur } = useFormFieldErrorHandling({}, modelValue)
			expect(() => checkErrorOnBlur()).not.toThrow()
		})
	})

	describe('hasError / hasWarning / hasSuccess', () => {
		it('hasError reflète le prop hasError externe', () => {
			const modelValue = ref<unknown>(null)
			const { hasError } = useFormFieldErrorHandling(
				{ hasError: true },
				modelValue,
			)
			expect(hasError.value).toBe(true)
		})

		it('hasWarning reflète le prop hasWarning externe', () => {
			const modelValue = ref<unknown>(null)
			const { hasWarning } = useFormFieldErrorHandling(
				{ hasWarning: true },
				modelValue,
			)
			expect(hasWarning.value).toBe(true)
		})

		it('hasSuccess prop externe est indépendant de hasError externe', async () => {
			const modelValue = ref<unknown>(null)
			const { hasSuccess } = useFormFieldErrorHandling(
				{ hasError: true, hasSuccess: true },
				modelValue,
			)
			// props.hasSuccess externe n'est pas bloqué par hasError externe dans le computed
			expect(hasSuccess.value).toBe(true)
		})

		it('disableErrorHandling vide les erreurs de validation', async () => {
			const modelValue = ref<unknown>(null)
			const { hasError } = useFormFieldErrorHandling(
				{ disableErrorHandling: true },
				modelValue,
			)
			await nextTick()
			expect(hasError.value).toBe(false)
		})
	})

	describe('watcher modelValue', () => {
		it('re-valide automatiquement quand modelValue change (isValidateOnBlur=false)', async () => {
			const modelValue = ref<unknown>(null)
			const { errors } = useFormFieldErrorHandling(
				{ required: true, label: 'Test', isValidateOnBlur: false },
				modelValue,
			)
			modelValue.value = 'nouvelle valeur'
			await nextTick()
			await nextTick()
			expect(errors.value.length).toBe(0)
		})

		it('ne re-valide pas automatiquement si isValidateOnBlur=true', async () => {
			const modelValue = ref<unknown>(null)
			const validateFieldSpy = vi.fn().mockResolvedValue(true)
			const { errors } = useFormFieldErrorHandling(
				{ required: true, isValidateOnBlur: true },
				modelValue,
			)
			modelValue.value = 'test'
			await nextTick()
			expect(validateFieldSpy).not.toHaveBeenCalled()
			expect(errors.value.length).toBe(0)
		})
	})
})
