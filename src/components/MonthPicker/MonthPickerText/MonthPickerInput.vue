<script setup lang="ts">
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import { mdiCalendar } from '@mdi/js'
	import { vMaska } from 'maska/vue'
	import { inject, ref, watch } from 'vue'
	import { locales as defaultLocales, localesKey } from '../locales'
	import type { TextFieldProps } from './useTextField'
	import { useTextField } from './useTextField'

	const props = defineProps<{
		modelValue: string | undefined
	} & TextFieldProps>()

	const emits = defineEmits<{
		(e: 'update:modelValue', value: string | undefined): void
	}>()

	const locales = inject<typeof defaultLocales>(localesKey)!

	const mask = '##/####'

	const innerValue = ref<string | undefined>(undefined)
	watch(
		() => props.modelValue,
		(newValue) => {
			innerValue.value = newValue
		},
		{ immediate: true },
	)

	watch(innerValue, (newValue, oldValue) => {
		if (newValue !== oldValue) {
			emits('update:modelValue', newValue)
		}
	})

	const toggleBtn = ref<HTMLButtonElement | null>(null)
	defineExpose({
		toggleBtn,
	})
</script>

<template>
	<SyTextField
		v-model="innerValue"
		v-maska="mask"
		show-success-messages
		disable-error-handling
		v-bind="useTextField(props).value"
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
</style>
