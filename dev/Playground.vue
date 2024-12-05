<script lang="ts" setup>
	import { ref } from 'vue'
	import { useFieldValidation } from '@/composables'
	import PhoneField from '@/components/PhoneField/PhoneField.vue'

	const { generateRules } = useFieldValidation()

	const firstName = ref('')
	const lastName = ref('')
	const nickName = ref('')
	const email = ref('')
	const phoneNumber = ref('')
	const age = ref('')

	const rules = {
		firstName: generateRules([
			{ type: 'required', options: { message: 'Custom message' } },
			{ type: 'minLength', options: { length: 3, ignoreSpace: true } },
			{ type: 'maxLength', options: { length: 20 } },
		]),
		lastName: generateRules([
			{ type: 'required', options: { fieldName: 'Last name' } },
			{ type: 'minLength', options: { length: 3 } },
			{ type: 'maxLength', options: { length: 20 } },
		]),
		nickName: generateRules([
			{ type: 'minLength', options: { length: 3 } },
			{ type: 'maxLength', options: { length: 20 } },
		]),
		email: generateRules([
			{ type: 'required', options: { fieldName: 'Email' } },
			{ type: 'email' },
		]),
		phoneNumber: generateRules([
			{ type: 'required', options: { fieldName: 'Numéro de téléphone' } },
			{ type: 'exactLength', options: { length: 10 } },
		]),
		age: generateRules([
			{ type: 'required', options: { fieldName: 'Age' } },
			{ type: 'min', options: { value: 18 } },
			{ type: 'max', options: { value: 99 } },
		]),
	}

	const validateField = (field: string) => {
		return rules[field].every(rule => rule(field))
	}

	const validateForm = () => {
		return [firstName, lastName, email, phoneNumber].every(field => field.value)
	}

	const handleSubmit = () => {
		if (validateForm()) {
			alert('Form valide')
		}
		else {
			alert('Merci de renseigner tous les champs requis')
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
