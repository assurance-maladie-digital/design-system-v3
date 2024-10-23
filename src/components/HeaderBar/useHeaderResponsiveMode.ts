import { ref, onMounted, onUnmounted } from 'vue'
import { headerBreakpoint } from './consts'

export default function useIsDesktop() {
	const isDesktop = ref(false)

	let mediaQuery: MediaQueryList

	function handleChange(e: MediaQueryListEvent) {
		isDesktop.value = e.matches
	}

	onMounted(() => {
		mediaQuery = window.matchMedia(`(min-width: ${headerBreakpoint}px)`)
		isDesktop.value = mediaQuery.matches

		mediaQuery.addEventListener('change', handleChange)
	})

	onUnmounted(() => {
		mediaQuery.removeEventListener('change', handleChange)
	})

	return { isDesktop }
}
