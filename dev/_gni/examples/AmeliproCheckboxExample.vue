<!-- eslint-disable no-console -->
<script setup lang="ts">
	import AmeliproCheckbox from '@/components/Amelipro/AmeliproCheckbox/AmeliproCheckbox.vue'
	import type { AmeliproCheckboxItem } from '@/components/Amelipro/AmeliproCheckbox/types'
	import { ref } from 'vue'

	export interface IAmeliproCheckboxProps {
		ariaRequired?: boolean
		checkbox: AmeliproCheckboxItem
		disabled?: boolean
		errorDefault?: boolean
		isSwitch?: boolean
		labelLeft?: boolean
		modelValue?: boolean
		requiredErrorMessage?: string
		uniqueId: string
	}

	const ameliproCheckbox = ref<typeof AmeliproCheckbox>()

	const valueA = (): IAmeliproCheckboxProps => ({
		checkbox: {
			description: 'Description A',
			label: 'Label A',
			value: 'value-a',
		},
		uniqueId: 'amelipro-checkbox-required-unique-id-a',
	})
	const valueB = (): IAmeliproCheckboxProps => ({
		checkbox: {
			description: 'Description B',
			label: 'Label B',
			value: 'value-b',
		},
		uniqueId: 'amelipro-checkbox-required-unique-id-b',
	})
	const valueC = (): IAmeliproCheckboxProps => ({
		ariaRequired: true,
		checkbox: {
			description: 'Description C',
			label: 'Label C',
			value: 'value-c',
		},
		uniqueId: 'amelipro-checkbox-required-unique-id-c',
	})

	const dataTest = ref<IAmeliproCheckboxProps>(valueA())
	const values: Record<string, () => IAmeliproCheckboxProps> = {
		A: valueA,
		B: valueB,
		C: valueC,
	}
	const selectData = (key: string): void => {
		dataTest.value = values[key]()
	}

	const onChange = (event: any) => console.info('AmeliproCheckbox:onChange', event)

</script>

<template>
	<section>
		<h2>AmeliproCheckbox</h2>
		<p class="data-selector-wrapper">
			Set prop "value" :
			<button @click="selectData('A')">
				Value A (reset)
			</button> | <button @click="selectData('B')">
				Value B
			</button> | <button @click="selectData('C')">
				Value C
			</button>
			-
			<label for="aria-required-btn"><input
				id="aria-required-btn"
				v-model="dataTest.ariaRequired"
				type="checkbox"
			> ariaRequired</label>
		</p>
		<div class="component-wrapper">
			<AmeliproCheckbox
				v-bind="dataTest"
				ref="ameliproCheckbox"
				@change="onChange"
			/>
		</div>
	</section>
</template>

<style scoped></style>
