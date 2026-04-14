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

	for (const [category, categoryTokens] of Object.entries(tokens.colors)) {
		for (const [token, tokenValue] of Object.entries(categoryTokens)) {
			if (tokenValue === undefined) {
				throw new Error(`Missing semantic token "${token}" in category "${category}"`)
			}

			const variableName = `on${category.charAt(0).toUpperCase() + category.slice(1)}${token.charAt(0).toUpperCase() + token.slice(1)}`
			themeVariables[variableName] = tokenValue
		}
	}

	return themeVariables
}
