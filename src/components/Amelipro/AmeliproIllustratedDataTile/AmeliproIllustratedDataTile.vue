<script setup lang="ts">
	import { type PropType, computed } from 'vue'
	import AmeliproIcon from '../AmeliproIcon/AmeliproIcon.vue'
	import type { AmeliproIllustratedDataInfoTypes } from './types'
	import type { IndexedObject } from '../types'
	import { convertToHex } from '@/utils/functions/convertToHex'

	const props = defineProps({
		complementaryInformation: {
			type: Array as PropType<AmeliproIllustratedDataInfoTypes[]>,
			default: () => [],
		},
		iconName: {
			type: String,
			default: undefined,
		},
		imgSrc: {
			type: String,
			default: undefined,
		},
		labelFirstLine: {
			type: String,
			required: true,
		},
		labelSecondLine: {
			type: String,
			required: true,
		},
		tileInfoColor: {
			type: String,
			default: 'ap-grey-darken-1',
		},
		tileMinHeight: {
			type: String,
			default: undefined,
		},
		tilePadding: {
			type: String,
			default: '2rem 1rem',
		},
		tileWidth: {
			type: String,
			default: '100%',
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

	const tileGlobalStyles = computed<IndexedObject>(() => {
		const styles: IndexedObject = { width: props.tileWidth }

		if (props.tileMinHeight !== undefined) {
			styles.minHeight = props.tileMinHeight
		}

		return styles
	})

	const tileStyles = computed<IndexedObject>(() => {
		const styles: IndexedObject = { border: `2px solid ${convertToHex('ap-grey-lighten-3')} !important` }

		if (props.tilePadding !== undefined) {
			styles.padding = props.tilePadding
		}

		return styles
	})
</script>

<template>
	<div
		:id="uniqueId ? `${uniqueId}-container` : undefined"
		class="d-flex pt-2 illustrated-data-tile"
		:style="tileGlobalStyles"
	>
		<div
			class="d-flex flex-column align-center w-100 ap-white illustrated-data-tile__wrapper"
			:style="tileStyles"
		>
			<img
				v-if="imgSrc"
				:id="uniqueId ? `${uniqueId}-img` : undefined"
				alt=""
				class="mx-auto illustrated-data-tile__img"
				:src="imgSrc"
			>

			<AmeliproIcon
				v-else-if="iconName"
				class="mx-auto illustrated-data-tile__icon"
				:icon="iconName"
				:icon-color="tileInfoColor"
				size="60px"
				:unique-id="uniqueId ? `${uniqueId}-icon` : undefined"
			/>

			<p
				:id="uniqueId ? `${uniqueId}-label` : undefined"
				:aria-level="titleLevel"
				class="mb-0 text-center illustrated-data-tile__label"
				role="heading"
			>
				<span
					:id="uniqueId ? `${uniqueId}-label-line-1` : undefined"
					class="d-block text-center illustrated-data-tile__label__line-1"
				>
					{{ labelFirstLine }}
				</span>

				<span
					:id="uniqueId ? `${uniqueId}-label-line-2` : undefined"
					class="d-block text-center text-uppercase illustrated-data-tile__label__line-2"
				>
					{{ labelSecondLine }}
				</span>
			</p>

			<p
				:id="uniqueId ? `${uniqueId}-complementary-info` : undefined"
				class="text-center illustrated-data-tile__info"
			>
				<span
					v-for="(info, index) in complementaryInformation"
					:key="index"
					class="d-block"
				>
					{{ info.label }}

					<span class="font-weight-semibold">
						{{ info.value ? info.value : undefined }}
					</span>
				</span>
			</p>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/tokens';

	.illustrated-data-tile__wrapper {
		border-radius: 0.5rem;
		transform: translateY(0);
		transition: transform 0.1s ease-in-out;

		&:hover {
			transform: translateY(-8px);
		}
	}

	.illustrated-data-tile__label__line-1 {
		margin-top: 2rem;
		margin-bottom: 1rem;
		font-size: tokens.$font-size-sm;
		font-weight: tokens.$ap-font-weight-semi-bold;
	}

	.illustrated-data-tile__label__line-2 {
		margin-bottom: 2rem;
		font-size: tokens.$font-size-xs;
		font-weight: tokens.$ap-font-weight-regular;
	}

	.illustrated-data-tile__img {
		width: 60px;
		height: 60px;
	}
</style>
