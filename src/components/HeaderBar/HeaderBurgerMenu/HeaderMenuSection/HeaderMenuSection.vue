<script setup lang="ts">
	import { useId } from 'vue'

	withDefaults(defineProps<{
		title?: string
		innerTag?: string
		tag?: string
		titleTag?: string
		showTitle?: boolean
	}>(), {
		title: undefined,
		innerTag: 'ul',
		tag: 'li',
		titleTag: 'h2',
		showTitle: true,
	})

	const id = useId()
	const groupId = `${id}-group`
	const titleId = `${id}-group-title`
</script>

<template>
	<component
		:is="tag"
		class="header-menu-section"
	>
		<section
			:aria-labelledby="titleId"
		>
			<component
				:is="titleTag"
				:id="titleId"
				class="header-menu-section-title"
				:class="{
					'd-sr-only': !showTitle,
				}"
			>
				<slot name="title">
					{{ title }}
				</slot>
			</component>
			<component
				:is="innerTag"
				:id="groupId"
				role="group"
				class="header-menu-section-list"
			>
				<slot />
			</component>
		</section>
	</component>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens.scss' as *;
@use '../../consts.scss' as menu;

.header-menu-section {
	list-style-type: none;
	padding: 0;
	margin: 0;
}

.header-menu-section-title {
	padding: 40px 16px 8px 20px;
	border-bottom: 1px solid menu.$menu-border-color;
	font-size: 1.1rem !important;
	margin-bottom: 8px;
	color: #212529;
	text-transform: capitalize;
	font-weight: 700;
}
</style>
