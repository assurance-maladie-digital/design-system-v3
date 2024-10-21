<script setup lang="ts">
	import Logo from '@/components/Logo/Logo.vue'
</script>

<template>
	<main class="ma-12">
		<Logo />
		<Logo hide-signature />
		<Logo hide-organism />
		<Logo risque-pro />
		<Logo avatar />
		<Logo
			avatar
			size="small"
		/>
	</main>
</template>
