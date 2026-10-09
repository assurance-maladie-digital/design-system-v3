import { describe, expect, it } from 'vitest'
import { sanitizeHtml } from '../sanitizeHtml'

describe('sanitizeHtml', () => {
	it('conserve le balisage des notes de release', () => {
		const html = '<h2>v1.1.6</h2><table><tbody><tr><td>- fix <a href="https://github.com/org/repo/pull/1">#1</a></td></tr></tbody></table>'

		expect(sanitizeHtml(html)).toBe(html)
	})

	it('supprime les scripts et leur contenu', () => {
		expect(sanitizeHtml('<p>a</p><script>alert(1)</script>')).toBe('<p>a</p>')
	})

	it('supprime les attributs de gestionnaire d\'événement', () => {
		expect(sanitizeHtml('<img src="https://x.test/a.png" onerror="alert(1)">')).toBe('<img src="https://x.test/a.png">')
	})

	it('supprime les URL javascript:', () => {
		expect(sanitizeHtml('<a href=" JaVaScRiPt:alert(1)">lien</a>')).toBe('<a>lien</a>')
	})

	it('supprime les styles, qui permettraient de modifier la mise en page', () => {
		expect(sanitizeHtml('<td style="position: fixed">a</td>')).not.toContain('style')
	})

	it('remplace les balises non autorisées par leur contenu texte', () => {
		expect(sanitizeHtml('<p><span class="x"><button>ok</button></span></p>')).toBe('<p>ok</p>')
	})

	it('supprime les contenus SVG et MathML', () => {
		expect(sanitizeHtml('<p>a</p><svg><a href="javascript:alert(1)"><text>x</text></a></svg>')).toBe('<p>a</p>')
	})
})
