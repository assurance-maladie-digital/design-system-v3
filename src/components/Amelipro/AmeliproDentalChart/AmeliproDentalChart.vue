<script setup lang="ts">
	import type { AmeliproDentalChartLine, IAmeliproTooth } from './types'
	import { type PropType, computed, ref } from 'vue'
	import AmeliproRadioGroup from '../AmeliproRadioGroup/AmeliproRadioGroup.vue'
	import type { AmeliproRadioGroupItem } from '../AmeliproRadioGroup/types'
	import AmeliproTooth from './AmeliproTooth/AmeliproTooth.vue'

	const props = defineProps({
		modelValue: {
			type: Array as PropType<AmeliproDentalChartLine[]>,
			required: true,
		},
		readonly: {
			type: Boolean,
			default: false,
		},
		uniqueId: {
			type: String,
			required: true,
		},
	})

	const emit = defineEmits(['change', 'change:filter', 'update:model-value'])
	const currentValue = computed({
		get: () => props.modelValue,
		set: (newValue: AmeliproDentalChartLine[]) => {
			emit('update:model-value', newValue)
		},
	})

	const previousState = (tooth: IAmeliproTooth): boolean => Boolean(tooth.previousState && (tooth.previousState.decayed || tooth.previousState.filled || tooth.previousState.missing))

	const modifiedStatus = (tooth: IAmeliproTooth): boolean => (tooth.previousState !== undefined && ((tooth.previousState.decayed !== tooth.currentState.decayed)
		|| (tooth.previousState.filled !== tooth.currentState.filled)
		|| (tooth.previousState.missing !== tooth.currentState.missing)))

	const filterItems = ref([
		{
			isChecked: true,
			label: 'Dent cariée',
			value: 'decayed',
		},
		{
			isChecked: false,
			label: 'Dent absente',
			value: 'missing',
		},
		{
			isChecked: false,
			label: 'Dent obturée',
			value: 'filled',
		},
	])

	const filterValue = ref('decayed')
	const changeFilterValue = (value: AmeliproRadioGroupItem[]) => {
		const selected = value.filter((e: AmeliproRadioGroupItem) => e.isChecked).at(0)?.value
		if (selected) {
			filterValue.value = selected
			emit('change:filter', selected)
		}
	}

	const changeToothStatus = (toothNumber: string) => {
		let toothToUpdate: IAmeliproTooth = { currentState: { decayed: false, filled: false, missing: false }, toothNumber }
		currentValue.value = currentValue.value.map((line: AmeliproDentalChartLine) => {
			line.map((tooth: IAmeliproTooth) => {
				if (tooth.toothNumber === toothNumber) {
					if (filterValue.value === 'decayed' && !tooth.currentState.missing) {
						tooth.currentState.decayed = !tooth.currentState.decayed
					}
					else if (filterValue.value === 'missing') {
						tooth.currentState.missing = !tooth.currentState.missing
					}
					else if (filterValue.value === 'filled' && !tooth.currentState.missing) {
						tooth.currentState.filled = !tooth.currentState.filled
					}
					toothToUpdate = tooth
				}
				return tooth
			})

			return line
		})
		emit('change', toothToUpdate)
	}
</script>

<template>
	<div
		:id="uniqueId"
		class="amelipro-dental-chart"
	>
		<div class="d-flex justify-center">
			<AmeliproRadioGroup
				v-if="!readonly"
				v-model="filterItems"
				group-label="Choisissez le statut à modifier"
				hidden-label
				pills
				:unique-id="`${uniqueId}-filters`"
				@update:model-value="changeFilterValue"
			/>
		</div>

		<slot name="information" />

		<ul
			:id="`${uniqueId}-list`"
			class="list-style-none w-100"
		>
			<li
				v-for="(line, index) in currentValue"
				:id="`${uniqueId}-item-${index}`"
				:key="index"
				class="w-100"
			>
				<ul
					:id="`${uniqueId}-sublist-${index}`"
					class="list-style-none w-100 d-flex flex-wrap justify-center"
				>
					<li
						v-for="(tooth, toothIndex) in line"
						:id="`${uniqueId}-subitem-${index}-${toothIndex}`"
						:key="toothIndex"
						class="mb-4 tooth-item"
					>
						<AmeliproTooth
							:decayed="tooth.currentState.decayed"
							:disabled="readonly || ( filterValue === 'missing' && (index === 1 || index === 2))"
							:filled="tooth.currentState.filled"
							:has-saved-state="previousState(tooth)"
							:milk-tooth="(index === 0 || index === (currentValue.length - 1)) ? true : false"
							:missing="tooth.currentState.missing"
							:modified="modifiedStatus(tooth)"
							:tooth-number="tooth.toothNumber"
							:unique-id="`${uniqueId}-tooth-${index}-${toothIndex}`"
							@click="changeToothStatus(tooth.toothNumber)"
						/>
					</li>
				</ul>
			</li>
		</ul>
	</div>
</template>

<style lang="scss" scoped>
.tooth-item {
	min-width: 2.5rem;
	margin-left: 4px;
	margin-right: 4px;

	@media (max-width: 1239.999px) {
		width: 2.5rem;
	}

	@media (min-width: 1240px) {
		width: 3.125rem;
		margin-left: 8px;
		margin-right: 8px;
	}
}
</style>
