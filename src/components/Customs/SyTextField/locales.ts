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
	// Labels d'action pour les icônes interactives (prepend/append)
	openCalendar: (label?: string) => (label ? `${label} - ouvrir le calendrier` : 'Ouvrir le calendrier'),
	moreInfo: (label?: string) => (label ? `${label} - plus d'informations` : 'Plus d\'informations'),
	successIcon: (label?: string) => (label ? `${label} - succès` : 'Succès'),
	warningIcon: (label?: string) => (label ? `${label} - avertissement` : 'Avertissement'),
	errorIcon: (label?: string) => (label ? `${label} - erreur` : 'Erreur'),
	closeField: (label?: string) => (label ? `Fermer ${label}` : 'Fermer'),
}

export type SyTextFieldLocales = typeof locales
