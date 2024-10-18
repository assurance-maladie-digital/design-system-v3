<script setup lang="ts">
	import CNAMLogo from './CNAMLogo.vue'
	import { ref, computed, onMounted, onUnmounted } from 'vue'

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
	const headerStyle = computed<{
		position: 'fixed' | 'relative'
	}>(() => {
		return {
			position: !scrollIsOnTop.value && props.sticky ? 'fixed' : 'relative',
		}
	})

	const scrollIsOnTop = ref(true)
	function handleScroll() {
		scrollIsOnTop.value = window.scrollY < headerOffset.value
	}

	const headerOffset = ref(1)
	function setHeaderOffset() {
		headerOffset.value = header.value!.getBoundingClientRect().top
	}
	onMounted(() => {
		setHeaderOffset()
		window.addEventListener('scroll', handleScroll)
		window.addEventListener('resize', setHeaderOffset)
	})

	onUnmounted(() => {
		window.removeEventListener('scroll', handleScroll)
		window.removeEventListener('resize', setHeaderOffset)
	})

</script>

<template>
	<header
		ref="header"
		class="header"
		:style="headerStyle"
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
					<CNAMLogo />
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
	</header>
</template>

<style lang="scss" scoped>

.header {
	top: 0;
	width: 100%;
	background-color: #fff;
	border-bottom: solid 1px #ced9eb;
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
