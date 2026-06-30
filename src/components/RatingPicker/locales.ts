export const locales = {
	thanks: 'Merci pour votre réponse',
	etoiles: (n: number) => `${n} étoile${n > 1 ? 's' : ''}`,
	defaultEmotionLabels: ['Pas du tout', 'Moyen', 'Parfait !'],
	toValidate: 'Ce champ ne sera plus modifiable après saisie',
	validated: 'Le champ a été complété et n\'est plus modifiable',
	ratingAriaLabel: (index: number, length: number): string =>
		`Note de ${index} sur ${length}.`,
}
