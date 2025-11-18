<script setup>
	import SyCheckbox from '@/components/Customs/SyCheckbox/SyCheckbox.vue'
	import { ref } from 'vue'

	const checked = ref(false)
</script>

<template>
	<SyCheckbox
		v-model="checked"
		label="Case à cocher"
	/>
	<div style="width: 100px">
		<SyCheckbox
			v-model="checked"
			label="Case à cocher"
		/>
	</div>
</template>
