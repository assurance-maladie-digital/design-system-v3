<!-- eslint-disable vue/valid-v-slot -->
<script setup lang="ts">
	import { computed, nextTick, onMounted, provide, ref, toRef, useAttrs, watch } from 'vue'
	import type { VDataTableServer } from 'vuetify/components'
	import SyTableFilter from '../common/SyTableFilter.vue'
	import TableHeader from '../common/TableHeader.vue'
	import { locales } from '../common/locales'
	import { useTableUtils } from '../common/tableUtils'
	import type { DataOptions, FilterOption, SyServerTableProps } from '../common/types'
	import { useTableFilter } from '../common/useTableFilter'
	import OrganizeColumns from '../common/organizeColumns/OrganizeColumns.vue'
	import { setupAccessibility } from '../common/tableAccessibilityUtils'
	import useTableHeaders from '../common/organizeColumns/useTableHeaders'

	type HeaderSlotProps = Parameters<VDataTableServer['$slots']['headers']>[0]

	const props = withDefaults(defineProps<SyServerTableProps>(), {
		itemsPerPage: undefined,
		caption: '',
		showFilters: false,
		items: () => [],
		serverItemsLength: 0,
		resizableColumns: false,
		filterInputConfig: () => ({}),
		density: 'default',
		striped: false,
		enableColumnControls: false,
	})

	const options = defineModel<Partial<DataOptions>>('options', {
		required: false,
		default: () => ({}),
	})

	const table = ref<VDataTableServer>()

	// Computed pour les filtres
	const filters = computed({
		get: () => options.value.filters || [],
		set: (newFilters: FilterOption[]) => {
			options.value = {
				...options.value,
				filters: newFilters,
			}
		},
	})

	// Récupère la fonction filterItems du composable
	// Cela peut être utilisé pour la prévisualisation du filtrage côté client ou pour les tests
	const { filterItems } = useTableFilter()

	defineExpose({ filterItems })

	const {
		propsFacade,
		updateOptions,
		setupLocalStorage,
		columnWidths,
		updateColumnWidth,
	} = useTableUtils({
		prefix: 'server-table',
		suffix: props.suffix,
		defaultAttrs: useAttrs(),
		itemsPerPage: props.itemsPerPage,
		serverItemsLength: props.serverItemsLength,
		options,
	})

	onMounted(() => {
		setupAccessibility(table.value?.$el)
	})

	const { watchOptions } = setupLocalStorage()

	// Create a reactive reference to column widths that will be provided to children
	const reactiveColumnWidths = ref(columnWidths.value)

	// Provide column widths and update function to child components
	provide('columnWidths', reactiveColumnWidths)
	provide('updateColumnWidth', (key: string, width: number | string) => {
		// Update both the local reactive reference and call the storage utility
		reactiveColumnWidths.value[key] = width
		updateColumnWidth(key, width)
	})

	// Watch for changes to columnWidths from storage and update the reactive reference
	watch(
		() => columnWidths.value,
		(newWidths) => {
			reactiveColumnWidths.value = { ...newWidths }
		},
		{ deep: true, immediate: true },
	)

	watch(
		() => options.value,
		() => {
			// Call watchOptions to update localStorage
			watchOptions()

			// We need to use nextTick to ensure the table has re-rendered
			nextTick(() => {
				// Update the reactive reference directly, which will update the provided value
				reactiveColumnWidths.value = { ...columnWidths.value }
			})
		},
		{ deep: true },
	)

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { internalHeader, displayHeaders } = useTableHeaders(toRef(props, 'headers'))

</script>

<template>
	<div
		:class="['sy-server-table', { 'sy-server-table--striped': props.striped }]"
	>
		<VDataTableServer
			ref="table"
			v-bind="propsFacade"
			:headers="displayHeaders"
			color="primary"
			:items="props.items"
			:items-length="props.serverItemsLength || 0"
			:density="props.density"
			@update:options="updateOptions"
		>
			<template #top>
				<caption
					class="text-subtitle-1 text-center pa-4"
					:class="{ 'd-sr-only': props.caption === '' }"
					:aria-label="props.caption"
				>
					{{ props.caption }}
				</caption>
			</template>
			<template #headers="slotProps">
				<template v-if="slotProps && slotProps.columns">
					<tr class="headers">
						<template
							v-for="column in (slotProps as HeaderSlotProps).columns"
							:key="column.key"
						>
							<th>
								<TableHeader
									:table="table"
									:header-params="slotProps"
									:column="column"
									:resizable-columns="props.resizableColumns"
								/>
							</th>
						</template>
					</tr>
					<tr
						v-if="props.showFilters"
						class="filters"
					>
						<template
							v-for="column in (slotProps as HeaderSlotProps).columns"
							:key="column.key"
						>
							<th>
								<!-- Check if the column is filterable based on the headers prop -->
								<SyTableFilter
									v-if="!props.headers?.find(h => (h.key === column.key || h.value === column.key) && h.filterable === false)"
									:filterable="true"
									:filters="filters"
									:header="column"
									:input-config="props.filterInputConfig"
									@update:filters="filters = $event"
								>
									<template #custom-filter="filterSlotProps">
										<slot
											name="filter.custom"
											:header="filterSlotProps.header"
											:value="filterSlotProps.value"
											:update-filter="filterSlotProps.updateFilter"
										/>
									</template>
								</SyTableFilter>
							</th>
						</template>
					</tr>
					<tr
						v-if="props.showFilters && filters.length > 0"
						class="reset"
					>
						<td
							:colspan="slotProps.columns.length"
							class="text-right px-4 py-2"
						>
							<VBtn
								size="small"
								color="primary"
								variant="outlined"
								@click="filters = []"
							>
								{{ locales.resetFilters }}
							</VBtn>
						</td>
					</tr>
				</template>
				<!-- Repli lorsque les colonnes ne sont pas définies -->
				<template v-else>
					<tr class="headers">
						<th
							v-for="header in props.headers || []"
							:key="((header.key || header.value || '') as string)"
						>
							<span class="font-weight-bold">{{ header.title }}</span>
						</th>
					</tr>
					<tr
						v-if="props.showFilters"
						class="filters"
					>
						<th
							v-for="header in props.headers || []"
							:key="((header.key || header.value || '') as string)"
						>
							<SyTableFilter
								v-if="header.filterable"
								:filters="filters"
								:header="header"
								:input-config="props.filterInputConfig"
								@update:filters="filters = $event"
							>
								<template #custom-filter="customFilterSlotProps">
									<slot
										:name="filter.custom"
										:header="customFilterSlotProps.header"
										:value="customFilterSlotProps.value"
										:update-filter="customFilterSlotProps.updateFilter"
									/>
								</template>
							</SyTableFilter>
						</th>
					</tr>
				</template>
			</template>
			<template #footer.prepend>
				<OrganizeColumns
					v-if="props.enableColumnControls"
					v-model:headers="internalHeaders"
				/>
				<slot name="footer.prepend" />
			</template>
		</VDataTableServer>
	</div>
</template>

<style lang="scss" scoped>
@use '@/components/Tables/common/tableStyles' as *;
@use '@/assets/tokens';

.sy-server-table :deep() {
	@include tablestyles;
}

@mixin striped-rows {
	.v-table tbody tr:nth-child(even) {
		background-color: rgba(tokens.$primary-base, 0.05);
	}
}

.sy-server-table--striped :deep() {
	@include striped-rows;
}
</style>
