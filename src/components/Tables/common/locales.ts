export const locales = {
	// Table locales
	resetFilters: 'Réinitialiser les filtres',
	noData: 'Aucune donnée disponible',
	columnOrder: (columnTitle: string) => `Ordonner par ${columnTitle}`,
	ResizableColumn: 'Redimensionner la colonne',
	resizeColumn: (columnTitle: string) => `Redimensionner la colonne ${columnTitle}`,
	selectAllRows: 'Sélectionner toutes les lignes',
	selectRow: 'Sélectionner la ligne',

	// Pagination locales
	pagination: {
		itemsPerPageText: 'Lignes par page:',
		previous: 'Précédent',
		next: 'Suivant',
		all: 'Tous',
		showingItems: (start: number, end: number, total: number) => `${start}-${end} sur ${total} éléments`,
		pageText: (page: number) => `${page}`,
		pageAriaLabel: (page: number) => `Page ${page}`,
		currentPageAriaLabel: (page: number) => `Page courante, Page ${page}`,
		paginationNavAriaLabel: 'Navigation de pagination',
	},
	reorganizeColumns: 'Réorganiser les colonnes',
	close: 'Fermer',
	apply: 'Appliquer',
	reorganizeColumnsTitle: 'Réorganiser les colonnes',
	hideColumn: (columnTitle: string) => `Masquer la colonne ${columnTitle}`,
	showColumn: (columnTitle: string) => `Afficher la colonne ${columnTitle}`,
	moveColumnLeft: (columnTitle: string) => `Déplacer la colonne ${columnTitle} vers la gauche`,
	moveColumnRight: (columnTitle: string) => `Déplacer la colonne ${columnTitle} vers la droite`,
}
