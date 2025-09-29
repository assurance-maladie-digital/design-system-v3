<script lang="ts" setup>
	import { VMenu, VList, VListItem } from 'vuetify/components'
	import { mdiChevronDown, mdiChevronRight, mdiMenu } from '@mdi/js'
	import { ref, type PropType, nextTick, onMounted, onBeforeUnmount, watch } from 'vue'
	import type { MenuItem, SelectItem } from './types'
	import { useDisplay } from 'vuetify'
	import { useMobileRightMenu } from './useMobileRightMenu'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'

	const elementWidth = ref(0)
	const menuOpen = ref(false)

	const props = defineProps({
		leftMenu: {
			type: Array as PropType<MenuItem[]>,
			default: () => [
				{
					title: 'Assuré',
					href: 'https://www.ameli.fr/assure',
					openInNewTab: true,
				},
				{
					title: 'Professionnel de santé',
				},
				{
					title: 'Entreprise',
					href: 'https://www.ameli.fr/entreprise',
					openInNewTab: true,
				},
			],
		},
		currentPageIndex: {
			type: Number,
			default: null,
		},
		rightMenu: {
			type: Array as PropType<MenuItem[]>,
			default: () => [
				{
					title: 'Qui sommes-nous ?',
					href: 'https://www.assurance-maladie.ameli.fr/qui-sommes-nous',
					openInNewTab: true,
				},
				{
					title: 'Carrières',
					href: 'https://www.assurance-maladie.ameli.fr/carrieres',
					openInNewTab: true,
				},
				{
					title: 'Études et données',
					href: 'https://www.assurance-maladie.ameli.fr/etudes-et-donnees',
					openInNewTab: true,
				},
				{
					title: 'Presse',
					href: 'https://www.assurance-maladie.ameli.fr/presse',
					openInNewTab: true,
				},
			],
		},
		itemsSelectMenu: {
			type: Array as PropType<SelectItem[]>,
			default: () => [
				{
					text: 'Chirurgien-dentiste',
					value: 'Chirurgien-dentiste',
					href: 'https://www.ameli.fr/chirurgien-dentiste',
					openInNewTab: true,
				},
				{
					text: 'Établissement',
					value: 'Établissement',
					href: 'https://www.ameli.fr/etablissement',
					openInNewTab: true,
				},
				{
					text: 'Exercice coordonné',
					value: 'Exercice coordonné',
					href: 'https://www.ameli.fr/exercice-coordonne',
					openInNewTab: true,
				},
				{
					text: 'Infirmier',
					value: 'Infirmier',
					href: 'https://www.ameli.fr/infirmier',
					openInNewTab: true,
				},
				{
					text: 'Laboratoire d\'analyses médicales',
					value: 'Laboratoire d\'analyses médicales',
					href: 'https://www.ameli.fr/laboratoire-danalyses-medicales',
					openInNewTab: true,
				},
				{
					text: 'Masseur-kinésithérapeute',
					value: 'Masseur-kinésithérapeute',
					href: 'https://www.ameli.fr/masseur-kinesitherapeute',
					openInNewTab: true,
				},
				{
					text: 'Médecin',
					value: 'Médecin',
					href: 'https://www.ameli.fr/medecin',
					openInNewTab: true,
				},
				{
					text: 'Orthophoniste',
					value: 'Orthophoniste',
					href: 'https://www.ameli.fr/orthophoniste',
					openInNewTab: true,
				},
				{
					text: 'Orthoptiste',
					value: 'Orthoptiste',
					href: 'https://www.ameli.fr/orthoptiste',
					openInNewTab: true,
				},
				{
					text: 'Pédicure-podologue',
					value: 'Pédicure-podologue',
					href: 'https://www.ameli.fr/pedicure-podologue',
					openInNewTab: true,
				},
				{
					text: 'Pharmacien',
					value: 'Pharmacien',
					href: 'https://www.ameli.fr/pharmacien',
					openInNewTab: true,
				},
				{
					text: 'Professionnel de la LPP/LATM',
					value: 'Professionnel de la LPP/LATM',
					href: 'https://www.ameli.fr/professionnel-de-la-lpplatm',
					openInNewTab: true,
				},
				{
					text: 'Psychologue',
					value: 'Psychologue',
					href: 'https://www.ameli.fr/psychologue',
					openInNewTab: true,
				},
				{
					text: 'Sage-femme',
					value: 'Sage-femme',
					href: 'https://www.ameli.fr/sage-femme',
					openInNewTab: true,
				},
				{
					text: 'Taxi conventionné',
					value: 'Taxi conventionné',
					href: 'https://www.ameli.fr/taxi-conventionne',
					openInNewTab: true,
				},
				{
					text: 'Transporteur sanitaire',
					value: 'Transporteur sanitaire',
					href: 'https://www.ameli.fr/transporteur-sanitaire',
					openInNewTab: true,
				},
			],
		},
		ariaLeftLabel: {
			type: String,
			default: 'Choix du public',
		},
		ariaRightLabel: {
			type: String,
			default: 'Menu institutionnel',
		},
	})

	// Display breakpoint helpers
	const { smAndDown } = useDisplay()

	// Return proper link component
	const getLinkComponent = (item: MenuItem): string => {
		if (item.href) return 'a'
		// Safely detect a possible router "to" without using 'any'
		const maybeTo = (item as unknown as { to?: unknown }).to
		if (maybeTo !== undefined && maybeTo !== null) return 'RouterLink'
		return 'a'
	}

	// Overlay and focus state
	const showOverlay = ref(false)
	const highlightMenu = ref(false)
	const activeIndex = ref<number | null>(null)
	const activeDescendantId = ref<string | null>(null)
	// Transient audit compatibility: when true, all items are tabbable (0) just after open
	const leftMenuAuditTransient = ref(false)

	const menuButtonRef = ref<HTMLElement | null>(null)

	// Resolve the interactive ancestor (a/button/focusable) for the left menu activator span
	const getLeftActivatorInteractiveEl = (): HTMLElement | null => {
		const raw = menuButtonRef.value as unknown as { $el?: unknown } | HTMLElement | null
		const baseEl = (raw && (raw as { $el?: unknown }).$el) ? (raw as { $el: unknown }).$el as HTMLElement : (raw as HTMLElement | null)
		const elem = baseEl instanceof HTMLElement ? baseEl : null
		const target = elem?.closest('a,button,[tabindex]:not([tabindex="-1"])') as HTMLElement | null
		if (target) return target
		// Fallback to DOM query if ref resolution fails
		return document.querySelector('#left-menu li:nth-child(2) a') as HTMLElement | null
	}
	// Mobile burger and focus management via composable
	const {
		mobileMenuOpen,
		mobileBurgerButtonRef,
		mobileRightMenuRef,
		mobileActiveDescendantId,
		handleMobileMenuKeydown,
		onMobileMenuModel,
		openMobileMenuAndFocus,
	} = useMobileRightMenu()
	const leftMenuListRef = ref<HTMLElement | null>(null)
	const leftMenuRef = ref<HTMLElement | null>(null)

	// Resolve the actual HTMLElement of the left dropdown list (works with Vuetify component refs and teleported content)
	const getLeftDropdownEl = (): HTMLElement | null => {
		const refVal = leftMenuListRef.value as unknown as { $el?: unknown } | HTMLElement | null
		const maybeEl = (refVal && (refVal as { $el?: unknown }).$el) ?? refVal
		// If we got a real HTMLElement, return it; otherwise fallback to the id in the DOM
		if (maybeEl instanceof HTMLElement) return maybeEl
		return document.getElementById('left-dropdown-menu')
	}

	const isCurrentRightLink = (item: MenuItem): boolean => {
		if (!item.href) return false
		try {
			const target = new URL(item.href, window.location.href)
			const current = new URL(window.location.href)
			return target.origin === current.origin && target.pathname === current.pathname
		}
		catch {
			return false
		}
	}

	// Mobile handlers are provided by the composable

	const onLeftMenuModel = (val: boolean) => {
		if (val) {
			leftMenuAuditTransient.value = true
			showOverlay.value = true
			nextTick(() => {
				setTimeout(() => {
					const container = getLeftDropdownEl()
					const first = container?.querySelector('[role="menuitem"]') as HTMLElement | null
					if (first) {
						activeDescendantId.value = first.id || 'menu-item-0'
						first.focus()
					}
				}, 30)
			})
		}
		else {
			hideOverlay()
		}
	}

	// Hide overlay and reset menu state
	const hideOverlay = () => {
		showOverlay.value = false
		menuOpen.value = false
		activeDescendantId.value = null
	}

	// Handle click on left menu links
	const handleLink = (index: number) => {
		if (index === 1) {
			// Toggle overlay visibility when clicking the dropdown activator (required by tests)
			showOverlay.value = !showOverlay.value
		}
	}

	// Update active link and manage overlay highlight logic
	const checkActiveLink = (index: number) => {
		if (props.currentPageIndex === null) {
			activeIndex.value = index
		}
		if (index !== 1) {
			// Clicking a normal link should close any overlay/menu
			highlightMenu.value = false
			hideOverlay()
		}
	}

	// onMobileMenuModel provided by composable

	// openMobileMenuAndFocus provided by composable

	// Computed pour déterminer quel élément doit avoir aria-current
	const getCurrentPageIndex = () => {
		return props.currentPageIndex !== null ? props.currentPageIndex : activeIndex.value
	}

	const deleteActiveLink = () => {
		activeIndex.value = null
		// Close any overlay when navigating via right menu
		hideOverlay()
	}

	const handleKeyboardEnter = (item: MenuItem, index: number) => {
		if (index === 1) {
			// Pour le menu déroulant, ouvrir le menu et l'overlay
			openMenuWithKeyboard()
		}
		else if (item.href) {
			// Pour les liens, naviguer vers la destination
			checkActiveLink(index)
			// Ensure overlay is closed when navigating via keyboard
			hideOverlay()
			if (item.openInNewTab) {
				window.open(item.href, '_blank', 'noopener,noreferrer')
			}
			else {
				window.location.href = item.href
			}
		}
		else if (item.to) {
			// Pour les liens RouterLink, on ne fait que mettre à jour l'activeIndex
			// car Vue Router gérera la navigation
			checkActiveLink(index)
			// Ensure overlay is closed when navigating via router
			hideOverlay()
		}
	}

	const dropdownMenuTitle = ref(props.leftMenu.find((_, i) => i === 1)?.title || 'Menu')
	const selectedSubItemText = ref(dropdownMenuTitle.value)

	const handleSubMenuItemClick = (subItem: SelectItem) => {
		dropdownMenuTitle.value = subItem.text
		activeIndex.value = 1
		selectedSubItemText.value = subItem.text // Update selected sub-item tracker

		// Fermer le menu et l'overlay puis rediriger le focus sur le bouton
		hideOverlay()

		// Rediriger le focus sur le bouton après sélection
		nextTick(() => {
			const focusTarget = getLeftActivatorInteractiveEl()
			focusTarget?.focus()
		})

		if (subItem.href) {
			if (subItem.openInNewTab) {
				window.open(subItem.href, '_blank', 'noopener,noreferrer')
			}
			else {
				window.location.href = subItem.href
			}
		}
	}

	const updateWidth = async () => {
		await nextTick()
		// Measure second left-menu item width using the leftMenuRef (nav > ul > li:nth-child(2))
		const navLike = leftMenuRef.value as unknown as { $el?: unknown } | HTMLElement | null
		const navEl = (navLike && (navLike as { $el?: unknown }).$el) ? (navLike as { $el: unknown }).$el as HTMLElement : (navLike as HTMLElement | null)
		const secondLi = navEl?.querySelector('ul > li:nth-child(2)') as HTMLElement | null
		if (secondLi) {
			elementWidth.value = secondLi.offsetWidth || 0
		}
	}

	onMounted(() => {
		updateWidth()
		// Pour mettre à jour en temps réel, vous pouvez utiliser:
		window.addEventListener('resize', updateWidth)
	})

	watch(selectedSubItemText, () => {
		updateWidth()
	})

	// N'oubliez pas de nettoyer l'event listener
	onBeforeUnmount(() => {
		window.removeEventListener('resize', updateWidth)
	})

	// Gestion de la navigation clavier dans le menu (scopée au menu courant)
	const handleMenuKeydown = (event: KeyboardEvent) => {
		// Exit transient audit mode on first real keyboard interaction inside the menu
		if (leftMenuAuditTransient.value) leftMenuAuditTransient.value = false
		const container = event.currentTarget as HTMLElement | null
		const menuItems = container ? (Array.from(container.querySelectorAll('[role="menuitem"]')) as HTMLElement[]) : []
		if (!menuItems || menuItems.length === 0) return

		const currentIndex = activeDescendantId.value
			? menuItems.findIndex(item => item.id === activeDescendantId.value)
			: -1

		let newIndex = currentIndex

		switch (event.key) {
		case 'ArrowDown':
			event.preventDefault()
			newIndex = currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0
			break
		case 'ArrowUp':
			event.preventDefault()
			newIndex = currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1
			break
		case 'Home':
			event.preventDefault()
			newIndex = 0
			break
		case 'End':
			event.preventDefault()
			newIndex = menuItems.length - 1
			break
		case 'Escape': {
			event.preventDefault()
			menuOpen.value = false
			showOverlay.value = false
			activeDescendantId.value = null
			// Retourner le focus sur le lien du 2ème menu (Professionnel de santé) via ref robuste
			const secondMenuItem = getLeftActivatorInteractiveEl()
			secondMenuItem?.focus()
			return
		}
		case 'Enter':
		case ' ':
			event.preventDefault()
			if (currentIndex >= 0) {
				(menuItems[currentIndex] as HTMLElement).click()
			}
			return
		default: {
			// Navigation par caractère - recherche d'un item qui commence par la lettre tapée
			if (event.key.length === 1 && /^[a-zA-ZÀ-ÿ]$/.test(event.key)) {
				event.preventDefault()
				const searchChar = event.key.toLowerCase()

				// Commencer la recherche à partir de l'élément suivant le focus actuel
				const startIndex = currentIndex >= 0 ? currentIndex + 1 : 0

				// Rechercher d'abord à partir de l'index de départ jusqu'à la fin
				for (let i = startIndex; i < menuItems.length; i++) {
					const itemText = menuItems[i].textContent?.trim().toLowerCase()
					if (itemText && itemText.startsWith(searchChar)) {
						activeDescendantId.value = (menuItems[i] as HTMLElement).id
						return
					}
				}

				// Si rien trouvé, rechercher du début jusqu'à l'index de départ
				for (let i = 0; i < startIndex; i++) {
					const itemText = (menuItems[i] as HTMLElement).textContent?.trim().toLowerCase()
					if (itemText && itemText.startsWith(searchChar)) {
						activeDescendantId.value = (menuItems[i] as HTMLElement).id
						return
					}
				}
			}
			break
		}
		}

		if (newIndex !== currentIndex && newIndex >= 0) {
			activeDescendantId.value = menuItems[newIndex].id
			// Move real focus to the active item (roving tabindex)
			const nextEl = menuItems[newIndex] as HTMLElement
			nextTick(() => nextEl.focus())
		}
	}

	// Ouvrir le menu et placer le focus sur le premier élément (menu gauche)
	const openMenuWithKeyboard = () => {
		menuOpen.value = true
		showOverlay.value = true
		nextTick(() => {
			setTimeout(() => {
				const container = getLeftDropdownEl()
				const firstMenuItem = container?.querySelector('[role="menuitem"]') as HTMLElement | null
				if (firstMenuItem) {
					activeDescendantId.value = firstMenuItem.id || 'menu-item-0'
					firstMenuItem.focus()
				}
			}, 30)
		})
	}

	defineExpose({
		hideOverlay,
		handleLink,
		checkActiveLink,
		deleteActiveLink,
		activeIndex,
		highlightMenu,
		showOverlay,
		getLinkComponent,
		handleSubMenuItemClick,
		handleKeyboardEnter,
		openMenuWithKeyboard,
		handleMenuKeydown,
	})
</script>

<template>
	<header class="toolbar">
		<div class="container">
			<section class="left-section">
				<slot name="left-menu">
					<button
						v-if="showOverlay"
						aria-label="Close overlay"
						class="overlay"
						@click="hideOverlay"
						@keydown.enter="hideOverlay"
						@keydown.esc="hideOverlay"
					/>
					<nav
						id="left-menu"
						ref="leftMenuRef"
						:aria-label="props.ariaLeftLabel"
						role="navigation"
					>
						<ul>
							<li
								v-for="(item, index) in props.leftMenu"
								:key="index"
								:class="{
									active: getCurrentPageIndex() === index && selectedSubItemText !== 'Professionnel de santé',
									'menu-open': index === 1 && menuOpen,
									'current-page': getCurrentPageIndex() === index
								}"
							>
								<component
									:is="getLinkComponent(item as MenuItem)"
									:aria-label="itemsSelectMenu && index === 1 ? dropdownMenuTitle + ', Menu déroulant' : item.title"
									:href="item.href"
									:rel="item.openInNewTab ? 'noopener noreferrer' : undefined"
									:tabindex="0"
									:target="item.openInNewTab ? '_blank' : undefined"
									:title="item.title"
									:to="item.to"
									:aria-current="getCurrentPageIndex() === index ? 'page' : undefined"
									:aria-expanded="itemsSelectMenu && index === 1 ? (menuOpen ? 'true' : 'false') : undefined"
									:aria-haspopup="itemsSelectMenu && index === 1 ? 'menu' : undefined"
									:aria-controls="itemsSelectMenu && index === 1 && menuOpen ? 'left-dropdown-menu' : undefined"
									@click="checkActiveLink(index)"
									@focus="index === 1 && showOverlay ? highlightMenu = true : null"
									@mouseover="index === 1 && showOverlay ? highlightMenu = true : null"
									@keydown.enter.prevent="handleKeyboardEnter(item, index)"
									@keydown.space.prevent="index === 1 ? openMenuWithKeyboard() : null"
									@keydown.arrow-down.prevent="index === 1 ? openMenuWithKeyboard() : null"
								>
									<span
										v-if="itemsSelectMenu && index === 1"
										ref="menuButtonRef"
										:class="{ 'link-active': activeIndex === index, 'menu-open': menuOpen }"
										:style="smAndDown ? {minWidth: '136px'} : {minWidth: '236px'}"
										class="sy-header-button d-flex justify-space-between"
									>
										{{ dropdownMenuTitle }}
										<SyIcon
											:icon="mdiChevronDown"
											size="small"
											decorative
											class="ml-1"
										/>
									</span>
									<v-menu
										v-if="itemsSelectMenu && index === 1"
										v-model="menuOpen"
										location="bottom"
										attach="body"
										scroll-strategy="none"
										:offset="[-12,0]"
										:close-on-content-click="true"
										activator="parent"
										content-class="left-dropdown-menu"
										@update:model-value="onLeftMenuModel"
									>
										<v-list
											id="left-dropdown-menu"
											ref="leftMenuListRef"
											role="menu"
											tabindex="-1"
											:class="smAndDown ? 'mt-2 smAndDown' : 'mt-3'"
											:style="smAndDown ? { width: '100vw', maxWidth: '100vw' } : { width: elementWidth >= 260 ? elementWidth + 'px' : '236px' }"
											@keydown="handleMenuKeydown"
										>
											<v-list-item
												v-for="(subItem, subIndex) in itemsSelectMenu"
												:id="`menu-item-${subIndex}`"
												:key="subIndex"
												role="menuitem"
												:tabindex="leftMenuAuditTransient ? 0 : (activeDescendantId === `menu-item-${subIndex}` ? 0 : -1)"
												:aria-selected="undefined"
												:aria-current="subItem.text === selectedSubItemText && getCurrentPageIndex() === 1 ? 'page' : undefined"
												:class="{
													'subitem-selected': subItem.text === selectedSubItemText,
													'menu-item-focused': activeDescendantId === `menu-item-${subIndex}`
												}"
												@click="handleSubMenuItemClick(subItem)"
											>
												<v-list-item-title
													class="text-primary"
													role="presentation"
												>
													<SyIcon
														:icon="mdiChevronRight"
														size="small"
														decorative
														class="ml-1"
													/>
													<span>
														{{ subItem.text }}
													</span>
												</v-list-item-title>
											</v-list-item>
										</v-list>
									</v-menu>
									<span
										v-else
										class="link"
									>
										{{ item.title }}
									</span>
								</component>
							</li>
						</ul>
					</nav>
				</slot>
			</section>
			<section class="right-section">
				<!-- Mobile burger menu for right menu (accessible) -->
				<div
					v-if="smAndDown"
					class="mobile-burger"
				>
					<v-menu
						v-model="mobileMenuOpen"
						location="bottom right"
						origin="top right"
						attach="body"
						content-class="mobile-burger-menu"
						eager
						:offset="[0,0]"
						:close-on-content-click="true"
						@update:model-value="onMobileMenuModel"
					>
						<template #activator="{ props: activatorProps }">
							<button
								ref="mobileBurgerButtonRef"
								type="button"
								class="burger-btn"
								v-bind="activatorProps"
								:aria-label="props.ariaRightLabel"
								:title="props.ariaRightLabel"
								aria-haspopup="menu"
								:aria-expanded="mobileMenuOpen ? 'true' : 'false'"
								aria-controls="mobile-right-menu"
								@keydown.space.prevent="openMobileMenuAndFocus()"
								@keydown.enter.prevent="openMobileMenuAndFocus()"
							>
								<SyIcon
									:icon="mdiMenu"
									size="small"
									decorative
								/>
							</button>
						</template>
						<v-list
							id="mobile-right-menu"
							ref="mobileRightMenuRef"
							role="menu"
							tabindex="-1"
							:aria-activedescendant="mobileActiveDescendantId || undefined"
							:aria-label="props.ariaRightLabel"
							@keydown="handleMobileMenuKeydown"
						>
							<v-list-item
								v-for="(item, index) in props.rightMenu"
								:id="`mobile-item-${index}`"
								:key="index"
								link
								role="menuitem"
								:aria-current="isCurrentRightLink(item) ? 'page' : undefined"
								:href="item.href"
								:to="item.to"
								:target="item.openInNewTab ? '_blank' : undefined"
								:rel="item.openInNewTab ? 'noopener noreferrer' : undefined"
								:class="{ 'mobile-right-link': true, 'menu-item-focused': mobileActiveDescendantId === `mobile-item-${index}` }"
								tabindex="0"
								@click="mobileMenuOpen = false"
							>
								<v-list-item-title class="text-primary">
									<SyIcon
										:icon="mdiChevronRight"
										size="small"
										decorative
										class="mr-1"
									/>
									{{ item.title }}
								</v-list-item-title>
							</v-list-item>
						</v-list>
					</v-menu>
				</div>
				<slot
					v-if="!smAndDown"
					name="right-menu"
				>
					<nav
						id="right-menu"
						:aria-label="props.ariaRightLabel"
						role="navigation"
					>
						<ul>
							<li
								v-for="(item, index) in props.rightMenu"
								:key="index"
							>
								<component
									:is="getLinkComponent(item as MenuItem)"
									:aria-label="item.title"
									:href="item.href"
									:rel="item.openInNewTab ? 'noopener noreferrer' : undefined"
									:tabindex="0"
									:target="item.openInNewTab ? '_blank' : undefined"
									:title="item.title"
									:to="item.to"
									@click="deleteActiveLink()"
								>
									<span class="right-menu-item">{{ item.title }}</span>
								</component>
							</li>
						</ul>
					</nav>
				</slot>
			</section>
		</div>
	</header>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';
@use '../HeaderBar/consts' as *;

$header-max-width: 1200px;
$header-breakpoint-sm: 768px;
$header-breakpoint-md: 1000px;
$font-sm: 12px;
$menu-padding: 10px 16px;
$menu-padding-mobile: 10px 12px;
$std-radius: 0;
$blue-lighten-90: tokens.$blue-lighten-90;
$blue-darken-40: tokens.$blue-darken-40;
$blue-darken-60: tokens.$blue-darken-60;
$user-assure: tokens.$user-assure;
$user-professionnel: tokens.$user-professionnel;
$user-entreprise: tokens.$user-entreprise;
$first-item-width: 95px;
$first-item-max-width: 320px;
$first-item-width-mobile: 32px;
$second-item-max-height: 44px;
$second-item-max-height-mobile: 38px;
$second-item-min-width-mobile: 152px;
$select-min-width: auto;
$container-max-height: 45px;
$container-max-height-mobile: 41px;
$mobile-text-max-width: 182px;
$z-toolbar: 2; // Réduit pour permettre à l'overlay de couvrir la barre
$z-menu-item: 10; // Augmenté pour garantir la visibilité du deuxième élément
$z-button: 10; // Augmenté aussi
$z-overlay: 5; // Sans !important pour éviter des problèmes

// --------------------------------
// Main toolbar layout
// --------------------------------
.toolbar {
	background: $blue-lighten-90;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: $z-toolbar; // Réduit pour permettre à l'overlay de couvrir la barre

	// Container for toolbar content
	.container {
		width: 100%;

		/* Use min-height to allow growth with large text instead of clipping */
		min-height: $container-max-height;
		height: auto;
		max-width: $header-max-width;
		display: flex;
		align-items: center;
		justify-content: space-between;

		@media (width <= $header-breakpoint-sm) {
			min-height: $container-max-height-mobile;
			height: auto;
		}

		// Common list styling
		:deep(ul) {
			display: flex;
			align-items: center;
			justify-content: flex-start;

			/* Allow wrapping when text is zoomed so items don't overflow */
			flex-wrap: wrap;
			list-style: none;
			text-decoration: none;
		}

		// Common link styling
		:deep(ul > li > a) {
			display: block;
			color: $blue-darken-40;
			text-decoration: none;
			padding: $menu-padding;
			cursor: pointer;

			&:hover {
				text-decoration: underline;
			}

			@media (width <= $header-breakpoint-sm) {
				font-size: $font-sm;
				padding: $menu-padding-mobile;
			}
		}
	}

	// --------------------------------
	// Left menu styling
	// --------------------------------
	#left-menu {
		ul > li > a {
			font-weight: 700;
			color: $blue-darken-40;
			display: flex;

			&:hover {
				text-decoration: underline;
			}
		}

		// Premier élément (Assuré)
		li:first-child {
			min-width: $first-item-width;
			max-width: $first-item-max-width;
			background: transparent;
			text-align: center;
			z-index: 1; // Position basse pour passer sous l'overlay

			@media (max-width: $header-breakpoint-sm) {
				min-width: $first-item-width-mobile;
			}

			&.active,
			a:hover {
				background: $user-assure;
			}

			// Indicateur visuel non-colorimétrique pour la page actuelle
			&.current-page {
				position: relative;

				a {
					font-weight: 900;
					text-decoration: underline;
				}
			}
		}

		// Deuxième élément (Professionnel de santé)
		li:nth-child(2) {
			z-index: $z-menu-item; // Augmenté pour rester au-dessus de l'overlay

			/* Allow height to grow with larger text sizes */
			min-height: $second-item-max-height;
			position: relative; // Ajout pour garantir l'effet du z-index

			@media (width <= $header-breakpoint-sm) {
				min-height: $second-item-max-height-mobile;
			}

			a {
				/* Let the link grow in height with text zoom */
				min-height: $second-item-max-height;
				position: relative; // Garantit l'application du z-index
				z-index: $z-button; // S'assure que le lien reste visible
				max-width: $first-item-max-width;

				@media (width <= $header-breakpoint-sm) {
					min-height: $second-item-max-height-mobile;
				}
			}

			&.active {
				a,
				button,
				.sy-header-button {
					text-align: left;
					text-decoration: underline;

					/* Allow wrapping to avoid clipping on text zoom */
					white-space: normal;
				}
			}

			a:hover,
			&.highlight,
			&.active {
				background: $user-professionnel;

				.sy-header-button {
					text-decoration: underline;
				}
			}

			// Indicateur visuel non-colorimétrique pour la page actuelle
			&.current-page {
				position: relative;

				a,
				button,
				.sy-header-button {
					text-decoration: underline;
				}
			}
		}

		// Troisième élément (Entreprise)
		li:nth-child(3) {
			background: transparent;
			text-align: center;
			z-index: 1; // Position basse pour passer sous l'overlay

			&.active,
			a:hover {
				background: $user-entreprise;
			}

			// Indicateur visuel non-colorimétrique pour la page actuelle
			&.current-page {
				position: relative;

				a {
					font-weight: 900;
					text-decoration: underline;
				}
			}
		}
	}

	// --------------------------------
	// Right menu styling
	// --------------------------------
	#right-menu {
		@media (width <= $header-breakpoint-md) {
			display: none;
		}

		ul {
			/* Allow wrapping on text zoom to keep content visible and maintain contrast */
			display: flex;
			flex-wrap: wrap;
			white-space: normal;
			overflow: visible;

			li {
				display: inline-flex;
			}
		}
	}

	// --------------------------------
	// Vuetify input components styling
	// --------------------------------
	:deep(.v-input) {
		.v-input__details {
			display: none;
		}

		.v-input__control {
			font-weight: 700;

			.text-color {
				color: $blue-darken-60;
			}

			.v-icon {
				margin-left: 10px;
			}

			.custom-select {
				display: flex;
				justify-content: space-between;
				width: 100%;

				span {
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;

					@media (width <= $header-breakpoint-sm) {
						max-width: $mobile-text-max-width;
					}
				}
			}

			@media (width <= $header-breakpoint-sm) {
				font-size: $font-sm;
			}
		}
	}
}

// --------------------------------
// Menu elements styling
// --------------------------------
.right-menu-item {
	color: $blue-darken-60;
}

.sy-header-button {
	min-width: $select-min-width;
}

// Selected state for dropdown items
.v-list-item {
	&.subitem-selected {
		.v-list-item-title {
			font-weight: bold;
		}
	}

	&.v-list-item--link:hover {
		background-color: transparent;
	}

	// Style pour l'élément ayant le focus via aria-activedescendant
	&.menu-item-focused {
		background-color: rgb(25 118 210 / 12%);
		outline: 2px solid #1976d2;
		outline-offset: -2px;
	}
}

.v-list-item-title {
	white-space: wrap;
	overflow: hidden;
	display: flex;

	&:hover {
		text-decoration: underline;
	}
}

// --------------------------------
// Dropdown menu open state
// --------------------------------
.menu-open {
	.sy-header-button {
		background: $user-professionnel;
		text-decoration: underline;
		border-bottom-left-radius: $std-radius;
		border-bottom-right-radius: $std-radius;
		position: relative;
		z-index: $z-button;
	}

	a {
		background: $user-professionnel;
		position: relative;
		z-index: 0;
	}

	// Le deuxième élément doit rester visible même quand le menu est ouvert
	&:nth-child(2) {
		position: relative;
		z-index: $z-menu-item;

		a,
		button,
		.sy-header-button {
			z-index: $z-button;
			position: relative;
		}
	}
}

// --------------------------------
// Overlay styling
// --------------------------------
.v-overlay__content .v-list {
	border-top-left-radius: $std-radius;
	border-top-right-radius: $std-radius;
	border-top: 2px solid $user-professionnel;
	overflow: auto;
	max-height: 70vh;
}

:deep(.v-overlay__content) {
	@media (width <= $header-breakpoint-sm) {
		left: 0 !important;
	}
}

/* Make left dropdown overlay full-width on mobile */
:deep(.left-dropdown-menu) {
	@media (width <= $header-breakpoint-sm) {
		width: 100vw !important;
		max-width: 100vw !important;
		left: 0 !important;
		right: 0 !important;
		transform: none !important; /* avoid centering transforms that reduce width */
	}
}

/* Ensure burger menu overlay content fits and aligns right on mobile */
:deep(.mobile-burger-menu) {
	max-width: 100vw;
	width: auto;

	/* Always align to the right edge when attached to body */
	left: auto !important;
	right: 0 !important;
	transform: none !important;
}

/* Mobile burger visibility and button focus styles */
.mobile-burger {
	display: none;

	@media (width <= $header-breakpoint-md) {
		display: block;
	}

	.burger-btn {
		background: transparent;
		border: 1px solid transparent;
		padding: 6px 8px;
		border-radius: 4px;
		cursor: pointer;

		&:focus-visible {
			outline: 2px solid #1976d2;
			outline-offset: 2px;
		}
	}
}

.v-overlay--active {
	z-index: $z-overlay;
}

// Bouton overlay qui couvre la page
.overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgb(0 0 0 / 60%);
	border: none;
	z-index: 3;
}

/* Ensure focused menu item styles also apply to teleported overlay content */
:deep(.menu-item-focused) {
	background-color: rgb(25 118 210 / 12%);
	outline: 2px solid #1976d2;
	outline-offset: -2px;
}

</style>
