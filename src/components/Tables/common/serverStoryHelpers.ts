import { ref, watch, type Ref } from 'vue'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { StateEnum } from './constants/StateEnum'
import type { DataOptions, FilterOption } from './types'

dayjs.extend(customParseFormat)

export type ServerRow = Record<string, unknown>

/**
 * Simule un chargement serveur initial pour les stories qui gèrent des items
 * **mutables localement** (édition inline, actions groupées) : `state` passe de
 * `PENDING` à `RESOLVED` après un court délai et les items apparaissent, comme sur
 * les autres stories serveur (`:loading="state === StateEnum.PENDING"`). Le `ref`
 * d'items retourné reste modifiable par la story (save/delete).
 */
export function useServerEditingDemo<T>(
	initialItems: T[],
	delay = 800,
): { items: Ref<T[]>, state: Ref<StateEnum>, StateEnum: typeof StateEnum } {
	const items = ref<T[]>([]) as Ref<T[]>
	const state = ref<StateEnum>(StateEnum.PENDING)

	setTimeout(() => {
		items.value = [...initialItems]
		state.value = StateEnum.RESOLVED
	}, delay)

	return { items, state, StateEnum }
}

/**
 * Prédicat de filtrage d'une ligne pour un filtre donné : retourne `true` si la
 * ligne doit être conservée. {@link useServerTableDemo} utilise
 * {@link defaultFilterMatch} par défaut, mais une story peut fournir sa propre
 * implémentation via le paramètre `customFilter`.
 */
export type FilterMatcher = (row: ServerRow, filter: FilterOption) => boolean

interface ServerTableDemo {
	/** Lignes de la page courante (résultat du « fetch » simulé). */
	items: Ref<ServerRow[]>
	/** Nombre total de lignes (après filtrage, avant pagination) — pour `server-items-length`. */
	totalItems: Ref<number>
	/** État de chargement (`IDLE` / `PENDING` / `RESOLVED`). */
	state: Ref<StateEnum>
	/** Options du tableau (tri, pagination, filtres…), synchronisées avec `args.options`. */
	options: Ref<Partial<DataOptions>>
	/** Recharge les données (à brancher sur `@update:options`). */
	fetchData: () => Promise<void>
	StateEnum: typeof StateEnum
}

/**
 * Filtre générique reproduisant la logique des stories « Filtres » de
 * `SyServerTable`. No-op lorsque la valeur du filtre est vide (chaîne vide,
 * `null`/`undefined` ou tableau vide), ce qui rend le filtrage opt-in : les
 * stories sans filtres (tri, pagination…) ne sont pas affectées.
 *
 * - `select` / `autocomplete` : la ligne est conservée si la valeur est vide,
 *   ou si `value.includes(item[key])` (valeur multiple), ou si `item[key] === value`
 *   (valeur simple).
 * - `number` : égalité stricte (`Number(item[key]) === Number(value)`).
 * - `date` : égalité de chaîne (dates au format « DD/MM/YYYY »).
 * - `period` : la date de la ligne doit être comprise dans l'intervalle `[from, to]`.
 * - `text` (défaut) : recherche de sous-chaîne insensible à la casse.
 */
function defaultFilterMatch(row: ServerRow, filter: FilterOption): boolean {
	const { key, value, type } = filter
	const itemValue = row[key]

	// Valeur vide → filtre inactif
	if (value === undefined || value === null || value === '') return true
	if (Array.isArray(value) && value.length === 0) return true

	// Sélection simple ou multiple
	if (type === 'select' || type === 'autocomplete') {
		return Array.isArray(value)
			? (value as unknown[]).includes(itemValue)
			: itemValue === value
	}

	// Nombre : égalité stricte
	if (type === 'number') {
		return Number(itemValue) === Number(value)
	}

	// Date exacte : égalité de chaîne
	if (type === 'date') {
		return itemValue === value
	}

	// Période : la date de la ligne doit appartenir à l'intervalle [from, to]
	if (type === 'period') {
		const { from, to } = value as { from: string, to: string }
		const parse = (date: string): Date | null => {
			if (!date) return null
			const parsed = dayjs(date, 'DD/MM/YYYY')
			return parsed.isValid() ? parsed.toDate() : null
		}
		const start = parse(from)
		const end = parse(to)
		const itemDate = parse(String(itemValue))
		if (itemDate) {
			if (end && itemDate > end) return false
			if (start && itemDate < start) return false
		}
		return true
	}

	// Texte (défaut) : recherche insensible à la casse
	return String(itemValue).toLowerCase().includes(String(value).toLowerCase())
}

/**
 * Simule un tableau serveur pour les stories : état de chargement, « fetch »
 * asynchrone avec **filtrage**, **tri multi-clés** et **pagination** côté
 * serveur, et synchronisation du `v-model:options` vers `args` (pour les
 * Controls Storybook).
 *
 * Le filtrage s'applique **avant** le tri et la pagination, et `totalItems`
 * reflète la longueur du jeu filtré. Il est opt-in : sans `options.filters`, le
 * comportement est identique à un tableau non filtré (stories « Tri » inchangées).
 *
 * Remplace le boilerplate (state + fetch + filtrage + tri + pagination) qui était
 * dupliqué dans chaque story de `SyServerTable`.
 *
 * @param customFilter Prédicat de filtrage optionnel, à utiliser lorsque la
 * sémantique d'une story ne correspond pas au filtre générique.
 */
export function useServerTableDemo(
	args: { options?: Partial<DataOptions> },
	dataset: ServerRow[],
	customFilter?: FilterMatcher,
): ServerTableDemo {
	const items = ref<ServerRow[]>([])
	const totalItems = ref(0)
	const state = ref<StateEnum>(StateEnum.IDLE)
	const options = ref<Partial<DataOptions>>({ ...args.options })

	// Répercute les changements d'options vers `args` (Controls Storybook).
	watch(options, (newVal) => {
		if (args.options) {
			Object.assign(args.options, JSON.parse(JSON.stringify(newVal)))
		}
	}, { deep: true })

	const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

	async function fetchData(): Promise<void> {
		state.value = StateEnum.PENDING
		await wait(1000)

		let rows = [...dataset]
		const { sortBy, page = 1, itemsPerPage = 5, filters } = options.value as DataOptions

		// Filtrage côté serveur (avant tri + pagination). No-op si aucun filtre.
		if (filters && filters.length > 0) {
			const match = customFilter ?? defaultFilterMatch
			rows = rows.filter(row => filters.every(filter => match(row, filter)))
		}

		// Tri multi-clés (par ordre de priorité des colonnes de `sortBy`)
		if (sortBy && sortBy.length > 0) {
			rows.sort((a, b) => {
				for (const sort of sortBy) {
					const r = String(a[sort.key]).localeCompare(String(b[sort.key]))
					if (r !== 0) return sort.order === 'asc' ? r : -r
				}
				return 0
			})
		}

		// Le total reflète le jeu filtré (avant pagination)
		totalItems.value = rows.length

		// Pagination côté serveur
		if (itemsPerPage > 0) {
			rows = rows.slice((page - 1) * itemsPerPage, page * itemsPerPage)
		}

		items.value = rows
		state.value = StateEnum.RESOLVED
	}

	fetchData()

	return { items, totalItems, state, options, fetchData, StateEnum }
}
