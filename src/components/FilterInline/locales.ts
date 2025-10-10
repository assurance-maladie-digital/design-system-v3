export const locales = {
	badgeLabel: (count: number): string =>
		`${count} filtre${count > 1 ? 's' : ''}`,
	filterActivatedStatus: (count: number, values: string, field: string): string =>
		count > 1
			? `Les filtres "${values}" pour "${field}" ont été activés. Pensez à soumettre le formulaire pour appliquer les filtres sur les recherches.`
			: `Le filtre "${values}" pour "${field}" a été activé. Pensez à soumettre le formulaire pour appliquer le filtre sur les recherches.`,
} as const
