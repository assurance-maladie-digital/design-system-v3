const FORBIDDEN_TAGS = new Set([
	'script',
	'iframe',
	'object',
	'embed',
	'link',
	'meta',
	'style',
])

const isPossiblyUnsafeUrl = (value: string) => {
	const normalized = value.trim().toLowerCase()
	return normalized.startsWith('javascript:')
		|| normalized.startsWith('data:text/html')
}

export const sanitizeHtml = (unsafeHtml: string): string => {
	if (!unsafeHtml) return ''

	// DOMParser is available in browsers and in jsdom/happy-dom.
	const parser = new DOMParser()
	const doc = parser.parseFromString(String(unsafeHtml), 'text/html')

	const walk = (root: ParentNode) => {
		const elements = Array.from(root.querySelectorAll('*'))
		elements.forEach((el) => {
			const tag = el.tagName.toLowerCase()
			if (FORBIDDEN_TAGS.has(tag)) {
				el.remove()
				return
			}

			// Remove inline event handlers + unsafe URLs.
			Array.from(el.attributes).forEach((attr) => {
				const name = attr.name.toLowerCase()
				const value = attr.value

				if (name.startsWith('on')) {
					el.removeAttribute(attr.name)
					return
				}

				if (name === 'srcdoc') {
					el.removeAttribute(attr.name)
					return
				}

				if ((name === 'href' || name === 'src' || name === 'xlink:href') && isPossiblyUnsafeUrl(value)) {
					el.removeAttribute(attr.name)
				}
			})
		})
	}

	walk(doc)
	return doc.body.innerHTML
}
