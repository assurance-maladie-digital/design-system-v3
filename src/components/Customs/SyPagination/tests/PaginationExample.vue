<script setup lang="ts">
import { ref, computed } from 'vue'
import SyPagination from '../SyPagination.vue'

// Exemple de données
const items = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  title: `Élément ${i + 1}`,
}))

const currentPage = ref(1)
const itemsPerPage = 10
const totalItems = items.length
const totalPages = computed(() => Math.ceil(totalItems / itemsPerPage))

// Calcul des éléments à afficher sur la page courante
const displayedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return items.slice(start, end)
})

// Informations pour l'affichage du texte d'information
const startItem = computed(() => (currentPage.value - 1) * itemsPerPage + 1)
const endItem = computed(() => Math.min(currentPage.value * itemsPerPage, totalItems))
</script>

<template>
  <div class="example-container">
    <h2>Exemple d'utilisation de SyPagination</h2>

    <div
        id="paginatedContent"
        class="content-area"
    >
      <div
          v-for="item in displayedItems"
          :key="item.id"
          class="content-item"
      >
        {{ item.title }}
      </div>
    </div>

    <!-- Basic usage -->
    <SyPagination
        v-model="currentPage"
        :pages="totalPages"
        :visible="5"
        aria-controls="paginatedContent"
    />

    <h3>Exemples avec slots personnalisés</h3>

    <!-- Advanced usage with slots -->
    <SyPagination
        v-model="currentPage"
        :pages="totalPages"
        :visible="4"
        label="Fiches"
        class="custom-pagination"
        aria-controls="paginatedContent"
    >
      <template #first-page>
        <span>⏮️</span>
      </template>
      <template #previous>
        <span>◀️</span>
      </template>
      <template #next>
        <span>▶️</span>
      </template>
      <template #last-page>
        <span>⏭️</span>
      </template>
      <template #prepend>
        <div class="info-text">
          Fiches {{ startItem }}-{{ endItem }} sur {{ totalItems }}
        </div>
      </template>
    </SyPagination>
  </div>
</template>

<style scoped>
.example-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.content-area {
  margin: 20px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
}

.content-item {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.content-item:last-child {
  border-bottom: none;
}

.custom-pagination {
  flex-direction: column;
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.info-text {
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.6);
}
</style>
