import { computed } from 'vue'
import { useValidatable } from './useValidatable'

interface ValidationModeProps {
	useVuetifyValidation?: boolean
}

export function useValidationMode(props: ValidationModeProps) {
	const isVuetifyMode = computed(() => Boolean(props.useVuetifyValidation))
	const isDsMode = computed(() => !isVuetifyMode.value)

	const registerValidatableInMode = (
		validateMethod: () => Promise<boolean> | boolean,
		clearValidation?: () => void,
		reset?: () => void,
	) => {
		if (!isDsMode.value) return
		useValidatable(validateMethod, clearValidation, reset)
	}

	return {
		isVuetifyMode,
		isDsMode,
		registerValidatableInMode,
	}
}
