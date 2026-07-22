import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { mdiPencil } from '@mdi/js'
import SyIcon from '../SyIcon.vue'

// La directive `rgaa-svg-fix` (qui pose `tabindex="0"` sur une icône `role="button"` au runtime)
// n'est pas fiable en jsdom : comme les autres specs de SyIcon, on la stube. Le rendu du ring et la
// focusabilité réelle sont couverts par le visuel. On valide ici le contrat au niveau du template :
// le ring DS scoped cible `.v-icon[role="button"]`, donc SyIcon doit exposer ce `role` — et
// seulement ce role — pour une icône interactive.
const stubbedDirective = { directives: { 'rgaa-svg-fix': () => {} } }

describe('SyIcon - Focus', () => {
	it('exposes role="button" (the DS ring target) for an interactive icon', () => {
		const wrapper = mount(SyIcon, {
			props: { icon: mdiPencil, decorative: false, label: 'Éditer', role: 'button' },
			global: stubbedDirective,
		})

		const icon = wrapper.find('.v-icon')
		expect(icon.attributes('role')).toBe('button')
		expect(icon.attributes('aria-label')).toBe('Éditer')
		expect(icon.attributes('aria-hidden')).toBeUndefined()
	})

	it('does not expose the button role on a decorative icon', () => {
		const wrapper = mount(SyIcon, {
			props: { icon: mdiPencil, decorative: true },
			global: stubbedDirective,
		})

		const icon = wrapper.find('.v-icon')
		expect(icon.attributes('role')).toBeUndefined()
		expect(icon.attributes('aria-hidden')).toBe('true')
	})

	it('does not expose the button role on an informative (img) icon', () => {
		const wrapper = mount(SyIcon, {
			props: { icon: mdiPencil, decorative: false, label: 'Information', role: 'img' },
			global: stubbedDirective,
		})

		const icon = wrapper.find('.v-icon')
		expect(icon.attributes('role')).toBe('img')
	})
})
