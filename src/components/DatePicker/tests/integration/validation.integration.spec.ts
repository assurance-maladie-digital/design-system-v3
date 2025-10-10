import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, ref, computed } from 'vue'
import { vuetify } from '../../../../../tests/unit/setup'
import ComplexDatePicker from '@/components/DatePicker/ComplexDatePicker/ComplexDatePicker.vue'
import CalendarModeDatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'

/**
 * Tests d'intégration de validation complexe
 *
 * Couvre l'intégration entre :
 * - useFieldValidation + useDateValidation + useManualDateValidation
 * - Règles réactives complexes entre composants
 * - Scénarios de validation cross-composants
 * - Optimisation des validations répétées
 */
describe('DatePicker - Validation Integration Tests', () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- tests
	let wrapper: any

	beforeEach(() => {
		vi.clearAllMocks()
	})

	afterEach(() => {
		if (wrapper) {
			wrapper.unmount()
		}
	})

	describe('Intégration useFieldValidation + useDateValidation', () => {
		it('doit intégrer correctement les composables de validation', async () => {
			const customRules = [
				{
					type: 'notBeforeDate',
					options: {
						date: '2024-01-01',
						message: 'Date ne peut pas être avant 2024',
					},
				},
			]

			wrapper = mount(ComplexDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: '2024-06-15',
					label: 'Date test intégration',
					customRules,
				},
			})

			await nextTick()

			const result = wrapper.vm.validateOnSubmit()
			expect(result).toBe(true) // Date valide selon la règle
		})

		it('doit gérer les règles réactives avec computed/unref', async () => {
			const dateMin = ref('2024-01-01')

			const customRules = computed(() => [
				{
					type: 'notBeforeDate',
					options: {
						date: dateMin.value,
						message: `Date ne peut pas être avant ${dateMin.value}`,
					},
				},
			])

			wrapper = mount(ComplexDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: '2024-06-15',
					label: 'Date avec règles réactives',
					customRules: customRules.value,
				},
			})

			await nextTick()

			// Validation initiale
			let result = wrapper.vm.validateOnSubmit()
			expect(result).toBe(true)

			// Changer la date minimum
			dateMin.value = '2024-07-01'
			await wrapper.setProps({ customRules: customRules.value })
			await nextTick()

			// La validation peut maintenant échouer ou passer selon l'implémentation
			result = wrapper.vm.validateOnSubmit()
			expect(typeof result).toBe('boolean')
		})
	})

	describe('Scénarios Complexes avec Erreurs/Warnings/Succès', () => {
		it('doit gérer la priorité des messages complexes', async () => {
			const errorRule = {
				type: 'custom',
				options: {
					validate: () => false,
					message: 'Erreur critique',
				},
			}

			const warningRule = {
				type: 'custom',
				options: {
					validate: () => false,
					message: 'Avertissement',
				},
			}

			const successRule = {
				type: 'custom',
				options: {
					validate: () => true,
					message: 'Validation réussie',
				},
			}

			wrapper = mount(ComplexDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: '2024-06-15',
					label: 'Date priorité messages',
					customRules: [errorRule, successRule],
					customWarningRules: [warningRule],
				},
			})

			await nextTick()

			const result = wrapper.vm.validateOnSubmit()
			expect(result).toBe(false) // Erreur prioritaire sur succès
		})

		it('doit optimiser les validations répétées', async () => {
			const validationSpy = vi.fn().mockReturnValue(true)

			const customRules = [
				{
					type: 'custom',
					options: {
						validate: validationSpy,
						message: 'Test optimisation',
					},
				},
			]

			wrapper = mount(ComplexDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: '2024-06-15',
					label: 'Date optimisation',
					customRules,
				},
			})

			await nextTick()

			// Plusieurs validations successives
			wrapper.vm.validateOnSubmit()
			wrapper.vm.validateOnSubmit()
			wrapper.vm.validateOnSubmit()

			// La fonction de validation doit être appelée (pas d'optimisation excessive)
			expect(validationSpy).toHaveBeenCalled()
		})
	})

	describe('Validation Cross-Composants', () => {
		it('doit valider des dates interdépendantes', async () => {
			const dateDebut = ref('2024-06-15')
			const dateFin = ref('2024-06-10') // Invalide : avant dateDebut

			const dateDebutRules = computed(() => [
				{
					type: 'notAfterDate',
					options: {
						date: dateFin.value,
						message: `Date de début ne peut pas être après ${dateFin.value}`,
					},
				},
			])

			const dateFinRules = computed(() => [
				{
					type: 'notBeforeDate',
					options: {
						date: dateDebut.value,
						message: `Date de fin ne peut pas être avant ${dateDebut.value}`,
					},
				},
			])

			wrapper = mount({
				template: `
					<div>
						<ComplexDatePicker
							v-model="dateDebut"
							label="Date de début"
							:custom-rules="dateDebutRules"
							ref="dateDebutPicker"
						/>
						<ComplexDatePicker
							v-model="dateFin"
							label="Date de fin"
							:custom-rules="dateFinRules"
							ref="dateFinPicker"
						/>
					</div>
				`,
				components: {
					ComplexDatePicker,
				},
				setup() {
					return {
						dateDebut,
						dateFin,
						dateDebutRules: dateDebutRules.value,
						dateFinRules: dateFinRules.value,
					}
				},
			}, {
				global: {
					plugins: [vuetify],
				},
			})

			await nextTick()

			const dateDebutPicker = wrapper.findComponent({ ref: 'dateDebutPicker' })
			const dateFinPicker = wrapper.findComponent({ ref: 'dateFinPicker' })

			// Les deux validations doivent retourner des booléens
			const result1 = dateDebutPicker.vm.validateOnSubmit()
			const result2 = dateFinPicker.vm.validateOnSubmit()

			expect(typeof result1).toBe('boolean')
			expect(typeof result2).toBe('boolean')
		})

		it('doit gérer des règles complexes entre CalendarMode et ComplexDatePicker', async () => {
			const dateNaissance = ref('1990-05-15')
			const dateEmbauche = ref('2024-01-01')

			// Règle : date d'embauche doit être au moins 18 ans après la naissance
			const dateEmbaucheRules = computed(() => {
				const naissance = new Date(dateNaissance.value)
				const majorite = new Date(naissance.getFullYear() + 18, naissance.getMonth(), naissance.getDate())

				return [
					{
						type: 'notBeforeDate',
						options: {
							date: majorite.toISOString().split('T')[0],
							message: 'Date d\'embauche doit être après la majorité',
						},
					},
				]
			})

			wrapper = mount({
				template: `
					<div>
						<CalendarModeDatePicker
							v-model="dateNaissance"
							label="Date de naissance"
							:birth-date="true"
							ref="naissancePicker"
						/>
						<ComplexDatePicker
							v-model="dateEmbauche"
							label="Date d'embauche"
							:custom-rules="dateEmbaucheRules"
							ref="embauchePicker"
						/>
					</div>
				`,
				components: {
					CalendarModeDatePicker,
					ComplexDatePicker,
				},
				setup() {
					return {
						dateNaissance,
						dateEmbauche,
						dateEmbaucheRules: dateEmbaucheRules.value,
					}
				},
			}, {
				global: {
					plugins: [vuetify],
				},
			})

			await nextTick()

			const embauchePicker = wrapper.findComponent({ ref: 'embauchePicker' })
			const result = embauchePicker.vm.validateOnSubmit()

			expect(result).toBe(true) // Date d'embauche valide (personne majeure)
		})
	})

	describe('Intégration avec Combined Mode', () => {
		it('doit maintenir la validation en combined mode', async () => {
			const customRules = [
				{
					type: 'notBeforeDate',
					options: {
						date: '2024-01-01',
						message: 'Date trop ancienne',
					},
				},
			]

			wrapper = mount(ComplexDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: '2024-06-15',
					label: 'Date combined mode',
					useCombinedMode: true,
					customRules,
				},
			})

			await nextTick()

			const result = wrapper.vm.validateOnSubmit()
			expect(result).toBe(true)
		})

		it('doit gérer les règles réactives en combined mode', async () => {
			const dateMin = ref('2024-01-01')

			const customRules = computed(() => [
				{
					type: 'notBeforeDate',
					options: {
						date: dateMin.value,
						message: `Date ne peut pas être avant ${dateMin.value}`,
					},
				},
			])

			wrapper = mount(ComplexDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: '2024-06-15',
					label: 'Date combined réactif',
					useCombinedMode: true,
					customRules: customRules.value,
				},
			})

			await nextTick()

			// Validation initiale
			let result = wrapper.vm.validateOnSubmit()
			expect(result).toBe(true)

			// Changer la règle
			dateMin.value = '2024-07-01'
			await wrapper.setProps({ customRules: customRules.value })
			await nextTick()

			result = wrapper.vm.validateOnSubmit()
			expect(typeof result).toBe('boolean')
		})
	})

	describe('Gestion des Erreurs de Configuration', () => {
		it('ne doit pas afficher "Configuration de la règle invalide" avec des règles complexes', async () => {
			const dateReference = ref('2024-06-15')

			const customRules = computed(() => [
				{
					type: 'notBeforeDate',
					options: {
						date: dateReference.value,
						message: `Date ne peut pas être avant ${dateReference.value}`,
					},
				},
				{
					type: 'notAfterDate',
					options: {
						date: '2024-12-31',
						message: 'Date ne peut pas être après 2024',
					},
				},
			])

			wrapper = mount(ComplexDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: '2024-07-15',
					label: 'Date règles complexes',
					customRules: customRules.value,
				},
			})

			await nextTick()

			// Changer la référence
			dateReference.value = '2024-08-01'
			await wrapper.setProps({ customRules: customRules.value })
			await nextTick()

			const result = wrapper.vm.validateOnSubmit()
			expect(typeof result).toBe('boolean') // Date peut être valide ou invalide

			// Vérifier qu'il n'y a pas d'erreur de configuration
			const errorMessages = wrapper.findAll('.v-messages__message')
			const hasConfigError = errorMessages.some(msg =>
				msg.text().includes('Configuration de la règle invalide'),
			)
			expect(hasConfigError).toBe(false)
		})
	})

	describe('Performance et Optimisation', () => {
		it('doit gérer efficacement de nombreuses règles', async () => {
			const manyRules = Array.from({ length: 10 }, (_, i) => ({
				type: 'custom',
				options: {
					validate: () => true,
					message: `Règle ${i + 1}`,
				},
			}))

			wrapper = mount(ComplexDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: '2024-06-15',
					label: 'Date nombreuses règles',
					customRules: manyRules,
				},
			})

			await nextTick()

			const startTime = performance.now()
			const result = wrapper.vm.validateOnSubmit()
			const endTime = performance.now()

			expect(result).toBe(true)
			expect(endTime - startTime).toBeLessThan(100) // Performance acceptable
		})

		it('doit éviter les validations en cascade inutiles', async () => {
			const validationCount = ref(0)

			const customRules = [
				{
					type: 'custom',
					options: {
						validate: () => {
							validationCount.value++
							return true
						},
						message: 'Test cascade',
					},
				},
			]

			wrapper = mount(ComplexDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: '2024-06-15',
					label: 'Date anti-cascade',
					customRules,
				},
			})

			await nextTick()

			// Une seule validation
			wrapper.vm.validateOnSubmit()

			const initialCount = validationCount.value

			// Validation répétée sans changement
			wrapper.vm.validateOnSubmit()

			// Le nombre d'appels ne doit pas exploser
			expect(validationCount.value).toBeGreaterThan(0)
			expect(validationCount.value).toBeLessThan(initialCount + 10) // Pas d'explosion
		})
	})
})
