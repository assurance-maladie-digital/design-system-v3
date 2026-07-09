import dayjs from 'dayjs'

export const locales = {
	// Labels et placeholders
	label: 'Date',

	// Messages de description
	formatHint: 'Format attendu :',

	// Messages d'erreur
	required: 'La date est requise.',
	invalidDateFormat: 'Le format de la date est invalide.',
	invalidDate: 'La date saisie est invalide.',
	invalidDateFormatWithFormat: (format: string): string => `Format de date invalide (${format})`,
	incompleteDate: 'La date est incomplète.',
	invalidRange: 'La plage de dates est invalide.',
	startDateMissing: 'La date de début est manquante.',
	endDateMissing: 'La date de fin est manquante.',
	endBeforeStart: 'La date de fin doit être postérieure à la date de début.',
	endBeforeStartEqual: 'La date de fin doit être postérieure ou égale à la date de début',
	invalidStartDateFormat: 'Format de date invalide pour la date de début',
	invalidEndDateFormat: 'Format de date invalide pour la date de fin',
	fieldRequired: 'Ce champ est requis',

	// Messages de succès
	validDate: 'La date est valide.',

	// Messages d'accessibilité
	dateInputDescription: 'Date en cours de saisie',
	openCalendar: 'Ouvrir le calendrier',
	selectMonth: (month?: string): string => month ? `Sélectionner le mois (${month})` : 'Sélectionner un mois',
	selectYear: (year?: string): string => year ? `${year}` : 'Sélectionner une année',
	selectYearForDisplay: (year: string): string => `Sélectionner l'année ${year}`,
	selectMonthWithYear: (month: string, year?: string): string => {
		return year ? `Sélectionner le mois de ${month} ${year}` : `${month}`
	},
	openMonthSelector: 'Ouvrir le sélecteur de mois',
	openYearSelector: 'Ouvrir le sélecteur d\'année',
	selectYearDirectly: 'Sélectionner une année',
	previousMonth: 'Mois précédent',
	nextMonth: 'Mois suivant',
	calendarGridLabel: 'Calendrier des dates',
	noDateEntered: 'Aucune date saisie',
	dayDescription: (day: string): string => `jour ${day}`,
	monthDescription: (month: string): string => `mois ${month}`,
	yearDescription: (year: string): string => `année ${year}`,
	partialDateDescription: (description: string): string => `Date en cours de saisie: ${description}`,
	selectedByDefault: 'sélectionné par défaut',
	selectTodayCapitalized: (dateText?: string): string => {
		const baseLabel = 'Sélectionner la date d\'Aujourd\'hui'
		return dateText ? `${baseLabel} (${dateText})` : baseLabel
	},

	// Boutons et actions
	buttonToday: 'Aujourd\'hui',
	buttonTodayAriaLabel: (dateText?: string): string => {
		const baseLabel = 'Sélectionner la date d\'aujourd\'hui'
		return dateText ? `${baseLabel} (${dateText})` : baseLabel
	},
	buttonClear: 'Effacer',
	buttonClose: 'Fermer',
	calendarTitle: 'Sélectionnez une date',

	// Formats de date
	formatDefault: 'DD/MM/YYYY',
	dateSeparator: '/',
	rangeSeparator: ' - ',

	// Descriptions des mois pour l'accessibilité
	monthNames: [
		'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
		'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
	],
	monthNamesShort: [
		'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin',
		'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.',
	],
	// Descriptions des jours pour l'accessibilité
	dayNames: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
	weekdayLabelsMondayFirst: [
		'Lundi',
		'Mardi',
		'Mercredi',
		'Jeudi',
		'Vendredi',
		'Samedi',
		'Dimanche',
	],
	publicHoliday: 'jour férié',
	defaultGridLabel: 'Calendrier des dates, sélectionnez une date',
	gridLabelWithMonthYear: (monthYearLabel: string): string => `${monthYearLabel}, sélectionnez une date`,
} as const

export const localesKey = Symbol('date-picker-locales')

const capitalizeFrench = (value: string): string => (
	value.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
)

/**
 * Formate une date dayjs en label accessible en français avec majuscule
 * sur chaque mot (ex: "Vendredi 15 Mai 2025").
 */
export const formatDateLabel = (date: dayjs.Dayjs): string => {
	return capitalizeFrench(date.locale('fr').format('dddd DD MMMM YYYY'))
}

/**
 * Formate une date dayjs en format court (ex: "15 Mai").
 */
export const formatDateShort = (date: dayjs.Dayjs): string => {
	return capitalizeFrench(date.locale('fr').format('D MMMM'))
}

/**
 * Formate une date dayjs en format de fin de plage (ex: "15 Mai 2025").
 */
export const formatDateRangeEnd = (date: dayjs.Dayjs): string => {
	return capitalizeFrench(date.locale('fr').format('D MMMM YYYY'))
}
