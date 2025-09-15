<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
import { useDateFormat } from '@/composables/date/useDateFormatDayjs'

	const { parseDate, formatDate: formattedDate } = useDateFormat()

	// État des dates
	const startDate = ref<string | null>(null)
	const endDate = ref<string | null>(null)

	// Références aux composants DatePicker pour accéder à leurs méthodes
	const startDatePickerRef = ref<InstanceType<typeof DatePicker> | null>(null)
	const endDatePickerRef = ref<InstanceType<typeof DatePicker> | null>(null)

	// Fonction utilitaire pour parser une date au format français
	const parseFrDate = (dateStr: string) => {
		if (!dateStr) return null
		return parseDate(dateStr, 'DD/MM/YYYY')
	}

	// Règle de validation pour vérifier que la date de fin n'est pas avant la date de début
	const createEndDateValidationRule = () => ({
		type: 'custom',
		options: {
			validate: (value: string) => {
				// Si pas de valeur pour la date de fin, pas besoin de validation
				if (!value) return true

				// Si pas de date de début mais une date de fin, afficher l'erreur
				if (!startDate.value)
					return 'Veuillez d\'abord sélectionner une date de début'

				const start = parseFrDate(startDate.value)
				const end = parseFrDate(value)

				if (!start || !end) return true

				return (
					end >= start
					|| 'La date de fin ne peut pas être antérieure à la date de début'
				)
			},
			message:
				'La date de fin ne peut pas être antérieure à la date de début',
		},
	})

	// Règle de validation pour vérifier que la date de début n'est pas après la date de fin
	const createStartDateValidationRule = () => ({
		type: 'custom',
		options: {
			validate: (value: string) => {
				// Si pas de valeur pour la date de début ou pas de date de fin, pas besoin de validation
				if (!value || !endDate.value) return true

				const start = parseFrDate(value)
				const end = parseFrDate(endDate.value)

				if (!start || !end) return true

				return (
					start <= end
					|| 'La date de début ne peut pas être postérieure à la date de fin'
				)
			},
			message: 'La date de début ne peut pas être postérieure à la date de fin',
		},
	})

	// Règles de validation pour la date de début
	const startDateRules = computed(() => [
		{
			type: 'required',
			options: {
				message: 'La date de début est requise.',
			},
		},
		{
			type: 'notAfterToday',
			options: {
				message: 'La date ne peut pas être supérieure à la date du jour',
			},
		},
		createStartDateValidationRule(),
	])

	// Règles de validation pour la date de fin
	const endDateRules = computed(() => [
		{
			type: 'required',
			options: {
				message: 'La date de fin est requise.',
			},
		},
		{
			type: 'notAfterToday',
			options: {
				message: 'La date ne peut pas être supérieure à la date du jour',
			},
		},
		createEndDateValidationRule(),
	])

	// Fonction pour forcer la validation de la date de fin quand la date de début change
	const validateEndDate = () => {
		if (endDatePickerRef.value && endDate.value) {
			// On utilise validateOnSubmit pour forcer la validation complète
			endDatePickerRef.value.validateOnSubmit()
		}
	}

	// Fonction pour forcer la validation de la date de début quand la date de fin change
	const validateStartDate = () => {
		if (startDatePickerRef.value && startDate.value) {
			// On utilise validateOnSubmit pour forcer la validation complète
			startDatePickerRef.value.validateOnSubmit()
		}
	}

	// Watcher pour la date de fin qui force la revalidation de la date de début
	watch(endDate, () => {
		// Laisser le temps au système de mettre à jour les valeurs
		setTimeout(() => {
			validateStartDate()
		}, 0)
	})

	// Watcher pour la date de début qui force la revalidation de la date de fin
	watch(startDate, () => {
		// Laisser le temps au système de mettre à jour les valeurs
		setTimeout(() => {
			validateEndDate()
		}, 0)
	})
</script>

<template>
	<div class="date-picker-validation-playground">
		<h1>Validation DatePicker avec champ texte</h1>
		<p class="description">
			Exemple d'utilisation du DatePicker avec textFieldActivator et validation bidirectionnelle
		</p>

		<div class="date-pickers-container">
			<div class="date-picker-wrapper">
				<h3 id="date-debut">
					Date de début
				</h3>
				<DatePicker
					id="startDate"
					ref="startDatePickerRef"
					v-model="startDate"
					class="date-picker"
					text-field-activator
					label="JJ/MM/AAAA"
					aria-labelledby="date-debut"
					use-combined-mode
					display-icon
					display-append-icon
					date-format-return="DD/MM/YYYY"
					text-field-class="ma-2"
					:custom-rules="startDateRules"
					@update:model-value="validateEndDate"
				/>
			</div>

			<div class="date-picker-wrapper">
				<h3 id="date-fin">
					Date de fin
				</h3>
				<DatePicker
					id="endDate"
					ref="endDatePickerRef"
					v-model="endDate"
					class="date-picker"
					text-field-activator
					label="JJ/MM/AAAA"
					aria-labelledby="date-fin"
					use-combined-mode
					display-icon
					display-append-icon
					date-format-return="DD/MM/YYYY"
					text-field-class="ma-2"
					:custom-rules="endDateRules"
					@update:model-value="validateEndDate"
				/>
			</div>
		</div>

		<div class="current-values">
			<p><strong>Date de début:</strong> {{ startDate || 'Non sélectionnée' }}</p>
			<p><strong>Date de fin:</strong> {{ endDate || 'Non sélectionnée' }}</p>
		</div>
	</div>
</template>

<style scoped>
.date-picker-validation-playground {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 10px;
  color: #333;
}

.description {
  margin-bottom: 20px;
  color: #666;
  font-style: italic;
}

h3 {
  margin-bottom: 10px;
  color: #555;
}

.date-pickers-container {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.date-picker-wrapper {
  flex: 1;
}

.current-values {
  margin-top: 30px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.instructions {
  margin-top: 30px;
  padding: 15px;
  background-color: #e8f4fd;
  border-radius: 4px;
  border-left: 4px solid #2196f3;
}

.instructions ul {
  margin-left: 20px;
  padding-left: 0;
}

.instructions li {
  margin-bottom: 8px;
}

code {
  background-color: #f0f0f0;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: monospace;
}
</style>
