<script setup lang="ts">
	import { VPagination } from 'vuetify/components'
	import { usePagination } from 'vuetify/lib/components/VDataTable/composables/paginate.mjs'
	import SySelect from '../Customs/Selects/SySelect/SySelect.vue'
	import { useLocale } from 'vuetify'

	const { page, pageCount, startIndex, stopIndex, itemsLength, itemsPerPage, setItemsPerPage } = usePagination()

	const { t } = useLocale()

	const itemsPerPageOptions = [
		{ value: 10, title: '10' },
		{ value: 25, title: '25' },
		{ value: 50, title: '50' },
		{ value: 100, title: '100' },
		{ value: -1, title: t('$vuetify.dataFooter.itemsPerPageAll') },
	]

</script>
<template>
	<div class="v-data-table-footer">
		<slot name="prepend" />
		<div class="v-data-table-footer__items-per-page d-flex">
			<span>{{ t('$vuetify.dataFooter.itemsPerPageText') }}</span>
			<SySelect
				:label="t('$vuetify.dataFooter.itemsPerPageText')"
				:items="itemsPerPageOptions"
				text-key="title"
				value-key="value"
				:model-value="itemsPerPage"
				density="compact"
				variant="outlined"
				hide-details
				@update:model-value="v => setItemsPerPage(Number(v))"
			/>
		</div>

		<div class="v-data-table-footer__info">
			<div>
				{{ t('$vuetify.dataFooter.pageText', !itemsLength ? 0 : startIndex + 1, stopIndex, itemsLength) }}
			</div>
		</div>
		<div class="v-data-table-footer__pagination">
			<VPagination
				v-model="page"
				density="comfortable"
				first-aria-label="$vuetify.dataFooter.firstPage"
				last-aria-label="$vuetify.dataFooter.lastPage"
				:length="pageCount"
				next-aria-label="$vuetify.dataFooter.nextPage"
				previous-aria-label="$vuetify.dataFooter.prevPage"
				rounded
				show-first-last-page
				:total-visible="0"
				variant="plain"
			/>
		</div>
	</div>
</template>
<style scoped lang="scss">
/* stylelint-disable-next-line selector-class-pattern */
:deep(.v-field__outline__notch, .v-field-label) {
	width: 0;
}

:deep(.v-input) {
	min-width: 0 !important;
	width: 90px;
}

:deep(.sy-select-container) {
	width: max-content;
}

:deep(.v-pagination) button:focus-visible {
	outline: 2px solid var(--v-theme-colors-interactive);
	outline-offset: -2px;
}

:deep(.v-pagination) .v-pagination__list [aria-disabled='false'] svg {
	color: rgb(var(--v-theme-iconBase));
}

:deep(.v-pagination) .v-btn--variant-plain[aria-disabled='false'] {
	opacity: 1;
}

:deep(.v-pagination) .v-btn--variant-plain:hover[aria-disabled='false'] svg {
	color: #000;
}
</style>
