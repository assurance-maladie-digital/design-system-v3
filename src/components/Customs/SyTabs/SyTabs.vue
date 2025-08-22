<script setup lang="ts">
	import type { TabItem } from './types'
	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import { config } from './config'
	import { ref, watch, onMounted, onUnmounted } from 'vue'

	const props = withDefaults(defineProps<CustomizableOptions & {
		items: TabItem[]
		modelValue?: number | string
		/** Si activé, une confirmation sera demandée avant de changer d'onglet */
		confirmTabChange?: boolean
		/** Message affiché dans la boîte de dialogue de confirmation */
		confirmationMessage?: string
	}>(), {
		modelValue: undefined,
		confirmTabChange: false,
		confirmationMessage: 'Êtes-vous sûr de vouloir changer d\'onglet? Les changements non enregistrés seront perdus.',
	})

	const emit = defineEmits(['update:modelValue', 'cancel-navigation', 'confirm-tab-change'])

	defineSlots<{
		'tabs-prepend': () => unknown
		'tabs-append': () => unknown
		'default': () => unknown
	}>()

	const options = useCustomizableOptions(config, props)

	// État pour suivre l'élément activement sélectionné
	const activeItemIndex = ref<number>(0)
	// Élément actuellement focusé (pour la navigation clavier)
	const focusedItemIndex = ref<number>(-1)

	// Émet un événement pour gérer la confirmation de changement d'onglet
	async function showConfirmationDialog(message: string): Promise<boolean> {
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
	async function setActiveItem(index: number) {
		// Si l'index est déjà actif, ne rien faire
		if (index === activeItemIndex.value) return

		// Récupérer l'item pour la navigation potentielle
		const item = props.items[index]
		const hasHref = item && (item.href || item.to)

		// Si la confirmation est activée, demander confirmation
		if (props.confirmTabChange) {
			const confirmMessage = props.confirmationMessage || 'Êtes-vous sûr de vouloir changer d\'onglet?'
			const confirmed = await showConfirmationDialog(confirmMessage)

			if (!confirmed) {
				// L'utilisateur a annulé, émettre un événement d'annulation
				emit('cancel-navigation')
				return
			}

			// Si l'utilisateur a confirmé et qu'il y a un href, naviguer
			if (hasHref) {
				if (item.href) {
					window.location.href = item.href
					return // Arrêter ici car on navigue ailleurs
				} 
				else if (item.to) {
					// Pour les cas où vue-router est utilisé
					// Notez que cela nécessiterait un accès au router,
					// donc on se limite au href pour l'instant
				}
			}
		}
		// Sinon pas de confirmation nécessaire, naviguer directement si href présent
		else if (hasHref && item.href) {
			window.location.href = item.href
			return
		}

		// Mettre à jour l'onglet actif
		activeItemIndex.value = index
		emit('update:modelValue', typeof props.modelValue === 'string' ? props.items[index].value : index)
	}

	// Fonction pour gérer les touches Enter et Space
	function handleKeyPress(event: KeyboardEvent, index: number) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault()
			void setActiveItem(index) // void pour ignorer la promesse
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
			newIndex = currentIndex <= 0 ? itemCount - 1 : currentIndex - 1
			break
		case 'ArrowRight':
			newIndex = currentIndex >= itemCount - 1 ? 0 : currentIndex + 1
			break
		case 'Home':
			newIndex = 0
			break
		case 'End':
			newIndex = itemCount - 1
			break
		}

		// Mettre à jour l'index de l'élément focusé et actif
		focusedItemIndex.value = newIndex

		// Focus sur le nouvel élément et l'activer
		// Vérifier si l'élément existe et se focaliser sur le bouton
		const tabButton = document.getElementById(`tab-${newIndex}`)
		if (tabButton) {
			tabButton.focus()
			setActiveItem(newIndex)
		}
	}

	// Initialiser l'élément actif au montage
	onMounted(() => {
		// Configurer l'accessibilité
		setupAccessibilityFeatures()

		// Si les items ne sont pas un tableau ou vides, ne rien faire
		if (!Array.isArray(props.items) || props.items.length === 0) return

		// Si modelValue est défini, utiliser cette valeur pour déterminer l'index actif
		if (props.modelValue !== undefined) {
			if (typeof props.modelValue === 'number') {
				activeItemIndex.value = props.modelValue
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
</script>

<template>
	<VSheet
		:theme="options.sheet.theme"
		:color="options.sheet.color"
		:class="{ 'v-sheet--dense': options.sheet.dense }"
	>
		<div class="sy-tabs px-xl-0 px-4">
			<slot name="tabs-prepend" />
			<slot>
				<nav
					role="tablist"
					aria-label="Onglets de navigation"
					class="sy-tabs__nav"
				>
					<ul
						class="sy-tabs__list"
					>
						<li
							v-for="(item, index) in Array.isArray(items) ? items : []"
							:key="index"
							class="sy-tabs__item"
							role="presentation"
						>
							<a
								:id="`tab-${index}`"
								class="sy-tabs__button"
								:class="{ 'sy-tabs__button--active': activeItemIndex === index }"
								role="tab"
								:aria-selected="activeItemIndex === index"
								:aria-controls="`panel-${index}`"
								tabindex="0"
								@click="setActiveItem(index)"
								@keydown="(event) => {
									handleKeyPress(event, index);
									handleArrowNavigation(event, index);
								}"
							>
								{{ item.label.toUpperCase() }}
							</a>
						</li>
					</ul>
				</nav>
			</slot>
			<slot name="tabs-append" />
		</div>
	</VSheet>

	<!-- Panneau de contenu des onglets -->
	<div class="sy-tabs-panels">
		<div
			v-for="(item, index) in Array.isArray(items) ? items : []"
			:id="`panel-${index}`"
			:key="`panel-${index}`"
			class="sy-tabs-panel"
			role="tabpanel"
			:aria-labelledby="`tab-${index}`"
			:hidden="activeItemIndex !== index"
		>
			<slot
				:name="`panel-${index}`"
				:active="activeItemIndex === index"
			>
				{{ item.content || '' }}
			</slot>
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
	list-style-type: none;
	padding: 0;
	margin: 0;
	width: 100%;
}

.sy-tabs__item {
	cursor: pointer;
	display: flex;
	align-items: stretch;
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

	&:hover {
		color: v-bind("options.tab['active-color']");
	}

	&:focus-visible {
		outline: 3px solid v-bind("options.tab['active-color']");
		outline-offset: -3px;
	}

	&--active {
		color: v-bind("options.tab['active-color']");
		border-bottom: 3px solid v-bind("options.tab['slider-color']");
	}
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
