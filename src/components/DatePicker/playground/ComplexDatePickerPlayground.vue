<script lang="ts" setup>
	import { ref } from 'vue'
	import ComplexDatePicker from '../ComplexDatePicker/ComplexDatePicker.vue'

	// Valeurs pour les différents exemples
	const standardDate = ref<string | null>(null)
	const americanDate = ref<string | null>(null)
	const isoDate = ref<string | null>(null)
	const dotDate = ref<string | null>(null)
	const requiredDate = ref<string | null>(null)
	const dateRange = ref<[string, string] | null>(null)
	const birthDate = ref<string | null>(null)
	const formattedDate = ref<string | null>(null)
</script>

<template>
	<div class="playground-container">
		<h1>ComplexDatePicker Playground</h1>

		<div class="demo-section">
			<h2>Format standard (DD/MM/YYYY)</h2>
			<ComplexDatePicker
				v-model="standardDate"
				placeholder="Date standard"
				format="DD/MM/YYYY"
				class="date-picker"
			/>
			<div class="value-display">
				Valeur: {{ standardDate || 'Non définie' }}
			</div>
		</div>

		<div class="demo-section">
			<h2>Format américain (MM/DD/YYYY)</h2>
			<ComplexDatePicker
				v-model="americanDate"
				placeholder="Date américaine"
				format="MM/DD/YYYY"
				class="date-picker"
			/>
			<div class="value-display">
				Valeur: {{ americanDate || 'Non définie' }}
			</div>
		</div>

		<div class="demo-section">
			<h2>Format ISO (YYYY-MM-DD)</h2>
			<ComplexDatePicker
				v-model="isoDate"
				placeholder="Date ISO"
				format="YYYY-MM-DD"
				class="date-picker"
			/>
			<div class="value-display">
				Valeur: {{ isoDate || 'Non définie' }}
			</div>
		</div>

		<div class="demo-section">
			<h2>Format avec séparateur point (DD.MM.YYYY)</h2>
			<ComplexDatePicker
				v-model="dotDate"
				placeholder="Date avec points"
				format="DD.MM.YYYY"
				class="date-picker"
			/>
			<div class="value-display">
				Valeur: {{ dotDate || 'Non définie' }}
			</div>
		</div>

		<div class="demo-section">
			<h2>Champ requis</h2>
			<ComplexDatePicker
				v-model="requiredDate"
				placeholder="Date requise"
				format="DD/MM/YYYY"
				required
				class="date-picker"
			/>
			<div class="value-display">
				Valeur: {{ requiredDate || 'Non définie' }}
			</div>
		</div>

		<div class="demo-section">
			<h2>Plage de dates</h2>
			<ComplexDatePicker
				v-model="dateRange"
				placeholder="Plage de dates"
				format="DD/MM/YYYY"
				display-range
				class="date-picker"
			/>
			<div class="value-display">
				Valeur: {{ dateRange ? JSON.stringify(dateRange) : 'Non définie' }}
			</div>
		</div>

		<div class="demo-section">
			<h2>Date de naissance (année d'abord)</h2>
			<ComplexDatePicker
				v-model="birthDate"
				placeholder="Date de naissance"
				format="DD/MM/YYYY"
				is-birth-date
				class="date-picker"
			/>
			<div class="value-display">
				Valeur: {{ birthDate || 'Non définie' }}
			</div>
		</div>

		<div class="demo-section">
			<h2>Format d'affichage vs format de retour</h2>
			<ComplexDatePicker
				v-model="formattedDate"
				placeholder="Date avec format de retour"
				format="DD/MM/YYYY"
				date-format-return="YYYY-MM-DD"
				class="date-picker"
			/>
			<div class="value-display">
				Valeur: {{ formattedDate || 'Non définie' }}
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.playground-container {
	max-width: 800px;
	margin: 0 auto;
	padding: 20px;
	font-family: Roboto, sans-serif;
}

h1 {
	text-align: center;
	margin-bottom: 30px;
	color: #2c3e50;
}

h2 {
	color: #2c3e50;
	font-size: 1.2rem;
	margin-bottom: 10px;
}

.demo-section {
	margin-bottom: 30px;
	padding: 20px;
	border-radius: 8px;
	background-color: #f8f9fa;
	box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
}

.date-picker {
	margin-bottom: 10px;
	width: 100%;
}

.value-display {
	margin-top: 10px;
	padding: 10px;
	background-color: #e9ecef;
	border-radius: 4px;
	font-family: monospace;
	white-space: pre-wrap;
	word-break: break-all;
}
</style>
