<script lang="ts" setup>
	import { ref, computed, defineProps, defineEmits } from 'vue'
	import { Rating } from '../Rating'
	import { locales } from './locales'
	import type { PropType } from 'vue'

	import { useDisplay } from 'vuetify'

	interface SelectItem {
		title: string
		value: number
	}

	const props = defineProps({
		length: {
			type: Number,
			default: 10,
		},
		itemLabels: {
			type: Array as PropType<string[]>,
			default: () => [],
		},
	})

	const { smAndDown } = useDisplay()
	const isMobile = computed(() => smAndDown.value)

	const emit = defineEmits(['update:modelValue'])

	const selectItems = computed<SelectItem[]>(() => {
		return [...Array(props.length)].map((_, index) => ({
			title: `${index + 1}`,
			value: index + 1,
		}))
	})

	const shouldDisplayLabels = computed(() => props.itemLabels.length === 2)

	const hasAnswered = computed(() => modelValue.value !== -1)

	const modelValue = ref(-1)
</script>

<template>
	<fieldset class="vd-number-picker">
		<VSelect
			v-if="isMobile"
			:model-value="modelValue === -1 ? null : modelValue"
			:label="Rating.label ?? ''"
			:disabled="Rating.readonly || hasAnswered"
			:items="selectItems"
			hide-details
			variant="outlined"
			class="vd-form-input"
			@update:model-value="(value) => emit('update:modelValue', value)"
		/>
		<template v-else>
			<legend class="text-h6 mb-6">
				<slot name="label">
					{{ Rating.label }}
				</slot>
			</legend>
			<div
				v-if="!hasAnswered"
				class="d-inline-block"
			>
				<VRating
					:model-value="modelValue"
					:length="props.length"
					:readonly="Rating.readonly || hasAnswered"
					class="d-flex flex-wrap max-width-none"
					@update:model-value="(value) => emit('update:modelValue', value)"
				>
					<template #item="{ index }">
						<VBtn
							:aria-label="locales.ariaLabel(index + 1, props.length)"
							:disabled="Rating.readonly"
							size="x-small"
							variant="outlined"
							color="primary"
							height="36px"
							class="text-body-2 pa-0 mr-2"
						>
							{{ index + 1 }}
						</VBtn>
					</template>
				</VRating>
				<div
					v-if="shouldDisplayLabels"
					class="d-flex justify-space-between mt-1"
				>
					<span
						:aria-label="`${locales.ariaLabel(1, props.length)} ${
							props.itemLabels[0]
						}.`"
						class="text-caption"
						v-text="props.itemLabels[0]"
					/>
					<span
						:aria-label="`${locales.ariaLabel(props.length, props.length)} ${
							props.itemLabels[1]
						}.`"
						class="text-caption mr-2"
						v-text="props.itemLabels[1]"
					/>
				</div>
			</div>
			<p
				v-else
				:aria-label="locales.ariaLabel(modelValue, props.length)"
				class="mb-0 d-flex align-center"
			>
				<VBtn
					aria-hidden="true"
					:disabled="true"
					size="x-small"
					variant="outlined"
					color="primary"
					height="36px"
					class="vd-btn-answer text-body-2 mr-1 pa-0"
				>
					{{ modelValue }}
				</VBtn>
				/ {{ props.length }}
			</p>
		</template>
	</fieldset>
</template>

<style lang="scss" scoped>
.vd-number-picker {
	border: 0;
}

.vd-btn-answer.v-btn.v-btn--disabled {
	opacity: 1;
}
</style>
