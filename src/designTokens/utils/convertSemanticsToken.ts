// Fonction pour générer les variables à partir des tokens
type Tokens = {
	colors: {
		[category: string]: {
			[token: string]: string
		}
	}
}

type ThemeVariables = {
	[variableName: string]: string
}

export const generateThemeVariables = (tokens: Tokens): ThemeVariables => {
	const themeVariables: ThemeVariables = {}

	// Parcourir les catégories de couleurs
	for (const category in tokens.colors) {
		if (Object.prototype.hasOwnProperty.call(tokens.colors, category)) {
			const categoryTokens = tokens.colors[category]

			// Parcourir les tokens de chaque catégorie
			for (const token in categoryTokens) {
				if (Object.prototype.hasOwnProperty.call(categoryTokens, token)) {
					const variableName = `on${category.charAt(0).toUpperCase() + category.slice(1)}${token.charAt(0).toUpperCase() + token.slice(1)}`
					themeVariables[variableName] = categoryTokens[token]
				}
			}
		}
	}
	return themeVariables
}
