// Liste blanche fermée pour le libellé des options de SySelect (`allowHtml`).
// Le contenu est reconstruit nœud par nœud plutôt que nettoyé puis réinjecté via
// innerHTML : seuls les nœuds créés ici atteignent le DOM, sans re-parsing (mXSS).
const ALLOWED_TAGS = new Set(['abbr', 'b', 'em', 'i', 'span', 'strong'])

const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
	abbr: ['title'],
	span: ['class'],
}

// Supprimées avec leur contenu, qui n'a pas de sens une fois la balise retirée.
const DROPPED_TAGS = new Set([
	'embed', 'iframe', 'math', 'noscript', 'object', 'script', 'style', 'svg', 'template', 'textarea', 'title',
])

function rebuildChildren(source: Node, target: Node): void {
	for (const child of Array.from(source.childNodes)) {
		if (child.nodeType === Node.TEXT_NODE) {
			target.appendChild(document.createTextNode(child.textContent ?? ''))
			continue
		}
		if (!(child instanceof Element)) {
			continue
		}

		const tag = child.tagName.toLowerCase()
		if (DROPPED_TAGS.has(tag)) {
			continue
		}
		if (!ALLOWED_TAGS.has(tag)) {
			rebuildChildren(child, target)
			continue
		}

		const element = document.createElement(tag)
		for (const name of ALLOWED_ATTRIBUTES[tag] ?? []) {
			const value = child.getAttribute(name)
			if (value !== null) {
				element.setAttribute(name, value)
			}
		}
		rebuildChildren(child, element)
		target.appendChild(element)
	}
}

/** Convertit un libellé HTML non fiable en fragment ne contenant que la mise en forme autorisée. */
export function sanitizeItemHtml(html: string): DocumentFragment {
	// Document inerte : le parsing n'exécute aucun script et ne charge aucune ressource.
	const source = new DOMParser().parseFromString(html, 'text/html')
	const fragment = document.createDocumentFragment()
	rebuildChildren(source.body, fragment)
	return fragment
}
