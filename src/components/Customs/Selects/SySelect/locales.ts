export const locales = {
	requiredField: (label?: string) => `Le champ ${label || 'ce champ'} est requis.`,
	clear: 'Effacer la sélection',
	removeChip: (label: string) => `Supprimer ${label}`,
	/** Libellé/placeholder par défaut quand aucun `label` ni `helpText` n'est fourni. */
	selectPlaceholder: 'Sélectionnez une option',
	/** Message générique annoncé (live region) en cas d'erreur sans message spécifique. */
	fieldError: 'Le champ contient une erreur.',
}
