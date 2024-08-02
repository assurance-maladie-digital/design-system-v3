// Fonction pour générer les variables à partir des tokens
export const generateThemeVariables = (tokens: any): any => {
	const themeVariables: any = {}

	// Parcourir les catégories de couleurs
	for (const category in tokens.colors) {
		if (tokens.colors.hasOwnProperty(category)) {
			const categoryTokens = tokens.colors[category]

			// Parcourir les tokens de chaque catégorie
			for (const token in categoryTokens) {
				if (categoryTokens.hasOwnProperty(token)) {
					const variableName = `on${category.charAt(0).toUpperCase() + category.slice(1)}${token.charAt(0).toUpperCase() + token.slice(1)}`
					themeVariables[variableName] = categoryTokens[token]
				}
			}
		}
	}
	return themeVariables
}
