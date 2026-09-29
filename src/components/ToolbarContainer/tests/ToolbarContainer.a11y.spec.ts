import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import { defineComponent } from 'vue'
import ToolbarContainer from '../ToolbarContainer.vue'

// Wrapper de test : le landmark `main` satisfait la règle axe `region`
// (tout contenu doit appartenir à un landmark). Sans lui, chaque montage
// direct dans `document.body` remonterait une violation parasite.
const mountInLandmark = (slotTemplate: string) => {
	const Host = defineComponent({
		components: { ToolbarContainer },
		template: `<main><ToolbarContainer>${slotTemplate}</ToolbarContainer></main>`,
	})

	return mount(Host, { attachTo: document.body })
}

// Scénario d'accessibilité : barre d'outils avec des boutons de navigation
// Le composant doit avoir un rôle toolbar et gérer la navigation au clavier
describe('ToolbarContainer – accessibility (axe)', () => {
	// Évite l'accumulation de plusieurs `<main>` dans le DOM entre les tests
	// (déclencherait `landmark-no-duplicate-main`).
	afterEach(() => {
		document.body.innerHTML = ''
	})

	it('should not have any axe violations with default buttons', async () => {
		const wrapper = mountInLandmark(`
            <VBtn>Action 1</VBtn>
            <VBtn>Action 2</VBtn>
            <VBtn>Action 3</VBtn>
        `)

		const results = await axe(wrapper.element)
		assertNoA11yViolations(results, 'ToolbarContainer with default buttons')
	})

	it('should not have any axe violations with custom content', async () => {
		const wrapper = mountInLandmark(`
            <div>
                <VBtn icon="mdi-plus" aria-label="Ajouter"></VBtn>
                <VBtn icon="mdi-minus" aria-label="Retirer"></VBtn>
                <button aria-label="Action personnalisée">Custom Button</button>
            </div>
        `)

		const results = await axe(wrapper.element)
		assertNoA11yViolations(results, 'ToolbarContainer with custom content')
	})

	it('should not have any axe violations with disabled buttons', async () => {
		const wrapper = mountInLandmark(`
            <VBtn>Action 1</VBtn>
            <VBtn disabled>Action 2</VBtn>
            <VBtn>Action 3</VBtn>
        `)

		const results = await axe(wrapper.element)
		assertNoA11yViolations(results, 'ToolbarContainer with disabled buttons')
	})

	it('should not have any axe violations with links and buttons', async () => {
		const wrapper = mountInLandmark(`
            <VBtn>Action Button</VBtn>
            <a href="#home" aria-label="Accueil">Home Link</a>
            <input type="text" placeholder="Rechercher" aria-label="Recherche" />
        `)

		const results = await axe(wrapper.element)
		assertNoA11yViolations(results, 'ToolbarContainer with mixed focusable elements')
	})

	it('should have proper toolbar role and attributes', async () => {
		const wrapper = mountInLandmark(`
            <VBtn>Action 1</VBtn>
            <VBtn>Action 2</VBtn>
        `)

		const toolbar = wrapper.find('.sy-toolbar')

		expect(toolbar.exists()).toBe(true)
		expect(toolbar.attributes('role')).toBe('toolbar')
		expect(toolbar.attributes('tabindex')).toBe('0')

		const results = await axe(wrapper.element)
		assertNoA11yViolations(results, 'ToolbarContainer role and attributes')
	})

	it('should handle keyboard navigation accessibility', async () => {
		const wrapper = mountInLandmark(`
            <VBtn>Action 1</VBtn>
            <VBtn>Action 2</VBtn>
            <VBtn>Action 3</VBtn>
        `)

		const toolbar = wrapper.find('.sy-toolbar')
		const buttons = wrapper.findAll('button.v-btn')

		// Vérifier que les boutons ont le tabindex approprié
		expect(buttons[0]?.attributes('tabindex')).toBe('-1')
		expect(buttons[1]?.attributes('tabindex')).toBe('-1')
		expect(buttons[2]?.attributes('tabindex')).toBe('-1')

		// Simuler le focus sur la toolbar
		await toolbar.trigger('focus')

		// Après le focus, le premier bouton devrait être focusable
		expect(buttons[0]?.attributes('tabindex')).toBe('0')

		const results = await axe(wrapper.element)
		assertNoA11yViolations(results, 'ToolbarContainer keyboard navigation')
	})
})
