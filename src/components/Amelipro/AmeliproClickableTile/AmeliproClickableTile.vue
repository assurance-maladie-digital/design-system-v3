<script setup lang="ts">
	import { type PropType, computed, ref } from 'vue'
	import AmeliproIcon from '../AmeliproIcon/AmeliproIcon.vue'
	import type { IndexedObject } from '../types'
	import type { RouteLocationRaw } from 'vue-router'
	import { convertToHex } from '@/utils/functions/convertToHex'

	const props = defineProps({
		borderedIcon: {
			type: Boolean,
			default: false,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		href: {
			type: String,
			default: undefined,
		},
		icon: {
			type: String,
			default: undefined,
		},
		imgMaxWidth: {
			type: String,
			default: undefined,
		},
		imgMinWidth: {
			type: String,
			default: undefined,
		},
		imgSrc: {
			type: String,
			default: undefined,
		},
		imgWidth: {
			type: String,
			default: '100px',
		},
		tileTitle: {
			type: String,
			default: undefined,
		},
		tileWidth: {
			type: String,
			default: '100%',
		},
		to: {
			type: [Array, Object, String] as PropType<RouteLocationRaw>,
			default: undefined,
		},
		uniqueId: {
			type: String,
			default: undefined,
		},
	})

	const hover = ref(false)
	const focus = ref(false)

	const tileStyles = computed<IndexedObject>(() => {
		const btnStyles: IndexedObject = {
			backgroundColor: convertToHex('ap-white'),
			border: `1px solid ${convertToHex('ap-blue-darken-1')} !important`,
			color: convertToHex('ap-grey-darken-1'),
			padding: '1rem',
		}
		if ((hover.value || focus.value) && !props.disabled) {
			btnStyles.border = `1px solid ${convertToHex('ap-blue darken-2')} !important`
		}
		if (props.disabled) {
			btnStyles.color = `${convertToHex('ap-grey-darken-1')} !important`
			btnStyles.backgroundColor = `${convertToHex('ap-grey-lighten-2')} !important`
			btnStyles.border = `1px solid ${convertToHex('ap-grey-lighten-2')} !important`
		}

		return btnStyles
	})

	const imgStyles = computed((): IndexedObject => {
		const styles: IndexedObject = { width: props.imgWidth }
		if (props.imgMaxWidth) {
			styles.maxWidth = props.imgMaxWidth
		}
		if (props.imgMinWidth) {
			styles.minWidth = props.imgMinWidth
		}
		return styles
	})

	const iconColorValue = computed<string>(() => {
		if (!props.borderedIcon) {
			return 'ap-white'
		}
		if (props.disabled) {
			return 'ap-grey-darken-1'
		}
		if (hover.value || focus.value) {
			return 'ap-blue-darken-2'
		}
		return 'ap-blue-darken-1'
	})

	const iconBgColorValue = computed<string>(() => {
		if (props.borderedIcon) {
			return 'transparent'
		}
		if (props.disabled) {
			return 'ap-grey-darken-1'
		}
		if (hover.value || focus.value) {
			return 'ap-blue-darken-2'
		}
		return 'ap-blue-darken-1'
	})

	const iconArrowColorValue = computed<string>(() => {
		if (props.disabled) {
			return 'ap-grey-darken-1'
		}
		if (hover.value || focus.value) {
			return 'ap-blue-darken-2'
		}
		return 'ap-blue-darken-1'
	})

	const emit = defineEmits(['click'])
	const emitClickEvent = () => emit('click', props.uniqueId)
</script>

<template>
	<VBtn
		:id="uniqueId"
		class="amelipro-clickable-tile text-none"
		:disabled="disabled"
		:elevation="0"
		height="auto"
		:href="href"
		:ripple="false"
		:style="tileStyles"
		:to="to"
		:width="tileWidth"
		@blur="focus = false"
		@click="emitClickEvent()"
		@focus="focus = true"
		@mouseenter="hover = true"
		@mouseleave="hover = false"
	>
		<span class="d-flex align-center">
			<img
				v-if="imgSrc && !icon"
				:id="uniqueId ? `${uniqueId}-img` : undefined"
				alt=""
				class="amelipro-clickable-tile__img"
				:src="imgSrc"
				:style="imgStyles"
			>

			<AmeliproIcon
				v-if="icon && !imgSrc"
				:id="uniqueId ? `${uniqueId}-icon` : undefined"
				:bordered="borderedIcon"
				class="amelipro-clickable-tile__icon"
				:icon="icon"
				:icon-bg-color="iconBgColorValue"
				:icon-color="iconColorValue"
				size="32px"
			/>

			<span
				class="d-block ml-3 mr-6"
			>
				<slot name="default">
					{{ tileTitle }}
				</slot>
			</span>
		</span>

		<AmeliproIcon
			:id="uniqueId ? `${uniqueId}-icon-arrow` : undefined"
			class="amelipro-clickable-tile__icon-arrow"
			icon="chevronRight"
			icon-bg-color="transparent"
			:icon-color="iconArrowColorValue"
			size="16px"
		/>
	</VBtn>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

.amelipro-clickable-tile {
	position: relative;
	display: flex;
	background-color: apTokens.$ap-white;
	border-radius: 0.5rem;
	white-space: normal;
	font-size: 1rem;
	font-weight: 600;
	text-align: left;
}

.v-btn {
	letter-spacing: unset;
	text-indent: unset;

	& :deep(.v-btn__overlay),
	& :deep(.v-btn__underlay) {
		display: none !important;
	}

	&.v-btn--active::before,
	&:focus::before,
	&:hover::before {
		content: unset !important;
		opacity: 0 !important;
	}

	&:focus {
		outline: 1px dotted apTokens.$ap-grey-darken1;
	}

	& :deep(.v-btn__content) {
		position: unset;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}
}
</style>
