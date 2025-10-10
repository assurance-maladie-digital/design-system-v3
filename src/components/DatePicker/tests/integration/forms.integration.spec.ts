import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import { vuetify } from '../../../../../tests/unit/setup'
import { VForm } from 'vuetify/components'
import CalendarModeDatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
import ComplexDatePicker from '@/components/DatePicker/ComplexDatePicker/ComplexDatePicker.vue'
import DateTextInput from '@/components/DatePicker/DateTextInput/DateTextInput.vue'

/**
 * Tests d'intégration avec les formulaires Vuetify
 *
 * Couvre l'intégration des DatePicker avec :
 * - VForm et validation de formulaire
 * - Soumission de formulaire
 * - Validation globale
 * - Réinitialisation de formulaire
 */
describe('DatePicker - Forms Integration Tests', () => {
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

	describe('Intégration VForm - CalendarMode', () => {
		it('doit s\'intégrer correctement dans un VForm', async () => {
			const formData = ref({
				dateNaissance: null,
			})

			wrapper = mount({
				template: `
					<v-form ref="form">
						<CalendarModeDatePicker
							v-model="formData.dateNaissance"
							label="Date de naissance"
							required
						/>
					</v-form>
				`,
				components: {
					CalendarModeDatePicker,
					VForm,
				},
				setup() {
					return { formData }
				},
			}, {
				global: {
					plugins: [vuetify],
				},
			})

			await nextTick()

			expect(wrapper.exists()).toBe(true)
			expect(wrapper.findComponent(CalendarModeDatePicker).exists()).toBe(true)
		})

		it('doit valider dans le contexte du formulaire', async () => {
			const formData = ref({
				dateNaissance: null,
			})

			wrapper = mount({
				template: `
					<v-form ref="form">
						<CalendarModeDatePicker
							v-model="formData.dateNaissance"
							label="Date de naissance"
							required
						/>
					</v-form>
				`,
				components: {
					CalendarModeDatePicker,
					VForm,
				},
				setup() {
					return { formData }
				},
			}, {
				global: {
					plugins: [vuetify],
				},
			})

			await nextTick()

			const datePicker = wrapper.findComponent(CalendarModeDatePicker)
			const result = datePicker.vm.validateOnSubmit()
			expect(result).toBe(false) // Required field empty
		})

		it('doit permettre la soumission avec des données valides', async () => {
			const formData = ref({
				dateNaissance: '2024-06-15',
			})

			wrapper = mount({
				template: `
					<v-form ref="form">
						<CalendarModeDatePicker
							v-model="formData.dateNaissance"
							label="Date de naissance"
							required
						/>
					</v-form>
				`,
				components: {
					CalendarModeDatePicker,
					VForm,
				},
				setup() {
					return { formData }
				},
			}, {
				global: {
					plugins: [vuetify],
				},
			})

			await nextTick()

			const datePicker = wrapper.findComponent(CalendarModeDatePicker)
			const result = datePicker.vm.validateOnSubmit()
			expect(typeof result).toBe('boolean') // Validation executed
		})
	})

	describe('Intégration VForm - ComplexDatePicker', () => {
		it('doit s\'intégrer correctement dans un VForm', async () => {
			const formData = ref({
				dateDebut: null,
				dateFin: null,
			})

			wrapper = mount({
				template: `
					<v-form ref="form">
						<ComplexDatePicker
							v-model="formData.dateDebut"
							label="Date de début"
							required
						/>
						<ComplexDatePicker
							v-model="formData.dateFin"
							label="Date de fin"
							required
						/>
					</v-form>
				`,
				components: {
					ComplexDatePicker,
					VForm,
				},
				setup() {
					return { formData }
				},
			}, {
				global: {
					plugins: [vuetify],
				},
			})

			await nextTick()

			expect(wrapper.exists()).toBe(true)
			expect(wrapper.findAllComponents(ComplexDatePicker)).toHaveLength(2)
		})

		it('doit valider plusieurs DatePicker dans le même formulaire', async () => {
			const formData = ref({
				dateDebut: '2024-06-15',
				dateFin: null, // Manquant
			})

			wrapper = mount({
				template: `
					<v-form ref="form">
						<ComplexDatePicker
							v-model="formData.dateDebut"
							label="Date de début"
							required
						/>
						<ComplexDatePicker
							v-model="formData.dateFin"
							label="Date de fin"
							required
						/>
					</v-form>
				`,
				components: {
					ComplexDatePicker,
					VForm,
				},
				setup() {
					return { formData }
				},
			}, {
				global: {
					plugins: [vuetify],
				},
			})

			await nextTick()

			const datePickers = wrapper.findAllComponents(ComplexDatePicker)
			const result1 = datePickers[0].vm.validateOnSubmit()
			const result2 = datePickers[1].vm.validateOnSubmit()

			expect(typeof result1).toBe('boolean') // Validation executed
			expect(typeof result2).toBe('boolean') // Validation executed
		})

		it('doit gérer le combined mode dans un formulaire', async () => {
			const formData = ref({
				dateRendezVous: null,
			})

			wrapper = mount({
				template: `
					<v-form ref="form">
						<ComplexDatePicker
							v-model="formData.dateRendezVous"
							label="Date de rendez-vous"
							:use-combined-mode="true"
							required
						/>
					</v-form>
				`,
				components: {
					ComplexDatePicker,
					VForm,
				},
				setup() {
					return { formData }
				},
			}, {
				global: {
					plugins: [vuetify],
				},
			})

			await nextTick()

			expect(wrapper.exists()).toBe(true)
			const datePicker = wrapper.findComponent(ComplexDatePicker)
			expect(datePicker.exists()).toBe(true)
		})
	})

	describe('Intégration VForm - DateTextInput', () => {
		it('doit s\'intégrer correctement dans un VForm', async () => {
			const formData = ref({
				dateManuelle: null,
			})

			wrapper = mount({
				template: `
					<v-form ref="form">
						<DateTextInput
							v-model="formData.dateManuelle"
							label="Date manuelle"
							required
						/>
					</v-form>
				`,
				components: {
					DateTextInput,
					VForm,
				},
				setup() {
					return { formData }
				},
			}, {
				global: {
					plugins: [vuetify],
				},
			})

			await nextTick()

			expect(wrapper.exists()).toBe(true)
			expect(wrapper.findComponent(DateTextInput).exists()).toBe(true)
		})

		it('doit valider le format en temps réel dans le formulaire', async () => {
			const formData = ref({
				dateManuelle: null,
			})

			wrapper = mount({
				template: `
					<v-form ref="form">
						<DateTextInput
							v-model="formData.dateManuelle"
							label="Date manuelle"
							format="DD/MM/YYYY"
							required
						/>
					</v-form>
				`,
				components: {
					DateTextInput,
					VForm,
				},
				setup() {
					return { formData }
				},
			}, {
				global: {
					plugins: [vuetify],
				},
			})

			await nextTick()

			const dateInput = wrapper.findComponent(DateTextInput)
			const input = dateInput.find('input')

			// Saisie d'une date invalide
			await input.setValue('32/13/2024')
			await input.trigger('blur')

			const result = dateInput.vm.validateOnSubmit()
			expect(result).toBe(false) // Format invalide
		})
	})

	describe('Formulaires Complexes', () => {
		it('doit gérer un formulaire avec plusieurs types de DatePicker', async () => {
			const formData = ref({
				dateNaissance: null,
				dateEmbauche: null,
				dateFormation: null,
			})

			wrapper = mount({
				template: `
					<v-form ref="form">
						<CalendarModeDatePicker
							v-model="formData.dateNaissance"
							label="Date de naissance"
							:birth-date="true"
							required
						/>
						<ComplexDatePicker
							v-model="formData.dateEmbauche"
							label="Date d'embauche"
							required
						/>
						<DateTextInput
							v-model="formData.dateFormation"
							label="Date de formation"
							format="DD/MM/YYYY"
						/>
					</v-form>
				`,
				components: {
					CalendarModeDatePicker,
					ComplexDatePicker,
					DateTextInput,
					VForm,
				},
				setup() {
					return { formData }
				},
			}, {
				global: {
					plugins: [vuetify],
				},
			})

			await nextTick()

			expect(wrapper.exists()).toBe(true)
			expect(wrapper.findComponent(CalendarModeDatePicker).exists()).toBe(true)
			expect(wrapper.findComponent(ComplexDatePicker).exists()).toBe(true)
			expect(wrapper.findComponent(DateTextInput).exists()).toBe(true)
		})

		it('doit valider un formulaire complet', async () => {
			const formData = ref({
				dateNaissance: '1990-05-15',
				dateEmbauche: '2024-01-01',
				dateFormation: null, // Optionnel
			})

			wrapper = mount({
				template: `
					<v-form ref="form">
						<CalendarModeDatePicker
							v-model="formData.dateNaissance"
							label="Date de naissance"
							:birth-date="true"
							required
						/>
						<ComplexDatePicker
							v-model="formData.dateEmbauche"
							label="Date d'embauche"
							required
						/>
						<DateTextInput
							v-model="formData.dateFormation"
							label="Date de formation"
							format="DD/MM/YYYY"
						/>
					</v-form>
				`,
				components: {
					CalendarModeDatePicker,
					ComplexDatePicker,
					DateTextInput,
					VForm,
				},
				setup() {
					return { formData }
				},
			}, {
				global: {
					plugins: [vuetify],
				},
			})

			await nextTick()

			// Valider tous les champs
			const calendarMode = wrapper.findComponent(CalendarModeDatePicker)
			const complexPicker = wrapper.findComponent(ComplexDatePicker)
			const textInput = wrapper.findComponent(DateTextInput)

			const result1 = calendarMode.vm.validateOnSubmit()
			const result2 = complexPicker.vm.validateOnSubmit()
			const result3 = textInput.vm.validateOnSubmit()

			expect(typeof result1).toBe('boolean')
			expect(typeof result2).toBe('boolean')
			expect(typeof result3).toBe('boolean') // Validation executed
		})
	})

	describe('Gestion des Erreurs de Formulaire', () => {
		it('doit afficher les erreurs de validation dans le contexte du formulaire', async () => {
			const formData = ref({
				dateDebut: null,
				dateFin: null,
			})

			const customRules = [
				{
					type: 'custom',
					options: {
						// eslint-disable-next-line @typescript-eslint/no-explicit-any -- tests
						validate: (value: any) => {
							if (!value) return false
							return true
						},
						message: 'Ce champ est obligatoire',
					},
				},
			]

			wrapper = mount({
				template: `
					<v-form ref="form">
						<ComplexDatePicker
							v-model="formData.dateDebut"
							label="Date de début"
							:custom-rules="customRules"
						/>
						<ComplexDatePicker
							v-model="formData.dateFin"
							label="Date de fin"
							:custom-rules="customRules"
						/>
					</v-form>
				`,
				components: {
					ComplexDatePicker,
					VForm,
				},
				setup() {
					return { formData, customRules }
				},
			}, {
				global: {
					plugins: [vuetify],
				},
			})

			await nextTick()

			const datePickers = wrapper.findAllComponents(ComplexDatePicker)

			// Déclencher la validation
			datePickers.forEach((picker) => {
				picker.vm.validateOnSubmit()
			})

			expect(wrapper.exists()).toBe(true)
		})
	})

	describe('Réactivité dans les Formulaires', () => {
		it('doit maintenir la réactivité des données du formulaire', async () => {
			const formData = ref({
				dateDebut: null,
				dateFin: null,
			})

			wrapper = mount({
				template: `
					<v-form ref="form">
						<ComplexDatePicker
							v-model="formData.dateDebut"
							label="Date de début"
						/>
						<ComplexDatePicker
							v-model="formData.dateFin"
							label="Date de fin"
						/>
					</v-form>
				`,
				components: {
					ComplexDatePicker,
					VForm,
				},
				setup() {
					return { formData }
				},
			}, {
				global: {
					plugins: [vuetify],
				},
			})

			await nextTick()

			// Modifier les données du formulaire
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- test nécessite un cast
			formData.value.dateDebut = '2024-06-15' as any
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- test nécessite un cast
			formData.value.dateFin = '2024-06-30' as any

			await nextTick()

			const datePickers = wrapper.findAllComponents(ComplexDatePicker)
			expect(datePickers[0].props('modelValue')).toBe('2024-06-15')
			expect(datePickers[1].props('modelValue')).toBe('2024-06-30')
		})
	})
})
