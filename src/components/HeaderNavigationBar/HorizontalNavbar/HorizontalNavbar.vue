<script setup lang="ts">
	import type { NavigationItem } from '../types'
	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import { config } from './config'

	const props = defineProps<CustomizableOptions & {
		items: NavigationItem[]
	}>()

	defineSlots<{
		'navigation-bar-prepend': () => unknown
		'navigation-bar-append': () => unknown
		'default': () => unknown
	}>()

	const options = useCustomizableOptions(config, props)

</script>

<template>
	<VSheet
		class="horizontal-menu px-12"
		v-bind="options.sheet"
	>
		<slot name="navigation-bar-prepend" />
		<slot>
			<VTabs
				class="horizontal-menu__tabs"
				v-bind="options.tabs"
			>
				<VTab
					v-for="(item, index) in items"
					:key="index"
					:href="item.href"
					:to="item.to"
					v-bind="options.tab"
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
