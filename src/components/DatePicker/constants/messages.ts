/**
 * Fichier contenant toutes les constantes de textes utilisées dans les composants/composables DatePicker
 */

export const DATE_PICKER_MESSAGES = {
	// Labels et placeholders
	LABEL_DEFAULT: 'Date',
	PLACEHOLDER_DEFAULT: 'Sélectionner une date',

	// Messages d'erreur
	ERROR_REQUIRED: 'La date est requise.',
	ERROR_INVALID_FORMAT: 'Le format de la date est invalide.',
	ERROR_INVALID_DATE: 'La date saisie est invalide.',
	ERROR_INCOMPLETE_DATE: 'La date est incomplète.',
	ERROR_INVALID_RANGE: 'La plage de dates est invalide.',
	ERROR_START_DATE_MISSING: 'La date de début est manquante.',
	ERROR_END_DATE_MISSING: 'La date de fin est manquante.',
	ERROR_END_BEFORE_START: 'La date de fin doit être postérieure à la date de début.',
	ERROR_INVALID_FORMAT_START: 'Format de date invalide pour la date de début',
	ERROR_INVALID_FORMAT_END: 'Format de date invalide pour la date de fin',

	// Messages de succès
	SUCCESS_VALID_DATE: 'La date est valide.',

	// Messages d'accessibilité
	ARIA_DATE_INPUT: 'Date en cours de saisie',
	ARIA_CALENDAR_BUTTON: 'Ouvrir le calendrier',
	ARIA_TODAY_BUTTON: 'Sélectionner aujourd\'hui',

	// Boutons et actions
	BUTTON_TODAY: 'Aujourd\'hui',
	BUTTON_CLEAR: 'Effacer',
	BUTTON_CLOSE: 'Fermer',

	// Formats de date
	FORMAT_DEFAULT: 'DD/MM/YYYY',

	// Descriptions des mois pour l'accessibilité
	MONTH_NAMES: [
		'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
		'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
	],

	// Descriptions des jours pour l'accessibilité
	DAY_NAMES: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],

	// Autres messages
	DATE_SEPARATOR: '/',
	RANGE_SEPARATOR: ' - ',
}
