<script setup lang="ts">
	import HeaderBar from '@/components/HeaderBar/HeaderBar.vue'
	import HeaderComplexMenu from '@/components/HeaderBar/HeaderComplexMenu/HeaderComplexMenu.vue'
	import HeaderMenuItem from '@/components/HeaderBar/HeaderComplexMenu/HeaderMenuItem/HeaderMenuItem.vue'
	import HeaderMenuSection from '@/components/HeaderBar/HeaderComplexMenu/HeaderMenuSection/HeaderMenuSection.vue'
	import useHeaderResponsiveMode from '@/components/HeaderBar/useHeaderResponsiveMode'
	import { computed, ref } from 'vue'
	import { RouterLink } from 'vue-router'
	import HorizontalNavbar from './HorizontalNavbar/HorizontalNavbar.vue'
	import type { NavigationItem } from './types'

	const props = withDefaults(defineProps<{
			homeAriaLabel?: string
			serviceTitle?: string
			serviceSubtitle?: string
			/** Keep the header visible */
			sticky?: boolean
			/**
			 * Show the header at sticky only when the user scroll up in mobile
			 * Need 'sticky' at true,
			 */
			hideWhenDown?: boolean
			/**
			 * The number of item to shown in the horizontal menu before using
			 * the complex menu (default: 6)
			 */
			maxHorizontalMenuItems?: number
			/**
			 * The items to show in the horizontal menu
			 */
			items?: NavigationItem[]
		}>(),
		{
			homeAriaLabel: undefined,
			serviceTitle: undefined,
			serviceSubtitle: undefined,
			hideWhenDown: false,
			maxHorizontalMenuItems: 6,
			items: undefined,
		})

	type SlotProps = {
		menuOpen: boolean | undefined
	}

	type LogoProps = {
		homeAriaLabel?: string
		serviceTitle?: string
		serviceSubtitle?: string
	}

	defineSlots<{
		'logo': (props: SlotProps & LogoProps) => unknown
		'logo-brand-content': (props: SlotProps & LogoProps) => unknown
		'header-side': (props: SlotProps) => unknown
	}>()

	const { isDesktop } = useHeaderResponsiveMode()

	const verticalMenu = computed<boolean>(() => {
		return (
			!isDesktop.value
			|| (props.items !== undefined
				&& props.items.length > 0
				&& props.items.length > props.maxHorizontalMenuItems)
		)
	})

	const menuOpen = ref<boolean>()
</script>

<template>
	<HeaderBar
		:sticky="sticky"
		:hide-when-down="hideWhenDown"
		:home-aria-label="homeAriaLabel"
		:service-title="serviceTitle"
		:service-subtitle="serviceSubtitle"
	>
		<template #menu>
			<HeaderComplexMenu v-if="verticalMenu">
				<HeaderMenuSection>
					<HeaderMenuItem
						v-for="item in items"
						:key="item.label"
					>
						<a
							v-if="item.href"
							:href="item.href"
						>
							{{ item.label }}
						</a>
						<RouterLink
							v-else-if="item.to"
							:to="item.to"
						>
							{{ item.label }}
						</RouterLink>
					</HeaderMenuItem>
				</HeaderMenuSection>
			</HeaderComplexMenu>
		</template>
		<template
			#brand-content
		>
			<slot
				name="logo-brand-content"
				:menu-open="menuOpen"
				:home-aria-label="homeAriaLabel"
				:service-title="serviceTitle"
				:service-subtitle="serviceSubtitle"
			/>
		</template>
		<template #logo>
			<slot
				name="logo"
				:menu-open="menuOpen"
				:home-aria-label="homeAriaLabel"
				:service-title="serviceTitle"
				:service-subtitle="serviceSubtitle"
			/>
		</template>
		<template #header-side>
			<slot
				name="header-side"
				:menu-open="menuOpen"
			/>
		</template>
		<template #append>
			<HorizontalNavbar
				v-if="props.items && !verticalMenu"
				:items="items"
			/>
		</template>
	</HeaderBar>
</template>

<style lang="scss" scoped></style>
