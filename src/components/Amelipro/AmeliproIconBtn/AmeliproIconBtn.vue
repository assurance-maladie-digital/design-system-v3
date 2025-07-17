<script setup lang="ts">
	import { type PropType, computed, ref, useSlots } from 'vue'
	import AmeliproIcon from '../AmeliproIcon/AmeliproIcon.vue'
	import type { IndexedObject } from '../types'
	import type { RouteLocationRaw } from 'vue-router'
	import { convertToHex } from '@/utils/functions/convertToHex'
	import { useError } from '@/composables/useError'

	const props = defineProps({
		badge: {
			type: [Boolean, Number, String],
			default: false,
		},
		badgeBgColor: {
			type: String,
			default: undefined,
		},
		badgeColor: {
			type: String,
			default: undefined,
		},
		bordered: {
			type: Boolean,
			default: false,
		},
		btnLabel: {
			type: String,
			default: undefined,
		},
		btnTitle: {
			type: String,
			default: undefined,
		},
		href: {
			type: String,
			default: undefined,
		},
		icon: {
			type: String,
			default: undefined,
		},
		iconBgColor: {
			type: String,
			default: 'transparent',
		},
		iconBorderColor: {
			type: String,
			default: undefined,
		},
		iconColor: {
			type: String,
			required: true,
		},
		iconFocusBgColor: {
			type: String,
			default: undefined,
		},
		iconFocusBorderColor: {
			type: String,
			default: undefined,
		},
		iconFocusColor: {
			type: String,
			default: undefined,
		},
		iconHoverBgColor: {
			type: String,
			default: 'transparent',
		},
		iconHoverBorderColor: {
			type: String,
			default: undefined,
		},
		iconHoverColor: {
			type: String,
			required: true,
		},
		large: {
			type: Boolean,
			default: false,
		},
		medium: {
			type: Boolean,
			default: false,
		},
		size: {
			type: String,
			default: undefined,
		},
		small: {
			type: Boolean,
			default: false,
		},
		to: {
			type: [Array, Object, String] as PropType<RouteLocationRaw>,
			default: undefined,
		},
		uniqueId: {
			type: String,
			default: undefined,
		},
		xLarge: {
			type: Boolean,
			default: false,
		},
	})

	const hover = ref(false)
	const focus = ref(false)

	const currentIconColor = computed<string>(() => {
		if (hover.value || (focus.value && !props.iconFocusColor)) {
			return props.iconHoverColor
		}
		if (focus.value && props.iconFocusColor) {
			return props.iconFocusColor
		}
		return props.iconColor
	})

	const currentIconBgColor = computed<string>(() => {
		if (hover.value || (focus.value && !props.iconFocusBgColor)) {
			return props.iconHoverBgColor
		}
		if (focus.value && props.iconFocusBgColor) {
			return props.iconFocusBgColor
		}
		return props.iconBgColor
	})

	const currentIconName = computed<string | undefined>(() => props.icon)
	const isTextBadge = computed<boolean>(() => (Boolean(props.badge !== true && props.badge !== false)))
	const badgeStyle = computed<IndexedObject>(() => ({ backgroundColor: convertToHex(props.badgeBgColor), color: convertToHex(props.badgeColor) }))

	const iconBorderStyle = computed<string | undefined>(() => {
		if (hover.value || (focus.value && !props.iconFocusBorderColor)) {
			return props.iconHoverBorderColor
		}
		if (focus.value && props.iconFocusBorderColor) {
			return props.iconFocusBorderColor
		}
		return props.iconBorderColor
	})

	const slots = useSlots()
	const hasPrepend = (): boolean => Boolean(slots.prepend)
	const hasAppend = (): boolean => Boolean(slots.append)

	const hasSlot = computed<boolean>(() => {
		const isValid = hasPrepend() || hasAppend()

		if (!isValid && (props.btnLabel === undefined && props.btnTitle === undefined)) {
			const { propError } = useError()
			propError('prop btnLabel is required if append and prepend slots are empty')
		}

		return isValid
	})

	const iconSpacing = computed<string>(() => {
		let spacing = ''

		if (hasPrepend()) {
			spacing += ' ml-2'
		}

		if (hasAppend()) {
			spacing += ' mr-2'
		}

		return spacing
	})
	const emit = defineEmits(['click'])
	const emitClick = () => emit('click')
</script>

<template>
	<VBtn
		:id="uniqueId"
		class="btn--icon"
		elevation="0"
		height="auto"
		:href="href"
		icon
		plain
		:ripple="false"
		tile
		:title="btnTitle"
		:to="to"
		width="auto"
		@blur="focus = false"
		@click="emitClick"
		@focus="focus = true"
		@mouseenter="hover = true"
		@mouseleave="hover = false"
	>
		<span
			v-if="!hasSlot && btnLabel !== undefined"
			:id="uniqueId ? `${uniqueId}-btn-label` : undefined"
			class="d-sr-only amelipro-btn__label"
		>
			{{ btnLabel }}
		</span>

		<slot name="prepend" />

		<span
			v-if="badge"
			:id="uniqueId ? `${uniqueId}-badge` : undefined"
			class="amelipro-btn__badge-wrapper"
		>
			<AmeliproIcon
				ref="ameliproIcon"
				:border-color="iconBorderStyle"
				:bordered="bordered"
				class="icon-custom"
				:class="iconSpacing"
				:icon="currentIconName"
				:icon-bg-color="currentIconBgColor"
				:icon-color="currentIconColor"
				:large="large"
				mdi-padding="0"
				:medium="medium"
				:size="size"
				:small="small"
				:unique-id="uniqueId ? `${uniqueId}-icon` : undefined"
				:x-large="xLarge"
			>
				<template
					v-if="$slots.icon"
					#default
				>
					<slot name="icon" />
				</template>
			</AmeliproIcon>

			<span
				class="amelipro-btn__badge"
				:style="badgeStyle"
			>
				<span v-if="isTextBadge">
					{{ badge }}
				</span>
			</span>
		</span>

		<AmeliproIcon
			v-else
			ref="ameliproIcon"
			:border-color="iconBorderStyle"
			:bordered="bordered"
			class="icon-custom"
			:class="iconSpacing"
			:icon="currentIconName"
			:icon-bg-color="currentIconBgColor"
			:icon-color="currentIconColor"
			:large="large"
			mdi-padding="0"
			:medium="medium"
			:size="size"
			:small="small"
			:unique-id="uniqueId ? `${uniqueId}-icon` : undefined"
			:x-large="xLarge"
		>
			<template
				v-if="$slots.icon"
				#default
			>
				<slot name="icon" />
			</template>
		</AmeliproIcon>

		<slot name="append" />
	</VBtn>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

.v-btn {
	background-color: transparent;
	letter-spacing: unset;
	text-indent: unset;

	& :deep(.v-btn__overlay),
	& :deep(.v-btn__underlay) {
		display: none !important;
	}

	& :deep(.v-btn__content) {
		opacity: 1 !important;
	}

	&:focus {
		outline: 1px dotted apTokens.$ap-black;
	}
}

.amelipro-btn__badge-wrapper {
	position: relative;
}

.amelipro-btn__badge {
	position: absolute;
	top: -0.4rem;
	right: -0.4rem;
	min-width: 1.25rem;
	min-height: 1.25rem;
	padding: 0 0.125rem;
	border-radius: 50%;
	font-size: apTokens.$font-size-xxs;

	& span {
		display: block;
		margin-top: 2px;
	}
}
</style>
