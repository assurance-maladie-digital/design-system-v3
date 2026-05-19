import { describe, it, expect, vi } from 'vitest'
import { ref, nextTick, defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { useFormFieldErrorHandling } from '../useFormFieldErrorHandling'

function withSetup<T>(
	composable: () => T,
): { result: T, unmount: () => void } {
	let result!: T
	const Component = defineComponent({
		setup() {
			result = composable()
			return {}
		},
		template: '<div />',
	})
	const wrapper = mount(Component)
	return { result, unmount: () => wrapper.unmount() }
}

describe('useFormFieldErrorHandling', () => {
	describe('initialisation', () => {
		it('retourne les champs attendus', () => {
			const modelValue = ref<unknown>(null)
			const { result, unmount } = withSetup(() => useFormFieldErrorHandling({}, modelValue))

			expect(result).toHaveProperty('validateField')
			expect(result).toHaveProperty('validateOnSubmit')
			expect(result).toHaveProperty('checkErrorOnBlur')
			expect(result).toHaveProperty('hasError')
			expect(result).toHaveProperty('hasWarning')
			expect(result).toHaveProperty('hasSuccess')
			expect(result).toHaveProperty('errors')
			expect(result).toHaveProperty('warnings')
			expect(result).toHaveProperty('successes')
			unmount()
		})

		it('synchronise errorMessages externes immédiatement', () => {
			const modelValue = ref<unknown>(null)
			const { result, unmount } = withSetup(() => useFormFieldErrorHandling(
				{ errorMessages: ['Erreur externe'] },
				modelValue,
			))
			expect(result.errors.value).toContain('Erreur externe')
			unmount()
		})

		it('synchronise warningMessages externes immédiatement', () => {
			const modelValue = ref<unknown>(null)
			const { result, unmount } = withSetup(() => useFormFieldErrorHandling(
				{ warningMessages: ['Attention'] },
				modelValue,
			))
			expect(result.warnings.value).toContain('Attention')
			unmount()
		})

		it('synchronise successMessages externes immédiatement', () => {
			const modelValue = ref<unknown>(null)
			const { result, unmount } = withSetup(() => useFormFieldErrorHandling(
				{ successMessages: ['OK'] },
				modelValue,
			))
			expect(result.successes.value).toContain('OK')
			unmount()
		})
	})

	describe('validateField', () => {
		it('retourne true pour une valeur null non requise', async () => {
			const modelValue = ref<unknown>(null)
			const { result, unmount } = withSetup(() => useFormFieldErrorHandling({}, modelValue))
			const res = await result.validateField(null)
			expect(res).toBe(true)
			unmount()
		})

		it('retourne true pour un tableau vide non requis', async () => {
			const modelValue = ref<unknown>([])
			const { result, unmount } = withSetup(() => useFormFieldErrorHandling({}, modelValue))
			const res = await result.validateField([])
			expect(res).toBe(true)
			unmount()
		})

		it('retourne true et vide la validation si disableErrorHandling', async () => {
			const modelValue = ref<unknown>('test')
			const { result, unmount } = withSetup(() => useFormFieldErrorHandling(
				{ disableErrorHandling: true },
				modelValue,
			))
			const res = await result.validateField('test')
			expect(res).toBe(true)
			expect(result.hasError.value).toBe(false)
			unmount()
		})

		it('échoue si required et valeur null', async () => {
			const modelValue = ref<unknown>(null)
			const { result, unmount } = withSetup(() => useFormFieldErrorHandling(
				{ required: true, label: 'Nom' },
				modelValue,
			))
			const res = await result.validateField(null)
			expect(res).toBe(false)
			unmount()
		})

		it('réussit si required et valeur non nulle', async () => {
			const modelValue = ref<unknown>('Alice')
			const { result, unmount } = withSetup(() => useFormFieldErrorHandling(
				{ required: true, label: 'Nom' },
				modelValue,
			))
			const res = await result.validateField('Alice')
			expect(res).toBe(true)
			unmount()
		})
	})

	describe('validateOnSubmit', () => {
		it('valide la valeur courante du modelValue', async () => {
			const modelValue = ref<unknown>('valeur')
			const { result, unmount } = withSetup(() => useFormFieldErrorHandling(
				{ required: true },
				modelValue,
			))
			const res = await result.validateOnSubmit()
			expect(res).toBe(true)
			unmount()
		})

		it('échoue si modelValue est null et required', async () => {
			const modelValue = ref<unknown>(null)
			const { result, unmount } = withSetup(() => useFormFieldErrorHandling(
				{ required: true, label: 'Champ' },
				modelValue,
			))
			const res = await result.validateOnSubmit()
			expect(res).toBe(false)
			unmount()
		})
	})

	describe('checkErrorOnBlur', () => {
		it('appelle emitUpdate si fourni', async () => {
			const modelValue = ref<unknown>('test')
			const emitUpdate = vi.fn()
			const { result, unmount } = withSetup(() => useFormFieldErrorHandling({}, modelValue, emitUpdate))
			result.checkErrorOnBlur()
			await nextTick()
			expect(emitUpdate).toHaveBeenCalledOnce()
			unmount()
		})

		it('ne plante pas si emitUpdate n\'est pas fourni', () => {
			const modelValue = ref<unknown>('test')
			const { result, unmount } = withSetup(() => useFormFieldErrorHandling({}, modelValue))
			expect(() => result.checkErrorOnBlur()).not.toThrow()
			unmount()
		})
	})

	describe('hasError / hasWarning / hasSuccess', () => {
		it('hasError reflète le prop hasError externe', () => {
			const modelValue = ref<unknown>(null)
			const { result, unmount } = withSetup(() => useFormFieldErrorHandling(
				{ hasError: true },
				modelValue,
			))
			expect(result.hasError.value).toBe(true)
			unmount()
		})

		it('hasWarning reflète le prop hasWarning externe', () => {
			const modelValue = ref<unknown>(null)
			const { result, unmount } = withSetup(() => useFormFieldErrorHandling(
				{ hasWarning: true },
				modelValue,
			))
			expect(result.hasWarning.value).toBe(true)
			unmount()
		})

		it('hasSuccess prop externe est indépendant de hasError externe', async () => {
			const modelValue = ref<unknown>(null)
			const { result, unmount } = withSetup(() => useFormFieldErrorHandling(
				{ hasError: true, hasSuccess: true },
				modelValue,
			))
			expect(result.hasSuccess.value).toBe(true)
			unmount()
		})

		it('disableErrorHandling vide les erreurs de validation', async () => {
			const modelValue = ref<unknown>(null)
			const { result, unmount } = withSetup(() => useFormFieldErrorHandling(
				{ disableErrorHandling: true },
				modelValue,
			))
			await nextTick()
			expect(result.hasError.value).toBe(false)
			unmount()
		})
	})

	describe('watcher modelValue', () => {
		it('re-valide automatiquement quand modelValue change (isValidateOnBlur=false)', async () => {
			const modelValue = ref<unknown>(null)
			const { result, unmount } = withSetup(() => useFormFieldErrorHandling(
				{ required: true, label: 'Test', isValidateOnBlur: false },
				modelValue,
			))
			modelValue.value = 'nouvelle valeur'
			await nextTick()
			await nextTick()
			expect(result.errors.value.length).toBe(0)
			unmount()
		})

		it('ne re-valide pas automatiquement si isValidateOnBlur=true', async () => {
			const modelValue = ref<unknown>(null)
			const { result, unmount } = withSetup(() => useFormFieldErrorHandling(
				{ required: true, isValidateOnBlur: true },
				modelValue,
			))
			modelValue.value = 'test'
			await nextTick()
			expect(result.errors.value.length).toBe(0)
			unmount()
		})
	})
})
