// Pile des sous-niveaux ouverts, partagée par toutes les listes de la page : Échap ferme le plus profond,
// même ouvert au survol alors que le focus est ailleurs (RGAA 10.13).
// L'écouteur n'est posé que tant qu'un sous-niveau est ouvert, donc jamais côté serveur (SSR).
const openPanels: Array<() => void> = []

function onDocumentKeydown(event: KeyboardEvent): void {
	if (event.key === 'Escape') openPanels.at(-1)?.()
}

export function registerOpenPanel(close: () => void): void {
	if (openPanels.length === 0) document.addEventListener('keydown', onDocumentKeydown)
	openPanels.push(close)
}

export function unregisterOpenPanel(close: () => void): void {
	const index = openPanels.indexOf(close)
	if (index === -1) return
	openPanels.splice(index, 1)
	if (openPanels.length === 0) document.removeEventListener('keydown', onDocumentKeydown)
}
