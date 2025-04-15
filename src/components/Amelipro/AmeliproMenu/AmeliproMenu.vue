<script setup lang="ts">
	import { type PropType, onMounted, reactive, ref } from 'vue'
	import { mdiChevronDown, mdiChevronUp, mdiClose } from '@mdi/js'
	import AmeliproBtn from '../AmeliproBtn/AmeliproBtn.vue'
	import AmeliproIconBtn from '../AmeliproIconBtn/AmeliproIconBtn.vue'
	import type { AmeliproMenuItem } from './types'
	import type { RouteLocationRaw } from 'vue-router'

	const props = defineProps({
		homeHref: {
			type: String,
			default: undefined,
		},
		homeTo: {
			type: [Array, Object, String] as PropType<RouteLocationRaw>,
			default: undefined,
		},
		items: {
			type: Array as PropType<AmeliproMenuItem[]>,
			default: () => [],
		},
		menuHeader: {
			type: String,
			default: 'Titre du service',
		},
		uniqueId: {
			type: String,
			required: true,
		},
	})

	const reactiveItems = reactive<AmeliproMenuItem[]>(props.items)

	const drawer = ref(false)
	const setFocus = (id: string): void => {
		let element

		if (id === `${props.uniqueId}-close-menu-btn`) {
			element = document.querySelector(`#${props.uniqueId}-close-menu-btn`) as HTMLElement
			if (element !== null) {
				element.focus()
			}
		}
		else if (id === `${props.uniqueId}-return-home-menu-btn`) {
			element = document.querySelector(`#${props.uniqueId}-return-home-menu-btn`) as HTMLElement
			if (element !== null) {
				element.focus()
			}
		}
	}

	const emit = defineEmits(['escape'])
	const closeDrawer = (event: KeyboardEvent): void => {
		if (event.code === 'Escape' && drawer.value) {
			drawer.value = false
			emit('escape')
		}
	}

	defineExpose({ setFocus })

	onMounted(() => {
		window.addEventListener('keydown', closeDrawer)
	})
</script>

<template>
	<div
		:id="`${uniqueId}-container`"
		class="d-flex justify-center amelipro-menu"
	>
		<AmeliproIconBtn
			btn-label="Menu du service"
			class="amelipro-menu__btn--open"
			icon="menuSquare"
			icon-bg-color="transparent"
			icon-color="ap-white"
			icon-hover-bg-color="transparent"
			icon-hover-color="ap-grey-lighten-5"
			large
			:unique-id="`${uniqueId}-open-btn`"
			@click="drawer = !drawer"
		/>

		<VNavigationDrawer
			:id="`${uniqueId}-drawer`"
			aria-label="Menu du service"
			aria-modal="true"
			color="ap-blue-darken-2"
			hide-overlay
			:model-value="drawer"
			role="dialog"
			temporary
			width="300"
		>
			<div
				:id="`${uniqueId}-drawer-content`"
				class="d-flex justify-space-between align-center amelipro-menu__container"
			>
				<h2
					:id="`${uniqueId}-drawer-title`"
					class="pa-1 mb-0 text-ap-white text-uppercase amelipro-menu__title"
				>
					{{ menuHeader }}
				</h2>

				<AmeliproIconBtn
					btn-label="Fermer le menu"
					class="menu-btn-close"
					icon-bg-color="transparent"
					icon-color="ap-white"
					icon-hover-bg-color="transparent"
					icon-hover-color="ap-white"
					:unique-id="`${uniqueId}-close-menu-btn`"
					@click="drawer = !drawer"
					@keydown.tab.shift.prevent="setFocus(`${uniqueId}-return-home-menu-btn`)"
				>
					<template #icon>
						{{ mdiClose }}
					</template>
				</AmeliproIconBtn>
			</div>

			<VDivider
				class="my-2"
				color="ap-white"
				style="opacity: 1 !important;"
				thickness="1px"
			/>

			<ul
				:id="`${uniqueId}-list`"
				class="list-style-none amelipro-menu__list"
			>
				<li
					v-for="(item, index) in reactiveItems"
					:key="item.name"
					class="amelipro-menu__item"
				>
					<div v-if="item.children">
						<AmeliproBtn
							:aria-controls="`${uniqueId}-niveau-2-${index}`"
							:aria-expanded="Boolean(item.actif).toString()"
							classes="d-flex justify-space-between w-100 menu-btn"
							color="ap-blue-darken-2"
							elevation="0"
							hover-color="ap-blue-lighten-3"
							icon-bg-color="transparent"
							icon-focus-color="ap-blue-darken-2"
							icon-hover-color="ap-blue-darken-2"
							text-focus-color="ap-blue-darken-2"
							text-hover-color="ap-blue-darken-2"
							tile
							:unique-id="`menu-btn__${item.id}`"
							@click="item.actif = !item.actif"
						>
							{{ item.name }}

							<template #icon>
								{{ item.actif ? mdiChevronDown : mdiChevronUp }}
							</template>
						</AmeliproBtn>

						<ul
							v-if="item.actif"
							:id="`${uniqueId}-niveau-2-${index}`"
							class="list-style-none amelipro-menu__list--level-2"
						>
							<li
								v-for="(subItem, indexBis) in item.children"
								:key="subItem.name"
								class="amelipro-menu__item--level-2"
							>
								<div v-if="subItem.children">
									<AmeliproBtn
										:aria-controls="`${uniqueId}-niveau-3-${indexBis}`"
										:aria-expanded="Boolean(subItem.actif).toString()"
										classes="w-100 menu-btn"
										color="ap-blue-darken-2"
										elevation="0"
										hover-color="ap-blue-lighten-3"
										icon-bg-color="transparent"
										icon-focus-color="ap-blue-darken-2"
										icon-hover-color="ap-blue-darken-2"
										text-focus-color="ap-blue-darken-2"
										text-hover-color="ap-blue-darken-2"
										tile
										:unique-id="`menu-btn__${subItem.id}`"
										@click="subItem.actif = !subItem.actif"
									>
										{{ subItem.name }}

										<template #icon>
											{{ subItem.actif ? mdiChevronDown : mdiChevronUp }}
										</template>
									</AmeliproBtn>

									<ul
										v-if="subItem.actif"
										:id="`${uniqueId}-niveau-3-${indexBis}`"
										class="list-style-none amelipro-menu__list--level-3"
									>
										<li
											v-for="subSubItem in subItem.children"
											:key="subSubItem.name"
											class="amelipro-menu__item--level-3"
										>
											<div>
												<AmeliproBtn
													classes="w-100 menu-btn"
													color="ap-blue-darken-2"
													elevation="0"
													hover-color="ap-blue-lighten-3"
													:href="subSubItem.href"
													icon-bg-color="transparent"
													icon-focus-color="ap-blue-darken-2"
													icon-hover-color="ap-blue-darken-2"
													text-focus-color="ap-blue-darken-2"
													text-hover-color="ap-blue-darken-2"
													tile
													:to="subSubItem.to"
													:unique-id="`menu-btn__${subSubItem.id}`"
												>
													{{ subSubItem.name }}
												</AmeliproBtn>
											</div>
										</li>
									</ul>
								</div>

								<div
									v-else
									:id="`${uniqueId}-niveau-2-${index}`"
								>
									<AmeliproBtn
										classes="w-100 menu-btn"
										color="ap-blue-darken-2"
										elevation="0"
										hover-color="ap-blue-lighten-3"
										:href="subItem.href"
										icon-bg-color="transparent"
										icon-focus-color="ap-blue-darken-2"
										icon-hover-color="ap-blue-darken-2"
										text-focus-color="ap-blue-darken-2"
										text-hover-color="ap-blue-darken-2"
										tile
										:to="subItem.to"
										:unique-id="`menu-btn__${subItem.id}`"
									>
										{{ subItem.name }}
									</AmeliproBtn>
								</div>
							</li>
						</ul>
					</div>

					<div v-else>
						<AmeliproBtn
							classes="w-100 menu-btn"
							color="ap-blue-darken-2"
							elevation="0"
							hover-color="ap-blue-lighten-3"
							:href="item.href"
							icon-bg-color="transparent"
							icon-focus-color="ap-blue-darken-2"
							icon-hover-color="ap-blue-darken-2"
							text-focus-color="ap-blue-darken-2"
							text-hover-color="ap-blue-darken-2"
							tile
							:to="item.to"
							:unique-id="`menu-btn__${item.id}`"
						>
							{{ item.name }}
						</AmeliproBtn>
					</div>
				</li>
			</ul>

			<VDivider
				class="my-2"
				color="ap-white"
				style="opacity: 1 !important;"
				thickness="1px"
			/>

			<div>
				<AmeliproBtn
					classes="w-100 pa-0 home-menu-btn"
					color="ap-blue-darken-2"
					elevation="0"
					hover-color="ap-blue-darken-2"
					:href="homeHref"
					text-color="ap-white"
					text-focus-color="ap-blue-darken-2"
					text-hover-color="ap-blue-darken-2"
					tile
					:to="homeTo"
					:unique-id="`${uniqueId}-return-home-menu-btn`"
					@keydown.tab.exact.prevent="setFocus(`${uniqueId}-close-menu-btn`)"
				>
					<img
						alt="Accueil Amelipro"
						class="home-menu-btn__img"
						src="@/assets/amelipro/img/logo-menu.svg"
					>
				</AmeliproBtn>
			</div>
		</VNavigationDrawer>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/tokens';

ul {
	list-style: none;
}

.v-btn {
	display: flex;
	min-height: unset !important;
	padding: 0.5rem 1rem !important;
	border-radius: 0 !important;
	font-size: tokens.$font-size-sm;

	&.amelipro-menu__btn--open {
		padding: 0 !important;
	}
}

.v-btn :deep(.amelipro-custom-btn) {
	justify-content: space-between;
	width: 100%;
}

.v-btn :deep(.v-btn__content) {
	width: 100%;
	display: flex;
}

.v-btn.home-menu-btn :deep(.amelipro-custom-btn) {
	justify-content: flex-start;
}

.menu-btn,
.home-menu-btn {
	&:focus {
		color: tokens.$ap-blue-darken2 !important;
		background-color: tokens.$ap-blue-lighten3 !important;
	}
}

.menu-btn {
	&:focus :deep(.v-icon) {
		color: tokens.$ap-blue-darken2 !important;
	}
}

.menu-btn-close {
	&:focus {
		outline: 1px dotted tokens.$ap-blue-lighten3;
	}
}

.amelipro-menu__item--level-2,
.amelipro-menu__item--level-3 {
	& .v-btn {
		font-size: tokens.$font-size-xs;
		text-transform: unset;
		font-weight: tokens.$ap-font-weight-regular;
	}
}

.amelipro-menu__item--level-2 {
	& .v-btn {
		padding: 0.5rem 1rem !important;
	}

	& .amelipro-menu__item--level-3 {
		& .v-btn {
			padding: 0.5rem 1rem 0.5rem 2rem !important;
			font-weight: tokens.$ap-font-weight-light;
		}
	}
}

.home-menu-btn__img {
	width: 7.375rem;
}
</style>
