<script lang="ts" setup>
	import { vMaska } from 'maska/vue'
	import { computed } from 'vue'
	import SyTextField from '../Customs/SyTextField/SyTextField.vue'
	import { useLunarCalendarValidation } from './useLunarCalendarValidation'

	const model = defineModel<string>()
	const mask = '##/##/####'

	const props = defineProps<{
		label?: string
		successMessages?: string
		maxYear?: number
		minYear?: number
	}>()

	const validation = useLunarCalendarValidation(
		computed(() => model.value),
		computed(() => props.label),
		computed(() => props.successMessages),
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
		@blur="validation.validate()"
	/>
</template>
