export const locales = {
	requiredField: (label?: string) => `Le champ ${label || 'ce champ'} est requis.`,
	noData: 'Aucune option',
	clearSelection: 'Réinitialiser la sélection',
	removeChip: (label: string) => `Supprimer ${label}`,
	loading: 'Chargement des résultats',
	nAvailable: (count: number) => `${count} option${count > 1 ? 's' : ''} disponible${count > 1 ? 's' : ''}`,
}
