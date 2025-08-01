import { type Meta, type StoryFn } from '@storybook/vue3'
import DatePickerValidationExamples from '../docExamples/DatePickerValidationExamples.vue'
import DatePickerBidirectionalValidation from '../docExamples/DatePickerBidirectionalValidation.vue'

export default {
	title: 'Composants/Formulaires/DatePicker/Validation',
	component: DatePickerValidationExamples,
	argTypes: {},
	parameters: {
		docs: {
			description: {
				component: 'Exemples de validation pour le composant CalendarMode.',
			},
		},
	},
} as Meta

export const ValidationExamples: StoryFn = () => ({
	components: {
		DatePickerValidationExamples,
	},
	template: '<DatePickerValidationExamples />',
})

ValidationExamples.parameters = {
	sourceCode: [
		{
			name: 'Template',
			code: `
			<template>
				<div class="date-picker-validation-examples">
					<h1 class="text-h5 mb-6">
						Exemples de validation du DatePicker
					</h1>

					<!-- Exemple 1: Validation de base (required) -->
					<section class="mb-10">
						<h2 class="text-h6 mb-3">
							Validation de base (required)
						</h2>
						<div class="mb-2">
							<DatePicker
								v-model="date1"
								placeholder="Date requise"
								required
							/>
						</div>
						<v-btn
							size="small"
							color="primary"
							@click="date1 = ''"
						>
							Vider le champ
						</v-btn>
						<v-btn
							size="small"
							class="ml-2"
							@click="date1 = today"
						>
							Remplir le champ
						</v-btn>
						<div class="mt-2">
							Valeur actuelle: {{ date1 }}
						</div>
					</section>

					<!-- Autres exemples de validation -->
				</div>
			</template>
			`,
		},
		{
			name: 'Script',
			code: `
			<script setup>
				import { ref } from 'vue'
				import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'

				// Exemple 1: Validation de base (required)
				const date1 = ref('')

				// Exemple 2: notWeekend
				const date2 = ref('')

				// Exemple 3: notAfterToday
				const date3 = ref('')

				// Exemple 4: notBeforeToday
				const date4 = ref('')

				// Exemple 5: notBeforeDate
				const date5 = ref('')

				// Exemple 6: notAfterDate
				const date6 = ref('')

				// Exemple 7: dateExact
				const date7 = ref('')

				// Exemple 8: customRules (règle personnalisée)
				const date8 = ref('')

				// Exemple 9: customWarningRules
				const date9 = ref('')

				// Exemple 10: Combinaison de plusieurs règles
				const date10 = ref('')

				const today = new Date().toLocaleDateString('fr-FR', {
					day: '2-digit',
					month: '2-digit',
					year: 'numeric',
				})
				const tomorrow = new Date(Date.now() + 86400000).toLocaleDateString('fr-FR', {
					day: '2-digit',
					month: '2-digit',
					year: 'numeric',
				})
				const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('fr-FR', {
					day: '2-digit',
					month: '2-digit',
					year: 'numeric',
				})
			</script>
			`,
		},
	],
}

export const BidirectionalValidation: StoryFn = () => ({
	components: {
		DatePickerBidirectionalValidation,
	},
	template: '<DatePickerBidirectionalValidation />',
})

BidirectionalValidation.parameters = {
	sourceCode: [
		{
			name: 'Template',
			code: `
			<template>
				<div class="date-picker-bidirectional-validation">
					<h1 class="text-h5 mb-6">
						Validation bidirectionnelle entre deux DatePickers
					</h1>

					<div class="text-body-2 mb-4">
						Ce composant démontre la validation bidirectionnelle entre deux DatePickers. Les règles de validation sont appliquées dans les deux sens :
						<ul class="ml-4">
							<li>La date de fin doit être postérieure ou égale à la date de début</li>
							<li>La date de début doit être antérieure ou égale à la date de fin</li>
							<li>Lorsque la date de début change, la validation de la date de fin est mise à jour</li>
							<li>Lorsque la date de fin change, la validation de la date de début est mise à jour</li>
						</ul>
					</div>

					<div class="date-range-container mb-6">
						<div class="date-picker-wrapper">
							<h3 class="text-subtitle-1 mb-2">
								Date de début
							</h3>
							<DatePicker
								ref="startDatePickerRef"
								v-model="startDate"
								placeholder="Date de début"
								:custom-rules="startDateRules"
								required
								@update:model-value="validateEndDate"
							/>
						</div>
						<div class="date-picker-wrapper">
							<h3 class="text-subtitle-1 mb-2">
								Date de fin
							</h3>
							<DatePicker
								ref="endDatePickerRef"
								v-model="endDate"
								placeholder="Date de fin"
								:custom-rules="endDateRules"
								required
								@update:model-value="validateStartDate"
							/>
						</div>
					</div>

					<div class="actions mb-4">
						<v-btn
							size="small"
							color="primary"
							class="mr-2"
							@click="resetDates"
						>
							Réinitialiser
						</v-btn>

						<v-btn
							size="small"
							color="success"
							class="mr-2"
							@click="setTestDates"
						>
							Dates valides
						</v-btn>

						<v-btn
							size="small"
							color="error"
							@click="setInvalidDates"
						>
							Dates invalides
						</v-btn>
					</div>

					<div class="current-values mt-4">
						<p><strong>Date de début :</strong> {{ startDate || 'Non sélectionnée' }}</p>
						<p><strong>Date de fin :</strong> {{ endDate || 'Non sélectionnée' }}</p>
					</div>
				</div>
			</template>
			`,
		},
		{
			name: 'Script',
			code: `
			<script lang="ts" setup>
				import { ref, computed, watch } from 'vue'
				import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
				import { useDateFormat } from '@/composables/date/useDateFormat'

				const { parseDate } = useDateFormat()

				// État des dates
				const startDate = ref<string | null>(null)
				const endDate = ref<string | null>(null)

				// Références aux composants CalendarMode pour accéder à leurs méthodes
				const startDatePickerRef = ref<InstanceType<typeof DatePicker> | null>(null)
				const endDatePickerRef = ref<InstanceType<typeof DatePicker> | null>(null)

				// Règle de validation pour vérifier que la date de fin n'est pas avant la date de début
				const createEndDateValidationRule = () => ({
					type: 'custom',
					options: {
						validate: (value: string) => {
							// Si pas de valeur pour la date de fin, pas besoin de validation
							if (!value) return true

							// Si pas de date de début mais une date de fin, afficher l'erreur
							if (!startDate.value) return 'Veuillez d'abord sélectionner une date de début'

							const start = parseDate(startDate.value, 'DD/MM/YYYY')
							const end = parseDate(value, 'DD/MM/YYYY')

							if (!start || !end) return true

							return end >= start || 'La date de fin ne peut pas être antérieure à la date de début'
						},
						message: 'La date de fin ne peut pas être antérieure à la date de début',
					},
				}))

				// Règles de validation et méthodes additionnelles
				// ...

				// Fonctions pour la démonstration
				const setTestDates = () => {
					// Définir dates valides (aujourd'hui et demain)
				}

				const setInvalidDates = () => {
					// Définir dates invalides (aujourd'hui et hier)
				}

				const resetDates = () => {
					startDate.value = null
					endDate.value = null
				}
			</script>
			`,
		},
		{
			name: 'Style',
			code: `
			<style scoped>
			.date-picker-bidirectional-validation {
				padding: 20px;
				max-width: 800px;
				margin: 0 auto;
			}

			.date-range-container {
				display: flex;
				gap: 20px;
			}

			.date-picker-wrapper {
				flex: 1;
			}

			.actions {
				display: flex;
				flex-wrap: wrap;
				gap: 8px;
			}

			.current-values {
				padding: 15px;
				background-color: #f5f5f5;
				border-radius: 4px;
			}
			</style>
			`,
		},
	],
}
