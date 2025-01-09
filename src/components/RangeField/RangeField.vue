<script lang="ts" setup>
	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import { watch } from 'vue'
	import { useDisplay } from 'vuetify'
	import { config } from './config'
	import { locales } from './locales'
	import SyTextField from '../Customs/SyTextField/SyTextField.vue'

	const props = withDefaults(defineProps<CustomizableOptions & {
		min?: number
		max?: number
	}>(), {
		min: 0,
		max: 100,
	})

	const options = useCustomizableOptions(config, props)

	const model = defineModel<
		Array<number>
	>({
		default: [0, 0],
	})

	watch(model, (value) => {
		const start = clamp(value[0]), end = clamp(value[1])
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

</script>

<template>
	<div class="vd-range-field">
		<div
			:class="{ 'flex-column': display.xs.value }"
			class="d-flex flex-wrap max-width-none ma-n3"
		>
			<SyTextField
				:model-value="model[0]"
				v-bind="options.textField"
				variant="underlined"
				:label="locales.minLabel"
				inputmode="numeric"
				color="primary"
				title="locales.minLabel"
				@update:model-value="model = [clamp($event), model[1]]"
			/>
			<SyTextField
				:model-value="model[1]"
				v-bind="options.textField"
				color="primary"
				variant="underlined"
				:label="locales.maxLabel"
				inputmode="numeric"
				title="locales.maxLabel"
				@update:model-value="model = [model[0], clamp($event)]"
			/>
		</div>

		<VRangeSlider
			:model-value="model"
			v-bind="options.rangeSlider"
			color="primary"
			:max="max"
			:min="min"
			@update:model-value="model = $event"
		>
			<template #prepend>
				{{ min }}
			</template>

			<template #append>
				{{ max }}
			</template>
		</VRangeSlider>
	</div>
</template>
