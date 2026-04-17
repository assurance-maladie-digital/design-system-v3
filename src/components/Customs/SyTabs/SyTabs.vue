<script setup lang="ts">
	import useCustomizableOptions from '@/composables/useCustomizableOptions'
	import { computed, getCurrentInstance, onMounted, onUnmounted, ref, watch } from 'vue'
	import type { Router } from 'vue-router'
	import { config } from './config'
	import type { TabItem } from './types'
	import { useTabTransition } from './useTabTransition'

	const props = withDefaults(defineProps<{
		items: TabItem[]
		modelValue?: number | string
		/** Si activé, une confirmation sera demandée avant de changer d'onglet */
		confirmTabChange?: boolean
		/** Message affiché dans la boîte de dialogue de confirmation */
		confirmationMessage?: string
		/** Si activé, le contenu des onglets ne sera rendu que lorsqu'ils deviendront actifs */
		lazy?: boolean
		vuetifyOptions?: {
			sheet?: {
				theme?: string
				dense?: boolean
				color?: string
			}
			tabs?: {
				height?: string
				showArrows?: boolean
			}
			tab?: {
				'base-color'?: string
				'active-color'?: string
				'slider-color'?: string
				'ripple'?: boolean
			}
		}
	}>(), {
		modelValue: undefined,
		confirmTabChange: false,
		confirmationMessage: 'Voulez-vous vraiment changer d\'onglet ?',
		lazy: false,
		vuetifyOptions: () => ({}),
	})

	// Disable automatic attribute inheritance since we handle it manually
	defineOptions({
		inheritAttrs: false,
	})

	const emit = defineEmits<{
		'update:modelValue': [value: number | string]
		'cancel-navigation': []
		'confirm-tab-change': [message: string, resolve: (confirmed: boolean) => void]
	}>()

	defineSlots<{
		'tabs-prepend': () => unknown
		'tabs-append': () => unknown
		'default': () => unknown
		'tab-prepend': (props: { item: TabItem, index: number, isActive: boolean }) => unknown
		'tab-append': (props: { item: TabItem, index: number, isActive: boolean }) => unknown
	}>()

	const options = useCustomizableOptions(config, { vuetifyOptions: props.vuetifyOptions })

	// Détecte automatiquement si le composant est utilisé pour la navigation
	const isNavigationMode = computed(() => props.items.some(item => !!item.to || !!item.href))

	// Safely get router through getCurrentInstance - it might not be available in all contexts
	const instance = getCurrentInstance()
	const router = instance?.appContext.config.globalProperties.$router as Router | null || null

	// État pour suivre l'élément activement sélectionné
	const activeItemIndex = ref<number>(0)
	// Élément actuellement focusé (pour la navigation clavier)
	const focusedItemIndex = ref<number>(-1)

	// Keep track of rendered panels for lazy loading
	const renderedPanels = ref<Set<number>>(new Set([0]))

	// Observer les changements pour le lazy loading
	watch(activeItemIndex, (newIndex) => {
		if (props.lazy && !renderedPanels.value.has(newIndex)) {
			renderedPanels.value.add(newIndex)
		}
	}, { immediate: true })

	// Émet un événement pour gérer la confirmation de changement d'onglet
	async function handleTabChangeConfirmation(message: string): Promise<boolean> {
		// Émettre l'événement avec le message et retourner une promesse
		let resolver: (value: boolean) => void
		const promise = new Promise<boolean>((resolve) => {
			resolver = resolve
		})

		// Émettre l'événement avec le message et un callback pour résoudre la promesse
		emit('confirm-tab-change', message, (confirmed: boolean) => {
			resolver(confirmed)
		})

		return promise
	}

	// Fonction pour activer un élément au clic avec confirmation si nécessaire
	async function setActiveItem(index: number): Promise<void> {
		// Si l'index est déjà actif ou si l'élément est désactivé, ne rien faire
		if (index === activeItemIndex.value) return

		// Récupérer l'item pour la navigation potentielle
		const item = props.items[index]

		// Ne rien faire si l'élément est désactivé
		if (item?.disabled) return

		// Si la confirmation est activée, demander confirmation
		if (props.confirmTabChange) {
			const confirmMessage = props.confirmationMessage
			const confirmed = await handleTabChangeConfirmation(confirmMessage.toString())

			if (!confirmed) {
				// L'utilisateur a annulé, émettre un événement d'annulation
				emit('cancel-navigation')
				return
			}
		}

		// Mettre à jour l'onglet actif
		activeItemIndex.value = index
		emit('update:modelValue', typeof props.modelValue === 'string' ? props.items[index]!.value : index)

		// Pour les éléments sans navigation (ni href ni to), on ne fait que mettre à jour l'état
		// La navigation pour RouterLink et href se fait automatiquement via les éléments HTML
	}

	// Fonction pour gérer les touches Enter et Space
	function handleKeyPress(event: KeyboardEvent, index: number) {
		if (event.key === 'Enter' || event.key === ' ') {
			const item = props.items[index] as TabItem | undefined
			if (item?.disabled) {
				event.preventDefault()
				return
			}

			if (isNavigationMode.value) {
				// En mode navigation, Enter active le lien nativement.
				// Espace doit forcer le clic pour éviter le scroll
				if (event.key === ' ') {
					event.preventDefault()
					document.getElementById(`tab-${index}`)?.click()
				}
			} else {
				event.preventDefault()
				void setActiveItem(index)
			}
		}
	}

	// Configuration des attributs ARIA et gestion du focus global
	function setupAccessibilityFeatures() {
		// Ajouter un écouteur global pour gérer l'escape key
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && focusedItemIndex.value >= 0) {
				// Retirer le focus des éléments du menu
				focusedItemIndex.value = -1
			}
		}

		window.addEventListener('keydown', handleEscape)

		// Cleanup
		onUnmounted(() => {
			window.removeEventListener('keydown', handleEscape)
		})
	}

	// Navigation clavier entre les tabs (touches de direction)
	function handleArrowNavigation(event: KeyboardEvent, currentIndex: number) {
		if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
		event.preventDefault()
		const itemCount = props.items?.length || 0
		if (itemCount === 0) return

		let newIndex = currentIndex
		switch (event.key) {
		case 'ArrowLeft':
			newIndex = findPreviousEnabledTab(currentIndex)
			break
		case 'ArrowRight':
			newIndex = findNextEnabledTab(currentIndex)
			break
		case 'Home':
			newIndex = findFirstEnabledTab()
			break
		case 'End':
			newIndex = findLastEnabledTab()
			break
		}

		// Si tous les onglets sont désactivés, ne rien faire
		if (newIndex === -1) return

		// Mettre à jour l'index de l'élément focusé et actif
		focusedItemIndex.value = newIndex

		// Focus sur le nouvel élément
		const tabButton = document.getElementById(`tab-${newIndex}`)
		if (tabButton) {
			tabButton.focus()
			// Activer automatiquement seulement en mode onglets locaux
			if (!isNavigationMode.value) {
				setActiveItem(newIndex)
			}
		}
	}

	// Initialiser l'élément actif au montage
	onMounted(() => {
		// Configurer l'accessibilité
		setupAccessibilityFeatures()

		// Si les items sont vides, ne rien faire
		if (!props.items?.length) return

		// Si modelValue est défini, utiliser cette valeur pour déterminer l'index actif
		if (props.modelValue !== undefined) {
			if (typeof props.modelValue === 'number') {
				try {
					const currentPath = window.location?.pathname
					const index = currentPath ? props.items.findIndex(item => item.to === currentPath) : -1

					// Si un index valide est trouvé, l'utiliser
					if (index >= 0) {
						activeItemIndex.value = index
					}
					// Sinon utiliser props.modelValue comme index direct si c'est valide
					else if (props.modelValue >= 0 && props.modelValue < props.items.length) {
						activeItemIndex.value = props.modelValue
					}
				}
				catch {
					// Utiliser props.modelValue comme fallback si c'est dans la plage valide
					if (props.modelValue >= 0 && props.modelValue < props.items.length) {
						activeItemIndex.value = props.modelValue
					}
				}
			}
			else {
				// Chercher l'index de l'item avec la valeur correspondante
				const index = props.items.findIndex(item => item.value === props.modelValue)
				if (index !== -1) {
					activeItemIndex.value = index
				}
			}
		}
		else {
			// Par défaut, sélectionner le premier élément
			activeItemIndex.value = 0
		}
	})

	// Observer les changements du modelValue pour mettre à jour l'élément actif
	watch(() => props.modelValue, (newValue) => {
		if (newValue !== undefined) {
			if (typeof newValue === 'number') {
				activeItemIndex.value = newValue
			}
			else {
				const index = props.items.findIndex(item => item.value === newValue)
				if (index !== -1) {
					activeItemIndex.value = index
				}
			}
		}
	})

	const tablist = ref<HTMLElement | null>(null)
	const { xPosition, width } = useTabTransition(tablist, activeItemIndex)

	// Fonctions utilitaires pour la navigation entre les onglets non désactivés
	function findNextEnabledTab(currentIndex: number): number {
		const itemCount = props.items?.length || 0
		if (itemCount === 0) return -1

		let nextIndex = currentIndex >= itemCount - 1 ? 0 : currentIndex + 1
		let loopCounter = 0

		// Chercher le prochain onglet non désactivé
		while (loopCounter < itemCount && props.items[nextIndex]?.disabled) {
			nextIndex = nextIndex >= itemCount - 1 ? 0 : nextIndex + 1
			loopCounter++
		}

		// Si on a fait le tour et tous les onglets sont désactivés
		return loopCounter < itemCount ? nextIndex : -1
	}

	function findPreviousEnabledTab(currentIndex: number): number {
		const itemCount = props.items?.length || 0
		if (itemCount === 0) return -1

		let prevIndex = currentIndex <= 0 ? itemCount - 1 : currentIndex - 1
		let loopCounter = 0

		// Chercher le précédent onglet non désactivé
		while (loopCounter < itemCount && props.items[prevIndex]?.disabled) {
			prevIndex = prevIndex <= 0 ? itemCount - 1 : prevIndex - 1
			loopCounter++
		}

		// Si on a fait le tour et tous les onglets sont désactivés
		return loopCounter < itemCount ? prevIndex : -1
	}

	function findFirstEnabledTab(): number {
		const itemCount = props.items?.length || 0
		if (itemCount === 0) return -1

		for (let i = 0; i < itemCount; i++) {
			if (!props.items[i]?.disabled) return i
		}

		return -1
	}

	function findLastEnabledTab(): number {
		const itemCount = props.items?.length || 0
		if (itemCount === 0) return -1

		for (let i = itemCount - 1; i >= 0; i--) {
			if (!props.items[i]?.disabled) return i
		}

		return -1
	}

</script>

<template>
	<VSheet
		:theme="options.sheet.theme"
		:color="options.sheet.color"
		:class="[{ 'v-sheet--dense': options.sheet.dense }, $attrs.class]"
		v-bind="$attrs"
	>
		<div class="sy-tabs px-xl-0 px-4">
			<slot name="tabs-prepend" />
			<slot>
				<div class="sy-tabs__nav">
					<component
						:is="isNavigationMode ? 'nav' : 'div'"
						ref="tablist"
						:role="isNavigationMode ? 'navigation' : 'tablist'"
						:aria-label="isNavigationMode ? 'Menu de navigation' : 'Onglets de navigation'"
						class="sy-tabs__list"
					>
						<template
							v-for="(item, index) in items"
							:key="item.label || index"
						>
							<!-- Use RouterLink for internal navigation -->
							<RouterLink
								v-if="item.to && router && !item.disabled"
								:id="`tab-${index}`"
								:to="item.to"
								class="sy-tabs__button"
								:class="{
									'sy-tabs__button--active': activeItemIndex === index,
									'sy-tabs__button--disabled': item.disabled
								}"
								:role="isNavigationMode ? undefined : 'tab'"
								:aria-current="isNavigationMode && activeItemIndex === index ? 'page' : undefined"
								:aria-selected="!isNavigationMode ? activeItemIndex === index : undefined"
								:aria-controls="!isNavigationMode ? `panel-${index}` : undefined"
								:aria-disabled="item.disabled || undefined"
								:tabindex="(activeItemIndex === index && !item.disabled) ? 0 : -1"
								@click="item.disabled ? undefined : setActiveItem(index)"
								@keydown="(event) => {
									if (!item.disabled) {
										handleKeyPress(event, index);
										handleArrowNavigation(event, index);
									}
								}"
							>
								<slot
									name="tab-prepend"
									:item="item"
									:index="index"
									:is-active="activeItemIndex === index"
								/>
								{{ item.label.toUpperCase() }}
								<slot
									name="tab-append"
									:item="item"
									:index="index"
									:is-active="activeItemIndex === index"
								/>
							</RouterLink>
							<!-- Use regular anchor for external links -->
							<a
								v-else-if="item.href && !item.disabled"
								:id="`tab-${index}`"
								:href="item.href"
								class="sy-tabs__button"
								:class="{
									'sy-tabs__button--active': activeItemIndex === index,
									'sy-tabs__button--disabled': item.disabled
								}"
								:role="isNavigationMode ? undefined : 'tab'"
								:aria-current="isNavigationMode && activeItemIndex === index ? 'page' : undefined"
								:aria-selected="!isNavigationMode ? activeItemIndex === index : undefined"
								:aria-controls="!isNavigationMode ? `panel-${index}` : undefined"
								:aria-disabled="item.disabled || undefined"
								:tabindex="(activeItemIndex === index && !item.disabled) ? 0 : -1"
								@click="(event) => {
									if (item.disabled) {
										event.preventDefault();
										return;
									}
									// Don't prevent default for external links - let them navigate naturally
									setActiveItem(index);
								}"
								@keydown="(event) => {
									if (!item.disabled) {
										handleKeyPress(event, index);
										handleArrowNavigation(event, index);
									}
								}"
							>
								<slot
									name="tab-prepend"
									:item="item"
									:index="index"
									:is-active="activeItemIndex === index"
								/>
								{{ item.label.toUpperCase() }}
								<slot
									name="tab-append"
									:item="item"
									:index="index"
									:is-active="activeItemIndex === index"
								/>
							</a>
							<!-- Fallback button for items without navigation -->
							<!-- Version désactivée du RouterLink -->
							<button
								v-else-if="item.to && router && item.disabled"
								:id="`tab-${index}`"
								class="sy-tabs__button"
								:class="{
									'sy-tabs__button--active': activeItemIndex === index,
									'sy-tabs__button--disabled': true
								}"
								:role="isNavigationMode ? undefined : 'tab'"
								:aria-current="isNavigationMode && activeItemIndex === index ? 'page' : undefined"
								:aria-selected="!isNavigationMode ? activeItemIndex === index : undefined"
								:aria-controls="!isNavigationMode ? `panel-${index}` : undefined"
								aria-disabled="true"
								tabindex="-1"
								disabled
							>
								<slot
									name="tab-prepend"
									:item="item"
									:index="index"
									:is-active="activeItemIndex === index"
								/>
								{{ item.label.toUpperCase() }}
								<slot
									name="tab-append"
									:item="item"
									:index="index"
									:is-active="activeItemIndex === index"
								/>
							</button>
							<!-- Version désactivée du lien -->
							<button
								v-else-if="item.href && item.disabled"
								:id="`tab-${index}`"
								class="sy-tabs__button"
								:class="{
									'sy-tabs__button--active': activeItemIndex === index,
									'sy-tabs__button--disabled': true
								}"
								:role="isNavigationMode ? undefined : 'tab'"
								:aria-current="isNavigationMode && activeItemIndex === index ? 'page' : undefined"
								:aria-selected="!isNavigationMode ? activeItemIndex === index : undefined"
								:aria-controls="!isNavigationMode ? `panel-${index}` : undefined"
								aria-disabled="true"
								tabindex="-1"
								disabled
							>
								<slot
									name="tab-prepend"
									:item="item"
									:index="index"
									:is-active="activeItemIndex === index"
								/>
								{{ item.label.toUpperCase() }}
								<slot
									name="tab-append"
									:item="item"
									:index="index"
									:is-active="activeItemIndex === index"
								/>
							</button>
							<!-- Fallback button pour les onglets standards -->
							<button
								v-else
								:id="`tab-${index}`"
								class="sy-tabs__button"
								:class="{
									'sy-tabs__button--active': activeItemIndex === index,
									'sy-tabs__button--disabled': item.disabled
								}"
								:role="isNavigationMode ? undefined : 'tab'"
								:aria-current="isNavigationMode && activeItemIndex === index ? 'page' : undefined"
								:aria-selected="!isNavigationMode ? activeItemIndex === index : undefined"
								:aria-controls="!isNavigationMode ? `panel-${index}` : undefined"
								:aria-disabled="item.disabled || undefined"
								:tabindex="(activeItemIndex === index && !item.disabled) ? 0 : -1"
								:disabled="item.disabled"
								@click="setActiveItem(index)"
								@keydown="(event) => {
									if (!item.disabled) {
										handleKeyPress(event, index);
										handleArrowNavigation(event, index);
									}
								}"
							>
								<slot
									name="tab-prepend"
									:item="item"
									:index="index"
									:is-active="activeItemIndex === index"
								/>
								{{ item.label.toUpperCase() }}
								<slot
									name="tab-append"
									:item="item"
									:index="index"
									:is-active="activeItemIndex === index"
								/>
							</button>
						</template>
					</component>
				</div>
			</slot>
			<slot name="tabs-append" />
		</div>
	</VSheet>

	<!-- Panneau de contenu des onglets -->
	<div class="sy-tabs-panels">
		<div
			v-for="(item, index) in items"
			:id="`panel-${index}`"
			:key="`panel-${index}`"
			class="sy-tabs-panel"
			:role="!isNavigationMode ? 'tabpanel' : undefined"
			:aria-labelledby="!isNavigationMode ? `tab-${index}` : undefined"
			:hidden="activeItemIndex !== index"
		>
			<template v-if="!lazy || renderedPanels.has(index)">
				<slot
					:name="`panel-${index}`"
					:active="activeItemIndex === index"
				>
					{{ item.content || '' }}
				</slot>
			</template>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens.scss' as *;

.sy-tabs {
	display: flex;
	align-items: center;
}

.sy-tabs__nav {
	flex: 1 1 0;
	width: 100%;
}

.sy-tabs__list {
	display: flex;
	position: relative;
	padding: 0;
	margin: 0;
	width: 100%;
}

.sy-tabs__list::after {
	content: '';
	width: v-bind("width + 'px'");
	height: 3px;
	position: absolute;
	bottom: 0;
	left: 0;
	translate: v-bind("xPosition + 'px'");
	transition: translate 0.2s ease-in-out, width 0.2s ease-in-out;
	background-color: v-bind("options.tab['slider-color']");
}

.sy-tabs__button {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 16px;
	min-height: v-bind("options.tabs.height + 'px'");
	font-size: 0.875rem;
	font-weight: 700;
	background: none;
	border: none;
	color: v-bind("options.tab['base-color']");
	transition: color 0.2s ease;
	text-decoration: none; /* For RouterLink elements */

	&:hover:not(.sy-tabs__button--disabled) {
		color: v-bind("options.tab['active-color']");
	}

	&:focus-visible:not(.sy-tabs__button--disabled) {
		outline: 3px solid v-bind("options.tab['active-color']");
		outline-offset: -3px;
	}

	&--active:not(.sy-tabs__button--disabled) {
		color: v-bind("options.tab['active-color']");
	}

	&--disabled {
		color: rgba(var(--v-theme-on-surface), 0.38);
		cursor: not-allowed;
		pointer-events: none;
	}
}

.sy-tabs__button--active::after {
	scale: 1 1;
}

.sy-tabs-panels {
	padding: 16px;
}

.sy-tabs-panel {
	&[hidden] {
		display: none;
	}
}

</style>
