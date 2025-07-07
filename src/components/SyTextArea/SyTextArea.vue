<script setup lang="ts">
	import { computed, ref, toRef, watch } from 'vue'
	import type { VTextarea } from 'vuetify/components'
	import { locales } from './locales'
	import useTextActions from './useTextActions'

	type Rule = (value: string) => boolean | string

	const props = withDefaults(defineProps<{
		modelValue?: string
		trim?: boolean
		replaceTabs?: number
		rules?: Array<Rule>
		maxLines?: number
		autoWrap?: number
		normalize?: boolean
		validateOn?: VTextarea['validateOn']
		variant?: VTextarea['variant']
		color?: string
		label: string
		bgColor?: string
	}>(), {
		modelValue: '',
		trim: false,
		replaceTabs: undefined,
		rules: () => [],
		maxLines: undefined,
		autoWrap: undefined,
		normalize: false,
		validateOn: 'eager input',
		variant: 'outlined',
		color: 'primary',
		bgColor: 'white',
	})

	const emits = defineEmits<{
		(e: 'update:modelValue', value: string): void
	}>()

	const textAreaRef = ref<VTextarea | null>(null)

	const internalValue = ref(props.modelValue)
	watch(
		() => props.modelValue,
		(newValue) => {
			if (newValue !== internalValue.value) {
				execValueChange(newValue)
				execBlurChange()
			}
		},
	)
	watch(
		internalValue,
		(newValue, oldValue) => {
			if (newValue !== oldValue) {
				emits('update:modelValue', newValue)
			}
		},
	)

	const { changeActions, blurActions } = useTextActions(textAreaRef, {
		trim: toRef(props, 'trim'),
		replaceTabs: toRef(props, 'replaceTabs'),
		autoWrap: toRef(props, 'autoWrap'),
		normalize: toRef(props, 'normalize'),
	})

	function execValueChange(value: string) {
		changeActions.value.forEach((action) => {
			value = action(value)
		})

		if (value !== internalValue.value) {
			internalValue.value = value
		}
	}

	function execBlurChange() {
		let value = internalValue.value
		blurActions.value.forEach((action) => {
			value = action(value)
		})
		internalValue.value = value
	}

	const internalRules = computed<Rule[]>(() => {
		const internalRules: Rule[] = []

		internalRules.push((value: string) => {
			const lines = value.split('\n').length
			if (lines > (props.maxLines as number)) {
				return locales.maxLines(props.maxLines as number)
			}
			return true
		})

		return internalRules
	})

</script>

<template>
	<VTextarea
		ref="textAreaRef"
		:model-value="internalValue"
		:variant="variant"
		:color="color"
		:bg-color="props.bgColor"
		:validate-on="validateOn"
		:rules="[...props.rules, ...internalRules]"
		:label="label"
		:aria-label="label"
		@update:model-value="execValueChange"
		@update:focused="(e: boolean) => !e ? execBlurChange() : null"
	/>
</template>
