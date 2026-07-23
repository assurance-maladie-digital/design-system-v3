import { computed, ref, watch, type Ref } from 'vue'

/**
 * État des cases à cocher enfants (une valeur booléenne par enfant).
 */
export type CheckboxGroupState = boolean[]

/**
 * Construit une combinaison partielle par défaut pour `count` enfants
 * (le premier enfant coché, les autres décochés).
 */
function buildDefaultPartialState(count: number): CheckboxGroupState {
	return Array.from({ length: count }, (_, index) => index === 0)
}

/**
 * Résout l'état initial des enfants en respectant la combinaison fournie
 * (tout coché, tout décoché ou partielle). Un nombre construit une combinaison
 * partielle par défaut. Un groupe compte toujours au moins deux enfants.
 */
function resolveInitialChildState(input: CheckboxGroupState | number): CheckboxGroupState {
	if (typeof input === 'number') {
		return buildDefaultPartialState(Math.max(2, input))
	}
	return input.length >= 2 ? [...input] : buildDefaultPartialState(2)
}

/**
 * Gère un groupe parent/enfants tri-état pour un nombre quelconque de cases à cocher.
 *
 * Règles :
 * - une action individuelle sur un enfant recalcule l'état du parent ;
 * - lorsque les enfants sont tous cochés ou tous décochés individuellement, la
 *   combinaison partielle mémorisée est oubliée (le parent ne boucle plus que sur deux états) ;
 * - une activation du parent coche ou décoche tous les enfants sans oublier la combinaison
 *   partielle mémorisée ;
 * - un retour à l'état indéterminé restaure la dernière combinaison partielle mémorisée.
 *
 * @param initialState État initial des enfants (tout coché, tout décoché ou partiel),
 *   OU nombre d'enfants (>= 2) démarrant sur une combinaison partielle par défaut.
 */
export function useTriStateCheckboxGroup(
	initialState: CheckboxGroupState | number = [true, false, false],
) {
	const initialChildState = resolveInitialChildState(initialState)

	const parentChecked = ref(false)
	const parentIndeterminate = ref(false)
	const lastMixedState = ref<CheckboxGroupState | null>(null)
	const canCycleIndeterminate = computed(() => lastMixedState.value !== null)

	const childrenChecked: Ref<boolean>[] = initialChildState.map(value => ref(value))

	let isApplyingChildState = false

	const getChildState = (): CheckboxGroupState => childrenChecked.map(child => child.value)

	function setChildren(state: CheckboxGroupState) {
		isApplyingChildState = true
		childrenChecked.forEach((child, index) => {
			child.value = state[index] ?? false
		})
		isApplyingChildState = false
	}

	// Action individuelle sur un enfant : l'état du parent est dérivé des enfants.
	function recomputeParentFromChildren() {
		const childState = getChildState()
		const checkedCount = childState.filter(Boolean).length

		if (checkedCount === 0) {
			lastMixedState.value = null
			parentChecked.value = false
			parentIndeterminate.value = false
		}
		else if (checkedCount === childState.length) {
			lastMixedState.value = null
			parentChecked.value = true
			parentIndeterminate.value = false
		}
		else {
			lastMixedState.value = [...childState]
			parentChecked.value = false
			parentIndeterminate.value = true
		}
	}

	// L'état initial du parent est dérivé de l'état des enfants fourni.
	recomputeParentFromChildren()

	childrenChecked.forEach(child => watch(child, () => {
		if (!isApplyingChildState) {
			recomputeParentFromChildren()
		}
	}, { flush: 'sync' }))

	// Le parent coche/décoche tous les enfants sans oublier la combinaison partielle mémorisée.
	function handleParentModelUpdate(value: boolean) {
		setChildren(childrenChecked.map(() => value))
		parentChecked.value = value
		parentIndeterminate.value = false
	}

	// Le parent revient à l'état indéterminé : on restaure la dernière combinaison partielle.
	function handleParentIndeterminateUpdate(isIndeterminate: boolean) {
		if (isIndeterminate && lastMixedState.value !== null) {
			setChildren(lastMixedState.value)
			parentChecked.value = false
			parentIndeterminate.value = true
		}
		else {
			parentIndeterminate.value = false
		}
	}

	return {
		parentChecked,
		parentIndeterminate,
		canCycleIndeterminate,
		childrenChecked,
		handleParentModelUpdate,
		handleParentIndeterminateUpdate,
	}
}
