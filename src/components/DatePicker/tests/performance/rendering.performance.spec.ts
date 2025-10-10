/* eslint-disable @typescript-eslint/no-explicit-any -- tests de performance nécessitent des types flexibles */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import { vuetify } from '../../../../../tests/unit/setup'
import CalendarModeDatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
import ComplexDatePicker from '@/components/DatePicker/ComplexDatePicker/ComplexDatePicker.vue'
import DateTextInput from '@/components/DatePicker/DateTextInput/DateTextInput.vue'

/**
 * Tests de performance de rendu pour les DatePicker multi-composants
 *
 * Couvre :
 * - Performance de rendu initial
 * - Performance des re-rendus
 * - Optimisation des updates DOM
 * - Performance des animations et transitions
 */

describe('DatePicker - Tests de Performance de Rendu', () => {
	let wrappers: any[]

	beforeEach(() => {
		vi.clearAllMocks()
		wrappers = []
	})

	afterEach(() => {
		// Cleanup de toutes les instances
		wrappers.forEach((wrapper) => {
			if (wrapper && wrapper.unmount) {
				wrapper.unmount()
			}
		})
		wrappers = []
	})

	describe('Tests de Performance de Rendu Initial', () => {
		it('doit rendre rapidement un DateTextInput simple', async () => {
			const startTime = performance.now()

			const wrapper = mount(DateTextInput, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Test rendu rapide',
					format: 'DD/MM/YYYY',
				},
			})
			wrappers.push(wrapper)

			await nextTick()
			const renderTime = performance.now() - startTime

			// Vérifier que le composant est rendu
			expect(wrapper.exists()).toBe(true)
			expect(wrapper.find('input').exists()).toBe(true)

			// Performance : rendu initial < 100ms
			expect(renderTime).toBeLessThan(100)
		})

		it('doit rendre rapidement un ComplexDatePicker avec règles', async () => {
			const customRules = [
				{
					type: 'notBeforeDate',
					options: {
						date: '2024-01-01',
						message: 'Date trop ancienne',
					},
				},
				{
					type: 'notAfterDate',
					options: {
						date: '2024-12-31',
						message: 'Date trop récente',
					},
				},
			]

			const startTime = performance.now()

			const wrapper = mount(ComplexDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Test rendu complexe',
					customRules,
					useCombinedMode: true,
				},
			})
			wrappers.push(wrapper)

			await nextTick()
			const renderTime = performance.now() - startTime

			// Vérifier que le composant est rendu
			expect(wrapper.exists()).toBe(true)

			// Performance : rendu complexe < 200ms
			expect(renderTime).toBeLessThan(200)
		})

		it('doit rendre rapidement un CalendarMode avec calendrier', async () => {
			const startTime = performance.now()

			const wrapper = mount(CalendarModeDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Test rendu calendrier',
				},
			})
			wrappers.push(wrapper)

			await nextTick()
			const renderTime = performance.now() - startTime

			// Vérifier que le composant est rendu
			expect(wrapper.exists()).toBe(true)

			// Performance : rendu calendrier < 300ms
			expect(renderTime).toBeLessThan(300)
		})
	})

	describe('Tests de Performance de Re-rendu', () => {
		it('doit optimiser les re-rendus lors de changements de valeur', async () => {
			const wrapper = mount(DateTextInput, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Test re-rendu',
				},
			})
			wrappers.push(wrapper)

			await nextTick()

			// Mesurer le temps de 100 changements de valeur
			const startTime = performance.now()

			for (let i = 0; i < 100; i++) {
				await wrapper.setProps({
					modelValue: `${(i % 28) + 1}/06/2024`,
				})
			}

			await nextTick()
			const updateTime = performance.now() - startTime

			// Vérifier que le composant fonctionne toujours
			expect(wrapper.exists()).toBe(true)

			// Performance : 100 updates < 1.5 secondes (ajusté pour l'environnement de test)
			expect(updateTime).toBeLessThan(1500)
		})

		it('doit optimiser les re-rendus lors de changements de règles', async () => {
			const baseRules = [
				{
					type: 'notBeforeDate',
					options: {
						date: '2024-01-01',
						message: 'Date trop ancienne',
					},
				},
			]

			const wrapper = mount(ComplexDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: '15/06/2024',
					label: 'Test re-rendu règles',
					customRules: baseRules,
				},
			})
			wrappers.push(wrapper)

			await nextTick()

			// Mesurer le temps de changements de règles
			const startTime = performance.now()

			for (let i = 0; i < 50; i++) {
				const newRules = [
					{
						type: 'notBeforeDate',
						options: {
							date: `2024-${String((i % 12) + 1).padStart(2, '0')}-01`,
							message: `Date trop ancienne ${i}`,
						},
					},
				]

				await wrapper.setProps({ customRules: newRules })
			}

			await nextTick()
			const rulesUpdateTime = performance.now() - startTime

			// Vérifier que le composant fonctionne toujours
			expect(wrapper.exists()).toBe(true)

			// Performance : 50 changements de règles < 2 secondes
			expect(rulesUpdateTime).toBeLessThan(2000)
		})

		it('doit optimiser les re-rendus avec des props réactives', async () => {
			const reactiveLabel = ref('Label initial')
			const reactivePlaceholder = ref('Placeholder initial')
			const reactiveFormat = ref('DD/MM/YYYY')

			const wrapper = mount(DateTextInput, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: reactiveLabel.value,
					placeholder: reactivePlaceholder.value,
					format: reactiveFormat.value,
				},
			})
			wrappers.push(wrapper)

			await nextTick()

			// Mesurer le temps de changements réactifs
			const startTime = performance.now()

			for (let i = 0; i < 200; i++) {
				reactiveLabel.value = `Label ${i}`
				reactivePlaceholder.value = `Placeholder ${i}`
				reactiveFormat.value = i % 2 === 0 ? 'DD/MM/YYYY' : 'MM/DD/YYYY'

				await wrapper.setProps({
					label: reactiveLabel.value,
					placeholder: reactivePlaceholder.value,
					format: reactiveFormat.value,
				})

				// Re-rendu tous les 10 changements
				if (i % 10 === 0) {
					await nextTick()
				}
			}

			await nextTick()
			const reactiveUpdateTime = performance.now() - startTime

			// Vérifier que le composant fonctionne toujours
			expect(wrapper.exists()).toBe(true)

			// Performance : 200 changements réactifs < 3 secondes
			expect(reactiveUpdateTime).toBeLessThan(3000)
		})
	})

	describe('Tests de Performance DOM', () => {
		it('doit minimiser les manipulations DOM lors de validations', async () => {
			const wrapper = mount(DateTextInput, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Test DOM optimisation',
					customRules: [
						{
							type: 'custom',
							options: {
								validate: (value: string) => {
									if (!value) return true
									return new Date(value).getFullYear() >= 2020
								},
								message: 'Date trop ancienne',
							},
						},
					],
				},
			})
			wrappers.push(wrapper)

			await nextTick()

			// Observer les mutations DOM
			let mutationCount = 0
			const observer = new MutationObserver(() => {
				mutationCount++
			})

			observer.observe(wrapper.element, {
				childList: true,
				subtree: true,
				attributes: true,
			})

			const startTime = performance.now()

			// Effectuer de nombreuses validations
			for (let i = 0; i < 50; i++) {
				await wrapper.setProps({
					modelValue: `${(i % 28) + 1}/06/2024`,
				})
				wrapper.vm.validateOnSubmit()
			}

			await nextTick()
			const validationTime = performance.now() - startTime

			observer.disconnect()

			// Vérifier que le composant fonctionne
			expect(wrapper.exists()).toBe(true)

			// Performance : validations < 1 seconde
			expect(validationTime).toBeLessThan(1000)

			// Les mutations DOM doivent être raisonnables (< 200 pour 50 validations)
			expect(mutationCount).toBeLessThan(200)
		})

		it('doit optimiser le rendu de nombreux messages de validation', async () => {
			// Créer de nombreuses règles qui génèrent des messages
			const manyRules = []
			for (let i = 0; i < 20; i++) {
				manyRules.push({
					type: 'custom',
					options: {
						validate: () => false, // Toujours échouer pour générer des messages
						message: `Message d'erreur ${i}`,
					},
				})
			}

			const startTime = performance.now()

			const wrapper = mount(ComplexDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: '15/06/2024',
					label: 'Test nombreux messages',
					customRules: manyRules,
				},
			})
			wrappers.push(wrapper)

			await nextTick()

			// Déclencher la validation pour afficher tous les messages
			wrapper.vm.validateOnSubmit()
			await nextTick()

			const renderTime = performance.now() - startTime

			// Vérifier que le composant est rendu
			expect(wrapper.exists()).toBe(true)

			// Performance : rendu avec nombreux messages < 500ms
			expect(renderTime).toBeLessThan(500)
		})
	})

	describe('Tests de Performance d\'Animation', () => {
		it('doit gérer efficacement les transitions de calendrier', async () => {
			const wrapper = mount(CalendarModeDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Test transitions',
				},
			})
			wrappers.push(wrapper)

			await nextTick()

			const startTime = performance.now()

			// Simuler l'ouverture/fermeture du calendrier plusieurs fois
			for (let i = 0; i < 10; i++) {
				// Ouvrir le calendrier
				const input = wrapper.find('input')
				if (input.exists()) {
					await input.trigger('focus')
					await nextTick()

					// Fermer le calendrier
					await input.trigger('blur')
					await nextTick()
				}
			}

			const transitionTime = performance.now() - startTime

			// Vérifier que le composant fonctionne
			expect(wrapper.exists()).toBe(true)

			// Performance : 10 cycles ouverture/fermeture < 2 secondes
			expect(transitionTime).toBeLessThan(2000)
		})

		it('doit optimiser les animations de validation', async () => {
			const wrapper = mount(DateTextInput, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Test animations validation',
					customRules: [
						{
							type: 'custom',
							options: {
								validate: (value: string) => {
									if (!value) return true
									// Alternativement valide/invalide pour déclencher des animations
									return new Date(value).getDate() % 2 === 0
								},
								message: 'Jour impair non autorisé',
							},
						},
					],
				},
			})
			wrappers.push(wrapper)

			await nextTick()

			const startTime = performance.now()

			// Alterner entre valeurs valides et invalides
			for (let i = 1; i <= 30; i++) {
				await wrapper.setProps({
					modelValue: `${String(i).padStart(2, '0')}/06/2024`,
				})
				wrapper.vm.validateOnSubmit()
				await nextTick()
			}

			const animationTime = performance.now() - startTime

			// Vérifier que le composant fonctionne
			expect(wrapper.exists()).toBe(true)

			// Performance : 30 animations de validation < 1.5 secondes
			expect(animationTime).toBeLessThan(1500)
		})
	})

	describe('Tests de Performance Multi-Composants', () => {
		it('doit rendre efficacement de nombreux composants simultanément', async () => {
			const startTime = performance.now()

			// Créer un mélange de différents types de composants
			const componentTypes = [DateTextInput, ComplexDatePicker, CalendarModeDatePicker]

			for (let i = 0; i < 30; i++) {
				const ComponentType = componentTypes[i % 3]
				const wrapper = mount(ComponentType, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: `Multi-composant ${i}`,
					},
				})
				wrappers.push(wrapper)
			}

			await nextTick()
			const multiRenderTime = performance.now() - startTime

			// Vérifier que tous les composants sont rendus
			expect(wrappers).toHaveLength(30)
			wrappers.forEach((wrapper) => {
				expect(wrapper.exists()).toBe(true)
			})

			// Performance : 30 composants mixtes < 3 secondes
			expect(multiRenderTime).toBeLessThan(3000)
		})

		it('doit optimiser les updates simultanés sur plusieurs composants', async () => {
			// Créer 15 composants DateTextInput
			for (let i = 0; i < 15; i++) {
				const wrapper = mount(DateTextInput, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: `Simultané ${i}`,
					},
				})
				wrappers.push(wrapper)
			}

			await nextTick()

			const startTime = performance.now()

			// Mettre à jour tous les composants simultanément
			const updatePromises = []
			for (let i = 0; i < wrappers.length; i++) {
				updatePromises.push(
					wrappers[i].setProps({
						modelValue: `${(i % 28) + 1}/06/2024`,
					}),
				)
			}

			await Promise.all(updatePromises)
			await nextTick()

			const simultaneousUpdateTime = performance.now() - startTime

			// Vérifier que tous les composants fonctionnent
			wrappers.forEach((wrapper) => {
				expect(wrapper.exists()).toBe(true)
			})

			// Performance : updates simultanés < 1 seconde (ajusté pour l'environnement de test)
			expect(simultaneousUpdateTime).toBeLessThan(1000)
		})

		it('doit maintenir de bonnes performances avec des interactions complexes', async () => {
			// Créer des composants avec des règles interdépendantes
			const dateA = ref('2024-06-01')
			const dateB = ref('2024-06-15')

			const wrapperA = mount(DateTextInput, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: dateA.value,
					label: 'Date A (interdépendante)',
					customRules: [
						{
							type: 'custom',
							options: {
								validate: (value: string) => {
									if (!value) return true
									return new Date(value) <= new Date(dateB.value)
								},
								message: 'A doit être avant B',
							},
						},
					],
				},
			})

			const wrapperB = mount(DateTextInput, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: dateB.value,
					label: 'Date B (interdépendante)',
					customRules: [
						{
							type: 'custom',
							options: {
								validate: (value: string) => {
									if (!value) return true
									return new Date(value) >= new Date(dateA.value)
								},
								message: 'B doit être après A',
							},
						},
					],
				},
			})

			wrappers.push(wrapperA, wrapperB)
			await nextTick()

			const startTime = performance.now()

			// Effectuer des changements interdépendants
			for (let i = 0; i < 50; i++) {
				const newDateA = `2024-06-${String((i % 15) + 1).padStart(2, '0')}`
				const newDateB = `2024-06-${String((i % 15) + 16).padStart(2, '0')}`

				dateA.value = newDateA
				dateB.value = newDateB

				await Promise.all([
					wrapperA.setProps({ modelValue: newDateA }),
					wrapperB.setProps({ modelValue: newDateB }),
				])

				// Valider les deux composants
				wrapperA.vm.validateOnSubmit()
				wrapperB.vm.validateOnSubmit()

				if (i % 10 === 0) {
					await nextTick()
				}
			}

			await nextTick()
			const complexInteractionTime = performance.now() - startTime

			// Vérifier que les composants fonctionnent
			expect(wrapperA.exists()).toBe(true)
			expect(wrapperB.exists()).toBe(true)

			// Performance : interactions complexes < 2 secondes
			expect(complexInteractionTime).toBeLessThan(2000)
		})
	})
})
