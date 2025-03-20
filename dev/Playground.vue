<script setup lang="ts">
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
