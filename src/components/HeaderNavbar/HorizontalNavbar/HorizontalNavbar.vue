<script setup lang="ts">
	import { VTabs } from 'vuetify/components'
	import type { NavigationItem } from '../types'
	import { cnamSemanticTokens } from '@/designTokens'

	const backgroundColor = cnamSemanticTokens.colors.background.accentContrasted
	const textBaseColor = cnamSemanticTokens.colors.text.subduedOnDark

	defineProps<{
		items: NavigationItem[]
	}>()

	defineSlots<{
		'navigation-bar-prepend': () => unknown
		'navigation-bar-append': () => unknown
		'default': () => unknown
	}>()

</script>

<template>
	<VSheet
		class="horizontal-menu px-12"
		dense
		theme="dark"
		:color="backgroundColor"
	>
		<slot name="navigation-bar-prepend" />
		<slot>
			<VTabs
				height="53"
				class="horizontal-menu__tabs"
				show-arrows
			>
				<VTab
					v-for="(item, index) in items"
					:key="index"
					:href="item.href"
					:to="item.to"
					slider-color="#fff"
					:base-color="textBaseColor"
					:ripple="false"
					tabindex="0"
					class="horizontal-menu__item"
				>
					<span class="horizontal-menu__item-link">
						{{ item.label }}
					</span>
				</VTab>
			</VTabs>
		</slot>
		<slot name="navigation-bar-append" />
	</VSheet>
</template>

<style lang="scss" scoped>

.horizontal-menu {
	display: flex;
	align-items: center;
}

.horizontal-menu__tabs {
	flex: 1 1 0;
}

.horizontal-menu__item {
	cursor: pointer;
}

.horizontal-menu__item-link {
	font-size: 0.875rem;
	font-weight: 700;
}

.v-tab-item--selected span {
	color: #fff;
}
</style>
