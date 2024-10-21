<script setup lang="ts">
	import { ref, computed, onMounted, onUnmounted } from 'vue'
	import HeaderLogo from './HeaderLogo/HeaderLogo.vue'

	defineSlots<{
		'default': () => void
		'prepend': () => void
		'append': () => void
		'menu': () => void
		'logo': () => void
		'header-side': () => void
	}>()

	const props = withDefaults(defineProps<{
			sticky?: boolean
		}>(),
		{
			sticky: true,
		})

	const header = ref<HTMLElement | null>(null)
	const headerSticky = ref<HTMLElement | null>(null)
	const headerMinHeight = ref('auto')

	const headerStyle = computed(() => {
		return {
			minHeight: headerMinHeight.value,
		}
	})

	const headerStickyStyle = computed<{
		position: 'fixed' | 'relative'
		top: string
	}>(() => {
		return {
			position: !scrollIsOnTop.value && props.sticky ? 'fixed' : 'relative',
			top: !scrollIsOnTop.value && props.sticky ? '0' : 'auto',
			maxWidth: header.value ? `${header.value!.offsetWidth}px` : '100%',
		}
	})

	const scrollIsOnTop = ref(true)
	function handleScroll() {
		scrollIsOnTop.value = window.scrollY < headerOffset.value
		headerMinHeight.value = scrollIsOnTop.value ? 'auto' : `${header.value!.offsetHeight}px`
	}

	const headerOffset = ref(1)
	function handleResize() {
		headerOffset.value = header.value!.getBoundingClientRect().top + window.scrollY
		headerMinHeight.value = scrollIsOnTop.value ? 'auto' : `${header.value!.offsetHeight}px`
	}
	onMounted(() => {
		handleResize()
		window.addEventListener('scroll', handleScroll)
		window.addEventListener('resize', handleResize)
	})

	onUnmounted(() => {
		window.removeEventListener('scroll', handleScroll)
		window.removeEventListener('resize', handleResize)
	})

</script>

<template>
	<header
		ref="header"
		class="header"
		:style="headerStyle"
	>
		<div
			ref="headerSticky"
			class="sticky-header"
			:style="headerStickyStyle"
		>
			<div
				v-if="$slots.prepend"
				class="header-prepend"
			>
				<slot name="prepend" />
			</div>
			<div class="inner-header d-flex">
				<!---->
				<slot
					name="menu"
				/>

				<!---->

				<div class="header-logo">
					<slot
						name="logo"
					>
						<HeaderLogo />
					</slot>
				</div>

				<div
					v-if="$slots.headerSide"
					class="header-side"
				>
					<slot name="header-side" />
				</div>
			</div>
			<div
				v-if="$slots.append"
				class="header-append"
			>
				<slot name="append" />
			</div>
		</div>
	</header>
</template>

<style lang="scss" scoped>

.header {
	top: 0;
	width: 100%;
}

.sticky-header {
	background-color: #fff;
	border-bottom: solid 1px #ced9eb;
	transition: top 0.3s;
	width: 100%;
	z-index: 1000;
}

.inner-header {
	display: flex;
	align-items: center;
}

.header-side {
	display: flex;
	align-items: center;
	margin-left: auto;
}
</style>
