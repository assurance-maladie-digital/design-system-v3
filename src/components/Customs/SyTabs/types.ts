export interface TabItem {
	label: string
	value: string | number
	content?: string
	disabled?: boolean
}

export interface UrlValidator {
	/**
	 * Fonction qui vérifie si l'onglet correspond à l'URL active
	 * @param tabValue - La valeur de l'onglet à vérifier
	 * @returns boolean - true si l'onglet correspond à l'URL actuelle
	 */
	validateUrl: (tabValue: string | number) => boolean
}
