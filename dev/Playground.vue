<script lang="ts" setup>
	import { ref } from 'vue'

	import RatingPicker from '@/components/RatingPicker/RatingPicker.vue'
	import PageContainer from '@/components/PageContainer/PageContainer.vue'

	const ratingEmotion = ref(-1)
	const ratingNumber = ref(-1)
	const ratingStars = ref(-1)
</script>

<template>
	<main>
		<PageContainer>
			{{ ratingEmotion }}
			<RatingPicker
				v-model="ratingEmotion"
				label="Êtes-vous satisfait de ce service ?"
				type="emotion"
			/>

			<br>
			{{ ratingNumber }}
			<RatingPicker
				v-model="ratingNumber"
				label="Êtes-vous satisfait de ce service ?"
				type="number"
			/>

			<br>
			{{ ratingStars }}
			<RatingPicker
				v-model="ratingStars"
				label="Êtes-vous satisfait de ce service ?"
				type="stars"
			/>
		</PageContainer>
	</main>
</template>
