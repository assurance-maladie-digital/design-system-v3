<template>
	<SyTextField
		:model-value="inputValue"
		:placeholder="placeholder"
		:error-messages="errorMessages"
		:warning-messages="warningMessages"
		:success-messages="successMessages"
		:has-error="hasError"
		:has-warning="hasWarning"
		:has-success="hasSuccess"
		:required="required"
		@update:model-value="handleInput"
		@blur="handleBlur"
	/>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import SyTextField from '../Customs/SyTextField/SyTextField.vue'
import { useFieldValidation } from '@/composables/rules/useFieldValidation'
import type { RuleOptions } from '@/composables/rules/useFieldValidation'

// Types
type DateValue = string | [string, string]

interface Props {
	modelValue?: DateValue
	placeholder?: string
	required?: boolean
	range?: boolean
	rules?: { type: string, options: RuleOptions }[]
	warningRules?: { type: string, options: RuleOptions }[]
}

const props = withDefaults(defineProps<Props>(), {
	modelValue: undefined,
	placeholder: '',
	required: false,
	range: false,
	rules: () => [],
	warningRules: () => [],
})

const emit = defineEmits<{
	(e: 'update:model-value', value: DateValue): void
}>()

// État local
const inputValue = ref('')
const errorMessages = ref<string[]>([])
const warningMessages = ref<string[]>([])
const successMessages = ref<string[]>([])
const hasError = ref(false)
const hasWarning = ref(false)
const hasSuccess = ref(false)

// Validation setup
const { generateRules } = useFieldValidation()

// Règles de validation
const defaultRules = computed(() => {
    // Règle de base selon le type (date simple ou range)
    const baseRule = {
        type: props.range ? 'dateRange' : 'dateFormat',
        options: {
            message: props.range ? 'Format invalide (JJ/MM/AAAA - JJ/MM/AAAA)' : 'Format invalide (JJ/MM/AAAA)'
        }
    }

    // Combiner avec les règles personnalisées
    return [baseRule, ...(props.rules || [])]
})

const validationRules = computed(() => generateRules(defaultRules.value))
const warningValidationRules = computed(() => generateRules(props.warningRules))

// Validation
const validateField = () => {
	// Réinitialiser les messages
	errorMessages.value = []
	warningMessages.value = []
	successMessages.value = []
	hasError.value = false
	hasWarning.value = false
	hasSuccess.value = false

	// Vérifier si le champ est requis
	if (props.required && !inputValue.value) {
		errorMessages.value = ['Ce champ est requis']
		hasError.value = true
		return
	}

	if (!inputValue.value) return

	// Appliquer les règles de validation
	for (const rule of validationRules.value) {
		const result = rule(inputValue.value)
		if (result.error) {
			errorMessages.value.push(result.error)
		}
		if (result.success) {
			successMessages.value.push(result.success)
		}
	}

	// Appliquer les règles d'avertissement
	for (const rule of warningValidationRules.value) {
		const result = rule(inputValue.value)
		if (result.warning) {
			warningMessages.value.push(result.warning)
		}
	}

	// Mettre à jour les états
	hasError.value = errorMessages.value.length > 0
	hasWarning.value = warningMessages.value.length > 0
	hasSuccess.value = successMessages.value.length > 0 && !hasError.value && !hasWarning.value
}

// Formatage de la date pendant la saisie
const formatDateInput = (value: string): string => {
	// Garder uniquement les chiffres
	const numbers = value.replace(/\D/g, '')
	
	// Format: DD/MM/YYYY
	if (numbers.length <= 2) return numbers
	if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`
	return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`
}

// Gestion de la saisie
const handleInput = (value: string) => {
	if (!value) {
		inputValue.value = ''
		emit('update:model-value', props.range ? ['', ''] : '')
		validateField()
		return
	}

	if (props.range) {
		// Gestion du range
		const [start, end] = value.split('-').map(d => d?.trim() || '')
		
		// Formater la première date
		let formattedValue = formatDateInput(start)
		
		// Si la première date est complète (10 caractères) et qu'il n'y a pas encore de tiret
		if (start.length >= 10 && !value.includes('-')) {
			formattedValue += ' - '
		}
		
		// Si on a un tiret, formater aussi la deuxième date
		if (value.includes('-')) {
			formattedValue = `${formatDateInput(start)} - ${formatDateInput(end)}`
		}

		inputValue.value = formattedValue
		
		// Valider et émettre si les deux dates sont complètes
		if (formattedValue.includes(' - ') && formattedValue.length === 23) {
			validateField()
			if (!hasError.value) {
				const [startDate, endDate] = formattedValue.split(' - ')
				emit('update:model-value', [startDate, endDate])
			}
		}
	} else {
		// Gestion d'une date simple
		const formattedValue = formatDateInput(value)
		inputValue.value = formattedValue
		
		// Valider et émettre si la date est complète
		if (formattedValue.length === 10) {
			validateField()
			if (!hasError.value) {
				emit('update:model-value', formattedValue)
			}
		}
	}
}

// Gestion du blur
const handleBlur = () => {
	validateField()
}

// Initialisation et synchronisation avec modelValue
watch(() => props.modelValue, (newValue) => {
	if (!newValue) {
		inputValue.value = ''
		return
	}

	if (Array.isArray(newValue)) {
		inputValue.value = newValue.map(d => d || '').join(' - ')
	} else {
		inputValue.value = newValue
	}
	validateField()
}, { immediate: true })

// Exposer la méthode de validation
const validateOnSubmit = () => {
	validateField()
	return !hasError.value
}

defineExpose({
	validateOnSubmit
})
</script>
