export const locales = {
	label: 'Numéro de téléphone',
	indicatifLabel: 'Indicatif',
	phoneNumberWithoutCountryLabel: 'Numéro de téléphone sans indicatif',
	errorLength: (length: number) => `Le numéro de téléphone doit contenir ${length} chiffres.`,
	errorRequired: (fieldIdentifier: string) => `Le champ ${fieldIdentifier} est requis.`,
	success: (fieldIdentifier: string) => `Le champ ${fieldIdentifier} est valide.`,
}
