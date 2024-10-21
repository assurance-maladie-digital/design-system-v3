<script setup lang="ts">
	import Logo from '@/components/Logo/Logo.vue'
	import { LogoSize } from '@/components/Logo/LogoSize'
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
			:size="LogoSize['SMALL']"
		/>
	</main>
</template>
