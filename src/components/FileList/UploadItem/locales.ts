export const locales = {
	optionalDocument: 'Document facultatif',
	see: 'Voir le fichier',
	delete: 'Supprimer le fichier',
	import: 'Importer le fichier',
	uploading: 'En cours',
	success: 'Téléchargé',
	error: 'Erreur',
	errorOccurred: 'Une erreur est survenue pendant le téléchargement.',
	importAriaLabel(title) {
		return `${this.import} ${title}`
	},
	deleteAriaLabel(fileName) {
		return `${this.delete} ${fileName}`
	},
	seeAriaLabel(fileName) {
		return `${this.see} ${fileName}`
	},
}
