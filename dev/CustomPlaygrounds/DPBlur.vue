<script lang="ts" setup>
	import { ref, nextTick } from 'vue'
	import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'

	// Références pour accéder aux composants DatePicker
	const dateSinistreRef = ref(null)
	const dateSinistreBisRef = ref(null)
	const dateWithoutBlurRef = ref(null)
	const dateWithBlurRef = ref(null)

	// États pour les dates
	const dateSinistre = ref(null)
	const dateSinistreBis = ref(null)
	const dateWithoutBlur = ref(null)
	const dateWithBlur = ref(null)

	// Règle de validation personnalisée
	const customDateRules = [
		{
			type: 'notAfterToday',
			options: {
				message: 'La date ne peut pas être postérieure à aujourd\'hui',
			},
		},
	]

	// Message d'état pour le formulaire
	const formStatus = ref('')
	const formStatusBis = ref('')
	const blurStatus = ref('')

	// Validation sans soumettre le formulaire
	const validateWithoutSubmit = () => {
		if (dateSinistreRef.value) {
			// On appelle simplement validateOnSubmit sans vérifier son retour
			dateSinistreRef.value.validateOnSubmit()
			formStatus.value = 'validateOnSubmit() appelé mais pas vérifié'
		}
	}

	// Validation avec soumission du formulaire
	const validateWithSubmit = async () => {
		if (dateSinistreBisRef.value) {
			// On vérifie le retour de validateOnSubmit
			const isValid = dateSinistreBisRef.value.validateOnSubmit()

			// Attendre que la validation soit appliquée dans le DOM
			await nextTick()

			if (isValid) {
				formStatusBis.value = '✅ Le formulaire est valide - validateOnSubmit() a retourné true'
			}
			else {
				formStatusBis.value = '❌ Le formulaire n\'est pas valide - validateOnSubmit() a retourné false'
			}
		}
	}

	// Tests pour le comportement de validation au blur
	const checkBlurBehavior = async () => {
		// Vérifier l'état des deux champs
		if (dateWithoutBlurRef.value && dateWithBlurRef.value) {
			blurStatus.value = `
      Sans validation au blur: ${dateWithoutBlurRef.value.errorMessages?.length || 0} erreurs
      Avec validation au blur: ${dateWithBlurRef.value.errorMessages?.length || 0} erreurs
    `
		}
	}
</script>

<template>
	<div class="validation-issues-playground">
		<h1>Test des problèmes de validation avec DatePicker</h1>

		<div class="test-section">
			<h2>Test 1: validateOnSubmit avec required et custom rules</h2>
			<p class="description">
				Test si l'utilisation de validateOnSubmit sur une ref avec required/custom-rules déclenche correctement l'erreur.
			</p>

			<div class="test-case">
				<h3>Test 1.1: validateOnSubmit() sans vérifier le retour</h3>
				<DatePicker
					ref="dateSinistreRef"
					v-model="dateSinistre"
					required
					:custom-rules="customDateRules"
					placeholder="Date du sinistre"
				/>
				<div class="actions">
					<button
						class="action-button"
						@click="validateWithoutSubmit"
					>
						Valider sans soumettre
					</button>
					<div
						v-if="formStatus"
						class="status"
					>
						{{ formStatus }}
					</div>
				</div>
			</div>

			<div class="test-case">
				<h3>Test 1.2: validateOnSubmit() avec vérification du retour</h3>
				<DatePicker
					ref="dateSinistreBisRef"
					v-model="dateSinistreBis"
					required
					:custom-rules="customDateRules"
					placeholder="Date du sinistre"
				/>
				<div class="actions">
					<button
						class="action-button"
						@click="validateWithSubmit"
					>
						Valider avec retour
					</button>
					<div
						v-if="formStatusBis"
						class="status"
					>
						{{ formStatusBis }}
					</div>
				</div>
			</div>
		</div>

		<div class="test-section">
			<h2>Test 2: Validation au blur</h2>
			<p class="description">
				Test si la propriété is-validate-on-blur="false" fonctionne correctement.
			</p>

			<div class="test-case">
				<h3>Sans validation au blur</h3>
				<DatePicker
					ref="dateWithoutBlurRef"
					v-model="dateWithoutBlur"
					:is-validate-on-blur="false"
					required
					placeholder="Cette date ne devrait pas valider au blur"
				/>
			</div>

			<div class="test-case">
				<h3>Avec validation au blur (comportement par défaut)</h3>
				<DatePicker
					ref="dateWithBlurRef"
					v-model="dateWithBlur"
					required
					placeholder="Cette date devrait valider au blur"
				/>
			</div>

			<div class="actions">
				<button
					class="action-button"
					@click="checkBlurBehavior"
				>
					Vérifier l'état des validations
				</button>
				<div
					v-if="blurStatus"
					class="status"
				>
					{{ blurStatus }}
				</div>
			</div>
		</div>

		<div class="instructions">
			<h3>Instructions pour tester</h3>
			<ol>
				<li>Pour le premier test: laissez le champ vide et cliquez sur le bouton "Valider" correspondant</li>
				<li>Pour le second test: cliquez dans les champs puis cliquez ailleurs (blur) et observez si des erreurs apparaissent</li>
			</ol>
		</div>
	</div>
</template>

<style scoped>
.validation-issues-playground {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 16px;
  color: #333;
}

h2 {
  margin-bottom: 8px;
  color: #555;
}

h3 {
  margin-bottom: 8px;
  color: #666;
}

.description {
  margin-bottom: 16px;
  color: #666;
  font-style: italic;
}

.test-section {
  margin-bottom: 32px;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.test-case {
  margin-bottom: 20px;
  padding: 16px;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.actions {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-button {
  padding: 8px 16px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  width: fit-content;
}

.action-button:hover {
  background-color: #1976d2;
}

.status {
  margin-top: 8px;
  padding: 8px 12px;
  background-color: #f5f5f5;
  border-radius: 4px;
  font-family: monospace;
  white-space: pre-wrap;
}

.instructions {
  margin-top: 24px;
  padding: 16px;
  background-color: #e8f4fd;
  border-radius: 4px;
  border-left: 4px solid #2196f3;
}

.instructions ol {
  margin-left: 20px;
  padding-left: 0;
}

.instructions li {
  margin-bottom: 8px;
}
</style>
