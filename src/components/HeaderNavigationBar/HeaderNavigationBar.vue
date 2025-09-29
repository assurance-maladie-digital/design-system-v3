<script setup lang="ts">
	import HeaderBar from '@/components/HeaderBar/HeaderBar.vue'
	import HeaderBurgerMenu from '@/components/HeaderBar/HeaderBurgerMenu/HeaderBurgerMenu.vue'
	import HeaderMenuItem from '@/components/HeaderBar/HeaderBurgerMenu/HeaderMenuItem/HeaderMenuItem.vue'
	import HeaderMenuSection from '@/components/HeaderBar/HeaderBurgerMenu/HeaderMenuSection/HeaderMenuSection.vue'
	import useHeaderResponsiveMode from '@/components/HeaderBar/useHeaderResponsiveMode'
	import type { CustomizableOptions } from '@/composables/useCustomizableOptions'
	import { computed, ref } from 'vue'
	import { type RouteLocationRaw } from 'vue-router'
	import HorizontalNavbar from './HorizontalNavbar/HorizontalNavbar.vue'
	import type { NavigationItem } from './types'

	const props = withDefaults(defineProps<CustomizableOptions & {
			homeAriaLabel?: string
			serviceTitle?: string
			serviceSubtitle?: string
			homeLink?: {
				ariaLabel?: string
				to?: RouteLocationRaw
				href?: string
			}
			/** Keep the header visible */
			sticky?: boolean
			/**
			 * Show the header at sticky only when the user scroll up in mobile
			 * Need 'sticky' at true,
			 */
			hideWhenDown?: boolean
			/**
			 * The number of item to shown in the horizontal menu before using
			 * the Burger menu (default: 6)
			 */
			maxHorizontalMenuItems?: number
			/**
			 * The items to show in the horizontal menu
			 */
			items?: NavigationItem[]
			/** Si activé, une confirmation sera demandée avant de changer d'onglet */
			confirmTabChange?: boolean
			/** Message affiché dans la boîte de dialogue de confirmation */
			confirmationMessage?: boolean
		}>(),
		{
			// Confirmation related defaults
			confirmTabChange: false,
			confirmationMessage: false,
			// Navigation related defaults
			homeAriaLabel: undefined,
			serviceTitle: undefined,
			serviceSubtitle: undefined,
			homeLink: undefined,
			sticky: true,
			hideWhenDown: false,
			maxHorizontalMenuItems: 6,
			items: undefined,
		})

	// Définition des événements émis
	const emit = defineEmits(['confirm-tab-change'])

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
		'navigation-bar-prepend': () => unknown
		'navigation-bar-append': () => unknown
		'navigation-bar-content': () => unknown
		'navigation-menu-prepend': (props: SlotProps) => unknown
		'navigation-menu-append': (props: SlotProps) => unknown
		'navigation-menu-content': (props: SlotProps) => unknown
	}>()

	const menuOpen = defineModel<boolean>(
		'burgerMenu',
		{ default: false },
	)

	const { isDesktop } = useHeaderResponsiveMode()

	const horizontalNavbarRef = ref<InstanceType<typeof HorizontalNavbar> | null>(null)

	// Exposer une méthode pour réinitialiser la sélection d'onglet
	defineExpose({
		resetTabSelection: () => {
			// Déléguer au composant HorizontalNavbar si disponible
			if (horizontalNavbarRef.value && !verticalMenu.value) {
				return horizontalNavbarRef.value.resetTabSelection()
			}
			return null
		},
	})

	const verticalMenu = computed<boolean>(() => {
		return (
			!isDesktop.value
			|| (props.items !== undefined
				&& props.items.length > 0
				&& props.items.length > props.maxHorizontalMenuItems)
		)
	})

	// Fonction qui gère la confirmation de changement d'onglet
	// Cette fonction est appelée quand un utilisateur essaie de changer d'onglet
	// et que la confirmation est activée
	function handleConfirmTabChange(message: string, callback: (confirmed: boolean) => void) {
		// Émettre un événement avec le message et le callback
		// Le composant parent pourra écouter cet événement et afficher sa propre UI de confirmation
		emit('confirm-tab-change', message, callback)
	}
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
			<HeaderBurgerMenu
				v-if="verticalMenu"
				v-model="menuOpen"
			>
				<div class="inner-vertical-menu">
					<slot
						name="navigation-menu-prepend"
						:menu-open="menuOpen"
					/>
					<div class="inner-vertical-menu__main-content">
						<slot
							name="navigation-menu-content"
							:menu-open="menuOpen"
						>
							<HeaderMenuSection>
								<HeaderMenuItem
									v-for="item in items"
									:key="item.label"
								>
									<a
										v-if="'href' in item"
										:href="item.href"
									>
										{{ item.label }}
									</a>
									<RouterLink
										v-else-if="item.to"
										:to="item.to"
										@click="menuOpen = false"
									>
										{{ item.label }}
									</RouterLink>
								</HeaderMenuItem>
							</HeaderMenuSection>
						</slot>
					</div>
					<slot
						name="navigation-menu-append"
						:menu-open="menuOpen"
					/>
				</div>
			</HeaderBurgerMenu>
		</template>
		<template
			#logo-brand-content
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
				ref="horizontalNavbarRef"
				:items="items"
				:vuetify-options
				:confirm-tab-change="confirmTabChange"
				@confirm-tab-change="handleConfirmTabChange"
			>
				<template #navigation-bar-prepend>
					<slot name="navigation-bar-prepend" />
				</template>
				<slot name="navigation-bar-content" />
				<template #navigation-bar-append>
					<slot name="navigation-bar-append" />
				</template>
			</HorizontalNavbar>
		</template>
	</HeaderBar>
</template>

<style lang="scss" scoped>
.inner-vertical-menu {
	display: flex;
	flex-direction: column;
	height: 100%;
}

.inner-vertical-menu__main-content {
	flex: 1;
}
</style>
