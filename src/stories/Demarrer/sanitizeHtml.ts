// Liste blanche : tout ce qui n'y figure pas est retiré. Le HTML des notes de release
// vient de l'API GitHub et ne doit jamais pouvoir exécuter de script dans Storybook.
const ALLOWED_TAGS = new Set([
	'a', 'b', 'blockquote', 'br', 'code', 'del', 'details', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
	'hr', 'i', 'img', 'li', 'ol', 'p', 'pre', 's', 'strong', 'summary', 'table', 'tbody', 'td',
	'th', 'thead', 'tr', 'ul',
])

// Supprimées avec leur contenu, qui n'a pas de sens une fois la balise retirée.
const DROPPED_TAGS = new Set([
	'iframe', 'math', 'noscript', 'object', 'embed', 'script', 'style', 'svg', 'template', 'textarea', 'title',
])

const ALLOWED_ATTRIBUTES = new Set(['align', 'alt', 'colspan', 'href', 'rowspan', 'src', 'title'])
const URL_ATTRIBUTES = new Set(['href', 'src'])
const SAFE_URL = /^(?:https?:|mailto:|#)/i

function sanitizeChildren(parent: Element): void {
	for (const child of Array.from(parent.children)) {
		const tag = child.tagName.toLowerCase()
		if (DROPPED_TAGS.has(tag)) {
			child.remove()
			continue
		}
		sanitizeChildren(child)
		if (!ALLOWED_TAGS.has(tag)) {
			child.replaceWith(...Array.from(child.childNodes))
			continue
		}
		for (const { name, value } of Array.from(child.attributes)) {
			const isAllowed = ALLOWED_ATTRIBUTES.has(name)
				&& (!URL_ATTRIBUTES.has(name) || SAFE_URL.test(value.trim()))
			if (!isAllowed) {
				child.removeAttribute(name)
			}
		}
	}
}

/** Nettoie un fragment HTML non fiable avant son rendu via `v-html`. */
export function sanitizeHtml(html: string): string {
	// Document inerte : le parsing n'exécute aucun script et ne charge aucune ressource.
	const doc = new DOMParser().parseFromString(html, 'text/html')
	sanitizeChildren(doc.body)
	return doc.body.innerHTML
}
