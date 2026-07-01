<script setup lang="ts">
	import { mdiClose } from '@mdi/js'
	import { locales } from './locales'

	defineProps<{
		/** Nombre de lignes sélectionnées. */
		count: number
	}>()

	defineEmits<{
		clear: []
	}>()
</script>

<template>
	<div
		class="sy-table-bulk-actions d-flex align-center ga-2 px-4 py-2"
		role="region"
		:aria-label="locales.bulkActions"
	>
		<span
			class="text-body-2 font-weight-medium"
			aria-live="polite"
		>
			{{ locales.selectedCount(count) }}
		</span>

		<VSpacer />

		<!-- Actions groupées : rendues par le projet via le slot #bulk-actions -->
		<slot />

		<VBtn
			:icon="mdiClose"
			variant="text"
			size="small"
			:aria-label="locales.clearSelection"
			@click="$emit('clear')"
		/>
	</div>
</template>

<style scoped lang="scss">
	.sy-table-bulk-actions {
		background-color: rgba(var(--v-theme-primary), 0.06);
		border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
	}
</style>
