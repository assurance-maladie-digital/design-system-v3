<script setup lang="ts">
	import AmeliproBtn from '@/components/Amelipro/AmeliproBtn/AmeliproBtn.vue'
	const handleClick = () => {
		console.log('Button clicked')
	}
</script>

<template>
	<div>
		<AmeliproBtn
			label="Click me"
			:text="true"
			:bordered="true"
			:disabled="false"
			:color="'primary'"
			:text-color="'white'"
			:icon-name="'mdi-check'"
			:icon-left="true"
			@click="handleClick"
		>
			Coucou
		</AmeliproBtn>
	</div>
</template>
