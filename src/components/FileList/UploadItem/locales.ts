export const locales = {
	optionalDocument: 'Document facultatif',
	see: 'Voir le fichier',
	delete: 'Supprimer le fichier',
	import: 'Importer le fichier',
	uploading: 'En cours',
	/** Libellé accessible de la barre de progression pendant le chargement. */
	loadingLabel: (title?: string) => (title ? `Chargement de ${title}` : 'Chargement en cours'),
	success: 'Téléchargé',
	error: 'Erreur',
	errorOccurred: 'Une erreur est survenue pendant le téléchargement.',
}
