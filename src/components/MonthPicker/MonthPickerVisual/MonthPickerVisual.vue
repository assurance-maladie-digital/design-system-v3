<script setup lang="ts">
	import { computed, inject, ref, watch, type ComponentPublicInstance } from 'vue'
	import MonthSelector from './MonthSelector.vue'
	import YearSelector from './YearSelector.vue'
	import VisualpickerHeader from './VisualPickerHeader.vue'
	import VisualPickerFooter from './VisualPickerFooter.vue'
	import { locales as defaultLocales, localesKey } from '../locales'
	import { parseMonthYearString } from './utils'

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
			draftMonth.value = undefined
			draftYear.value = undefined
		}
		else {
			props.toggleBtn!.focus()
		}
		emits('update:open', newValue)
	})

	const initValue = computed(() => parseMonthYearString(props.modelValue))
	const draftMonth = ref<number | undefined>(undefined)
	const draftYear = ref<number | undefined>(undefined)

	function setYear(value: number | undefined) {
		draftYear.value = value
		emits('update:year', draftYear.value)
		if (draftMonth.value === undefined) {
			view.value = 'months'
		}
		else {
			open.value = false
		}
	}

	function setMonth(value: number | undefined) {
		draftMonth.value = value
		emits('update:month', draftMonth.value)
		if (draftYear.value === undefined) {
			view.value = 'years'
		}
		else {
			open.value = false
		}
	}

	function setDate(value: string) {
		emits('update:modelValue', value)
		open.value = false
	}

	watch(
		[draftMonth, draftYear],
		() => {
			const oldValue = parseMonthYearString(props.modelValue)
			if (draftMonth.value !== undefined && draftYear.value !== undefined && (draftMonth.value !== oldValue[0] || draftYear.value !== oldValue[1])) {
				emits('update:modelValue', `${String(draftMonth.value).padStart(2, '0')}/${draftYear.value}`)
			}
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
		:activator-props="{'aria-haspopup': 'dialog'}"
	>
		<div class="month-picker-menu">
			<VisualpickerHeader
				v-model:view="view"
				:title="view === 'months' ? locales.headerSelectMonth : locales.headerSelectYear"
				:model-value="modelValue"
				:min-year
				:max-year
			/>
			<YearSelector
				v-if="view === 'years'"
				:model-value="draftYear || initValue[1]"
				:min="minYear"
				:max="maxYear"
				@update:model-value="setYear"
			/>
			<MonthSelector
				v-else-if="view === 'months'"
				:model-value="draftMonth || initValue[0]"
				@update:model-value="setMonth"
			/>
			<VisualPickerFooter
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
