import { ref, nextTick } from 'vue'

export function useMobileRightMenu() {
	// State and refs for mobile right menu
	const mobileMenuOpen = ref(false)
	const mobileBurgerButtonRef = ref<HTMLElement | null>(null)
	const mobileRightMenuRef = ref<HTMLElement | null>(null)

	// ARIA tracking
	const mobileActiveIndex = ref<number | null>(null)
	const mobileActiveDescendantId = ref<string | null>(null)

	const handleMobileMenuKeydown = (event: KeyboardEvent) => {
		const container = (mobileRightMenuRef.value as unknown as { $el?: HTMLElement } | null)?.$el || null
		const items = container ? (Array.from(container.querySelectorAll('[role="menuitem"]')) as HTMLElement[]) : []
		if (items.length === 0) return

		const currentIdx = mobileActiveDescendantId.value
			? items.findIndex(el => el.id === mobileActiveDescendantId.value!)
			: -1

		let newIndex = currentIdx
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault()
				newIndex = currentIdx < items.length - 1 ? currentIdx + 1 : 0
				break
			case 'ArrowUp':
				event.preventDefault()
				newIndex = currentIdx > 0 ? currentIdx - 1 : items.length - 1
				break
			case 'Home':
				event.preventDefault()
				newIndex = 0
				break
			case 'End':
				event.preventDefault()
				newIndex = items.length - 1
				break
			case 'Escape': {
				event.preventDefault()
				mobileMenuOpen.value = false
				nextTick(() => mobileBurgerButtonRef.value?.focus())
				return
			}
			case 'Enter':
			case ' ': {
				event.preventDefault()
				const idx = currentIdx >= 0 ? currentIdx : 0
				items[idx]?.click()
				return
			}
			default:
				return
		}

		if (newIndex !== currentIdx && newIndex >= 0) {
			mobileActiveIndex.value = newIndex
			mobileActiveDescendantId.value = items[newIndex].id
			items[newIndex].focus()
		}
	}

	const onMobileMenuModel = (val: boolean) => {
		if (val) {
			// Mark first item as active so the highlight class applies immediately
			mobileActiveIndex.value = 0
			mobileActiveDescendantId.value = 'mobile-item-0'
			nextTick(() => {
				let attempts = 0
				const tryFocus = () => {
					const el = document.getElementById('mobile-item-0') as HTMLElement | null
					const inner = el?.querySelector('a,button,[tabindex]:not([tabindex="-1"])') as HTMLElement | null
					const target = (inner ?? el) as HTMLElement | null
					if (target) {
						target.focus()
						return
					}
					if (++attempts < 10) requestAnimationFrame(tryFocus)
				}
				setTimeout(() => requestAnimationFrame(tryFocus), 200)
			})
		}
		else {
			nextTick(() => {
				mobileBurgerButtonRef.value?.focus()
			})
		}
	}

	const openMobileMenuAndFocus = () => {
		mobileMenuOpen.value = true
		mobileActiveIndex.value = 0
		mobileActiveDescendantId.value = 'mobile-item-0'
		nextTick(() => {
			let attempts = 0
			const tryFocus = () => {
				const el = document.getElementById('mobile-item-0') as HTMLElement | null
				const inner = el?.querySelector('a,button,[tabindex]:not([tabindex="-1"])') as HTMLElement | null
				const target = (inner ?? el) as HTMLElement | null
				if (target) {
					target.focus()
					return
				}
				if (++attempts < 10) requestAnimationFrame(tryFocus)
			}
			setTimeout(() => requestAnimationFrame(tryFocus), 150)
		})
	}

	return {
		mobileMenuOpen,
		mobileBurgerButtonRef,
		mobileRightMenuRef,
		mobileActiveIndex,
		mobileActiveDescendantId,
		handleMobileMenuKeydown,
		onMobileMenuModel,
		openMobileMenuAndFocus,
	}
}
