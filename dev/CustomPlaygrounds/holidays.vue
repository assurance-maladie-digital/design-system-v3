<script lang="ts" setup>
	import { ref, computed } from 'vue'
	import { useFieldValidation } from '@/composables/rules/useFieldValidation'
	import { useHolidayDay } from '@/composables/date/useHolidayDay'
	import DatePicker from '@/components/DatePicker/DatePicker/DatePicker.vue'

	const selectedDate = ref('')
	const { isHolidayDay, getJoursFeries } = useHolidayDay()

	// Année courante pour afficher les jours fériés
	const currentYear = new Date().getFullYear()

	// Création de la règle qui vérifie qu'une date n'est pas un jour férié
	const holidayRules = [
		{
			type: 'isHolidayDay',
			options: {
				fieldName: 'La date',
				message: 'Vous ne pouvez pas sélectionner un jour férié.',
				successMessage: 'La date sélectionnée n\'est pas un jour férié.',
			},
		},
	]

	// Vérification si la date sélectionnée est un jour férié (pour l'affichage)
	const isDateHoliday = computed(() => {
		if (!selectedDate.value) return false
		return isHolidayDay(selectedDate.value)
	})

	// Liste des jours fériés de l'année courante
	const currentYearHolidays = computed(() => {
		const holidays = getJoursFeries(currentYear)
		return Array.from(holidays).sort()
	})
</script>

<template>
	<div class="date-picker-holiday-example">
		<h2>DatePicker avec règle de validation pour jours fériés</h2>
		<p>
			Cet exemple montre comment utiliser la règle <code>isHolidayDay</code> pour empêcher
			la sélection de jours fériés dans un DatePicker.
		</p>

		<div class="date-picker-container">
			<DatePicker
				v-model="selectedDate"
				label="Date (pas de jour férié)"
				:custom-rules="holidayRules"
				error-messages
				placeholder="Sélectionnez une date non fériée"
			/>
		</div>

		<div class="info-container mt-4">
			<h3>Informations</h3>
			<p>Date sélectionnée : <strong>{{ selectedDate || 'Aucune' }}</strong></p>

			<div
				v-if="selectedDate"
				class="mt-2"
			>
				<p
					v-if="isDateHoliday"
					class="error-text"
				>
					⚠️ Le {{ selectedDate }} est un jour férié.
				</p>
				<p
					v-else
					class="success-text"
				>
					✅ Le {{ selectedDate }} n'est pas un jour férié.
				</p>
			</div>

			<div
				v-if="currentYearHolidays.length"
				class="holiday-list mt-4"
			>
				<h4>Jours fériés {{ currentYear }} :</h4>
				<ul>
					<li
						v-for="(date, index) in currentYearHolidays"
						:key="index"
					>
						{{ date }}
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<style scoped>
.date-picker-holiday-example {
	max-width: 800px;
	margin: 0 auto;
	padding: 20px;
}

.date-picker-container {
	max-width: 400px;
}

.info-container {
	background-color: #f5f5f5;
	padding: 15px;
	border-radius: 4px;
}

.error-text {
	color: #d32f2f;
	font-weight: bold;
}

.success-text {
	color: #2e7d32;
	font-weight: bold;
}

.holiday-list {
	max-height: 200px;
	overflow-y: auto;
	background-color: #fff;
	padding: 10px;
	border-radius: 4px;
	border: 1px solid #e0e0e0;
}
</style>
