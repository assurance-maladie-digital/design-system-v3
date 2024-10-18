<script setup lang="ts">
	import CNAMLogo from './CNAMLogo.vue'

	defineSlots<{
		'default': () => void
		'prepend': () => void
		'append': () => void
		'menu': () => void
		'logo': () => void
		'header-side': () => void
	}>()

</script>

<template>
	<header class="header position-sticky">
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
	position: sticky;
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
