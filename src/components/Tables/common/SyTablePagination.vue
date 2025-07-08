<script setup lang="ts">
	import { computed, ref, nextTick, watch, onMounted } from 'vue'
	import SySelect from '@/components/Customs/SySelect/SySelect.vue'
	import SyPagination from '@/components/Customs/SyPagination/SyPagination.vue'
	import { locales } from './locales'

	// Reference to the SySelect component
	const selectRef = ref<InstanceType<typeof SySelect> | null>(null)

	// Items per page options - standard options and current value
	const itemsPerPageOptions = computed(() => {
		const standardOptions = [5, 10, 25, 50, 100]

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
		page: number
		pageCount: number
		itemsPerPage: number
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

	/**
	 * Navigate to a specific page
	 * This function is used as a callback for the SyPagination component
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

	// Remove aria-describedby attribute after component is mounted
	onMounted(() => {
		// Use nextTick to ensure the DOM is fully rendered
		nextTick(() => {
			if (selectRef.value && selectRef.value.$el) {
				// Find the input element
				const inputElement = selectRef.value.$el.querySelector('input')
				if (inputElement) {
					// Remove the aria-describedby attribute
					inputElement.removeAttribute('aria-describedby')
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

		<SyPagination
			v-if="pageCount > 1"
			:modelValue="page"
			:max="pageCount"
			:visible="5"
			:label="locales.pagination.paginationNavAriaLabel"
			class="pagination"
			@update:modelValue="goToPage"
		>
			<template #previous>
				<span>{{ locales.pagination.previous }}</span>
			</template>
			<template #page-number="{ page }">
				{{ locales.pagination.pageText(page) }}
			</template>
			<template #next>
				<span>{{ locales.pagination.next }}</span>
			</template>
		</SyPagination>

		<div class="rows-per-page">
			<span class="rows-per-page-label">{{ locales.pagination.itemsPerPageText }}</span>
			<SySelect
				ref="selectRef"
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
}
</style>
