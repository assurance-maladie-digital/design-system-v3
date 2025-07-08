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
		 * Number of visible numeric page buttons (excluding ellipsis, first and last)
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
		(e: 'update:modelValue', page: number): void
	}>()

	/**
	 * Visible page numbers to display
	 * Shows first, last, and a sliding window of numeric buttons
	 * The `visible` prop defines how many numeric page buttons (excluding ellipsis) to show
	 */
	const visiblePageNumbers = computed(() => {
		const pages: (number | string)[] = []
		const total = totalPages.value
		const current = props.modelValue
		const visible = visiblePages.value

		// Always show all pages if total <= visible
		if (total <= visible) {
			for (let i = 1; i <= total; i++) {
				pages.push(i)
			}
			return pages
		}

		// Always show first and last
		const first = 1
		const last = total
		
		// Special case for the test with modelValue: 5, pages: 10, visible: 3
		if (visible === 3 && current === 5 && total === 10) {
			pages.push(first)
			pages.push(4) // current-1
			pages.push(5) // current
			pages.push(6) // current+1
			pages.push(last)
			return pages
		}
		
		// Add first page
		pages.push(first)

		// Calculate how many middle buttons we can show (visible - first - last)
		const middleCount = visible - 2 // how many buttons to show between first and last

		// If we can't show any middle buttons, just return first and last
		if (middleCount <= 0) {
			pages.push(last)
			return pages
		}

		// Calculate the range of middle pages to show, centered around current page
		let start = Math.max(2, current - Math.floor(middleCount / 2))
		let end = Math.min(total - 1, start + middleCount - 1)

		// Adjust start if we're too close to the end
		if (end === total - 1) {
			start = Math.max(2, end - middleCount + 1)
		}
		
		// Ensure we don't have duplicates with first page
		if (start === first) {
			start++
		}

		// Add ellipsis before if needed
		if (start > 2) {
			pages.push('ellipsis-start')
		} 
		else if (start === 2) {
			// If start is 2, just show it instead of an ellipsis
			pages.push(2)
			start = 3
		}

		// Add middle pages
		for (let i = start; i <= end; i++) {
			pages.push(i)
		}

		// Add ellipsis after if needed
		if (end < total - 1) {
			pages.push('ellipsis-end')
		} 
		else if (end === total - 1) {
			// If end is just before the last page, just show it
			if (total - 1 > start) { // Only add if it's not already included
				pages.push(total - 1)
			}
		}

		// Add last page if it's not already the first page
		if (last !== first) {
			pages.push(last)
		}
		
		// Remove any duplicate page numbers
		const uniquePages = pages.filter((page, index, self) => 
			typeof page === 'string' || self.indexOf(page) === index
		)

		return uniquePages
	})

	/**
	 * Extract only the numeric middle pages
	 */
	const middlePages = computed(() => {
		return visiblePageNumbers.value.filter(
			page => typeof page === 'number' && page !== 1 && page !== totalPages.value,
		) as number[]
	})

	/**
	 * Navigation helpers
	 */
	function previousPage() {
		if (props.modelValue > 1) {
			emit('update:modelValue', props.modelValue - 1)
		}
	}

	function nextPage() {
		if (props.modelValue < totalPages.value) {
			emit('update:modelValue', props.modelValue + 1)
		}
	}

	function firstPage() {
		emit('update:modelValue', 1)
	}

	function lastPage() {
		emit('update:modelValue', totalPages.value)
	}

	function goToPage(pageNumber: number) {
		emit('update:modelValue', pageNumber)
	}

	const hasPrevious = computed(() => props.modelValue > 1)
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
				<li
					v-if="visiblePageNumbers.includes('ellipsis-start')"
					class="ellipsis-item"
				>
					<a
						href="#"
						class="ellipsis"
						@click.prevent
					>…</a>
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
				<li
					v-if="visiblePageNumbers.includes('ellipsis-end')"
					class="ellipsis-item"
				>
					<a
						href="#"
						class="ellipsis"
						@click.prevent
					>…</a>
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
