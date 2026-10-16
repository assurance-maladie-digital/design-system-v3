export const locales = {
	requiredField: (label?: string) => `Le champ ${label || 'ce champ'} est requis.`,
	/**
	 * @deprecated Utiliser `requiredField`, qui reprend le label du champ comme les autres champs.
	 * Conservée pour compatibilité : si elle est renseignée, elle remplace `requiredField`.
	 */
	required: undefined as string | undefined,
	maxLines: (maxLines: number) => `Ce champ ne peut pas dépasser ${maxLines} lignes`,
	clearField: 'Effacer le champ',
}

export type SyTextAreaLocales = typeof locales
