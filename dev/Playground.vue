<script setup lang="ts">
	import { ref, computed } from 'vue'
	import SyForm from '@/components/Customs/SyForm/SyForm.vue'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import SySelect from '@/components/Customs/Selects/SySelect/SySelect.vue'
	import SyAutocomplete from '@/components/Customs/Selects/SyAutocomplete/SyAutocomplete.vue'
	import SyRadioGroup from '@/components/Customs/SyRadioGroup/SyRadioGroup.vue'
	import SyCheckBoxGroup from '@/components/Customs/SyCheckBoxGroup/SyCheckBoxGroup.vue'
	import SyCheckbox from '@/components/Customs/SyCheckbox/SyCheckbox.vue'
	import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
	import PhoneField from '@/components/PhoneField/PhoneField.vue'
	import NirField from '@/components/NirField/NirField.vue'

	// v-model tri-état du SyForm : null (saisie en cours) | false (invalide) | true (valide)
	const isFormValid = ref<boolean | null>(null)

	const form = ref({
		civility: '',
		firstName: '',
		lastName: '',
		birthDate: '',
		phone: '',
		// NIR pré-rempli valide (numéro 13 chiffres + clé 2 chiffres = 15)
		nir: '294037512000591',
		situation: '',
		contactChannels: [] as string[],
		consent: false,
	})

	const civilities = [
		{ text: 'Madame', value: 'mrs' },
		{ text: 'Monsieur', value: 'mr' },
	]
	const firstNames = [
		{ text: 'Camille', value: 'Camille' },
		{ text: 'Alex', value: 'Alex' },
		{ text: 'Dominique', value: 'Dominique' },
		{ text: 'Sacha', value: 'Sacha' },
	]
	const situations = [
		{ label: 'Salarié·e', value: 'employee' },
		{ label: 'Indépendant·e', value: 'freelance' },
		{ label: 'Sans emploi', value: 'unemployed' },
	]
	const contactOptions = [
		{ label: 'Email', value: 'email' },
		{ label: 'Téléphone', value: 'phone' },
		{ label: 'Courrier', value: 'mail' },
	]
	const requiredRule = [{ type: 'required', options: { message: 'Ce champ est obligatoire' } }]

	// Libellé + couleur dérivés du tri-état du v-model
	const validity = computed(() => {
		if (isFormValid.value === true) return { label: 'Formulaire valide', color: 'success' }
		if (isFormValid.value === false) return { label: 'Formulaire invalide', color: 'error' }
		return { label: 'Saisie en cours', color: 'default' }
	})

	const submitForm = (e: { isValid: boolean }) => {
		if (e.isValid) {
			alert('Formulaire valide ! Données: ' + JSON.stringify(form.value, null, 2))
		}
		else {
			alert('Formulaire invalide, veuillez corriger les erreurs.')
		}
	}

	// Le SyForm réinitialise la validation des champs enregistrés ; on efface aussi
	// les valeurs des v-model externes pour un reset complet.
	const resetForm = () => {
		form.value = {
			civility: '',
			firstName: '',
			lastName: '',
			birthDate: '',
			phone: '',
			nir: '294037512000591',
			situation: '',
			contactChannels: [],
			consent: false,
		}
	}
</script>

<template>
	<div class="pa-12 playground-form">
		<SyForm
			v-model="isFormValid"
			@submit="submitForm"
			@reset="resetForm"
		>
			<div class="d-flex flex-column gap-4">
				<v-chip
					:color="validity.color"
					size="small"
					label
					class="align-self-start mb-2"
				>
					{{ validity.label }}
				</v-chip>

				<SySelect
					v-model="form.civility"
					:items="civilities"
					label="Civilité"
					required
					class="mb-2"
				/>
				<SyTextField
					v-model="form.lastName"
					label="Nom"
					:custom-rules="requiredRule"
					class="mb-2"
				/>
				<SyAutocomplete
					v-model="form.firstName"
					:items="firstNames"
					label="Prénom"
					class="mb-2"
				/>
				<DatePicker
					v-model="form.birthDate"
					label="Date de naissance"
					placeholder="JJ/MM/AAAA"
					format="DD/MM/YYYY"
					class="mb-2"
				/>
				<PhoneField
					v-model="form.phone"
					:required="true"
					class="mb-2"
				/>
				<NirField
					v-model="form.nir"
					:required="true"
					number-label="Numéro de sécurité sociale"
					class="mb-2"
				/>
				<SyRadioGroup
					v-model="form.situation"
					label="Situation professionnelle"
					:options="situations"
					required
					class="mb-2"
				/>
				<SyCheckBoxGroup
					v-model="form.contactChannels"
					label="Canaux de contact souhaités"
					:options="contactOptions"
					class="mb-2"
				/>
				<SyCheckbox
					v-model="form.consent"
					label="J'accepte les conditions d'utilisation"
					required
				/>

				<div class="d-flex gap-3 mt-2">
					<v-btn
						type="reset"
						color="secondary"
						variant="outlined"
					>
						Réinitialiser
					</v-btn>
					<v-btn
						type="submit"
						color="primary"
					>
						Envoyer
					</v-btn>
				</div>
			</div>
		</SyForm>
	</div>
</template>

<style lang="scss" scoped>
.playground-form {
	max-width: 640px;
}
</style>
