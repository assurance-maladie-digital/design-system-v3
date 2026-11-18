export const locales = {
	/** Message de validation affiché lorsque le champ obligatoire est vide. */
	requiredField: (label?: string) => `Le champ ${label || 'ce champ'} est requis.`,
	/** Libellé accessible du bouton d'effacement de la sélection. */
	clearLabel: 'Supprimer',
	/** Nom accessible du déclencheur : libellé du champ, suivi de la valeur sélectionnée s'il y en a une. */
	triggerLabel: (label: string, value?: string) => value ? `${label} : ${value}` : label,
}
