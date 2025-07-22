export function toKebabCase(value: string): string {
	// Vérifie si la chaîne est vide
	if (!value) {
		return ''
	}
	// Convertit les chaînes camelCase et PascalCase en kebab-case
	return value
		.replace(/([a-z0-9])([A-Z])/g, '$1-$2') // Insère un tiret avant les majuscules
		.replace(/([A-Z]+)([A-Z][a-z0-9])/g, '$1-$2') // Gère les cas spéciaux comme 'HTMLFile' -> 'html-file'
		.toLowerCase() // Convertit tout en minuscules
}
