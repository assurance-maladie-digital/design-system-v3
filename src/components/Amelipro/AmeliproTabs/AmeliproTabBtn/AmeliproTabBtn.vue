<script setup lang="ts">
	import { computed, ref } from 'vue'
	import type { IndexedObject } from '../../types'
	import { convertToHex } from '@/utils/functions/convertToHex'

	const props = defineProps({
		controls: {
			type: String,
			required: true,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		notification: {
			type: Number,
			default: undefined,
		},
		pills: {
			type: Boolean,
			default: false,
		},
		selected: {
			type: Boolean,
			default: false,
		},
		tabindex: {
			type: Number,
			required: true,
		},
		uniqueId: {
			type: String,
			required: true,
		},
	})

	const emit = defineEmits(['click'])
	const focused = ref(false)
	const emitClickEvent = () => emit('click')

	const selectedValue = computed<'true' | 'false' | undefined >(() => {
		if (props.selected) {
			return 'true'
		}
		else if (!props.selected) {
			return 'false'
		}
		return undefined
	})

	const style = computed<IndexedObject>(() => {
		const btnStyles: IndexedObject = {
			backgroundColor: convertToHex('ap-blue-lighten-3'),
			border: `1px solid ${convertToHex('ap-grey-lighten-2')}`,
			color: convertToHex('ap-blue-darken-1'),
		}

		if (props.disabled && !props.selected) {
			btnStyles.backgroundColor = convertToHex('ap-grey-lighten-2')
			btnStyles.color = convertToHex('ap-grey-darken-1')
			btnStyles.cursor = 'default'
		}

		if (props.selected && !props.disabled) {
			btnStyles.color = convertToHex('ap-white')
			btnStyles.backgroundColor = convertToHex('ap-blue-darken-1')
			btnStyles.border = `1px solid ${convertToHex('ap-blue-darken-1')}`
		}

		return btnStyles
	})

	const pillStyle = computed<IndexedObject>(() => {
		const btnStyles: IndexedObject = {
			backgroundColor: convertToHex('ap-white'),
			border: `1px solid ${convertToHex('ap-blue-darken-1')}`,
			color: convertToHex('ap-blue-darken-1'),
			marginBottom: '8px',
			position: 'relative',
		}

		if (props.disabled && !props.selected) {
			btnStyles.color = convertToHex('ap-grey-darken-1')
			btnStyles.backgroundColor = convertToHex('ap-grey-lighten-2')
			btnStyles.border = `1px solid ${convertToHex('ap-grey-darken-1')}`
		}

		if (props.selected && !props.disabled) {
			btnStyles.color = convertToHex('ap-blue-darken-1')
			btnStyles.backgroundColor = convertToHex('ap-blue-lighten-3')
		}

		return btnStyles
	})

	const notificationValue = computed<string | undefined>(() => {
		if (props.notification && props.notification > 0 && props.notification < 10) {
			return props.notification.toString()
		}
		else if (props.notification && props.notification >= 10) {
			return '9+'
		}
		return undefined
	})
</script>

<template>
	<button
		:id="uniqueId"
		:aria-controls="controls"
		:aria-selected="selectedValue"
		class="amelipro-tab__btn"
		:class="{
			'mr-2 amelipro-tab__btn--pills': pills,
			'selected': selected,
			'px-4 py-2 text-uppercase': !pills,
			'disabled': disabled
		}"
		:disabled="disabled"
		role="tab"
		:style="pills ? pillStyle : style"
		:tabindex="tabindex"
		type="button"
		@blur="focused = false"
		@click="emitClickEvent"
		@focus="focused = true"
	>
		<span
			:id="`${uniqueId}-notification-content`"
			class="d-flex align-center amelipro-tab__btn__content"
		>
			<slot />

			<span
				v-if="notification"
				:id="`${uniqueId}-notification-text`"
				class="d-block ml-4 ap-white--text amelipro-tab__btn-notification"
			>
				{{ notificationValue }}
			</span>
		</span>
	</button>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

.check-icon {
	position: absolute;
	top: calc(50% - 18px);
	left: 0;
}

.amelipro-tab__btn--pills {
	position: relative;
	border-radius: apTokens.$tabs-pill-radius;
	cursor: pointer;
	padding: apTokens.$tabs-pill-padding-y apTokens.$tabs-pill-padding-x;
	font-weight: apTokens.$tabs-pill-font-weight;

	&.selected {
		&::after {
			position: absolute;
			top: 0.8rem;
			left: 0.75rem;
			width: 1rem;
			height: 0.5rem;
			border-bottom: 2px solid apTokens.$ap-blue-darken1;
			border-left: 2px solid apTokens.$ap-blue-darken1;
			transform: rotate(-50deg);
			content: '';
		}
	}

	&.disabled {
		cursor: default;
	}
}

.amelipro-tab__btn-notification {
	position: relative;
	z-index: 1;

	&::before {
		content: '';
		position: absolute;
		top: calc(50% - 0.8rem);
		left: calc(50% - 0.8rem);
		width: 1.6rem;
		height: 1.6rem;
		border-radius: 50%;
		background-color: apTokens.$ap-pink;
		z-index: -1;
	}
}
</style>
