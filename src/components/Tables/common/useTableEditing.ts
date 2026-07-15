import { computed, ref, shallowRef, toValue, type ComputedRef, type MaybeRefOrGetter, type Ref } from 'vue'
import type { DataTableHeaders, Item } from './types'

/**
 * Indique si une valeur peut être éditée par l'éditeur texte par défaut
 * (`SyTextField`). Les valeurs **non primitives** (objet, tableau, `Date`…) ne
 * peuvent pas l'être proprement : le projet doit fournir un slot
 * `#edit.<colonne>` avec un éditeur adapté (SySelect, DatePicker…).
 */
export function isEditableAsText(value: unknown): boolean {
	return value === null
		|| value === undefined
		|| typeof value === 'string'
		|| typeof value === 'number'
		|| typeof value === 'boolean'
}

interface UseTableEditingParams {
	/**
	 * Fonction d'identité de ligne (réutilise celle de la sélection :
	 * selectionKey, puis `id`, puis l'objet lui-même).
	 */
	getItemValue: (item: Item) => unknown
	/** En-têtes de colonnes, pour déterminer les colonnes éditables (flag `editable`). */
	headers?: MaybeRefOrGetter<DataTableHeaders[] | undefined>
	/** Active l'édition inline des lignes (prop `editable` du tableau). */
	editable?: MaybeRefOrGetter<boolean>
	/** Indique si un slot `#edit.<colonne>` est fourni par le projet pour une colonne. */
	hasEditSlot?: (colKey: string) => boolean
}

interface UseTableEditingReturn {
	/** Clé de la ligne en cours d'édition (`null` si aucune). */
	editingKey: Ref<unknown>
	/** Brouillon de la ligne éditée (copie, la prop `items` n'est jamais mutée). */
	draft: Ref<Item>
	/** Indique si l'item passé est la ligne actuellement éditée. */
	isRowEditing: (item: Item) => boolean
	/** Démarre l'édition d'une ligne (une seule à la fois en V1). */
	startEditing: (item: Item) => void
	/** Met à jour un champ du brouillon. */
	setDraftField: (key: string, value: unknown) => void
	/**
	 * Restaure le type primitif d'origine d'une colonne (`number`/`boolean`) pour une
	 * valeur **émise par l'éditeur texte par défaut** (`SyTextField`, qui émet toujours
	 * une `string`), afin de ne pas transformer silencieusement un nombre ou un booléen
	 * en chaîne. Les slots `#edit.<colonne>` fournissent déjà une valeur typée et ne
	 * passent pas par cette fonction.
	 */
	restoreFieldType: (key: string, value: unknown) => unknown
	/** Valide l'édition et renvoie l'item modifié + l'original. */
	saveEditing: () => { updated: Item, original: Item | null }
	/** Annule l'édition et renvoie l'item original. */
	cancelEditing: () => Item | null
	/** Réinitialise l'état d'édition. */
	resetEditing: () => void
	/** Clés des colonnes portant le flag `editable` (indépendamment de la prop `editable`). */
	editableHeaderColumns: ComputedRef<string[]>
	/** Colonnes éditables en inline (uniquement si le tableau est `editable`). */
	editableColumns: ComputedRef<string[]>
}

/**
 * Moteur d'édition inline d'une ligne pour les tableaux du DS.
 *
 * Ne mute jamais les données d'origine : il travaille sur un brouillon et
 * renvoie l'item modifié au composant, à charge pour l'application parente
 * de persister via l'évènement `@save`.
 *
 * L'éditeur par défaut (`SyTextField`) ne gère que les valeurs primitives. Pour
 * une colonne dont la valeur est un objet/tableau/`Date`, le projet **doit**
 * fournir un slot `#edit.<colonne>` (un avertissement est émis en développement
 * dans le cas contraire).
 */
export function useTableEditing({ getItemValue, headers, editable, hasEditSlot }: UseTableEditingParams): UseTableEditingReturn {
	// `shallowRef` : on conserve la valeur brute (clé d'identité et item original)
	// sans la transformer en proxy réactif, sinon les comparaisons par référence
	// (`===`) échoueraient pour une identité de ligne basée sur l'objet lui-même.
	const editingKey = shallowRef<unknown>(null)
	const draft = ref<Item>({})
	const originalItem = shallowRef<Item | null>(null)

	// Colonnes portant le flag `editable` (indépendamment de la prop `editable`)
	const editableHeaderColumns = computed<string[]>(() =>
		(toValue(headers) ?? [])
			.filter(header => header.editable && (header.key ?? header.value))
			.map(header => String(header.key ?? header.value)),
	)

	// Colonnes éditables en inline (uniquement si le tableau est `editable`)
	const editableColumns = computed<string[]>(() =>
		toValue(editable) ? editableHeaderColumns.value : [],
	)

	// Colonnes déjà signalées (évite de spammer la console à chaque édition)
	const warnedColumns = new Set<string>()

	function warnNonPrimitiveColumns(item: Item): void {
		for (const colKey of editableColumns.value) {
			if (warnedColumns.has(colKey)) continue
			if (!isEditableAsText(item[colKey]) && !(hasEditSlot?.(colKey) ?? false)) {
				warnedColumns.add(colKey)
				console.warn(
					`[SyTable] La colonne « ${colKey} » a une valeur non primitive : l'éditeur par défaut ne peut pas l'éditer. Fournissez un slot #edit.${colKey} avec un éditeur adapté (SySelect, DatePicker…).`,
				)
			}
		}
	}

	function isRowEditing(item: Item): boolean {
		return editingKey.value !== null && getItemValue(item) === editingKey.value
	}

	function startEditing(item: Item): void {
		editingKey.value = getItemValue(item)
		originalItem.value = item
		draft.value = { ...item }
		if (import.meta.env.DEV) {
			warnNonPrimitiveColumns(item)
		}
	}

	function setDraftField(key: string, value: unknown): void {
		draft.value[key] = value
	}

	function restoreFieldType(key: string, value: unknown): unknown {
		// L'éditeur par défaut (SyTextField) émet toujours une chaîne : on ne
		// touche qu'à ce cas. Les slots #edit fournissent déjà une valeur typée.
		if (typeof value !== 'string') return value

		const originalValue = originalItem.value?.[key]

		if (typeof originalValue === 'number') {
			const trimmed = value.trim()
			// Champ vidé → null (plutôt qu'un NaN silencieux)
			if (trimmed === '') return null
			const parsed = Number(trimmed)
			// Saisie non numérique : on conserve la chaîne pour ne pas bloquer la
			// saisie en cours ; la validation applicative reste à la charge du projet.
			return Number.isNaN(parsed) ? value : parsed
		}

		if (typeof originalValue === 'boolean') {
			const normalized = value.trim().toLowerCase()
			if (normalized === 'true') return true
			if (normalized === 'false') return false
			return value
		}

		return value
	}

	// Sort du mode édition immédiatement ; `original` est renvoyé pour permettre
	// au parent un retour arrière si son enregistrement asynchrone échoue.
	function saveEditing(): { updated: Item, original: Item | null } {
		const original = originalItem.value
		const updated = { ...(original ?? {}), ...draft.value }
		resetEditing()
		return { updated, original }
	}

	function cancelEditing(): Item | null {
		const original = originalItem.value
		resetEditing()
		return original
	}

	function resetEditing(): void {
		editingKey.value = null
		draft.value = {}
		originalItem.value = null
	}

	return {
		editingKey,
		draft,
		isRowEditing,
		startEditing,
		setDraftField,
		restoreFieldType,
		saveEditing,
		cancelEditing,
		resetEditing,
		editableHeaderColumns,
		editableColumns,
	}
}
