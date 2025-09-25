<script setup lang="ts">
	import RatingPicker from '@/components/RatingPicker/RatingPicker.vue';
	import { ref } from 'vue'

	const ratingStar = ref(-1)
	const disabled = ref(false)
</script>

<template>
	<RatingPicker
		v-model="ratingStar"
		label="Êtes-vous satisfait de ce service ?"
		type="stars"
		:readonly="disabled"
	/>

	<button @click="disabled = !disabled">
		{{ disabled ? 'Activer' : 'Désactiver' }} la notation
	</button>
</template>
