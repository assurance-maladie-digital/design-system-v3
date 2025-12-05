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
		required?: boolean
		maxYear?: number
		minYear?: number
		placeholder?: string
		isClearable?: boolean
		displayPrependIcon?: boolean
		displayAppendIcon?: boolean
	}>(), {
		successMessages: undefined,
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
		:error-messages="validation.errors.value"
		:show-success-messages="props.successMessages !== undefined"
		:success-messages="validation.successes.value"
		:has-success="validation.successes.value.length > 0"
		:placeholder
		:is-clearable
		:append-icon="props.displayAppendIcon ? 'calendar' : undefined"
		:prepend-icon="props.displayPrependIcon ? 'calendar' : undefined"
		@blur="validation.validate()"
	/>
</template>
