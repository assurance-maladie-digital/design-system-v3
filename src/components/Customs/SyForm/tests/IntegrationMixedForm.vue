<script setup lang="ts">
	import { ref } from 'vue'
	import { VCheckbox, VTextField, VTextarea } from 'vuetify/components'
	import SyForm from '../SyForm.vue'
	import SyCheckbox from '@/components/Customs/SyCheckbox/SyCheckbox.vue'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'

	const props = withDefaults(defineProps<{
		initialEmail?: string
		initialOptionalComment?: string
	}>(), {
		initialEmail: '',
		initialOptionalComment: '',
	})

	const formValidity = ref<boolean | null>(null)
	const name = ref('')
	const optionalComment = ref(props.initialOptionalComment)
	const synapseConsent = ref(false)
	const email = ref(props.initialEmail)
	const message = ref('')
	const optionalDetails = ref('')
	const vuetifyConsent = ref(false)

	const requiredRules = [
		{ type: 'required', options: { message: 'Ce champ est obligatoire' } },
	]
	const requiredTrueRules = [
		{ type: 'required', options: { message: 'Votre consentement est obligatoire' } },
	]
	const nativeRequiredRule = (value: unknown): boolean | string =>
		(value !== null && value !== undefined && value !== '') || 'Ce champ est obligatoire'
	const nativeEmailRule = (value: unknown): boolean | string =>
		(typeof value === 'string' && /.+@.+\..+/.test(value)) || 'Adresse email invalide'
	const nativeConsentRule = (value: boolean): boolean | string =>
		value || 'Votre consentement est obligatoire'

</script>

<template>
	<SyForm v-model="formValidity">
		<SyTextField
			v-model="name"
			label="Nom"
			:custom-rules="requiredRules"
		/>
		<SyTextField
			v-model="optionalComment"
			label="Commentaire optionnel"
		/>
		<SyCheckbox
			v-model="synapseConsent"
			label="Consentement Synapse"
			:custom-rules="requiredTrueRules"
		/>
		<VTextField
			v-model="email"
			label="Adresse email"
			:rules="[nativeRequiredRule, nativeEmailRule]"
		/>
		<VTextarea
			v-model="message"
			label="Message"
			:rules="[nativeRequiredRule]"
		/>
		<VTextarea
			v-model="optionalDetails"
			label="Details optionnels"
		/>
		<VCheckbox
			v-model="vuetifyConsent"
			label="Consentement Vuetify"
			:rules="[nativeConsentRule]"
		/>
		<span data-testid="form-validity">
			{{ formValidity === null ? 'null' : String(formValidity) }}
		</span>
	</SyForm>
</template>
