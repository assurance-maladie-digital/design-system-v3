<script setup lang="ts">
	import { computed } from 'vue'
	import { useDisplay } from 'vuetify'

	const props = withDefaults(defineProps<{
		size?: 'xl' | 'l' | 'm' | 's'
		spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
		color?: string
	}>(), {
		size: 'xl',
		spacing: undefined,
		color: 'transparent',
	})

	const display = useDisplay()

	const spacingMapping: Record<string, string> = {
		xs: 'px-0',
		sm: 'px-4',
		md: 'px-8',
		lg: 'px-14',
		xl: 'px-14',
	}

	const spacingX = spacingMapping[display.name.value]

	const spacingClass = computed(() => {
		if (props.spacing) {
			return `py-10 ${spacingMapping[props.spacing]}`
		}

		return `py-10 ${spacingX}`
	})

	const sizeMapping: Record<string, number> = {
		xl: 1440,
		l: 960,
		m: 800,
		s: 600,
	}

	const containerSize = computed(() => {
		return sizeMapping[props.size]
	})

	defineExpose({
		spacingClass,
		containerSize,
	})
</script>

<template>
	<div :class="[spacingClass, 'vd-page-container d-flex justify-center']">
		<VSheet
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
  max-width: 1712px;
}
</style>
