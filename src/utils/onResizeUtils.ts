import { reactive, ref } from 'vue'
import type { App } from 'vue'
import { useResizeObserver } from '@vueuse/core'

export const breakpoints = reactive({
  gridColumns: 1
})

const calculateColumns = (width: number) => {
  const container = document.querySelector('.page-container') as HTMLElement
  if (width >= 1200) {
    if(!container) {
      return
    }
    container.style.display = 'grid'
    container.style.gridTemplateColumns = 'repeat(12, 1fr)'
    container.style.gap = '24px'
    container.style.paddingTop = '40px'
    container.style.paddingBottom = '40px'
    container.style.paddingLeft = '56px'
    container.style.paddingRight = '56px'
  } else {
    if(!container) {
      return
    }
    container.style.display = 'grid'
    container.style.gridTemplateColumns = 'repeat(1, 6fr)'
    container.style.gap = '24px'
    container.style.paddingTop = '40px'
    container.style.paddingBottom = '40px'
    container.style.paddingLeft = '24px'
    container.style.paddingRight = '24px'
  }
}

export default {
  install(app: App) {
    const targetElement = ref<HTMLElement | null>(null)

    useResizeObserver(targetElement, (entries) => {
      const entry = entries[0]
      const width = entry.contentRect.width
      calculateColumns(width)
    })

    app.mixin({
      mounted() {
        targetElement.value = document.body
        calculateColumns(targetElement.value.clientWidth)
      }
    })

    app.provide('breakpoints', breakpoints)
  }
}
