<script setup lang="ts">
	import { computed } from 'vue'
	import { useDisplay } from 'vuetify'
	import type { AriaRole } from '../types'

	const props = withDefaults(defineProps<{
		size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs'
		spacing?: 'xl' | 'lg' | 'md' | 'sm' | 'xs'
		color?: string
		uniqueId?: string
		role?: AriaRole
		ariaLabelledby?: string
		alignCenter?: boolean
	}>(), {
		size: undefined,
		spacing: undefined,
		color: 'transparent',
		uniqueId: undefined,
		role: undefined,
		ariaLabelledby: undefined,
		alignCenter: false,
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

	const containerWidth = computed(() => `${containerSize.value}px`)

	defineExpose({
		spacingClass,
		containerSize,
	})
</script>

<template>
	<div
		:id="uniqueId ? `${uniqueId}-container` : undefined"
		:class="['vd-page-container d-flex flex-column', { 'align-center': alignCenter }]"
		:role="role"
		:aria-labelledby="ariaLabelledby"
	>
		<!-- Slot prepend avec wrapper de largeur fixe -->
		<div
			v-if="$slots.prepend"
			class="vd-page-container__slot-wrapper"
		>
			<div
				class="vd-page-container__slot-content"
				:style="{ width: containerWidth }"
			>
				<slot
					name="prepend"
					:width="containerWidth"
				/>
			</div>
		</div>

		<div
			:class="spacingClass"
			class="vd-page-container__content"
		>
			<VSheet
				:id="uniqueId ? `${uniqueId}-content` : undefined"
				:width="containerSize"
				:color="color"
			>
				<slot />
			</VSheet>
		</div>

		<!-- Slot append avec wrapper de largeur fixe -->
		<div
			v-if="$slots.append"
			class="vd-page-container__slot-wrapper"
		>
			<div
				class="vd-page-container__slot-content"
				:style="{ width: containerWidth }"
			>
				<slot
					name="append"
					:width="containerWidth"
				/>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.vd-page-container {
    flex: 1;
    width: 100%;
}

.vd-page-container__content {
    display: flex;
    justify-content: center;
    width: 100%;
}

.vd-page-container__slot-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
}

.vd-page-container__slot-content {
    margin: 0 auto;
}
</style>
