export const localesKey = Symbol('month-picker-locales')
export const locales = {
	btnLabel: 'Ouvrir le sélecteur de mois',
	headerSelectYear: 'Sélectionner une année',
	headerSelectMonth: 'Sélectionner un mois',
	yearSelectorLabel: 'Sélectionner une année',
	monthSelectorLabel: 'Sélectionner un mois',
	yearBtnLabelSelected: (selectedYear: string) => `Sélectionner une année, l'année sélectionnée est ${selectedYear}`,
	yearBtnLabelUnselected: (selectedYear: string) => `Sélectionner une année, nous sommes actuellement en ${selectedYear}`,
	monthBtnLabelSelected: (selectedMonth: string) => `Sélectionner un mois, le mois sélectionné est ${selectedMonth}`,
	monthBtnLabelUnselected: (selectedMonth: string) => `Sélectionner un mois, nous sommes actuellement en ${selectedMonth}`,
}
