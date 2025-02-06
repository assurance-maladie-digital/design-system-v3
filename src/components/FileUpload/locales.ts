export const locales = {
	or: 'Ou',
	chooseFile: (multiple: boolean) => multiple ? 'Choisir des fichiers' : 'Choisir un fichier',
	infoText: (max: string, ext: string[]): string =>
		`Taille max. : ${max}. ${ext.length === 1 ? 'Format accepté' : 'Formats acceptés'} : ${ext.join(', ')}`,
	fileSizeUnits: ['o', 'Ko', 'Mo', 'Go', 'To'],
	dropFilesHere: (multiple: boolean): string => (!multiple ? 'Déposer votre fichier ici' : 'Déposer vos fichiers ici'),
	errorSize: (fileName: string, max: string): string => `Le fichier ${fileName} est trop volumineux. Taille max. : ${max}`,
	errorExtension: (fileName: string, ext: string[]): string => `Le fichier ${fileName} a une extension invalide. Extensions acceptées : ${ext.join(', ')}`,
}
