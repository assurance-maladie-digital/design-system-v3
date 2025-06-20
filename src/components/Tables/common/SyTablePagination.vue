<script setup lang="ts">
import { computed } from 'vue'
import type { DataOptions } from './types'

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
}>()

/**
 * Compute the range of items being displayed
 */
const itemsRange = computed(() => {
  const start = (props.page - 1) * props.itemsPerPage + 1
  const end = Math.min(props.page * props.itemsPerPage, props.itemsLength)
  return { start, end }
})

/**
 * Compute the accessible title for the pagination group
 */
const paginationTitle = computed(() => {
  return `Pagination – 1 à ${props.pageCount} pages`
})

/**
 * Compute the visible page numbers to display
 * Shows current page, previous and next 2 pages when available
 */
const visiblePageNumbers = computed(() => {
  const pages = []
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
 * Navigate to specific page
 */
function goToPage(page: number) {
  if (page >= 1 && page <= props.pageCount) {
    emit('update:page', page)
  }
}
</script>

<template>
  <div 
    v-if="pageCount > 1" 
    class="sy-table-pagination"
    role="group"
    :aria-label="paginationTitle"
  >
    <div class="sy-table-pagination__info">
      {{ itemsRange.start }}-{{ itemsRange.end }} sur {{ itemsLength }} éléments
    </div>
    
    <div class="sy-table-pagination__controls">
      <!-- Previous page button -->
      <v-btn
        variant="text"
        icon="mdi-chevron-left"
        :disabled="page <= 1"
        @click="previousPage"
        aria-label="Page précédente"
      />
      
      <!-- Page numbers -->
      <template v-for="(pageItem, index) in visiblePageNumbers" :key="index">
        <v-btn
          v-if="pageItem !== 'ellipsis-start' && pageItem !== 'ellipsis-end'"
          size="small"
          :variant="pageItem === page ? 'flat' : 'text'"
          :color="pageItem === page ? 'primary' : undefined"
          class="mx-1"
          @click="goToPage(pageItem as number)"
          :aria-current="pageItem === page ? 'page' : undefined"
        >
          {{ pageItem }}
        </v-btn>
        <span v-else class="mx-1">...</span>
      </template>
      
      <!-- Next page button -->
      <v-btn
        variant="text"
        icon="mdi-chevron-right"
        :disabled="page >= pageCount"
        @click="nextPage"
        aria-label="Page suivante"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sy-table-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  
  &__info {
    font-size: 0.875rem;
    color: rgba(0, 0, 0, 0.6);
  }
  
  &__controls {
    display: flex;
    align-items: center;
  }
}
</style>
