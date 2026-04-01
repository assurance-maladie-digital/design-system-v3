import { computed, type Ref } from 'vue'
import { locales } from './locales'
import type { ValidationRule as SyValidationRule } from '@/composables/validation/useValidation'

export type TextareaRule = (value: string) => boolean | string

export function useDefaultValidationRules(params: {
	required: Ref<boolean>
	maxLines: Ref<number | undefined>
	hasInteracted: Ref<boolean>
}) {
	const vuetifyRules = computed<TextareaRule[]>(() => {
		const rules: TextareaRule[] = []

		rules.push((value: string) => {
			if (params.required.value && params.hasInteracted.value && !value) {
				return locales.required
			}
			return true
		})

		rules.push((value: string) => {
			if (params.maxLines.value === undefined) {
				return true
			}

			const lines = value.split('\n').length
			if (lines > params.maxLines.value) {
				return locales.maxLines(params.maxLines.value)
			}

			return true
		})

		return rules
	})

	const customRules = computed<SyValidationRule[]>(() => {
		const rules: SyValidationRule[] = []

		if (params.required.value) {
			rules.push({
				type: 'custom',
				options: {
					validate: (value: string) => {
						if (!params.hasInteracted.value) {
							return true
						}
						return !!value || locales.required
					},
				},
			})
		}

		if (params.maxLines.value !== undefined) {
			rules.push({
				type: 'custom',
				options: {
					validate: (value: string) => {
						const lines = value.split('\n').length
						return lines <= params.maxLines.value! || locales.maxLines(params.maxLines.value!)
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
