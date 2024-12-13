<script lang="ts" setup>
	import { ref, type PropType } from 'vue'
	import type { MenuItem, SelectItem } from './types'
	import SyInputSelect from '@/components/Customs/SyInputSelect/SyInputSelect.vue'

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

	defineExpose({
		hideOverlay,
		handleLink,
		checkActiveLink,
		deleteActiveLink,
		activeIndex,
		highlightMenu,
		showOverlay,
		getLinkComponent,
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
					<ul>
						<li
							v-for="(item, index) in props.leftMenu"
							:key="index"
							:class="{ 'active': activeIndex === index, 'highlight': highlightMenu }"
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
								@click="checkActiveLink(index)"
								@focus="index === 1 && showOverlay ? highlightMenu = true : null"
								@mouseover="index === 1 && showOverlay ? highlightMenu = true : null"
							>
								<span v-if="itemsSelectMenu && index === 1">
									<SyInputSelect
										:items="itemsSelectMenu as unknown as string[]"
										:label="item.title"
										:outlined="false"
										is-header-toolbar
										@click="handleLink(index)"
									/>
								</span>
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
@use '@/assets/tokens.scss';
@use '../HeaderBar/consts' as *;

.toolbar {
  background: tokens.$blue-lighten-90;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;

  .container {
    width: 100%;
    max-height: 45px;
    max-width: $header-max-width;
    display: flex;
    align-items: center;
    justify-content: space-between;
    @media (max-width: 768px) {
      max-height: 41px;
    }

    :deep(ul) {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      list-style: none;
      text-decoration: none;

      li {
        text-align: center;
      }
    }

    :deep(ul > li > a) {
      display: block;
      color: tokens.$blue-darken-40;
      text-decoration: none;
      padding: 10px 16px;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }

      @media (max-width: 768px) {
        font-size: 12px;
      }
    }
  }

  #left-menu {
    ul > li > a {
      font-weight: 700;
      color: tokens.$blue-darken-40;

      &:hover {
        text-decoration: none;
      }
    }

    li:first-child {
      min-width: 95px;
      background: transparent;
      @media (max-width: $header-breakpoint) {
        min-width: 82px;
      }
    }

    li:nth-child(2) {
      min-width: 260px;
      z-index: 2;
      @media (max-width: 768px) {
        min-width: 152px;
      }
    }

    li:nth-child(3) {
      background: transparent;
    }

    li:first-child a:hover, li:first-child.active {
      background: tokens.$user-assure;
    }

    li:nth-child(2) a:hover, .highlight {
      background: tokens.$user-professionnel;
    }

    li:nth-child(3) a:hover, li:nth-child(3).active {
      background: tokens.$user-entreprise;
    }
  }

  #right-menu {
    @media (max-width: 1000px) {
      display: none;
    }
  }

  #right-menu ul {
    white-space: nowrap;
    overflow: hidden;
  }

  #right-menu ul li {
    display: inline-block;
  }

  :deep(.v-input) {
    .v-input__details {
      display: none;
    }

    .v-input__control {
      font-weight: 700;

      .text-color {
        color: tokens.$blue-darken-60 !important;
      }

      .v-icon {
        margin-left: 10px;
      }

      .custom-select {
        display: flex;
        justify-content: space-between;
        width: 100%;

        span {
          max-width: 260px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          @media (max-width: 768px) {
            max-width: 182px;
          }
        }
      }

      @media (max-width: 768px) {
        font-size: 12px;
      }
    }

    .v-list {
      top: 34px !important;
      left: -16px !important;
      text-align: left;
      min-width: 260px;
      max-width: fit-content !important;
      border-radius: 0;
      @media (max-width: 768px) {
        position: fixed;
        top: 38px !important;
        left: 0 !important;
        min-width: 100% !important;
        box-shadow: none !important;
      }

      .v-list-item--density-default.v-list-item--one-line {
        min-height: 40px;
      }
    }
  }

  .overlay {
    position: fixed;
    display: block;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(3, 16, 37, .5);
    cursor: default;
    backdrop-filter: blur(2px);
    z-index: 1;
    @media (max-width: 768px) {
      display: none;
    }
  }
}

.right-menu-item {
  color: tokens.$blue-darken-60;
}
</style>
