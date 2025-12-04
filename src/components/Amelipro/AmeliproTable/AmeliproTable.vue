<script setup lang="ts">
	import type { AmeliproTableCell, AmeliproTableHeader } from './types'
	import type { IDataListItem, IndexedObject } from '../types'
	import { computed, onMounted, onUpdated, type PropType, ref, watch } from 'vue'
	import AmeliproIconBtn from '../AmeliproIconBtn/AmeliproIconBtn.vue'
	import AmeliproPagination from '../AmeliproPagination/AmeliproPagination.vue'
	import AmeliproSelect from '../AmeliproSelect/AmeliproSelect.vue'
	import type { SelectItem } from '../AmeliproSelect/types'
	import { useDisplay } from 'vuetify'
	import { usePagination } from '../../../composables'

	const props = defineProps({
		counterLabel: {
			type: String,
			default: 'item(s)',
		},
		dataList: {
			type: Array as PropType<IDataListItem[]>,
			default: () => [],
		},
		headers: {
			type: Array as PropType<AmeliproTableHeader[]>,
			default: () => [],
		},
		hiddenLabels: {
			type: Boolean,
			default: false,
		},
		itemsToDisplayDesktop: {
			type: Number,
			default: 10,
		},
		itemsToDisplayMobile: {
			type: Number,
			default: 10,
		},
		noTableInfos: {
			type: Boolean,
			default: false,
		},
		paginationSelectLabel: {
			type: String,
			default: 'Nb lignes/page :',
		},
		paginationSelectPlaceholder: {
			type: String,
			default: 'Nb lignes/page',
		},
		sortSelectDefaultValue: {
			type: [Number, String] as PropType<number | string>,
			default: undefined,
		},
		sortSelectItems: {
			type: Array as PropType<SelectItem[]>,
			default: () => [],
		},
		sortSelectLabel: {
			type: String,
			default: 'Trier par :',
		},
		sortSelectPlaceholder: {
			type: String,
			default: 'Trier par',
		},
		tableMaxWidth: {
			type: String,
			default: '100%',
		},
		tableMinWidth: {
			type: String,
			default: undefined,
		},
		tableWidth: {
			type: String,
			default: '100%',
		},
		title: {
			type: String,
			required: true,
		},
		uniqueId: {
			type: String,
			required: true,
		},
		verticalBorder: {
			type: Boolean,
			default: false,
		},
	})

	const { mdAndUp } = useDisplay()

	const {
		currentPage,
		currentPageItems,
		itemToDisplay,
		paginationSelectItems,
		paginationTable,
		setDefaultItemsPerPage,
		updatePagination,
	} = usePagination(props.dataList, props.itemsToDisplayDesktop, props.itemsToDisplayMobile)

	const paginationSelectModel = ref(itemToDisplay.value)
	const sortSelectModel = ref(props.sortSelectDefaultValue)

	watch(() => props.dataList, () => {
		updatePagination(props.dataList, itemToDisplay.value)
		if (currentPage.value > paginationTable.value.length) {
			currentPage.value = Math.max(1, paginationTable.value.length)
		}
	})

	onMounted(() => {
		hideSelectLabel()
		setDefaultItemsPerPage()
	})

	onUpdated(() => {
		hideSelectLabel()
	})

	const hideSelectLabel = (): void => {
		if (props.hiddenLabels) {
			document.getElementById(`${props.uniqueId}-sort-select-label`)?.setAttribute('class', 'd-sr-only')
			document.getElementById(`${props.uniqueId}-pagination-select-label`)?.setAttribute('class', 'd-sr-only')
		}
	}

	const datas = (element: IDataListItem): AmeliproTableCell[] => props.headers.map(headerElement => ({
		columnAlign: headerElement.align,
		columnClasses: headerElement.cellsClasses,
		value: element[headerElement.name],
	}))

	const currentDataList = computed<IDataListItem[]>(() => currentPageItems(props.dataList))

	const hasHeaderSorting = computed<boolean>(() => {
		const hasSorting = ref(false)
		props.headers.forEach((header: AmeliproTableHeader) => {
			if (header.sort) {
				hasSorting.value = true
			}
		})
		return hasSorting.value
	})

	const tableWidthStyles = computed<IndexedObject>(() => {
		const tableStyle: IndexedObject = {
			maxWidth: props.tableMaxWidth,
			width: props.tableWidth,
		}

		if (props.tableMinWidth) {
			tableStyle.minWidth = props.tableMinWidth
		}

		return tableStyle
	})

	const emit = defineEmits(['click', 'change:sort-select', 'change:pagination-select', 'asc-sort', 'desc-sort'])
	const emitClickEvent = (newCurrentPage: number): void => {
		emit('click')
		if (newCurrentPage !== null && newCurrentPage !== undefined) {
			currentPage.value = newCurrentPage
		}
	}

	const emitSortSelectChange = (): void => {
		emit('change:sort-select', sortSelectModel.value)
	}

	const emitHeaderSortEvent = (order: string, header: string): void => {
		if (order.toLowerCase() === 'ascendant') {
			emit('asc-sort', header)
		}

		if (order.toLowerCase() === 'descendant') {
			emit('desc-sort', header)
		}
	}

	const emitPaginationSelectChange = (): void => {
		emit('change:pagination-select')
		updatePagination(props.dataList, paginationSelectModel.value)

		if ((currentPage.value !== null && currentPage.value !== undefined) && currentPage.value > paginationTable.value.length) {
			currentPage.value = paginationTable.value.length
		}

		if (currentPage.value === 0) {
			currentPage.value = 1
		}
	}
	watch(sortSelectModel, emitSortSelectChange, { immediate: true })
</script>

<template>
	<div
		:id="`${uniqueId}-container`"
		class="amelipro-table"
	>
		<div
			v-if="!noTableInfos"
			:id="`${uniqueId}-info-wrapper`"
			class="d-flex justify-space-between align-end mb-4 amelipro-table__infos"
		>
			<p
				:id="`${uniqueId}-total-counter`"
				class="d-inline-block mb-0 total-counter font-weight-semibold"
			>
				<span class="d-sr-only">Nombre de lignes dans le tableau ci-après :</span>
				{{ dataList.length }} {{ counterLabel }}
			</p>

			<div
				:id="`${uniqueId}-select-wrapper`"
				class="d-inline-flex align-center amelipro-table__selects"
			>
				<AmeliproSelect
					v-if="sortSelectItems.length > 0"
					v-model="sortSelectModel"
					classes="ml-2 mb-0 pt-0 amelipro-table__sort-select"
					global-max-width="170px"
					global-min-width="162px"
					:hide-error-message="true"
					:items="sortSelectItems"
					:label="sortSelectLabel"
					:placeholder="sortSelectPlaceholder"
					:unique-id="`${uniqueId}-sort-select`"
					@update:model-value="emitSortSelectChange"
				/>

				<AmeliproSelect
					v-if="mdAndUp"
					v-model="paginationSelectModel"
					classes="ml-2 mb-0 pt-0 amelipro-table__pagination-select"
					global-max-width="170px"
					:hide-error-message="true"
					:items="paginationSelectItems"
					:label="paginationSelectLabel"
					:placeholder="paginationSelectPlaceholder"
					:unique-id="`${uniqueId}-pagination-select`"
					@update:model-value="emitPaginationSelectChange()"
				/>
			</div>
		</div>
		<div
			v-if="mdAndUp || hasHeaderSorting"
			:id="`${uniqueId}-desktop`"
			style="overflow-x: auto;"
		>
			<div
				class="amelipro-table__wrapper--desktop"
				:style="tableWidthStyles"
			>
				<table
					:id="`${uniqueId}-table`"
					:aria-label="title"
					class="amelipro-table__table--desktop"
					:class="{
						'vertical-border': verticalBorder
					}"
				>
					<thead>
						<tr :id="`${uniqueId}-table-header`">
							<th
								v-for="(header, index) in headers"
								:id="`${uniqueId}-table-header-cell-${index}`"
								:key="index"
								class="bg-ap-grey-lighten-4 font-weight-semibold"
								:class="header.headerClasses"
								scope="col"
								:style="`min-width: ${header.minWidth};
								width: ${header.width};
								max-width: ${header.maxWidth};
								text-align: ${header.align};`"
							>
								<p
									:aria-describedby="header.descriptionId"
									class="mb-0"
									:class="{ 'd-flex' : header.sort }"
								>
									{{ header.title }}

									<AmeliproIconBtn
										v-if="header.sort?.ascendant"
										class="ml-2 sort-btn"
										:btn-label="header.sort?.ascendant.label"
										:btn-title="header.sort?.ascendant.label"
										:disabled="header.sort.ascendant.disabled"
										icon="triangleUp"
										icon-bg-color="transparent"
										:icon-color="header.sort.ascendant.disabled ? 'ap-grey-lighten-2' :'ap-grey-darken-1'"
										icon-hover-bg-color="transparent"
										:icon-hover-color="header.sort.ascendant.disabled ? 'ap-grey-lighten-2' :'ap-grey-darken-1'"
										:unique-id="`${uniqueId}-table-header-cell-${index}-asc-sort-btn`"
										size="9px"
										@click="emitHeaderSortEvent('ascendant', header.name)"
									/>

									<AmeliproIconBtn
										v-if="header.sort?.descendant"
										class="sort-btn"
										:class="{ 'ml-2': !header.sort.ascendant }"
										:btn-label="header.sort.descendant.label"
										:btn-title="header.sort.descendant.label"
										:disabled="header.sort.descendant.disabled"
										icon="triangleDown"
										icon-bg-color="transparent"
										:icon-color="header.sort.descendant.disabled ? 'ap-grey-lighten-2' :'ap-grey-darken-1'"
										icon-hover-bg-color="transparent"
										:icon-hover-color="header.sort.descendant.disabled ? 'ap-grey-lighten-2' :'ap-grey-darken-1'"
										:unique-id="`${uniqueId}-table-header-cell-${index}-desc-sort-btn`"
										size="9px"
										@click="emitHeaderSortEvent('descendant', header.name)"
									/>
								</p>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="(row, rowIndex) in currentDataList"
							:id="`${uniqueId}-table-row-${rowIndex}`"
							:key="rowIndex"
						>
							<td
								v-for="(cell, cellIndex) in datas(row)"
								:id="`${uniqueId}-table-row-${rowIndex}-cell-${cellIndex}`"
								:key="cellIndex"
								:class="cell.value !== undefined ? cell.columnClasses : undefined"
								:style="cell !== undefined ? `text-align: ${cell.columnAlign};` : undefined"
							>
								<p
									v-if="cell.value !== undefined"
									class="mb-0"
								>
									{{ cell.value }}
								</p>

								<slot
									v-else
									:name="`item-${headers[cellIndex].name}`"
									v-bind="row"
								/>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<div
			v-if="!mdAndUp && !hasHeaderSorting"
			:id="`${uniqueId}-mobile`"
			class="amelipro-table__wrapper--mobile"
		>
			<div
				v-for="(table, tableIndex) in currentDataList"
				:key="tableIndex"
				class="mb-3"
			>
				<table
					:id="`${uniqueId}-table-${tableIndex}`"
					:aria-label="`${title} - partie ${tableIndex + 1}`"
					class="amelipro-table__table--mobile"
				>
					<tr
						v-for="(headeritem, headerindex) in headers"
						:id="`${uniqueId}-table-${tableIndex}-row-${headerindex}`"
						:key="headerindex"
					>
						<th
							:id="`${uniqueId}-table-${tableIndex}-row-${headerindex}-head`"
							class="ap-grey lighten-4 font-weight-semibold text-left"
							:class="headeritem.headerClasses"
							scope="row"
							style="width: 50%; max-width: 50%; min-width: 50%;"
						>
							<p class="mb-0">
								{{ headeritem.title }}
							</p>
						</th>
						<td
							:id="`${uniqueId}-table-${tableIndex}-row-${headerindex}-content`"
							class="text-left"
							:class="datas(currentDataList[tableIndex])[headerindex].columnClasses !== undefined ? datas(currentDataList[tableIndex])[headerindex].columnClasses : undefined"
							style="width: 50%; max-width: 50%; min-width: 50%;"
						>
							<p
								v-if="datas(currentDataList[tableIndex])[headerindex].value !== undefined"
								class="mb-0"
							>
								{{ datas(currentDataList[tableIndex])[headerindex].value }}
							</p>
							<slot
								v-else
								:name="`item-${headeritem.name}`"
								v-bind="currentDataList[tableIndex]"
							/>
						</td>
					</tr>
				</table>
			</div>
		</div>

		<AmeliproPagination
			v-if="paginationTable !== undefined && paginationTable.length > 0"
			:active-page-default="1"
			class="mt-2"
			:items="paginationTable"
			:unique-id="`${uniqueId}-pagination`"
			@click="emitClickEvent"
		/>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

.amelipro-table__wrapper--desktop,
.amelipro-table__wrapper--mobile > div {
	border: 1px solid apTokens.$ap-grey;
	border-radius: 8px;
}

table {
	width: 100%;
	min-width: 100%;
	border-collapse: collapse;
	vertical-align: center;
}

th,
td {
	padding: 0.5rem 0.75rem;
	border-bottom: 1px solid apTokens.$ap-grey;

	.amelipro-table__wrapper--mobile table tr:last-child & {
		border-bottom: 0;
	}
}

.amelipro-table__wrapper--mobile {
	& td {
		border-left: 1px solid apTokens.$ap-grey;
	}

	& table tr:first-child th {
		border-top-left-radius: 8px;
	}

	& table tr:last-child th {
		border-bottom-left-radius: 8px;
	}
}

.amelipro-table__wrapper--desktop {
	& th:first-child {
		border-top-left-radius: 8px;
	}

	& th:last-child {
		border-top-right-radius: 8px;
	}
}

.vertical-border {
	td,
	th {
		border-left: 1px solid apTokens.$ap-grey;
		border-right: 1px solid apTokens.$ap-grey;
	}

	& tr td:first-child,
	& tr th:first-child {
		border-left: 0;
	}

	& tr td:last-child,
	& tr th:last-child {
		border-right: 0;
	}
}

tr:last-child td {
	border-bottom: 0;
}

.total-counter {
	background-color: apTokens.$ap-grey-lighten2;
	border: 1px solid apTokens.$ap-grey-darken1;
	border-radius: apTokens.$btn-radius;
	padding: 0.5rem 0.75rem;
}

.sort-btn {
	margin-top: -4px;
	width: 24px !important;
	height: 24px !important;

	& :deep(.amelipro-custom-icon) {
		vertical-align: unset !important;
	}
}
</style>
