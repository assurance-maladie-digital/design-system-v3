<script setup lang="ts">
	import { computed, useSlots } from 'vue'
	import type { IndexedObject } from '../types'
	import { convertToHex } from '@/utils/functions/convertToHex'
	import { useDisplay } from 'vuetify'

	const props = defineProps({
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
		cardTitle: {
			type: String,
			default: undefined,
		},
		classes: {
			type: String,
			default: undefined,
		},
		contentClasses: {
			type: String,
			default: undefined,
		},
		divider: {
			type: Boolean,
			default: true,
		},
		headerRightWidth: {
			type: String,
			default: '50%',
		},
		noCardHeader: {
			type: Boolean,
			default: false,
		},
		rightPart: {
			type: Boolean,
			default: false,
		},
		rightPartClasses: {
			type: String,
			default: undefined,
		},
		rightPartWidth: {
			type: String,
			default: '25%',
		},
		titleColor: {
			type: String,
			default: 'ap-grey-darken-1',
		},
		titleLevel: {
			type: Number,
			default: 2,
		},
		uniqueId: {
			type: String,
			default: undefined,
		},
	})

	const computedContentClass = computed(() => {
		const classes = { 'amelipro-card__content--left': props.rightPart } as Record<string, boolean>
		if (props.contentClasses) {
			props.contentClasses.split(' ').forEach((className: string) => {
				classes[className] = true
			})
		}
		return classes
	})

	const { mdAndUp } = useDisplay()
	const slots = useSlots()
	const cardTitleStyle = computed(() => ({ color: convertToHex(props.titleColor) }))
	const borderColorValue = computed(() => convertToHex(props.borderColor))

	const generalCardStyles = computed(() => {
		const cardStyle: IndexedObject = { backgroundColor: `${convertToHex(props.cardColor)}` }

		if (props.bordered) {
			cardStyle.border = `1px solid ${borderColorValue.value}`
		}

		return cardStyle
	})

	const cardHeaderStyles = computed(() => {
		if (props.divider && !props.noCardHeader) {
			return { borderBottom: `1px solid ${borderColorValue.value}` }
		}
		return undefined
	})

	const hasRightSlot = computed((): boolean => Boolean(slots.headerRight))

	const headerLeftStyles = computed(() => {
		if (hasRightSlot.value && mdAndUp.value) {
			return {
				width: `calc( 100% - (${props.headerRightWidth} + 10px))`,
				marginRight: '10px',
			}
		}
		return { width: '100%' }
	})

	const headerRightStyles = computed(() => {
		if (hasRightSlot.value && mdAndUp.value) {
			return {
				width: `calc(${props.headerRightWidth} - 10px)`,
				marginLeft: '10px',
			}
		}
		return { width: '100%' }
	})

	const rightPartStyle = computed(() => {
		if (mdAndUp.value) {
			return {
				maxWidth: props.rightPartWidth,
				minWidth: props.rightPartWidth,
				width: props.rightPartWidth,
			}
		}
		return { width: '100%' }
	})

	const leftPartWidth = computed(() => {
		if (props.rightPart && mdAndUp.value) {
			return {
				maxWidth: `calc( 100% - ${props.rightPartWidth} )`,
				minWidth: `calc( 100% - ${props.rightPartWidth} )`,
				width: `calc( 100% - ${props.rightPartWidth} )`,
			}
		}

		return { width: '100%' }
	})
</script>

<template>
	<div
		:id="uniqueId ? `${uniqueId}-container` : undefined"
		class="amelipro-card w-100 d-flex flex-column flex-md-row"
		:class="classes"
		:style="generalCardStyles"
	>
		<div
			:id="uniqueId ? `${uniqueId}-left-part` : undefined"
			class="amelipro-card__left-part"
			:style="leftPartWidth"
		>
			<div
				v-if="!noCardHeader"
				:id="uniqueId ? `${uniqueId}-header` : undefined"
				class="amelipro-card__header w-100"
				:class="{
					'amelipro-card__header--left': rightPart,
				}"
			>
				<div
					class="w-100 d-flex flex-column flex-sm-row align-sm-center amelipro-card__header-content"
					:style="cardHeaderStyles"
				>
					<div
						:id="uniqueId ? `${uniqueId}-header-left-part` : undefined"
						class="amelipro-card__header-slot-wrapper--left"
						:style="headerLeftStyles"
					>
						<slot name="headerLeft">
							<p
								v-if="cardTitle"
								:id="uniqueId ? `${uniqueId}-title` : undefined"
								:aria-level="titleLevel"
								class="text-h2 mb-0 amelipro-card__title"
								role="heading"
								:style="cardTitleStyle"
							>
								{{ cardTitle }}
							</p>
						</slot>
					</div>

					<div
						v-if="hasRightSlot"
						:id="uniqueId ? `${uniqueId}-header-right-part` : undefined"
						class="amelipro-card__header__slot-wrapper--right"
						:style="headerRightStyles"
					>
						<slot name="headerRight" />
					</div>
				</div>
			</div>

			<slot name="fullSizeImg" />

			<div
				:id="uniqueId ? `${uniqueId}-content` : undefined"
				class="amelipro-card__content"
				:class="computedContentClass"
			>
				<slot />
			</div>
		</div>

		<div
			v-if="rightPart"
			:id="uniqueId ? `${uniqueId}-right-part` : undefined"
			class="amelipro-card__right-part"
			:style="rightPartStyle"
		>
			<div
				class="w-100 amelipro-card__right-part-content"
				:class="rightPartClasses"
			>
				<slot name="rightPartContent" />
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.amelipro-card {
	display: block;
	position: relative;
	max-width: 100%;
	border-radius: 0.75rem;
	text-decoration: none;
	overflow-wrap: break-word;
	white-space: normal;
}

.amelipro-card__header {
	padding-top: 1rem;
	padding-left: 1rem;
	padding-right: 1rem;
	padding-bottom: 0 !important;
	word-break: break-all;
}

.amelipro-card__header-content {
	padding-bottom: 1rem;
}

.amelipro-card__content {
	width: 100%;
	padding: 1rem;
	font-size: 0.875rem;
	font-weight: 400;

	@media (width <= 959.99px) {
		padding-left: 1rem;
		padding-right: 1rem;
		padding-bottom: 1rem;
	}

	@media (width <= 599.99px) {
		padding-left: 0.75rem;
		padding-right: 0.75rem;
		padding-bottom: 1rem;
	}
}

.amelipro-card__header--left,
.amelipro-card__content--left {
	@media (width >= 960px) {
		padding-right: 1rem;
	}
}

.amelipro-card__header-slot-wrapper--left {
	display: inline-block;
}

.amelipro-card__right-part {
	padding: 1rem 1rem 1rem 0;

	@media (width <= 959.99px) {
		padding: 0 1rem 1rem;
	}

	@media (width <= 599.99px) {
		padding: 0 0.75rem 0.75rem;
	}
}

.amelipro-card__right-part-content {
	@media (width >= 960px) {
		padding-left: 1rem;
		min-height: 100%;
		border-left: 1px solid v-bind(borderColorValue);
	}

	@media (width <= 959.99px) {
		padding-top: 1rem;
		border-top: 1px solid v-bind(borderColorValue);
	}

	@media (width <= 599.99px) {
		padding-top: 0.75rem;
	}
}
</style>
