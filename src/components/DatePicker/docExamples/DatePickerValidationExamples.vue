<script setup>
	import { ref } from 'vue'
	import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
	import SyHeading from '@/components/SyHeading/SyHeading.vue'

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
	const nextYear = new Date(Date.now() + 31536000000).toLocaleDateString('fr-FR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	})
</script>

<template>
	<div class="date-picker-validation-examples">
		<SyHeading	:level="1">
			Exemples de validation du DatePicker
		</SyHeading>

		<!-- Exemple 1: Validation de base (required) -->
		<section class="mb-10">
			<SyHeading	:level="2">
				Validation de base (required)
			</SyHeading>
			<div class="mb-2">
				<DatePicker
					v-model="date1"
					label="Date requise"
					placeholder="Date requise"
					required
				/>
			</div>
			<VBtn
				size="small"
				color="primary"
				@click="date1 = ''"
			>
				Vider le champ
			</VBtn>
			<VBtn
				size="small"
				class="ml-2"
				@click="date1 = today"
			>
				Remplir le champ
			</VBtn>
			<div class="mt-2">
				Valeur actuelle: {{ date1 }}
			</div>
		</section>

		<!-- Exemple 2: notWeekend -->
		<section class="mb-10">
			<SyHeading
				class="text-h6 mb-3"
				:level="2"
			>
				Validation notWeekend
			</SyHeading>
			<p class="text-body-2 mb-2">
				Cette règle vérifie que la date n'est pas un weekend
			</p>
			<div class="mb-2">
				<DatePicker
					v-model="date2"
					label="Jour de semaine"
					placeholder="Jour de semaine uniquement"
					:custom-rules="[{
						type: 'notWeekend',
						options: {
							message: 'La date ne peut pas être un weekend',
							successMessage: 'Jour de semaine valide'
						}
					}]"
					:show-success-messages="true"
				/>
			</div>
			<VBtn
				size="small"
				color="primary"
				@click="date2 = '13/04/2025'"
			>
				Samedi (13/04/2025)
			</VBtn>
			<VBtn
				size="small"
				class="ml-2"
				@click="date2 = '15/04/2025'"
			>
				Mardi (15/04/2025)
			</VBtn>
			<div class="mt-2">
				Valeur actuelle: {{ date2 }}
			</div>
		</section>

		<!-- Exemple 3: notAfterToday -->
		<section class="mb-10">
			<SyHeading
				class="text-h6 mb-3"
				:level="2"
			>
				Validation notAfterToday
			</SyHeading>
			<p class="text-body-2 mb-2">
				Cette règle vérifie que la date n'est pas postérieure à aujourd'hui
			</p>
			<div class="mb-2">
				<DatePicker
					v-model="date3"
					label="Date passée"
					placeholder="Date passée ou aujourd'hui"
					:custom-rules="[{
						type: 'notAfterToday',
						options: {
							message: 'La date ne peut pas être dans le futur',
							successMessage: 'Date passée ou aujourd\'hui valide'
						}
					}]"
					:show-success-messages="true"
				/>
			</div>
			<VBtn
				size="small"
				color="primary"
				@click="date3 = today"
			>
				Aujourd'hui
			</VBtn>
			<VBtn
				size="small"
				class="ml-2"
				@click="date3 = tomorrow"
			>
				Demain
			</VBtn>
			<VBtn
				size="small"
				class="ml-2"
				@click="date3 = yesterday"
			>
				Hier
			</VBtn>
			<div class="mt-2">
				Valeur actuelle: {{ date3 }}
			</div>
		</section>

		<!-- Exemple 4: notBeforeToday -->
		<section class="mb-10">
			<SyHeading
				class="text-h6 mb-3"
				:level="2"
			>
				Validation notBeforeToday
			</SyHeading>
			<p class="text-body-2 mb-2">
				Cette règle vérifie que la date n'est pas antérieure à aujourd'hui
			</p>
			<div class="mb-2">
				<DatePicker
					v-model="date4"
					label="Date future"
					placeholder="Date future ou aujourd'hui"
					:custom-rules="[{
						type: 'notBeforeToday',
						options: {
							message: 'La date ne peut pas être dans le passé',
							successMessage: 'Date future ou aujourd\'hui valide'
						}
					}]"
					:show-success-messages="true"
				/>
			</div>
			<VBtn
				size="small"
				color="primary"
				@click="date4 = today"
			>
				Aujourd'hui
			</VBtn>
			<VBtn
				size="small"
				class="ml-2"
				@click="date4 = tomorrow"
			>
				Demain
			</VBtn>
			<VBtn
				size="small"
				class="ml-2"
				@click="date4 = yesterday"
			>
				Hier
			</VBtn>
			<div class="mt-2">
				Valeur actuelle: {{ date4 }}
			</div>
		</section>

		<!-- Exemple 5: notBeforeDate -->
		<section class="mb-10">
			<SyHeading
				class="text-h6 mb-3"
				:level="2"
			>
				Validation notBeforeDate
			</SyHeading>
			<p class="text-body-2 mb-2">
				Cette règle vérifie que la date n'est pas antérieure à une date de référence
			</p>
			<div class="mb-2">
				<DatePicker
					v-model="date5"
					label="Date après le 01/01/2025"
					placeholder="Date après le 01/01/2025"
					:custom-rules="[{
						type: 'notBeforeDate',
						options: {
							message: 'La date ne peut pas être antérieure au 01/01/2025',
							successMessage: 'Date valide (après ou le 01/01/2025)',
							date: '01/01/2025'
						}
					}]"
					:show-success-messages="true"
				/>
			</div>
			<VBtn
				size="small"
				color="primary"
				@click="date5 = '15/04/2025'"
			>
				15/04/2025
			</VBtn>
			<VBtn
				size="small"
				class="ml-2"
				@click="date5 = '31/12/2024'"
			>
				31/12/2024
			</VBtn>
			<div class="mt-2">
				Valeur actuelle: {{ date5 }}
			</div>
		</section>

		<!-- Exemple 6: notAfterDate -->
		<section class="mb-10">
			<SyHeading
				class="text-h6 mb-3"
				:level="2"
			>
				Validation notAfterDate
			</SyHeading>
			<p class="text-body-2 mb-2">
				Cette règle vérifie que la date n'est pas postérieure à une date de référence
			</p>
			<div class="mb-2">
				<DatePicker
					v-model="date6"
					label="Date avant le 31/12/2025"
					placeholder="Date avant le 31/12/2025"
					:custom-rules="[{
						type: 'notAfterDate',
						options: {
							message: 'La date ne peut pas être postérieure au 31/12/2025',
							successMessage: 'Date valide (avant ou le 31/12/2025)',
							date: '31/12/2025'
						}
					}]"
					:show-success-messages="true"
				/>
			</div>
			<VBtn
				size="small"
				color="primary"
				@click="date6 = '15/04/2025'"
			>
				15/04/2025
			</VBtn>
			<VBtn
				size="small"
				class="ml-2"
				@click="date6 = '01/01/2026'"
			>
				01/01/2026
			</VBtn>
			<div class="mt-2">
				Valeur actuelle: {{ date6 }}
			</div>
		</section>

		<!-- Exemple 7: dateExact -->
		<section class="mb-10">
			<SyHeading
				class="text-h6 mb-3"
				:level="2"
			>
				Validation dateExact
			</SyHeading>
			<p class="text-body-2 mb-2">
				Cette règle vérifie que la date est exactement égale à une date de référence
			</p>
			<div class="mb-2">
				<DatePicker
					v-model="date7"
					label="Date exacte"
					placeholder="Date exacte: 25/12/2025"
					:custom-rules="[{
						type: 'dateExact',
						options: {
							message: 'La date doit être le 25/12/2025',
							successMessage: 'Date correcte (25/12/2025)',
							date: '25/12/2025'
						}
					}]"
					:show-success-messages="true"
				/>
			</div>
			<VBtn
				size="small"
				color="primary"
				@click="date7 = '25/12/2025'"
			>
				25/12/2025
			</VBtn>
			<VBtn
				size="small"
				class="ml-2"
				@click="date7 = '26/12/2025'"
			>
				26/12/2025
			</VBtn>
			<div class="mt-2">
				Valeur actuelle: {{ date7 }}
			</div>
		</section>

		<!-- Exemple 8: customRules (règle personnalisée) -->
		<section class="mb-10">
			<SyHeading
				class="text-h6 mb-3"
				:level="2"
			>
				Règle personnalisée (custom)
			</SyHeading>
			<p class="text-body-2 mb-2">
				Cette règle vérifie que la date n'est pas en 2024
			</p>
			<div class="mb-2">
				<DatePicker
					v-model="date8"
					label="Date hors 2024"
					placeholder="Date hors 2024"
					:custom-rules="[{
						type: 'custom',
						options: {
							validate: (value) => {
								// Si pas de valeur, c'est valide
								if (!value) return true
								// Convertir en chaîne si ce n'est pas déjà le cas
								const dateStr = value.toString()
								// Vérifier si c'est une Date et extraire l'année
								if (value instanceof Date) {
									return value.getFullYear() !== 2024
								}
								// Fallback sur la vérification de chaîne
								return !dateStr.includes('2024')
							},
							message: 'Les dates en 2024 ne sont pas autorisées',
							successMessage: 'Date valide (hors 2024)',
							fieldIdentifier: 'date'
						}
					}]"
					:show-success-messages="true"
				/>
			</div>
			<VBtn
				size="small"
				color="primary"
				@click="date8 = '15/04/2025'"
			>
				15/04/2025
			</VBtn>
			<VBtn
				size="small"
				class="ml-2"
				@click="date8 = '15/12/2024'"
			>
				15/12/2024
			</VBtn>
			<div class="mt-2">
				Valeur actuelle: {{ date8 }}
			</div>
		</section>

		<!-- Exemple 9: customWarningRules -->
		<section class="mb-10">
			<SyHeading
				class="text-h6 mb-3"
				:level="2"
			>
				Règle d'avertissement
			</SyHeading>
			<p class="text-body-2 mb-2">
				Cette règle affiche un avertissement si la date est en 2025
			</p>
			<div class="mb-2">
				<DatePicker
					v-model="date9"
					label="Date avec avertissement"
					placeholder="Date (avertissement pour 2025)"
					:custom-warning-rules="[{
						type: 'custom',
						options: {
							validate: (value) => {
								// Si pas de valeur, c'est valide
								if (!value) return true

								// Convertir en chaîne si ce n'est pas déjà le cas
								const dateStr = value.toString()

								// Vérifier si c'est une Date et extraire l'année
								if (value instanceof Date) {
									return value.getFullYear() !== 2025
								}

								// Fallback sur la vérification de chaîne
								return !dateStr.includes('2025')
							},
							warningMessage: 'Attention : les dates en 2025 génèrent un avertissement',
							successMessage: 'Date hors 2025',
							fieldIdentifier: 'date',
							isWarning: true
						}
					}]"
					:show-success-messages="true"
				/>
			</div>
			<VBtn
				size="small"
				color="primary"
				@click="date9 = '15/04/2025'"
			>
				15/04/2025
			</VBtn>
			<VBtn
				size="small"
				class="ml-2"
				@click="date9 = '15/12/2026'"
			>
				15/12/2026
			</VBtn>
			<div class="mt-2">
				Valeur actuelle: {{ date9 }}
			</div>
		</section>

		<!-- Exemple 10: Combinaison de plusieurs règles -->
		<section class="mb-10">
			<SyHeading
				class="text-h6 mb-3"
				:level="2"
			>
				Combinaison de plusieurs règles
			</SyHeading>
			<p class="text-body-2 mb-2">
				Exemple de DatePicker avec plusieurs règles de validation
			</p>
			<div class="mb-2">
				<DatePicker
					v-model="date10"
					label="Date de travail"
					placeholder="Date de travail"
					required
					:custom-rules="[
						{
							type: 'notWeekend',
							options: { message: 'La date ne peut pas être un weekend' }
						},
						{
							type: 'notAfterToday',
							options: { message: 'La date ne peut pas être dans le futur' }
						}
					]"
					:show-success-messages="true"
				/>
			</div>
			<VBtn
				size="small"
				color="primary"
				@click="date10 = today"
			>
				Aujourd'hui
			</VBtn>
			<VBtn
				size="small"
				class="ml-2"
				@click="date10 = '13/04/2025'"
			>
				Weekend
			</VBtn>
			<VBtn
				size="small"
				class="ml-2"
				@click="date10 = nextYear"
			>
				Futur
			</VBtn>
			<div class="mt-2">
				Valeur actuelle: {{ date10 }}
			</div>
		</section>
	</div>
</template>

<style scoped>
.date-picker-validation-examples {
	padding: 20px;
	max-width: 800px;
	margin: 0 auto;
}

section {
	padding: 20px;
	border: 1px solid #e0e0e0;
	border-radius: 4px;
}
</style>
