<script setup lang="ts">
	import { computed, ref, nextTick, watch } from 'vue'
	import SySelect from '@/components/Customs/SySelect/SySelect.vue'
	import { locales } from './locales'

	// Generate unique ID for this pagination instance
	const uniqueId = ref(`pagination-${Math.random().toString(36).substr(2, 9)}`)

	// Items per page options - standard options and current value
	const itemsPerPageOptions = computed(() => {
		// Standard options
		const standardOptions = [10, 25, 50, 100]
		
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

		// Add "Tous" option to display all elements
		options.push({
			text: locales.pagination.all,
			value: -1,
		})

		return options
	})

	const props = defineProps<{
		/**
		 * Current page number
		 */
		page: number
		/**
		 * Total number of pages
		 */
		pageCount: number
		/**
		 * Number of items per page
		 */
		itemsPerPage: number
		/**
		 * Total number of items
		 */
		itemsLength: number
	}>()

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

	// Removed unused itemsRange computed property

	// Removed unused paginationTitle computed property

	/**
	 * Compute the visible page numbers to display
	 * Shows current page, previous and next 2 pages when available
	 */
	const visiblePageNumbers = computed(() => {
		// Define array that can contain both numbers and strings
		const pages: (number | string)[] = []
		const currentPage = props.page
		const totalPages = props.pageCount

		// Always show first page
		pages.push(1)

		// Add ellipsis if needed
		if (currentPage > 4) {
			pages.push('ellipsis-start')
		}

		// Show pages around current page
		for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
			pages.push(i)
		}

		// Add ellipsis if needed
		if (currentPage < totalPages - 3) {
			pages.push('ellipsis-end')
		}

		// Always show last page if more than 1 page
		if (totalPages > 1) {
			pages.push(totalPages)
		}

		return pages
	})

	/**
	 * Extract only the numeric middle pages from visiblePageNumbers
	 */
	const middlePages = computed(() => {
		return visiblePageNumbers.value.filter(
			page => typeof page === 'number' && page !== 1 && page !== props.pageCount,
		) as number[]
	})

	/**
	 * Navigate to previous page
	 */
	function previousPage() {
		if (props.page > 1) {
			emit('update:page', props.page - 1)
		}
	}

	/**
	 * Navigate to next page
	 */
	function nextPage() {
		if (props.page < props.pageCount) {
			emit('update:page', props.page + 1)
		}
	}

	/**
	 * Navigate to a specific page
	 */
	function goToPage(pageNumber: number) {
		emit('update:page', pageNumber)
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

	// Watch for local changes and emit events
	watch(localItemsPerPage, (newValue) => {
		// First reset to page 1 when changing items per page
		emit('update:page', 1)
		// Then update the items per page
		emit('update:items-per-page', newValue)

		// Force a re-render of the component
		nextTick(() => {
			// This will trigger a re-render of the parent components
			emit('update:items-per-page', newValue)
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

		<nav
			v-if="pageCount > 1"
			class="pagination"
			:aria-labelledby="uniqueId"
		>
			<h2
				:id="uniqueId"
				class="d-sr-only"
			>
				{{ locales.pagination.paginationNavAriaLabel }}
			</h2>
			<ul class="list">
				<!-- Previous link -->
				<li>
					<a
						href="#"
						:class="{ 'disabled': page <= 1 }"
						@click.prevent="previousPage"
					>{{ locales.pagination.previous }}</a>
				</li>

				<!-- First page -->
				<li>
					<a
						href="#"
						class="list-first"
						:aria-current="page === 1 ? 'page' : undefined"
						@click.prevent="goToPage(1)"
					>{{ locales.pagination.pageText(1) }}</a>
				</li>

				<!-- Start ellipsis if needed -->
				<li v-if="visiblePageNumbers.includes('ellipsis-start')">
					<a class="ellipsis">&#8230;</a>
				</li>

				<!-- Middle pages (6, 7, 8, 9, 10) -->
				<li
					v-for="pageNum in middlePages"
					:key="pageNum"
				>
					<a
						href="#"
						:aria-current="page === pageNum ? 'page' : undefined"
						@click.prevent="goToPage(pageNum)"
					>{{ locales.pagination.pageText(pageNum) }}</a>
				</li>

				<!-- End ellipsis if needed -->
				<li v-if="visiblePageNumbers.includes('ellipsis-end')">
					<a class="ellipsis">&#8230;</a>
				</li>

				<!-- Last page (if not already shown) -->
				<li v-if="pageCount > 1">
					<a
						href="#"
						class="list-last"
						:aria-current="page === pageCount ? 'page' : undefined"
						@click.prevent="goToPage(pageCount)"
					>{{ locales.pagination.pageText(pageCount) }}</a>
				</li>

				<!-- Next link -->
				<li>
					<a
						href="#"
						:class="{ 'disabled': page >= pageCount }"
						@click.prevent="nextPage"
					>{{ locales.pagination.next }}</a>
				</li>
			</ul>
		</nav>

		<div class="rows-per-page">
			<span class="rows-per-page-label">{{ locales.pagination.itemsPerPageText }}</span>
			<SySelect
				v-model="localItemsPerPage"
				:items="itemsPerPageOptions"
				hide-details
				hide-messages
				density="compact"
				class="rows-per-page-select"
				:aria-label="locales.pagination.itemsPerPageText"
				:label="''"
				style="width: 80px;"
				:clearable="false"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';

.sy-table-pagination {
	display: flex;
	align-items: center;
	justify-content: space-between;
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

		.list {
			display: flex;
			flex-wrap: wrap;
			gap: 0.5rem;
			list-style: none;
			padding: 0;
			margin: 0;

			li {
				display: inline-block;
			}

			a {
				display: inline-block;
				padding: 0.5rem 0.75rem;
				text-decoration: none;
				color: tokens.$primary-base;
				border: 1px solid tokens.$primary-base;
				border-radius: 4px;
				transition: all 0.2s ease;
				font-size: 0.875rem;
				line-height: 1;

				&:hover,
				&:focus {
					background-color: rgba(tokens.$primary-base, 0.1);
				}

				&[aria-current='page'] {
					background-color: tokens.$primary-base;
					color: white;
					font-weight: 500;
				}

				&.disabled {
					color: rgb(0 0 0 / 40%);
					border-color: rgb(0 0 0 / 20%);
					pointer-events: none;
				}

				&.ellipsis {
					border: none;
					pointer-events: none;
				}
			}

			// Style for Previous/Next links
			li:first-child a,
			li:last-child a {
				background-color: transparent;
				border: none;
				padding-left: 0.25rem;
				padding-right: 0.25rem;
			}
		}
	}
}
</style>
