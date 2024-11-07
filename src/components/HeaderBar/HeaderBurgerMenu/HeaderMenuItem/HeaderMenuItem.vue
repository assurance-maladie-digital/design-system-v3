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

		> :deep(a) {
			display: flex;
			flex-direction: column;
			padding: 16px 50px 16px 20px;
			text-decoration: none;
			color: currentColor;

			&:hover {
				text-decoration: underline;
			}

			&:visited {
				color: currentColor;
			}

			&::first-letter {
				text-transform: uppercase;
			}
		}
	}

	.header-menu-item:hover {
		background-color: $primary-base;
		color: $neutral-white;

		> :deep(a > *) {
			color: $neutral-white !important;
		}
	}
</style>
