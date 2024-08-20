<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useResizeObserver } from '@vueuse/core'

const state = reactive({
    screenWidth: 0,
    gridColumns: 1
})

const calculateColumns = (width: number) => {
    state.screenWidth = width
    if (width >= 1200) {
        state.gridColumns = 12
    } else if (width >= 900) {
        state.gridColumns = 3
    } else if (width >= 600) {
        state.gridColumns = 2
    } else {
        state.gridColumns = 1
    }
}

const targetElement = ref<HTMLElement | null>(null)

useResizeObserver(targetElement, (entries) => {
    const entry = entries[0]
    const width = entry.contentRect.width
    // calculateColumns(width)
})

onMounted(() => {
    targetElement.value = document.body
    // calculateColumns(targetElement.value.clientWidth)
})
</script>

<template>
<v-container>
<v-col>
<div class="bg-blue-accent-4 top-0 text-center">Menu</div>
    <div class="page-container">
    <v-col v-for="n in 12" :key="n" class="bg-amber-darken-4" :style="{ width: '100%', height:'496px' }">
    </v-col>
    </div>
    <div class="bg-blue-accent-4 top-0 text-center">Footer</div>
    </v-col>
    </v-container>
    </template>