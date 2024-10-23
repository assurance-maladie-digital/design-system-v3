import { onMounted, onUnmounted, ref } from 'vue'

export default function useScrollDirection() {
	const lastYPos = ref<number | null>(null)
	const scrollDirection = ref<'' | 'top' | 'bottom'>('')

	function handleScroll() {
		const yPos = document.documentElement.scrollTop
		if (lastYPos.value === null) {
			lastYPos.value = yPos
			return ''
		}
		scrollDirection.value = yPos >= lastYPos.value ? 'bottom' : 'top'
		lastYPos.value = yPos
	}

	onMounted(() => {
		window.addEventListener('scroll', handleScroll)
	})

	onUnmounted(() => {
		window.removeEventListener('scroll', handleScroll)
	})

	return { scrollDirection }
}
