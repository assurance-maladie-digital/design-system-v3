<script setup lang="ts">
	import { IndexedObject } from '../types/types'
	import { computed } from 'vue'
	import { convertToHex } from '@/utils/functions/convertToHex'
	import { icons } from '@/assets/amelipro/icons'

	const props = defineProps({
		borderColor: {
			type: String,
			default: undefined,
		},
		bordered: {
			type: Boolean,
			default: false,
		},
		icon: {
			type: String,
			default: undefined,
		},
		iconBgColor: {
			type: String,
			default: 'transparent',
		},
		iconColor: {
			type: String,
			required: true,
		},
		label: {
			type: String,
			default: undefined,
		},
		large: {
			type: Boolean,
			default: false,
		},
		mdiPadding: {
			type: String,
			default: undefined,
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
		widthAuto: {
			type: Boolean,
			default: false,
		},
		xLarge: {
			type: Boolean,
			default: false,
		},
	})

	const themeIcon = computed<string | undefined>(() => (props.icon ? icons[props.icon] : undefined))

	const currentIconColor = computed<string>(() => convertToHex(props.iconColor))
	const currentIconBgColor = computed<string>(() => convertToHex(props.iconBgColor))

	const customStyles = computed<IndexedObject | undefined>(() => {
		const styles: IndexedObject | undefined = {}
		styles.color = convertToHex(props.iconColor)

		if (props.bordered) {
			styles.borderRadius = '50%'
			if (props.borderColor === undefined) {
				styles.border = `1px solid ${convertToHex(props.iconColor)}`
			}
			else {
				styles.border = `1px solid ${convertToHex(props.borderColor)}`
			}
		}
		if (props.size !== undefined) {
			styles.height = props.size
			styles.width = props.size
		}
		if (props.widthAuto) {
			styles.width = 'auto'
		}

		return styles
	})

	const slotIconStyles = computed<IndexedObject | undefined>(() => {
		const styles: IndexedObject = {
			backgroundColor: convertToHex(props.iconBgColor),
			borderRadius: '50%',
			color: convertToHex(props.iconColor),
			padding: slotIconPadding.value,
		}
		if (props.size !== undefined) {
			styles.height = props.size
			styles.width = props.size
		}
		if (props.bordered) {
			if (props.borderColor === undefined) {
				styles.border = `1px solid ${convertToHex(props.iconColor)}`
			}
			else {
				styles.border = `1px solid ${convertToHex(props.borderColor)}`
			}
		}
		return styles
	})

	const slotIconPadding = computed<string>(() => {
		if (props.mdiPadding) {
			return props.mdiPadding
		}
		if (props.size || props.xLarge) {
			return '5px'
		}
		if (props.large) {
			return '4px'
		}
		if (props.small) {
			return '1px'
		}

		return '2px'
	})
</script>

<template>
	<span class="amelipro-icon">
		<span
			v-if="!$slots.default"
			aria-hidden="true"
			:aria-label="label"
			class="amelipro-custom-icon custom-color"
			:class="{
				'small': small,
				'medium': medium,
				'large': large,
				'x-large': xLarge,
			}"
			focusable="false"
			role="img"
			:style="customStyles"
		>
			<span
				v-if="themeIcon"
				v-html="themeIcon"
			/>
		</span>

		<span
			v-else
			class="amelipro-external-icon"
			:class="{
				'small': small,
				'medium': medium,
				'large': large,
				'x-large': xLarge,
			}"
			:style="slotIconStyles"
		>
			<VIcon
				aria-hidden="true"
				:color="iconColor"
				size="100%"
				style="display: block;"
			>
				<slot />
			</VIcon>
		</span>
	</span>
</template>

<style lang="scss" scoped>
$default: 1.25rem;
$small: 1rem;
$medium: 1.25rem;
$large: 1.5rem;
$xlarge: 2rem;

.amelipro-custom-icon {
	position: relative;

	:deep(svg) {
		left: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		position: relative;

		& .shape-color {
			fill: v-bind(currentIconColor) !important;
		}

		& .circle-color {
			fill: v-bind(currentIconBgColor) !important;
		}
	}

	&.custom-color svg {
		fill: v-bind(currentIconColor) !important;
	}
}

.amelipro-custom-icon,
.amelipro-external-icon {
	display: inline-block;
	vertical-align: middle;
	width: $default;
	height: $default;

	&.small {
		width: $small;
		height: $small;
	}

	&.medium {
		width: $medium;
		height: $medium;
	}

	&.large {
		width: $large;
		height: $large;
	}

	&.x-large {
		width: $xlarge;
		height: $xlarge;
	}
}

.amelipro-external-icon {
	:deep(.v-icon__svg) {
		fill: v-bind(currentIconColor) !important;
	}
}
</style>
