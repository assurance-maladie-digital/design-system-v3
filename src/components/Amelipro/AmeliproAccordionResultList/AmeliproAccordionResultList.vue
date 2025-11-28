<script setup lang="ts">
	import { onMounted, onUpdated, type PropType, ref, watch } from 'vue'
	import AmeliproAccordionResultTemplate
		from '../AmeliproAccordionResult/AmeliproAccordionResultTemplate/AmeliproAccordionResultTemplate.vue'
	import type { IDataListItem } from '../types'
	import AmeliproPagination from '../AmeliproPagination/AmeliproPagination.vue'
	import AmeliproSelect from '../AmeliproSelect/AmeliproSelect.vue'
	import type { SelectItem } from '../AmeliproSelect/types'
	import { useDisplay } from 'vuetify'
	import { usePagination } from '../../../composables'

	const props = defineProps({
		counterLabel: {
			type: String,
			default: 'résultat(s)',
		},
		defaultItemOpened: {
			type: [Number, null] as PropType<number | null>,
			default: null,
		},
		groupBorderColor: {
			type: String,
			default: 'ap-grey',
		},
		groupBordered: {
			type: Boolean,
			default: true,
		},
		groupColor: {
			type: String,
			default: 'ap-white',
		},
		hiddenLabels: {
			type: Boolean,
			default: false,
		},
		hideSeparator: {
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
		title: {
			type: String,
			required: true,
		},
		uniqueId: {
			type: String,
			required: true,
		},
	})

	const openId = ref<string | null>(null)
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

	onMounted(() => {
		if (props.defaultItemOpened !== null) {
			const item = props.items?.[props.defaultItemOpened]
			if (item && item.id !== undefined && item.id !== null) {
				openId.value = `accordion-result-${item.id}`
			}
		}
		hideSelectLabel()
		setDefaultItemsPerPage()
	})

	onUpdated(() => {
		hideSelectLabel()
	})

	watch(() => props.items, () => {
		updatePagination(props.items, paginationSelectModel.value)
		if (currentPage.value > paginationTable.value.length) {
			currentPage.value = Math.max(1, paginationTable.value.length)
		}
	})

	const emit = defineEmits(['click', 'change:sort-select', 'change:pagination-select', 'open-close'])
	const openClose = (id: number): void => {
		openId.value = openId.value === String(id) ? null : String(id)
		emit('open-close', id, openId.value)
	}

	const hideSelectLabel = (): void => {
		if (props.hiddenLabels) {
			document.getElementById(`${props.uniqueId}-sort-select-label`)?.setAttribute('class', 'd-sr-only')
			document.getElementById(`${props.uniqueId}-pagination-select-label`)?.setAttribute('class', 'd-sr-only')
		}
	}

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

	// Rendre publique la méthode openClose permet à un bouton ou à un composant externe de fermer/ouvrir l'accordéon
	defineExpose({ openClose })
</script>

<template>
	<div
		:id="`${uniqueId}-container`"
		class="amelipro-accordion-result-list"
	>
		<div
			v-if="!noResultListInfos"
			:id="`${uniqueId}-header`"
			class="amelipro-accordion-result-list__headings d-flex justify-space-between align-end mb-6"
		>
			<p
				:id="`${uniqueId}-result-counter`"
				class="d-inline-block mb-0 total-counter font-weight-semibold"
			>
				<span class="d-sr-only">Nombre de lignes dans la liste ci-après :</span>
				{{ items.length }} {{ counterLabel }}
			</p>

			<div class="d-inline-flex align-center amelipro-accordion-result-list__selects">
				<AmeliproSelect
					v-if="sortSelectItems.length > 0"
					v-model="sortSelectModel"
					classes="ml-2 mb-0 pt-0 amelipro-accordion-result-list__sort-select"
					global-max-width="170px"
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
					classes="ml-2 mb-0 pt-0 amelipro-accordion-result-list__pagination-select"
					global-max-width="170px"
					:hide-error-message="true"
					:items="paginationSelectItems"
					:label="paginationSelectLabel"
					:placeholder="paginationSelectPlaceholder"
					:unique-id="`${uniqueId}-pagination-select`"
					@update:model-value="emitPaginationSelectChange"
				/>
			</div>
		</div>
		<div class="amelipro-accordion-result-list__list-wrapper">
			<ul
				:id="`${uniqueId}-list`"
				:aria-label="title"
				class="list-style-none amelipro-accordion-result-list__list"
			>
				<li
					v-for="(accordion, index) in currentPageItems(items)"
					:key="index"
					class="amelipro-accordion-result-list__item"
				>
					<AmeliproAccordionResultTemplate
						:border-color="groupBorderColor"
						:bordered="groupBordered"
						:card-color="groupColor"
						:hide-separator="hideSeparator"
						:is-open="`accordion-result-${accordion.id}` === openId"
						:unique-id="`accordion-result-${accordion.id}`"
						@open-close="openClose"
					>
						<template #headingContent>
							<slot
								:name="`headingContent-${accordion.id}`"
								v-bind="accordion"
							>
								<slot
									name="headingContent"
									v-bind="accordion"
								/>
							</slot>
						</template>

						<template #default>
							<slot
								:name="`accordionContent-${accordion.id}`"
								v-bind="accordion"
							>
								<slot
									name="accordionContent"
									v-bind="accordion"
								/>
							</slot>
						</template>
					</AmeliproAccordionResultTemplate>
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
