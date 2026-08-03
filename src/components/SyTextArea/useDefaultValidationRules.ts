import { computed, type Ref } from 'vue'
import { locales as defaultLocales } from './locales'
import type { ValidationRule as SyValidationRule } from '@/composables/validation/useValidation'

export type TextareaRule = (value: string) => boolean | string

export function useDefaultValidationRules(params: {
	required: Ref<boolean>
	maxLines: Ref<number | undefined>
	hasInteracted: Ref<boolean>
	locales: Ref<typeof defaultLocales>
}) {
	const vuetifyRules = computed<TextareaRule[]>(() => {
		const rules: TextareaRule[] = []

		rules.push((value: string) => {
			if (params.required.value && params.hasInteracted.value && !value) {
				return params.locales.value.required
			}
			return true
		})

		rules.push((value: string) => {
			if (params.maxLines.value === undefined) {
				return true
			}

			const lines = value.split('\n').length
			if (lines > params.maxLines.value) {
				return params.locales.value.maxLines(params.maxLines.value)
			}

			return true
		})

		return rules
	})

	const customRules = computed<SyValidationRule[]>(() => {
		const rules: SyValidationRule[] = []

		if (params.required.value) {
			rules.push({
				type: 'required',
				options: {
					message: params.locales.value.required,
				},
			})
		}

		if (params.maxLines.value !== undefined) {
			rules.push({
				type: 'custom',
				options: {
					validate: (value: string) => {
						const lines = value.split('\n').length
						return lines <= params.maxLines.value! || params.locales.value.maxLines(params.maxLines.value!)
					},
				},
			})
		}

		return rules
	})

	return {
		vuetifyRules,
		customRules,
	}
}
