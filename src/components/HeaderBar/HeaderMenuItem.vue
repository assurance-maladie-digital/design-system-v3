<script setup lang="ts">

</script>

<template>
	<li class="header-menu-item">
		<slot />
	</li>
</template>

<style lang="scss" scoped>
	@use "@/assets/tokens.scss" as *;

	.header-menu-item {
		color: $primary-base;
		list-style-type: none;
		margin: 0;
		padding: 0;
		min-height: 44px; // accessibility requirement
		font-weight: 700;
		text-transform: capitalize;

		> :deep(a) {
			display: block;
			padding: 16px 50px 16px 20px;
			text-decoration: none;

			&:hover {
				text-decoration: underline;
			}

			&:focus, &:active, &:visited {
				color: currentColor;
			}
		}
	}

	.header-menu-item:hover {
		background-color: $primary-base;
		color: $neutral-white;
	}
</style>
