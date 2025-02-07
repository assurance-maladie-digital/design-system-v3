<script setup lang="ts">
	import { SyAlert } from '@/components'
</script>

<template>
	<SyAlert
		closable
		model-value
		type="success"
		variant="tonal"
		@click:close="console.log('close')"
	>
		Alert content
	</SyAlert>
</template>
