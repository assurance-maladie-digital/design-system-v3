<script setup lang="ts">
	import { computed, ref } from 'vue'
	import AmeliproIconBtn from '../../AmeliproIconBtn/AmeliproIconBtn.vue'
	import type { IndexedObject } from '../../types'
	import { convertToHex } from '@/utils/functions/convertToHex'

	const props = defineProps({
		borderColor: {
			type: String,
			default: 'ap-grey',
		},
		bordered: {
			type: Boolean,
			default: true,
		},
		cardColor: {
			type: String,
			default: 'ap-white',
		},
		hideSeparator: {
			type: Boolean,
			default: false,
		},
		isOpen: {
			type: Boolean,
			default: false,
		},
		uniqueId: {
			type: String,
			required: true,
		},
	})

	const focus = ref(false)
	const hover = ref(false)

	const generalAccordionStyles = computed<IndexedObject>(() => {
		const cardStyle: IndexedObject = { backgroundColor: `${convertToHex(props.cardColor)}` }

		if (props.bordered) {
			cardStyle.border = `1px solid ${convertToHex(props.borderColor)}`
		}

		return cardStyle
	})

	const accordionHeaderStyles = computed<IndexedObject | undefined>(() => {
		if (props.isOpen && !props.hideSeparator) {
			return { borderBottom: `1px solid ${convertToHex(props.borderColor)}` }
		}
		return undefined
	})

	const emit = defineEmits(['open-close'])
	const emitOpenCloseEvent = (): void => {
		emit('open-close', props.uniqueId, !props.isOpen)
	}
</script>

<template>
	<div
		:id="`${uniqueId}-container`"
		class="amelipro-accordion--result w-100 mb-4"
		:style="generalAccordionStyles"
	>
		<div
			:id="`${uniqueId}-header`"
			class="d-flex flex-column flex-md-row align-center justify-md-space-between amelipro-accordion--result__header"
			:style="accordionHeaderStyles"
		>
			<div class="heading-content">
				<slot name="headingContent" />
			</div>

			<AmeliproIconBtn
				:aria-controls="uniqueId"
				:aria-expanded="isOpen === true ? 'true' : 'false'"
				:btn-label="isOpen === true ? 'Replier' : 'Déplier'"
				class="heading-content-btn"
				:icon="isOpen === true ? 'chevronUp' : 'chevronDown'"
				icon-bg-color="transparent"
				icon-color="ap-blue-darken-1"
				icon-hover-bg-color="transparent"
				icon-hover-color="ap-blue-darken-2"
				:unique-id="`${uniqueId}-header-btn-open-close`"
				@blur="focus = false"
				@click="emitOpenCloseEvent()"
				@focus="focus = true"
				@mouseenter="hover = true"
				@mouseleave="hover = false"
			/>
		</div>

		<div
			v-show="isOpen === true"
			:id="uniqueId"
			:aria-labelledby="uniqueId + 'title'"
			class="amelipro-accordion--result__content text-ap-grey-darken-1"
			role="region"
		>
			<slot />
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

.amelipro-accordion--result {
	display: block;
	position: relative;
	max-width: 100%;
	border-radius: 4px;
	text-decoration: none;
	overflow-wrap: break-word;
	white-space: normal;
}

.amelipro-accordion--result__content {
	width: 100%;
	padding: 1rem;
	font-size: apTokens.$font-size-xs;
	font-weight: apTokens.$ap-font-weight-regular;
}

.heading-content {
	width: 100%;
	padding: 1rem 0 0 1rem;

	@media #{apTokens.$media-up-md} {
		width: calc(100% - 30px);
		padding: 1rem 0 1rem 1rem;
	}
}

.heading-content-btn {
	padding: 1rem;
	@media #{apTokens.$media-down-md} {
		width: 100% !important;
		margin-top: 0.5rem;
		padding: 0.5rem 1rem 1rem 1rem;
	}
}
</style>
