<script setup lang="ts">
	import { LangBtn } from '@/components'
	import { ref } from 'vue'

	const value = ref('fr')
	const items = ['fr', 'en', 'es']
	const ariaLabel = 'Choix de la langue'
</script>

<template>
	<div class="ma-4">
		<LangBtn
			v-model="value"
			:items="items"
			:aria-label="ariaLabel"
		/>
	</div>
</template>
