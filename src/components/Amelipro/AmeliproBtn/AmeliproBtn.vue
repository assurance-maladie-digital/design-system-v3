<script setup lang="ts">
	import { computed, ref, useSlots } from 'vue'
	import AmeliproIcon from '../AmeliproIcon/AmeliproIcon.vue'
	import type { IndexedObject } from '../types'
	import { convertToHex } from '@/utils/functions/convertToHex'

	const props = defineProps({
		badge: {
			type: [Boolean, Number, String],
			default: false,
		},
		badgeBgColor: {
			type: String,
			default: 'ap-pink',
		},
		badgeColor: {
			type: String,
			default: 'ap-white',
		},
		bordered: {
			type: Boolean,
			default: false,
		},
		classes: {
			type: String,
			default: undefined,
		},
		color: {
			type: String,
			default: 'ap-blue-darken-1',
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		hoverColor: {
			type: String,
			default: 'ap-blue-darken-2',
		},
		hoverUnderline: {
			type: Boolean,
			default: false,
		},
		iconBgColor: {
			type: String,
			default: 'transparent',
		},
		iconBordered: {
			type: Boolean,
			default: false,
		},
		iconColor: {
			type: String,
			default: undefined,
		},
		iconFocusColor: {
			type: String,
			default: undefined,
		},
		iconHoverColor: {
			type: String,
			default: undefined,
		},
		iconLeft: {
			type: Boolean,
			default: false,
		},
		iconName: {
			type: String,
			default: undefined,
		},
		infoBlock: {
			type: Boolean,
			default: false,
		},
		minHeight: {
			type: String,
			default: '2.5rem',
		},
		size: {
			type: String,
			default: '60px',
		},
		target: {
			type: String,
			default: undefined,
		},
		text: {
			type: Boolean,
			default: false,
		},
		textColor: {
			type: String,
			default: 'ap-white',
		},
		textFocusColor: {
			type: String,
			default: undefined,
		},
		textHoverColor: {
			type: String,
			default: undefined,
		},
		type: {
			type: String,
			default: 'button',
		},
		underline: {
			type: Boolean,
			default: false,
		},
		uniqueId: {
			type: String,
			default: undefined,
		},
	})

	const hover = ref(false)
	const focus = ref(false)

	const currentColor = computed<string>(() => (hover.value ? props.hoverColor : props.color))

	const currentTextColor = computed<string>(() => {
		if (focus.value && props.textFocusColor !== undefined) {
			return props.textFocusColor
		}
		if (hover.value && props.textHoverColor !== undefined) {
			return props.textHoverColor
		}

		return props.textColor
	})

	const currentIconColor = computed<string>(() => {
		if (focus.value && !props.disabled && props.iconFocusColor !== undefined) {
			return props.iconFocusColor
		}
		else if (hover.value && !props.disabled && props.iconHoverColor !== undefined) {
			return props.iconHoverColor
		}
		else if ((props.infoBlock && props.iconColor && !hover.value) || (props.iconColor && !props.disabled)) {
			return props.iconColor
		}
		else if (props.text) {
			return currentColor.value
		}

		return props.disabled ? props.textColor : currentTextColor.value
	})

	const iconClasses = computed<string>(() => {
		if (props.infoBlock) {
			return ''
		}
		return props.iconLeft ? 'amelipro-btn__icon--left' : 'amelipro-btn__icon--right'
	})

	const style = computed<IndexedObject>(() => {
		const btnStyles: IndexedObject = {}
		if (props.text) {
			btnStyles.padding = '0'
		}
		else {
			btnStyles.color = `${convertToHex(currentTextColor.value)} !important`
		}
		if (props.bordered) {
			btnStyles.border = `2px solid ${convertToHex(currentTextColor.value)} !important`
			btnStyles.backgroundColor = 'white'
		}
		if (props.disabled) {
			btnStyles.opacity = '30%'

			if (props.text) {
				btnStyles.color = `${convertToHex(props.color)} !important`
			}
			else {
				btnStyles.color = `${convertToHex(props.textColor)} !important`
				btnStyles.backgroundColor = `${convertToHex(props.color)} !important`
			}
		}

		return btnStyles
	})
	const slots = useSlots()
	const variant = computed<NonNullable<'flat' | 'text' | 'elevated' | 'tonal' | 'outlined' | 'plain'> | undefined>(() => (props.text ? 'text' : 'flat'))
	const computedMinHeight = computed<string>(() => (props.text ? 'auto' : props.minHeight))
	const isTextBadge = computed<boolean>(() => (Boolean(props.badge !== true && props.badge !== false)))
	const badgeStyle = computed<IndexedObject>(() => ({ backgroundColor: convertToHex(props.badgeBgColor), color: convertToHex(props.badgeColor) }))
	const hasIcon = computed<boolean>(() => Boolean(!props.infoBlock && (props.iconName || slots.icon)))
	const btnContentPaddingLeft = computed<string>(() => {
		if (hasIcon.value && props.iconLeft) {
			if (props.text) {
				return `calc(0.25rem + ${iconSize.value})`
			}
			return `calc(0.5rem + ${iconSize.value})`
		}
		return '0'
	})
	const btnContentPaddingRight = computed<string>(() => {
		if (hasIcon.value && !props.iconLeft) {
			if (props.text) {
				return `calc(0.25rem + ${iconSize.value})`
			}
			return `calc(0.5rem + ${iconSize.value})`
		}
		return '0'
	})
	const iconSize = computed<string>(() => (props.infoBlock ? props.size : '1.5rem'))

	const btnClasses = computed<IndexedObject<boolean>>(() => ({
		'amelipro-btn--style': !props.text,
		'text-decoration-underline': (props.hoverUnderline && hover.value) || props.underline,
		[props.classes as string]: Boolean(props.classes),
	}))
</script>

<template>
	<VBtn
		:id="uniqueId"
		:class="btnClasses"
		:color="currentColor"
		:disabled="disabled"
		:elevation="0"
		flat
		height="auto"
		:min-height="computedMinHeight"
		:ripple="false"
		:style="style"
		:target="target"
		:type="type"
		:variant="variant"
		v-bind="$attrs"
		class="amelipro-btn"
		@blur="focus = false"
		@focus="focus = true"
		@mouseenter="hover = true;"
		@mouseleave="hover = false;"
	>
		<span
			class="d-flex align-center amelipro-custom-btn"
			:class="infoBlock ? 'flex-column' : 'flex-row'"
		>
			<slot v-if="!iconLeft && !infoBlock" />

			<span
				v-if="badge"
				class="amelipro-btn__badge-wrapper"
				:class="iconClasses"
			>
				<span class="amelipro-btn__badge-wrapper-content">
					<span
						class="amelipro-btn__badge"
						:style="badgeStyle"
					>
						<span v-if="isTextBadge">
							{{ badge }}
						</span>
					</span>

					<AmeliproIcon
						v-if="iconName || $slots.icon"
						:bordered="iconBordered"
						class="d-block"
						:icon="iconName"
						:icon-bg-color="iconBgColor"
						:icon-color="currentIconColor"
						mdi-padding="0"
						:size="iconSize"
						:unique-id="uniqueId ? `${uniqueId}-icon` : undefined"
						width-auto
					>
						<template
							v-if="$slots.icon"
							#default
						>
							<slot name="icon" />
						</template>
					</AmeliproIcon>
				</span>
			</span>

			<AmeliproIcon
				v-else-if="!badge && (iconName || $slots.icon)"
				:bordered="iconBordered"
				class="d-block"
				:class="iconClasses"
				:icon="iconName"
				:icon-bg-color="iconBgColor"
				:icon-color="currentIconColor"
				mdi-padding="0"
				:size="iconSize"
				:unique-id="uniqueId ? `${uniqueId}-icon` : undefined"
				width-auto
			>
				<template
					v-if="$slots.icon"
					#default
				>
					<slot name="icon" />
				</template>
			</AmeliproIcon>

			<slot v-if="iconLeft || infoBlock" />
		</span>
	</VBtn>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

.v-btn {
	letter-spacing: 0.64px;
	font-weight: apTokens.$ap-font-weight-bold;
	text-indent: unset;

	& :deep(.v-btn__overlay),
	& :deep(.v-btn__underlay) {
		display: none !important;
	}

	& :deep(.v-btn__content) {
		position: relative;
		padding-left: v-bind(btnContentPaddingLeft) !important;
		padding-right: v-bind(btnContentPaddingRight) !important;

		& .amelipro-btn__icon--left {
			position: absolute;
			left: 0;
		}

		& .amelipro-btn__icon--right {
			position: absolute;
			right: 0;
		}
	}

	&.amelipro-btn--style {
		padding: apTokens.$btn-padding-y apTokens.$btn-padding-x;
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

	&.v-btn--text {
		letter-spacing: unset;
		min-height: unset !important;
		min-width: unset !important;
		padding: 0 !important;
		vertical-align: unset;
	}

	& .amelipro-btn__badge-wrapper-content {
		position: relative;
		display: block;
	}

	& .amelipro-btn__badge {
		position: absolute;
		right: -0.6rem;
		top: -0.9rem;
		min-width: 1.25rem;
		min-height: 1.25rem;
		padding: 0 0.125rem;
		border-radius: 50%;
		font-size: apTokens.$font-size-xxs;
		z-index: 1;

		& span {
			display: block;
			margin-top: 2px;
		}
	}

	& .amelipro-custom-btn {
		white-space: normal;
	}
}
</style>
