<script lang="ts" setup>
	import { computed } from 'vue'
	import { useRoute } from 'vue-router'
	import ThemeSwitcher from '../ThemeSwitcher.vue'
	import { mdiFlaskOutline, mdiFormSelect, mdiViewDashboardOutline, mdiHomeOutline, mdiShieldCheckOutline } from '@mdi/js'

	const route = useRoute()
	const currentPath = computed(() => route.path)

	const navItems = [
		{ label: 'Accueil', to: '/', icon: mdiHomeOutline },
		{ label: 'Formulaire', to: '/form', icon: mdiFormSelect },
		{ label: 'Composants', to: '/components', icon: mdiViewDashboardOutline },
		{ label: 'Validation', to: '/validation', icon: mdiShieldCheckOutline },
	]
</script>

<template>
	<VApp>
		<VNavigationDrawer
			permanent
			app
			color="surface"
			border="0 1 0 0"
		>
			<div class="pa-4">
				<div class="d-flex align-center ga-2 mb-6">
					<VIcon
						:icon="mdiFlaskOutline"
						color="primary"
						size="28"
					/>
					<div>
						<p class="text-h6 font-weight-bold text-primary">
							SandBox DS
						</p>
						<p class="text-caption text-medium-emphasis">
							Terrain de test interactif
						</p>
					</div>
				</div>

				<VList
					density="comfortable"
					nav
				>
					<VListItem
						v-for="item in navItems"
						:key="item.to"
						:to="item.to"
						:active="currentPath === item.to"
						link
						:title="item.label"
						:prepend-icon="item.icon"
						color="primary"
						rounded="lg"
						class="mb-1"
					/>
				</VList>

				<VDivider class="my-4" />

				<p class="text-caption text-medium-emphasis px-3">
					Design System v3 — CNAM
				</p>
			</div>
		</VNavigationDrawer>

		<VMain>
			<div class="theme-switcher-position">
				<ThemeSwitcher />
			</div>
			<VContainer
				fluid
				class="pa-8"
				max-width="1200"
			>
				<RouterView v-slot="{ Component }">
					<Transition name="fade">
						<component :is="Component" />
					</Transition>
				</RouterView>
			</VContainer>
		</VMain>
	</VApp>
</template>

<style scoped>
.theme-switcher-position {
	position: fixed;
	bottom: 16px;
	right: 16px;
	z-index: 100;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
