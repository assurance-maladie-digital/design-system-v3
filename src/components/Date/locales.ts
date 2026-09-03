export const locales = {
	calendarAriaLabel: 'Calendrier',
	useArrowsToNavigate: 'Utilisez les flèches pour naviguer',
	useSpaceToSelect: 'Espace pour sélectionner',
	useShiftArrowsToExtendRange: 'Maj + Flèches pour étendre la sélection',
	rangeSelected: (start: string, end: string): string => `Plage sélectionnée du ${start} au ${end}`,
	rangeStartLabel: (day: { day: number, dayName: string }): string => `Début de la plage sélectionnée, ${day.day} ${day.dayName}`,
	rangeEndLabel: (day: { day: number, dayName: string }): string => `Fin de la plage sélectionnée, ${day.day} ${day.dayName}`,
	rangeIncludedLabel: (day: { day: number, dayName: string }): string => `Dans la plage sélectionnée, ${day.day} ${day.dayName}`,
}
