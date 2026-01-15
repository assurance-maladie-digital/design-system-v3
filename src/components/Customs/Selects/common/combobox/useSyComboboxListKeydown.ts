type UseSyComboboxListKeydownOptions = {
	onEscape: (event: KeyboardEvent) => void
	onTab: (event: KeyboardEvent) => void
	onEnter: (event: KeyboardEvent) => void
	onArrowDown: (event: KeyboardEvent) => void
	onArrowUp: (event: KeyboardEvent) => void
	onHome: (event: KeyboardEvent) => void
	onEnd: (event: KeyboardEvent) => void
	onPageUp: (event: KeyboardEvent) => void
	onPageDown: (event: KeyboardEvent) => void
}

export function useSyComboboxListKeydown(options: UseSyComboboxListKeydownOptions) {
	const onListKeydown = (event: KeyboardEvent) => {
		switch (event.key) {
			case 'Escape':
				event.preventDefault()
				options.onEscape(event)
				break
			case 'Tab':
				options.onTab(event)
				break
			case 'Enter':
				event.preventDefault()
				options.onEnter(event)
				break
			case 'ArrowDown':
				event.preventDefault()
				options.onArrowDown(event)
				break
			case 'ArrowUp':
				event.preventDefault()
				options.onArrowUp(event)
				break
			case 'Home':
				event.preventDefault()
				options.onHome(event)
				break
			case 'End':
				event.preventDefault()
				options.onEnd(event)
				break
			case 'PageUp':
				event.preventDefault()
				options.onPageUp(event)
				break
			case 'PageDown':
				event.preventDefault()
				options.onPageDown(event)
				break
			default:
				break
		}
	}

	return {
		onListKeydown,
	}
}
