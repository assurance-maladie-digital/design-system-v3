<script setup lang="ts">
	import { computed, type PropType } from 'vue'
	import AmeliproIcon from '../AmeliproIcon/AmeliproIcon.vue'
	import { AmeliproStateTileTypes } from './AmeliproStateTileTypes'
	import type { IndexedObject } from '../types'
	import type { RouteLocationRaw } from 'vue-router'
	import { convertToHex } from '@/utils/functions/convertToHex'

	const props = defineProps({
		btnStyledText: {
			type: String,
			default: undefined,
		},
		contentMinHeight: {
			type: String,
			default: '284px',
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		href: {
			type: String,
			default: undefined,
		},
		labelFirstLine: {
			type: String,
			default: undefined,
		},
		labelSecondLine: {
			type: String,
			default: undefined,
		},
		labelThirdLine: {
			type: String,
			default: undefined,
		},
		linkStyleText: {
			type: String,
			default: 'Consulter',
		},
		noPdfIcon: {
			type: Boolean,
			default: false,
		},
		tileMinHeight: {
			type: String,
			default: undefined,
		},
		tilePaddingX: {
			type: String,
			default: '24px',
		},
		tileType: {
			default: 'toDo',
			type: String as PropType<keyof typeof AmeliproStateTileTypes>,
			validator(value: string): boolean {
				return ['date', 'done', 'doneNoCertificate', 'doneNoCertificateBlue', 'doneToCorrect', 'optionnal', 'toDo', 'toDoNoCertificate', 'toDoNoCertificateBlue'].includes(value)
			},
		},
		tileWidth: {
			type: String,
			default: '100%',
		},
		to: {
			type: [Array, Object, String] as PropType<RouteLocationRaw>,
			default: undefined,
		},
		uniqueId: {
			type: String,
			default: undefined,
		},
	})

	const emit = defineEmits(['click'])

	const hasDownload = computed<boolean>(() => AmeliproStateTileTypes[props.tileType].downloadable)

	const icon = computed(() => {
		if (AmeliproStateTileTypes[props.tileType].icon) {
			const tileIcon = AmeliproStateTileTypes[props.tileType].icon
			return {
				iconBgColor: tileIcon?.iconBgColor,
				iconColor: tileIcon?.iconColor,
				iconName: tileIcon?.iconName,
			}
		}
		return undefined
	})

	const tileStyles = computed<IndexedObject>(() => {
		const styles: IndexedObject = {
			backgroundColor: convertToHex(AmeliproStateTileTypes[props.tileType].bgColor),
			border: `2px solid ${convertToHex(AmeliproStateTileTypes[props.tileType].borderColor)} !important`,
			borderRadius: '0.5rem',
			color: convertToHex(AmeliproStateTileTypes[props.tileType].textColor || 'ap-grey-darken-1'),
			padding: '0',
		}

		if (props.disabled) {
			styles.backgroundColor = `${convertToHex('ap-grey-lighten-2')} !important`
			styles.borderColor = `${convertToHex('ap-grey')} !important`
			styles.color = `${convertToHex('ap-grey-darken-1')} !important`
		}

		if (props.tileType === 'optionnal' || props.tileType === 'doneToCorrect') {
			styles.borderStyle = 'dashed'
		}

		if (props.tileMinHeight) {
			styles.minHeight = props.tileMinHeight
		}

		if (props.tileType === 'date') {
			styles.width = props.tileWidth
		}

		return styles
	})

	const tileContentStyles = computed(() => {
		const paddingX = props.tilePaddingX
		const tileType = props.tileType
		const styles = {
			padding: `32px ${paddingX} 32px ${paddingX}`,
			minHeight: props.contentMinHeight,
		}
		if (AmeliproStateTileTypes[tileType].icon) {
			styles.padding = `50px ${paddingX} 50px ${paddingX}`
		}
		return styles
	})

	function emitClickEvent(): void {
		emit('click', props.uniqueId)
	}
</script>

<template>
	<VBtn
		v-if="tileType !== 'date'"
		:id="uniqueId"
		class="amelipro-state-tile text-none text-h5"
		:disabled="disabled"
		:elevation="0"
		height="auto"
		:href="href"
		:min-height="tileMinHeight"
		:ripple="false"
		:style="tileStyles"
		:to="to"
		:width="tileWidth"
		@click="emitClickEvent()"
	>
		<span
			class="w-100 d-flex flex-column justify-center amelipro-state-tile__content"
			:style="tileContentStyles"
		>
			<span
				class="w-100 d-flex flex-column justify-center text-center amelipro-state-tile__text"
			>
				<span
					:id="uniqueId ? `${uniqueId}-first-line` : undefined"
					class="d-block text-h5 text-center amelipro-state-tile__first-line"
				>
					{{ labelFirstLine }}
				</span>

				<span
					v-if="labelSecondLine"
					:id="uniqueId ? `${uniqueId}-second-line` : undefined"
					class="d-block text-h5 text-center amelipro-state-tile__second-line"
				>
					{{ labelSecondLine }}
				</span>

				<span
					v-if="labelThirdLine"
					:id="uniqueId ? `${uniqueId}-third-line` : undefined"
					class="d-block mt-6 text-center text-body-1 amelipro-state-tile__third-line"
				>
					{{ labelThirdLine }}
				</span>
			</span>
			<span>
				<span
					v-if="hasDownload && !btnStyledText && !disabled"
					:id="uniqueId ? `${uniqueId}-download-text` : undefined"
					class="d-block mt-6 amelipro-state-tile__pdf-download"
					:class="{
						'amelipro-state-tile__pdf-download--white': tileType === 'toDo' || tileType === 'done',
					}"
				>
					<span v-if="linkStyleText !== undefined && linkStyleText !== ''">
						{{ linkStyleText }}
					</span>

					<span
						v-if="!noPdfIcon"
						class="d-sr-only"
					>
						&nbsp;le fichier PDF
					</span>

					<AmeliproIcon
						v-if="!noPdfIcon"
						class="ml-1"
						icon="pdf"
						icon-bg-color="ap-red"
						icon-color="ap-white"
						size="22px"
						:unique-id="uniqueId ? `${uniqueId}-pdf-icon` : undefined"
					/>
				</span>

				<span
					v-else-if="btnStyledText && !disabled"
					:id="uniqueId ? `${uniqueId}-btn-styled-text` : undefined"
					class="d-flex align-center justify-center w-100 mt-6 font-weight-bold text-uppercase btn-styled-text"
					:class="{
						'text-ap-blue-darken-1 bg-ap-white': tileType === 'toDo' || tileType === 'done',
						'bg-ap-blue-darken-1 text-ap-white': tileType !== 'toDo' && tileType !== 'done',
					}"
				>
					{{ btnStyledText }}
				</span>

				<span
					v-else-if="disabled && tileType !== 'optionnal'"
					:id="uniqueId ? `${uniqueId}-unavailable-text` : undefined"
					class="d-block mt-6 text-center font-weight-bold amelipro-state-tile__unavailable"
				>
					Non disponible
				</span>
			</span>

			<AmeliproIcon
				v-if="icon"
				class="state-tile-icon"
				:icon="icon.iconName"
				:icon-bg-color="icon.iconBgColor"
				:icon-color="icon.iconColor ? icon.iconColor : ''"
				size="34px"
				:unique-id="uniqueId ? `${uniqueId}-icon` : undefined"
			/>
		</span>
	</VBtn>

	<div
		v-else
		class="amelipro-state-tile text-none text-h5"
		:style="tileStyles"
	>
		<span
			class="w-100 d-flex flex-column justify-center amelipro-state-tile__content"
			:style="tileContentStyles"
		>
			<span
				:id="uniqueId ? `${uniqueId}-first-line` : undefined"
				class="d-block text-h5 text-center amelipro-state-tile__first-line"
			>
				{{ labelFirstLine }}
			</span>

			<span
				v-if="labelSecondLine"
				:id="uniqueId ? `${uniqueId}-second-line` : undefined"
				class="d-block text-h5 text-center amelipro-state-tile__second-line"
			>
				{{ labelSecondLine }}
			</span>

			<span
				v-if="labelThirdLine"
				:id="uniqueId ? `${uniqueId}-third-line` : undefined"
				class="d-flex align-center justify-center mt-2 text-center text-body-1 amelipro-state-tile__third-line"
			>
				<AmeliproIcon
					class="mr-2"
					icon="calendar"
					icon-bg-color="transparent"
					icon-color="ap-blue-darken-1"
					:unique-id="uniqueId ? `${uniqueId}-calendar-icon` : undefined"
				/>

				{{ labelThirdLine }}
			</span>
		</span>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

.amelipro-state-tile__pdf-download {
	color: apTokens.$ap-blue-darken1;
}

.amelipro-state-tile__pdf-download--white {
	color: apTokens.$ap-white;
}

.amelipro-state-tile {
	position: relative;
	display: flex;
	flex-direction: column;
	background-color: apTokens.$ap-white;

	& span {
		white-space: normal;
	}

	&:hover {
		& .amelipro-state-tile__pdf-download {
			color: apTokens.$ap-blue-darken2;
			text-decoration: underline;
		}

		& .amelipro-state-tile__pdf-download--white {
			color: apTokens.$ap-white;
		}
	}
}

:deep(.amelipro-status) {
	align-self: center;
	margin-bottom: 16px !important;
}

.btn-styled-text {
	min-height: apTokens.$btn-min-height;
	padding: 12px 24px;
	border-radius: apTokens.$btn-radius;
	font-size: apTokens.$font-size-sm;
}

.state-tile-icon {
	position: absolute;
	bottom: 16px;
	right: 16px;
}

.v-btn {
	letter-spacing: unset;
	text-indent: unset;

	&.v-btn--active::before,
	&:focus::before,
	&:hover::before {
		content: unset !important;
		opacity: 0 !important;
	}

	&:focus {
		outline: 1px dotted apTokens.$ap-grey-darken1;
	}

	& :deep(.v-btn__content) {
		display: flex;
		position: initial;
		flex-direction: column;
		align-items: center;
		width: 100%;
		max-width: 100%;
	}

	& :deep(.v-btn__overlay),
	& :deep(.v-btn__underlay) {
		display: none !important;
	}
}
</style>
