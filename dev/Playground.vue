<script lang="ts" setup>
	import { ref } from 'vue'
	import {
		useRequiredRules,
		useEmailRule,
		useExactLengthRule,
		useMaxLengthRule,
		useMinLengthRule,
		useMatchPatternRule,
	} from '@/composables'
	import PhoneField from '@/components/PhoneField/PhoneField.vue'

	const firstName = ref('')
	const lastName = ref('')
	const nickName = ref('')
	const email = ref('')
	const phoneNumber = ref('')
	const age = ref('')

	const { requiredRule } = useRequiredRules()
	const { email: emailRule } = useEmailRule()
	const { exactLength } = useExactLengthRule()
	const { maxLength: maxLengthRule } = useMaxLengthRule()
	const { minLength: minLengthRule } = useMinLengthRule()
	const { matchPattern } = useMatchPatternRule()

	const rules = {
		firstName: [
			requiredRule('First name'),
			exactLength(5, 'Le prénom doit être exactement de 5 caractères.'),
		],
		lastName: [
			requiredRule('Last name', 'Veuillez entrer votre nom.'),
			minLengthRule(4, 'Le nom doit avoir au moins 2 caractères.', true),
			maxLengthRule(20, 'Le nom ne doit pas dépasser 20 caractères.', true),
		],
		nickName: [
			minLengthRule(4, 'Le surnom doit avoir au moins 2 caractères.', true),
		],
		email: [
			emailRule('Email', 'Veuillez entrer un email valide.'),
		],
		phoneNumber: [exactLength(10, 'Le numéro de téléphone doit être exactement de 10 chiffres.', true),
		],
		age: [
			matchPattern(/^\d+$/, 'Seul des numeros sont autorises.'),
			maxLengthRule(2, 'L\'age ne doit pas dépasser 2 caractères.', true),
		],
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
		<v-form @submit.prevent="handleSubmit">
			<v-text-field
				v-model="firstName"
				:rules="rules.firstName"
				label="First name"
				@blur="validateField('firstName')"
			/>
			<v-text-field
				v-model="lastName"
				:rules="rules.lastName"
				label="Last name"
				@blur="validateField('lastName')"
			/>
			<v-text-field
				v-model="nickName"
				:rules="rules.nickName"
				label="NickName"
				@blur="validateField('nickName')"
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
			<v-text-field
				v-model="age"
				:rules="rules.age"
				label="Age Field"
				@blur="validateField('age')"
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
