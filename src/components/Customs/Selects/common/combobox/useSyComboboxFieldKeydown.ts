type UseSyComboboxFieldKeydownOptions = {
	onEnter?: (event: KeyboardEvent) => void
	onSpace?: (event: KeyboardEvent) => void
	onArrowDown?: (event: KeyboardEvent) => void
	onArrowUp?: (event: KeyboardEvent) => void
	onEscape?: (event: KeyboardEvent) => void
	onHome?: (event: KeyboardEvent) => void
	onEnd?: (event: KeyboardEvent) => void
	onPageUp?: (event: KeyboardEvent) => void
	onPageDown?: (event: KeyboardEvent) => void
	onTab?: (event: KeyboardEvent) => void
	onCharacter?: (event: KeyboardEvent, key: string) => void
	isPrintableCharacter?: (event: KeyboardEvent) => boolean
}

export function useSyComboboxFieldKeydown(options: UseSyComboboxFieldKeydownOptions) {
	const isPrintableCharacter = (event: KeyboardEvent) => {
		if (options.isPrintableCharacter) return options.isPrintableCharacter(event)
		if (event.ctrlKey || event.altKey || event.metaKey) return false
		return event.key.length === 1 && /\S/.test(event.key)
	}

	const onFieldKeydown = (event: KeyboardEvent) => {
		switch (event.key) {
			case 'Enter':
				if (!options.onEnter) break
				event.preventDefault()
				options.onEnter(event)
				break
			case ' ': // Space
			case 'Spacebar':
				if (!options.onSpace) break
				event.preventDefault()
				options.onSpace(event)
				break
			case 'ArrowDown':
				if (!options.onArrowDown) break
				event.preventDefault()
				options.onArrowDown(event)
				break
			case 'ArrowUp':
				if (!options.onArrowUp) break
				event.preventDefault()
				options.onArrowUp(event)
				break
			case 'Escape':
				if (!options.onEscape) break
				event.preventDefault()
				options.onEscape(event)
				break
			case 'Home':
				if (!options.onHome) break
				event.preventDefault()
				options.onHome(event)
				break
			case 'End':
				if (!options.onEnd) break
				event.preventDefault()
				options.onEnd(event)
				break
			case 'PageUp':
				if (!options.onPageUp) break
				event.preventDefault()
				options.onPageUp(event)
				break
			case 'PageDown':
				if (!options.onPageDown) break
				event.preventDefault()
				options.onPageDown(event)
				break
			case 'Tab':
				options.onTab?.(event)
				break
			default:
				if (options.onCharacter && isPrintableCharacter(event)) {
					options.onCharacter(event, event.key)
				}
				break
		}
	}

	return {
		onFieldKeydown,
	}
}
