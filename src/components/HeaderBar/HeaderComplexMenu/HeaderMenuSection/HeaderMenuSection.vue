<script setup lang="ts">
	import { useId } from 'vue'

	defineProps<{
		title?: string
	}>()

	const id = useId()
	const groupId = `${id}-group`
	const titleId = `${id}-group-title`
</script>

<template>
	<div class="header-menu-section">
		<div
			v-if="title"
			:id="titleId"
			class="header-menu-section-title"
		>
			{{ title }}
		</div>
		<ul
			:id="groupId"
			role="group"
			class="header-menu-section-list"
		>
			<slot />
		</ul>
	</div>
</template>

<style lang="scss" scoped>
@use "@/assets/tokens.scss" as *;
@use "../../consts.scss" as menu;

.header-menu-section {
	list-style-type: none;
	padding: 0;
	margin: 0;
}

.header-menu-section-title {
	padding: 40px 16px 8px 20px;
	border-bottom: 1px solid menu.$menu-border-color;
	font-size: 1.1rem;
	margin-bottom: 8px;
	color: #212529;
	text-transform: capitalize;
	font-weight: 700;
}
</style>
