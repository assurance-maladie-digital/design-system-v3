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
			sticky: boolean
		}>(),
		{
			sticky: true,
		})

	const header = ref<HTMLElement | null>(null)

	const scrollIsOnTop = ref(true)

	const headerStyle = computed<{
		position: 'fixed' | 'relative'
	}>(() => {
		return {
			position: !scrollIsOnTop.value && props.sticky ? 'fixed' : 'relative',
		}
	})

	onMounted(() => {
		window.addEventListener('scroll', handleScroll)
	})

	onUnmounted(() => {
		window.removeEventListener('scroll', handleScroll)
	})

	function handleScroll() {
		scrollIsOnTop.value = window.scrollY < 10
	}

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
