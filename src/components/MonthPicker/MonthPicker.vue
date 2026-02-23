<script lang="ts" setup>
	import { computed, ref, useAttrs, type ComponentPublicInstance } from 'vue'
	import MonthPickerInput from './MonthPickerInput.vue'
	import MonthPickerVisual from './MonthPickerVisual/MonthPickerVisual.vue'
	import { watch } from 'vue'

	const props = withDefaults(defineProps<{
		modelValue: string | undefined
		btnLabel?: string
	}>(), {
		btnLabel: 'Ouvrire le selecteur',
	})

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
			:btn-label="props.btnLabel"
			v-bind="attrs"
		/>
		<MonthPickerVisual
			v-model="internalValue"
			:text-input="textInput"
			:toggle-btn="toggleBtn"
			@update:open="emits('update:open', $event)"
		/>
	</div>
</template>
