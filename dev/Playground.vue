<script lang="ts" setup>
	import { ref } from 'vue'

	import RatingPicker from '@/components/RatingPicker/RatingPicker.vue'
	import PageContainer from '@/components/PageContainer/PageContainer.vue'

	const rating = ref(-1)
</script>

<template>
	<PageContainer>
		<RatingPicker
			v-model="rating"
			label="Êtes-vous satisfait de ce service ?"
			type="emotion"
		/>
	</PageContainer>
</template>
