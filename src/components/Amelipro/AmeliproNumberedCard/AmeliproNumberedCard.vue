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
@use '@/assets/overrides/breakpoints' as bp;

.amelipro-card--numbered-wrapper {
	padding-top: 1rem;
}

.amelipro-card--numbered {
	display: block;
	position: relative;
	padding: 1rem;
	max-width: 100%;
	border-radius: var(--v-ap-btnRadius);
	text-decoration: none;
	overflow-wrap: break-word;
	white-space: normal;

	@media #{bp.$down-sm} {
		padding: 1rem;
	}

	@media #{bp.$down-xs} {
		padding: 0.75rem;
	}
}

.amelipro-card--numbered-content {
	width: 100%;
	font-size: var(--v-ap-fontSizeXs);
	font-weight: var(--v-ap-fontWeightRegular);
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
	font-size: var(--v-ap-fontSizeSm);

	@media #{bp.$down-xs} {
		font-size: var(--v-ap-fontSizeXs);
	}

	&::before {
		position: absolute;
		left: calc(50% - 1rem);
		top: 0;
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		border: 1px solid rgb(var(--v-theme-colorPrimary));
		background-color: rgb(var(--v-theme-colorSurface));
		content: '';
		z-index: 1;

		@media #{bp.$down-xs} {
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
		font-weight: var(--v-ap-fontWeightBold);
		text-align: center;
		z-index: 2;

		@media #{bp.$down-xs} {
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
			@media #{bp.$up-md} {
				margin-left: 10px;
			}
		}
	}
}

.items-per-line-3 {
	& > li {
		@media #{bp.$up-lg} {
			width: calc((100% - 20px) / 3);
			min-width: calc((100% - 20px) / 3);
			max-width: calc((100% - 20px) / 3);
		}

		@media #{bp.$md-only} {
			width: calc(50% - 5px);
			min-width: calc(50% - 5px);
			max-width: calc(50% - 5px);
		}

		&:nth-child(2n+2) {
			@media #{bp.$md-only} {
				margin-left: 10px;
			}
		}

		&:nth-child(3n+2),
		&:nth-child(3n+3) {
			@media #{bp.$up-lg} {
				margin-left: 10px;
			}
		}
	}
}

.items-per-line-4 {
	& > li {
		@media #{bp.$up-lg} {
			width: calc(25% - 9px);
			min-width: calc(25% - 9px);
			max-width: calc(25% - 9px);
		}

		@media #{bp.$md-only} {
			width: calc(50% - 5px);
			min-width: calc(50% - 5px);
			max-width: calc(50% - 5px);
		}

		&:nth-child(2n+2) {
			@media #{bp.$md-only} {
				margin-left: 10px;
			}
		}

		&:nth-child(4n+2),
		&:nth-child(4n+3),
		&:nth-child(4n+4) {
			@media #{bp.$up-lg} {
				margin-left: 12px;
			}
		}
	}
}

.items-per-line-2,
.items-per-line-3,
.items-per-line-4 {
	& > li {
		@media #{bp.$down-sm} {
			width: 100%;
			min-width: 100%;
			max-width: 100%;
		}
	}
}
</style>
