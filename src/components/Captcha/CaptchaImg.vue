<script setup lang="ts">
	import { locales } from './locales'

	defineProps<{
		state: string
		src?: string | null
	}>()
</script>

<template>
	<div>
		<VSkeletonLoader
			v-if="state === 'pending'"
			aria-label="locales.captchaImgLoading"
			type="image"
			height="64"
			width="311"
			tile
		/>

		<img
			v-else
			height="64"
			width="311"
			:alt="locales.captchaImgAlt"
			:src="src as string"
		>
	</div>
</template>

<style scoped lang="scss">
:deep(.v-skeleton-loader__image) {
	height: 100%;
}
</style>
