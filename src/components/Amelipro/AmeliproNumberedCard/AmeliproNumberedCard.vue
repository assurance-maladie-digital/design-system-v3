<script setup lang="ts">
	import { type PropType, computed } from 'vue'
	import type { AmeliproNumberedCardItem } from './types'
	import type { IndexedObject } from '../types'
	import { convertToHex } from '@/utils/functions/convertToHex'

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
		contentClasses: {
			type: String,
			default: undefined,
		},
		items: {
			type: Array as PropType<AmeliproNumberedCardItem[]>,
			required: true,
		},
		itemsPerLine: {
			type: Number,
			default: 2,
		},
		uniqueId: {
			type: String,
			required: true,
		},
	})

	const generalCardStyles = computed<IndexedObject>(() => {
		const cardStyle: IndexedObject = { backgroundColor: `${convertToHex(props.cardColor)}` }

		if (props.bordered) {
			cardStyle.border = `1px solid ${convertToHex(props.borderColor)}`
		}

		return cardStyle
	})
</script>

<template>
	<ol
		:id="uniqueId"
		class="list-style-none d-flex justify-center flex-wrap amelipro-numbered-card__list"
		:class="{
			'items-per-line-4': itemsPerLine === 4,
			'items-per-line-3': itemsPerLine === 3,
			'items-per-line-2': itemsPerLine !== 4 && itemsPerLine !== 3,
		}"
	>
		<li
			v-for="(item, index) in items"
			:id="`${uniqueId}-card-${index}`"
			:key="index"
			class="mb-4 numbered-card-item__wrapper"
		>
			<span class="font-weight-regular number">
				<span
					:id="`${uniqueId}-card-${index}-number`"
					class="toto ap-blue--text text--darken-1"
				>
					{{ index + 1 }}
				</span>
			</span>

			<div
				:id="`${uniqueId}-card-${index}-wrapper`"
				class="d-flex w-100 amelipro-card--numbered-wrapper"
			>
				<div
					class="amelipro-card--numbered w-100"
					:style="generalCardStyles"
				>
					<div
						:id="`${uniqueId}-card-${index}-content`"
						class="amelipro-card--numbered-content"
						:class="contentClasses"
					>
						<slot
							:name="`${uniqueId}-item-${index}`"
							v-bind="item"
						>
							<slot
								:name="`${uniqueId}-item`"
								v-bind="item"
							/>
						</slot>
					</div>
				</div>
			</div>
		</li>
	</ol>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/tokens';

.amelipro-card--numbered-wrapper {
	padding-top: 1rem;
}

.amelipro-card--numbered {
	display: block;
	position: relative;
	padding: tokens.$card-padding-desktop;
	max-width: 100%;
	border-radius: tokens.$card-radius;
	text-decoration: none;
	overflow-wrap: break-word;
	white-space: normal;

	@media #{tokens.$media-down-md} {
		padding: tokens.$card-padding-tablet;
	}

	@media #{tokens.$media-down-sm} {
		padding: tokens.$card-padding-mobile;
	}
}

.amelipro-card--numbered-content {
	width: 100%;
	padding: tokens.$card-padding-desktop tokens.$card-padding-mobile;
	font-size: tokens.$font-size-xs;
	font-weight: tokens.$ap-font-weight-regular;
}

.numbered-card-item__wrapper {
	position: relative;

	& > div {
		min-height: 100%;
	}
}

.number {
	display: block;
	width: 100%;
	font-size: tokens.$font-size-sm;

	@media #{tokens.$media-down-sm} {
		font-size: tokens.$font-size-xs;
	}

	&::before {
		position: absolute;
		left: calc(50% - 1rem);
		top: 0;
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		border: 1px solid tokens.$ap-blue-darken1;
		background-color: tokens.$ap-white;
		content: '';
		z-index: 1;

		@media #{tokens.$media-down-sm} {
			left: calc(50% - 0.75rem);
			width: 1.5rem;
			height: 1.5rem;
			top: 0.25rem;
		}
	}

	& span {
		position: absolute;
		top: 0.25rem;
		width: 100%;
		font-weight: tokens.$ap-font-weight-semi-bold;
		text-align: center;
		z-index: 2;

		@media #{tokens.$media-down-sm} {
			top: 0.375rem;
		}
	}
}

.items-per-line-2 {
	& > li {
		width: calc(50% - 5px);
		min-width: calc(50% - 5px);
		max-width: calc(50% - 5px);

		&:nth-child(2n+2) {
			@media #{tokens.$media-up-md} {
				margin-left: 10px;
			}
		}
	}
}

.items-per-line-3 {
	& > li {
		@media #{tokens.$media-up-lg} {
			width: calc((100% - 20px) / 3);
			min-width: calc((100% - 20px) / 3);
			max-width: calc((100% - 20px) / 3);
		}

		@media #{tokens.$media-only-md} {
			width: calc(50% - 5px);
			min-width: calc(50% - 5px);
			max-width: calc(50% - 5px);
		}

		&:nth-child(2n+2) {
			@media #{tokens.$media-only-md} {
				margin-left: 10px;
			}
		}

		&:nth-child(3n+2),
		&:nth-child(3n+3) {
			@media #{tokens.$media-up-lg} {
				margin-left: 10px;
			}
		}
	}
}

.items-per-line-4 {
	& > li {
		@media #{tokens.$media-up-lg} {
			width: calc(25% - 9px);
			min-width: calc(25% - 9px);
			max-width: calc(25% - 9px);
		}

		@media #{tokens.$media-only-md} {
			width: calc(50% - 5px);
			min-width: calc(50% - 5px);
			max-width: calc(50% - 5px);
		}

		&:nth-child(2n+2) {
			@media #{tokens.$media-only-md} {
				margin-left: 10px;
			}
		}

		&:nth-child(4n+2),
		&:nth-child(4n+3),
		&:nth-child(4n+4) {
			@media #{tokens.$media-up-lg} {
				margin-left: 12px;
			}
		}
	}
}

.items-per-line-2,
.items-per-line-3,
.items-per-line-4 {
	& > li {
		@media #{tokens.$media-down-md} {
			width: 100%;
			min-width: 100%;
			max-width: 100%;
		}
	}
}
</style>
