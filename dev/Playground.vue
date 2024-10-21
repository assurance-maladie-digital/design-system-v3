<script setup lang="ts">
	import CustomInputSelect from '@/components/Customs/CustomInputSelect/CustomInputSelect.vue'
	import { ref } from 'vue'

	const value = ref('fr')
	const items = ['fr', 'en', 'co']
	const ariaLabel = 'Choix de la langue'
</script>

<template>
	<main>
		<div class="mt-12 ml-12">
			<CustomInputSelect
				v-model="value"
				:items="items"
				:label="ariaLabel"
				aria-label="Choix de la langue"
			/>

			<CustomInputSelect
				v-model="value"
				:items="items"
				:label="ariaLabel"
				aria-label="Choix de la langue"
			/>
		</div>
	</main>
</template>
