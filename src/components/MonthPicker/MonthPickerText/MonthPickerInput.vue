<script setup lang="ts">
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import { mdiCalendar } from '@mdi/js'
	import { vMaska } from 'maska/vue'
	import { nextTick, inject, ref, watch } from 'vue'
	import { locales as defaultLocales, localesKey } from '../locales'
	import type { TextFieldProps } from './useTextField'
	import { useTextField } from './useTextField'
	import { useMonthPickerValidation, type ValidationProps } from '../useMonthPickerValidation'

	const props = defineProps<{
		modelValue: string | undefined
	} & TextFieldProps & ValidationProps>()

	const emits = defineEmits<{
		(e: 'update:modelValue', value: string | undefined): void
	}>()

	const locales = inject<typeof defaultLocales>(localesKey)!
	const input = ref<InstanceType<typeof SyTextField>>()

	const mask = '##/####'

	const innerValue = ref<string | undefined>(props.modelValue)
	watch(
		() => props.modelValue,
		async (newValue) => {
			const shouldValidate = newValue !== innerValue.value
			innerValue.value = newValue
			if (shouldValidate) {
				await nextTick()
				input.value?.validateOnSubmit()
			}
		},
	)

	watch(innerValue, async (newValue) => {
		if (newValue?.length === mask.length) {
			await nextTick()
			input.value?.validateOnSubmit()
		}

		emits('update:modelValue', newValue)
	})

	const toggleBtn = ref<HTMLButtonElement | null>(null)
	defineExpose({
		toggleBtn,
	})
</script>

<template>
	<SyTextField
		ref="input"
		v-model="innerValue"
		v-maska="mask"
		v-bind="{
			...useTextField(props).value,
			...useMonthPickerValidation(props).value
		}"
	>
		<template #append>
			<button
				ref="toggleBtn"
				type="button"
				class="month-picker-input__toggle-btn"
				:title="locales.btnLabel"
				:aria-label="locales.btnLabel"
			>
				<SyIcon
					:icon="mdiCalendar"
					decorative
				/>
			</button>
		</template>
	</SyTextField>
</template>

<style scoped lang="scss">
.error-field .month-picker-input__toggle-btn :deep(svg) {
	color: rgb(var(--v-theme-feedbackError, 179, 63, 46));
}

.warning-field .month-picker-input__toggle-btn :deep(svg) {
	color: rgb(var(--v-theme-feedbackSuccessVariant, 96, 72, 14));
}

</style>
