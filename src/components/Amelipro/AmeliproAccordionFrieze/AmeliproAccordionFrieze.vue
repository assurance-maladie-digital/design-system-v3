<script setup lang="ts">
	import { type PropType, computed, onMounted, ref, watch } from 'vue'
	import AmeliproIcon from '../AmeliproIcon/AmeliproIcon.vue'
	import AmeliproIconBtn from '../AmeliproIconBtn/AmeliproIconBtn.vue'
	import { useDisplay } from 'vuetify'
	import type { IAmeliproAccordionFriezeItem } from './types'
	import type { IndexedObject } from '../types'

	const props = defineProps({
		defaultOpenedAccordion: {
			type: String,
			default: undefined,
		},
		defaultSlide: {
			type: Number,
			default: undefined,
		},
		duration: {
			type: Number,
			default: 0.3,
		},
		fillSlideOrientation: {
			default: 'left',
			type: String,
			validator(value: string): boolean {
				return ['left', 'right'].includes(value.toLowerCase())
			},
		},
		items: {
			type: Array as PropType<IAmeliproAccordionFriezeItem[]>,
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

	const { xs, mdAndUp } = useDisplay()
	const currentSlide = ref(0)
	const currentOpenedAccordion = ref()
	const friezeItemsStyles = computed((): IndexedObject => {
		const styles: IndexedObject = { width: 'calc(100% - 30px)' }

		if (currentSlide.value === 0) {
			styles.margin = '0 30px 0 0'
		}

		if (currentSlide.value === computedSlides.value.length - 1) {
			styles.margin = '0 0 0 30px'
		}

		if (currentSlide.value !== 0 && currentSlide.value !== computedSlides.value.length - 1) {
			styles.width = 'calc(100% - 60px)'
			styles.margin = '0 30px'
		}

		return styles
	})

	const itemPerSlide = computed(() => {
		const slideSize = ref(6)
		if (!mdAndUp.value && !xs.value) {
			slideSize.value = 3
		}
		if (xs.value) {
			slideSize.value = 1
		}

		return slideSize.value
	})

	const computedAccordionBtnWidth = computed((): IndexedObject => ({ width: `calc((1 / ${itemPerSlide.value}) * 100%)` }))

	const computedSlides = computed(() => {
		if (props.items.length > 0 && props.items.length <= 6) {
			return [props.items]
		}
		if (props.items.length > 6) {
			if (props.fillSlideOrientation === 'left') {
				const slideArray = props.items.reduce((resultArray: IAmeliproAccordionFriezeItem[][], item: IAmeliproAccordionFriezeItem, index: number) => {
					const arrayIndex = Math.floor(index / itemPerSlide.value)
					if (!resultArray[arrayIndex]) {
						resultArray[arrayIndex] = []
					}
					resultArray[arrayIndex].push(item)
					return resultArray
				}, [])
				return slideArray
			}
			if (props.fillSlideOrientation === 'right') {
				const currentItems = [...props.items]
				currentItems.reverse()
				const slideArray = currentItems.reduceRight((resultArray: IAmeliproAccordionFriezeItem[][], item: IAmeliproAccordionFriezeItem, index: number) => {
					const arrayIndex = Math.floor(index / itemPerSlide.value)
					if (!resultArray[arrayIndex]) {
						resultArray[arrayIndex] = []
					}
					resultArray[arrayIndex].push(item)
					return resultArray
				}, [])
				slideArray.reverse()
				return slideArray
			}
		}
		return []
	})

	const friezeTrackStyles = computed<IndexedObject>(() => {
		const styles: IndexedObject = {
			maxWidth: `calc(100% * ${computedSlides.value.length})`,
			transform: `translateX(calc((-${currentSlide.value} / ${computedSlides.value.length}) * 100%))`,
			transition: `all ${props.duration}s ease-out`,
			width: `calc(100% * ${computedSlides.value.length})`,
		}

		return styles
	})

	const emit = defineEmits(['open-close-event', 'click-next', 'click-previous'])

	const emitOpenCloseEvent = (id: string): void => {
		if (currentOpenedAccordion.value === id) {
			currentOpenedAccordion.value = undefined
		}
		else {
			currentOpenedAccordion.value = id
		}
		emit('open-close-event', `accordion-content--item-${id}__content`)
	}

	const nextSlide = (): void => {
		if (currentSlide.value < props.items.length - 1) {
			currentSlide.value += 1
		}
		emit('click-next')
	}

	const previousSlide = (): void => {
		if (currentSlide.value > 0) {
			currentSlide.value -= 1
		}
		emit('click-previous')
	}

	watch(() => computedSlides.value, (newValue, oldValue) => {
		if (currentOpenedAccordion.value === undefined && oldValue.length > 0) {
			const currentSlideContent = oldValue[currentSlide.value]
			const firstItemDisplayed = currentSlideContent[0]
			const lastItemDisplayed = currentSlideContent[currentSlideContent.length - 1]

			if (props.fillSlideOrientation === 'left') {
				newValue.forEach((slide, index) => {
					if (slide.some(item => JSON.stringify(item) === JSON.stringify(firstItemDisplayed))) {
						currentSlide.value = index
					}
				})
			}

			if (props.fillSlideOrientation === 'right') {
				newValue.forEach((slide, index) => {
					if (slide.some(item => JSON.stringify(item) === JSON.stringify(lastItemDisplayed))) {
						currentSlide.value = index
					}
				})
			}
		}
		else {
			const slideToShow = ref()
			newValue.forEach((slide, index) => {
				if (slide.some(item => item.uniqueId === currentOpenedAccordion.value)) {
					slideToShow.value = index
				}
			})
			currentSlide.value = slideToShow.value
		}
		if (currentSlide.value >= newValue.length) {
			currentSlide.value = newValue.length - 1
		}
		if (currentSlide.value < 0) {
			currentSlide.value = 0
		}
	})

	onMounted(() => {
		if (props.defaultOpenedAccordion) {
			currentOpenedAccordion.value = props.defaultOpenedAccordion
		}
		if (props.fillSlideOrientation === 'left' && !props.defaultSlide) {
			currentSlide.value = 0
		}
		if (props.fillSlideOrientation === 'right' && !props.defaultSlide) {
			currentSlide.value = computedSlides.value.length - 1
		}
		if (props.defaultSlide !== undefined) {
			currentSlide.value = props.defaultSlide
		}
	})
</script>

<template>
	<div :id="uniqueId">
		<section
			:id="`${uniqueId}-frieze`"
			:aria-label="title"
			aria-roledescription="carousel"
			class="frieze"
		>
			<AmeliproIconBtn
				v-if="currentSlide !== 0"
				:aria-controls="`${uniqueId}-items`"
				:btn-title="labelPreviousBtn"
				class="btn-previous"
				icon="chevronLeft"
				icon-bg-color="transparent"
				icon-color="ap-blue darken-1"
				icon-hover-bg-color="transparent"
				icon-hover-color="ap-blue darken-2"
				large
				:title="labelPreviousBtn"
				type="button"
				:unique-id="`${uniqueId}-previous`"
				@click="previousSlide()"
			/>

			<AmeliproIconBtn
				v-if="currentSlide !== computedSlides.length - 1"
				:aria-controls="`${uniqueId}-items`"
				:btn-title="labelNextBtn"
				class="btn-next"
				icon="chevronRight"
				icon-bg-color="transparent"
				icon-color="ap-blue darken-1"
				icon-hover-bg-color="transparent"
				icon-hover-color="ap-blue darken-2"
				large
				:title="labelNextBtn"
				type="button"
				:unique-id="`${uniqueId}-next`"
				@click="nextSlide()"
			/>

			<div
				:id="`${uniqueId}-items`"
				aria-live="polite"
				class="frieze-items"
				:style="friezeItemsStyles"
			>
				<div
					class="d-flex frieze__track"
					:style="friezeTrackStyles"
				>
					<div
						v-for="(slide, index) in computedSlides"
						:id="`${uniqueId}-slide-${index}`"
						:key="index"
						ref="FriezeItem"
						:aria-label="`${index + 1} sur ${computedSlides.length}`"
						aria-roledescription="slide"
						class="list-style-none d-flex align-center frieze__slide"
						:class="{
							'justify-end': fillSlideOrientation === 'right',
							'justify-start': fillSlideOrientation === 'left',
						}"
						role="group"
						:style="`width: calc((1 / ${computedSlides.length}) * 100%);`"
					>
						<div
							v-for="(item, subIndex) in computedSlides[index]"
							:key="subIndex"
							ref="FriezeItem"
							class="px-1 d-flex frieze__sub-item"
							:style="computedAccordionBtnWidth"
						>
							<div
								v-if="item.isEmpty"
								:id="`${uniqueId}-btn-${item.uniqueId}`"
								class="w-100 item-empty"
							>
								<span class="d-block font-weight-semibold">{{ item.title }}</span>
								<span class="d-flex justify-center align-center item-btn__link-style-text">
									{{ item.linkStyleText }}
								</span>
							</div>

							<button
								v-else
								:id="`${uniqueId}-btn-${item.uniqueId}`"
								:aria-controls="`accordion-content--item-${item.uniqueId}__content`"
								:aria-expanded="currentOpenedAccordion === item.uniqueId ? 'true' : 'false'"
								class="w-100 item-btn"
								:tabindex="currentSlide === index ? '0' : '-1'"
								@click="emitOpenCloseEvent(item.uniqueId)"
							>
								<span class="d-block font-weight-semibold">{{ item.title }}</span>
								<span class="d-flex justify-center align-center item-btn__link-style-text">
									{{ item.linkStyleText }}

									<AmeliproIcon
										class="ml-1"
										:icon="currentOpenedAccordion === item.uniqueId ? 'triangleUp' : 'triangleDown'"
										icon-bg-color="transparent"
										icon-color="ap-blue darken-1"
										size="10px"
										style="margin-top: -14px;"
										:unique-id="`${uniqueId}-btn-${item.uniqueId}-icon`"
									/>
								</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>

		<div class="frieze__accordion-content-wrapper">
			<div
				v-for="(item, index) in items"
				:id="`accordion--item-${item.uniqueId}`"
				:key="index"
			>
				<div v-if="!item.isEmpty">
					<div
						v-show="currentOpenedAccordion === item.uniqueId"
						:id="`accordion--item-${item.uniqueId}__content`"
						:aria-labelledby="`${uniqueId}-btn-${item.uniqueId}`"
						role="region"
					>
						<slot :name="`${uniqueId}-slot-slide-${index}-item-${item.uniqueId}`">
							<slot
								name="item"
								v-bind="item"
							/>
						</slot>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

.frieze {
	position: relative;
	width: 100%;
}

.frieze-items {
	position: relative;
	overflow: hidden;
}

.frieze__sub-item {
	min-height: 100%;
}

.item-btn {
	box-sizing: border-box !important;
	padding: 12px;
	border: 1px solid apTokens.$ap-grey-lighten3;
	border-radius: 8px;
	text-align: center;
	background-color: apTokens.$ap-white;

	&:hover,
	&:focus {
		padding: 11px 12px;
		background-color: apTokens.$ap-blue-lighten3;
		border: 2px solid apTokens.$ap-blue-darken1;
	}
}

.item-btn__link-style-text {
	color: apTokens.$ap-blue-darken1;
	font-size: apTokens.$font-size-xs;
	text-decoration: underline;
}

.item-empty {
	box-sizing: border-box !important;
	padding: 12px;
	border: 1px solid apTokens.$ap-grey-lighten2;
	border-radius: 8px;
	color: apTokens.$ap-grey;
	text-align: center;
	background-color: apTokens.$ap-grey-lighten2;

	& .item-btn__link-style-text {
		color: apTokens.$ap-grey;
	}
}

.btn-previous,
.btn-next {
	position: absolute;
	top: calc(50% - 12px);
}

.btn-previous {
	left: 0;
}

.btn-next {
	right: 0;
}
</style>
