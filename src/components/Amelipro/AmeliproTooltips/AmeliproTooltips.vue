<script setup lang="ts">
	import { computed, ref } from 'vue'
	import AmeliproIconBtn from '../AmeliproIconBtn/AmeliproIconBtn.vue'
	import type { IndexedObject } from '../types'
	import { convertToHex } from '@/utils/functions/convertToHex'

	const props = defineProps({
		btnLabel: {
			type: String,
			default: 'plus d’informations',
		},
		iconBgColor: {
			type: String,
			default: 'ap-white',
		},
		iconColor: {
			type: String,
			default: 'ap-parme-darken-1',
		},
		iconHoverBgColor: {
			type: String,
			default: 'ap-parme-darken-1',
		},
		iconHoverColor: {
			type: String,
			default: 'ap-white',
		},
		iconName: {
			type: String,
			default: 'aide',
		},
		tooltipBg: {
			type: String,
			default: 'ap-white',
		},
		tooltipText: {
			type: String,
			default: 'Test',
		},
		tooltipTextColor: {
			type: String,
			default: 'ap-grey-darken-1',
		},
		uniqueId: {
			type: String,
			required: true,
		},
	})

	const show = ref(false)
	const tooltipTextStyle = computed<IndexedObject>(() => ({ color: convertToHex(props.tooltipTextColor) }))
	const tooltipBgStyle = computed<string>(() => `bg-${props.tooltipBg}`)
</script>

<template>
	<div
		:id="`${uniqueId}-container`"
		class="d-flex justify-center amelipro-tooltip"
	>
		<VTooltip
			:id="uniqueId"
			v-model="show"
			:content-class="`tooltip-${uniqueId}-js ${tooltipBgStyle}`"
			eager
			max-width="300px"
			right
			@keyup.esc="show = false"
		>
			<template #activator="{ props: tooltipProps }">
				<slot
					name="tooltipActivator"
					v-bind="{ props }"
				>
					<AmeliproIconBtn
						:aria-describedby="uniqueId"
						:btn-label="btnLabel"
						class="tooltip-btn"
						:icon="iconName"
						:icon-bg-color="iconBgColor"
						:icon-color="iconColor"
						:icon-hover-bg-color="iconHoverBgColor"
						:icon-hover-color="iconHoverColor"
						large
						:unique-id="`${uniqueId}-btn`"
						v-bind="tooltipProps"
						@touchend="show = false"
						@touchstart="show = true"
					/>
				</slot>
			</template>

			<slot name="default">
				<span
					:id="`${uniqueId}-text`"
					class="amelipro-tooltip__text"
					:style="tooltipTextStyle"
				>
					{{ tooltipText }}
				</span>
			</slot>
		</VTooltip>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

.v-btn {
	&.tooltip-btn {
		width: 1.85em !important;
		height: 1.85em !important;
	}
}
</style>
