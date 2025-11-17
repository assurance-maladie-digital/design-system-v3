<script setup lang="ts">
	import { ref, watch } from 'vue'
	import SyTextField from '../Customs/SyTextField/SyTextField.vue'
	import type { locales as defaultLocales } from './locales'

	interface Props {
		label: string
		modelValue?: string | null
		state?: string | null
		loading?: boolean
		errors: string[] | undefined
		success: boolean
		locales: typeof defaultLocales
	}

	const props = defineProps<Props>()
	const emit = defineEmits(['update:modelValue'])

	const text = ref<string | null>(props.modelValue ?? null)

	watch(() => props.modelValue, (newVal) => {
		text.value = newVal ?? null
	}, { immediate: true })

	function emitChangeEvent() {
		emit('update:modelValue', text.value)
	}
</script>

<template>
	<VSheet>
		<SyTextField
			v-model="text"
			class="mt-4"
			variant="outlined"
			:error-messages="props.errors"
			:custom-rules="[
				{
					type: 'required',
					options: { message: locales.required },
				}
			]"
			:show-success-messages="false"
			:has-success="success"
			:disabled="state === 'rejected'"
			:label="label"
			hide-details="auto"
			:readonly="success"
			:is-clearable="!success"
			@update:model-value="emitChangeEvent"
		/>
	</VSheet>
</template>
<style lang="scss" scoped>
:deep(.v-input__control:not(:has(.v-field--error))+.v-input__details) {
	display: none;
}
</style>
