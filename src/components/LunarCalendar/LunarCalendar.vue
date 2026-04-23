<script lang="ts" setup>
	import { vMaska } from 'maska/vue'
	import { computed } from 'vue'
	import SyTextField from '../Customs/SyTextField/SyTextField.vue'
	import { useLunarCalendarValidation } from './useLunarCalendarValidation'

	const model = defineModel<string>()
	const mask = '##/##/####'

	const props = withDefaults(defineProps<{
		label: string
		successMessages?: string
		errorMessages?: string | string[]
		warningMessages?: string | string[]
		required?: boolean
		maxYear?: number
		minYear?: number
		placeholder?: string
		isClearable?: boolean
		displayPrependIcon?: boolean
		displayAppendIcon?: boolean
	}>(), {
		successMessages: undefined,
		errorMessages: undefined,
		warningMessages: undefined,
		required: false,
		maxYear: undefined,
		minYear: undefined,
		placeholder: undefined,
		isClearable: false,
		displayAppendIcon: false,
		displayPrependIcon: true,
	})

	const validation = useLunarCalendarValidation(
		computed(() => model.value),
		computed(() => props.label),
		computed(() => props.successMessages),
		computed(() => props.required),
		computed(() => props.minYear),
		computed(() => props.maxYear),
	)

</script>

<template>
	<SyTextField
		v-model="model"
		v-maska="mask"
		:label="props.label"
		:error-messages="props.errorMessages?.length ? (Array.isArray(props.errorMessages) ? props.errorMessages : [props.errorMessages]) : validation.errors.value"
		:warning-messages="props.warningMessages?.length ? (Array.isArray(props.warningMessages) ? props.warningMessages : [props.warningMessages]) : undefined"
		:show-success-messages="props.successMessages !== undefined"
		:success-messages="props.successMessages && !validation.hasError.value ? [props.successMessages] : validation.successes.value"
		:has-success="props.successMessages ? !validation.hasError.value : validation.successes.value.length > 0"
		:placeholder
		:is-clearable
		:append-icon="props.displayAppendIcon ? 'calendar' : undefined"
		:prepend-icon="props.displayPrependIcon ? 'calendar' : undefined"
		@blur="validation.validate()"
	/>
</template>
