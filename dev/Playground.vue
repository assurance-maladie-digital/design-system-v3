<script lang="ts" setup>
	import { ref } from 'vue'
	import MonthPicker from '@/components/MonthPicker/MonthPicker.vue'
	const month = ref(undefined)
</script>

<template>
	<div class="playground ma-8">
		<MonthPicker
			:model-value="month"
			label="début"
		/>
	</div>
</template>
