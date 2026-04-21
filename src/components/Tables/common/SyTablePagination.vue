<script setup lang="ts">
	import { computed, ref, nextTick, watch, onMounted } from 'vue'
	import SySelect from '@/components/Customs/Selects/SySelect/SySelect.vue'
	import SyPagination from '@/components/Customs/SyPagination/SyPagination.vue'
	import { locales } from './locales'

	const props = withDefaults(defineProps<{
		page: number
		pageCount: number
		itemsPerPage: number
		itemsLength: number
		itemsPerPageOptions?: number[]
		headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
		pageInput?: boolean
	}>(), {
		itemsPerPageOptions: undefined,
		headingLevel: 2,
		pageInput: false,
	})

	// Reference to the SySelect component
	const selectRef = ref<InstanceType<typeof SySelect> | null>(null)

	// Items per page options - standard options and current value
	const formatedItemsPerPageOptions = computed(() => {
		// Use provided itemsPerPageOptions or default standard options
		const baseOptions = props.itemsPerPageOptions || [5, 10, 25, 50, 100]
		// Filter out -1 from base options since we'll handle it separately
		const standardOptions = [...baseOptions.filter(option => option !== -1)]

		// Add the current itemsPerPage if it's not already in the standard options
		// and it's not -1 (which represents "Tous")
		if (!standardOptions.includes(props.itemsPerPage) && props.itemsPerPage !== -1) {
			standardOptions.push(props.itemsPerPage)
			// Sort the options numerically
			standardOptions.sort((a, b) => a - b)
		}

		// Map to the format expected by SySelect
		const options = standardOptions.map(value => ({
			text: value.toString(),
			value,
		}))

		// Add "Tous" option only if not limited by itemsPerPageOptions
		// or if explicitly allowed (by including -1 in itemsPerPageOptions)
		if (!props.itemsPerPageOptions || props.itemsPerPageOptions.includes(-1)) {
			options.push({
				text: locales.pagination.all,
				value: -1,
			})
		}

		return options
	})

	const emit = defineEmits<{
		/**
		 * Emitted when the page changes
		 */
		(e: 'update:page', page: number): void
		/**
		 * Emitted when the items per page changes
		 */
		(e: 'update:items-per-page', itemsPerPage: number): void
	}>()

	/**
	 * Navigate to a specific page
	 * This function is used as a callback for the SyPagination component
	 */
	function goToPage(pageNumber: number) {
		emit('update:page', pageNumber)
	}

	/**
	 * Handle change from the SySelect component directly
	 * Ensure we emit a number for items-per-page, then reset to page 1
	 */
	function handleItemsPerPageChange(value: unknown) {
		const numeric = typeof value === 'string' ? Number.parseInt(value, 10) : (value as number)
		emit('update:items-per-page', numeric)
	}

	/**
	 * Local items per page with two-way binding
	 */
	// Use a ref instead of a computed property for better compatibility with v-model
	const localItemsPerPage = ref(props.itemsPerPage)

	// Watch for changes from parent
	watch(() => props.itemsPerPage, (newValue) => {
		localItemsPerPage.value = newValue
	})

	/**
	 * Page input field logic
	 */
	const pageInputValue = ref<number | null>(props.page)

	watch(() => props.page, (newPage) => {
		pageInputValue.value = newPage
	})

	function commitPageInput() {
		const enteredPage = pageInputValue.value
		if (enteredPage === null || !Number.isInteger(enteredPage)) {
			pageInputValue.value = props.page
			return
		}
		const targetPage = Math.min(Math.max(1, enteredPage), props.pageCount)
		pageInputValue.value = targetPage
		if (targetPage !== props.page) {
			emit('update:page', targetPage)
		}
	}

	function handlePageInputKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			commitPageInput()
		}
	}

	// Remove aria-describedby attribute after component is mounted
	onMounted(() => {
		// Use nextTick to ensure the DOM is fully rendered
		nextTick(() => {
			if (selectRef.value) {
				// Access the SySelect component
				const SySelectEl = selectRef.value.$el
				if (SySelectEl && typeof SySelectEl.querySelector === 'function') {
					// Find the input element
					const inputElement = SySelectEl.querySelector('input')
					if (inputElement) {
						// Remove the aria-describedby attribute
						inputElement.removeAttribute('aria-describedby')
					}
				}
			}
		})
	})
</script>

<template>
	<div class="sy-table-pagination">
		<div class="info">
			{{ itemsPerPage === -1
				? locales.pagination.showingItems(1, itemsLength, itemsLength)
				: locales.pagination.showingItems((page - 1) * itemsPerPage + 1, Math.min(page * itemsPerPage, itemsLength), itemsLength)
			}}
		</div>

		<div
			v-if="pageCount > 1"
			class="pagination-controls"
		>
			<SyPagination
				:model-value="page"
				:pages="pageCount"
				:heading-level="headingLevel"
				:visible="5"
				:label="locales.pagination.paginationNavAriaLabel"
				class="pagination"
				@update:model-value="goToPage"
			>
				<template #previous>
					<span>{{ locales.pagination.previous }}</span>
				</template>
				<template #page-number="{ page: pageNum }">
					{{ locales.pagination.pageText(pageNum) }}
				</template>
				<template #next>
					<span>{{ locales.pagination.next }}</span>
				</template>
			</SyPagination>

			<div
				v-if="pageInput"
				class="page-input"
			>
				<div class="page-input__control">
					<span class="page-input__label">
						{{ locales.pagination.pageInputLabel }}
					</span>
					<input
						v-model.number="pageInputValue"
						type="number"
						:min="1"
						:max="pageCount"
						class="page-input__field"
						:aria-label="locales.pagination.pageInputAriaLabel(pageCount)"
						@blur="commitPageInput"
						@keydown="handlePageInputKeydown"
					>
				</div>
				<span
					class="page-input__total"
					aria-hidden="true"
				>
					{{ locales.pagination.pageOf(pageCount) }}
				</span>
			</div>
		</div>

		<div class="rows-per-page">
			<span class="rows-per-page-label">{{ locales.pagination.itemsPerPageText }}</span>

			<SySelect
				ref="selectRef"
				v-model="localItemsPerPage"
				:items="formatedItemsPerPageOptions"
				hide-details
				hide-messages
				density="compact"
				class="rows-per-page-select"
				:aria-label="locales.pagination.itemsPerPageText"
				:label="''"
				style="width: 90px;"
				:clearable="false"
				@update:model-value="handleItemsPerPageChange"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/overrides/breakpoints' as bp;
.sy-table-pagination {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	padding: 12px 16px;
	flex-wrap: wrap;
	gap: 1rem;

	.info {
		font-size: 0.875rem;
		color: rgb(0 0 0 / 60%);
	}

	.rows-per-page {
		display: flex;
		align-items: center;
		gap: 0.5rem;

		&-label {
			font-size: 0.875rem;
			color: rgb(0 0 0 / 60%);
		}

		&-select {
			:deep(.v-field__field) {
				min-height: 32px !important;
			}

			:deep(.v-field__input) {
				min-height: 32px !important;
				padding-top: 0 !important;
				padding-bottom: 0 !important;
			}

			:deep(.v-field__append-inner) {
				padding-top: 4px !important;
			}
		}
	}

	.pagination {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		align-items: center;
	}

	.pagination-controls {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
	}

	.page-input {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding-inline-start: 1.75rem;
		border-inline-start: 1px solid rgb(0 0 0 / 12%);

		@media #{bp.$down-xs} {
			padding-inline-start: 0;
			border-inline-start: 0;
		}

		&__control {
			display: flex;
			align-items: center;
			gap: 0.5rem;
		}

		&__label {
			font-size: 0.875rem;
			color: rgb(0 0 0 / 60%);
			white-space: nowrap;
		}

		&__field {
			width: 56px;
			height: 32px;
			padding: 0 8px;
			border: 1px solid rgb(var(--v-theme-primary));
			border-radius: 4px;
			font-size: 0.875rem;
			text-align: center;
			color: inherit;
			background: rgb(var(--v-theme-surface));
			appearance: textfield;

			&::-webkit-inner-spin-button,
			&::-webkit-outer-spin-button {
				appearance: none;
			}

			&:focus-visible {
				outline: 2px solid rgb(var(--v-theme-primary));
				outline-offset: 2px;
			}
		}

		&__total {
			font-size: 0.875rem;
			color: rgb(0 0 0 / 60%);
			white-space: nowrap;
		}
	}
}
</style>
