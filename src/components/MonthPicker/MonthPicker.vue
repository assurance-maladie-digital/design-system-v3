<script lang="ts" setup>
	import { computed, provide, ref, useAttrs, type ComponentPublicInstance } from 'vue'
	import MonthPickerInput from './MonthPickerInput.vue'
	import MonthPickerVisual from './MonthPickerVisual/MonthPickerVisual.vue'
	import { watch } from 'vue'
	import { locales as defaultLocales, localesKey } from './locales'

	const props = withDefaults(defineProps<{
		modelValue: string | undefined
		label: string
		locales?: typeof defaultLocales
		minYear?: number
		maxYear?: number
	}>(), {
		locales: () => defaultLocales,
		minYear: 1900,
		maxYear: 2100,
	})

	provide(localesKey, computed(() => props.locales))

	const emits = defineEmits<{
		(e: 'update:modelValue', value: string | undefined): void
		(e: 'update:open', value: boolean): void
	}>()

	const attrs = useAttrs()
	const textInput = ref<ComponentPublicInstance<typeof MonthPickerInput> | null>(null)
	const toggleBtn = computed(() => textInput.value?.toggleBtn)

	const internalValue = ref<string | undefined>(undefined)

	watch(
		() => props.modelValue,
		(newValue) => {
			internalValue.value = newValue
		},
		{ immediate: true },
	)

	watch(internalValue, (newValue, oldValue) => {
		if (newValue !== oldValue) {
			emits('update:modelValue', newValue)
		}
	})
</script>

<template>
	<div class="month-picker">
		<MonthPickerInput
			ref="textInput"
			v-model="internalValue"
			:label
			v-bind="attrs"
		/>
		<MonthPickerVisual
			v-model="internalValue"
			:text-input="textInput"
			:toggle-btn="toggleBtn"
			:min-year
			:max-year
			@update:open="emits('update:open', $event)"
		/>
	</div>
</template>
