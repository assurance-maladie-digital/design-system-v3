<script setup lang="ts">
	import { type PropType } from 'vue'
	import type { LinkItem, TopNavHeader } from './types'
	import CustomInputSelect from '../Customs/CustomInputSelect/CustomInputSelect.vue'

	const props = defineProps({
		leftLinks: {
			type: Array as PropType<TopNavHeader[]>,
			default: () => [],

		},

		rightLinks: {
			type: Array as PropType<TopNavHeader[]>,
			default: () => [],
		},

		itemsSelectMenu: {
			type: Array,
			default: () => [],
		},

	})

	const getLinkComponent = (item: LinkItem): string => {
		return item.href ? 'a' : 'RouterLink'
	}
</script>

<template>
	<section class="topbar">
		<div class="container-xl">
			<div class="nav">
				<div
					id="block-ameli-espace-menu"
					class="wrapper-dropdown-with-overlay"
				>
					<slot :right-links="props.rightLinks">
						<nav class="dropdown-with-overlay">
							<ul>
								<li
									v-for="(item, index) in props.rightLinks"
									:key="index"
									:class="{ 'active': index == 0 }"
								>
									<component
										:is="getLinkComponent(item)"
										:href="item.href"
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
				</div>
				<slot :left-links="props.leftLinks">
					<div class="d-none d-lg-block">
						<nav
							id="block-menuinstitutionnel"
							role="navigation"
							class="dropdown-with-overlay"
							aria-label="menu institutionnel"
						>
							<ul>
								<li
									v-for="(item, index) in props.leftLinks"
									:key="index"
								>
									<component
										:is="getLinkComponent(item)"
										:href="item.href"
										:tabindex="index"
										:title="item.title"
										class="component"
									>
										<a> {{ item.text }}</a>
									</component>
								</li>
							</ul>
						</nav>
					</div>
				</slot>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens.scss';

.topbar {
    background: #e7ecf5;
    z-index: 2;
    position: relative;
}

.topbar>.container-xl {
    padding-left: 0;
    padding-right: 0;
    margin: 0 auto;
    width: 100%;

}

@media (min-width: 1200px) {
    .container-xl {
        max-width: 1140px;
    }
}

.nav {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center;
}

.topbar .wrapper-dropdown-with-overlay {
    z-index: 3;
}

@media (max-width: 1199.98px) {
    .topbar .wrapper-dropdown-with-overlay .dropdown-with-overlay>ul {
        display: flex;
        flex-wrap: nowrap;
    }
}

@media (min-width: 992px) {

    .topbar .wrapper-dropdown-with-overlay .dropdown-with-overlay>ul>li:first-child,
    .wrapper-dropdown-with-overlay .dropdown-with-overlay>ul>li:first-child {
        max-width: 95px;

    }
}

:deep(.text-color) {
    color: #07275c !important;
}

:deep(.v-list-item-title) {
    display: flex;
    margin-bottom: 8px;
    color: #0c419a !important
}

:deep(.v-input__control) {
    display: flex;
    justify-content: center;
}

:deep(.v-list-item:hover) {
    opacity: 1 !important
}

:deep(.v-input--horizontal) {
    grid-template-areas: none;
}

:deep(.v-list-item--density-default:not(.v-list-item--nav).v-list-item--one-line) {
    padding-inline: none;
}

:deep(.v-list-item--density-default.v-list-item--one-line) {
    min-height: 48px;
    padding-top: none;
    padding-bottom: none;
}

:deep(.v-list) {
    position: fixed;

    max-height: calc(100vh - 48px);
    overflow-y: hidden;
    top: 48px;
    left: 221px;
    border-radius: 0px;
}

.topbar .wrapper-dropdown-with-overlay .dropdown-with-overlay>ul>li,
.wrapper-dropdown-with-overlay .dropdown-with-overlay>ul>li {
    display: inline-block;
}

.topbar .wrapper-dropdown-with-overlay .dropdown-with-overlay>ul>li:first-child.active a {
    background: #ed76b3;
}

.customInputSelect {
    font-weight: 700;
    // font-size: .75rem;
    color: #07275c !important;
    text-decoration: none !important;
    text-align: left;
    font-size: 1rem;
    display: flex;
}

.topbar .wrapper-dropdown-with-overlay .dropdown-with-overlay>ul>li>a {
    display: block;
    padding: 10px 20px 10px 21px;
    font-weight: 700;
    font-size: .75rem;
    color: #07275c;
    text-decoration: none !important;
    text-align: left;
    padding: 12px 22px;
    font-size: 1rem;
}

:deep(.custom-select > span) {
    margin-right: 8px;
}

ul {
    padding: 0;
    margin: 0;
    list-style: none;
    text-decoration: none;
}

ul>li>a:link,
a:visited,
a:hover,
a:active {
    color: #07275c;
    text-decoration: none;
}

ul>li>button,
a:link,
a:visited,
a:hover,
a:active {
    text-decoration: none;
}

.topbar .wrapper-dropdown-with-overlay .dropdown-with-overlay>ul>li:nth-child(2):hover {
    background: #66c9ec;
}

.topbar .wrapper-dropdown-with-overlay .dropdown-with-overlay>ul>li:nth-child(3) a:hover {
    background: #f0b323;
}

.topbar nav[id^="block-menuinstitutionnel"] ul li a:hover {
    text-decoration: underline;
}

@media (min-width: 992px) {
    .topbar nav[id^="block-menuinstitutionnel"] ul li {
        display: inline-block;
        margin: 0 15px;
    }
}
</style>
