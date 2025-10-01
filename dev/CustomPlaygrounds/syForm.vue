<script setup lang="ts">
import { ref } from 'vue'
import SyForm from '@/components/Customs/SyForm/SyForm.vue'
import NirField from '@/components/NirField/NirField.vue'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
import PasswordField from '@/components/PasswordField/PasswordField.vue'
import PhoneField from '@/components/PhoneField/PhoneField.vue'
import SySelect from '@/components/Customs/Selects/SySelect/SySelect.vue'
import SyCheckbox from '@/components/Customs/SyCheckbox/SyCheckbox.vue'
import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'

	// Définir un type pour la ref du formulaire avec la méthode validate
	interface FormRef {
		validate: () => Promise<boolean>
	}

	const form = ref<FormRef | null>(null)
	const customRules = ref('a')
	const warningValue = ref('a')
	const NirFieldValue = ref('')
	const TextFieldValue = ref('')
	const PasswordValue = ref('')
	const PhoneFieldValue = ref('')
	const SelectValue = ref('')
	const checked = ref(false)
	const date = ref(null)
	const date1 = ref(null)

	const items = [
		{ text: 'Adrien', value: 'Adrien' },
		{ text: 'Axel', value: 'Axel' },
		{ text: 'Baptiste', value: 'Baptiste' },
		{ text: 'Clement', value: 'Clement' },
		{ text: 'Corentin', value: 'Corentin' },
		{ text: 'Damien', value: 'Damien' },
		{ text: 'David', value: 'David' },
		{ text: 'Eloi', value: 'Eloi' },
		{ text: 'Louis', value: 'Louis' },
		{ text: 'Valentin', value: 'Valentin' },
	]

	const submitForm = async () => {
		// Vérifier si form.value existe avant d'appeler validate()
		if (!form.value) {
			alert('Formulaire non disponible')
			return
		}

		// validate() retourne un booléen, pas un objet
		const isValid = await form.value.validate()
		if (isValid) {
			// Formulaire valide
			alert('ok')
		}
		else {
			// Formulaire invalide
			alert('oupsi')
		}
	}

	const firstName = ref('')
	const firstNameRules = [
		(value) => {
			if (value?.length >= 3) return true
			return 'First name must be at least 3 characters.'
		},
	]

	const lastName = ref('123')
	const lastNameRules = [
		(value) => {
			if (/[^0-9]/.test(value)) return true
			return 'Last name can not contain digits.'
		},
	]
</script>

<template>
	<div class="pa-12">
		<SyForm
			ref="form"
			@submit="submitForm"
		>
			<SyTextField
				v-model="customRules"
				label="Champ avec avertissements"
				:custom-rules="[
					{
						type: 'matchPattern',
						options: {
							pattern: /^\d{5}$/,
							message: 'Le code postal doit contenir exactement 5 chiffres',
							successMessage: 'Le format du code postal est valide'
						}
					}
				]"
				show-success-messages
			/>
			<SyTextField
				v-model="warningValue"
				label="Champ avec avertissements"
				:custom-warning-rules="[
					{
						type: 'minLength',
						options: {
							length: 10,
							message: 'Le texte doit comporter plus de 10 caracteres'
						}
					}
				]"
				show-success-messages
			/>
			<DatePicker
				v-model="date"
				required
				placeholder="Sélectionner une date"
				format="DD/MM/YYYY"
			/>
			<DatePicker
				v-model="date1"
				required
				placeholder="Sélectionner une date"
				format="DD/MM/YYYY"
			/>
			<SyCheckbox
				v-model="checked"
				label="Case à cocher obligatoire"
				required
				:is-validate-on-blur="false"
			/>
			<SySelect
				v-model="SelectValue"
				required
				:items="items"
			/>
			<PhoneField
				v-model="PhoneFieldValue"
				required
				with-country-code
				country-code-required
				:is-validated-on-blur="true"
			/>
			<PasswordField
				v-model="PasswordValue"
				required
				label="Mot de passe"
				placeholder="Entrez votre mot de passe"
			/>
			<SyTextField
				v-model="TextFieldValue"
				required
				label="Champ requis sans astérisque"
			/>
			<NirField
				v-model="NirFieldValue"
				:required="true"
				number-label="Numéro de sécurité sociale"
				:display-key="false"
			/>
			<v-text-field
				v-model="firstName"
				:rules="firstNameRules"
				label="First name"
			/>

			<v-text-field
				v-model="lastName"
				:rules="lastNameRules"
				label="Last name"
				validate-on="submit"
			/>
			<v-btn type="submit">
				Soumettre
			</v-btn>
		</SyForm>
	</div>
</template>

<style lang="scss" scoped>
.playground-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
