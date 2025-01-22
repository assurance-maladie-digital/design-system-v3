<script lang="ts" setup>
	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import { ref, watch } from 'vue'
	import { useDisplay } from 'vuetify'
	import RangeSlider from './RangeSlider/RangeSlider.vue'
	import { config } from './config'
	import { locales } from './locales'

	const props = withDefaults(defineProps<CustomizableOptions & {
		min?: number
		max?: number
		step?: number
	}>(), {
		min: 0,
		max: 100,
		step: 1,
	})

	const options = useCustomizableOptions(config, props)

	const model = defineModel<
		Array<number>
	>({
		default: [0, 0],
	})

	const fieldMin = ref(model.value[0])
	const fieldMax = ref(model.value[1])

	watch(model, (value) => {
		const start = clamp(value[0]), end = clamp(value[1])
		fieldMin.value = start
		fieldMax.value = end
		if (start !== value[0] || end !== value[1]) {
			model.value = [start, end]
		}
	}, {
		immediate: true,
		deep: true,
	})

	const display = useDisplay()

	function clamp(value: number | string) {
		value = Math.round(Number(value))
		if (isNaN(value)) return props.min
		return Math.min(Math.max(value, props.min), props.max)
	}

	function updateMin(value: string) {
		const newValue = Number(value)
		if (
			!isNaN(newValue)
			&& isFinite(newValue)
			&& newValue >= props.min
			&& newValue <= model.value[1]
		) {
			model.value = [newValue, model.value[1]]
		}
	}

	function updateMax(value: string) {
		const newValue = Number(value)
		if (
			!isNaN(newValue)
			&& isFinite(newValue)
			&& newValue <= props.max
			&& newValue >= model.value[0]
		) {
			model.value = [model.value[0], newValue]
		}
	}

	function validateMin(focus: boolean) {
		if (!focus) {
			fieldMin.value = model.value[0]
		}
	}

	function validateMax(focus: boolean) {
		if (!focus) {
			fieldMax.value = model.value[1]
		}
	}
</script>

<template>
	<div class="vd-range-field">
		<div class="mt-8 mb-2 mx-3">
			<RangeSlider
				:model-value="model"
				:max="max"
				:min="min"
				:step="step"
				class="mt-8 mb-2"
				@update:model-value="model = $event"
			/>
		</div>
		<div
			:class="{ 'flex-column': display.xs.value }"
			class="d-flex flex-wrap max-width-none"
		>
			<VTextField
				v-model="fieldMin"
				v-bind="options.textField"
				:label="locales.minLabel"
				inputmode="numeric"
				color="primary"
				title="locales.minLabel"
				@update:model-value="updateMin"
				@focused="validateMin"
			/>
			<VTextField
				v-model="fieldMax"
				v-bind="options.textField"
				color="primary"
				:label="locales.maxLabel"
				inputmode="numeric"
				title="locales.maxLabel"
				@update:model-value="updateMax"
				@focused="validateMax"
			/>
		</div>
	</div>
</template>
