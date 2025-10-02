/* Get the active tab position and width for the transition indicator */

import { nextTick, onMounted, onUnmounted, ref, watch, type Ref } from 'vue'

export function useTabTransition(tablist: Ref<HTMLElement | null>, activeItemIndex: Ref<number>) {
	const xPosition = ref(0)
	const width = ref(0)

	async function positionIndicator() {
		await nextTick()

		const activeTab = tablist.value?.querySelector('.sy-tabs__button--active')

		if (!activeTab) {
			xPosition.value = 0
			width.value = 0
			return
		}

		const activeTabRect = activeTab.getBoundingClientRect()
		const containerRect = tablist.value!.getBoundingClientRect()

		xPosition.value = activeTabRect.left - containerRect.left
		width.value = activeTabRect.width
	}

	watch(activeItemIndex, positionIndicator)

	onMounted(async () => {
		window.addEventListener('resize', positionIndicator)
		positionIndicator()
	})

	onUnmounted(() => {
		window.removeEventListener('resize', positionIndicator)
	})

	return {
		xPosition,
		width,
	}
}
