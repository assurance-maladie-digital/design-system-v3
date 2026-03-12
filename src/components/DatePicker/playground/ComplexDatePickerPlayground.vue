<script lang="ts" setup>
	import { ref } from 'vue'
	import ComplexDatePicker from '../ComplexDatePicker/ComplexDatePicker.vue'
	import SyHeading from '@/components/SyHeading/SyHeading.vue'

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
		<SyHeading
			:level="1"
		>
			ComplexDatePicker Playground
		</SyHeading>
		<div class="demo-section">
			<SyHeading
				:level="2"
			>
				Format standard (DD/MM/YYYY)
			</SyHeading>
			<ComplexDatePicker
				v-model="standardDate"
				:heading-level="2"
				:heading-level-complex-date-picker="2"
				label="Date standard"
				placeholder="15/03/2024"
				format="DD/MM/YYYY"
				class="date-picker"
			/>
			<div class="value-display">
				Valeur: {{ standardDate || 'Non définie' }}
			</div>
		</div>

		<div class="demo-section">
			<SyHeading	:level="2">
				Format américain (MM/DD/YYYY)
			</SyHeading>
			<ComplexDatePicker
				v-model="americanDate"
				label="Date américaine"
				:heading-level="2"
				:heading-level-complex-date-picker="2"
				placeholder="03/15/2024"
				format="MM/DD/YYYY"
				class="date-picker"
			/>
			<div class="value-display">
				Valeur: {{ americanDate || 'Non définie' }}
			</div>
		</div>

		<div class="demo-section">
			<SyHeading	:level="2">
				Format ISO (YYYY-MM-DD)
			</SyHeading>
			<ComplexDatePicker
				v-model="isoDate"
				label="Date ISO"
				:heading-level="2"
				:heading-level-complex-date-picker="2"
				placeholder="2024-03-15"
				format="YYYY-MM-DD"
				class="date-picker"
			/>
			<div class="value-display">
				Valeur: {{ isoDate || 'Non définie' }}
			</div>
		</div>

		<div class="demo-section">
			<SyHeading	:level="2">
				Format avec séparateur point (DD.MM.YYYY)
			</SyHeading>
			<ComplexDatePicker
				v-model="dotDate"
				label="Date avec points"
				:heading-level="2"
				:heading-level-complex-date-picker="2"
				placeholder="15.03.2024"
				format="DD.MM.YYYY"
				class="date-picker"
			/>
			<div class="value-display">
				Valeur: {{ dotDate || 'Non définie' }}
			</div>
		</div>

		<div class="demo-section">
			<SyHeading	:level="2">
				Champ requis
			</SyHeading>
			<ComplexDatePicker
				v-model="requiredDate"
				:heading-level="2"
				:heading-level-complex-date-picker="2"
				label="Date requise"
				placeholder="Veuillez sélectionner une date *"
				format="DD/MM/YYYY"
				required
				class="date-picker"
			/>
			<div class="value-display">
				Valeur: {{ requiredDate || 'Non définie' }}
			</div>
		</div>

		<div class="demo-section">
			<SyHeading	:level="2">
				Plage de dates
			</SyHeading>
			<ComplexDatePicker
				v-model="dateRange"
				label="Plage de dates"
				:heading-level="2"
				:heading-level-complex-date-picker="2"
				placeholder="01/01/2024 au 31/12/2024"
				format="DD/MM/YYYY"
				display-range
				class="date-picker"
			/>
			<div class="value-display">
				Valeur: {{ dateRange ? JSON.stringify(dateRange) : 'Non définie' }}
			</div>
		</div>

		<div class="demo-section">
			<SyHeading	:level="2">
				Date de naissance (année d'abord)
			</SyHeading>
			<ComplexDatePicker
				v-model="birthDate"
				label="Date de naissance"
				:heading-level="2"
				:heading-level-complex-date-picker="2"
				placeholder="25/12/1990"
				format="DD/MM/YYYY"
				is-birth-date
				class="date-picker"
			/>
			<div class="value-display">
				Valeur: {{ birthDate || 'Non définie' }}
			</div>
		</div>

		<div class="demo-section">
			<SyHeading	:level="2">
				Format d'affichage vs format de retour
			</SyHeading>
			<ComplexDatePicker
				v-model="formattedDate"
				:heading-level="2"
				:heading-level-complex-date-picker="2"
				label="Date avec format de retour"
				placeholder="Affichage: 15/03/2024, Retour: 2024-03-15"
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
