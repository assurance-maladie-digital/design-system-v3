<script setup lang="ts">
	import DialogBox from '@/components/DialogBox/DialogBox.vue'
	import { ref } from 'vue'

	const dialogOpen = ref(false)
</script>

<template>
	<VBtn
		color="primary"
		@click="dialogOpen = !dialogOpen"
	>
		Toggle DialogBox
	</VBtn>
	<DialogBox
		v-model="dialogOpen"
		title="Informations sur le parent référent"
    width="375px"
		@confirm="dialogOpen = false"
		@cancel="dialogOpen = false"
	>
		DialogBox content
	</DialogBox>
</template>
