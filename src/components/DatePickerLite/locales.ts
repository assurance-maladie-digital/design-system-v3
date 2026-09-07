export const locales = {
	// Keys required by CalendarLocales (injected by the shared picker sub-components)
	monthSelectorLabel: 'Sélectionner un mois',
	yearSelectorLabel: 'Sélectionner une année',
	yearBtnLabelSelected: (selectedYear: string) => `Sélectionner une année, l'année sélectionnée est ${selectedYear}`,
	yearBtnLabelUnselected: (selectedYear: string) => `Sélectionner une année, nous sommes actuellement en ${selectedYear}`,
	monthBtnLabelSelected: (selectedMonth: string) => `Sélectionner un mois, le mois sélectionné est ${selectedMonth}`,
	monthBtnLabelUnselected: (selectedMonth: string) => `Sélectionner un mois, nous sommes actuellement en ${selectedMonth}`,
	previousMonthBtnLabel: 'Mois précédent',
	nextMonthBtnLabel: 'Mois suivant',
	// DatePickerLite own keys
	btnLabel: 'Ouvrir le sélecteur de date',
	headerSelectDay: 'Sélectionner une date',
	headerSelectMonth: 'Sélectionner un mois',
	headerSelectYear: 'Sélectionner une année',
	dayBtnLabelSelected: (monthYear: string) => `Sélectionner un mois, le mois affiché est ${monthYear}`,
	dayBtnLabelUnselected: (monthYear: string) => `Sélectionner un mois, nous sommes actuellement en ${monthYear}`,
	todayBtnLabel: 'Aujourd’hui',
	todayBtnAriaLabel: 'Sélectionner la date du jour',
	fieldRequired: (label?: string) => `${label ? `Le champ ${label}` : 'Ce champ'} est requis.`,
}
