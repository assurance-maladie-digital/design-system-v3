<!-- eslint-disable no-console -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
	import AmeliproAutoCompleteField from '@/components/Amelipro/AmeliproAutoCompleteField/AmeliproAutoCompleteField.vue'
	import type { AutoCompleteItem } from '@/components/Amelipro/AmeliproAutoCompleteField/types'
	import type { ValidateOnType } from '@/components/Amelipro/types'
	import type { ValidationRule } from '@/utils/rules/types'
	import { ref } from 'vue'

	interface IAmeliproAutoCompleteFieldProps {
		ariaRequired?: boolean
		classes?: string
		disabled?: boolean
		globalMaxWidth?: string
		globalMinWidth?: string
		globalWidth?: string
		hideErrorMessage?: boolean | 'auto'
		horizontal?: boolean
		inputMaxWidth?: string
		inputMinWidth?: string
		items?: AutoCompleteItem[]
		label: string
		labelMaxWidth?: string
		labelMinWidth?: string
		modelValue?: string | object
		placeholder?: string
		readonly?: boolean
		rules?: ValidationRule[]
		uniqueId: string
		validateOn?: ValidateOnType
	}

	const ameliproAutoCompleteField = ref<typeof AmeliproAutoCompleteField>()

	const items = (id: string, n: number): AutoCompleteItem[] => new Array(n).fill(null)
		.map((value, index) => ({
			value: `item-${id.toLocaleLowerCase()}${index}`,
			title: `Item ${id.toUpperCase()}${index}`,
		}))

	const valueA = (): IAmeliproAutoCompleteFieldProps => ({
		uniqueId: 'required-unique-id-a',
		label: 'Label A',
	})

	const valueB = (): IAmeliproAutoCompleteFieldProps => ({
		items: items('B', 10),
		label: 'Label B',
		uniqueId: 'required-unique-id-b',
	})

	const valueC = (): IAmeliproAutoCompleteFieldProps => ({
		ariaRequired: true,
		items: items('C', 5),
		label: 'Label C',
		uniqueId: 'required-unique-id-c',
	})

	const dataTest = ref<IAmeliproAutoCompleteFieldProps>(valueA())
	const values: Record<string, () => IAmeliproAutoCompleteFieldProps> = {
		A: valueA,
		B: valueB,
		C: valueC,
	}
	const selectData = (key: string): void => {
		dataTest.value = values[key]()
	}

	const onUpdateModelValue = (event: any) => console.info('AmeliproAutoCompleteField:onUpdateModelValue', event)
</script>

<template>
	<section>
		<h2>AmeliproAutoCompleteField</h2>
		<p class="data-selector-wrapper">
			Set props data :
			<button @click="selectData('A')">
				Data set A (reset)
			</button> | <button @click="selectData('B')">
				Data set B
			</button> | <button @click="selectData('C')">
				Data set C
			</button>
			-
			<label for="aria-required-btn"><input
				id="aria-required-btn"
				v-model="dataTest.ariaRequired"
				type="checkbox"
			> ariaRequired</label>
		</p>
		<div class="component-wrapper">
			<AmeliproAutoCompleteField
				v-bind="dataTest"
				ref="ameliproAutoCompleteField"
				@update:model-value="onUpdateModelValue"
			/>
		</div>
	</section>
</template>

<style scoped></style>
