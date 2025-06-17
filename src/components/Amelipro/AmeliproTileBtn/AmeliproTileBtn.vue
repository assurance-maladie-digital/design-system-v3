<script setup lang="ts">
	import { type PropType, computed, ref } from 'vue'
	import AmeliproIcon from '../AmeliproIcon/AmeliproIcon.vue'
	import type { IndexedObject } from '../types'
	import type { RouteLocationRaw } from 'vue-router'
	import { convertToHex } from '@/utils/functions/convertToHex'

	const props = defineProps({
		alignTopStyle: {
			type: Boolean,
			default: false,
		},
		borderDash: {
			type: Boolean,
			default: false,
		},
		complementaryInfoLine1: {
			type: String,
			default: undefined,
		},
		complementaryInfoLine2: {
			type: String,
			default: undefined,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		href: {
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
			required: true,
		},
		imgWidth: {
			type: String,
			default: '100px',
		},
		invalid: {
			type: Boolean,
			default: false,
		},
		label: {
			type: String,
			required: true,
		},
		labelBottom: {
			type: String,
			default: undefined,
		},
		message: {
			type: String,
			default: undefined,
		},
		messageType: {
			default: 'info',
			type: String,
			validator(value: string): boolean {
				return ['info', 'error', 'warning'].includes(value.toLowerCase())
			},
		},
		tileMinHeight: {
			type: String,
			default: undefined,
		},
		tilePadding: {
			type: String,
			default: '2rem 1.5rem',
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
		valid: {
			type: Boolean,
			default: false,
		},
	})

	const hover = ref(false)
	const focus = ref(false)

	const tileStyles = computed<IndexedObject>(() => {
		const btnStyles: IndexedObject = {
			backgroundColor: convertToHex('ap-white'),
			border: `2px solid ${convertToHex('ap-white')} !important`,
			color: convertToHex('ap-grey-darken-1'),
			padding: props.tilePadding,
		}
		if (props.borderDash) {
			btnStyles.border = `2px dashed ${convertToHex('ap-blue-lighten-1')} !important`
		}
		if (hover.value && !props.disabled) {
			btnStyles.border = `2px solid ${convertToHex('ap-blue-darken-1')} !important`

			if (props.borderDash) {
				btnStyles.border = `2px dashed ${convertToHex('ap-blue-darken-1')} !important`
			}
		}
		if (props.invalid) {
			btnStyles.border = `2px solid ${convertToHex('ap-red-darken-1')} !important`
		}
		if (props.disabled) {
			btnStyles.color = `${convertToHex('ap-grey-darken-1')} !important`
			btnStyles.backgroundColor = `${convertToHex('ap-grey-lighten-2')} !important`
			btnStyles.border = `2px solid ${convertToHex('ap-grey-lighten-2')} !important`
		}

		return btnStyles
	})

	const imgStyles = computed<IndexedObject>(() => {
		const styles: IndexedObject = { width: props.imgWidth }
		if (props.imgMaxWidth) {
			styles.maxWidth = props.imgMaxWidth
		}
		if (props.imgMinWidth) {
			styles.minWidth = props.imgMinWidth
		}
		return styles
	})

	const iconName = computed<string>(() => {
		if (props.messageType === 'error') {
			return 'sensInterdit'
		}
		if (props.messageType === 'warning') {
			return 'exclamation'
		}

		return 'information'
	})

	const iconBgColorValue = computed<string>(() => {
		if (props.messageType === 'error') {
			return 'ap-red'
		}
		if (props.messageType === 'warning') {
			return 'ap-yellow'
		}

		return 'ap-parme-darken-1'
	})

	const emit = defineEmits(['click'])
	const emitClickEvent = () => emit('click', props.uniqueId)
</script>

<template>
	<VBtn
		:id="uniqueId"
		class="amelipro-tile-btn text-none"
		:disabled="disabled"
		:elevation="1"
		height="auto"
		:href="href"
		:min-height="tileMinHeight"
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
		<span v-if="alignTopStyle || complementaryInfoLine1 || complementaryInfoLine2 || message">
			<span
				:id="uniqueId ? `${uniqueId}-text` : undefined"
				class="d-block text-h5 text-center font-weight-semibold amelipro-tile-btn__content"
			>
				{{ label }}

				<span
					v-if="labelBottom"
					:id="uniqueId ? `${uniqueId}-text-bottom` : undefined"
					class="d-block mt-4 text-h5 text-center font-weight-semibold amelipro-tile-btn__content--bottom"
				>
					{{ labelBottom }}
				</span>
			</span>
			<img
				:id="uniqueId ? `${uniqueId}-img` : undefined"
				alt=""
				class="mt-4 amelipro-tile-btn__img"
				:src="imgSrc"
				:style="imgStyles"
			>

			<span
				v-if="complementaryInfoLine1"
				class="d-block mt-4"
			>
				{{ complementaryInfoLine1 }}
			</span>
			<span
				v-if="complementaryInfoLine2"
				class="d-block mt-4 text-h5"
				:class="{ 'text-ap-blue-darken-1': !disabled }"
			>
				{{ complementaryInfoLine2 }}
			</span>

			<span
				v-if="message"
				class="d-flex justify-center mt-4 text-center font-weight-semibold"
				:class="{
					'text-ap-parme-darken-1': messageType === 'info',
					'text-ap-red': messageType === 'error',
					'text-ap-yellow-darken-4': messageType === 'warning',
				}"
			>
				<AmeliproIcon
					key="icon"
					bordered
					class="mr-2 message__icon"
					:icon="iconName"
					:icon-bg-color="iconBgColorValue"
					:icon-color="messageType === 'warning' ? 'ap-grey-darken-1' : 'ap-white'"
					large
					:unique-id="uniqueId ? `${uniqueId}-icon` : undefined"
				/>

				{{ message }}
			</span>

			<span
				v-if="valid && !invalid"
				:id="uniqueId ? `${uniqueId}-valid-status-text` : undefined"
				class="d-sr-only"
			>
				&nbsp;validé
			</span>
			<span
				v-if="invalid && !valid"
				:id="uniqueId ? `${uniqueId}-valid-status-text` : undefined"
				class="d-sr-only"
			>
				&nbsp;contient des erreur
			</span>
		</span>

		<span
			v-if="!complementaryInfoLine1 && !complementaryInfoLine2 && !alignTopStyle && !message"
			:id="uniqueId ? `${uniqueId}-text` : undefined"
			class="d-block text-h5 text-center font-weight-semibold amelipro-tile-btn__content"
		>
			{{ label }}

			<span
				v-if="labelBottom"
				:id="uniqueId ? `${uniqueId}-text-bottom` : undefined"
				class="d-block mt-4 text-h5 text-center font-weight-semibold amelipro-tile-btn__content--bottom"
			>
				{{ labelBottom }}
			</span>

			<span
				v-if="valid && !invalid"
				:id="uniqueId ? `${uniqueId}-valid-status-text` : undefined"
				class="d-sr-only"
			>
				&nbsp;validé
			</span>

			<span
				v-if="invalid && !valid"
				:id="uniqueId ? `${uniqueId}-valid-status-text` : undefined"
				class="d-sr-only"
			>
				&nbsp;contient des erreur
			</span>
		</span>
		<img
			v-if="!complementaryInfoLine1 && !complementaryInfoLine2 && !alignTopStyle && !message"
			:id="uniqueId ? `${uniqueId}-img` : undefined"
			alt=""
			class="mt-4 amelipro-tile-btn__img"
			:src="imgSrc"
			:style="imgStyles"
		>

		<AmeliproIcon
			v-if="valid || invalid"
			class="amelipro-tile-btn__icon"
			:icon="valid ? 'check' : 'croix'"
			:icon-color="valid ? 'ap-turquoise-darken-1' : 'ap-red-darken-1'"
			size="45px"
			:unique-id="uniqueId ? `${uniqueId}-valid-status-icon` : undefined"
		/>
	</VBtn>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/tokens';

.amelipro-tile-btn {
	position: relative;
	display: flex;
	flex-direction: column;
	background-color: tokens.$ap-white;
	border-radius: 0.5rem;
	white-space: normal;
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
		outline: 1px dotted tokens.$ap-grey-darken1;
	}

	& :deep(.v-btn__content) {
		position: unset;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		max-width: 100%;
	}
}

.amelipro-tile-btn__icon {
	position: absolute;
	bottom: 0;
	right: 10px;
}
</style>
