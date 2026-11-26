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
			type="image"
			height="64"
			width="311"
			max-width="100%"
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
.captcha-img {
	max-width: 100%;
	height: auto;
}

:deep(.v-skeleton-loader__image) {
	height: 100%;
}
</style>
