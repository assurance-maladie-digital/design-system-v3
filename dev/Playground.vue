<script setup lang="ts">
	// Root layout for the dev playground
	import type { RouteLocationRaw } from 'vue-router'
	import UserMenuBtn from '@/components/UserMenuBtn/UserMenuBtn.vue'

	type MenuItem = { text: string, value: string, to?: RouteLocationRaw, link?: string }

	const menuItems: MenuItem[] = [
		{ text: 'Accueil', value: 'home', to: '/' },
		{ text: 'À propos', value: 'about', to: '/about' },
	]
</script>

<template>
	<div class="playground">
		<header class="playground__header">
			<h1>Design System v3 – Playground</h1>
			<UserMenuBtn
				:menu-items="menuItems"
				full-name="Playground"
				additional-information="Navigation"
				hide-logout-btn
			/>
		</header>

		<main class="playground__content">
			<RouterView />
		</main>
	</div>
</template>

<style scoped>
.playground {
	display: flex;
	flex-direction: column;
	min-height: 100dvh;
}
.playground__header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px 16px;
	border-bottom: 1px solid #e5e7eb;
}
.playground__nav a {
	color: #2563eb;
	text-decoration: none;
}
.playground__nav a.router-link-active {
	font-weight: 600;
}
.playground__content {
	padding: 16px;
	flex: 1;
}
</style>
