<script setup lang="ts">
	import { computed, ref } from 'vue'

	// Props definition
	const props = defineProps<{
		/**
		 * Current page number
		 */
		modelValue: number
		/**
		 * Total number of pages (optional, defaults to 1)
		 */
		pages?: number
		/**
		 * Nombre de boutons visibles
		 */
		visible?: number
		/**
		 * Label for the pagination component
		 */
		label?: string
		/**
		 * ID of the element controlled by this pagination
		 */
		ariaControls?: string
	}>()

	// Default values for optional props
	const visiblePages = computed(() => props.visible || 5)
	const label = computed(() => props.label || 'Pagination')
	const totalPages = computed(() => props.pages || 1)

	// Generate unique ID for this pagination instance
	const uniqueId = ref(`pagination-${Math.random().toString(36).substr(2, 9)}`)

	// Emits definition
	const emit = defineEmits<{
		/**
		 * Emitted when the page changes
		 */
		(e: 'update:modelValue', page: number): void
	}>()

	/**
	 * Visible page numbers to display
	 * Shows current page and surrounding pages based on visible prop
	 * If the number of visible pages is greater than the total number of pages,
	 * ellipsis will be shown to indicate the presence of additional pages
	 */
	const visiblePageNumbers = computed(() => {
		const pages: (number | string)[] = []
		const currentPage = props.modelValue
		const visibleCount = visiblePages.value

		// Always show first page
		pages.push(1)

		// For small total pages, just show all pages without ellipsis
		if (totalPages.value <= visibleCount + 2) { // +2 to account for first and last pages
			for (let i = 2; i < totalPages.value; i++) {
				pages.push(i)
			}
			if (totalPages.value > 1) {
				pages.push(totalPages.value)
			}
			return pages
		}

		// Calculate how many pages we can show in total
		// We need to account for first and last page which are always shown
		const maxVisibleMiddlePages = Math.max(1, visibleCount - 2) // Subtract 2 to account for first and last pages
		const halfVisible = Math.floor(maxVisibleMiddlePages / 2)

		// Calculate the range of pages to show around the current page
		let startPage = Math.max(2, currentPage - halfVisible)
		let endPage = Math.min(totalPages.value - 1, currentPage + halfVisible)

		// Adjust the range to ensure we show the correct number of pages in the middle
		const currentVisibleCount = endPage - startPage + 1
		if (currentVisibleCount < maxVisibleMiddlePages) {
			// If we're closer to the start, show more pages at the end
			if (startPage === 2) {
				endPage = Math.min(totalPages.value - 1, startPage + maxVisibleMiddlePages - 1)
			}
			// If we're closer to the end, show more pages at the start
			else if (endPage === totalPages.value - 1) {
				startPage = Math.max(2, endPage - maxVisibleMiddlePages + 1)
			}
		}

		// Determine if we need ellipsis at the start
		if (startPage > 2) {
			pages.push('ellipsis-start')
		}

		// Show pages around current page
		for (let i = startPage; i <= endPage; i++) {
			pages.push(i)
		}

		// Determine if we need ellipsis at the end
		if (endPage < totalPages.value - 1) {
			pages.push('ellipsis-end')
		}

		// Always show last page if more than 1 page
		if (totalPages.value > 1) {
			pages.push(totalPages.value)
		}

		return pages
	})

	/**
	 * Extract only the numeric middle pages from visiblePageNumbers
	 */
	const middlePages = computed(() => {
		return visiblePageNumbers.value.filter(
			page => typeof page === 'number' && page !== 1 && page !== totalPages.value,
		) as number[]
	})

	/**
	 * Navigate to previous page
	 */
	function previousPage() {
		if (props.modelValue > 1) {
			emit('update:modelValue', props.modelValue - 1)
		}
	}

	/**
	 * Navigate to next page
	 */
	function nextPage() {
		if (props.modelValue < totalPages.value) {
			emit('update:modelValue', props.modelValue + 1)
		}
	}

	/**
	 * Navigate to first page
	 */
	function firstPage() {
		emit('update:modelValue', 1)
	}

	/**
	 * Navigate to last page
	 */
	function lastPage() {
		emit('update:modelValue', totalPages.value)
	}

	/**
	 * Navigate to a specific page
	 */
	function goToPage(pageNumber: number) {
		emit('update:modelValue', pageNumber)
	}

	/**
	 * Check if there are previous pages available
	 */
	const hasPrevious = computed(() => props.modelValue > 1)

	/**
	 * Check if there are next pages available
	 */
	const hasNext = computed(() => props.modelValue < totalPages.value)
</script>

<template>
	<div class="sy-pagination">
		<!-- Custom content before pagination (using slot) -->
		<slot name="prepend" />

		<nav
			v-if="totalPages > 1"
			class="pagination"
			:aria-labelledby="uniqueId"
			:aria-controls="ariaControls"
		>
			<h2
				:id="uniqueId"
				class="d-sr-only"
			>
				{{ `${label}` }}
			</h2>
			<ul class="list">
				<!-- First page button (optional) -->
				<li v-if="$slots['first-page']">
					<a
						href="#"
						class="first-page"
						:class="{ 'disabled': !hasPrevious }"
						@click.prevent="firstPage"
					>
						<slot name="first-page">
							<span>«</span>
						</slot>
					</a>
				</li>

				<!-- Previous button -->
				<li>
					<a
						href="#"
						class="previous-page"
						:class="{ 'disabled': !hasPrevious }"
						@click.prevent="previousPage"
					>
						<slot name="previous">
							<span>Précédent</span>
						</slot>
					</a>
				</li>

				<!-- First page -->
				<li>
					<a
						href="#"
						class="list-first"
						:aria-current="modelValue === 1 ? 'page' : undefined"
						@click.prevent="goToPage(1)"
					>
						<slot
							name="page-number"
							:page="1"
						>
							{{ 1 }}
						</slot>
					</a>
				</li>

				<!-- Start ellipsis if needed -->
				<li v-if="visiblePageNumbers.includes('ellipsis-start')">
					<a class="ellipsis">&#8230;</a>
				</li>

				<!-- Middle pages -->
				<li
					v-for="pageNum in middlePages"
					:key="pageNum"
				>
					<a
						href="#"
						:aria-current="modelValue === pageNum ? 'page' : undefined"
						@click.prevent="goToPage(pageNum)"
					>
						<slot
							name="page-number"
							:page="pageNum"
						>
							{{ pageNum }}
						</slot>
					</a>
				</li>

				<!-- End ellipsis if needed -->
				<li v-if="visiblePageNumbers.includes('ellipsis-end')">
					<a class="ellipsis">&#8230;</a>
				</li>

				<!-- Last page (if not already shown) -->
				<li v-if="totalPages > 1">
					<a
						href="#"
						class="list-last"
						:aria-current="modelValue === totalPages ? 'page' : undefined"
						@click.prevent="goToPage(totalPages)"
					>
						<slot
							name="page-number"
							:page="totalPages"
						>
							{{ totalPages }}
						</slot>
					</a>
				</li>

				<!-- Next button -->
				<li>
					<a
						href="#"
						class="next-page"
						:class="{ 'disabled': !hasNext }"
						@click.prevent="nextPage"
					>
						<slot name="next">
							<span>Suivant</span>
						</slot>
					</a>
				</li>

				<!-- Last page button (optional) -->
				<li v-if="$slots['last-page']">
					<a
						href="#"
						class="last-page"
						:class="{ 'disabled': !hasNext }"
						@click.prevent="lastPage"
					>
						<slot name="last-page">
							<span>»</span>
						</slot>
					</a>
				</li>
			</ul>
		</nav>

		<!-- Custom content after pagination (using slot) -->
		<slot name="append" />
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';

.sy-pagination {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 12px 16px;
	flex-wrap: wrap;
	gap: 1rem;

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
					color: rgb(0 0 0 / 60%); /* Increased from 40% to 60% for better contrast */
					border-color: rgb(0 0 0 / 20%);
					pointer-events: none;
				}

				&.ellipsis {
					border: none;
					pointer-events: none;
					display: inline-block;
					color: tokens.$primary-base;
					padding: 0.6rem;
				}
			}

			.first-page,
			.last-page,
			.previous-page,
			.next-page {
				background-color: transparent;
				border: none;
				padding-left: 0.25rem;
				padding-right: 0.25rem;

				&:hover,
				&:focus {
					background-color: transparent;
				}
			}
		}
	}

	// Screen reader only class
	.d-sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
}
</style>
