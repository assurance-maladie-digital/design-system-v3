<script lang="ts" setup>
	import { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import { ref, computed } from 'vue'
	import type { ChipItem } from './types'
	import { mdiWindowClose } from '@mdi/js'
	import { locales } from './locales'

	const props = withDefaults(defineProps<CustomizableOptions & {
		items?: ChipItem[]
		overflowLimit?: number

	}>(), {
		items: () => [],
		overflowLimit: 4,
	})
	const emits = defineEmits(['remove', 'reset'])

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

	function emitRemoveEvent(item: ChipItem): void {
		emits('remove', item)
	}

	function getBackgroundColor(state) {
		if (state === 'success') {
			return 'backgroundSuccessSubdued'
		}
		if (state === 'warning') {
			return 'backgroundWarningSubdued'
		}
		if (state === 'error') {
			return 'backgroundErrorSubdued'
		}
		if (state === 'info') {
			return 'backgroundInfoSubdued'
		}
		return 'primary'
	}

	function emitResetEvent(): void {
		emits('reset')
	}

</script>

<template>
	<div
		v-if="items.length"
		:class="{
			'flex-column': showOverflowChip,
		}"
		class="vd-chip-list d-flex flex-wrap max-width-none mx-n1 mt-n1"
	>
		<div class="d-flex flex-wrap align-center">
			<VChip
				v-for="item in filteredItems"
				:key="item.text"
				:color="getBackgroundColor(item.state)"
				size="small"
				variant="flat"
				class="ma-1 "
				:class="{
					'sy-chip-success': item.state === 'success',
					'sy-chip-info': item.state === 'info',
					'sy-chip-warning': item.state === 'warning',
					'sy-chip-error': item.state === 'error',

				}"
			>
				<div class="d-flex align-center ga-sm-1 pl-1">
					<span>{{ item.text }}</span>
					<VBtn
						icon="mdi-close"
						variant="text"
						:aria-label="locale.closeBtnLabel"
						density="compact"
						size="small"
						class="vd-remove-chip"
						@click="emitRemoveEvent(item)"
					>
						<VIcon size="default">
							{{ deleteIcon }}
						</VIcon>
					</VBtn>
				</div>
			</VChip>
		</div>

		<div>
			<VChip
				v-if="showOverflowChip"
				color="cyan-lighten-90"
				size="small"
				variant="flat"
				class="vd-overflow-chip text-cyan-darken-40 ma-1"
			>
				{{ overflowText }}
			</VChip>

			<VBtn
				data-test-id="reset-btn"
				color="primary"
				size="small"
				variant="text"
				class="vd-overflow-btn px-1 ml-0 my-1"
				@click="emitResetEvent"
			>
				{{ locale.reset }}
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

.vd-overflow-chip {
	border: 1px solid tokens.$cyan-lighten-90 !important;
}

// Disable overflow button hover state
.vd-overflow-btn :deep(.v-btn__overlay) {
	display: none;
}
</style>
