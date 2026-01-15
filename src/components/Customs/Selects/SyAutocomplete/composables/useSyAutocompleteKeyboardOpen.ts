import { ref, nextTick, watch, type ComputedRef, type Ref } from 'vue'

export interface UseSyAutocompleteKeyboardOpenOptions {
	isOpen: Ref<boolean>
	activeDescendantId: Ref<string>
	optionIdPrefix: ComputedRef<string>
	formattedItemsLength: ComputedRef<number>
	pendingFocusIndex: Ref<number | null>

	openMenu: (skipInitialFocus?: boolean) => void
	clearActiveDescendant: () => void
	setActiveDescendant: (index: number) => void

	handleDownKey: () => void
	handleUpKey: () => void
	ensureFirstOptionFocused: () => void
}

export function useSyAutocompleteKeyboardOpen(options: UseSyAutocompleteKeyboardOpenOptions) {
	const isOpeningWithArrow = ref(false)
	const forceFirstOption = ref(false)

	const handleInputDownKey = () => {
		if (!options.isOpen.value) {
			isOpeningWithArrow.value = true
			forceFirstOption.value = true
			options.clearActiveDescendant()
			options.openMenu(true)
			nextTick(() => {
				options.ensureFirstOptionFocused()
				requestAnimationFrame(() => {
					options.ensureFirstOptionFocused()
					setTimeout(() => {
						options.ensureFirstOptionFocused()
					}, 0)
				})
				isOpeningWithArrow.value = false
				setTimeout(() => {
					forceFirstOption.value = false
				}, 150)
			})
			return
		}
		if (isOpeningWithArrow.value) return

		// Comportement type Vuetify : après saisie/filtrage, l'option active peut être vidée.
		// Le prochain ArrowDown doit alors activer la première option (filtrée).
		if (!options.activeDescendantId.value) {
			if (options.formattedItemsLength.value > 0) {
				options.setActiveDescendant(0)
			}
			else {
				options.pendingFocusIndex.value = 0
			}
			return
		}
		options.handleDownKey()
	}

	const handleInputUpKey = () => {
		if (!options.isOpen.value) {
			isOpeningWithArrow.value = true
			forceFirstOption.value = true
			options.clearActiveDescendant()
			options.openMenu(true)
			nextTick(() => {
				options.ensureFirstOptionFocused()
				requestAnimationFrame(() => {
					options.ensureFirstOptionFocused()
					setTimeout(() => {
						options.ensureFirstOptionFocused()
					}, 0)
				})
				isOpeningWithArrow.value = false
				setTimeout(() => {
					forceFirstOption.value = false
				}, 150)
			})
			return
		}
		if (isOpeningWithArrow.value) return
		options.handleUpKey()
	}

	const handleListDownKey = () => {
		if (!options.isOpen.value) {
			options.clearActiveDescendant()
			options.openMenu(true)
			nextTick(() => {
				options.setActiveDescendant(0)
			})
			return
		}
		options.handleDownKey()
	}

	const handleListUpKey = () => {
		if (!options.isOpen.value) {
			options.clearActiveDescendant()
			options.openMenu(true)
			nextTick(() => {
				options.setActiveDescendant(0)
			})
			return
		}
		options.handleUpKey()
	}

	watch(
		() => options.formattedItemsLength.value,
		(newLength) => {
			if (!options.isOpen.value) return
			if (options.pendingFocusIndex.value == null) return
			if (newLength <= 0) return
			options.setActiveDescendant(Math.min(options.pendingFocusIndex.value, newLength - 1))
			options.pendingFocusIndex.value = null
		},
	)

	watch(options.activeDescendantId, (newValue) => {
		// Si le menu a été ouvert via ArrowDown/ArrowUp, on force temporairement la première option active.
		if (forceFirstOption.value && options.isOpen.value) {
			const expectedId = `${options.optionIdPrefix.value}option-0`
			if (newValue && newValue !== expectedId) {
				options.setActiveDescendant(0)
			}
		}
	})

	return {
		handleInputDownKey,
		handleInputUpKey,
		handleListDownKey,
		handleListUpKey,
	}
}
