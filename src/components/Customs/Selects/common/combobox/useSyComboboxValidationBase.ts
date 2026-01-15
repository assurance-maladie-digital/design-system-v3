import { computed, type ComputedRef, type Ref } from 'vue'

export interface UseSyComboboxHasSelectionOptions {
	selectedItem: Ref<unknown>
	multiple?: Ref<boolean>
}

export function useSyComboboxHasSelection(options: UseSyComboboxHasSelectionOptions) {
	const hasSelection = computed(() => {
		const value = options.selectedItem.value
		if (options.multiple?.value) {
			return Array.isArray(value) && value.length > 0
		}
		if (Array.isArray(value)) {
			return value.length > 0
		}
		return Boolean(value)
	})

	return { hasSelection }
}

export interface UseSyComboboxIsRequiredOptions {
	required: Ref<boolean>
	errorMessages: Ref<readonly string[]>
	disableErrorHandling: Ref<boolean>
	readonly: Ref<boolean>
	hasSelection: ComputedRef<boolean>
}

export function useSyComboboxIsRequired(options: UseSyComboboxIsRequiredOptions) {
	const isRequired = computed(() => {
		if (options.disableErrorHandling.value) return false
		if (options.readonly.value) return false
		return (options.required.value || options.errorMessages.value.length > 0) && !options.hasSelection.value
	})

	return { isRequired }
}

export interface UseSyComboboxValidateOnSubmitOptions {
	readonly: Ref<boolean>
	disableErrorHandling: Ref<boolean>
	errorMessages: Ref<readonly string[]>
	isRequired: ComputedRef<boolean>
	setHasError: (value: boolean) => void
}

export function useSyComboboxValidateOnSubmit(options: UseSyComboboxValidateOnSubmitOptions) {
	const validateOnSubmit = (): boolean => {
		if (options.readonly.value || options.disableErrorHandling.value) {
			return true
		}

		const isValid = !options.isRequired.value
		options.setHasError(!isValid || options.errorMessages.value.length > 0)
		return isValid
	}

	return { validateOnSubmit }
}
