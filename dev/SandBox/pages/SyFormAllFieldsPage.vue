<script lang="ts" setup>
	import { computed, ref } from 'vue'
	import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
	import DiacriticPicker from '@/components/DiacriticPicker/DiacriticPicker.vue'
	import FileUpload from '@/components/FileUpload/FileUpload.vue'
	import LunarCalendar from '@/components/LunarCalendar/LunarCalendar.vue'
	import MonthPicker from '@/components/MonthPicker/MonthPicker.vue'
	import NirField from '@/components/NirField/NirField.vue'
	import PasswordField from '@/components/PasswordField/PasswordField.vue'
	import PeriodField from '@/components/PeriodField/PeriodField.vue'
	import PhoneField from '@/components/PhoneField/PhoneField.vue'
	import RangeField from '@/components/RangeField/RangeField.vue'
	import SearchListField from '@/components/SearchListField/SearchListField.vue'
	import SyAlert from '@/components/SyAlert/SyAlert.vue'
	import SyTextArea from '@/components/SyTextArea/SyTextArea.vue'
	import SyCheckbox from '@/components/Customs/SyCheckbox/SyCheckbox.vue'
	import SyCheckBoxGroup from '@/components/Customs/SyCheckBoxGroup/SyCheckBoxGroup.vue'
	import SyForm from '@/components/Customs/SyForm/SyForm.vue'
	import SyRadioGroup from '@/components/Customs/SyRadioGroup/SyRadioGroup.vue'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import SelectBtnField from '@/components/Customs/Selects/SelectBtnField/SelectBtnField.vue'
	import SyAutocomplete from '@/components/Customs/Selects/SyAutocomplete/SyAutocomplete.vue'
	import SyInputSelect from '@/components/Customs/Selects/SyInputSelect/SyInputSelect.vue'
	import SySelect from '@/components/Customs/Selects/SySelect/SySelect.vue'
	import { mdiCalendarRange, mdiCheckCircle, mdiCheckDecagramOutline, mdiCodeJson, mdiEyeOutline, mdiFormTextbox, mdiPuzzleOutline, mdiRefresh, mdiTextAccount } from '@mdi/js'

	// Page de test exhaustive : chaque composant de formulaire du DS est placé
	// dans un même SyForm, en mode validation Synapse (required / customRules).
	// Les composants qui ne s'enregistrent pas auprès de SyForm sont regroupés
	// dans une section dédiée pour vérifier qu'ils n'altèrent pas le v-model.

	const formRef = ref<InstanceType<typeof SyForm> | null>(null)
	const validity = ref<boolean | null>(null)
	const validateOnSubmit = ref(true)
	const lastSubmit = ref<{ isValid: boolean, time: string } | null>(null)
	const resetCount = ref(0)

	function createInitialValues() {
		return {
			textField: '',
			textArea: '',
			diacritic: '',
			password: null as string | null,
			phone: '',
			nir: '',
			date: null as string | null,
			dateNoCalendar: null as string | null,
			dateCombined: null as string | null,
			birthDate: null as string | null,
			month: undefined as string | undefined,
			period: { from: null, to: null } as { from: string | null, to: string | null },
			lunarDate: undefined as string | undefined,
			select: null as string | null,
			autocomplete: null as string | null,
			inputSelect: null as Record<string, unknown> | string | null,
			selectBtn: null as string | number | null,
			radio: null as string | null,
			checkboxGroup: [] as string[],
			checkbox: false,
			range: [0, 100] as [number, number],
			searchList: [] as unknown[],
			files: [] as File[],
		}
	}

	// NIR valide (clé 91) prérempli au chargement uniquement : reset() vide le champ.
	const values = ref({ ...createInitialValues(), nir: '185057800608491' })

	// Les File ne sont pas sérialisables : on n'affiche que leur nom.
	const displayedValues = computed(() => JSON.stringify({
		...values.value,
		files: values.value.files.map(file => file.name),
	}, null, 2))

	const validityColor = computed(() => {
		if (validity.value === true) return 'success'
		if (validity.value === false) return 'error'
		return 'grey-lighten-3'
	})

	const validityHint = computed(() => {
		if (validity.value === true) return 'valide'
		if (validity.value === false) return 'invalide'
		return 'au moins un champ vierge'
	})

	// ── Règles Synapse ──

	const nameRules = [
		{ type: 'minLength', options: { length: 2, message: 'Au moins 2 caractères' } },
	]

	const messageRules = [
		{ type: 'maxLength', options: { length: 200, message: 'Pas plus de 200 caractères' } },
	]

	const messageWarningRules = [
		{
			type: 'custom',
			options: {
				validate: (value: string) => (value ?? '').length <= 180,
				message: 'Attention : vous approchez de la limite de 200 caractères.',
			},
		},
	]

	const passwordRules = [
		{ type: 'minLength', options: { length: 8, message: 'Au moins 8 caractères' } },
	]

	const futureDateRules = [
		{ type: 'notBeforeToday', options: { message: 'La date ne peut pas être antérieure à aujourd’hui' } },
	]

	// ── Données de référence ──

	const careTypeItems = [
		{ text: 'Consultation médecin généraliste', value: 'gp' },
		{ text: 'Consultation médecin spécialiste', value: 'specialist' },
		{ text: 'Soins dentaires', value: 'dental' },
		{ text: 'Hospitalisation', value: 'hospital' },
	]

	const doctorItems = [
		{ text: 'Dr Martin — Généraliste', value: 'martin' },
		{ text: 'Dr Bernard — Cardiologue', value: 'bernard' },
		{ text: 'Dr Dubois — Dermatologue', value: 'dubois' },
		{ text: 'Dr Petit — Pédiatre', value: 'petit' },
	]

	const regimeItems = [
		{ text: 'Régime général', value: 'general' },
		{ text: 'Régime agricole', value: 'agricole' },
		{ text: 'Régime indépendant', value: 'independant' },
	]

	const fileTransferItems = [
		{ text: 'Téléversement immédiat', value: 'immediate' },
		{ text: 'Téléversement différé', value: 'deferred' },
	]

	const transmissionOptions = [
		{ label: 'Voie sécurisée', value: 'secure' },
		{ label: 'Voie standard', value: 'standard' },
	]

	const notificationOptions = [
		{ label: 'Suivi du remboursement', value: 'refunds' },
		{ label: 'Rappels de rendez-vous', value: 'reminders' },
		{ label: 'Campagnes de prévention', value: 'prevention' },
	]

	const searchListItems = [
		{ label: 'Kinésithérapie', value: 'kine' },
		{ label: 'Orthophonie', value: 'ortho' },
		{ label: 'Ostéopathie', value: 'osteo' },
		{ label: 'Podologie', value: 'podo' },
		{ label: 'Psychologie', value: 'psy' },
	]

	// ── Soumission / réinitialisation ──

	function handleSubmit({ isValid }: { isValid: boolean }) {
		lastSubmit.value = { isValid, time: new Date().toLocaleTimeString('fr-FR') }
	}

	function handleReset() {
		values.value = createInitialValues()
		lastSubmit.value = null
		resetCount.value++
	}
</script>

<template>
	<div>
		<!-- Page header -->
		<div class="d-flex align-center ga-3 mb-2">
			<VIcon
				:icon="mdiFormTextbox"
				color="primary"
				size="32"
			/>
			<div>
				<h1 class="text-h4 font-weight-bold">
					SyForm — tous les champs
				</h1>
				<p class="text-body-2 text-medium-emphasis">
					Tous les composants de formulaire du DS dans un même SyForm, pour tester validation, soumission et réinitialisation.
				</p>
			</div>
		</div>

		<VDivider class="mb-6" />

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
						class="mb-4"
					>
						<VCardItem>
							<template #prepend>
								<VIcon
									:icon="mdiEyeOutline"
									color="primary"
								/>
							</template>
							<VCardTitle class="text-h6">
								Tableau de bord
							</VCardTitle>
							<VCardSubtitle>v-model de SyForm</VCardSubtitle>
						</VCardItem>

						<VDivider />

						<VCardText>
							<VSheet
								:color="validityColor"
								:variant="validity === null ? 'flat' : 'tonal'"
								rounded="lg"
								class="pa-4 text-center mb-4"
							>
								<p class="text-h4 font-weight-black font-monospace">
									{{ validity }}
								</p>
								<p class="text-caption mt-1">
									{{ validityHint }}
								</p>
							</VSheet>

							<p class="text-caption font-weight-medium mb-2">
								API exposée via <code>ref</code>
							</p>
							<div class="d-flex flex-wrap ga-2 mb-4">
								<VBtn
									size="small"
									variant="tonal"
									@click="formRef?.validate()"
								>
									validate()
								</VBtn>
								<VBtn
									size="small"
									variant="tonal"
									@click="formRef?.clearValidation()"
								>
									clearValidation()
								</VBtn>
								<VBtn
									size="small"
									variant="tonal"
									@click="formRef?.reset()"
								>
									reset()
								</VBtn>
							</div>

							<VSwitch
								v-model="validateOnSubmit"
								density="compact"
								color="primary"
								hide-details
								label="validateOnSubmit"
								class="mb-2"
							/>

							<p class="text-caption">
								Dernier submit :
								<strong v-if="lastSubmit">
									{{ lastSubmit.isValid ? 'valide' : 'invalide' }} ({{ lastSubmit.time }})
								</strong>
								<span v-else>aucun</span>
							</p>
							<p class="text-caption">
								Événements reset reçus : <strong>{{ resetCount }}</strong>
							</p>
						</VCardText>
					</VCard>

					<VCard
						variant="outlined"
						rounded="lg"
					>
						<VCardItem>
							<template #prepend>
								<VIcon
									:icon="mdiCodeJson"
									color="primary"
								/>
							</template>
							<VCardTitle class="text-h6">
								Valeurs
							</VCardTitle>
						</VCardItem>
						<VDivider />
						<VCardText>
							<pre class="values-panel text-caption">{{ displayedValues }}</pre>
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
					v-if="lastSubmit"
					:type="lastSubmit.isValid ? 'success' : 'error'"
					variant="tonal"
					closable
					class="mb-4"
					@close="lastSubmit = null"
				>
					Formulaire soumis : <code>isValid = {{ lastSubmit.isValid }}</code>
				</SyAlert>

				<SyForm
					ref="formRef"
					v-model="validity"
					:validate-on-submit="validateOnSubmit"
					@submit="handleSubmit"
					@reset="handleReset"
				>
					<template #default="{ reset }">
						<VCard
							variant="outlined"
							rounded="lg"
						>
							<VCardText>
								<p class="text-caption text-medium-emphasis">
									Les champs suivis d’un astérisque (*) sont obligatoires.
								</p>
							</VCardText>

							<!-- Champs texte -->
							<VCardText>
								<h2 class="section-title">
									<VIcon
										:icon="mdiTextAccount"
										size="16"
									/>
									Champs texte
								</h2>
								<SyTextField
									v-model="values.textField"
									label="Nom (SyTextField)"
									required
									display-asterisk
									:custom-rules="nameRules"
									class="mb-4"
								/>
								<SyTextArea
									v-model="values.textArea"
									label="Message (SyTextArea)"
									required
									display-asterisk
									:custom-rules="messageRules"
									:custom-warning-rules="messageWarningRules"
									class="mb-4"
								/>
								<DiacriticPicker
									v-model="values.diacritic"
									class="mb-4"
								>
									<SyTextField
										v-model="values.diacritic"
										label="Ville de naissance (DiacriticPicker + SyTextField)"
										required
										display-asterisk
									/>
								</DiacriticPicker>
								<PasswordField
									v-model="values.password"
									label="Mot de passe (PasswordField)"
									autocomplete-type="new-password"
									required
									:custom-rules="passwordRules"
								/>
							</VCardText>

							<VDivider />

							<!-- Identité & coordonnées -->
							<VCardText>
								<h2 class="section-title">
									<VIcon
										:icon="mdiTextAccount"
										size="16"
									/>
									Identité &amp; coordonnées
								</h2>
								<PhoneField
									v-model="values.phone"
									label="Téléphone (PhoneField)"
									required
									display-asterisk
									class="mb-4"
								/>
								<NirField
									v-model="values.nir"
									number-label="Numéro de sécurité sociale (NirField)"
									required
									display-asterisk
									:display-key="true"
								/>
							</VCardText>

							<VDivider />

							<!-- Dates -->
							<VCardText>
								<h2 class="section-title">
									<VIcon
										:icon="mdiCalendarRange"
										size="16"
									/>
									Dates
								</h2>
								<DatePicker
									v-model="values.date"
									label="Date de rendez-vous (DatePicker)"
									placeholder="JJ/MM/AAAA"
									required
									display-asterisk
									:custom-rules="futureDateRules"
									class="mb-4"
								/>
								<DatePicker
									v-model="values.dateNoCalendar"
									label="Date de saisie (DatePicker noCalendar)"
									placeholder="JJ/MM/AAAA"
									no-calendar
									required
									display-asterisk
									class="mb-4"
								/>
								<DatePicker
									v-model="values.dateCombined"
									label="Date de soins (DatePicker useCombinedMode)"
									placeholder="JJ/MM/AAAA"
									use-combined-mode
									required
									display-asterisk
									class="mb-4"
								/>
								<DatePicker
									v-model="values.birthDate"
									label="Date de naissance (DatePicker isBirthDate)"
									placeholder="JJ/MM/AAAA"
									is-birth-date
									required
									display-asterisk
									class="mb-4"
								/>
								<MonthPicker
									v-model="values.month"
									label="Mois de début (MonthPicker)"
									required
									display-asterisk
									class="mb-4"
								/>
								<PeriodField
									v-model="values.period"
									placeholder-from="Date d’entrée (PeriodField)"
									placeholder-to="Date de sortie (PeriodField)"
									required
									class="mb-4"
								/>
								<LunarCalendar
									v-model="values.lunarDate"
									label="Date de naissance lunaire (LunarCalendar)"
									required
									display-asterisk
								/>
							</VCardText>

							<VDivider />

							<!-- Sélections -->
							<VCardText>
								<h2 class="section-title">
									<VIcon
										:icon="mdiCheckDecagramOutline"
										size="16"
									/>
									Sélections
								</h2>
								<SySelect
									v-model="values.select"
									label="Type de soins (SySelect)"
									:items="careTypeItems"
									required
									display-asterisk
									class="mb-4"
								/>
								<SyAutocomplete
									v-model="values.autocomplete"
									label="Médecin traitant (SyAutocomplete)"
									:items="doctorItems"
									required
									display-asterisk
									class="mb-4"
								/>
								<SyInputSelect
									v-model="values.inputSelect"
									label="Régime (SyInputSelect)"
									:items="regimeItems"
									required
									display-asterisk
									class="mb-4"
								/>
								<SelectBtnField
									v-model="values.selectBtn"
									label="Mode de téléversement (SelectBtnField)"
									:items="fileTransferItems"
									required
									class="mb-4"
								/>
								<SyRadioGroup
									v-model="values.radio"
									label="Voie de transmission (SyRadioGroup)"
									:options="transmissionOptions"
									required
									display-asterisk
									class="mb-4"
								/>
								<SyCheckBoxGroup
									v-model="values.checkboxGroup"
									label="Notifications souhaitées (SyCheckBoxGroup)"
									:options="notificationOptions"
									multiple
									required
									display-asterisk
									class="mb-4"
								/>
								<SyCheckbox
									v-model="values.checkbox"
									label="J’accepte les conditions d’utilisation (SyCheckbox)"
									required
									display-asterisk
								/>
							</VCardText>

							<VDivider />

							<!-- Composants non enregistrés auprès de SyForm -->
							<VCardText>
								<h2 class="section-title">
									<VIcon
										:icon="mdiPuzzleOutline"
										size="16"
									/>
									Sans validation SyForm
								</h2>
								<p class="text-caption text-medium-emphasis mb-4">
									Ces composants ne s’enregistrent pas auprès de SyForm : ils ne doivent pas influencer son v-model.
									Le Captcha n’est pas inclus car il nécessite une API back-end.
								</p>
								<RangeField
									v-model="values.range"
									fieldset-label="Tranche d’âge (RangeField)"
									class="mb-4"
								/>
								<SearchListField
									v-model="values.searchList"
									label="Rechercher une spécialité (SearchListField)"
									list-label="Spécialités paramédicales"
									:items="searchListItems"
									class="mb-4"
								/>
								<FileUpload
									v-model="values.files"
									multiple
								/>
							</VCardText>

							<VDivider />

							<VCardActions class="pa-4">
								<VBtn
									type="submit"
									color="primary"
									variant="elevated"
									:prepend-icon="mdiCheckCircle"
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
	</div>
</template>

<style scoped>
.dashboard-panel {
	position: sticky;
	top: 16px;
}

.section-title {
	display: flex;
	align-items: center;
	gap: 4px;
	margin-bottom: 16px;
	font-size: 0.875rem;
	font-weight: 600;
}

.values-panel {
	max-height: 360px;
	overflow: auto;
	white-space: pre-wrap;
	word-break: break-word;
}
</style>
