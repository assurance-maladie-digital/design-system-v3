import type { Meta } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'

/**
 * Définitions `argTypes` Storybook communes aux tableaux (SyTable, SyServerTable).
 *
 * Ce module centralise toutes les entrées `argTypes` partagées entre les deux
 * fichiers de stories. Les entrées spécifiques à chaque tableau (`items`,
 * `serverItemsLength`, `showFilters`) restent définies dans leurs fichiers
 * respectifs et sont fusionnées via un spread : `{ ...commonTableArgTypes, ... }`.
 */
export const commonTableArgTypes: NonNullable<Meta['argTypes']> = {
	'headers': {
		description: 'Liste des colonnes du tableau (voir : https://vuetifyjs.com/en/api/v-data-table/#props-headers)',
		control: { type: 'object' },
		table: {
			category: 'props',
		},
	},
	'density': {
		description: 'Définit la densité du tableau',
		control: { type: 'select' },
		options: ['default', 'comfortable', 'compact'],
		table: {
			category: 'props',
			type: { summary: 'string', detail: `'default' | 'comfortable' | 'compact'` },
		},
	},
	'striped': {
		description: 'Affiche les lignes du tableau avec un fond rayé',
		control: { type: 'boolean' },
		table: {
			category: 'props',
			type: { summary: 'boolean' },
		},
	},
	'options': {
		description: 'Options de configuration du tableau',
		name: 'v-model:options',
		control: { type: 'object' },
		table: {
			category: 'props',
			type: { summary: 'DataOptions', detail: '{ page: number, itemsPerPage: number, sortBy: SortOptions[], groupBy?: SortOptions[], multiSort?: boolean, mustSort?: boolean, filters?: FilterOption[] }' },
		},
	},
	'itemsPerPageOptions': {
		description: 'Limite les options disponibles dans le sélecteur "itemsPerPage"',
		control: { type: 'object' },
		table: {
			category: 'props',
			type: { summary: 'number[]' },
			defaultValue: { summary: 'undefined' },
		},
	},
	'saveState': {
		description: 'Permet d\'activer ou non la sauvegarde des options (pagination, tris, ordre des colonnes) du tableau dans le localStorage. Par défaut, cette fonctionnalité est activée.',
		control: { type: 'boolean' },
	},
	'suffix': {
		description: 'Suffixe permettant de gérer individuellement le stockage des options d\'un tableau d\'une page à l\'autre. Ce prop est obligatoire pour garantir un stockage unique pour chaque tableau.',
		control: { type: 'text' },
		table: {
			category: 'props',
			type: { summary: 'string' },
		},
		required: true,
	},
	'showExpand': {
		description: 'Affiche une colonne permettant d\'étendre les lignes pour afficher du contenu supplémentaire',
		control: { type: 'boolean' },
		table: {
			category: 'props',
		},
	},
	'resizableColumns': {
		description: 'Permet de redimensionner les colonnes du tableau',
		control: { type: 'boolean' },
		table: {
			category: 'props',
			type: { summary: 'boolean' },
		},
	},
	'multiSort': {
		description: 'Permet de trier sur plusieurs colonnes simultanément. Lorsque activé, des indicateurs numériques apparaissent à côté des icônes de tri pour montrer l\'ordre de priorité.',
		control: { type: 'boolean' },
		table: {
			category: 'props',
			type: { summary: 'boolean' },
			defaultValue: {
				summary: 'false',
			},
		},
	},
	'mustSort': {
		description: 'Force au moins une colonne à être toujours triée. Si désactivé, toutes les colonnes peuvent être non triées.',
		control: { type: 'boolean' },
		table: {
			category: 'props',
			type: { summary: 'boolean' },
			defaultValue: {
				summary: 'false',
			},
		},
	},
	'caption': {
		description: 'Texte de la légende du tableau',
		control: { type: 'text' },
	},
	'filterInputConfig': {
		description: 'Configuration des champs de filtre, indexée par la clé (`key`) de chaque colonne. Chaque entrée accepte les options de `SyTextField`, notamment `maxlength`, `variant`, `density`, `hideDetails`, `backgroundColor`, `clearable`, `disableErrorHandling` et `debounceTime`.',
		control: { type: 'object' },
		table: {
			category: 'props',
			type: { summary: 'Record<string, TableFilterInputConfig>', detail: '{ [columnKey: string]: { maxlength?: number, variant?: string, density?: \'default\' | \'comfortable\' | \'compact\', hideDetails?: boolean, backgroundColor?: string, clearable?: boolean, disableErrorHandling?: boolean, debounceTime?: number } }' },
			defaultValue: { summary: 'undefined' },
		},
	},
	'enableColumnControls': {
		description: 'Allow the users to re-organize the columns',
		table: {
			defaultValue: {
				summary: 'false',
			},
			type: { summary: 'boolean' },
			category: 'props',
		},
		control: { type: 'boolean' },
	},
	'showSelect': {
		description: 'Affiche des cases à cocher pour sélectionner des lignes',
		control: { type: 'boolean' },
		table: {
			category: 'props',
			type: { summary: 'boolean' },
		},
	},
	'showSelectSingle': {
		description: 'Affiche des boutons radio pour sélectionner une unique ligne',
		control: { type: 'boolean' },
		table: {
			category: 'props',
			type: { summary: 'boolean' },
		},
	},
	'stickySelect': {
		description: 'Rend la colonne de sélection (cases à cocher) sticky à gauche quand showSelect ou showSelectSingle est activé.',
		control: { type: 'boolean' },
		table: {
			category: 'props',
			type: { summary: 'boolean' },
			defaultValue: {
				summary: 'false',
			},
		},
	},
	'pinnedColumns': {
		description: 'Liste des colonnes à épingler (sticky). Chaque entrée peut être une clé de colonne (string) ou un objet `{ key: string, side?: \'left\' | \'right\' }`. Par défaut, les colonnes sont épinglées à gauche.',
		control: { type: 'object' },
		table: {
			category: 'props',
			type: { summary: 'Array<string | { key: string, side?: \'left\' | \'right\' }>' },
			defaultValue: { summary: 'undefined' },
		},
	},
	'pinnedColumnKey': {
		description: 'Raccourci pour épingler une seule colonne à gauche. Équivalent à `pinnedColumns: [key]`. Ignoré si `pinnedColumns` est défini.',
		control: { type: 'text' },
		table: {
			category: 'props',
			type: { summary: 'string' },
			defaultValue: { summary: 'undefined' },
		},
	},
	'selectionKey': {
		description: 'Clé utilisée pour identifier chaque ligne lors de la sélection. Par défaut, utilise "id" si présent, sinon l\'objet complet.',
		control: { type: 'text' },
		table: {
			category: 'props',
			type: { summary: 'string' },
			defaultValue: { summary: 'undefined (fallback: id | objet complet)' },
		},
	},
	'clickableRow': {
		description: 'Rend chaque ligne cliquable. Quand cette prop est activée, la ligne devient focusable au clavier et émet `row-click` sur clic, `Entrée` ou `Espace`, sans interférer avec les éléments interactifs imbriqués.',
		control: { type: 'boolean' },
		table: {
			category: 'props',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	'pageInput': {
		description: 'Affiche un champ de saisie numérique dans la pagination permettant de naviguer directement vers une page en la saisissant au clavier. La navigation est déclenchée à la validation (`Entrée`) ou à la perte de focus. La valeur est automatiquement clampée entre 1 et le nombre total de pages.',
		control: { type: 'boolean' },
		table: {
			category: 'props',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	'hideDefaultFooter': {
		description: 'Masque le footer par défaut du tableau (pagination et contrôles de page). Utile lorsque l\'on souhaite gérer la pagination manuellement ou ne pas en afficher.',
		control: { type: 'boolean' },
		table: {
			category: 'props',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	'editable': {
		description: 'Active l\'édition inline des lignes. Les colonnes dont le header porte `editable: true` deviennent des champs en mode édition. Le composant n\'altère jamais `items` (il émet `save`/`cancel`).',
		control: { type: 'boolean' },
		table: {
			category: 'props',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore - 'cookie-description-${cookieName}' storybook can't infer dynamic slot name
	'header.<columnKey>': {
		description: 'Slot permettant de personnaliser le rendu de l\'en-tête d\'une colonne spécifique. Remplacer `<columnKey>` par la clé de la colonne souhaitée.',
		control: undefined,
		table: {
			category: 'slots',
			type: {
				summary: 'slot',
				detail: `{
					column: HeaderColumn,
					headers: HeaderColumn[][],
					columns: HeaderColumn[],
					locales: Record<string, string | ((...args: unknown[]) => string)>,
					sortBy: DataOptions['sortBy'],
					someSelected: boolean,
					allSelected: boolean
				}`,
			},
		},
	},
	'item.actions': {
		description: 'Slot d\'actions par ligne. Reçoit les helpers d\'édition `{ item, isEditing, edit, save, cancel, remove }`.',
		control: undefined,
		table: {
			category: 'slots',
			type: { summary: 'slot', detail: '{ item, isEditing: boolean, edit: () => void, save: () => void, cancel: () => void, remove: () => void }' },
		},
	},
	'edit.<columnKey>': {
		description: 'Personnalise l\'éditeur d\'une cellule en édition inline. Remplacer `<columnKey>` par la clé de la colonne. Par défaut un `SyTextField`.',
		control: undefined,
		table: {
			category: 'slots',
			type: { summary: 'slot', detail: '{ item, value: unknown, update: (value: unknown) => void }' },
		},
	},
	'bulk-actions': {
		description: 'Barre affichée quand des lignes sont sélectionnées. Le composant ne fournit que la sélection ; le projet rend ses propres actions (éditer, supprimer…) et pilote leur UX (DialogBox, drawer…).',
		control: undefined,
		table: {
			category: 'slots',
			type: { summary: 'slot', detail: '{ selected: Record<string, unknown>[], count: number, clearSelection: () => void }' },
		},
	},
	'update:options': {
		description: 'Émis lorsque les options du tableau changent (pagination, tri, filtres…).',
		table: {
			category: 'events',
			type: { summary: '(options: DataOptions) => void' },
		},
	},
	'row-click': {
		description: 'Émis lorsqu\'une ligne est activée alors que `clickableRow` est à `true`. Reçoit l\'objet de la ligne en paramètre. Les interactions avec des éléments déjà interactifs dans la ligne ne déclenchent pas cet événement.',
		table: {
			category: 'events',
			type: { summary: '(item: Record<string, unknown>) => void' },
		},
	},
	'update:modelValue': {
		description: 'Émis lorsque la sélection change (`showSelect` ou `showSelectSingle`). Reçoit la liste des valeurs de sélection des lignes sélectionnées (déterminées par `selectionKey`, `id` par défaut, sinon l\'objet complet).',
		table: {
			category: 'events',
			type: { summary: '(selection: unknown[]) => void' },
		},
	},
	'edit': {
		description: 'Émis à l\'entrée en édition inline d\'une ligne.',
		table: {
			category: 'events',
			type: { summary: '(item: Record<string, unknown>) => void' },
		},
	},
	'save': {
		description: 'Émis à la validation de l\'édition inline. Reçoit la ligne mise à jour et l\'originale.',
		table: {
			category: 'events',
			type: { summary: '(updated: Record<string, unknown>, original: Record<string, unknown> | null) => void' },
		},
	},
	'cancel': {
		description: 'Émis à l\'annulation de l\'édition inline.',
		table: {
			category: 'events',
			type: { summary: '(item: Record<string, unknown> | null) => void' },
		},
	},
	'delete': {
		description: 'Émis au clic sur l\'action de suppression d\'une ligne.',
		table: {
			category: 'events',
			type: { summary: '(item: Record<string, unknown>) => void' },
		},
	},
}

/**
 * Clés `onXxx` synthétiques (déclarées dans `commonTableEventArgs`) à exclure des Controls :
 * elles ne servent qu'à attacher les spies aux events Vue et dupliquent les entrées `argTypes`
 * ci-dessus définies sous leur nom brut (`edit`, `save`…) tel que détecté par le docgen.
 */
export const commonTableExcludedControls = [
	'onUpdate:options',
	'onUpdate:modelValue',
	'onRow-click',
	'onEdit',
	'onSave',
	'onCancel',
	'onDelete',
]

/**
 * Handlers d'événements communs à étaler dans les `args` des stories des tableaux.
 *
 * Usine plutôt qu'objet statique : chaque story reçoit des spies `fn()` frais
 * afin que les logs d'actions Storybook ne se mélangent pas entre stories.
 */
export function commonTableEventArgs() {
	return {
		'onUpdate:options': fn(),
		'onUpdate:modelValue': fn(),
		'onRow-click': fn(),
		'onEdit': fn(),
		'onSave': fn(),
		'onCancel': fn(),
		'onDelete': fn(),
	}
}
