export const locales = {
	errorRequiredNumber: 'Le numéro de sécurité sociale est requis, ce sont les 13 premiers chiffres sur votre carte vitale.',
	errorLengthNumber: (length: number) => `Le numéro de sécurité sociale doit contenir ${length} caractères.`,
	erreurInvalidNumber: 'Le numéro de sécurité sociale est invalide.',
	errorRequiredKey: 'La clé de contrôle est requise, ce sont les 2 derniers chiffres sur votre carte vitale.',
	errorLengthKey: (length: number) => `La clé du numéro de sécurité sociale doit contenir ${length} caractères.`,
	errorInvalidKey: 'La clé de contrôle est invalide.',
	successNumberValid: 'Le numéro de sécurité sociale est valide.',
	successKeyValid: 'La clé de contrôle est valide.',
	numberLabel: 'Numéro de sécurité sociale',
	numberHint: '13 caractères',
	keyLabel: 'Clé',
	keyHint: '2 chiffres',
} as const
