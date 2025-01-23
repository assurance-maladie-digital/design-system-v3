<script lang="ts" setup>
	import { ref } from 'vue'

	import RatingPicker from '@/components/RatingPicker/RatingPicker.vue'
	import EmotionPicker from '@/components/RatingPicker/EmotionPicker/EmotionPicker.vue'
	import NumberPicker from '@/components/RatingPicker/NumberPicker/NumberPicker.vue'
	import StarsPicker from '@/components/RatingPicker/StarsPicker/StarsPicker.vue'
	import PageContainer from '@/components/PageContainer/PageContainer.vue'
</script>

<template>
	<PageContainer>
		<RatingPicker
			label="Êtes-vous satisfait de ce service ?"
			type="emotion"
		/>
	</PageContainer>
</template>
