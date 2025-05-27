<script setup lang="ts">
	import { useAttrs, watch, computed } from 'vue'
	import type { DataOptions, FilterOption, SyServerTableProps } from '../common/types'
	import { useTableUtils } from '../common/tableUtils'
	import { useTableFilter } from '../common/useTableFilter'
	import SyTableFilter from '../common/SyTableFilter.vue'

	const props = withDefaults(defineProps<SyServerTableProps>(), {
		suffix: undefined,
		itemsPerPage: undefined,
		caption: 'caption',
		showFilters: false,
		items: () => [],
	})

	const options = defineModel<Partial<DataOptions>>('options', {
		required: false,
		default: () => ({}),
	})

	// Computed property for filters
	const filters = computed({
		get: () => options.value.filters || [],
		set: (newFilters: FilterOption[]) => {
			options.value = {
				...options.value,
				filters: newFilters,
			}
		},
	})

	// Get the filterItems function from the composable
	// This can be used for client-side filtering preview or for testing
	const { filterItems } = useTableFilter()

	// Expose the filtering function for potential use in parent components
	defineExpose({ filterItems })

	const componentAttributes = useAttrs()

	const {
		propsFacade,
		updateOptions,
		setupAccessibility,
		setupLocalStorage,
	} = useTableUtils({
		tableId: 'sy-server-table',
		prefix: 'server-table',
		suffix: props.suffix,
		itemsPerPage: props.itemsPerPage,
		caption: props.caption,
		serverItemsLength: props.serverItemsLength,
		componentAttributes,
		options,
	})

	// Setup accessibility features
	setupAccessibility()

	// Setup local storage
	const { watchOptions } = setupLocalStorage()

	// Watch for options changes
	watch(
		() => options.value,
		watchOptions,
		{ deep: true },
	)
</script>

<template>
	<div
		id="sy-server-table"
		class="sy-server-table"
	>
		<VDataTableServer
			v-bind="propsFacade"
			color="primary"
			:items="props.items"
			:items-length="props.serverItemsLength"
			@update:options="updateOptions"
		>
			<template #headers="slotProps">
				<!-- Add defensive check for columns property -->
				<template v-if="slotProps && slotProps.columns">
					<!-- Destructure slot props safely -->
					<tr>
						<template
							v-for="column in slotProps.columns"
							:key="column.key"
						>
							<th>
								<div class="d-flex align-center">
									<span
										class="me-2 cursor-pointer font-weight-bold text-grey-darken-1"
										role="button"
										tabindex="0"
										@click="slotProps.toggleSort(column)"
										@keydown.enter="slotProps.toggleSort(column)"
										v-text="column.title"
									/>

									<v-icon
										v-if="slotProps.isSorted(column)"
										:icon="slotProps.getSortIcon(column)"
										color="medium-emphasis"
									/>
								</div>
							</th>
						</template>
					</tr>
					<tr v-if="props.showFilters">
						<template
							v-for="column in slotProps.columns"
							:key="column.key"
						>
							<th>
								<SyTableFilter
									v-if="column.filterable"
									:filters="filters"
									:header="column"
									@update:filters="filters = $event"
								/>
							</th>
						</template>
					</tr>
				</template>
				<!-- Fallback when columns is undefined -->
				<template v-else>
					<tr>
						<th
							v-for="header in props.headers"
							:key="header.key || header.value"
						>
							<span class="font-weight-bold">{{ header.title }}</span>
						</th>
					</tr>
					<tr v-if="props.showFilters">
						<th
							v-for="header in props.headers"
							:key="header.key || header.value"
						>
							<SyTableFilter
								v-if="header.filterable"
								:filters="filters"
								:header="header"
								@update:filters="filters = $event"
							/>
						</th>
					</tr>
				</template>
			</template>
		</VDataTableServer>
	</div>
</template>

<style lang="scss" scoped>
@use '@/components/Tables/common/tableStyles' as *;

.sy-server-table :deep() {
	@include tablestyles;
}
</style>
