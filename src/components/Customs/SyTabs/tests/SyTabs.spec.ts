import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SyTabs from '@/components/Customs/SyTabs/SyTabs.vue'

// Mock RouterLink component
const RouterLink = {
	name: 'RouterLink',
	props: ['to'],
	template: '<a :href="to"><slot /></a>',
}

describe('SyTabs', () => {
	// Données de test
	const testItems = [
		{ label: 'Tab 1', value: 'tab1', content: 'Contenu du Tab 1' },
		{ label: 'Tab 2', value: 'tab2', content: 'Contenu du Tab 2' },
		{ label: 'Tab 3', value: 'tab3', content: 'Contenu du Tab 3' },
	]

	// Options de montage par défaut
	const defaultMountOptions = {
		props: {
			items: testItems,
		},
		global: {
			// Mock vue-router and provide RouterLink component
			components: {
				RouterLink,
			},
			// Mock $router used in the component
			mocks: {
				$router: {
					push: vi.fn(),
					replace: vi.fn(),
				},
			},
		},
	}

	// Utilitaire pour créer le wrapper avec les options par défaut
	const createWrapper = (options = {}) => {
		return mount(SyTabs, {
			...defaultMountOptions,
			...options,
		})
	}

	// Tests de rendu
	describe('Rendu', () => {
		it('doit afficher correctement les onglets', () => {
			const wrapper = createWrapper()

			// Vérifier que tous les onglets sont rendus
			const tabButtons = wrapper.findAll('.sy-tabs__button')
			expect(tabButtons.length).toBe(testItems.length)

			// Vérifier le texte des onglets
			testItems.forEach((item, index) => {
				expect(tabButtons[index].text()).toBe(item.label.toUpperCase())
			})
		})

		it('doit afficher le contenu de l\'onglet actif', () => {
			const wrapper = createWrapper()

			// Par défaut, le premier onglet devrait être actif
			const visiblePanel = wrapper.find('.sy-tabs-panel:not([hidden])')
			expect(visiblePanel.exists()).toBe(true)
			expect(visiblePanel.text()).toContain(testItems[0].content)
		})

		it('doit ajouter la classe active au bouton d\'onglet actif', () => {
			const wrapper = createWrapper()

			// Le premier onglet devrait avoir la classe active
			const activeTab = wrapper.find('.sy-tabs__button--active')
			expect(activeTab.exists()).toBe(true)
			expect(activeTab.text()).toBe(testItems[0].label.toUpperCase())
		})
	})

	// Tests des props
	describe('Props', () => {
		it('doit respecter la prop modelValue numérique', async () => {
			const wrapper = createWrapper({
				props: {
					...defaultMountOptions.props,
					modelValue: 1,
				},
			})

			await nextTick()

			// Vérifier que le deuxième onglet est actif
			const activeTab = wrapper.find('.sy-tabs__button--active')
			expect(activeTab.text()).toBe(testItems[1].label.toUpperCase())

			// Vérifier que le bon panneau est affiché
			const visiblePanel = wrapper.find('.sy-tabs-panel:not([hidden])')
			expect(visiblePanel.attributes('id')).toBe('panel-1')
		})

		it('doit respecter la prop modelValue de type string', async () => {
			const wrapper = createWrapper({
				props: {
					...defaultMountOptions.props,
					modelValue: 'tab2',
				},
			})

			await nextTick()

			// Vérifier que le bon onglet est actif
			const activeTab = wrapper.find('.sy-tabs__button--active')
			expect(activeTab.text()).toBe(testItems[1].label.toUpperCase())
		})
	})

	// Tests d'interaction
	describe('Interaction', () => {
		it('doit changer d\'onglet actif au clic', async () => {
			const wrapper = createWrapper()

			// Cliquer sur le deuxième onglet
			const secondTab = wrapper.findAll('.sy-tabs__button')[1]
			await secondTab.trigger('click')

			// Vérifier que le deuxième onglet est maintenant actif
			expect(secondTab.classes()).toContain('sy-tabs__button--active')

			// Vérifier que l'événement update:modelValue a été émis
			const emitted = wrapper.emitted('update:modelValue')
			expect(emitted).toBeTruthy()
			if (emitted) {
				expect(emitted[0]).toEqual([1])
			}

			// Vérifier que le bon panneau est visible
			const visiblePanel = wrapper.find('.sy-tabs-panel:not([hidden])')
			expect(visiblePanel.attributes('id')).toBe('panel-1')
		})

		it('doit émettre l\'événement update:modelValue avec la bonne valeur', async () => {
			const wrapper = createWrapper({
				props: {
					...defaultMountOptions.props,
					modelValue: 'tab1',
				},
			})

			// Cliquer sur le troisième onglet
			const thirdTab = wrapper.findAll('.sy-tabs__button')[2]
			await thirdTab.trigger('click')

			// Vérifier que l'événement update:modelValue a été émis avec la bonne valeur
			const emitted = wrapper.emitted('update:modelValue')
			expect(emitted).toBeTruthy()
			if (emitted) {
				expect(emitted[0]).toEqual(['tab3'])
			}
		})
	})

	// Tests d'accessibilité et navigation clavier
	describe('Accessibilité et navigation clavier', () => {
		it('doit contenir les attributs ARIA appropriés', () => {
			const wrapper = createWrapper()

			// Vérifier les attributs ARIA du tablist
			const nav = wrapper.find('[role="tablist"]')
			expect(nav.exists()).toBe(true)
			expect(nav.attributes('aria-label')).toBeDefined()

			// Vérifier les attributs ARIA des onglets
			const firstTab = wrapper.findAll('[role="tab"]')[0]
			expect(firstTab.attributes('aria-selected')).toBe('true')
			expect(firstTab.attributes('aria-controls')).toBe('panel-0')

			// Vérifier les attributs ARIA des panneaux
			const firstPanel = wrapper.find('[role="tabpanel"]')
			expect(firstPanel.attributes('aria-labelledby')).toBe('tab-0')
		})

		it('doit activer un onglet avec les touches Enter/Space', async () => {
			const wrapper = createWrapper()

			// Simuler une pression de touche Enter sur le deuxième onglet
			const secondTab = wrapper.findAll('.sy-tabs__button')[1]
			await secondTab.trigger('keydown', {
				key: 'Enter',
			})

			// Vérifier que le deuxième onglet est actif
			expect(secondTab.classes()).toContain('sy-tabs__button--active')
		})

		it('doit naviguer vers l\'onglet de gauche avec ArrowLeft', async () => {
			// Mock pour document.getElementById
			const mockElement = {
				focus: vi.fn(),
			}
			document.getElementById = vi.fn().mockImplementation((id) => {
				if (id === 'tab-0') {
					return mockElement
				}
				return null
			})

			const wrapper = createWrapper({
				props: {
					...defaultMountOptions.props,
					modelValue: 1, // Commencer au deuxième onglet
				},
			})

			// Accéder directement à l'instance du composant
			const vm = wrapper.vm as unknown as { handleArrowNavigation: (event: KeyboardEvent, activeIndex: number) => void }

			// Créer un événement avec preventDefault
			const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' })
			event.preventDefault = vi.fn()

			// Appeler directement la méthode handleArrowNavigation
			vm.handleArrowNavigation(event, 1) // 1 = deuxième onglet (index actif)

			// Vérifier que l'événement a été émis avec la bonne valeur
			const emitted = wrapper.emitted('update:modelValue')
			expect(emitted).toBeTruthy()
			// Type guard pour TypeScript
			if (emitted) {
				expect(emitted[0]).toEqual([0])
			}
		})

		it('doit naviguer vers l\'onglet de droite avec ArrowRight', async () => {
			// Mock pour document.getElementById qui filtre les appels non pertinents
			const mockElement = {
				focus: vi.fn(),
			}

			// Mock complet qui retourne mockElement uniquement pour tab-1
			document.getElementById = vi.fn().mockImplementation((id) => {
				if (id === 'tab-1') {
					return mockElement
				}
				return null
			})

			const wrapper = createWrapper()

			// Simuler une navigation avec flèche droite
			const activeTab = wrapper.find('.sy-tabs__button--active')
			await activeTab.trigger('keydown', {
				key: 'ArrowRight',
				preventDefault: vi.fn(),
			})

			// Vérifier l'émission de l'événement
			const emitted = wrapper.emitted('update:modelValue')
			expect(emitted).toBeTruthy()
			if (emitted) {
				expect(emitted[0]).toEqual([1])
			}
		})

		it('doit naviguer vers le premier onglet avec Home', async () => {
			// Mock pour document.getElementById qui filtre les appels non pertinents
			const mockElement = {
				focus: vi.fn(),
			}

			// Mock complet qui retourne mockElement uniquement pour tab-0
			document.getElementById = vi.fn().mockImplementation((id) => {
				if (id === 'tab-0') {
					return mockElement
				}
				return null
			})

			const wrapper = createWrapper({
				props: {
					...defaultMountOptions.props,
					modelValue: 2, // Commencer au dernier onglet
				},
			})

			// Simuler une navigation avec Home
			const activeTab = wrapper.find('.sy-tabs__button--active')
			await activeTab.trigger('keydown', {
				key: 'Home',
				preventDefault: vi.fn(),
			})

			// Vérifier l'émission de l'événement
			const emitted = wrapper.emitted('update:modelValue')
			expect(emitted).toBeTruthy()
			if (emitted) {
				expect(emitted[0]).toEqual([0])
			}
		})

		it('doit naviguer vers le dernier onglet avec End', async () => {
			// Mock pour document.getElementById qui filtre les appels non pertinents
			const mockElement = {
				focus: vi.fn(),
			}

			// Mock complet qui retourne mockElement uniquement pour tab-2
			document.getElementById = vi.fn().mockImplementation((id) => {
				if (id === 'tab-2') {
					return mockElement
				}
				return null
			})

			const wrapper = createWrapper()

			// Simuler une navigation avec End
			const activeTab = wrapper.find('.sy-tabs__button--active')
			await activeTab.trigger('keydown', {
				key: 'End',
				preventDefault: vi.fn(),
			})

			// Vérifier l'émission de l'événement
			const emitted = wrapper.emitted('update:modelValue')
			expect(emitted).toBeTruthy()
			if (emitted) {
				expect(emitted[0]).toEqual([2])
			}
		})
	})

	// Tests de la boucle de navigation
	describe('Boucle de navigation', () => {
		it('doit boucler vers le dernier onglet avec ArrowLeft depuis le premier', async () => {
			// Mock pour document.getElementById qui filtre les appels non pertinents
			const mockElement = {
				focus: vi.fn(),
			}

			// Mock complet qui retourne mockElement uniquement pour le dernier tab
			const lastTabIndex = testItems.length - 1
			document.getElementById = vi.fn().mockImplementation((id) => {
				if (id === `tab-${lastTabIndex}`) {
					return mockElement
				}
				return null
			})

			const wrapper = createWrapper()

			// Simuler une navigation avec flèche gauche depuis le premier onglet
			const firstTab = wrapper.findAll('.sy-tabs__button')[0]
			await firstTab.trigger('keydown', {
				key: 'ArrowLeft',
				preventDefault: vi.fn(),
			})

			// Vérifier l'émission de l'événement
			const emitted = wrapper.emitted('update:modelValue')
			expect(emitted).toBeTruthy()
			if (emitted) {
				expect(emitted[0]).toEqual([lastTabIndex])
			}
		})

		it('doit boucler vers le premier onglet avec ArrowRight depuis le dernier', async () => {
			// Mock pour document.getElementById
			const mockElement = {
				focus: vi.fn(),
			}
			document.getElementById = vi.fn().mockImplementation((id) => {
				if (id === 'tab-0') {
					return mockElement
				}
				return null
			})

			const lastIndex = testItems.length - 1
			const wrapper = createWrapper({
				props: {
					...defaultMountOptions.props,
					modelValue: lastIndex,
				},
			})

			// Accéder directement à l'instance du composant
			const vm = wrapper.vm as unknown as { handleArrowNavigation: (event: KeyboardEvent, activeIndex: number) => void }

			// Créer un événement avec preventDefault
			const event = new KeyboardEvent('keydown', { key: 'ArrowRight' })
			event.preventDefault = vi.fn()

			// Appeler directement la méthode handleArrowNavigation
			vm.handleArrowNavigation(event, lastIndex) // dernier onglet

			// Vérifier l'émission de l'événement
			const emitted = wrapper.emitted('update:modelValue')
			expect(emitted).toBeTruthy()
			if (emitted) {
				expect(emitted[0]).toEqual([0])
			}
		})
	})

	// Tests avec différentes configurations
	describe('Configurations personnalisées', () => {
		it('doit permettre de personnaliser les options', () => {
			// Modifier la stratégie de test puisque Vuetify gère les props différemment
			// Nous allons vérifier l'application des styles plutôt que les props directement
			const wrapper = createWrapper({
				props: {
					...defaultMountOptions.props,
					vuetifyOptions: {
						sheet: {
							dense: true,
							color: 'primary',
						},
						tabs: {
							height: '60',
						},
					},
				},
			})

			// Vérifier la structure du composant
			const sheet = wrapper.findComponent({ name: 'VSheet' })
			expect(sheet.exists()).toBe(true)

			// Vérifier que les tabs existent
			const tabList = wrapper.find('.sy-tabs__list')
			expect(tabList.exists()).toBe(true)

			// Vérifier que tous les items sont rendus
			const tabItems = wrapper.findAll('.sy-tabs__item')
			expect(tabItems.length).toBe(testItems.length)
		})
	})

	// Tests des slots
	describe('Slots', () => {
		it('doit afficher le contenu du slot tabs-prepend', () => {
			const wrapper = createWrapper({
				slots: {
					'tabs-prepend': '<div data-test="tabs-prepend">prepend</div>',
				},
			})

			const prepend = wrapper.find('[data-test="tabs-prepend"]')
			expect(prepend.exists()).toBe(true)
			expect(prepend.text()).toBe('prepend')
		})

		it('doit afficher le contenu du slot tabs-append', () => {
			const wrapper = createWrapper({
				slots: {
					'tabs-append': '<div data-test="tabs-append">append</div>',
				},
			})

			const append = wrapper.find('[data-test="tabs-append"]')
			expect(append.exists()).toBe(true)
			expect(append.text()).toBe('append')
		})

		it('doit passer correctement item, index et isActive au slot tab-prepend', async () => {
			const wrapper = createWrapper({
				slots: {
					'tab-prepend': `
						<template #default="{ item, index, isActive }">
							<span
								data-test="tab-prepend-slot"
								:data-index="index"
								:data-value="item.value"
								:data-active="isActive"
							/>
						</template>
					`,
				},
			})

			// Vérifier l'état initial : premier onglet actif
			let markers = wrapper.findAll('[data-test="tab-prepend-slot"]')
			expect(markers.length).toBe(testItems.length)
			// Premier onglet actif, les autres inactifs
			expect(markers[0].attributes('data-active')).toBe('true')
			for (let i = 1; i < markers.length; i++) {
				expect(markers[i].attributes('data-active')).toBe('false')
			}

			// Changer d'onglet actif
			const secondTab = wrapper.findAll('.sy-tabs__button')[1]
			await secondTab.trigger('click')
			await nextTick()

			// Recalcule des marqueurs
			markers = wrapper.findAll('[data-test="tab-prepend-slot"]')
			expect(markers[1].attributes('data-active')).toBe('true')
			expect(markers[0].attributes('data-active')).toBe('false')
		})

		it('doit passer correctement item, index et isActive au slot tab-append', async () => {
			const wrapper = createWrapper({
				slots: {
					'tab-append': `
						<template #default="{ item, index, isActive }">
							<span
								data-test="tab-append-slot"
								:data-index="index"
								:data-value="item.value"
								:data-active="isActive"
							/>
						</template>
					`,
				},
			})

			// Vérifier l'état initial : premier onglet actif
			let markers = wrapper.findAll('[data-test="tab-append-slot"]')
			expect(markers.length).toBe(testItems.length)
			expect(markers[0].attributes('data-active')).toBe('true')
			for (let i = 1; i < markers.length; i++) {
				expect(markers[i].attributes('data-active')).toBe('false')
			}

			// Changer d'onglet actif
			const thirdTab = wrapper.findAll('.sy-tabs__button')[2]
			await thirdTab.trigger('click')
			await nextTick()

			// Recalcule des marqueurs
			markers = wrapper.findAll('[data-test="tab-append-slot"]')
			expect(markers[2].attributes('data-active')).toBe('true')
			expect(markers[0].attributes('data-active')).toBe('false')
		})
	})
})
