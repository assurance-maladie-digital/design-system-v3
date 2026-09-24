<script lang="ts" setup>
	import { ref, watch, type Ref } from 'vue'
	import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
	import MonthPicker from '@/components/MonthPicker/MonthPicker.vue'
	import NirField from '@/components/NirField/NirField.vue'
	import PasswordField from '@/components/PasswordField/PasswordField.vue'
	import PeriodField from '@/components/PeriodField/PeriodField.vue'
	import PhoneField from '@/components/PhoneField/PhoneField.vue'
	import SyAlert from '@/components/SyAlert/SyAlert.vue'
	import SyTextArea from '@/components/SyTextArea/SyTextArea.vue'
	import SyCheckbox from '@/components/Customs/SyCheckbox/SyCheckbox.vue'
	import SyCheckBoxGroup from '@/components/Customs/SyCheckBoxGroup/SyCheckBoxGroup.vue'
	import SyForm from '@/components/Customs/SyForm/SyForm.vue'
	import SyRadioGroup from '@/components/Customs/SyRadioGroup/SyRadioGroup.vue'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import SelectBtnField from '@/components/Customs/Selects/SelectBtnField/SelectBtnField.vue'
	import SyAutocomplete from '@/components/Customs/Selects/SyAutocomplete/SyAutocomplete.vue'
	import SySelect from '@/components/Customs/Selects/SySelect/SySelect.vue'
	import { mdiSwapHorizontal, mdiCheckCircle, mdiRefresh, mdiHistory, mdiTextAccount, mdiCalendarRange, mdiCheckDecagramOutline, mdiEyeOutline, mdiShieldCheckOutline, mdiVuetify } from '@mdi/js'

	// ── Le v-model de SyForm : tri-état boolean | null ──
	// null = au moins un champ vierge (validité inconnue), false = invalide, true = valide.
	// Deux onglets : validation Synapse (customRules) vs validation Vuetify (rules),
	// chacun avec son propre tableau de bord.

	const tab = ref(0)

	interface LogEntry {
		time: string
		value: boolean | null
		source: 'champ' | 'parent'
	}

	const synapseValidity = ref<boolean | null>(null)
	const vuetifyValidity = ref<boolean | null>(null)
	const synapseValidateOnSubmit = ref(true)
	const vuetifyValidateOnSubmit = ref(true)
	const synapseSubmitted = ref(false)
	const vuetifySubmitted = ref(false)
	const synapseFormRef = ref<InstanceType<typeof SyForm> | null>(null)
	const vuetifyFormRef = ref<InstanceType<typeof SyForm> | null>(null)

	const synapseLog = ref<LogEntry[]>([])
	const vuetifyLog = ref<LogEntry[]>([])
	const suppressSynapseLog = ref(false)
	const suppressVuetifyLog = ref(false)

	function logChange(log: Ref<LogEntry[]>, value: boolean | null, source: LogEntry['source']) {
		log.value.unshift({
			time: new Date().toLocaleTimeString('fr-FR'),
			value,
			source,
		})
		if (log.value.length > 12) {
			log.value.pop()
		}
	}

	watch(synapseValidity, (value) => {
		if (suppressSynapseLog.value) {
			suppressSynapseLog.value = false
			return
		}
		logChange(synapseLog, value, 'champ')
	})

	watch(vuetifyValidity, (value) => {
		if (suppressVuetifyLog.value) {
			suppressVuetifyLog.value = false
			return
		}
		logChange(vuetifyLog, value, 'champ')
	})

	// Écriture du model depuis le parent : teste le two-way binding.
	function forceSynapseModel(value: boolean | null) {
		suppressSynapseLog.value = true
		synapseValidity.value = value
		logChange(synapseLog, value, 'parent')
	}

	function forceVuetifyModel(value: boolean | null) {
		suppressVuetifyLog.value = true
		vuetifyValidity.value = value
		logChange(vuetifyLog, value, 'parent')
	}

	function validityLabel(value: boolean | null) {
		if (value === null) return { text: 'null', hint: 'vierge / inconnu', color: 'medium-emphasis' as const }
		if (value === true) return { text: 'true', hint: 'valide', color: 'success' as const }
		return { text: 'false', hint: 'invalide', color: 'error' as const }
	}

	// ── Valeurs des champs — formulaire Synapse ──

	const synapseLastName = ref('')
	const synapseEmail = ref('')
	const synapseMessage = ref('')
	const synapsePassword = ref<string | null>(null)
	const synapsePhone = ref('')
	const synapseNir = ref('')
	const synapseBirthDate = ref<string | null>(null)
	const synapseProjectMonth = ref<string | undefined>(undefined)
	const synapseStayPeriod = ref<{ from: string, to: string } | null>(null)
	const synapseCareType = ref<string | null>(null)
	const synapseDoctor = ref<string | null>(null)
	const synapseFileTransfer = ref<string | number | null>(null)
	const synapseTransmissionWay = ref<string | null>(null)
	const synapseNotifications = ref<string[]>([])
	const synapseConsent = ref(false)

	// ── Valeurs des champs — formulaire Vuetify ──

	const vuetifyLastName = ref('')
	const vuetifyEmail = ref('')
	const vuetifyMessage = ref('')
	const vuetifyPassword = ref<string | null>(null)
	const vuetifyPhone = ref('')
	const vuetifyNir = ref('')
	const vuetifyBirthDate = ref<string | null>(null)
	const vuetifyProjectMonth = ref<string | undefined>(undefined)
	const vuetifyPeriodStart = ref('')
	const vuetifyPeriodEnd = ref('')
	const vuetifyCareType = ref<string | null>(null)
	const vuetifyDoctor = ref<string | null>(null)
	const vuetifyContactChannel = ref<string | null>(null)
	const vuetifyBillingFormat = ref<string | null>(null)
	const vuetifyFileTransfer = ref<string | number | null>(null)
	const vuetifyTransmissionWay = ref<string | null>(null)
	const vuetifyNotifications = ref<string[]>([])
	const vuetifyConsent = ref(false)

	// ── Règles Synapse (customRules) ──

	const synapseNameRules = [
		{
			type: 'required',
			options: { message: 'Le nom est obligatoire', fieldIdentifier: 'Le nom' },
		},
		{
			type: 'minLength',
			options: { length: 2, message: 'Le nom doit contenir au moins 2 caractères' },
		},
	]

	const synapseEmailRules = [
		{
			type: 'required',
			options: { message: 'L’adresse e-mail est obligatoire', fieldIdentifier: 'L’adresse e-mail' },
		},
		{
			type: 'email',
			options: { message: 'L’adresse e-mail n’est pas valide', successMessage: 'Adresse e-mail valide' },
		},
	]

	const synapseMessageRules = [
		{
			type: 'required',
			options: { message: 'Le message est obligatoire', fieldIdentifier: 'Le message' },
		},
		{
			type: 'maxLength',
			options: { length: 200, message: 'Le message ne doit pas dépasser 200 caractères' },
		},
	]

	// Règle de warning (non bloquante) : n'invalide pas le formulaire.
	const synapseMessageWarningRules = [
		{
			type: 'custom',
			options: {
				validate: (value: string) => value.length <= 180,
				message: 'Attention : vous approchez de la limite de 200 caractères.',
			},
		},
	]

	const synapsePasswordRules = [
		{
			type: 'minLength',
			options: { length: 8, message: 'Le mot de passe doit contenir au moins 8 caractères' },
		},
	]

	const synapseDateRules = [
		{
			type: 'notBeforeToday',
			options: { message: 'La date ne peut pas être antérieure à aujourd’hui' },
		},
	]

	const synapseMonthRules = [
		{
			type: 'custom',
			options: {
				validate: (value: string) => /^(0[1-9]|1[0-2])\/\d{4}$/.test(value ?? ''),
				message: 'Le format doit être MM/AAAA (ex : 12/2026).',
			},
		},
	]

	const synapseRequiredChoice = (identifier: string) => [
		{
			type: 'required',
			options: { message: `Veuillez renseigner ${identifier}`, fieldIdentifier: identifier },
		},
	]

	const synapseConsentRules = [
		{
			type: 'required',
			options: { message: 'Vous devez accepter les conditions pour soumettre le formulaire' },
		},
	]

	// ── Règles Vuetify (rules : fonctions retournant true ou un message) ──

	const vuetifyNameRules = [
		(value: unknown) => (typeof value === 'string' && value.trim() !== '') || 'Le nom est obligatoire',
		(value: unknown) => (typeof value === 'string' && value.length >= 2) || 'Le nom doit contenir au moins 2 caractères',
	]

	const vuetifyEmailRules = [
		(value: unknown) => (typeof value === 'string' && value.trim() !== '') || 'L’adresse e-mail est obligatoire',
		(value: unknown) => (typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) || 'L’adresse e-mail n’est pas valide',
	]

	const vuetifyMessageRules = [
		(value: unknown) => (typeof value === 'string' && value.trim() !== '') || 'Le message est obligatoire',
		(value: unknown) => (typeof value === 'string' && value.length <= 200) || 'Le message ne doit pas dépasser 200 caractères',
	]

	const vuetifyPasswordRules = [
		(value: unknown) => (typeof value === 'string' && value.length >= 8) || 'Le mot de passe doit contenir au moins 8 caractères',
	]

	const vuetifyPhoneRules = [
		(value: unknown) => (typeof value === 'string' && value.trim() !== '') || 'Le numéro de téléphone est obligatoire',
	]

	const vuetifyNirNumberRules = [
		(value: unknown) => (typeof value === 'string' && value.trim() !== '') || 'Le numéro de sécurité sociale est requis',
	]

	const vuetifyNirKeyRules = [
		(value: unknown) => (typeof value === 'string' && value.trim() !== '') || 'La clé de validation est requise',
	]

	const vuetifyDateRules = [
		(value: unknown) => {
			if (!value) return true
			const today = new Date()
			today.setHours(0, 0, 0, 0)
			const input = new Date(value as string)
			input.setHours(0, 0, 0, 0)
			return input >= today || 'La date ne peut pas être antérieure à aujourd’hui'
		},
	]

	const vuetifyMonthRules = [
		(value: unknown) => (typeof value === 'string' && /^(0[1-9]|1[0-2])\/\d{4}$/.test(value)) || 'Le format doit être MM/AAAA (ex : 12/2026)',
	]

	const vuetifyDatePatternRules = [
		(value: unknown) => (typeof value === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(value)) || 'Le format attendu est JJ/MM/AAAA',
	]

	const vuetifyRequiredChoice = (message: string) => [
		(value: unknown) => {
			const filled = Array.isArray(value) ? value.length > 0 : value !== null && value !== undefined && value !== ''
			return filled || message
		},
	]

	const vuetifyConsentRules = [
		(value: unknown) => value === true || 'Vous devez accepter les conditions pour soumettre le formulaire',
	]

	// ── Données de référence (communes aux deux formulaires) ──

	const careTypeItems = [
		{ title: 'Consultation médecin généraliste', value: 'gp' },
		{ title: 'Consultation médecin spécialiste', value: 'specialist' },
		{ title: 'Soins dentaires', value: 'dental' },
		{ title: 'Hospitalisation', value: 'hospital' },
	]

	const doctorItems = [
		{ text: 'Dr Martin — Généraliste', value: 'martin' },
		{ text: 'Dr Bernard — Cardiologue', value: 'bernard' },
		{ text: 'Dr Dubois — Dermatologue', value: 'dubois' },
		{ text: 'Dr Petit — Pédiatre', value: 'petit' },
	]

	const contactChannelItems = [
		{ text: 'E-mail', value: 'email' },
		{ text: 'SMS', value: 'sms' },
		{ text: 'Courrier postal', value: 'courrier' },
	]

	const billingFormatItems = [
		{ text: 'Facture électronique', value: 'electronic' },
		{ text: 'Facture papier', value: 'paper' },
	]

	const fileTransferItems = [
		{ text: 'Téléversement immédiat', value: 'immediate' },
		{ text: 'Téléversement différé', value: 'deferred' },
	]

	const fileTransferOptions = [
		{ label: 'Voie sécurisée', value: 'secure' },
		{ label: 'Voie standard', value: 'standard' },
	]

	const notificationOptions = [
		{ label: 'Suivi du remboursement', value: 'refunds' },
		{ label: 'Rappels de rendez-vous', value: 'reminders' },
		{ label: 'Campagnes de prévention', value: 'prevention' },
	]

	// ── Soumission / réinitialisation ──

	function handleSynapseSubmit({ isValid }: { isValid: boolean }) {
		synapseSubmitted.value = isValid
	}

	function handleVuetifySubmit({ isValid }: { isValid: boolean }) {
		vuetifySubmitted.value = isValid
	}

	function handleSynapseReset() {
		synapseLastName.value = ''
		synapseEmail.value = ''
		synapseMessage.value = ''
		synapsePassword.value = null
		synapsePhone.value = ''
		synapseNir.value = ''
		synapseBirthDate.value = null
		synapseProjectMonth.value = undefined
		synapseStayPeriod.value = null
		synapseCareType.value = null
		synapseDoctor.value = null
		synapseFileTransfer.value = null
		synapseTransmissionWay.value = null
		synapseNotifications.value = []
		synapseConsent.value = false
		synapseSubmitted.value = false
	}

	function handleVuetifyReset() {
		vuetifyLastName.value = ''
		vuetifyEmail.value = ''
		vuetifyMessage.value = ''
		vuetifyPassword.value = null
		vuetifyPhone.value = ''
		vuetifyNir.value = ''
		vuetifyBirthDate.value = null
		vuetifyProjectMonth.value = undefined
		vuetifyPeriodStart.value = ''
		vuetifyPeriodEnd.value = ''
		vuetifyCareType.value = null
		vuetifyDoctor.value = null
		vuetifyContactChannel.value = null
		vuetifyBillingFormat.value = null
		vuetifyFileTransfer.value = null
		vuetifyTransmissionWay.value = null
		vuetifyNotifications.value = []
		vuetifyConsent.value = false
		vuetifySubmitted.value = false
	}
</script>

<template>
	<div>
		<!-- Page header -->
		<div class="d-flex align-center ga-3 mb-2">
			<VIcon
				:icon="mdiSwapHorizontal"
				color="primary"
				size="32"
			/>
			<div>
				<h1 class="text-h4 font-weight-bold">
					Test du v-model de SyForm
				</h1>
				<p class="text-body-2 text-medium-emphasis">
					Les mêmes composants avec validation Synapse (customRules) et validation Vuetify (rules) — un onglet par mode, chacun avec son tableau de bord.
				</p>
			</div>
		</div>

		<VDivider class="mb-6" />

		<VTabs
			v-model="tab"
			color="primary"
			class="mb-4"
		>
			<VTab
				:value="0"
				:prepend-icon="mdiShieldCheckOutline"
			>
				Validation Synapse
			</VTab>
			<VTab
				:value="1"
				:prepend-icon="mdiVuetify"
			>
				Validation Vuetify
			</VTab>
		</VTabs>

		<VWindow v-model="tab">
			<!-- ═══════════════════════════════════════════════════════ -->
			<!-- Onglet 1 : validation Synapse                            -->
			<!-- ═══════════════════════════════════════════════════════ -->
			<VWindowItem :value="0">
				<VRow>
					<!-- Tableau de bord -->
					<VCol
						cols="12"
						lg="4"
					>
						<div class="dashboard-panel">
							<VCard
								variant="outlined"
								rounded="lg"
							>
								<VCardItem>
									<template #prepend>
										<VIcon
											:icon="mdiEyeOutline"
											color="primary"
										/>
									</template>
									<VCardTitle class="text-h6">
										Tableau de bord — Synapse
									</VCardTitle>
									<VCardSubtitle>valeur brute du v-model</VCardSubtitle>
								</VCardItem>

								<VDivider />

								<VCardText>
									<VSheet
										:color="synapseValidity === true ? 'success' : synapseValidity === false ? 'error' : 'grey-lighten-3'"
										:variant="synapseValidity === null ? 'flat' : 'tonal'"
										rounded="lg"
										class="pa-4 text-center mb-4"
									>
										<p class="text-h4 font-weight-black font-monospace">
											{{ synapseValidity }}
										</p>
										<VChip
											:color="validityLabel(synapseValidity).color"
											variant="tonal"
											size="small"
											class="mt-1"
										>
											{{ validityLabel(synapseValidity).hint }}
										</VChip>
									</VSheet>

									<p class="text-caption text-medium-emphasis mb-4">
										Tri-état attendu : <code>null</code> tant qu’au moins un champ est vierge,
										<code>false</code> si un champ est invalide, <code>true</code> lorsque tout est validé.
									</p>

									<p class="text-caption font-weight-medium mb-2">
										Écrire le model depuis le parent (two-way binding)
									</p>
									<div class="d-flex ga-2 mb-4">
										<VBtn
											size="small"
											variant="outlined"
											@click="forceSynapseModel(null)"
										>
											null
										</VBtn>
										<VBtn
											size="small"
											variant="outlined"
											color="success"
											@click="forceSynapseModel(true)"
										>
											true
										</VBtn>
										<VBtn
											size="small"
											variant="outlined"
											color="error"
											@click="forceSynapseModel(false)"
										>
											false
										</VBtn>
									</div>

									<p class="text-caption font-weight-medium mb-2">
										API exposée via <code>ref</code>
									</p>
									<div class="d-flex flex-wrap ga-2 mb-4">
										<VBtn
											size="small"
											variant="tonal"
											@click="synapseFormRef?.validate()"
										>
											validate()
										</VBtn>
										<VBtn
											size="small"
											variant="tonal"
											@click="synapseFormRef?.clearValidation()"
										>
											clearValidation()
										</VBtn>
										<VBtn
											size="small"
											variant="tonal"
											@click="synapseFormRef?.reset()"
										>
											reset()
										</VBtn>
									</div>

									<VSwitch
										v-model="synapseValidateOnSubmit"
										density="compact"
										color="primary"
										hide-details
										label="validateOnSubmit"
										class="mb-4"
									/>

									<div class="d-flex align-center ga-2 mb-2">
										<VIcon
											:icon="mdiHistory"
											size="18"
											color="medium-emphasis"
										/>
										<p class="text-caption font-weight-medium">
											Journal des changements
										</p>
									</div>
									<VList
										v-if="synapseLog.length"
										density="compact"
										class="py-0"
									>
										<VListItem
											v-for="(entry, index) in synapseLog"
											:key="index"
											class="px-2"
										>
											<VListItemTitle class="font-monospace text-body-2">
												{{ entry.time }} — {{ entry.value }}
											</VListItemTitle>
											<VListItemSubtitle class="text-caption">
												{{ entry.source === 'parent' ? 'écrit depuis le parent' : 'émis par SyForm' }}
											</VListItemSubtitle>
										</VListItem>
									</VList>
									<p
										v-else
										class="text-caption text-medium-emphasis"
									>
										Aucun changement pour l’instant.
									</p>
								</VCardText>
							</VCard>
						</div>
					</VCol>

					<!-- Formulaire -->
					<VCol
						cols="12"
						lg="8"
					>
						<SyAlert
							v-if="synapseSubmitted"
							type="success"
							variant="tonal"
							closable
							class="mb-4"
							@close="synapseSubmitted = false"
						>
							Formulaire Synapse soumis avec un v-model à <code>true</code>.
						</SyAlert>

						<SyForm
							ref="synapseFormRef"
							v-model="synapseValidity"
							:validate-on-submit="synapseValidateOnSubmit"
							@submit="handleSynapseSubmit"
							@reset="handleSynapseReset"
						>
							<template #default="{ reset }">
								<VCard
									variant="outlined"
									rounded="lg"
									class="mb-4"
								>
									<VCardItem>
										<template #prepend>
											<VIcon
												:icon="mdiShieldCheckOutline"
												color="primary"
											/>
										</template>
										<VCardTitle class="text-h6">
											Validation Synapse
										</VCardTitle>
										<VCardSubtitle>customRules / customWarningRules</VCardSubtitle>
									</VCardItem>
									<VDivider />

									<!-- Champs texte -->
									<VCardText>
										<p class="text-caption font-weight-medium mb-2">
											<VIcon
												:icon="mdiTextAccount"
												size="14"
												class="mr-1"
											/>
											Champs texte
										</p>
										<SyTextField
											v-model="synapseLastName"
											label="Nom"
											placeholder="Ex : Dupont"
											required
											display-asterisk
											:custom-rules="synapseNameRules"
											class="mb-4"
										/>
										<SyTextField
											v-model="synapseEmail"
											label="Adresse e-mail"
											placeholder="ex : jean.dupont@exemple.fr"
											:custom-rules="synapseEmailRules"
											show-success-messages
											class="mb-4"
										/>
										<SyTextArea
											v-model="synapseMessage"
											label="Message"
											placeholder="Décrivez votre demande"
											required
											display-asterisk
											:custom-rules="synapseMessageRules"
											:custom-warning-rules="synapseMessageWarningRules"
										/>
									</VCardText>

									<VDivider />

									<!-- Identité & coordonnées -->
									<VCardText>
										<p class="text-caption font-weight-medium mb-2">
											<VIcon
												:icon="mdiTextAccount"
												size="14"
												class="mr-1"
											/>
											Identité &amp; coordonnées
										</p>
										<PasswordField
											v-model="synapsePassword"
											label="Mot de passe"
											:custom-rules="synapsePasswordRules"
											class="mb-4"
										/>
										<PhoneField
											v-model="synapsePhone"
											label="Numéro de téléphone"
											required
											class="mb-4"
										/>
										<NirField
											v-model="synapseNir"
											required
											number-label="Numéro de sécurité sociale"
											:display-key="true"
										/>
									</VCardText>

									<VDivider />

									<!-- Dates -->
									<VCardText>
										<p class="text-caption font-weight-medium mb-2">
											<VIcon
												:icon="mdiCalendarRange"
												size="14"
												class="mr-1"
											/>
											Dates
										</p>
										<DatePicker
											v-model="synapseBirthDate"
											label="Date de consultation"
											placeholder="JJ/MM/AAAA"
											required
											:custom-rules="synapseDateRules"
											:display-today-button="true"
											class="mb-4"
										/>
										<MonthPicker
											v-model="synapseProjectMonth"
											label="Début du projet"
											required
											:custom-rules="synapseMonthRules"
											class="mb-4"
										/>
										<PeriodField
											v-model="synapseStayPeriod"
											placeholder-from="Date d’entrée"
											placeholder-to="Date de sortie"
											required
										/>
									</VCardText>

									<VDivider />

									<!-- Sélections -->
									<VCardText>
										<p class="text-caption font-weight-medium mb-2">
											<VIcon
												:icon="mdiCheckDecagramOutline"
												size="14"
												class="mr-1"
											/>
											Sélections
										</p>
										<SySelect
											v-model="synapseCareType"
											label="Type de soins"
											:items="careTypeItems"
											required
											:custom-rules="synapseRequiredChoice('le type de soins')"
											class="mb-4"
										/>
										<SyAutocomplete
											v-model="synapseDoctor"
											label="Médecin traitant"
											:items="doctorItems"
											required
											:custom-rules="synapseRequiredChoice('le médecin traitant')"
											class="mb-4"
										/>
										<SelectBtnField
											v-model="synapseFileTransfer"
											label="Mode de téléversement"
											:items="fileTransferItems"
											required
											:custom-rules="synapseRequiredChoice('le mode de téléversement')"
											class="mb-4"
										/>
										<SyRadioGroup
											v-model="synapseTransmissionWay"
											label="Voie de transmission"
											:options="fileTransferOptions"
											required
											:custom-rules="synapseRequiredChoice('la voie de transmission')"
											class="mb-4"
										/>
										<SyCheckBoxGroup
											v-model="synapseNotifications"
											label="Notifications souhaitées"
											:options="notificationOptions"
											multiple
											required
											class="mb-4"
										/>
										<SyCheckbox
											v-model="synapseConsent"
											label="J’accepte que mes données soient utilisées pour le traitement de cette demande."
											required
											:custom-rules="synapseConsentRules"
										/>
									</VCardText>

									<VDivider />

									<VCardActions class="pa-4">
										<VBtn
											type="submit"
											color="primary"
											variant="elevated"
											:prepend-icon="mdiCheckCircle"
											:disabled="synapseValidity !== true"
										>
											Soumettre
										</VBtn>
										<VBtn
											variant="text"
											:prepend-icon="mdiRefresh"
											@click="reset"
										>
											Réinitialiser
										</VBtn>
									</VCardActions>
								</VCard>
							</template>
						</SyForm>
					</VCol>
				</VRow>
			</VWindowItem>

			<!-- ═══════════════════════════════════════════════════════ -->
			<!-- Onglet 2 : validation Vuetify + composants Vuetify        -->
			<!-- ═══════════════════════════════════════════════════════ -->
			<VWindowItem :value="1">
				<VRow>
					<!-- Tableau de bord -->
					<VCol
						cols="12"
						lg="4"
					>
						<div class="dashboard-panel">
							<VCard
								variant="outlined"
								rounded="lg"
							>
								<VCardItem>
									<template #prepend>
										<VIcon
											:icon="mdiEyeOutline"
											color="primary"
										/>
									</template>
									<VCardTitle class="text-h6">
										Tableau de bord — Vuetify
									</VCardTitle>
									<VCardSubtitle>valeur brute du v-model</VCardSubtitle>
								</VCardItem>

								<VDivider />

								<VCardText>
									<VSheet
										:color="vuetifyValidity === true ? 'success' : vuetifyValidity === false ? 'error' : 'grey-lighten-3'"
										:variant="vuetifyValidity === null ? 'flat' : 'tonal'"
										rounded="lg"
										class="pa-4 text-center mb-4"
									>
										<p class="text-h4 font-weight-black font-monospace">
											{{ vuetifyValidity }}
										</p>
										<VChip
											:color="validityLabel(vuetifyValidity).color"
											variant="tonal"
											size="small"
											class="mt-1"
										>
											{{ validityLabel(vuetifyValidity).hint }}
										</VChip>
									</VSheet>

									<p class="text-caption text-medium-emphasis mb-4">
										Tri-état attendu : <code>null</code> tant qu’au moins un champ est vierge,
										<code>false</code> si un champ est invalide, <code>true</code> lorsque tout est validé.
									</p>

									<p class="text-caption font-weight-medium mb-2">
										Écrire le model depuis le parent (two-way binding)
									</p>
									<div class="d-flex ga-2 mb-4">
										<VBtn
											size="small"
											variant="outlined"
											@click="forceVuetifyModel(null)"
										>
											null
										</VBtn>
										<VBtn
											size="small"
											variant="outlined"
											color="success"
											@click="forceVuetifyModel(true)"
										>
											true
										</VBtn>
										<VBtn
											size="small"
											variant="outlined"
											color="error"
											@click="forceVuetifyModel(false)"
										>
											false
										</VBtn>
									</div>

									<p class="text-caption font-weight-medium mb-2">
										API exposée via <code>ref</code>
									</p>
									<div class="d-flex flex-wrap ga-2 mb-4">
										<VBtn
											size="small"
											variant="tonal"
											@click="vuetifyFormRef?.validate()"
										>
											validate()
										</VBtn>
										<VBtn
											size="small"
											variant="tonal"
											@click="vuetifyFormRef?.clearValidation()"
										>
											clearValidation()
										</VBtn>
										<VBtn
											size="small"
											variant="tonal"
											@click="vuetifyFormRef?.reset()"
										>
											reset()
										</VBtn>
									</div>

									<VSwitch
										v-model="vuetifyValidateOnSubmit"
										density="compact"
										color="primary"
										hide-details
										label="validateOnSubmit"
										class="mb-4"
									/>

									<div class="d-flex align-center ga-2 mb-2">
										<VIcon
											:icon="mdiHistory"
											size="18"
											color="medium-emphasis"
										/>
										<p class="text-caption font-weight-medium">
											Journal des changements
										</p>
									</div>
									<VList
										v-if="vuetifyLog.length"
										density="compact"
										class="py-0"
									>
										<VListItem
											v-for="(entry, index) in vuetifyLog"
											:key="index"
											class="px-2"
										>
											<VListItemTitle class="font-monospace text-body-2">
												{{ entry.time }} — {{ entry.value }}
											</VListItemTitle>
											<VListItemSubtitle class="text-caption">
												{{ entry.source === 'parent' ? 'écrit depuis le parent' : 'émis par SyForm' }}
											</VListItemSubtitle>
										</VListItem>
									</VList>
									<p
										v-else
										class="text-caption text-medium-emphasis"
									>
										Aucun changement pour l’instant.
									</p>
								</VCardText>
							</VCard>
						</div>
					</VCol>

					<!-- Formulaire -->
					<VCol
						cols="12"
						lg="8"
					>
						<SyAlert
							v-if="vuetifySubmitted"
							type="success"
							variant="tonal"
							closable
							class="mb-4"
							@close="vuetifySubmitted = false"
						>
							Formulaire Vuetify soumis avec un v-model à <code>true</code>.
						</SyAlert>

						<SyForm
							ref="vuetifyFormRef"
							v-model="vuetifyValidity"
							:validate-on-submit="vuetifyValidateOnSubmit"
							@submit="handleVuetifySubmit"
							@reset="handleVuetifyReset"
						>
							<template #default="{ reset }">
								<VCard
									variant="outlined"
									rounded="lg"
									class="mb-4"
								>
									<VCardItem>
										<template #prepend>
											<VIcon
												:icon="mdiVuetify"
												color="primary"
											/>
										</template>
										<VCardTitle class="text-h6">
											Validation Vuetify
										</VCardTitle>
										<VCardSubtitle>rules + useVuetifyValidation + composants Vuetify natifs</VCardSubtitle>
									</VCardItem>
									<VDivider />

									<!-- Champs texte -->
									<VCardText>
										<p class="text-caption font-weight-medium mb-2">
											<VIcon
												:icon="mdiTextAccount"
												size="14"
												class="mr-1"
											/>
											Champs texte
										</p>
										<SyTextField
											v-model="vuetifyLastName"
											label="Nom"
											placeholder="Ex : Dupont"
											use-vuetify-validation
											:rules="vuetifyNameRules"
											class="mb-4"
										/>
										<SyTextField
											v-model="vuetifyEmail"
											label="Adresse e-mail"
											placeholder="ex : jean.dupont@exemple.fr"
											use-vuetify-validation
											:rules="vuetifyEmailRules"
											class="mb-4"
										/>
										<SyTextArea
											v-model="vuetifyMessage"
											label="Message"
											placeholder="Décrivez votre demande"
											use-vuetify-validation
											:rules="vuetifyMessageRules"
										/>
									</VCardText>

									<VDivider />

									<!-- Identité & coordonnées -->
									<VCardText>
										<p class="text-caption font-weight-medium mb-2">
											<VIcon
												:icon="mdiTextAccount"
												size="14"
												class="mr-1"
											/>
											Identité &amp; coordonnées
										</p>
										<PasswordField
											v-model="vuetifyPassword"
											label="Mot de passe"
											use-vuetify-validation
											:rules="vuetifyPasswordRules"
											class="mb-4"
										/>
										<PhoneField
											v-model="vuetifyPhone"
											label="Numéro de téléphone"
											use-vuetify-validation
											:rules="vuetifyPhoneRules"
											class="mb-4"
										/>
										<NirField
											v-model="vuetifyNir"
											use-vuetify-validation
											number-label="Numéro de sécurité sociale"
											:display-key="true"
											:number-rules="vuetifyNirNumberRules"
											:key-rules="vuetifyNirKeyRules"
										/>
									</VCardText>

									<VDivider />

									<!-- Dates -->
									<VCardText>
										<p class="text-caption font-weight-medium mb-2">
											<VIcon
												:icon="mdiCalendarRange"
												size="14"
												class="mr-1"
											/>
											Dates
										</p>
										<DatePicker
											v-model="vuetifyBirthDate"
											label="Date de consultation"
											placeholder="JJ/MM/AAAA"
											required
											use-vuetify-validation
											:rules="vuetifyDateRules"
											:display-today-button="true"
											class="mb-4"
										/>
										<MonthPicker
											v-model="vuetifyProjectMonth"
											label="Début du projet"
											use-vuetify-validation
											:rules="vuetifyMonthRules"
											class="mb-4"
										/>
										<!-- PeriodField n'a pas de mode Vuetify : équivalent en composants natifs -->
										<VRow>
											<VCol
												cols="12"
												sm="6"
											>
												<VTextField
													v-model="vuetifyPeriodStart"
													label="Date d’entrée (VTextField)"
													placeholder="JJ/MM/AAAA"
													variant="outlined"
													:rules="vuetifyDatePatternRules"
												/>
											</VCol>
											<VCol
												cols="12"
												sm="6"
											>
												<VTextField
													v-model="vuetifyPeriodEnd"
													label="Date de sortie (VTextField)"
													placeholder="JJ/MM/AAAA"
													variant="outlined"
													:rules="vuetifyDatePatternRules"
												/>
											</VCol>
										</VRow>
									</VCardText>

									<VDivider />

									<!-- Sélections -->
									<VCardText>
										<p class="text-caption font-weight-medium mb-2">
											<VIcon
												:icon="mdiCheckDecagramOutline"
												size="14"
												class="mr-1"
											/>
											Sélections
										</p>
										<SySelect
											v-model="vuetifyCareType"
											label="Type de soins"
											:items="careTypeItems"
											use-vuetify-validation
											:rules="vuetifyRequiredChoice('Veuillez sélectionner un type de soins')"
											class="mb-4"
										/>
										<SyAutocomplete
											v-model="vuetifyDoctor"
											label="Médecin traitant"
											:items="doctorItems"
											use-vuetify-validation
											:rules="vuetifyRequiredChoice('Veuillez sélectionner un médecin traitant')"
											class="mb-4"
										/>
										<!-- Composants Vuetify natifs -->
										<VSelect
											v-model="vuetifyContactChannel"
											label="Canal de contact préféré (VSelect)"
											:items="contactChannelItems"
											item-title="text"
											item-value="value"
											variant="outlined"
											:rules="vuetifyRequiredChoice('Veuillez sélectionner un canal de contact')"
											class="mb-4"
										/>
										<VSelect
											v-model="vuetifyBillingFormat"
											label="Format de facturation (VSelect)"
											:items="billingFormatItems"
											item-title="text"
											item-value="value"
											variant="outlined"
											:rules="vuetifyRequiredChoice('Veuillez sélectionner un format de facturation')"
											class="mb-4"
										/>
										<SelectBtnField
											v-model="vuetifyFileTransfer"
											label="Mode de téléversement"
											:items="fileTransferItems"
											use-vuetify-validation
											:rules="vuetifyRequiredChoice('Veuillez sélectionner un mode de téléversement')"
											class="mb-4"
										/>
										<SyRadioGroup
											v-model="vuetifyTransmissionWay"
											label="Voie de transmission"
											:options="fileTransferOptions"
											use-vuetify-validation
											:rules="vuetifyRequiredChoice('Veuillez sélectionner une voie de transmission')"
											class="mb-4"
										/>
										<SyCheckBoxGroup
											v-model="vuetifyNotifications"
											label="Notifications souhaitées"
											:options="notificationOptions"
											multiple
											use-vuetify-validation
											:rules="vuetifyRequiredChoice('Veuillez sélectionner au moins une notification')"
											class="mb-4"
										/>
										<SyCheckbox
											v-model="vuetifyConsent"
											label="J’accepte que mes données soient utilisées pour le traitement de cette demande."
											use-vuetify-validation
											:rules="vuetifyConsentRules"
										/>
									</VCardText>

									<VDivider />

									<VCardActions class="pa-4">
										<VBtn
											type="submit"
											color="primary"
											variant="elevated"
											:prepend-icon="mdiCheckCircle"
											:disabled="vuetifyValidity !== true"
										>
											Soumettre
										</VBtn>
										<VBtn
											variant="text"
											:prepend-icon="mdiRefresh"
											@click="reset"
										>
											Réinitialiser
										</VBtn>
									</VCardActions>
								</VCard>
							</template>
						</SyForm>
					</VCol>
				</VRow>
			</VWindowItem>
		</VWindow>
	</div>
</template>

<style scoped>
.dashboard-panel {
	position: sticky;
	top: 16px;
}
</style>
