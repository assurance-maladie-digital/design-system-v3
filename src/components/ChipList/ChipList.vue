<script lang="ts" setup>
	import { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import { ref, computed } from 'vue'
	import type { ChipItem } from './types'
	import { mdiWindowClose, mdiCheckCircle, mdiAlertCircle, mdiInformationOutline, mdiAlertOutline } from '@mdi/js'
	import { locales } from './locales'

	type ChipState = 'success' | 'warning' | 'error' | 'info' | ''
	type NonEmptyChipState = Exclude<ChipState, ''>

	interface Props extends CustomizableOptions {
		items?: ChipItem[]
		overflowLimit?: number
		readonly?: boolean
		resetText?: string
		displayPrependStateIcon?: boolean
		displayAppendStateIcon?: boolean
		customIcon?: string
	}

	const BACKGROUND_COLORS: Record<NonEmptyChipState, string> = {
		success: 'backgroundSuccessSubdued',
		warning: 'backgroundWarningSubdued',
		error: 'backgroundErrorSubdued',
		info: 'backgroundInfoSubdued',
	} as const

	const props = withDefaults(defineProps<Props>(), {
		items: () => [],
		overflowLimit: 4,
		readonly: false,
		resetText: undefined,
		displayPrependStateIcon: false,
		displayAppendStateIcon: false,
		customIcon: undefined,
	})

	const emits = defineEmits<{
		(e: 'remove', item: ChipItem): void
		(e: 'reset'): void
	}>()

	const locale = ref(locales)
	const deleteIcon = ref(mdiWindowClose)

	const filteredItems = computed(() => {
		return props.items.slice(0, props.overflowLimit - 1)
	})

	const showOverflowChip = computed(() => {
		return props.items.length >= props.overflowLimit
	})

	const overflowText = computed(() => {
		return `+${props.items.length - props.overflowLimit + 1}`
	})

	const resetButtonText = computed(() => {
		return props.resetText ?? locale.value.reset
	})

	/**
	 * Retourne la couleur de fond correspondant à l'état du chip
	 *
	 * @param state - L'état du chip
	 * @returns La couleur de fond correspondante
	 */
	function getBackgroundColor(state: ChipState): string {
		return BACKGROUND_COLORS[state] || 'primary'
	}

	/**
	 * Retourne l'icône correspondant à l'état du chip
	 *
	 * @param state - L'état du chip
	 * @returns L'icône MDI correspondante
	 */
	function getIcon(state: ChipState): string {
		switch (state) {
		case 'success':
			return mdiCheckCircle
		case 'warning':
			return mdiAlertOutline
		case 'error':
			return mdiAlertCircle
		case 'info':
			return mdiInformationOutline
		default:
			return ''
		}
	}

	function emitRemoveEvent(item: ChipItem): void {
		if (!props.readonly) {
			emits('remove', item)
		}
	}

	function emitResetEvent(): void {
		if (!props.readonly) {
			emits('reset')
		}
	}
</script>

<template>
	<div
		v-if="items.length"
		:class="{
			'flex-column': showOverflowChip,
		}"
		class="chip-list d-flex flex-wrap max-width-none mx-n1 mt-n1"
		role="list"
	>
		<div
			class="d-flex flex-wrap align-center"
			role="group"
			:aria-label="locale.chipGroupLabel"
		>
			<VChip
				v-for="item in filteredItems"
				:key="item.text"
				:color="getBackgroundColor(item.state)"
				size="small"
				variant="flat"
				class="ma-1"
				:class="{
					'sy-chip-success': item.state === 'success',
					'sy-chip-info': item.state === 'info',
					'sy-chip-warning': item.state === 'warning',
					'sy-chip-error': item.state === 'error',
				}"
				role="listitem"
			>
				<div class="d-flex align-center justify-center ga-sm-1">
					<template v-if="displayPrependStateIcon">
						<VIcon
							:icon="customIcon || getIcon(item.state)"
							size="medium"
						/>
					</template>

					<span>{{ item.text }}</span>

					<template v-if="displayAppendStateIcon">
						<VIcon
							:icon="customIcon || getIcon(item.state)"
							size="medium"
						/>
					</template>

					<VBtn
						v-if="!readonly"
						:aria-label="locale.closeBtnLabel"
						density="compact"
						icon
						size="small"
						variant="text"
						@click="emitRemoveEvent(item)"
					>
						<VIcon
							:icon="deleteIcon"
							size="small"
						/>
					</VBtn>
				</div>
			</VChip>
		</div>

		<div
			v-if="showOverflowChip || !readonly"
			class="d-flex align-center"
		>
			<VChip
				v-if="showOverflowChip"
				color="cyan-lighten-90"
				size="small"
				variant="flat"
				class="overflow-chip text-cyan-darken-40 ma-1"
				role="status"
				:aria-label="locale.overflowLabel"
			>
				{{ overflowText }}
			</VChip>

			<VBtn
				v-if="!readonly"
				data-test-id="reset-btn"
				color="primary"
				size="small"
				variant="text"
				class="overflow-btn px-1 ml-0 my-1"
				@click="emitResetEvent"
			>
				{{ resetButtonText }}
			</VBtn>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';

.sy-chip-success {
	color: tokens.$colors-text-success !important;
	border: 1px solid tokens.$colors-border-success !important;
}

.sy-chip-error {
	color: tokens.$colors-text-error !important;
	border: 1px solid tokens.$colors-border-error !important;
}

.sy-chip-info {
	color: tokens.$colors-text-info !important;
	border: 1px solid tokens.$colors-border-info !important;
}

.sy-chip-warning {
	color: tokens.$colors-text-warning !important;
	border: 1px solid tokens.$colors-border-warning !important;
}

.overflow-chip {
	border: 1px solid tokens.$cyan-lighten-90 !important;
}

// Disable overflow button hover state
.overflow-btn :deep(.v-btn__overlay) {
	display: none;
}
</style>
