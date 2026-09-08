export const locales = {
	autocomplete: {
		label: 'Rechercher un composant...',
		placeholder: 'Sélectionner un ou plusieurs composants',
		selectAll: 'Sélectionner tous',
	},
	filters: {
		selectVersion: 'Sélectionner une version',
		allVersions: 'Toutes les versions',
		allStatuses: 'Tous les statuts',
		versionLabel: 'Filtrer par version',
		statusLabel: 'Filtrer par statut',
		includeDeprecated: 'Inclure les composants dépréciés',
		resetFilters: 'Effacer les filtres',
	},
	status: {
		active: 'Actif',
		deprecated: 'Déprécié',
		displayActive: 'Actif',
		displayDeprecated: 'Déprécié',
	},
	commits: {
		empty: 'Aucun commit à afficher.',
		emptyForVersion: (version: string): string => `Aucun changement publié dans la version ${version}.`,
	},
	emptyState: {
		message: 'Veuillez sélectionner vos composants dans la barre de recherche',
	},
	noResults: {
		message: 'Aucun résultat ne correspond à votre recherche',
	},
	tabs: {
		functional: 'Fonctionnel',
		a11y: 'Accessibilité',
	},
	version: {
		unknown: 'Version non renseignée',
	},
	lastUpdate: {
		functional: 'Dernière mise à jour fonctionnelle :',
		a11y: 'Dernière mise à jour accessibilité :',
	},
	meta: {
		components: 'composants',
		component: 'composant',
	},
}
