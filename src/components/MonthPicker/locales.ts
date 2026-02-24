export const localesKey = Symbol('month-picker-locales')
export const locales = {
	hint: 'Format MM/AAAA',
	btnLabel: 'Ouvrir le sélecteur de mois',
	headerSelectYear: 'Sélectionner une année',
	headerSelectMonth: 'Sélectionner un mois',
	yearBtnLabel: (currentYear: number) => `Sélectionner l'année, année actuelle ${currentYear}.`,
}
