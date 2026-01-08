export interface UseSySelectKeydownOptions {
	handleEnterKey: () => void
	handleSpaceKey: () => void
	handleDownKey: () => void
	handleUpKey: () => void
	handleEscapeKey: () => void
	handleHomeKey: () => void
	handleEndKey: () => void
	handlePageUpKey: () => void
	handlePageDownKey: () => void
	handleTabKey: () => void
	handleCharacterKey: (key: string) => void
	closeList: (event?: Event) => void
}

export function useSySelectKeydown(options: UseSySelectKeydownOptions) {
	const isPrintableCharacter = (event: KeyboardEvent) => {
		if (event.ctrlKey || event.altKey || event.metaKey) return false
		return event.key.length === 1 && /\S/.test(event.key)
	}

	const onFieldKeydown = (event: KeyboardEvent) => {
		switch (event.key) {
			case 'Enter':
				event.preventDefault()
				options.handleEnterKey()
				break
			case ' ': // Space
			case 'Spacebar':
				event.preventDefault()
				options.handleSpaceKey()
				break
			case 'ArrowDown':
				event.preventDefault()
				options.handleDownKey()
				break
			case 'ArrowUp':
				event.preventDefault()
				options.handleUpKey()
				break
			case 'Escape':
				event.preventDefault()
				options.handleEscapeKey()
				break
			case 'Home':
				event.preventDefault()
				options.handleHomeKey()
				break
			case 'End':
				event.preventDefault()
				options.handleEndKey()
				break
			case 'PageUp':
				event.preventDefault()
				options.handlePageUpKey()
				break
			case 'PageDown':
				event.preventDefault()
				options.handlePageDownKey()
				break
			case 'Tab':
				options.handleTabKey()
				break
			default:
				if (isPrintableCharacter(event)) {
					options.handleCharacterKey(event.key)
				}
				break
		}
	}

	const onListKeydown = (event: KeyboardEvent) => {
		switch (event.key) {
			case 'Escape':
				event.preventDefault()
				options.closeList(event)
				break
			case 'Tab':
				options.handleTabKey()
				break
			case 'Enter':
				event.preventDefault()
				options.handleEnterKey()
				break
			case 'ArrowDown':
				event.preventDefault()
				options.handleDownKey()
				break
			case 'ArrowUp':
				event.preventDefault()
				options.handleUpKey()
				break
			case 'Home':
				event.preventDefault()
				options.handleHomeKey()
				break
			case 'End':
				event.preventDefault()
				options.handleEndKey()
				break
			case 'PageUp':
				event.preventDefault()
				options.handlePageUpKey()
				break
			case 'PageDown':
				event.preventDefault()
				options.handlePageDownKey()
				break
			default:
				break
		}
	}

	return {
		onFieldKeydown,
		onListKeydown,
	}
}
