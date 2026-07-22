<script setup lang="ts">
	import { mdiTrashCanOutline } from '@mdi/js'
</script>

<template>
	<div class="playground pa-8">
		<h1 class="text-h5 mb-6">
			Playground VBtn icon
		</h1>

		<div class="d-flex ga-6 align-center flex-wrap">
			<div class="d-flex flex-column align-center ga-2">
				<span class="text-body-2">Avec <code>color="error"</code></span>
				<VBtn
					:icon="mdiTrashCanOutline"
					variant="plain"
					color="error"
					aria-label="Supprimer"
				/>
			</div>

			<div class="d-flex flex-column align-center ga-2">
				<span class="text-body-2">Sans couleur explicite</span>
				<VBtn
					:icon="mdiTrashCanOutline"
					variant="plain"
					aria-label="Supprimer"
				/>
			</div>
		</div>
	</div>
</template>
