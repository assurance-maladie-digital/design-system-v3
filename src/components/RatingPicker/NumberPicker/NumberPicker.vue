<script lang="ts" setup>
	import { computed } from 'vue'
	import { RatingEnum, useRating } from '../Rating'
	import { locales } from './locales'
	import type { PropType } from 'vue'

	import SySelect from '@/components/Customs/SySelect/SySelect.vue'

	import { useDisplay } from 'vuetify'

	interface SelectItem {
		text: string
		value: number
	}

	const props = defineProps({
		label: {
			type: String as PropType<string | null>,
			default: RatingEnum.NUMBER,
		},
		length: {
			type: Number,
			default: 10,
		},
		itemLabels: {
			type: Array as PropType<string[]>,
			default: () => [],
		},
		readonly: {
			type: Boolean,
			default: false,
		},
		modelValue: {
			type: Number,
			default: -1,
		},
	})

	const { smAndDown } = useDisplay()
	const isMobile = computed(() => smAndDown.value)

	const emit = defineEmits(['update:modelValue'])
	const { hasAnswered, emitInputEvent } = useRating(props, emit)

	const selectItems = computed<SelectItem[]>(() => {
		return [...Array(props.length)].map((_, index) => ({
			text: `${index + 1}`,
			value: index + 1,
		}))
	})

	const shouldDisplayLabels = computed(() => props.itemLabels.length === 2)
</script>

<template>
	<fieldset class="vd-number-picker">
		<SySelect
			v-if="isMobile"
			:model-value="props.modelValue === -1 ? null : props.modelValue"
			:label="props.label"
			:disabled="props.readonly || hasAnswered"
			:items="selectItems"
			color="primary"
			@update:model-value="(value) => emit('update:modelValue', value)"
		/>
		<template v-else>
			<legend class="text-h6 mb-6">
				<slot name="label">
					{{ props.label }}
				</slot>
			</legend>
			<div
				v-if="!hasAnswered"
				class="d-inline-block"
			>
				<VRating
					:model-value="props.modelValue"
					:length="props.length"
					:readonly="props.readonly || hasAnswered"
					class="d-flex flex-wrap max-width-none"
					@update:model-value="(value) => emit('update:modelValue', value)"
				>
					<template #item="{ index }">
						<VBtn
							:aria-label="locales.ariaLabel(index + 1, props.length)"
							:disabled="props.readonly"
							size="x-small"
							variant="outlined"
							color="primary"
							height="36px"
							class="text-body-2 pa-0 mr-2"
							@click="emitInputEvent(index + 1)"
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
				:aria-label="locales.ariaLabel(props.modelValue, props.length)"
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
					{{ props.modelValue }}
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
