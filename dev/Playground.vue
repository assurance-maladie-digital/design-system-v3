<template>
    <div class="pa-4">
      <h3>Vuetify Data Table with Checkbox Selection</h3>
      <v-data-table
        v-model="selected"
        :items="items"
        item-value="name"
        show-select
      ></v-data-table>
      <div v-if="selected.length" class="mt-4 pa-4 bg-grey-lighten-4">
        <strong>Selected items:</strong> {{ selected.length }}
        <pre>{{ JSON.stringify(selected, null, 2) }}</pre>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  const selected = ref([])
  
  const items = [
    {
      name: 'Frozen Yogurt',
      calories: 159,
      fat: 6.0,
      carbs: 24,
      protein: 4.0,
    },
    {
      name: 'Ice cream sandwich',
      calories: 237,
      fat: 9.0,
      carbs: 37,
      protein: 4.3,
    },
    {
      name: 'Eclair',
      calories: 262,
      fat: 16.0,
      carbs: 23,
      protein: 6.0,
    },
    {
      name: 'Cupcake',
      calories: 305,
      fat: 3.7,
      carbs: 67,
      protein: 4.3,
    },
    {
      name: 'Gingerbread',
      calories: 356,
      fat: 16.0,
      carbs: 49,
      protein: 3.9,
    },
  ]
  </script>
  