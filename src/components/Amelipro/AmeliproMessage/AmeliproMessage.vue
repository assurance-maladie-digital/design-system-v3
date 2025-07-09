<script setup lang="ts">
	import { computed, onMounted, ref } from 'vue'
	import AmeliproIcon from '../AmeliproIcon/AmeliproIcon.vue'
	import AmeliproIconBtn from '../AmeliproIconBtn/AmeliproIconBtn.vue'
	import { AmeliproMessageTypes } from './AmeliproMessageTypes'
	import { convertToHex } from '@/utils/functions/convertToHex'

	const props = defineProps({
		alignStart: {
			type: Boolean,
			default: false,
		},
		borderLeftMessage: {
			type: Boolean,
			default: false,
		},
		borderLeftMessageTitle: {
			type: String,
			default: undefined,
		},
		color: {
			type: String,
			default: undefined,
		},
		dark: {
			type: Boolean,
			default: false,
		},
		dismissible: {
			type: Boolean,
			default: false,
		},
		icon: {
			type: String,
			default: undefined,
		},
		iconBgColor: {
			type: String,
			default: undefined,
		},
		iconColor: {
			type: String,
			default: undefined,
		},
		maxWidth: {
			type: String,
			default: undefined,
		},
		noIcon: {
			type: Boolean,
			default: false,
		},
		text: {
			type: Boolean,
			default: false,
		},
		textColor: {
			type: String,
			default: undefined,
		},
		type: {
			default: 'info',
			type: String,
			validator(value: string): boolean {
				return ['info', 'error', 'warning', 'success'].includes(value.toLowerCase())
			},
		},
		uniqueId: {
			type: String,
			default: undefined,
		},
		value: {
			type: Boolean,
			default: true,
		},
		width: {
			type: String,
			default: '100%',
		},
	})

	const variant = computed<NonNullable<'flat' | 'text' | 'elevated' | 'tonal' | 'outlined' | 'plain'> | undefined>(() => (props.text ? 'text' : 'flat'))
	const visible = ref(props.value)
	const role = computed(() => (props.type === 'error' ? 'alert' : undefined))
	const iconName = computed(() => props.icon || AmeliproMessageTypes[props.type].icon)

	const colorValue = computed(() => {
		if (props.text) {
			return convertToHex(props.textColor
				|| AmeliproMessageTypes[props.type].textColor
				|| props.color
				|| AmeliproMessageTypes[props.type].color)
		}
		return convertToHex(props.color || AmeliproMessageTypes[props.type].color)
	})

	const colorBorderLeftMessageTitle = computed(() => convertToHex(props.textColor
		|| AmeliproMessageTypes[props.type].textColor
		|| props.color
		|| AmeliproMessageTypes[props.type].color))

	const iconBgColorValue = computed(() => props.iconBgColor || AmeliproMessageTypes[props.type].iconBgColor || AmeliproMessageTypes[props.type].color)

	const iconColorValue = computed(() => props.iconColor || 'ap-white')

	const isDark = computed(() => props.dark || AmeliproMessageTypes[props.type].type === 'dark')

	const iconCloseColor = computed(() => {
		if (isDark.value || props.text || props.borderLeftMessage) {
			return convertToHex('ap-grey-darken-1')
		}
		return convertToHex('ap-white')
	})

	const emit = defineEmits(['click:close'])

	const emitCloseEvent = () => {
		visible.value = false
		emit('click:close')
	}

	onMounted(() => {
		visible.value = props.value
	})
</script>

<template>
	<VAlert
		:id="uniqueId"
		v-model="visible"
		:border="borderLeftMessage ? 'start' : undefined"
		:border-color="borderLeftMessage ? colorValue : undefined"
		class="text-body-1 amelipro-message"
		:class="{
			'text-ap-white': !isDark && !text,
			'text-ap-grey-darken-1': isDark && !text,
			'pa-0': text,
			'pa-3 pa-sm-4': !text && !borderLeftMessage,
			'amelipro-message__radius': !text,
			'message-align-start': alignStart,
			'px-6 py-3 bg-ap-grey-lighten-6': borderLeftMessage,
		}"
		:color="colorValue"
		dense
		elevation="0"
		:max-width="maxWidth"
		:role="role"
		:variant="variant"
		:width="width"
		v-bind="$attrs"
	>
		<template
			v-if="!noIcon && !borderLeftMessage"
			#prepend
		>
			<AmeliproIcon
				bordered
				class="mr-2 amelipro-message__icon"
				:icon="iconName"
				:icon-bg-color="iconBgColorValue"
				:icon-color="isDark ? 'ap-grey-darken-1' : iconColorValue"
				large
				:unique-id="uniqueId ? `${uniqueId}-icon` : undefined"
			/>
		</template>

		<slot name="default">
			<div class="w-100 d-flex align-center mb-2">
				<AmeliproIcon
					v-if="!noIcon && borderLeftMessage"
					class="mr-2 amelipro-message__icon"
					:icon="iconName"
					:icon-bg-color="iconBgColorValue"
					:icon-color="isDark ? 'ap-grey-darken-1' : iconColorValue"
					large
					:unique-id="uniqueId ? `${uniqueId}-icon` : undefined"
				/>

				<p
					v-if="borderLeftMessageTitle"
					class="text-h5 mb-0"
					:style="`color: ${colorBorderLeftMessageTitle};`"
				>
					{{ borderLeftMessageTitle }}
				</p>
			</div>

			<slot name="borderLeftMessageContent" />
		</slot>

		<template
			v-if="dismissible"
			#close
		>
			<AmeliproIconBtn
				btn-label="Fermer le message"
				class="amelipro-message__close-btn"
				icon="closeNoCircle"
				icon-bg-color="transparent"
				:icon-color="iconCloseColor"
				icon-hover-bg-color="transparent"
				:icon-hover-color="iconCloseColor"
				large
				title="Fermer le message"
				:unique-id="uniqueId ? `${uniqueId}-dismiss-btn` : undefined"
				@click="emitCloseEvent"
			/>
		</template>
	</VAlert>
</template>

<style lang="scss" scoped>
.v-alert--text {
	&::before {
		background-color: transparent !important;
		opacity: 1 !important;
	}
}

.v-alert {
	display: flex;
	line-height: 1.4;

	& :deep(.v-alert__prepend) {
		margin-inline-end: 0;
	}

	& :deep(.v-alert__border) {
		opacity: 1 !important;
		border-left-width: 12px !important;
	}

	& :deep(.v-alert__content) {
		width: 100% !important;
	}

	&.amelipro-message__radius {
		border-radius: 12px !important;
	}

	&.message-align-start {
		align-items: flex-start;

		& :deep(.v-alert__content) {
			align-self: flex-start;
		}
	}

	:deep(button):focus {
		outline-color: v-bind(iconCloseColor) !important;
	}
}
</style>
