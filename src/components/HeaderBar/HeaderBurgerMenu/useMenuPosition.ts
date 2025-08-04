import { computed, onMounted, onUnmounted, ref, watch, type CSSProperties, type Ref } from 'vue'
import throttleDisplayFn from '@/utils/functions/throttleDisplayFn/throttleDisplayFn'
import useHeaderResponsiveMode from '../useHeaderResponsiveMode'

export default function useMenuPosition(menuBtnWrapper: Ref<HTMLElement | null>, menuOpen: Ref<boolean>) {
	const menuLeft = ref(0)
	const menuTop = ref(0)
	const menuHeight = ref('70vh')

	function positionMenu() {
		const rect = menuBtnWrapper.value!.getBoundingClientRect()
		menuLeft.value = rect.left
		menuTop.value = rect.top
		menuHeight.value = `calc(100vh - ${rect.top}px - 48px)`
	}
	const throttledPositionMenu = throttleDisplayFn(positionMenu, 16)
	const optimizedPositionMenu = () => {
		if (menuOpen.value) {
			throttledPositionMenu()
		}
	}

	onMounted(() => {
		positionMenu()
		window.addEventListener('scroll', optimizedPositionMenu)
		window.addEventListener('resize', optimizedPositionMenu)
	})

	onUnmounted(() => {
		window.removeEventListener('scroll', optimizedPositionMenu)
		window.removeEventListener('resize', optimizedPositionMenu)
	})

	const { isDesktop } = useHeaderResponsiveMode()
	const menuStyle = computed<CSSProperties>(() => ({
		left: `${menuLeft.value}px`,
		top: `${menuTop.value}px`,
		height: isDesktop.value ? menuHeight.value : undefined,
	}))

	watch(menuOpen, (newOpenStatus) => {
		if (newOpenStatus) {
			positionMenu() // the menu position can have changed since the component was mounted
		}
	})

	return {
		menuStyle,
	}
}
