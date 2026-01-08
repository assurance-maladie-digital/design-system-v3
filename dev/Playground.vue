	<script lang="ts" setup >
    import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import { ref } from 'vue'

	const inputValue = ref<null>(null)
</script>

<template>
	<SyTextField
		v-model="inputValue"
		label="Playground TextField"
		placeholder="Type something..."
		:counter="20"
		:display-persistent-counter="true"
	/>
	<p>Input Value: {{ inputValue }}</p>
</template>
