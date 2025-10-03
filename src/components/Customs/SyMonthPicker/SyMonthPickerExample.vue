<script setup lang="ts">
	import { ref } from 'vue'
	import SyMonthPicker from './SyMonthPicker.vue'

	const selectedMonth = ref<string | null>(null)
	const firstDay = ref<Date | null>(null)
	const lastDay = ref<Date | null>(null)

	// Format une date en français
	function formatDate(date: Date | null): string {
		if (!date) return 'Non défini'
		return date.toLocaleDateString('fr-FR', {
			day: '2-digit',
			month: 'long',
			year: 'numeric',
		})
	}

	function resetMonth() {
		selectedMonth.value = null
		firstDay.value = null
		lastDay.value = null
	}

	function setMonth(value: string) {
		selectedMonth.value = value
		// Les premiers et derniers jours seront mis à jour par les événements
	}

	function handleFirstDay(date: Date) {
		firstDay.value = date
	}

	function handleLastDay(date: Date) {
		lastDay.value = date
	}
</script>

<template>
	<div class="example-container">
		<p class="mb-4">
			Le mois sélectionné est : {{ selectedMonth || 'Aucun' }}
		</p>

		<div class="date-range mb-4">
			<p>
				Premier jour du mois : <strong>{{ formatDate(firstDay) }}</strong>
			</p>
			<p>
				Dernier jour du mois : <strong>{{ formatDate(lastDay) }}</strong>
			</p>
		</div>

		<div class="picker-container">
			<SyMonthPicker
				v-model="selectedMonth"
				label="Sélectionner un mois"
				placeholder="MM/YYYY"
				required
				display-asterisk
				@first-day="handleFirstDay"
				@last-day="handleLastDay"
			/>
		</div>

		<div class="actions mt-6">
			<button
				class="reset-btn"
				@click="resetMonth"
			>
				Réinitialiser
			</button>
			<button
				class="set-btn"
				@click="setMonth('05/2023')"
			>
				Définir à Mai 2023
			</button>
		</div>
	</div>
</template>

<style scoped>
.example-container {
	max-width: 500px;
	margin: 0 auto;
	padding: 20px;
	border: 1px solid #ddd;
	border-radius: 8px;
	background: #f9f9f9;
}

.picker-container {
	margin: 20px 0;
}

.actions {
	display: flex;
	gap: 10px;
}

.reset-btn,
 .set-btn {
	padding: 8px 16px;
	border-radius: 4px;
	cursor: pointer;
	border: none;
	font-weight: 600;
}

.reset-btn {
	background: #f44336;
	color: white;
}

.set-btn {
	background: #4caf50;
	color: white;
}
</style>
