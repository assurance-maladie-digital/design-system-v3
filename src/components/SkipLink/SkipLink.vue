<script lang="ts" setup>
	import { locales } from './locales'
	import { nextTick, ref, onMounted } from 'vue'
	import { getCurrentInstance } from 'vue'
	import type { Router } from 'vue-router'

	withDefaults(
		defineProps<{
			label?: string
			target?: string
		}>(),
		{
			label: locales.label,
			target: '#main',
		},
	)

	const skipLinkSpan = ref<HTMLLinkElement | null>(null)

	onMounted(() => {
		const instance = getCurrentInstance()
		if (!instance) return

		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- we test the existence of Nuxt
		const nuxtApp = (instance?.appContext.app as any)?.$nuxt
		let router: undefined | Router
		if (nuxtApp && nuxtApp.$router) {
			router = nuxtApp.$router as Router
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- we test the existence of vue-router
		const vueRouter = (instance.appContext.app.config.globalProperties as any)?.$router
		if (vueRouter) {
			router = vueRouter as Router
		}

		if (router && router.afterEach) {
			router.afterEach((to, from, fail) => {
				if (fail) return
				if (to.path === from.path) return
				nextTick(() => {
					const link = document.querySelector('a.sy-skip-link') as HTMLAnchorElement
					if (link) link.focus()
				})
			})
		}
	})
</script>

<template>
	<!--  améliorer la structure sémantique-->
	<nav
		aria-label="Liens d'évitement"
		class="sy-skip-link-container"
	>
		<div ref="skipLinkSpan" />

		<a
			ref="skipLink"
			:href="target"
			class="sy-skip-link text-primary d-block d-sr-only-focusable px-2"
		>
			<slot>{{ label }}</slot>
		</a>
	</nav>
</template>

<style lang="scss" scoped>
@use '/src/assets/tokens';

.sy-skip-link {
	z-index: 150;
	position: fixed;
	top: 0;
	right: 0;
	transition: none;
	width: 100%;
	background: #fff;
	outline: none; // Disable outline to use border
	border: 2px solid tokens.$blue-darken-60;
}
</style>
