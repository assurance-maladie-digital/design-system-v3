export function isConformiteHidden(title?: string): boolean {
	// `getCurrentStoryData()` renvoie `undefined` avant résolution de l'index,
	// malgré un typage non-nullable.
	if (!title) return false

	return title
		.split('/')
		.some(segment => segment.toLowerCase() === 'validation')
}
