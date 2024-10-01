<script setup lang="ts">
	import { mdiArrowUp } from '@mdi/js'
	import { computed, onMounted, onUnmounted, ref } from 'vue'

	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import { convertToUnit } from '@/utils/convertToUnit'
	import { useDisplay } from 'vuetify'

	import { locales } from './locales'
	import { config } from './config'

	import { type VBtn } from 'vuetify/components'

	type VBtnProps = InstanceType<typeof VBtn>['$props']

	export interface Props {
		threshold?: number
		nudgeRight?: string | number
		nudgeBottom?: string | number
		target?: string
	}

	const props = withDefaults(defineProps<Props & CustomizableOptions>(), {
		threshold: 120,
		nudgeRight: '16px',
		nudgeBottom: '16px',
		target: undefined,
	})

	const options = useCustomizableOptions(config, props)

	const showBtn = ref(false)

	const targetSelector = computed(() => {
		return props.target ? `#${props.target}` : null
	})

	const isMobile = computed(() => useDisplay().smAndDown.value)

	const btnStyle = computed(() => {
		const right = convertToUnit(props.nudgeRight) || '0'
		const bottom = convertToUnit(props.nudgeBottom) || '0'

		return {
			bottom,
			marginRight: right,
		}
	})

	const minWidth = computed(() => (isMobile.value ? '36px' : undefined))

	const labelClasses = computed(() => ({
		'd-sr-only': isMobile.value,
	}))

	// Methods
	const onScroll = (e: Event) => {
		const target = e.currentTarget as HTMLElement | Window

		if (target instanceof Window) {
			showBtn.value = window.scrollY > props.threshold
		}
		else {
			showBtn.value = (target as HTMLElement).scrollTop > props.threshold
		}
	}

	const scrollToTop = () => {
		if (!props.target) {
			window.scrollTo(0, 0)
		}
		else {
			const target = document.getElementById(props.target) || window
			target.scrollTo(0, 0)
		}
	}

	// Handling scroll events
	const target = computed(() => props.target ? document.getElementById(props.target) : window)
	onMounted(() => {
		target.value?.addEventListener('scroll', onScroll)
	})
	onUnmounted(() => {
		target.value?.removeEventListener('scroll', onScroll)
	})

</script>

<template>
	<VFadeTransition>
		<VBtn
			v-show="showBtn"
			v-scroll:[targetSelector]="onScroll"
			v-bind="({
				...options.btn,
				...$attrs,
			} as VBtnProps)"
			:style="btnStyle"
			:min-width="minWidth"
			class="vd-back-to-top-btn"
			@click="scrollToTop"
		>
			<span :class="labelClasses">
				<slot>
					{{ locales.label }}
				</slot>
			</span>

			<slot name="icon">
				<VIcon v-bind="options.icon">
					{{ mdiArrowUp }}
				</VIcon>
			</slot>
		</VBtn>
	</VFadeTransition>
</template>

<style lang="scss" scoped>
.vd-back-to-top-btn {
	position: sticky;
	z-index: 999;
	opacity: 1;
	float: right;
}
.v-btn--variant-outlined {
	background: white;
}
</style>
