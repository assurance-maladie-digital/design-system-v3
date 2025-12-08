<script setup lang="ts">
	import { computed, onMounted, type PropType, reactive, ref, watch } from 'vue'
	import { mdiChevronLeft, mdiChevronRight } from '@mdi/js'
	import AmeliproBtn from '../AmeliproBtn/AmeliproBtn.vue'
	import AmeliproIconBtn from '../AmeliproIconBtn/AmeliproIconBtn.vue'
	import type { AmeliproStep } from './types'
	import AmeliproStepBtn from './AmeliproStepBtn/AmeliproStepBtn.vue'
	import { useDisplay } from 'vuetify'

	const props = defineProps({
		centered: {
			type: Boolean,
			default: false,
		},
		finalStepBtn: {
			type: String,
			default: 'Transmettre',
		},
		hideBackBtn: {
			type: Boolean,
			default: false,
		},
		items: {
			type: Array as PropType<AmeliproStep[]>,
			default: () => [],
		},
		manualChangeStep: {
			type: Boolean,
			default: false,
		},
		nextBtnLabel: {
			type: String,
			default: 'Suivant',
		},
		noDefaultStyle: {
			type: Boolean,
			default: false,
		},
		previousBtnLabel: {
			type: String,
			default: 'Précédent',
		},
		uniqueId: {
			type: String,
			default: undefined,
		},
		value: {
			type: Number,
			default: 0,
		},
	})

	const { smAndUp, mdAndUp } = useDisplay()
	const emits = defineEmits(['submit', 'next-step', 'previous-step', 'change-step'])

	const chevronLeft = mdiChevronLeft
	const chevronRight = mdiChevronRight

	interface Data {
		selected: number
	}

	const AmeliproStepsBtns = ref<typeof AmeliproStepBtn[]>([])
	const data = reactive<Data>({ selected: props.value })

	watch(() => props.value, (value: number) => {
		data.selected = value
	})

	const hasNextItem = computed<boolean>(() => (props.items[data.selected + 1] !== undefined))

	onMounted(() => {
		setDefaultValues()
	})

	const finalStepEvent = (): void => {
		emits('submit')
	}

	const previousStepEvent = (index: number): void => {
		emits('previous-step', index)
		if (!props.manualChangeStep) {
			data.selected = index
		}
	}

	const nextStepEvent = (index: number): void => {
		emits('next-step', index)
		if (!props.manualChangeStep) {
			data.selected = index
		}
	}

	const changeStepEvent = (index: number): void => {
		emits('change-step', index)
		if (!props.manualChangeStep) {
			data.selected = index
		}
	}

	const setDefaultValues = (): void => {
		if (props.items[props.value]?.disabled) {
			data.selected = props.items.findIndex((item: AmeliproStep) => !item.disabled)
		}
	}

	// this function is usefull for services developers to change manually steps
	const focusChange = (): void => {
		const selectedButton = AmeliproStepsBtns.value[data.selected]
		if (selectedButton) {
			const buttonElement = selectedButton.$el as HTMLElement
			buttonElement.focus()
		}
	}

	defineExpose({ focusChange })
</script>

<template>
	<div
		:id="uniqueId ? `${uniqueId}-container` : undefined"
		class="amelipro-stepper"
	>
		<!-- desktop version -->
		<div
			v-if="mdAndUp"
			:id="uniqueId ? `${uniqueId}-container` : undefined"
			class="amelipro-stepper__headings--desktop"
		>
			<ol
				:id="uniqueId ? `${uniqueId}-step-list` : undefined"
				class="list-style-none d-flex flex-row align-end flex-nowrap amelipro-stepper__list"
				:class="{ 'justify-center': centered }"
				role="tablist"
			>
				<li
					v-for="(item, index) in items"
					:id="uniqueId ? `${uniqueId}-step-item-${index}` : undefined"
					:key="index"
					class="amelipro-stepper__item"
				>
					<AmeliproStepBtn
						ref="AmeliproStepsBtns"
						:disabled="item.disabled || (index !== data.selected && item.titleDisabled)"
						:is-active="index === data.selected && !item.disabled"
						:unique-id="uniqueId ? `${uniqueId}-step-btn-${index}` : undefined"
						@click="index === data.selected ? (() => {}) : changeStepEvent(index)"
					>
						<span class="d-sr-only">
							étape {{ index + 1 }}
						</span>

						{{ item.label }}

						<span
							aria-hidden="true"
							class="step-number"
							:class="{
								'step-number--active': data.selected === index,
								'step-number--disabled': item.disabled,
							}"
						>
							<span>
								{{ index + 1 }}
							</span>
						</span>
					</AmeliproStepBtn>
				</li>
			</ol>
		</div>

		<!-- Mobile version -->
		<div
			v-else
			:id="uniqueId ? `${uniqueId}-mobile` : undefined"
			class="amelipro-stepper__headings--mobile"
		>
			<div class="d-flex align-center justify-space-between">
				<div class="mr-4 stepper-mobile-btn-wrapper">
					<AmeliproIconBtn
						v-if="data.selected > 0 && !hideBackBtn"
						btn-label="Etape précédente"
						class="amelipro-stepper__btn--previous--mobile"
						icon-bg-color="ap-blue-darken-1"
						icon-color="ap-white"
						icon-hover-bg-color="ap-blue-darken-2"
						icon-hover-color="ap-white"
						size="30px"
						:unique-id="uniqueId ? `${uniqueId}-previous-btn` : undefined"
						@click="previousStepEvent(data.selected - 1)"
					>
						<template #icon>
							{{ chevronLeft }}
						</template>
					</AmeliproIconBtn>
				</div>

				<p
					:id="uniqueId ? `${uniqueId}-current-step-title` : undefined"
					class="ma-0 pa-4 active-step-title text-uppercase text-h5 amelipro-stepper__step-text"
				>
					<span class="d-sr-only">
						étape {{ data.selected + 1 }}
					</span>

					{{ items[data.selected] !== undefined ? items[data.selected].label : undefined }}

					<span
						aria-hidden="true"
						class="step-number step-number--active"
					>
						<span>
							{{ data.selected + 1 }}
						</span>
					</span>
				</p>

				<div class="ml-4 stepper-mobile-btn-wrapper">
					<AmeliproIconBtn
						v-if="data.selected < items.length - 1 && hasNextItem && !items[data.selected + 1].disabled && !items[data.selected + 1].titleDisabled"
						btn-label="Etape suivante"
						class="amelipro-stepper__btn--next--mobile"
						icon-bg-color="ap-blue-darken-1"
						icon-color="ap-white"
						icon-hover-bg-color="ap-blue-darken-2"
						icon-hover-color="ap-white"
						size="30px"
						:unique-id="uniqueId ? `${uniqueId}-next-btn` : undefined"
						@click="nextStepEvent(data.selected + 1)"
					>
						<template #icon>
							{{ chevronRight }}
						</template>
					</AmeliproIconBtn>
				</div>
			</div>
		</div>

		<div
			:id="uniqueId ? `${uniqueId}-current-step-content` : undefined"
			class="ap-white amelipro-stepper__content"
			:class="{ 'amelipro-stepper__content--default': !noDefaultStyle }"
		>
			<slot name="stepContent" />
		</div>

		<div
			:id="uniqueId ? `${uniqueId}-footer` : undefined"
			class="mt-4 d-flex flex-column flex-sm-row align-center amelipro-stepper__actions"
			:class="data.selected > 0 ? 'justify-sm-space-between' : 'justify-sm-end'"
		>
			<div class="order-sm-1 d-flex d-sm-inline-flex flex-column flex-sm-row next-step-btn__wrapper">
				<slot name="leftBtn" />

				<slot
					v-if="data.selected === items.length - 1"
					name="finalStepLeftBtn"
				/>

				<AmeliproBtn
					v-if="data.selected < items.length - 1"
					key="nextBtn"
					class="order-sm-1 amelipro-stepper__btn--next"
					:class="{ 'w-100': !smAndUp }"
					:disabled="hasNextItem && items[data.selected + 1].disabled"
					:unique-id="uniqueId ? `${uniqueId}-footer-next-btn` : undefined"
					@click="nextStepEvent(data.selected + 1)"
				>
					{{ nextBtnLabel }}

					<template #icon>
						{{ chevronRight }}
					</template>
				</AmeliproBtn>

				<AmeliproBtn
					v-if="data.selected === items.length - 1"
					key="finalBtn"
					class="amelipro-stepper__btn--final"
					:class="{ 'w-100': !smAndUp }"
					:unique-id="uniqueId ? `${uniqueId}-footer-final-btn` : undefined"
					@click="finalStepEvent()"
				>
					{{ finalStepBtn }}
				</AmeliproBtn>
			</div>

			<div class="d-flex justify-start flex-sm-row flex-column w-100">
				<AmeliproBtn
					v-if="data.selected > 0 && !hideBackBtn"
					key="previousBtn"
					bordered
					class="order-sm-0 amelipro-stepper__btn--previous"
					:class="{ 'w-100 mt-2': !smAndUp }"
					color="ap-white"
					hover-color="ap-blue-lighten-3"
					icon-left
					text-color="ap-blue-darken-1"
					type="button"
					:unique-id="uniqueId ? `${uniqueId}-footer-previous-btn` : undefined"
					@click="previousStepEvent(data.selected - 1)"
				>
					<template #icon>
						{{ chevronLeft }}
					</template>

					{{ previousBtnLabel }}
				</AmeliproBtn>

				<div v-else>
					<slot name="backBtn" />
				</div>

				<slot name="finalOptionalBtn" />
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	@use '@/assets/amelipro/apTokens';

	.amelipro-stepper__list li {
		&:first-child {
			& .amelipro-step-btn {
				border-top-left-radius: 8px;
			}
		}

		&:last-child {
			& .amelipro-step-btn {
				border-top-right-radius: 8px;
			}
		}
	}

	.step-number {
		font-size: apTokens.$font-size-sm;

		&::before {
			position: absolute;
			left: calc(50% - 1rem);
			bottom: -1rem;
			width: 2rem;
			height: 2rem;
			border-radius: 50%;
			background-color: apTokens.$ap-blue-lighten3;
			border: 1px solid apTokens.$ap-green-lighten2;
			content: '';
			z-index: -1;
		}

		& span {
			position: absolute;
			left: calc(50% - 0.3rem);
			bottom: -0.7rem;
			color: apTokens.$ap-grey-darken1;
		}

		&.step-number--active {
			&::before {
				background-color: apTokens.$ap-blue-darken1;
				border: 0;
			}

			& span {
				color: apTokens.$ap-white;
			}
		}

		&.step-number--disabled {
			&::before {
				background-color: apTokens.$ap-grey-lighten2;
				border: 0;
			}

			& span {
				color: apTokens.$ap-grey-darken1;
			}
		}
	}

	.stepper-mobile-btn-wrapper {
		min-width: 36px;
	}

	.active-step-title {
		position: relative;
		width: calc(100% - 96px);
		background-color: apTokens.$ap-blue-darken1;
		border-top-left-radius: 8px;
		border-top-right-radius: 8px;
		color: apTokens.$ap-white;
		text-align: center;
		z-index: 1;
	}

	.next-step-btn__wrapper {
		@media #{apTokens.$media-only-xs} {
			width: 100%;
		}
	}

	.amelipro-stepper__content--default {
		padding: 3rem apTokens.$card-padding-tablet apTokens.$card-padding-tablet apTokens.$card-padding-tablet;
		background-color: apTokens.$ap-white;
		border: 1px solid apTokens.$ap-green-lighten2;
		border-radius: 8px;
		border-top-left-radius: 0;

		@media #{apTokens.$media-down-md} {
			padding: 3rem apTokens.$card-padding-mobile apTokens.$card-padding-mobile apTokens.$card-padding-mobile;
			border-top-left-radius: 8px;
		}
	}
</style>
