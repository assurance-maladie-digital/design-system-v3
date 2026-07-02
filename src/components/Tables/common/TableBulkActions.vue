<script setup lang="ts">
	import { mdiClose } from '@mdi/js'
	import { locales } from './locales'

	withDefaults(
		defineProps<{
			/** Nombre de lignes sélectionnées. */
			count: number
			/** Épingle la barre en haut du tableau lors du défilement. */
			sticky?: boolean
		}>(),
		{
			sticky: true,
		},
	)

	defineEmits<{
		clear: []
	}>()
</script>

<template>
	<div
		class="sy-table-bulk-actions d-flex align-center ga-2 px-4 py-2"
		:class="{ 'sy-table-bulk-actions--sticky': sticky }"
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
		// Fond opaque (surface + teinte primaire) pour rester lisible en position sticky,
		// sinon les lignes du tableau transparaîtraient sous la barre.
		background-color: rgb(var(--v-theme-surface));
		background-image: linear-gradient(
			0deg,
			rgba(var(--v-theme-primary), 0.06),
			rgba(var(--v-theme-primary), 0.06)
		);
		border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
	}

	// La barre reste visible en haut lors du défilement : l'utilisateur ne « passe »
	// plus à côté après avoir sélectionné des lignes en bas du tableau.
	.sy-table-bulk-actions--sticky {
		position: sticky;
		top: 0;
		z-index: 6;
	}

	// Focus visible fortement contrasté sur le bouton de fermeture.
	.sy-table-bulk-actions :deep(.v-btn:focus-visible) {
		outline: 2px solid rgb(var(--v-theme-primary));
		outline-offset: 2px;
	}
</style>
