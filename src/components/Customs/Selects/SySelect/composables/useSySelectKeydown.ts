import { useSyComboboxListKeydown } from '../../common/combobox/useSyComboboxListKeydown'
import { useSyComboboxFieldKeydown } from '../../common/combobox/useSyComboboxFieldKeydown'

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
		useSyComboboxFieldKeydown({
			onEnter: () => {
				options.handleEnterKey()
			},
			onSpace: () => {
				options.handleSpaceKey()
			},
			onArrowDown: () => {
				options.handleDownKey()
			},
			onArrowUp: () => {
				options.handleUpKey()
			},
			onEscape: () => {
				options.handleEscapeKey()
			},
			onHome: () => {
				options.handleHomeKey()
			},
			onEnd: () => {
				options.handleEndKey()
			},
			onPageUp: () => {
				options.handlePageUpKey()
			},
			onPageDown: () => {
				options.handlePageDownKey()
			},
			onTab: () => {
				options.handleTabKey()
			},
			onCharacter: (_e, key) => {
				options.handleCharacterKey(key)
			},
			isPrintableCharacter,
		}).onFieldKeydown(event)
	}

	const onListKeydown = (event: KeyboardEvent) => {
		useSyComboboxListKeydown({
			onEscape: (e) => {
				options.closeList(e)
			},
			onTab: () => {
				options.handleTabKey()
			},
			onEnter: () => {
				options.handleEnterKey()
			},
			onArrowDown: () => {
				options.handleDownKey()
			},
			onArrowUp: () => {
				options.handleUpKey()
			},
			onHome: () => {
				options.handleHomeKey()
			},
			onEnd: () => {
				options.handleEndKey()
			},
			onPageUp: () => {
				options.handlePageUpKey()
			},
			onPageDown: () => {
				options.handlePageDownKey()
			},
		}).onListKeydown(event)
	}

	return {
		onFieldKeydown,
		onListKeydown,
	}
}
