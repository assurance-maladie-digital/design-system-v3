<script setup lang="ts">
	import { vMaska } from 'maska/vue'
	import { inject, ref, watch } from 'vue'
	import SyTextField from '../Customs/SyTextField/SyTextField.vue'
	import SyIcon from '../Customs/SyIcon/SyIcon.vue'
	import { mdiCalendar } from '@mdi/js'
	import { localesKey } from './locales'
	import { locales as defaultLocales } from './locales'

	const props = defineProps<{
		modelValue: string | undefined
	}>()

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
		:help-text="locales.hint"
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
