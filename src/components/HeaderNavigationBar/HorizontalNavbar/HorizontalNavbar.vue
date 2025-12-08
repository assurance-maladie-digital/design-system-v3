<script setup lang="ts">
	import { VSheet } from 'vuetify/components'
	import { computed, ref, watch, onMounted, getCurrentInstance } from 'vue'
	import type { Router, RouteLocationNormalizedLoaded } from 'vue-router'

	import SyTabs from '../../Customs/SyTabs/SyTabs.vue'
	import type { TabItem } from '../../Customs/SyTabs/types'

	import { type NavigationItem } from '../types'
	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import { config } from './config'

	// Type des méthodes exposées
	type ExposedMethods = {
		resetTabSelection: () => { activeTab: number, activeItemIndex: number }
	}

	const props = withDefaults(defineProps<CustomizableOptions & {
		items: NavigationItem[]
		/** Si activé, une confirmation sera demandée avant de changer d'onglet */
		confirmTabChange?: boolean
		/** Message affiché dans la boîte de dialogue de confirmation */
		confirmationMessage?: boolean
	}>(), {
		confirmTabChange: false,
		confirmationMessage: false,
	})

	// Définition des événements émis
	const emit = defineEmits(['cancel-navigation', 'confirm-tab-change'])

	defineSlots<{
		'navigation-bar-prepend': () => unknown
		'navigation-bar-append': () => unknown
		'default': () => unknown
	}>()

	// Exposer les méthodes pour permettre au composant parent d'interagir
	defineExpose<ExposedMethods>({
		resetTabSelection,
	})

	const options = useCustomizableOptions(config, props)

	// Safely get route and router through getCurrentInstance - they might not be available in all contexts
	const instance = getCurrentInstance()
	const route = instance?.appContext.config.globalProperties.$route as RouteLocationNormalizedLoaded | null || null
	const router = instance?.appContext.config.globalProperties.$router as Router | null || null

	// Chemin courant réactif (prend router.currentRoute si dispo)
	const currentPath = computed<string | null>(() => router?.currentRoute?.value?.path ?? route?.path ?? (typeof window !== 'undefined' ? window.location.pathname : null))

	// État pour suivre l'élément actif (-1 signifie aucun onglet actif)
	const activeTab = ref<number>(-1)
	const activeItemIndex = ref<number>(-1)

	// Convertir les items de navigation en format TabItem pour SyTabs
	const tabItems = computed<TabItem[]>(() => {
		if (!Array.isArray(props.items)) return []
		return props.items.map((item, index) => ({
			label: item.label,
			value: index,
			content: '',
			href: item.href,
			to: item.to,
			disabled: item.disabled,
		}))
	})

	// Fonction pour déterminer si un élément de navigation est actif
	function isActive(item: NavigationItem, index: number): boolean {
		// Si l'élément est désactivé, il ne peut pas être actif
		if (item.disabled) {
			return false
		}

		// Ne pas court-circuiter sur l'état interne; recalculer toujours à partir de la route courante

		// Pour les liens internes (router-link)
		const pathNow = currentPath.value
		if (item.to && pathNow) {
			// Gestion des objets de route
			if (typeof item.to === 'object') {
				// Comparer avec le chemin de la route actuelle
				const path = item.to.path || ''
				const isActiveRoute = pathNow === path
				if (isActiveRoute) activeItemIndex.value = index
				return isActiveRoute
			}

			// Gestion des chaînes de caractères
			if (typeof item.to === 'string') {
				// Comparer exactement ou vérifier si c'est un sous-chemin
				const isActiveRoute = pathNow === item.to || (item.to !== '/' && pathNow.startsWith(item.to))
				if (isActiveRoute) activeItemIndex.value = index
				return isActiveRoute
			}
		}

		// Pour les liens externes, on pourrait comparer avec window.location.href
		if (item.href && typeof window !== 'undefined') {
			const isActiveLink = window.location.href === item.href
			if (isActiveLink) activeItemIndex.value = index
			return isActiveLink
		}

		return false
	}

	// Fonction pour activer un élément au clic
	function setActiveItem(index: number) {
		activeItemIndex.value = index
		activeTab.value = index
	}

	// Fonction pour gérer la navigation lors d'un changement d'onglet
	async function handleTabChange(index: number) {
		// Récupérer l'élément correspondant à cet index
		const item = props.items?.[index]

		// Ne pas continuer si l'item est désactivé ou n'existe pas
		if (!item || item.disabled) {
			return
		}

		// Mettre à jour l'élément actif
		setActiveItem(index)

		// Si confirmTabChange est activé, ne pas gérer la navigation ici
		// car c'est SyTabs qui s'en charge après la confirmation
		if (props.confirmTabChange) {
			return
		}

		// Navigation vers la destination si nécessaire
		if (item.to && router) {
			try {
				await router.push(item.to)
			}
			catch (error) {
				console.error('Erreur de navigation:', error)
			}
			return
		}

		// Gestion des liens externes avec href si nécessaire
		if (item.href && item.href.trim() !== '') {
			window.location.href = item.href
		}
	}

	// Fonction pour gérer les confirmations de changement d'onglet
	function handleConfirmTabChange(message: string, callback: (confirmed: boolean) => void) {
		// Transmettre l'événement au composant parent HeaderNavigationBar
		// en passant le callback qui sera appelé plus tard avec le résultat
		emit('confirm-tab-change', message, callback)
	}

	// Fonction pour synchroniser l'onglet actif avec l'URL courante
	function resetTabSelection() {
		// Si les items ne sont pas un tableau ou vides, ne rien faire
		if (!Array.isArray(props.items) || props.items.length === 0 || !route) {
			return { activeTab: activeTab.value, activeItemIndex: activeItemIndex.value }
		}

		let foundActiveItem = false

		// Trouver l'élément actif basé sur la route courante
		for (let i = 0; i < props.items.length; i++) {
			if (isActive(props.items[i], i)) {
				activeItemIndex.value = i
				activeTab.value = i
				foundActiveItem = true
				break
			}
		}

		// Si aucun élément n'est actif, aucun onglet ne doit être sélectionné
		if (!foundActiveItem) {
			activeItemIndex.value = -1
			activeTab.value = -1
		}

		return { activeTab: activeTab.value, activeItemIndex: activeItemIndex.value }
	}

	// Initialiser l'élément actif au montage
	onMounted(() => {
		resetTabSelection()
	})

	// Surveiller les changements de route pour mettre à jour l'élément actif
	watch(() => currentPath.value, () => {
		// Si route est undefined, ne rien faire
		if (!currentPath.value) return
		if (Array.isArray(props.items)) {
			// Reset activeItemIndex
			activeItemIndex.value = -1

			// Trouver l'élément actif basé sur la nouvelle route
			let found = false
			for (let i = 0; i < props.items.length; i++) {
				if (isActive(props.items[i], i)) {
					activeItemIndex.value = i
					activeTab.value = i
					found = true
					break
				}
			}
			if (!found) {
				activeItemIndex.value = -1
				activeTab.value = -1
			}
		}
	})
</script>

<template>
	<VSheet
		v-bind="{
			theme: options.sheet.theme,
			color: options.sheet.color,
			class: { 'v-sheet--dense': options.sheet.dense }
		}"
	>
		<div class="horizontal-menu px-xl-0 px-14">
			<slot name="navigation-bar-prepend" />
			<slot>
				<SyTabs
					class="horizontal-menu__tabs"
					:items="tabItems"
					:model-value="Number(activeTab)"
					:confirm-tab-change="props.confirmTabChange"
					:confirmation-message="props.confirmationMessage"
					:vuetify-options="{
						sheet: { theme: 'dark', color: '#07275C' },
						tab: { 'base-color': '#B5BECE', 'active-color': '#ffffff', 'slider-color': '#fff' },
						tabs: { height: '60' }
					}"
					@update:model-value="async (val) => {
						activeTab = Number(val);
						await handleTabChange(Number(val));
					}"
					@cancel-navigation="emit('cancel-navigation')"
					@confirm-tab-change="handleConfirmTabChange"
				>
					<!-- Ajout des slots pour le contenu personnalisé -->
					<template #tabs-prepend>
						<!-- Contenu optionnel avant les onglets -->
					</template>

					<template #default>
						<!-- Contenu personnalisé pour les onglets si nécessaire -->
					</template>

					<!-- Utiliser v-for directement sur les slots dynamiques sans template imbriqués -->
					<template
						v-for="(item, index) in props.items"
						#[`panel-${index}`]
						:key="index"
					>
						<!-- Le contenu du panneau est intentionnellement vide -->
						<!-- Les liens sont générés directement dans les onglets, pas besoin de contenu dans les panneaux -->
					</template>
				</SyTabs>
			</slot>
			<slot name="navigation-bar-append" />
		</div>
	</VSheet>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens.scss' as *;
@use '@/components/HeaderBar/consts' as *;

.horizontal-menu {
	display: flex;
	align-items: center;
	max-width: $header-max-width;
	margin: 0 auto;
}

.horizontal-menu__nav {
	flex: 1 1 0;
	width: 100%;
}

.horizontal-menu__list {
	display: flex;
	list-style-type: none;
	padding: 0;
	margin: 0;
	width: 100%;
}

.horizontal-menu__item {
	cursor: pointer;
	display: flex;
	align-items: stretch;
}

.horizontal-menu__link {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 16px;
	min-height: 53px; /* Correspond à la hauteur définie dans config.ts */
	font-size: 0.875rem;
	font-weight: 700;
	text-decoration: none;
	color: v-bind("options.tab['base-color']"); /* Utilise la couleur du texte définie dans les options */
	transition: color 0.2s ease;

	&:hover {
		color: #fff;
	}

	&:focus-visible {
		outline: 3px solid #fff; /* Bordure blanche pour un ratio de contraste élevé */
		outline-offset: -3px;
		box-shadow: 0 0 0 1px #07275c; /* Contour secondaire pour améliorer la visibilité */
	}

	&--active,
	&[aria-current='page'] {
		color: #fff;
		border-bottom: 3px solid #fff; /* Bordure solide et plus visible pour les éléments actifs */
		box-shadow: 0 3px 0 0 #fff; /* Double effet pour être sûr que la bordure est bien visible */

		&:focus-visible {
			outline: 3px solid #fff;
			outline-offset: 12px;
		}
	}
}

.horizontal-menu__panel-link {
	display: inline-block;
	padding: 8px 16px;
	margin-top: 8px;
	background-color: v-bind('options.sheet.color');
	color: #fff;
	text-decoration: none;
	border-radius: 4px;
	transition: background-color 0.2s ease;

	&:hover {
		filter: brightness(90%);
	}

	&:focus-visible {
		outline: 3px solid #fff;
		outline-offset: 2px;
	}
}
</style>
