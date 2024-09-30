<script setup lang="ts">
	import LangBtn from '@/components/LangBtn/LangBtn.vue'
	import { ref } from 'vue'

	const value = ref('fr')
	const value2 = ref('')
	const items = ['fr', 'en', 'co']
	const ariaLabel = 'Choix de la langue'
	const options = {
		btn: {
			color: 'green',
			variant: 'text',
			ripple: true,
		},
	}
</script>

<template>
	<main>
		<div class="mt-12 ml-12">
			<LangBtn
				v-model="value"
				:available-languages="items"
				:aria-label="ariaLabel"
				:hide-down-arrow="false"
				:vuetify-options="options"
			/>
		</div>
	</main>
</template>
