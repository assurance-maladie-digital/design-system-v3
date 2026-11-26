<script setup lang="ts">
	import type { locales as defaultLocales } from './locales'

	defineProps<{
		state: string
		src?: string | null
		locales: typeof defaultLocales
	}>()

	defineEmits<{
		(e: 'imageError'): void
	}>()
</script>

<template>
	<div>
		<VSkeletonLoader
			v-if="state === 'pending'"
			:aria-label="locales.captchaImgLoading"
			class="captcha-img"
			type="image"
			tile
		/>

		<img
			v-else
			class="captcha-img"
			height="64"
			width="311"
			:alt="locales.captchaImgAlt"
			:src="src as string"
			@error="$emit('imageError')"
		>
	</div>
</template>

<style lang="scss" scoped>
// Boîte de 311 × 64 qui rétrécit avec son conteneur : le squelette et l'image
// occupent la même place, quel que soit le ratio du fichier renvoyé par l'API.
.captcha-img {
	width: 311px;
	max-width: 100%;
	height: auto;
	aspect-ratio: 311 / 64;
	object-fit: contain;
}

:deep(.v-skeleton-loader__image) {
	height: 100%;
}
</style>
