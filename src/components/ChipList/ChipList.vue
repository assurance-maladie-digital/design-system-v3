<script lang="ts" setup>
	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import { ref, computed } from 'vue'
	import type { ChipItem } from './types'
	import { mdiWindowClose, mdiCheckCircle, mdiAlertCircle, mdiInformationOutline, mdiAlertOutline } from '@mdi/js'
	import { locales } from './locales'
	import { config } from '@/components/ChipList/config'

	type ChipState = 'success' | 'warning' | 'error' | 'info' | ''
	type NonEmptyChipState = Exclude<ChipState, ''>
	type VuetifyVariant = 'flat' | 'text' | 'elevated' | 'tonal' | 'outlined' | 'plain'

	interface Props extends CustomizableOptions {
		items?: ChipItem[]
		overflowLimit?: number
		readonly?: boolean
		resetText?: string
		displayPrependStateIcon?: boolean
		displayAppendStateIcon?: boolean
		customIcon?: string
		vuetifyOptions?: {
			chip?: {
				color?: string
				size?: string
				variant?: VuetifyVariant
			}
		}
	}

	const BACKGROUND_COLORS: Record<NonEmptyChipState, string> = {
		success: 'backgroundSuccessSubdued',
		warning: 'backgroundWarningSubdued',
		error: 'backgroundErrorSubdued',
		info: 'backgroundInfoSubdued',
	} as const

	const props = withDefaults(defineProps<Props & CustomizableOptions>(), {
		items: () => [],
		overflowLimit: 4,
		readonly: false,
		resetText: undefined,
		displayPrependStateIcon: false,
		displayAppendStateIcon: false,
		customIcon: undefined,
	})

	const options = useCustomizableOptions(config, props)

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
   * @param options - Les options de personnalisation
   * @returns La couleur de fond correspondante
   */
	function getBackgroundColor(state: ChipState): string {
		// Si des options Vuetify sont définies et qu'une couleur est spécifiée, on l'utilise
		const vuetifyColor = props.vuetifyOptions?.chip?.color
		if (typeof vuetifyColor === 'string' && vuetifyColor) {
			return vuetifyColor
		}
		// Sinon on utilise la couleur basée sur l'état
		return state ? BACKGROUND_COLORS[state] : 'primary'
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
				v-bind="options.chip"
				:key="item.text"
				:color="getBackgroundColor(item.state)"
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
							v-bind="options.icon"
							:icon="customIcon || getIcon(item.state)"
							:color="item.state"
						/>
					</template>

					<span>{{ item.text }}</span>

					<template v-if="displayAppendStateIcon">
						<VIcon
							v-bind="options.icon"
							:icon="customIcon || getIcon(item.state)"
						/>
					</template>

					<VBtn
						v-if="!readonly"
						v-bind="options.btn"
						:aria-label="locale.closeBtnLabel"
						icon
						class="remove-chip"
						@click="emitRemoveEvent(item)"
					>
						<VIcon
							v-bind="options.icon"
							:icon="deleteIcon"
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
				v-bind="options.chip"
				class="overflow-chip text-cyan-darken-40 ma-1"
				role="status"
				:aria-label="locale.overflowLabel"
			>
				{{ overflowText }}
			</VChip>

			<VBtn
				v-if="!readonly"
				variant="text"
				color="primary"
				size="small"
				data-test-id="reset-btn"
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
