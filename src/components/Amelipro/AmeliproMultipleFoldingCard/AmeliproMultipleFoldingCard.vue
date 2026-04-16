<script setup lang="ts">
	import { type PropType, computed, ref, useSlots, watch } from 'vue'
	import AmeliproIcon from '../AmeliproIcon/AmeliproIcon.vue'
	import type { AmeliproMultipleFoldingCardItem } from './types'
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
		defaultItemOpened: {
			type: [Number, null] as PropType<number | null>,
			default: null,
		},
		headerRightWidth: {
			type: String,
			default: '50%',
		},
		manualValidation: {
			type: Boolean,
			default: false,
		},
		tabs: {
			type: Array as PropType<AmeliproMultipleFoldingCardItem[]>,
			required: true,
		},
		title: {
			type: String,
			required: true,
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
			default: undefined,
		},
	})

	const { smAndUp } = useDisplay()
	const openedItemId = ref<string | null>(null)
	const emit = defineEmits(['tab-clicked'])

	const internalTabs = ref<AmeliproMultipleFoldingCardItem[]>([])
	const openDefaultItem = (): void => {
		if (props.defaultItemOpened !== null) {
			openedItemId.value = internalTabs.value[props.defaultItemOpened]!.id
			if (props.manualValidation === false) {
				internalTabs.value[props.defaultItemOpened]!.valid = true
			}
		}
	}
	watch(() => props.tabs, (newValue: AmeliproMultipleFoldingCardItem[]) => {
		internalTabs.value = newValue
		openDefaultItem()
	}, { immediate: true })

	const openClose = (id: string, index: number): void => {
		if (props.manualValidation === false) {
			internalTabs.value[index]!.valid = true
		}
		openedItemId.value = openedItemId.value === id ? null : id
		emit('tab-clicked', id)
	}

	const btnClasses = (id: string, index: number): string => {
		if (openedItemId.value === id) {
			return 'classic-btn active-btn'
		}
		else if (internalTabs.value[index]!.error === true) {
			return 'classic-btn error-btn'
		}
		else if (internalTabs.value[index]!.valid === true) {
			return 'classic-btn checked-btn'
		}

		return 'classic-btn'
	}

	const generalCardStyles = computed<IndexedObject>(() => {
		const cardStyle: IndexedObject = { backgroundColor: `${convertToHex(props.cardColor)}` }

		if (props.bordered) {
			cardStyle.border = `1px solid ${convertToHex(props.borderColor)}`
		}

		return cardStyle
	})

	const cardHeaderStyles = computed<IndexedObject | undefined>(() => {
		if (openedItemId.value !== null) {
			return { borderBottom: `1px solid ${convertToHex(props.borderColor)}` }
		}
		return undefined
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

	// expose openClose besause it is used by developers on services
	defineExpose({ openClose })
</script>

<template>
	<div
		:id="uniqueId ? `${uniqueId}-container` : undefined"
		class="amelipro-card--multi-folding w-100 mb-3"
		:style="generalCardStyles"
	>
		<div
			:id="uniqueId ? `${uniqueId}-header` : undefined"
			class="amelipro-card--multi-folding-header flex-column align-start"
		>
			<div
				class="w-100 pb-2"
				:style="cardHeaderStyles"
			>
				<div class="w-100 d-flex flex-column flex-sm-row align-center">
					<div
						class="amelipro-card--multi-folding-header-left"
						style="display: inline-block;"
						:style="headerLeftStyles"
					>
						<div class="d-flex">
							<AmeliproIcon
								class="d-block mr-2"
								:icon="openedItemId !== null ? 'triangleUp' : 'triangleDown'"
								icon-bg-color="transparent"
								icon-color="ap-blue-darken-1"
								size="11px"
								style="margin-top: -7px;"
								:unique-id="uniqueId ? `${uniqueId}-icon-open-close` : undefined"
							/>

							<p
								:id="uniqueId ? `${uniqueId}-title` : undefined"
								:aria-level="titleLevel"
								class="font-weight-bold text-h3 mb-0"
								:class="titleUppercase ? 'text-uppercase' : undefined"
								role="heading"
							>
								{{ title }}
							</p>
						</div>
					</div>

					<div
						v-if="hasRightSlot"
						:id="uniqueId ? `${uniqueId}-header-right` : undefined"
						class="amelipro-card--multi-folding-header-right"
						:style="headerRightStyles"
					>
						<slot name="headerRight" />
					</div>
				</div>

				<ul
					:id="uniqueId ? `${uniqueId}-btn-list` : undefined"
					class="mt-1 list-style-none d-flex flex-wrap align-center"
				>
					<li
						v-for="(item, index) in internalTabs"
						:key="index"
						class="mb-2 mr-2"
					>
						<button
							:id="item.id + '-title'"
							:aria-controls="item.id"
							:aria-expanded="openedItemId === item.id ? 'true' : 'false'"
							class="d-inline-flex align-center amelipro-card--multi-folding__btn"
							:class="btnClasses(item.id, index)"
							type="button"
							@click="openClose(item.id, index)"
						>
							<AmeliproIcon
								v-if="openedItemId !== item.id && item.valid && item.error !== true"
								class="mr-2 btn-icon"
								icon="check"
								icon-bg-color="ap-turquoise-darken-1"
								icon-color="ap-white"
								medium
								:unique-id="`${item.id}-icon`"
							/>

							<AmeliproIcon
								v-if="openedItemId !== item.id && item.error"
								class="mr-2 btn-icon"
								icon="sensInterdit"
								icon-bg-color="ap-red"
								icon-color="ap-white"
								medium
								:unique-id="`${item.id}-icon`"
							/>

							<AmeliproIcon
								v-if="openedItemId === item.id"
								class="mr-2 btn-icon"
								icon="modifier"
								icon-bg-color="ap-blue-darken-1"
								icon-color="ap-white"
								medium
								:unique-id="`${item.id}-icon`"
							/>

							{{ item.title }}

							<span
								v-if="openedItemId === item.id"
								class="d-sr-only"
							>
								Actif
							</span>

							<span
								v-if="item.error === true"
								class="d-sr-only"
							>
								Contient des erreurs
							</span>
						</button>
					</li>
				</ul>
			</div>
		</div>

		<div
			v-for="(item, index) in tabs"
			:id="uniqueId ? `${uniqueId}-tab-${index}` : undefined"
			:key="index"
		>
			<div
				v-show="openedItemId === item.id"
				:id="item.id"
				:aria-labelledby="item.id + '-title'"
				class="amelipro-card--multi-folding-content text-ap-grey-darken-1"
				role="region"
			>
				<slot :name="item.id">
					<slot
						name="item"
						v-bind="item"
					/>
				</slot>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/overrides/breakpoints' as bp;

.amelipro-card--multi-folding {
	display: block;
	position: relative;
	max-width: 100%;
	border-radius: var(--v-ap-btnRadius);
	text-decoration: none;
	overflow-wrap: break-word;
	white-space: normal;
}

.amelipro-card--multi-folding-header {
	padding-top: var(--v-ap-cardPaddingDesktop);
	padding-left: var(--v-ap-cardPaddingDesktop);
	padding-right: var(--v-ap-cardPaddingDesktop);
	padding-bottom: 0 !important;
	word-break: break-all;

	@media #{bp.$down-sm} {
		padding-top: var(--v-ap-cardPaddingDesktop);
		padding-left: var(--v-ap-cardPaddingDesktop);
		padding-right: var(--v-ap-cardPaddingDesktop);
	}

	@media #{bp.$down-xs} {
		padding-top: var(--v-ap-cardPaddingMobile);
		padding-left: var(--v-ap-cardPaddingMobile);
		padding-right: var(--v-ap-cardPaddingMobile);
	}
}

.amelipro-card--multi-folding-content {
	width: 100%;
	padding: var(--v-ap-cardPaddingDesktop);
	font-size: var(--v-ap-fontSizeXs);
	font-weight: var(--v-ap-fontWeightRegular);

	@media #{bp.$down-sm} {
		padding-left: var(--v-ap-cardPaddingDesktop);
		padding-right: var(--v-ap-cardPaddingDesktop);
		padding-bottom: var(--v-ap-cardPaddingDesktop);
	}

	@media #{bp.$down-xs} {
		padding-left: var(--v-ap-cardPaddingMobile);
		padding-right: var(--v-ap-cardPaddingMobile);
		padding-bottom: var(--v-ap-cardPaddingMobile);
	}
}

.classic-btn {
	position: relative;
	padding: var(--v-ap-multiFoldingBtnPaddingY) var(--v-ap-multiFoldingBtnPaddingX);
	border: 1px solid rgb(var(--v-theme-primary));
	border-radius: var(--v-ap-btnRadius);
	background-color: rgb(var(--v-theme-surface));
	color: rgb(var(--v-theme-primary));
	font-size: var(--v-ap-fontSizeSm);
	font-weight: var(--v-ap-fontWeightBold);
	cursor: pointer;

	&.active-btn {
		background-color: rgb(var(--v-theme-ap-blue-lighten-3));
	}

	&.checked-btn {
		border: 1px solid rgb(var(--v-theme-success));
		background-color: rgb(var(--v-theme-ap-turquoise-lighten-1));
		color: rgb(var(--v-theme-success));
	}

	&.error-btn {
		border: 1px solid rgb(var(--v-theme-ap-red-darken-1));
		background-color: rgb(var(--v-theme-ap-red-lighten-3));
		color: rgb(var(--v-theme-ap-red-darken-1));
	}

	&:focus {
		outline: 1px dotted rgb(var(--v-theme-ap-grey-darken-1));
	}

	&:disabled {
		cursor: default;
	}
}

.btn-icon {
	position: absolute;
	top: calc(50% - 13px);
	left: 0.5rem;
}
</style>
