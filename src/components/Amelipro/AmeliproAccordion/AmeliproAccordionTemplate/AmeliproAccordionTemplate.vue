<script setup lang="ts">
	import { computed, ref, useSlots } from 'vue'
	import AmeliproIcon from '../../AmeliproIcon/AmeliproIcon.vue'
	import type { IndexedObject } from '../../types'
	import { convertToHex } from '@/utils/functions/convertToHex'
	import { useDisplay } from 'vuetify'

	const props = defineProps({
		accordionTitle: {
			type: String,
			required: true,
		},
		borderColor: {
			type: String,
			default: 'ap-grey-lighten-2',
		},
		bordered: {
			type: Boolean,
			default: true,
		},
		cardColor: {
			type: String,
			default: 'ap-white',
		},
		headerRightWidth: {
			type: String,
			default: '50%',
		},
		hideSeparator: {
			type: Boolean,
			default: false,
		},
		isOpen: {
			type: Boolean,
			default: false,
		},
		titleLevel: {
			type: Number,
			default: 2,
		},
		titleUppercase: {
			type: Boolean,
			default: false,
		},
		uniqueId: {
			type: String,
			required: true,
		},
	})

	const { smAndUp } = useDisplay()
	const focus = ref(false)
	const hover = ref(false)
	const borderHexColor = computed<string>(() => convertToHex(props.borderColor))
	const generalAccordionStyles = computed<IndexedObject>(() => {
		const cardStyle: IndexedObject = { backgroundColor: `${convertToHex(props.cardColor)}` }

		if (props.bordered) {
			cardStyle.border = `1px solid ${borderHexColor.value}`
		}

		return cardStyle
	})

	const slots = useSlots()
	const hasRightSlot = computed((): boolean => Boolean(slots.headerRight))

	const headerLeftStyles = computed<IndexedObject>((): IndexedObject => {
		if (hasRightSlot.value && smAndUp.value) {
			return {
				width: `calc(100% - (${props.headerRightWidth} + 10px))`,
				marginRight: '10px',
			}
		}
		return { width: '100%' }
	})

	const headerRightStyles = computed<IndexedObject>((): IndexedObject => {
		if (hasRightSlot.value && smAndUp.value) {
			return {
				width: `calc(${props.headerRightWidth} - 10px)`,
				marginLeft: '10px',
			}
		}
		return { width: '100%' }
	})

	const emit = defineEmits(['open-close'])
	const emitOpenCloseEvent = (): void => {
		emit('open-close', props.uniqueId, !props.isOpen)
	}
</script>

<template>
	<div
		:id="`${uniqueId}-container`"
		class="amelipro-accordion w-100 mb-4"
		:class="{
			'amelipro-accordion--opened': isOpen
		}"
		:style="generalAccordionStyles"
	>
		<div
			:id="`${uniqueId}-header`"
			class="amelipro-accordion__header w-100 d-flex flex-column flex-sm-row align-center"
		>
			<div
				class="btn-wrapper"
				:style="headerLeftStyles"
			>
				<p
					:id="uniqueId + 'title'"
					:aria-level="titleLevel"
					class="font-weight-semibold text-h3 mb-0"
					role="heading"
				>
					<button
						:id="`${uniqueId}-header-btn-open-close`"
						:aria-controls="uniqueId"
						:aria-expanded="isOpen === true ? 'true' : 'false'"
						class="text-ap-grey-darken-1 text-left d-inline-flex align-center accordion-btn font-weight-semibold"
						:class="titleUppercase ? 'text-uppercase' : undefined"
						type="button"
						@blur="focus = false"
						@click="emitOpenCloseEvent()"
						@focus="focus = false"
						@mouseenter="hover = true"
						@mouseleave="hover = false"
					>
						<AmeliproIcon
							class="mr-2 accordion-icon"
							:icon="isOpen ? 'triangleUp' : 'triangleDown'"
							icon-bg-color="transparent"
							:icon-color="hover ? 'ap-blue darken-2' : 'ap-blue darken-1'"
							size="11px"
							:unique-id="`${uniqueId}-icon`"
						/>

						{{ accordionTitle }}
					</button>
				</p>
			</div>

			<div
				v-if="hasRightSlot"
				class="right-slot"
				:style="headerRightStyles"
			>
				<slot name="headerRight" />
			</div>
		</div>
		<div
			v-show="isOpen === true"
			:id="uniqueId"
			:aria-labelledby="uniqueId + 'title'"
			class="amelipro-accordion__wrapper"
			role="region"
		>
			<div
				class="w-100 amelipro-accordion__content text-ap-grey-darken-1"
				:style="!hideSeparator ? `border-top: 1px solid ${borderHexColor}` : undefined"
			>
				<slot />
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

.accordion-btn {
	padding: 0;
	background-color: transparent;
	border: 0;

	&:focus {
		outline: 1px dotted apTokens.$ap-grey-darken1;
	}
}

.amelipro-accordion {
	display: block;
	position: relative;
	max-width: 100%;
	border-radius: apTokens.$card-radius;
	text-decoration: none;
	overflow-wrap: break-word;
	white-space: normal;
}

.amelipro-accordion__header {
	padding: apTokens.$card-padding-desktop;
	word-break: break-all;

	@media #{apTokens.$media-down-md} {
		padding: apTokens.$card-padding-tablet;
	}

	@media #{apTokens.$media-down-sm} {
		padding: apTokens.$card-padding-mobile;
	}

	.btn-wrapper {
		display: inline-block;
	}

	.amelipro-accordion--opened & {
		padding-bottom: apTokens.$card-padding-mobile;
	}
}

.amelipro-accordion__wrapper {
	width: 100%;
	padding: 0 apTokens.$card-padding-desktop;
	font-size: apTokens.$font-size-xs;
	font-weight: apTokens.$ap-font-weight-regular;

	@media #{apTokens.$media-down-md} {
		padding: 0 apTokens.$card-padding-tablet;
	}

	@media #{apTokens.$media-down-sm} {
		padding: 0 apTokens.$card-padding-mobile;
	}
}

.amelipro-accordion__content {
	padding-top: apTokens.$card-padding-desktop;
	padding-bottom: apTokens.$card-padding-tablet;

	@media #{apTokens.$media-down-sm} {
		padding-bottom: apTokens.$card-padding-mobile;
	}
}

.accordion-icon {
	& :deep(.amelipro-custom-icon) {
		height: auto !important;
	}
}
</style>
