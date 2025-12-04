<script setup lang="ts">
	import { computed, onMounted, onUpdated, type PropType, ref, watch } from 'vue'
	import AmeliproPagination from '../AmeliproPagination/AmeliproPagination.vue'
	import AmeliproSelect from '../AmeliproSelect/AmeliproSelect.vue'
	import type { IDataListItem } from '../types'
	import type { SelectItem } from '../AmeliproSelect/types'
	import { useDisplay } from 'vuetify'
	import { usePagination } from '../../../composables/usePagination'

	const props = defineProps({
		counterLabel: {
			type: String,
			default: 'résultat(s)',
		},
		hiddenLabels: {
			type: Boolean,
			default: false,
		},
		items: {
			type: Array as PropType<IDataListItem[]>,
			default: () => [],
		},
		itemsToDisplayDesktop: {
			type: Number,
			default: 10,
		},
		itemsToDisplayMobile: {
			type: Number,
			default: 10,
		},
		noResultListInfos: {
			type: Boolean,
			default: false,
		},
		paginationSelect: {
			type: Boolean,
			default: true,
		},
		paginationSelectLabel: {
			type: String,
			default: 'Nb lignes/page :',
		},
		paginationSelectPlaceholder: {
			type: String,
			default: 'Nb lignes/page',
		},
		sortSelect: {
			type: Boolean,
			default: true,
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
		title: {
			type: String,
			required: true,
		},
		uniqueId: {
			type: String,
			required: true,
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
	} = usePagination(props.items, props.itemsToDisplayDesktop, props.itemsToDisplayMobile)

	const paginationSelectModel = ref(itemToDisplay.value)
	const sortSelectModel = ref(props.sortSelectDefaultValue)

	watch(() => props.items, () => {
		updatePagination(props.items, paginationSelectModel.value)
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

	const currentItems = computed<IDataListItem[]>(() => currentPageItems(props.items))

	const emit = defineEmits(['click', 'change:sort-select', 'change:pagination-select'])

	const emitClickEvent = (newCurrentPage: number): void => {
		emit('click')
		if (newCurrentPage !== null && newCurrentPage !== undefined) {
			currentPage.value = newCurrentPage
		}
	}

	const emitSortSelectChange = (): void => {
		emit('change:sort-select', sortSelectModel.value)
	}

	const emitPaginationSelectChange = (): void => {
		emit('change:pagination-select')
		updatePagination(props.items, paginationSelectModel.value)

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
		class="amelipro-result-list"
	>
		<div
			v-if="!noResultListInfos"
			:id="`${uniqueId}-header`"
			class="d-flex justify-space-between align-end mb-6 amelipro-result-list__infos"
		>
			<p
				:id="`${uniqueId}-result-counter`"
				class="d-inline-block align-center mb-0 total-counter font-weight-semibold"
			>
				<span class="d-sr-only">Nombre de lignes dans la liste ci-après :</span>
				{{ items.length }} {{ counterLabel }}
			</p>

			<div class="d-inline-flex align-center amelipro-result-list__select__wrapper">
				<AmeliproSelect
					v-if="sortSelectItems.length > 0 && sortSelect"
					v-model="sortSelectModel"
					classes="ml-2 mb-0 pt-0 amelipro-result-list__sort-select"
					global-max-width="170px"
					:hide-error-message="true"
					:items="sortSelectItems"
					:label="sortSelectLabel"
					:placeholder="sortSelectPlaceholder"
					:unique-id="`${uniqueId}-sort-select`"
					@update:model-value="emitSortSelectChange()"
				/>

				<AmeliproSelect
					v-if="mdAndUp && paginationSelect"
					v-model="paginationSelectModel"
					classes="ml-2 mb-0 pt-0 amelipro-result-list__pagination-select"
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
		<div>
			<ul
				:id="`${uniqueId}-list`"
				:aria-label="title"
				class="list-style-none amelipro-result-list__list"
			>
				<li
					v-for="(item, index) in currentItems"
					:id="`${uniqueId}-item-${index}`"
					:key="index"
					class="amelipro-result-list__item"
				>
					<slot
						:name="`result-${item.id}`"
						v-bind="item"
					>
						<slot
							name="result"
							v-bind="item"
						/>
					</slot>
				</li>
			</ul>
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

.total-counter {
	background-color: apTokens.$ap-grey-lighten2;
	border: 1px solid apTokens.$ap-grey-darken1;
	border-radius: apTokens.$btn-radius;
	padding: 0.75rem 1rem;
}
</style>
