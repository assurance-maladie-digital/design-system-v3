<script lang="ts" setup>
	import { computed, ref, toRef } from 'vue'
	import { locales as defaultLocales } from './locales'
	import { mdiFilterVariant } from '@mdi/js'
	import ChipList from '../ChipList/ChipList.vue'
	import type { FilterProp } from '@/composables/useFilterable/useFilterable'
	import useFilterable from '@/composables/useFilterable/useFilterable'

	const props = withDefaults(defineProps<{
		modelValue?: FilterProp
		locales?: typeof defaultLocales
	}>(), {
		modelValue: () => [],
		locales: () => defaultLocales,
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

	function toggleDrawer(): void {
		drawer.value = !drawer.value
	}

	function applyFilters(): void {
		updateValue()
		drawer.value = false
	}

</script>

<template>
	<div class="sy-filters-side-bar">
		<VBtn
			class="px-8 py-3"
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

			<VIcon
				class="ml-2"
				size="small"
			>
				{{ mdiFilterVariant }}
			</VIcon>
		</VBtn>

		<VNavigationDrawer
			:model-value="drawer"
			sticky
			temporary
			location="right"
			rounded="0"
			:scrim="false"
			rail
			rail-width="395"
			disable-resize-watcher
			class="elevation-6"
		>
			<VExpansionPanels variant="accordion">
				<VExpansionPanel
					v-for="filter in filters"
					:key="filter.name"
					:class="`vd-filter-${filter.name}`"
					tile
					elevation="0"
				>
					<VExpansionPanelTitle class="text-subtitle-2">
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
								modelValue: filter.value,
								'onUpdate:modelValue': (value: unknown) =>
									(filter.value = value),
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
					class="mb-4"
					@click="drawer = false"
				>
					{{ locales.close }}
				</VBtn>

				<VBtn
					color="primary"
					block
					size="large"
					variant="outlined"
					class="mb-4"
					@click.stop="resetAllFilters"
				>
					{{ locales.reset }}
				</VBtn>

				<VBtn
					block
					size="large"
					color="primary"
					@click.stop="applyFilters"
				>
					{{ locales.apply }}
				</VBtn>
			</div>
		</VNavigationDrawer>
	</div>
</template>

<style lang="scss" scoped>
.sy-filters-side-bar :deep() {
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

</style>
