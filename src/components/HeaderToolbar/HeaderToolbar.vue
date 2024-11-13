<script setup lang="ts">
	import { ref, type PropType } from 'vue'
	import type { LinkItem, HeaderToolbar } from './types'
	import CustomInputSelect from '../Customs/CustomInputSelect/CustomInputSelect.vue'

	const props = defineProps({
		leftMenu: {
			type: Array as PropType<HeaderToolbar[]>,
			default: () => [],
		},
		rightMenu: {
			type: Array as PropType<HeaderToolbar[]>,
			default: () => [],
		},
		itemsSelectMenu: {
			type: Array,
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

	const getLinkComponent = (item: LinkItem): string => {
		return item.href ? 'a' : 'RouterLink'
	}

	const activeLinkIndex = ref<number | null>(null)
</script>

<template>
	<div class="toolbar">
		<div class="container">
			<slot :left-menu="props.leftMenu">
				<nav
					id="left-menu"
					role="navigation"
					:aria-labelledby="props.ariaLeftMenu"
				>
					<ul>
						<li
							v-for="(item, index) in props.leftMenu"
							:key="index"
							:class="{ 'active': index == 0 }"
						>
							<span
								v-if="index === 1 && activeLinkIndex === 1"
								class="overlay"
							/>
							<component
								:is="getLinkComponent(item)"
								:href="item.href"
								:to="item.to"
								:tabindex="index"
								:title="item.title"
								class="component"
							>
								<span v-if="index == 1">
									<CustomInputSelect
										id="dropdown-submenu"
										class="customInputSelect"
										:items="itemsSelectMenu"
										:label="item.text"
									/>
								</span>
								<span
									v-else
									class="link"
								> {{ item.text }}</span>
							</component>
						</li>
					</ul>
				</nav>
			</slot>
			<slot :right-menu="props.rightMenu">
				<nav
					id="right-menu"
					role="navigation"
					class="d-none d-lg-block"
					:aria-labelledby="props.ariaRightMenu"
				>
					<ul>
						<li
							v-for="(item, index) in props.rightMenu"
							:key="index"
						>
							<component
								:is="getLinkComponent(item)"
								:href="item.href"
								:tabindex="index"
								:title="item.title"
								class="component"
							>
								<span> {{ item.text }}</span>
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
      @media (max-width: 768px) {
        min-width: 77px;
      }
    }
    li:nth-child(2) {
      min-width: 260px;
      z-index: 3;
      @media (max-width: 768px) {
        min-width: 182px;
      }
    }
    li:first-child a {
      background: tokens.$user-assure;
    }
    li:nth-child(2) a:hover {
      background: tokens.$user-professionnel;
    }
    li:nth-child(3) a:hover {
      background: tokens.$user-entreprise;
    }
  }
  #right-menu {
    ul > li > a {
      &:hover {
        text-decoration: underline;
      }
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
      top: 35px !important;
      left: -15px !important;
      text-align: left;
      min-width: 260px;
      max-width: fit-content !important;
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
    z-index: 2;
    @media (max-width: 768px) {
      display: none;
    }
  }
}
</style>
