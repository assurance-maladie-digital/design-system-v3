<script lang="ts" setup>
	import type { FilterProp } from '@/composables/useFilterable/useFilterable'
	import useFilterable from '@/composables/useFilterable/useFilterable'
	import { mdiFilterVariant } from '@mdi/js'
	import { computed, onMounted, ref, toRef, watch } from 'vue'
	import { type VBtn, type VNavigationDrawer } from 'vuetify/components'
	import ChipList from '../ChipList/ChipList.vue'
	import SyIcon from '../Customs/SyIcon/SyIcon.vue'
	import { locales as defaultLocales } from './locales'
	import vLockFocus from '@/directives/lockFocus'

	const props = withDefaults(defineProps<{
		modelValue?: FilterProp
		modale?: boolean
		locales?: typeof defaultLocales
		zIndex?: number
	}>(), {
		modelValue: () => [],
		modale: false,
		locales: () => defaultLocales,
		zIndex: undefined,
	})

	const emits = defineEmits<{
		'update:modelValue': (value: FilterProp) => void
	}>()

	const {
		filters,
		updateValue,
		removeChip,
		resetFilter,
		getChips,
		getFilterCount,
		formatFilterName,
		resetAllFilters,
	} = useFilterable(toRef(props, 'modelValue'), emits)

	const drawer = ref(false)

	const activeFiltersCount = computed(() => {
		return props.modelValue.reduce((count, filter) => {
			return count + getFilterCount(filter)
		}, 0)
	})

	const zIndexStyle = computed(() =>
		props.zIndex != null ? { zIndex: props.zIndex } : undefined,
	)

	const drawerRef = ref<VNavigationDrawer | null>(null)
	const drawerBtnRef = ref<VBtn | null>(null)

	function toggleDrawer(): void {
		drawer.value = !drawer.value
	}

	function applyFilters(): void {
		updateValue()
		drawer.value = false
	}

	watch(drawer, (e) => {
		if (e) {
			drawerRef!.value!.$el.nextElementSibling.focus()
		}
		else {
			drawerBtnRef.value!.$el.focus()
		}
	})

	onMounted(() => {
		const filterIconSVG = drawerRef!.value!.$el.nextElementSibling.querySelectorAll('svg[role="img"]')
		filterIconSVG.forEach((svg) => {
			svg.removeAttribute('role')
		})
	})
</script>

<template>
	<div class="sy-filters-side-bar">
		<VBtn
			ref="drawerBtnRef"
			class="sy-filters-side-bar__open-btn px-4 py-3"
			:class="{ 'v-btn--active': drawer }"
			color="primary"
			variant="text"
			size="large"
			@click="toggleDrawer"
		>
			<VBadge
				v-if="activeFiltersCount"
				:content="activeFiltersCount"
				:label="locales.badgeLabel(activeFiltersCount)"
				color="secondary"
				inline
				class="ml-n1 mr-1"
			/>

			{{ locales.filterBtnLabel }}

			<SyIcon
				class="ml-2"
				:icon="mdiFilterVariant"
				size="small"
				decorative
			/>
		</VBtn>
		<Teleport
			to="body"
		>
			<VNavigationDrawer
				ref="drawerRef"
				tag="div"
				:model-value="drawer"
				sticky
				temporary
				location="right"
				rounded="0"
				:scrim="false"
				rail
				rail-width="395"
				disable-resize-watcher
				:tabindex="drawer ? 0 : -1"
				class="sy-filters-side-bar__content elevation-6 bg-white"
				role="dialog"
				:aria-hidden="drawer ? undefined : 'true'"
				:inert="drawer ? undefined : 'true'"
				:aria-modal="props.modale"
				:aria-label="locales.modaleLabel"
				:style="zIndexStyle"
				@keydown.escape.prevent="drawer = false"
			>
				<form
					v-lock-focus="$props.modale"
					@submit.prevent="applyFilters"
				>
					<VExpansionPanels
						variant="accordion"
						tag="ul"
					>
						<VExpansionPanel
							v-for="filter in filters"
							:key="filter.name"
							:class="`vd-filter-${filter.name}`"
							tile
							elevation="0"
							tag="li"
						>
							<VExpansionPanelTitle
								class="text-subtitle-2"
							>
								{{ filter.title }}

								<span
									v-if="getFilterCount(filter)"
									class="ml-1"
								>
									({{ getFilterCount(filter) }})
								</span>
							</VExpansionPanelTitle>

							<VExpansionPanelText>
								<ChipList
									:aria-label="locales.badgeListLabel(filter.name)"
									:items="getChips(filter)"
									:overflow-limit="filter.chipOverflowLimit"
									class="mb-5"
									:vuetify-options="{ chip: { color: 'secondary' }, icon: { color: 'white'} }"
									@remove="removeChip(filter, $event)"
									@reset="resetFilter(filter)"
								/>

								<slot
									:name="`${formatFilterName(filter.name)}`"
									:props="{
										modelValue: filter.value as any,
										'onUpdate:modelValue': (value: unknown) =>{
											(filter.value = value)},
									}"
								/>
							</VExpansionPanelText>
						</VExpansionPanel>
					</VExpansionPanels>

					<VSpacer />

					<div class="px-4 pb-4 pt-10">
						<VBtn
							color="primary"
							block
							size="large"
							variant="outlined"
							class="sy-filters-side-bar__close-btn mb-4"
							:aria-label="locales.closeAriaLabel"
							@click="drawer = false"
						>
							{{ locales.close }}
						</VBtn>

						<VBtn
							color="primary"
							block
							size="large"
							variant="outlined"
							class="sy-filters-side-bar__reset-btn mb-4"
							type="reset"
							:aria-label="locales.resetAriaLabel"
							@click.stop="resetAllFilters"
						>
							{{ locales.reset }}
						</VBtn>

						<VBtn
							color="primary"
							block
							size="large"
							class="sy-filters-side-bar__apply-btn"
							variant="elevated"
							type="submit"
							:aria-label="locales.applyAriaLabel"
							@click.stop="applyFilters"
						>
							{{ locales.apply }}
						</VBtn>
					</div>
				</form>
			</VNavigationDrawer>
		</Teleport>
	</div>
</template>

<style lang="scss" scoped>
.sy-filters-side-bar__content :deep() {
	.v-navigation-drawer {
		&__content {
			display: flex;
			flex-direction: column;
		}

		&__border {
			display: none;
		}
	}

	.v-expansion-panel {
		border-bottom: 1px solid rgb(0 0 0 / 12%);
	}

	.v-expansion-panel:not(:first-child)::after {
		display: none;
	}
}

.sy-filters-side-bar__close-btn,
.sy-filters-side-bar__reset-btn,
.sy-filters-side-bar__apply-btn,
.sy-filters-side-bar__open-btn {
	&:focus-visible {
		outline: 2px solid rgb(var(--v-theme-primary));
		outline-offset: 2px;

		:deep(.v-btn__overlay) {
			display: none;
		}

		&::after {
			display: none;
		}
	}
}

.v-expansion-panel-title {
	&:focus-visible {
		outline: 2px solid rgb(var(--v-theme-primary));
		outline-offset: -2px;

		:deep(.v-expansion-panel-title__overlay) {
			display: none;
		}
	}
}
</style>
