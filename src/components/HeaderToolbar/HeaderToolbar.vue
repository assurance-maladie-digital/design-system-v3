<script setup lang="ts">
	import { ref, type PropType } from 'vue'
	import type { MenuItem, SelectItem } from './types'
	import CustomInputSelect from '../Customs/CustomInputSelect/CustomInputSelect.vue'

	const props = defineProps({
		leftMenu: {
			type: Array as PropType<MenuItem[]>,
			default: () => [],
		},
		rightMenu: {
			type: Array as PropType<MenuItem[]>,
			default: () => [],
		},
		itemsSelectMenu: {
			type: Array as PropType<SelectItem[]>,
			default: () => [],
		},
		ariaLeftMenu: {
			type: String,
			default: 'toolbar-left-menu',
		},
		ariaRightMenu: {
			type: String,
			default: 'toolbar-right-menu',
		},
	})

	const getLinkComponent = (item: MenuItem): string => {
		return item.href ? 'a' : 'RouterLink'
	}

	const showOverlay = ref(false)
	const highlightMenu = ref(false)
	const activeIndex = ref<number | null>(null)

	const hideOverlay = () => {
		const activeSelected = document.querySelector('.custom-select > span').textContent
		if (activeSelected === 'Professionnel de santé') {
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
</script>

<template>
	<div class="toolbar">
		<div class="container">
			<slot :left-menu="props.leftMenu">
				<button
					v-if="showOverlay"
					class="overlay"
					aria-label="Close overlay"
					@click="hideOverlay"
					@keydown.enter="hideOverlay"
					@keydown.esc="hideOverlay"
				/>
				<nav
					id="left-menu"
					role="navigation"
					:aria-labelledby="props.ariaLeftMenu"
				>
					<ul>
						<li
							v-for="(item, index) in props.leftMenu"
							:key="index"
							:class="{ 'active': activeIndex === index, 'highlight': highlightMenu }"
						>
							<component
								:is="getLinkComponent(item as MenuItem)"
								:href="item.href"
								:to="item.to"
								:tabindex="index"
								:title="item.title"
								@click="checkActiveLink(index)"
								@mouseover="index === 1 && showOverlay ? highlightMenu = true : null"
								@focus="index === 1 && showOverlay ? highlightMenu = true : null"
							>
								<span v-if="index === 1">
									<CustomInputSelect
										class="customInputSelect"
										:items="itemsSelectMenu as SelectItem[]"
										:label="item.title"
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
			<slot :right-menu="props.rightMenu">
				<nav
					id="right-menu"
					role="navigation"
					:aria-labelledby="props.ariaRightMenu"
				>
					<ul>
						<li
							v-for="(item, index) in props.rightMenu"
							:key="index"
						>
							<component
								:is="getLinkComponent(item as MenuItem)"
								:href="item.href"
								:tabindex="index"
								:title="item.title"
							>
								<span> {{ item.title }}</span>
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

.toolbar {
  background: tokens.$grey-lighten-80;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;

  .container {
    width: 100%;
    max-height: 45px;
    max-width: 1280px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    @media (max-width: 768px) {
      max-height: 41px;
    }
  }

  #left-menu, #right-menu {
    ul {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      list-style: none;
      text-decoration: none;
      li {
        text-align: center;
      }
    }
    ul > li > a {
      display: block;
      color: tokens.$primary-base;
      text-decoration: none;
      padding: 10px 16px;
      cursor: pointer;
      @media (max-width: 768px) {
        font-size: 12px;
      }
    }
  }
  #left-menu {
    ul > li > a {
      font-weight: 700;
      color: tokens.$blue-darken-60;
      &:hover {
        text-decoration: none;
      }
    }
    li:first-child {
      min-width: 95px;
      background: transparent;
      @media (max-width: 768px) {
        min-width: 77px;
      }
    }
    li:nth-child(2) {
      min-width: 260px;
      z-index: 2;
      @media (max-width: 768px) {
        min-width: 182px;
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
    ul > li > a {
      &:hover {
        text-decoration: underline;
      }
    }
    @media (max-width: 1000px) {
      display: none;
    }
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
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
    @media (max-width: 768px) {
      display: none;
    }
  }
}
</style>
