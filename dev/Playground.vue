<script setup lang="ts">
import { ref } from 'vue'
import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'

	const datePickerRef = ref(null)
	const dateValue = ref('')

	// Custom rule avec console.log pour tester si elle s'exécute sur champ vide
	const customRules = [
		{
			type: 'custom',
			options: {
				validate: (value: unknown) => {
					console.log('🔍 COMBINED MODE - CUSTOM RULE EXECUTED - Value:', value)
					console.log('🔍 COMBINED MODE - CUSTOM RULE EXECUTED - Type:', typeof value)
					console.log('🔍 COMBINED MODE - CUSTOM RULE EXECUTED - Is empty?', !value || value === '')

					// Toujours retourner false pour voir l'erreur
					if (!value || value === '') {
						console.log('❌ COMBINED MODE - CUSTOM RULE - Rejecting empty value')
						return false
					}

					console.log('✅ COMBINED MODE - CUSTOM RULE - Accepting value')
					return true
				},
				message: 'Custom rule: Ce champ ne peut pas être vide (Combined Mode)',
			},
		},
	]

	// Test validateOnSubmit
	const testValidateOnSubmit = () => {
		console.log('📝 COMBINED MODE TEST - Starting...')
		console.log('📝 COMBINED MODE TEST - Date value:', dateValue.value)

		if (datePickerRef.value) {
			console.log('📝 COMBINED MODE TEST - Calling validateOnSubmit()...')
			const result = datePickerRef.value.validateOnSubmit()
			console.log('📝 COMBINED MODE TEST - Result:', result)
		}
		else {
			console.log('❌ COMBINED MODE TEST - datePickerRef is null')
		}
	}

	// Clear console
	const clearConsole = () => {
		console.clear()
		console.log('🧹 Console cleared - Ready for Combined Mode testing!')
	}
</script>

<template>
	<div class="pa-4">
		<h1>Test Custom Rule avec use-combined-mode</h1>

		<div class="mb-4">
			<h2>Problème à reproduire:</h2>
			<p>Les console.log dans les custom rules ne s'exécutent pas avec use-combined-mode</p>
		</div>

		<div class="test-section mb-4">
			<h3>DatePicker avec use-combined-mode + custom rule</h3>
			<DatePicker
				ref="datePickerRef"
				v-model="dateValue"
				label="Date de test (Combined Mode)"
				:custom-rules="customRules"
			/>

			<div class="mt-4">
				<strong>Valeur actuelle:</strong> "{{ dateValue }}" ({{ dateValue ? 'non vide' : 'vide' }})
			</div>
		</div>

		<div class="actions mb-4">
			<v-btn
				color="primary"
				class="mr-2"
				@click="testValidateOnSubmit"
			>
				Test validateOnSubmit
			</v-btn>
			<v-btn
				variant="outlined"
				class="mr-2"
				@click="dateValue = ''"
			>
				Vider le champ
			</v-btn>
			<v-btn
				variant="outlined"
				color="secondary"
				@click="clearConsole"
			>
				Clear Console
			</v-btn>
		</div>

		<div class="instructions">
			<h3>Instructions de test:</h3>
			<ol>
				<li><strong>Ouvrez la console</strong> (F12)</li>
				<li><strong>Cliquez "Clear Console"</strong> pour nettoyer</li>
				<li><strong>Laissez le champ vide</strong> et cliquez "Test validateOnSubmit"</li>
				<li><strong>Observez la console</strong> - vous devriez voir les logs de la custom rule</li>
			</ol>

			<div
				class="mt-4 pa-3"
				style="background-color: #fff3cd; border-radius: 4px;"
			>
				<strong>Résultat attendu:</strong> Si le problème existe, vous ne verrez PAS les logs
				"🔍 COMBINED MODE - CUSTOM RULE EXECUTED" dans la console.
			</div>
		</div>
	</div>
</template>

<style scoped>
.test-section {
	padding: 16px;
	border: 1px solid #ddd;
	border-radius: 8px;
	background-color: #f9f9f9;
}

.actions {
	display: flex;
	gap: 8px;
	flex-wrap: wrap;
}

.instructions {
	padding: 16px;
	background-color: #e8f4fd;
	border-radius: 4px;
	border-left: 4px solid #2196f3;
}

.instructions ol {
	margin-left: 20px;
}

.instructions li {
	margin-bottom: 8px;
}
</style>
