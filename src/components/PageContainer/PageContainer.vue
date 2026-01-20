<script setup lang="ts">
	import { computed } from 'vue'
	import { useDisplay } from 'vuetify'

	const props = withDefaults(defineProps<{
		size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs'
		spacing?: 'xl' | 'lg' | 'md' | 'sm' | 'xs'
		color?: string
		uniqueId?: string
	}>(), {
		size: undefined,
		spacing: undefined,
		color: 'transparent',
		uniqueId: undefined,
	})

	const display = useDisplay()

	const spacingMapping: Record<string, string> = {
		xs: 'px-4',
		sm: 'px-4',
		md: 'px-14',
		lg: 'px-14',
		xl: 'px-0',
	}

	const sizeMapping: Record<string, number> = {
		xs: 340,
		sm: 540,
		md: 800,
		lg: 1280,
		xl: 1712,
	}

	const spacingClass = computed(() => {
		if (props.spacing) {
			return `py-10 ${spacingMapping[props.spacing]}`
		}
		return `py-10 ${spacingMapping[display.name.value]}`
	})

	const containerSize = computed(() => {
		if (props.size) {
			return sizeMapping[props.size]
		}
		else {
			return sizeMapping[display.name.value] ?? sizeMapping['xl']
		}
	})

	defineExpose({
		spacingClass,
		containerSize,
	})
</script>

<template>
	<div
		:id="uniqueId ? `${uniqueId}-container` : undefined"
		:class="[spacingClass, 'vd-page-container d-flex justify-center']"
	>
		<VSheet
			:id="uniqueId ? `${uniqueId}-content` : undefined"
			:width="containerSize"
			:color="color"
		>
			<slot />
		</VSheet>
	</div>
</template>

<style lang="scss" scoped>
.vd-page-container {
	flex: 1;
	width: 100%;
	max-width: 1712px;
	margin: 0 auto;
}
</style>
