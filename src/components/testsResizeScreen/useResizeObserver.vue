<template>
  <p class="mb-2">
    Resize the box to see changes
  </p>
  <textarea ref="el" class="resizer" disabled v-text="text" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useResizeObserver } from '@vueuse/core'

const el = ref(null)
const text = ref('')

useResizeObserver(el, (entries) => {
  const [entry] = entries
  const { width, height } = entry.contentRect
  text.value = `width: ${width}\nheight: ${height}`
})
</script>

<style scoped>
.resizer {
  resize: both;
  overflow: auto;
}
</style>