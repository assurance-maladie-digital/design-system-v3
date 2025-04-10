<script lang="ts" setup>
	import CopyBtn from '@/components/CopyBtn/CopyBtn.vue'
</script>

<template>
	<div class="d-flex flex-wrap align-center pa-4">
		<p class="mb-0 mr-1">
			Patient n°<b>1970756541</b>
		</p>

		<CopyBtn
			label="Copier le numéro de patient"
			text-to-copy="1970756541"
		/>
	</div>
</template>
