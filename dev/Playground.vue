<script setup lang='ts'>
	import { ref } from 'vue'
	import { isRequired } from '@/utils/rules'

	const number = ref(0)
</script>
<template>
	<VTextField
		v-model="number"
		label="number"
		:rules="[isRequired]"
	/>
</template>
