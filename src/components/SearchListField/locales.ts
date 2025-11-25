export const locales = {
	search: 'Rechercher',
	searchListTitle: 'Liste des éléments',
	checkboxLabel: 'Sélectionner la valeur',
	nbItems: (count: number) => {
		if (count === 0) {
			return 'Aucun élément ne correspond à votre recherche'
		}
		else if (count === 1) {
			return '1 élément correspond à votre recherche'
		}
		else {
			return `${count} éléments correspondent à votre recherche`
		}
	},
}
