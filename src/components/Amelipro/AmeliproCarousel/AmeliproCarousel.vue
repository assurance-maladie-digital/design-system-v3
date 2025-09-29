<script setup lang="ts">
	import { type PropType, computed, onMounted, onUpdated, ref } from 'vue'
	import AmeliproCarouselItem from './AmeliproCarouselItem/AmeliproCarouselItem.vue'
	import type { AmeliproCarouselListItem } from './types'
	import AmeliproIconBtn from '../AmeliproIconBtn/AmeliproIconBtn.vue'
	import type { IndexedObject } from '../types'

	const props = defineProps({
		duration: {
			type: Number,
			default: 0.3,
		},
		infiniteRotation: {
			type: Boolean,
			default: false,
		},
		items: {
			type: Array as PropType<AmeliproCarouselListItem[]>,
			default: () => [],
		},
		labelNextBtn: {
			type: String,
			default: 'Slide suivante',
		},
		labelPreviousBtn: {
			type: String,
			default: 'Slide précédente',
		},
		title: {
			type: String,
			required: true,
		},
		uniqueId: {
			type: String,
			required: true,
		},
	})

	const ameliproCarouselItems = ref<AmeliproCarouselListItem[]>()
	const currentElement = ref(0)

	const carouselTrackStyles = computed<IndexedObject>(() => {
		const styles: IndexedObject = {
			maxWidth: `calc(100% * ${props.items.length})`,
			transform: `translateX(calc((-${currentElement.value} / ${props.items.length}) * 100%))`,
			transition: `all ${props.duration}s ease-out`,
			width: `calc(100% * ${props.items.length})`,
		}

		return styles
	})

	const emit = defineEmits(['click-event', 'click-next', 'click-previous'])

	const emitClickEvent = (id: string): void => {
		emit('click-event', id)
	}

	const nextSlide = (): void => {
		if (currentElement.value < props.items.length - 1) {
			currentElement.value += 1
		}
		else if (currentElement.value === props.items.length - 1 && props.infiniteRotation) {
			currentElement.value = 0
		}
		emit('click-next')
	}

	const previousSlide = (): void => {
		if (currentElement.value > 0) {
			currentElement.value -= 1
		}
		else if (currentElement.value === 0 && props.infiniteRotation) {
			currentElement.value = props.items.length - 1
		}
		emit('click-previous')
	}

	const setFocusableElement = (): void => {
		const carousel = document.querySelector(`#${props.uniqueId}`)
		if (carousel !== null) {
			const selection = carousel.querySelectorAll('.hide')
			if (selection !== null) {
				selection.forEach((element) => {
					const elementSelections = element.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled]), details:not([disabled]), summary:not(:disabled)')
					if (elementSelections !== null) {
						elementSelections.forEach((elementSelection) => {
							elementSelection.setAttribute('tabindex', '-1')
						})
					}
				})
			}
			const current = carousel.querySelector(`#${props.uniqueId}-item-${currentElement.value}`)
			if (current !== null) {
				const elementSelection = current.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled]), details:not([disabled]), summary:not(:disabled)')

				if (elementSelection !== null) {
					elementSelection.forEach((element) => {
						element.setAttribute('tabindex', '0')
					})
				}
			}
		}
	}

	onMounted(() => {
		setFocusableElement()
	})

	onUpdated(() => {
		setFocusableElement()
	})
</script>

<template>
	<section
		:id="uniqueId"
		:aria-label="title"
		aria-roledescription="carousel"
		class="carousel"
	>
		<AmeliproIconBtn
			:aria-controls="`${uniqueId}-items`"
			:btn-title="labelPreviousBtn"
			class="btn-previous"
			:disabled="currentElement === 0 && !infiniteRotation ? true : undefined"
			icon="chevronLeft"
			icon-bg-color="transparent"
			icon-color="ap-blue-darken-1"
			icon-hover-bg-color="transparent"
			icon-hover-color="ap-blue-darken-2"
			large
			type="button"
			:unique-id="`${uniqueId}-previous`"
			@click="previousSlide()"
		/>

		<AmeliproIconBtn
			:aria-controls="`${uniqueId}-items`"
			:btn-title="labelNextBtn"
			class="btn-next"
			:disabled="currentElement === items.length - 1 && !infiniteRotation ? true : undefined"
			icon="chevronRight"
			icon-bg-color="transparent"
			icon-color="ap-blue-darken-1"
			icon-hover-bg-color="transparent"
			icon-hover-color="ap-blue-darken-2"
			large
			type="button"
			:unique-id="`${uniqueId}-next`"
			@click="nextSlide()"
		/>

		<div
			:id="`${uniqueId}-items`"
			aria-live="polite"
			class="carousel-items"
		>
			<div
				class="d-flex align-center carousel__track"
				:style="carouselTrackStyles"
			>
				<AmeliproCarouselItem
					v-for="(item, index) in items"
					:key="index"
					ref="ameliproCarouselItems"
					:aria-label="`${index + 1} sur ${items.length}`"
					:href="item.href"
					:img-alt="item.imgAlt"
					:img-src="item.imgSrc"
					:is-active="currentElement === index"
					:style="`width: calc((1 / ${items.length}) * 100%);`"
					:to="item.to"
					:unique-id="`${uniqueId}-item-${index}`"
					@click-event="emitClickEvent(`${uniqueId}-item-${index}`)"
				>
					<!-- :style="currentElement === index ? undefined : 'visibility: hidden;'" -->
					<slot :name="`${uniqueId}-slot-item-${index}`">
						<slot
							name="item"
							v-bind="item"
						/>
					</slot>
				</AmeliproCarouselItem>
			</div>
		</div>

		<div
			:id="`${uniqueId}-dots`"
			class="d-flex justify-center align-center carousel-dots"
		>
			<span
				v-for="(item, index) in items"
				:key="index"
				:aria-hidden="true"
				class="mx-2 carousel-dot"
				:class="index === currentElement ? 'active-dot' : undefined"
			/>
		</div>
	</section>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

.v-btn {
	&.btn-previous,
	&.btn-next {
		&:disabled {
			color: apTokens.$ap-blue-darken1 !important;
			background-color: transparent !important;
			opacity: 0.7;
			cursor: default;

			& .v-icon {
				color: apTokens.$ap-blue-darken1 !important;
			}
		}
	}
}

.carousel {
	position: relative;
	width: 100%;
}

.carousel-items {
	position: relative;
	width: calc(100% - 80px);
	margin: 0 40px;
	overflow: hidden;
}

.btn-previous,
.btn-next {
	position: absolute;
	top: calc(50% - 20px);
}

.btn-previous {
	left: 0;
}

.btn-next {
	right: 0;
}

.carousel-dots {
	margin-top: 1.5rem;
}

.carousel-dot {
	width: 1rem;
	height: 1rem;
	border-radius: 50%;
	border: 1px solid apTokens.$ap-blue-darken1;
	background-color: apTokens.$ap-white;

	&.active-dot {
		background-color: apTokens.$ap-blue-darken1;
	}
}
</style>
