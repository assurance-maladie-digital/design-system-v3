<script setup lang="ts">
	import DatePicker from '@/components/DatePicker/DatePicker.vue'
	import { ref } from 'vue'

	const date = ref('')
</script>

<template>
	<main>
		<DatePicker
			v-model="date"
			placeholder="Sélectionner une date"
			format="DD/MM/YYYY"
		/>
	</main>
</template>
