import { describe, it, expect } from 'vitest'
import { defineComponent, ref, nextTick, type Ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useSyCheckboxValidation, type UseSyCheckboxValidationReturn } from '../composables/useSyCheckboxValidation'
import type { SyCheckboxValidationProps } from '../types'

function createProps(overrides: Partial<SyCheckboxValidationProps> = {}): SyCheckboxValidationProps {
	return {
		label: 'Conditions générales',
		required: false,
		readonly: false,
		disabled: false,
		customRules: [],
		customWarningRules: [],
		customSuccessRules: [],
		errorMessages: null,
		warningMessages: null,
		successMessages: null,
		showSuccessMessages: false,
		isValidateOnBlur: false,
		...overrides,
	}
}

// Exécute le composable dans un contexte de setup (requis par les composables Vuetify internes)
function withValidation(props: SyCheckboxValidationProps, model: Ref<boolean | null>): UseSyCheckboxValidationReturn {
	let result!: UseSyCheckboxValidationReturn
	const Harness = defineComponent({
		setup() {
			result = useSyCheckboxValidation(props, model)
			return () => null
		},
	})
	mount(Harness)
	return result
}

describe('useSyCheckboxValidation', () => {
	describe('required (la case doit être cochée)', () => {
		it('échoue quand la case est décochée', async () => {
			const model = ref<boolean | null>(false)
			const { validate, errors, hasError } = withValidation(createProps({ required: true }), model)

			expect(await validate()).toBe(false)
			await nextTick()
			expect(hasError.value).toBe(true)
			expect(errors.value.join(' ')).toContain('Conditions générales est requis')
		})

		it('réussit quand la case est cochée', async () => {
			const model = ref<boolean | null>(true)
			const { validate, hasError } = withValidation(createProps({ required: true }), model)

			expect(await validate()).toBe(true)
			await nextTick()
			expect(hasError.value).toBeFalsy()
		})
	})

	it('non requis : valide même décochée', async () => {
		const model = ref<boolean | null>(false)
		const { validate, hasError } = withValidation(createProps({ required: false }), model)

		expect(await validate()).toBe(true)
		expect(hasError.value).toBeFalsy()
	})

	it('customRules : la case doit être cochée', async () => {
		const model = ref<boolean | null>(false)
		const { validate, errors } = withValidation(
			createProps({
				customRules: [{
					type: 'custom',
					options: {
						validate: (value: unknown) => value === true,
						message: 'Doit être coché',
					},
				}],
			}),
			model,
		)

		expect(await validate()).toBe(false)
		await nextTick()
		expect(errors.value.join(' ')).toContain('Doit être coché')
	})

	it('disableErrorHandling : ne produit pas d\'erreur', async () => {
		const model = ref<boolean | null>(false)
		const { validate, hasError } = withValidation(
			createProps({ required: true, disableErrorHandling: true }),
			model,
		)

		expect(await validate()).toBe(true)
		expect(hasError.value).toBeFalsy()
	})
})
