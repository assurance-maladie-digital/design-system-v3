<script lang="ts" setup>
	import { VMenu, VList, VListItem, VIcon } from 'vuetify/components'
	import { mdiChevronDown, mdiChevronRight } from '@mdi/js'
	import { ref, type PropType, nextTick, onMounted, onBeforeUnmount, watch } from 'vue'
	import type { MenuItem, SelectItem } from './types'
	import { useDisplay } from 'vuetify'

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
		ariaLeftMenu: {
			type: String,
			default: 'left-menu',
		},
		ariaRightMenu: {
			type: String,
			default: 'right-menu',
		},
	})

	const { smAndDown } = useDisplay()

	const getLinkComponent = (item: MenuItem): string => {
		if (item.href) {
			return 'a'
		}
		else if (item.to) {
			return 'RouterLink'
		}
		else {
			return 'a' // fix doc
		}
	}

	const showOverlay = ref(false)
	const highlightMenu = ref(false)
	const activeIndex = ref<number | null>(null)

	const hideOverlay = () => {
		const activeSelected = document.querySelector('.custom-select > span')?.textContent
		if (activeSelected && activeSelected === 'Professionnel de santé') {
			highlightMenu.value = false
		}
		showOverlay.value = false
		menuOpen.value = false // S'assurer que le menu se ferme aussi
	}
	const handleLink = (index: number) => {
		if (index === 1) {
			showOverlay.value = !showOverlay.value
		}
	}
	const checkActiveLink = (index: number) => {
		activeIndex.value = index
		if (index !== 1) {
			highlightMenu.value = false
		}
	}

	const deleteActiveLink = () => {
		activeIndex.value = null
	}

	const handleKeyboardEnter = (item: MenuItem, index: number) => {
		if (index === 1) {
			// Pour le menu déroulant, basculer l'état du menu
			menuOpen.value = !menuOpen.value
		}
		else if (item.href) {
			// Pour les liens, naviguer vers la destination
			checkActiveLink(index)
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
		}
	}

	const dropdownMenuTitle = ref(props.leftMenu.find((_, i) => i === 1)?.title || 'Menu')
	const selectedSubItemText = ref(dropdownMenuTitle.value)

	const handleSubMenuItemClick = (subItem: SelectItem) => {
		dropdownMenuTitle.value = subItem.text
		activeIndex.value = 1
		selectedSubItemText.value = subItem.text // Update selected sub-item tracker

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
		const element = document.querySelector('.toolbar #left-menu li:nth-child(2)') as HTMLElement
		if (element) {
			elementWidth.value = element.offsetWidth
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
	})
</script>

<template>
	<div class="toolbar">
		<div class="container">
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
					:aria-labelledby="props.ariaLeftMenu"
					role="navigation"
				>
					<ul ref="secondLiRef">
						<li
							v-for="(item, index) in props.leftMenu"
							:key="index"
							:value="index"
							:class="{ active: activeIndex === index, 'menu-open': index === 1 && menuOpen }"
							:aria-current="activeIndex === index ? 'page' : undefined"
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
								:aria-current="activeIndex === index ? 'page' : undefined"
								@click="checkActiveLink(index)"
								@focus="index === 1 && showOverlay ? highlightMenu = true : null"
								@mouseover="index === 1 && showOverlay ? highlightMenu = true : null"
								@keydown.enter.prevent="handleKeyboardEnter(item, index)"
							>
								<v-menu
									v-if="itemsSelectMenu && index === 1"
									v-model="menuOpen"
									location="bottom"
									attach="body"
									scroll-strategy="none"
									:offset="[-2,16]"
									:close-on-content-click="true"
									containment
									@update:model-value="(val) => val === false && hideOverlay()"
								>
									<template #activator="{ props: activatorProps }">
										<button
											v-bind="activatorProps"
											:aria-label="dropdownMenuTitle + ', Menu déroulant'"
											:class="{ 'link-active': activeIndex === index, 'menu-open': menuOpen }"
											:style="smAndDown ? {minWidth: '136px'} : {minWidth: '236px'}"
											:aria-expanded="menuOpen ? 'true' : 'false'"
											:aria-haspopup="'true'"
											class="sy-header-button d-flex justify-space-between"
											@click="handleLink(index); checkActiveLink(index)"
										>
											{{ dropdownMenuTitle }}
											<v-icon
												:icon="mdiChevronDown"
												size="small"
												class="ml-1"
											/>
										</button>
									</template>
									<v-list
										dense
										:class="smAndDown ? 'mt-2 smAndDown' : 'mt-3'"
										:style="smAndDown ? {width: '110vh'} : {width: elementWidth >= 260 ? elementWidth + 'px' : '236px'}"
									>
										<v-list-item
											v-for="(subItem, subIndex) in itemsSelectMenu"
											:key="subIndex"
											:value="subIndex"
											:aria-current="subItem.text === selectedSubItemText ? 'true' : undefined"
											:class="{ 'subitem-selected': subItem.text === selectedSubItemText }"
											@click="handleSubMenuItemClick(subItem)"
										>
											<v-list-item-title class="text-primary">
												<v-icon
													:icon="mdiChevronRight"
													size="small"
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
			<slot name="right-menu">
				<nav
					id="right-menu"
					:aria-labelledby="props.ariaRightMenu"
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
								:aria-current="activeIndex === index ? 'page' : undefined"
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
		</div>
	</div>
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
		max-height: $container-max-height;
		max-width: $header-max-width;
		display: flex;
		align-items: center;
		justify-content: space-between;

		@media (width <= $header-breakpoint-sm) {
			max-height: $container-max-height-mobile;
		}

		// Common list styling
		:deep(ul) {
			display: flex;
			align-items: center;
			justify-content: flex-start;
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
		}

		// Deuxième élément (Professionnel de santé)
		li:nth-child(2) {
			z-index: $z-menu-item; // Augmenté pour rester au-dessus de l'overlay
			max-height: $second-item-max-height;
			position: relative; // Ajout pour garantir l'effet du z-index

			@media (width <= $header-breakpoint-sm) {
				max-height: $second-item-max-height-mobile;
			}

			a {
				max-height: $second-item-max-height;
				position: relative; // Garantit l'application du z-index
				z-index: $z-button; // S'assure que le lien reste visible

				@media (width <= $header-breakpoint-sm) {
					max-height: $second-item-max-height-mobile;
				}
			}

			&.active {
				a,
				button,
				.sy-header-button {
					text-align: left;
					text-decoration: underline;
					white-space: nowrap;
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
			white-space: nowrap;
			overflow: hidden;

			li {
				display: inline-block;
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
</style>
