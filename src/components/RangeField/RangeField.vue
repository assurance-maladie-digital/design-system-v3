<script lang="ts" setup>
	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import { vMaska } from 'maska/vue'
	import { computed, nextTick, ref, watch } from 'vue'
	import { useDisplay } from 'vuetify'
	import RangeSlider from './RangeSlider/RangeSlider.vue'
	import { config } from './config'
	import { locales } from './locales'
	import SyTextField from '../Customs/SyTextField/SyTextField.vue'

	const props = withDefaults(defineProps<CustomizableOptions & {
		min?: number
		max?: number
		step?: number
		bgColor?: string
		fieldsetLabel?: string | false
		thumbMinLabel?: string
		thumbMaxLabel?: string
		textFieldMinLabel?: string
		textFieldMaxLabel?: string
	}>(), {
		min: 0,
		max: 100,
		step: 1,
		bgColor: 'white',
		fieldsetLabel: false,
		thumbMinLabel: locales.minLabel,
		thumbMaxLabel: locales.maxLabel,
		textFieldMinLabel: locales.minLabel,
		textFieldMaxLabel: locales.maxLabel,
	})

	const options = useCustomizableOptions(config, props)

	const model = defineModel<
		Array<number>
	>()

	if (!model.value) {
		model.value = [props.min, props.max]
	}

	const innerValue = computed(() => {
		return model.value ? model.value : [props.min, props.max]
	})

	const fieldMin = ref<string | number>(innerValue.value[0])
	const fieldMax = ref<string | number>(innerValue.value[1])

	watch(model, (value) => {
		if (!Array.isArray(value)) {
			return
		}

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

	const mask = {
		tokens: {
			'N': { pattern: /-/, optional: true },
			'n': { pattern: /\d/, multiple: true, optional: true },
			'.': { pattern: /\./, optional: true },
			'd': { pattern: /\d/, multiple: true, optional: true },
		},
		mask: 'Nn.d',
	}

	function clamp(value: number | string) {
		value = Math.round(Number(value))
		if (isNaN(value)) return props.min
		return Math.min(Math.max(value, props.min), props.max)
	}

	function updateMin(value: string) {
		if (value === '') {
			return
		}
		const newValue = Number(value)
		if (
			!isNaN(newValue)
			&& isFinite(newValue)
			&& newValue >= props.min
			&& newValue <= model.value![1]
		) {
			model.value = [newValue, innerValue.value[1]]
		}
	}

	function updateMax(value: string) {
		if (value === '') {
			return
		}
		const newValue = Number(value)
		if (
			!isNaN(newValue)
			&& isFinite(newValue)
			&& newValue <= props.max
			&& newValue >= innerValue.value[0]
		) {
			model.value = [innerValue.value[0], newValue]
		}
	}

	async function validateMin() {
		await nextTick()
		fieldMin.value = innerValue.value[0]
	}

	async function validateMax() {
		await nextTick()
		fieldMax.value = innerValue.value[1]
	}
</script>

<template>
	<component
		:is="fieldsetLabel ? 'fieldset' : 'div'"
		class="sy-range-field"
	>
		<legend v-if="fieldsetLabel">
			{{ fieldsetLabel }}
		</legend>

		<div class="mt-10 mb-2 mx-3">
			<RangeSlider
				:model-value="innerValue"
				v-bind="options.rangeSlider"
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
			<SyTextField
				v-model="fieldMin"
				v-maska="mask"
				v-bind="options.textField"
				:label="textFieldMinLabel"
				inputmode="numeric"
				color="primary"
				:bg-color="bgColor"
				@update:model-value="updateMin"
				@blur="validateMin"
			/>
			<SyTextField
				v-model="fieldMax"
				v-maska="mask"
				v-bind="options.textField"
				:label="textFieldMaxLabel"
				inputmode="numeric"
				color="primary"
				:bg-color="bgColor"
				@update:model-value="updateMax"
				@blur="validateMax"
			/>
		</div>
	</component>
</template>
