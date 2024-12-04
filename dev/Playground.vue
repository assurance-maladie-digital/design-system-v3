<script lang="ts" setup>
	import { ref } from 'vue'
	import { useRequiredRules } from '@/composables/requiredRule'
	import { useEmailRule } from '@/composables/emailRule'
	import { useExactLengthRule } from '@/composables/exactLengthRule'
	import PhoneField from '@/components/PhoneField/PhoneField.vue'

	const firstName = ref('')
	const lastName = ref('')
	const email = ref('')
	const phoneNumber = ref('')

	const { requiredRule } = useRequiredRules()
	const { email: emailRule } = useEmailRule()
	const { exactLength } = useExactLengthRule()

	const rules = {
		firstName: [requiredRule('First name'), exactLength(3, 'Le prénom doit être exactement de 3 caractères.')],
		lastName: [requiredRule('Last name', 'Veuillez entrer votre nom.')],
		email: [emailRule('Email', 'Veuillez entrer un email valide.')],
		phoneNumber: [exactLength(10, 'Le numéro de téléphone doit être exactement de 10 chiffres.', true)],
	}

	const validateField = (field: string) => {
		return rules[field].every(rule => rule(field))
	}

	const validateForm = () => {
		return [firstName, lastName, email, phoneNumber].every(field => field.value)
	}

	const handleSubmit = () => {
		if (validateForm()) {
			console.log('Form valide')
		}
		else {
			console.log('Merci de renseigner tous les champs requis')
		}
	}
</script>

<template>
	<v-sheet
		class="mx-auto"
		width="300"
	>
		{{ rules.firstName }}
		<v-form @submit.prevent="handleSubmit">
			<v-text-field
				v-model="firstName"
				:rules="rules.firstName"
				label="First name"
				@blur="validateField('firstName')"
			/>
			{{ rules.lastName }}
			<v-text-field
				v-model="lastName"
				:rules="rules.lastName"
				label="Last name"
				@blur="validateField('lastName')"
			/>
			<v-text-field
				v-model="email"
				:rules="rules.email"
				label="Email"
				@blur="validateField('email')"
			/>
			<PhoneField
				v-model="phoneNumber"
				:required="true"
				label="Phone Number"
				@blur="validateField('phoneNumber')"
			/>
			<v-btn
				block
				class="mt-2"
				type="submit"
			>
				Submit
			</v-btn>
		</v-form>
	</v-sheet>
</template>
