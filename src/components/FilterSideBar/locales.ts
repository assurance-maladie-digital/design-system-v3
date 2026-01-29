export const locales = {
	filterBtnLabel: 'Filtres',
	modaleLabel: 'Filtres',
	badgeListLabel: (filterName: string): string =>
		'Filtres pour la catégorie ' + filterName,
	badgeLabel: (count: number): string =>
		`${count} filtre${count > 1 ? 's' : ''}`,
	reset: 'Réinitialiser',
	close: 'Fermer',
	apply: 'Appliquer',
	closeAriaLabel: 'Fermer les filtres',
	resetAriaLabel: 'Réinitialiser les filtres',
	applyAriaLabel: 'Appliquer les filtres',
} as const
