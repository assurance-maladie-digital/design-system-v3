<script setup lang="ts">
	import { mdiClose, mdiDelete, mdiPencil } from '@mdi/js'
	import { locales } from './locales'

	defineProps<{
		/** Nombre de lignes sélectionnées. */
		count: number
		/** Libellé de décompte personnalisé (par défaut « N éléments sélectionnés »). */
		label?: string
		/** Affiche le bouton de suppression intégré. */
		showDelete?: boolean
		/** Affiche le bouton d'édition groupée intégré. */
		showEdit?: boolean
	}>()

	defineEmits<{
		delete: []
		edit: []
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
			{{ label || locales.selectedCount(count) }}
		</span>

		<VSpacer />

		<!-- Zone d'actions : surchargeable via le slot par défaut -->
		<slot>
			<VBtn
				v-if="showEdit"
				:prepend-icon="mdiPencil"
				color="primary"
				variant="tonal"
				size="small"
				@click="$emit('edit')"
			>
				{{ locales.editSelected }}
			</VBtn>
			<VBtn
				v-if="showDelete"
				:prepend-icon="mdiDelete"
				color="error"
				variant="tonal"
				size="small"
				@click="$emit('delete')"
			>
				{{ locales.deleteSelected }}
			</VBtn>
		</slot>

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
