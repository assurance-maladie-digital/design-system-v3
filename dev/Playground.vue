<script lang="ts" setup>
	import { ref } from 'vue'
	import PeriodField from '@/components/PeriodField/PeriodField.vue'

	const selectedPeriod = ref({ from: null, to: null })
</script>

<template>
	<div class="mt-4">
		<PeriodField v-model="selectedPeriod" />
		<p>Selected Period: {{ selectedPeriod }}</p>
	</div>
</template>
