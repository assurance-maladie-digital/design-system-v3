import { describe, expect, it } from 'vitest'
import { sanitizeItemHtml } from '../sanitizeItemHtml'

function render(html: string): string {
	const container = document.createElement('div')
	container.append(sanitizeItemHtml(html))
	return container.innerHTML
}

describe('sanitizeItemHtml', () => {
	it('keeps the allowed formatting tags', () => {
		expect(render('<b>a</b><strong>b</strong><em>c</em><i>d</i><span>e</span>'))
			.toBe('<b>a</b><strong>b</strong><em>c</em><i>d</i><span>e</span>')
	})

	it('keeps the title of an abbreviation, as rendered by PhoneField', () => {
		expect(render('+33 <abbr title="France">FRA</abbr>'))
			.toBe('+33 <abbr title="France">FRA</abbr>')
	})

	it('keeps the class of a span, to style an option', () => {
		expect(render('<span class="text-error">Option</span>'))
			.toBe('<span class="text-error">Option</span>')
	})

	it('removes the attributes that are not allowed', () => {
		expect(render('<span class="x" style="color:red" onclick="alert(1)">a</span><abbr title="t" class="x" onmouseover="alert(1)">b</abbr><b class="x">c</b>'))
			.toBe('<span class="x">a</span><abbr title="t">b</abbr><b>c</b>')
	})

	it('removes an image carrying an event handler', () => {
		expect(render('<img src="x" onerror="alert(1)">Option')).toBe('Option')
	})

	it('removes scripts, styles and frames with their content', () => {
		expect(render('<script>alert(1)</script><style>*{}</style><iframe></iframe>Option'))
			.toBe('Option')
	})

	it('keeps the text of tags that are not allowed', () => {
		expect(render('<a href="javascript:alert(1)">lien</a> <b><div>gras</div></b>'))
			.toBe('lien <b>gras</b>')
	})

	it('keeps escaped markup as text', () => {
		const fragment = sanitizeItemHtml('&lt;img src=x onerror=alert(1)&gt;')

		expect(fragment.querySelector('img')).toBeNull()
		expect(fragment.textContent).toBe('<img src=x onerror=alert(1)>')
	})

	it('drops comments', () => {
		expect(render('a<!-- <img src=x onerror=alert(1)> -->b')).toBe('ab')
	})
})
