import { describe, it, expect, vi } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'

import Accordion from '../Accordion.vue'
import { config } from '../config'

// Constante pour l'événement, doit correspondre à celle dans le composant
const ACCORDION_FOCUS_EVENT = 'accordion-focus-changed'

describe('Accordion', () => {
	const defaultItems = [
		{ id: 'item1', title: 'Section 1', content: 'Contenu de la section 1' },
		{ id: 'item2', title: 'Section 2', content: 'Contenu de la section 2' },
		{
			id: 'item3',
			title: 'Section 3',
			content: {
				title: 'Sous-titre de la section 3',
				content: 'Contenu détaillé de la section 3',
			},
		},
	]

	it('renders correctly', () => {
		const wrapper = shallowMount(Accordion, {
			propsData: {
				items: defaultItems,
				headingLevel: 2,
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})

	it('renders the correct number of accordion items', () => {
		const wrapper = mount(Accordion, {
			propsData: {
				items: defaultItems,
				headingLevel: 2,
			},
		})

		const accordionItems = wrapper.findAll('.sy-accordion-item')
		expect(accordionItems.length).toBe(defaultItems.length)
	})

	it('uses the correct heading level', () => {
		const headingLevel = 3
		const wrapper = mount(Accordion, {
			propsData: {
				items: defaultItems,
				headingLevel,
			},
		})

		const heading = wrapper.find(`h${headingLevel}`)
		expect(heading.exists()).toBe(true)
	})

	it('toggles content visibility when button is clicked', async () => {
		const wrapper = mount(Accordion, {
			propsData: {
				items: defaultItems,
				headingLevel: 2,
			},
		})

		let openContent = wrapper.find('.sy-accordion-content--open')
		expect(openContent.exists()).toBe(false)

		const firstButton = wrapper.find('.sy-accordion-button')
		await firstButton.trigger('click')

		openContent = wrapper.find('.sy-accordion-content--open')
		expect(openContent.exists()).toBe(true)

		await firstButton.trigger('click')

		openContent = wrapper.find('.sy-accordion-content--open')
		expect(openContent.exists()).toBe(false)
	})

	it('renders string content correctly', () => {
		const wrapper = mount(Accordion, {
			propsData: {
				items: [defaultItems[0]],
				headingLevel: 2,
			},
		})

		const button = wrapper.find('.sy-accordion-button')
		button.trigger('click')

		const content = wrapper.find('.sy-accordion-content-inner')
		expect(content.text()).toContain(defaultItems[0].content)
	})

	it('renders object content correctly', async () => {
		const wrapper = mount(Accordion, {
			propsData: {
				items: [defaultItems[2]],
				headingLevel: 2,
			},
		})

		const button = wrapper.find('.sy-accordion-button')
		await button.trigger('click')

		const contentLine = wrapper.find('.sy-accordion-content-line')
		const objectContent = defaultItems[2].content as { title: string, content: string }
		expect(contentLine.text()).toContain(objectContent.title)
		expect(contentLine.text()).toContain(objectContent.content)
	})

	it('has correct accessibility attributes', () => {
		const wrapper = mount(Accordion, {
			propsData: {
				items: defaultItems,
				headingLevel: 2,
			},
		})

		const button = wrapper.find('.sy-accordion-button')
		expect(button.attributes('aria-expanded')).toBe('false')
		expect(button.attributes('aria-controls')).toBeDefined()
		expect(button.attributes('role')).toBe('button')
		expect(button.attributes('tabindex')).toBe('0')

		const contentRegion = wrapper.find('[role="region"]')
		expect(contentRegion.attributes('role')).toBe('region')
		expect(contentRegion.attributes('aria-labelledby')).toBeDefined()
		expect(contentRegion.attributes('tabindex')).toBe('-1') // Contenu fermé par défaut

		const buttonId = button.attributes('id')
		expect(contentRegion.attributes('aria-labelledby')).toBe(buttonId)
	})

	it('updates aria-expanded attribute when toggled', async () => {
		const wrapper = mount(Accordion, {
			propsData: {
				items: defaultItems,
				headingLevel: 2,
			},
		})

		const button = wrapper.find('.sy-accordion-button')
		expect(button.attributes('aria-expanded')).toBe('false')

		await button.trigger('click')
		expect(button.attributes('aria-expanded')).toBe('true')

		await button.trigger('click')
		expect(button.attributes('aria-expanded')).toBe('false')
	})

	it('applies focus style when accordion is opened', async () => {
		const wrapper = mount(Accordion, {
			propsData: {
				items: defaultItems,
				headingLevel: 2,
			},
		})

		const button = wrapper.find('.sy-accordion-button')
		expect(button.classes()).not.toContain('sy-accordion-button--focused')

		// Ouvrir l'accordéon - cela devrait définir le focus
		await button.trigger('click')
		expect(button.classes()).toContain('sy-accordion-button--focused')

		// Fermer l'accordéon - le focus devrait être supprimé car c'est le même élément
		await button.trigger('click')
		expect(button.classes()).not.toContain('sy-accordion-button--focused')
	})

	it('handles multiple accordions with the same groupId', async () => {
		// Simuler un événement de focus pour tester la communication entre instances
		const mockEvent = new CustomEvent('accordion-focus-changed', {
			bubbles: true,
			detail: {
				sourceInstanceId: 'test-instance',
				groupId: 'test-group',
				itemId: 'item2', // Utiliser un ID différent pour simuler un autre accordéon
			},
		})

		const wrapper = mount(Accordion, {
			propsData: {
				items: defaultItems,
				headingLevel: 2,
				groupId: 'test-group',
			},
		})

		// Ouvrir le premier accordéon pour qu'il ait le focus
		const firstButton = wrapper.find('.sy-accordion-button')
		await firstButton.trigger('click')
		expect(firstButton.classes()).toContain('sy-accordion-button--focused')

		// Simuler un événement d'une autre instance qui définit le focus sur un autre élément
		window.dispatchEvent(mockEvent)

		// Forcer la mise à jour du composant
		await wrapper.vm.$nextTick()

		// Vérifier que le focus a été supprimé du premier élément
		expect(firstButton.classes()).not.toContain('sy-accordion-button--focused')
	})

	it('applies primary color to the title', () => {
		const wrapper = mount(Accordion, {
			propsData: {
				items: defaultItems,
				headingLevel: 2,
			},
		})

		const titleElement = wrapper.find('.sy-accordion-title')
		expect(titleElement.exists()).toBe(true)

		// Vérifier que la classe CSS pour la couleur primaire est appliquée
		expect(titleElement.classes()).toContain('sy-accordion-title')
	})

	it('updates tabindex when accordion is opened', async () => {
		const wrapper = mount(Accordion, {
			propsData: {
				items: defaultItems,
				headingLevel: 2,
			},
		})

		const button = wrapper.find('.sy-accordion-button')
		let contentRegion = wrapper.find('[role="region"]')

		// Vérifier que le tabindex est -1 lorsque l'accordéon est fermé
		expect(contentRegion.attributes('tabindex')).toBe('-1')

		// Ouvrir l'accordéon
		await button.trigger('click')

		// Vérifier que le tabindex est 0 lorsque l'accordéon est ouvert
		contentRegion = wrapper.find('[role="region"]')
		expect(contentRegion.attributes('tabindex')).toBe('0')
	})

	it('renders semantic content structure for accessibility', async () => {
		const wrapper = mount(Accordion, {
			propsData: {
				items: [
					{ id: 'item1', title: 'Section 1', content: 'Contenu de la section 1' },
					{
						id: 'item2',
						title: 'Section 2',
						content: {
							title: 'Sous-titre',
							content: 'Contenu détaillé',
						},
					},
				],
				headingLevel: 2,
			},
		})

		// Ouvrir le premier accordéon (contenu string)
		const firstButton = wrapper.findAll('.sy-accordion-button')[0]
		await firstButton.trigger('click')

		// Vérifier que le contenu string est rendu dans un élément p
		const firstContent = wrapper.findAll('.sy-accordion-content-inner')[0]
		const paragraph = firstContent.find('p.sy-accordion-content-text')
		expect(paragraph.exists()).toBe(true)
		expect(paragraph.text()).toBe('Contenu de la section 1')

		// Ouvrir le deuxième accordéon (contenu objet)
		const secondButton = wrapper.findAll('.sy-accordion-button')[1]
		await secondButton.trigger('click')

		// Vérifier que le contenu objet est rendu avec la structure appropriée
		const secondContent = wrapper.findAll('.sy-accordion-content-inner')[1]
		const contentLine = secondContent.find('.sy-accordion-content-line')
		expect(contentLine.exists()).toBe(true)
		expect(contentLine.find('strong').exists()).toBe(true)
		expect(contentLine.find('strong').text()).toBe('Sous-titre')
		expect(contentLine.text()).toContain('Contenu détaillé')
	})

	it('applies custom colors from options', async () => {
		const customOptions = {
			vuetifyOptions: {
				accordion: {
					titleColor: 'error',
					hoverColor: 'warning',
					focusColor: 'secondary',
					activeColor: 'success',
					backgroundColor: 'grey-lighten-3',
				},
			},
		}

		const wrapper = mount(Accordion, {
			propsData: {
				items: defaultItems,
				headingLevel: 2,
				...customOptions,
			},
		})

		// Vérifier que le style contient les variables CSS avec les bonnes valeurs
		const accordionElement = wrapper.find('.sy-accordion')
		const styleAttr = accordionElement.attributes('style')

		expect(styleAttr).toContain(`--accordion-hover-color: var(--v-theme-${customOptions.vuetifyOptions.accordion.hoverColor})`)
		expect(styleAttr).toContain(`--accordion-focus-color: var(--v-theme-${customOptions.vuetifyOptions.accordion.focusColor})`)
		expect(styleAttr).toContain(`--accordion-active-color: var(--v-theme-${customOptions.vuetifyOptions.accordion.activeColor})`)

		// Vérifier que la classe de couleur de fond est appliquée
		const accordionItems = wrapper.findAll('.sy-accordion-item')
		accordionItems.forEach((item) => {
			expect(item.classes()).toContain(`bg-${customOptions.vuetifyOptions.accordion.backgroundColor}`)
		})

		// Vérifier que la classe de couleur du titre est appliquée
		const title = wrapper.find('.sy-accordion-title')
		expect(title.classes()).toContain(`text-${customOptions.vuetifyOptions.accordion.titleColor}`)

		// Ouvrir l'accordéon et vérifier que la couleur active est appliquée
		const button = wrapper.find('.sy-accordion-button')
		await button.trigger('click')

		// Après l'ouverture, le titre devrait avoir la classe de couleur active
		const titleAfterClick = wrapper.find('.sy-accordion-title')
		expect(titleAfterClick.classes()).toContain(`text-${customOptions.vuetifyOptions.accordion.activeColor}`)
	})

	it('uses default colors from config when no custom options are provided', () => {
		const wrapper = mount(Accordion, {
			propsData: {
				items: defaultItems,
				headingLevel: 2,
			},
		})

		// Vérifier que le style contient les variables CSS avec les valeurs par défaut
		const accordionElement = wrapper.find('.sy-accordion')
		const styleAttr = accordionElement.attributes('style')

		expect(styleAttr).toContain(`--accordion-hover-color: var(--v-theme-${config.accordion.hoverColor})`)
		expect(styleAttr).toContain(`--accordion-focus-color: var(--v-theme-${config.accordion.focusColor})`)
		expect(styleAttr).toContain(`--accordion-active-color: var(--v-theme-${config.accordion.activeColor})`)

		// Vérifier que la classe de couleur de fond est appliquée
		const accordionItems = wrapper.findAll('.sy-accordion-item')
		accordionItems.forEach((item) => {
			expect(item.classes()).toContain(`bg-${config.accordion.backgroundColor}`)
		})

		// Vérifier que la classe de couleur du titre est appliquée
		const title = wrapper.find('.sy-accordion-title')
		expect(title.classes()).toContain(`text-${config.accordion.titleColor}`)
	})

	it('can open multiple accordions simultaneously', async () => {
		const wrapper = mount(Accordion, {
			propsData: {
				items: defaultItems,
				headingLevel: 2,
			},
		})

		const buttons = wrapper.findAll('.sy-accordion-button')
		expect(buttons.length).toBeGreaterThan(1) // S'assurer qu'il y a plusieurs boutons

		// Ouvrir le premier accordéon
		await buttons[0].trigger('click')
		expect(wrapper.findAll('.sy-accordion-content--open').length).toBe(1)

		// Ouvrir le deuxième accordéon
		await buttons[1].trigger('click')
		expect(wrapper.findAll('.sy-accordion-content--open').length).toBe(2)

		// Vérifier que les deux accordéons sont ouverts
		const openContents = wrapper.findAll('.sy-accordion-content--open')
		expect(openContents.length).toBe(2)
	})

	it('transfers focus correctly when clicking on different accordion items', async () => {
		const wrapper = mount(Accordion, {
			propsData: {
				items: defaultItems,
				headingLevel: 2,
			},
		})

		const buttons = wrapper.findAll('.sy-accordion-button')
		expect(buttons.length).toBeGreaterThan(1) // S'assurer qu'il y a plusieurs boutons

		// Ouvrir le premier accordéon - il devrait avoir le focus
		await buttons[0].trigger('click')
		expect(buttons[0].classes()).toContain('sy-accordion-button--focused')
		expect(buttons[1].classes()).not.toContain('sy-accordion-button--focused')

		// Ouvrir le deuxième accordéon - le focus devrait être transféré
		await buttons[1].trigger('click')
		expect(buttons[0].classes()).not.toContain('sy-accordion-button--focused')
		expect(buttons[1].classes()).toContain('sy-accordion-button--focused')

		// Fermer le deuxième accordéon - le focus devrait être supprimé
		await buttons[1].trigger('click')
		expect(buttons[1].classes()).not.toContain('sy-accordion-button--focused')
	})

	it('removes event listener on component unmount', async () => {
		// Espionner window.removeEventListener
		const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

		// Monter le composant
		const wrapper = mount(Accordion, {
			propsData: {
				items: defaultItems,
				headingLevel: 2,
			},
		})

		// Démonter le composant
		await wrapper.unmount()

		// Vérifier que removeEventListener a été appelé avec le bon événement
		expect(removeEventListenerSpy).toHaveBeenCalledWith(
			ACCORDION_FOCUS_EVENT,
			expect.any(Function),
		)

		// Restaurer le spy
		removeEventListenerSpy.mockRestore()
	})
})
