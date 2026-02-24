<script setup lang="ts">
	import { computed, inject, ref, watch, type ComponentPublicInstance } from 'vue'
	import MonthSelector from './MonthSelector.vue'
	import YearSelector from './YearSelector.vue'
	import VisualpickerHeader from './VisualPickerHeader.vue'
	import VisualPickerFooter from './VisualPickerFooter.vue'
	import { locales as defaultLocales, localesKey } from '../locales'

	const props = defineProps<{
		textInput: ComponentPublicInstance | null
		toggleBtn: HTMLElement | null
		modelValue: string | undefined
		minYear: number
		maxYear: number
	}>()

	const emits = defineEmits<{
		(e: 'update:modelValue', value: string | undefined): void
		(e: 'update:year', value: number | undefined): void
		(e: 'update:month', value: number | undefined): void
		(e: 'update:open', value: boolean): void
	}>()

	const locales = inject<typeof defaultLocales>(localesKey)!

	const view = ref<'months' | 'years'>('months')
	const open = ref(false)
	watch(open, (newValue) => {
		if (newValue) {
			view.value = 'months'
		}
		else {
			props.toggleBtn!.focus()
		}
		emits('update:open', newValue)
	})

	const year = ref<number | undefined>(undefined)
	const month = ref<number | undefined>(undefined)
	const internalValue = computed(() => {
		if (!year.value || !month.value) return undefined
		return `${String(month.value).padStart(2, '0')}/${year.value}`
	})

	watch([year, month], (newValues, oldValues) => {
		const [newYear, newMonth] = newValues
		const [oldYear, oldMonth] = oldValues

		if (newYear && newMonth && (newYear !== oldYear || newMonth !== oldMonth)) {
			emits('update:modelValue', internalValue.value)
		}
	})

	function setYear(value: number | undefined) {
		year.value = value
		open.value = false
		emits('update:year', year.value)
	}

	function setMonth(value: number | undefined) {
		month.value = value
		view.value = 'years'
		emits('update:month', month.value)
	}

	function setDate(value: string) {
		emits('update:modelValue', value)
		open.value = false
	}

	watch(
		() => props.modelValue,
		(newValue) => {
			if (!newValue) {
				month.value = undefined
				year.value = undefined
				return
			}
			const [monthStr, yearStr] = newValue.split('/')
			month.value = monthStr ? parseInt(monthStr, 10) : undefined
			year.value = yearStr ? parseInt(yearStr, 10) : undefined
		},
		{ immediate: true },
	)
</script>
<template>
	<VMenu
		v-model="open"
		:target="(textInput as ComponentPublicInstance)"
		:activator="(toggleBtn as HTMLElement)"
		:close-on-content-click="false"
		:max-width="328"
		:min-width="328"
		:max-height="455"
		disable-initial-focus
		:retain-focus="false"
	>
		<div class="month-picker-menu">
			<VisualpickerHeader
				v-model:view="view"
				:title="view === 'months' ? locales.headerSelectMonth : locales.headerSelectYear"
				:model-value="internalValue"
				:min-year
				:max-year
			/>
			<YearSelector
				v-if="view === 'years'"
				:model-value="year"
				:min="minYear"
				:max="maxYear"
				@update:model-value="setYear"
			/>
			<MonthSelector
				v-else-if="view === 'months'"
				:model-value="month"
				@update:model-value="setMonth"
			/>
			<VisualPickerFooter
				:model-value="internalValue"
				@update:model-value="setDate"
			/>
		</div>
	</VMenu>
</template>
<style scoped lang="scss">
.month-picker-menu {
	overflow-y: auto;
	background-color: white;
	border-radius: 4px;
	box-shadow:
		0 1px 5px 0 #0000001f,
		0 2px 2px 0 #00000024,
		0 3px 1px -2px #0003;
}
</style>
