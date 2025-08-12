<script lang="ts" setup>
	import { config } from '@/components/ChipList/config'
	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import { mdiAlertCircle, mdiAlertOutline, mdiCheckCircle, mdiInformationOutline, mdiWindowClose } from '@mdi/js'
	import { computed, ref } from 'vue'
	import { locales } from './locales'
	import type { ChipItem, ChipState } from './types'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'

	type NonEmptyChipState = Exclude<ChipState, undefined>
	type VuetifyVariant = 'flat' | 'text' | 'elevated' | 'tonal' | 'outlined' | 'plain'

	export interface Props extends CustomizableOptions {
		items?: ChipItem[]
		overflowLimit?: number
		readonly?: boolean
		resetText?: string
		displayPrependStateIcon?: boolean
		displayAppendStateIcon?: boolean
		customIcon?: string
		listAriaLabel?: string
		listAriaLabelledby?: string
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
		listAriaLabel: undefined,
		listAriaLabelledby: undefined,
		vuetifyOptions: () => ({}),
	})

	const options = useCustomizableOptions(config, props)

	const emits = defineEmits<{
		(e: 'remove', item: ChipItem): void
		(e: 'reset'): void
	}>()

	const locale = ref(locales)
	const deleteIcon = ref(mdiWindowClose)
	const showAllItems = ref(false)

	const filteredItems = computed(() => {
		if (showAllItems.value) {
			return props.items
		}
		return props.items.slice(0, props.overflowLimit - 1)
	})

	const showOverflowChip = computed(() => {
		return props.items.length >= props.overflowLimit && !showAllItems.value
	})

	const overflowCount = computed(() => {
		return props.items.length - props.overflowLimit + 1
	})

	const overflowText = computed(() => {
		return `+${overflowCount.value}`
	})

	const hiddenItems = computed(() => {
		return props.items.slice(props.overflowLimit - 1)
	})

	const overflowAriaLabel = computed(() => {
		const count = overflowCount.value
		const itemsText = hiddenItems.value.map(item => item.text).join(', ')
		return locale.value.overflowAriaLabel
			.replace('{count}', count.toString())
			.replace('{items}', itemsText)
	})

	const toggleButtonText = computed(() => {
		if (showAllItems.value) {
			return locale.value.hideExtraFilters
		}
		const count = overflowCount.value
		return locale.value.showMoreFilters.replace('{count}', count.toString())
	})

	const listAccessibleName = computed(() => {
		return props.listAriaLabel ?? locale.value.chipGroupLabel
	})

	const resetButtonText = computed(() => {
		if (props.resetText) {
			return props.resetText
		}
		// Utiliser le pluriel si plus d'un filtre
		return props.items.length > 1 ? locale.value.resetMultiple : locale.value.reset
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

	/**
	 * Bascule l'affichage de tous les éléments ou seulement les premiers
	 */
	function toggleShowAllItems(): void {
		showAllItems.value = !showAllItems.value
	}

	/**
	 * Émet l'événement de suppression d'un élément
	 *
	 * @param item - L'élément à supprimer
	 */
	function emitRemoveEvent(item: ChipItem): void {
		if (!props.readonly) {
			emits('remove', item)
		}
	}

	/**
	 * Émet l'événement de réinitialisation
	 */
	function emitResetEvent(): void {
		if (!props.readonly) {
			emits('reset')
		}
	}
</script>

<template>
	<div
		v-if="items.length"
		class="sy-chip-list"
	>
		<ul
			:class="{
				'flex-row': showOverflowChip,
			}"
			class="d-flex flex-wrap max-width-none mx-n1 mt-n1"
			:aria-label="props.listAriaLabelledby ? undefined : listAccessibleName"
			:aria-labelledby="props.listAriaLabelledby"
		>
			<li
				v-for="item in filteredItems"
				:key="item.text"
				class="d-inline-flex"
			>
				<VChip
					v-bind="options.chip"
					:color="getBackgroundColor(item.state)"
					:class="{
						'sy-chip-success': item.state === 'success',
						'sy-chip-info': item.state === 'info',
						'sy-chip-warning': item.state === 'warning',
						'sy-chip-error': item.state === 'error',
					}"
				>
					<template v-if="displayPrependStateIcon">
						<SyIcon
							v-bind="options.icon"
							:icon="customIcon || getIcon(item.state)"
							:color="item.state"
							decorative
						/>
					</template>

					<span>{{ item.text }}</span>

					<template v-if="displayAppendStateIcon">
						<SyIcon
							v-bind="options.icon"
							:icon="customIcon || getIcon(item.state)"
							decorative
						/>
					</template>

					<VBtn
						v-if="!readonly"
						v-bind="options.btn"
						:aria-label="`Supprimer le filtre ${item.text}`"
						icon
						class="remove-chip"
						@click="emitRemoveEvent(item)"
					>
						<SyIcon
							v-bind="options.icon"
							:icon="deleteIcon"
							:color="item.state"
							decorative
						/>
					</VBtn>
				</VChip>
			</li>

			<!-- Élément +N intégré dans la liste HTML -->
			<li
				v-if="showOverflowChip"
				class="d-inline-flex"
			>
				<VChip
					v-bind="options.chip"
					class="overflow-chip text-cyan-darken-40 ma-1"
					tabindex="0"
					:aria-label="overflowAriaLabel"
					@click="toggleShowAllItems"
					@keydown.enter="toggleShowAllItems"
					@keydown.space.prevent="toggleShowAllItems"
				>
					{{ overflowText }}
				</VChip>
			</li>
		</ul>

		<!-- Boutons d'action (hors de la liste) -->
		<div
			v-if="showAllItems || !readonly"
			class="d-flex align-center mt-2"
		>
			<VBtn
				v-if="showAllItems"
				variant="text"
				color="primary"
				size="small"
				class="hide-extra-btn px-1 mr-2"
				@click="toggleShowAllItems"
			>
				{{ toggleButtonText }}
			</VBtn>

			<VBtn
				v-if="!readonly"
				variant="text"
				color="primary"
				size="small"
				data-test-id="reset-btn"
				class="overflow-btn px-1"
				@click="emitResetEvent"
			>
				{{ resetButtonText }}
			</VBtn>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';

// Styles pour la liste HTML native
.sy-chip-list ul {
	list-style: none;
	padding: 0;
	margin: 0;
}

.sy-chip-list li {
	margin: 0;
	padding: 0;
}

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
	cursor: pointer;

	&:focus-visible {
		outline: 2px solid tokens.$primary-base !important;
		outline-offset: -2px !important;
	}
}

// Disable overflow button hover state
.overflow-btn :deep(.v-btn__overlay) {
	display: none;
}

// Bouton "Réinitialiser le filtre" - améliorer le contraste de la bordure de focus
.overflow-btn:focus-visible {
	outline: 2px solid tokens.$primary-base !important;
	outline-offset: -2px !important;
}

.remove-chip {
	padding: 0 !important;

	// Améliorer le contraste des bordures de focus pour les boutons de suppression
	&:focus-visible {
		outline: 2px solid tokens.$primary-base !important;
		outline-offset: -2px !important;
	}
}

// Styles spécifiques pour améliorer le contraste de focus selon le thème du chip
.sy-chip-success .remove-chip:focus-visible {
	outline: 2px solid tokens.$colors-border-success !important;
	outline-offset: -2px !important;
}

.sy-chip-info .remove-chip:focus-visible {
	outline: 2px solid tokens.$colors-border-info !important;
	outline-offset: -2px !important;
}

.sy-chip-warning .remove-chip:focus-visible {
	outline: 2px solid tokens.$colors-border-warning !important;
	outline-offset: -2px !important;
}

.sy-chip-error .remove-chip:focus-visible {
	outline: 2px solid tokens.$colors-border-error !important;
	outline-offset: -2px !important;
}
</style>
