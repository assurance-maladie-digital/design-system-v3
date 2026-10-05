<script setup lang="ts">
	import { ref } from 'vue'
	import { VCheckbox, VSelect, VTextField } from 'vuetify/components'
	import SyForm from '../SyForm.vue'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import SyTextArea from '@/components/SyTextArea/SyTextArea.vue'
	import SyCheckbox from '@/components/Customs/SyCheckbox/SyCheckbox.vue'
	import SyCheckBoxGroup from '@/components/Customs/SyCheckBoxGroup/SyCheckBoxGroup.vue'
	import SyRadioGroup from '@/components/Customs/SyRadioGroup/SyRadioGroup.vue'
	import SySelect from '@/components/Customs/Selects/SySelect/SySelect.vue'
	import SyAutocomplete from '@/components/Customs/Selects/SyAutocomplete/SyAutocomplete.vue'
	import SelectBtnField from '@/components/Customs/Selects/SelectBtnField/SelectBtnField.vue'
	import NirField from '@/components/NirField/NirField.vue'
	import PasswordField from '@/components/PasswordField/PasswordField.vue'
	import PhoneField from '@/components/PhoneField/PhoneField.vue'
	import MonthPicker from '@/components/MonthPicker/MonthPicker.vue'
	import LunarCalendar from '@/components/LunarCalendar/LunarCalendar.vue'

	const props = withDefaults(defineProps<{
		initiallyValid?: boolean
		initialPhone?: string
	}>(), {
		initiallyValid: false,
		initialPhone: undefined,
	})

	const initialValue = <Value>(emptyValue: Value, validValue: Value) =>
		props.initiallyValid ? validValue : emptyValue

	const formValidity = ref<boolean | null>(null)

	const fullName = ref(initialValue('', 'Jean Dupont'))
	const description = ref(initialValue('', 'Une demande de prise en charge.'))
	const consent = ref(initialValue(false, true))
	const coveredServices = ref(initialValue<string[]>([], ['care']))
	const preferredContact = ref(initialValue<string | null>(null, 'email'))
	const department = ref(initialValue<string | null>(null, '75'))
	const city = ref(initialValue<string | null>(null, 'paris'))
	const contactMethod = ref(initialValue<string | null>(null, 'email'))
	const nir = ref(initialValue('', '180067123456708'))
	const password = ref(initialValue('', 'MotDePasse123!'))
	const phone = ref(props.initialPhone ?? initialValue('', '0612345678'))
	const month = ref(initialValue('', '03/2025'))
	const lunarDate = ref(initialValue('', '15/08/2023'))
	const nativeName = ref(initialValue('', 'Jean Dupont'))
	const nativeDepartment = ref(initialValue<string | null>(null, '75'))
	const nativeConsent = ref(initialValue(false, true))

	const requiredRules = [
		{ type: 'required', options: { message: 'Ce champ est obligatoire' } },
	]
	const requiredTrueRules = [
		{
			type: 'custom',
			options: {
				message: 'Votre consentement est obligatoire',
				validate: (value: unknown) => value === true,
			},
		},
	]
	const nativeRequiredRule = (value: unknown): boolean | string =>
		(value !== null && value !== undefined && value !== '') || 'Ce champ est obligatoire'
	const nativeConsentRule = (value: boolean): boolean | string =>
		value || 'Votre consentement est obligatoire'

	const departments = [
		{ title: 'Paris', text: 'Paris', value: '75' },
		{ title: 'Rhone', text: 'Rhone', value: '69' },
	]
	const cities = [
		{ text: 'Paris', value: 'paris' },
		{ text: 'Lyon', value: 'lyon' },
	]
	const services = [
		{ label: 'Soins', value: 'care' },
		{ label: 'Prevention', value: 'prevention' },
	]
	const contactOptions = [
		{ label: 'Courriel', value: 'email' },
		{ label: 'Telephone', value: 'phone' },
	]
	const contactMethods = [
		{ text: 'Courriel', value: 'email' },
		{ text: 'Telephone', value: 'phone' },
	]

	const setValidValues = () => {
		fullName.value = 'Jean Dupont'
		description.value = 'Une demande de prise en charge.'
		consent.value = true
		coveredServices.value = ['care']
		preferredContact.value = 'email'
		department.value = '75'
		city.value = 'paris'
		contactMethod.value = 'email'
		nir.value = '180067123456708'
		password.value = 'MotDePasse123!'
		phone.value = '0612345678'
		month.value = '03/2025'
		lunarDate.value = '15/08/2023'
		nativeName.value = 'Jean Dupont'
		nativeDepartment.value = '75'
		nativeConsent.value = true
	}

	const setNativeInvalidValue = () => {
		nativeConsent.value = false
	}

	const setSynapseInvalidValue = () => {
		consent.value = false
	}

	defineExpose({
		setValidValues,
		setNativeInvalidValue,
		setSynapseInvalidValue,
	})
</script>

<template>
	<SyForm v-model="formValidity">
		<div class="integration-test-form">
			<SyTextField
				v-model="fullName"
				label="Nom complet"
				:custom-rules="requiredRules"
			/>
			<SyTextArea
				v-model="description"
				label="Description"
				:custom-rules="requiredRules"
			/>
			<SyCheckbox
				v-model="consent"
				label="Consentement Synapse"
				:custom-rules="requiredTrueRules"
			/>
			<SyCheckBoxGroup
				v-model="coveredServices"
				label="Prestations"
				:options="services"
				multiple
				:custom-rules="requiredRules"
			/>
			<SyRadioGroup
				v-model="preferredContact"
				label="Contact prefere"
				:options="contactOptions"
				:custom-rules="requiredRules"
			/>
			<SySelect
				v-model="department"
				label="Departement Synapse"
				:items="departments"
				:custom-rules="requiredRules"
			/>
			<SyAutocomplete
				v-model="city"
				label="Ville"
				:items="cities"
				:custom-rules="requiredRules"
			/>
			<SelectBtnField
				v-model="contactMethod"
				label="Canal de contact"
				:items="contactMethods"
				:custom-rules="requiredRules"
			/>
			<NirField
				v-model="nir"
				required
			/>
			<PasswordField
				v-model="password"
				label="Mot de passe"
				:custom-rules="requiredRules"
			/>
			<PhoneField
				v-model="phone"
				required
			/>
			<MonthPicker
				v-model="month"
				label="Mois de reference"
				:custom-rules="requiredRules"
			/>
			<LunarCalendar
				v-model="lunarDate"
				label="Date lunaire"
				:custom-rules="requiredRules"
			/>
			<VTextField
				v-model="nativeName"
				label="Nom Vuetify"
				:rules="[nativeRequiredRule]"
			/>
			<VSelect
				v-model="nativeDepartment"
				label="Departement Vuetify"
				:items="departments"
				:rules="[nativeRequiredRule]"
			/>
			<VCheckbox
				v-model="nativeConsent"
				label="Consentement Vuetify"
				:rules="[nativeConsentRule]"
			/>
		</div>
		<span data-testid="form-validity">
			{{ formValidity === null ? 'null' : String(formValidity) }}
		</span>
	</SyForm>
</template>
