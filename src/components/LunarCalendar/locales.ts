export const locales = {
	/** Message de validation affiché lorsque la date saisie est invalide. */
	invalidDate: 'La date est invalide.',
	/** L'année doit être comprise entre deux bornes. */
	yearBetween: (min: number | string, max: number | string) => `L'année doit être comprise entre ${min} et ${max}.`,
	/** L'année doit être supérieure ou égale à un minimum. */
	yearMin: (min: number | string) => `L'année doit être supérieure ou égale à ${min}.`,
	/** L'année doit être inférieure ou égale à un maximum. */
	yearMax: (max: number | string) => `L'année doit être inférieure ou égale à ${max}.`,
	/** Message de validation affiché lorsque le champ obligatoire est vide. */
	requiredField: (label?: string) => `Le champ ${label || 'ce champ'} est requis.`,
}
