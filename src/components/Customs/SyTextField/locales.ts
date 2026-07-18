export const locales = {
	// Message de validation : champ requis
	requiredField: (label?: string) => `Le champ ${label || 'ce champ'} est requis.`,
	// Bouton d'incrément du mode number (spinner ↑)
	increment: (label?: string) => (label ? `Augmenter ${label}` : 'Augmenter'),
	// Bouton de décrément du mode number (spinner ↓)
	decrement: (label?: string) => (label ? `Diminuer ${label}` : 'Diminuer'),
	// Bouton de réinitialisation du champ
	clear: (label?: string) => (label ? `Vider ${label}` : 'Vider'),
	// Barre de progression affichée pendant le chargement
	loading: (label?: string) => (label ? `Chargement de ${label}` : 'Chargement en cours'),
}

export type SyTextFieldLocales = typeof locales
