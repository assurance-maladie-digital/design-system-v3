<script lang="ts" setup>
	import { ref, computed, watch } from 'vue'
	import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
	// useDateFormat n'est plus nécessaire avec les règles prédéfinies

	// État des dates
	const startDate = ref<string | null>(null)
	const endDate = ref<string | null>(null)

	// Références aux composants CalendarMode pour accéder à leurs méthodes
	const startDatePickerRef = ref<InstanceType<typeof DatePicker> | null>(null)
	const endDatePickerRef = ref<InstanceType<typeof DatePicker> | null>(null)

	// Les règles de validation sont définies directement dans les computed startDateRules et endDateRules

	// Règles de validation pour la date de début
	const startDateRules = computed(() => {
		const rules = [
			{
				type: 'required',
				options: {
					message: 'La date de début est requise.',
				},
			},
		]

		// Ajouter la règle notAfterDate seulement si endDate.value existe
		if (endDate.value) {
			rules.push({
				type: 'notAfterDate',

				options: {
					message: 'La date de début ne peut pas être postérieure à la date de fin',
					date: endDate.value, // Déjà une chaîne au format DD/MM/YYYY
					// eslint-disable-next-line @typescript-eslint/no-explicit-any -- mock Axios headers
				} as any,
			})
		}

		return rules
	})

	// Règles de validation pour la date de fin
	const endDateRules = computed(() => {
		const rules = [
			{
				type: 'required',
				options: {
					message: 'La date de fin est requise.',
				},
			},
		]
		// Ajouter la règle notBeforeDate seulement si startDate.value existe
		if (startDate.value) {
			rules.push({
				type: 'notBeforeDate',

				options: {
					message: 'La date de fin ne peut pas être antérieure à la date de début',
					date: startDate.value, // Déjà une chaîne au format DD/MM/YYYY
					// eslint-disable-next-line @typescript-eslint/no-explicit-any -- mock Axios headers
				} as any,
			})
		}
		return rules
	})

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

	// Watcher pour la date de début qui force la revalidation de la date de fin
	watch(startDate, () => {
		// Laisser le temps au système de mettre à jour les valeurs
		setTimeout(() => {
			validateEndDate()
		}, 0)
	})

	// Watcher pour la date de fin qui force la revalidation de la date de début
	watch(endDate, () => {
		// Laisser le temps au système de mettre à jour les valeurs
		setTimeout(() => {
			validateStartDate()
		}, 0)
	})

	// Fonction pour définir des dates de test
	const setTestDates = () => {
		// Définir une date de début (aujourd'hui)
		const today = new Date()
		const day = String(today.getDate()).padStart(2, '0')
		const month = String(today.getMonth() + 1).padStart(2, '0')
		const year = today.getFullYear()
		startDate.value = `${day}/${month}/${year}`

		// Définir une date de fin (demain) - pour démontrer une validation valide
		const tomorrow = new Date(today)
		tomorrow.setDate(today.getDate() + 1)
		const tomorrowDay = String(tomorrow.getDate()).padStart(2, '0')
		const tomorrowMonth = String(tomorrow.getMonth() + 1).padStart(2, '0')
		const tomorrowYear = tomorrow.getFullYear()
		endDate.value = `${tomorrowDay}/${tomorrowMonth}/${tomorrowYear}`
	}

	// Fonction pour définir des dates invalides (date de fin avant date de début)
	const setInvalidDates = () => {
		// Définir une date de début (aujourd'hui)
		const today = new Date()
		const day = String(today.getDate()).padStart(2, '0')
		const month = String(today.getMonth() + 1).padStart(2, '0')
		const year = today.getFullYear()
		startDate.value = `${day}/${month}/${year}`

		// Définir une date de fin (hier) - pour démontrer une validation invalide
		const yesterday = new Date(today)
		yesterday.setDate(today.getDate() - 1)
		const yesterdayDay = String(yesterday.getDate()).padStart(2, '0')
		const yesterdayMonth = String(yesterday.getMonth() + 1).padStart(2, '0')
		const yesterdayYear = yesterday.getFullYear()
		endDate.value = `${yesterdayDay}/${yesterdayMonth}/${yesterdayYear}`
	}

	// Fonction pour réinitialiser les dates
	const resetDates = () => {
		startDate.value = null
		endDate.value = null
	}
</script>

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

		<div class="mt-6 pa-4 bg-grey-lighten-4 rounded">
			<h3 class="text-subtitle-1 mb-2">
				Comment fonctionne la validation bidirectionnelle
			</h3>
			<p class="text-body-2">
				La validation bidirectionnelle entre les DatePickers est implémentée grâce à des règles de validation personnalisées
				qui vérifient la relation entre les deux dates. Chaque DatePicker a sa propre règle qui vérifie sa valeur par rapport à l'autre.
			</p>
			<p class="text-body-2 mt-2">
				Lorsqu'une date change, un watcher déclenche la validation de l'autre DatePicker. Cela garantit que les messages d'erreur
				sont toujours à jour, même lorsque les dates sont modifiées dans n'importe quel ordre.
			</p>
			<p class="text-body-2 mt-2">
				Les messages d'erreur apparaissent directement dans les composants DatePicker, ce qui améliore l'expérience utilisateur
				en fournissant un retour immédiat sur la validité des dates sélectionnées.
			</p>
			<p class="text-body-2 mt-2">
				Vous trouverez le code source dans la story Bidirectional Validation.
			</p>
		</div>
	</div>
</template>

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
