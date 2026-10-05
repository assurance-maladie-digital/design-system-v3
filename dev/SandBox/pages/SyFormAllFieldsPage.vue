<script lang="ts" setup>
	import { computed, ref, watch } from 'vue'
	import { useRoute, useRouter } from 'vue-router'
	import SyFormTestPanel from '../components/SyFormTestPanel.vue'
	import Captcha from '@/components/Captcha/Captcha.vue'
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
	import SyTextArea from '@/components/SyTextArea/SyTextArea.vue'
	import SyCheckbox from '@/components/Customs/SyCheckbox/SyCheckbox.vue'
	import SyCheckBoxGroup from '@/components/Customs/SyCheckBoxGroup/SyCheckBoxGroup.vue'
	import SyRadioGroup from '@/components/Customs/SyRadioGroup/SyRadioGroup.vue'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import SelectBtnField from '@/components/Customs/Selects/SelectBtnField/SelectBtnField.vue'
	import SyAutocomplete from '@/components/Customs/Selects/SyAutocomplete/SyAutocomplete.vue'
	import SyInputSelect from '@/components/Customs/Selects/SyInputSelect/SyInputSelect.vue'
	import SySelect from '@/components/Customs/Selects/SySelect/SySelect.vue'
	import { mdiCalendarRange, mdiCheckDecagramOutline, mdiFormTextbox, mdiPuzzleOutline, mdiRobotOutline, mdiServerNetwork, mdiShapeOutline, mdiSwapHorizontal, mdiTextAccount, mdiTextBoxOutline, mdiTimerSand, mdiToggleSwitchOutline } from '@mdi/js'

	// Page de test SyForm découpée en onglets : chaque onglet est un cas de test
	// isolé (son propre SyForm, son tableau de bord et ses valeurs), pour qu'une
	// revue puisse se concentrer sur un sujet à la fois.

	// ── Onglets (synchronisés avec ?tab= pour partager un lien direct) ──

	const tabs = [
		{ value: 'text', label: 'Texte', icon: mdiTextBoxOutline },
		{ value: 'identity', label: 'Identité', icon: mdiTextAccount },
		{ value: 'dates', label: 'Dates', icon: mdiCalendarRange },
		{ value: 'selections', label: 'Sélections', icon: mdiCheckDecagramOutline },
		{ value: 'variants', label: 'Variantes', icon: mdiShapeOutline },
		{ value: 'async', label: 'Async', icon: mdiTimerSand },
		{ value: 'states', label: 'États', icon: mdiToggleSwitchOutline },
		{ value: 'mixed', label: 'Synapse / Vuetify', icon: mdiSwapHorizontal },
		{ value: 'server', label: 'Erreurs serveur', icon: mdiServerNetwork },
		{ value: 'captcha', label: 'Captcha', icon: mdiRobotOutline },
		{ value: 'unregistered', label: 'Hors SyForm', icon: mdiPuzzleOutline },
	]

	const route = useRoute()
	const router = useRouter()

	const tab = computed({
		get: () => {
			const queryTab = route.query.tab
			return tabs.some(item => item.value === queryTab) ? String(queryTab) : 'text'
		},
		set: (value: string) => {
			router.replace({ query: { ...route.query, tab: value } })
		},
	})

	// ── Valeurs initiales par onglet ──

	const initText = () => ({
		textField: '',
		textArea: '',
		diacritic: '',
		password: null as string | null,
	})

	const initIdentity = () => ({
		phone: '',
		nir: '',
	})

	const initDates = () => ({
		date: null as string | null,
		dateNoCalendar: null as string | null,
		dateCombined: null as string | null,
		birthDate: null as string | null,
		month: undefined as string | undefined,
		period: { from: null, to: null } as { from: string | null, to: string | null },
		lunarDate: undefined as string | undefined,
	})

	const initSelections = () => ({
		select: null as string | null,
		autocomplete: null as string | null,
		inputSelect: null as Record<string, unknown> | string | null,
		selectBtn: null as string | number | null,
		radio: null as string | null,
		checkboxGroup: [] as string[],
		checkbox: false,
	})

	const initVariants = () => ({
		selectMultiple: [] as string[],
		autocompleteMultiple: [] as string[],
		selectBtnMultiple: [] as (string | number)[],
		radioInline: null as string | null,
	})

	const initAsync = () => ({ username: '' })

	const initStates = () => ({
		conditionalField: '',
		disabledField: '',
		readonlyField: '',
		ignoredField: '',
	})

	const initMixed = () => ({
		synapseField: '',
		vuetifyRulesField: '',
		nativeVTextField: '',
	})

	const initServer = () => ({ email: '' })

	const initCaptcha = () => ({ captcha: '' })

	const initUnregistered = () => ({
		range: [0, 100] as [number, number],
		searchList: [] as unknown[],
		files: [] as File[],
	})

	const textValues = ref(initText())
	// NIR valide (clé 91) prérempli au chargement uniquement : reset() vide le champ.
	const identityValues = ref({ ...initIdentity(), nir: '185057800608491' })
	const datesValues = ref(initDates())
	const selectionsValues = ref(initSelections())
	const variantsValues = ref(initVariants())
	const asyncValues = ref(initAsync())
	const statesValues = ref(initStates())
	const mixedValues = ref(initMixed())
	const serverValues = ref(initServer())
	const captchaValues = ref(initCaptcha())
	const unregisteredValues = ref(initUnregistered())

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

	// ── Validation asynchrone ──
	// Délai aléatoire : deux saisies rapprochées peuvent se résoudre dans le
	// désordre, ce qui permet d'observer la gestion des race conditions.

	const takenUsernames = ['admin', 'dupont']
	const pendingAsyncValidations = ref(0)

	const usernameAsyncRules = [
		{
			type: 'custom',
			options: {
				validate: async (value: string) => {
					pendingAsyncValidations.value++
					try {
						await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 1200))
						return !takenUsernames.includes((value ?? '').trim().toLowerCase())
					}
					finally {
						pendingAsyncValidations.value--
					}
				},
				message: 'Cet identifiant est déjà utilisé',
			},
		},
	]

	// ── États & enregistrement ──

	const showConditionalField = ref(true)

	// ── Validation Vuetify mélangée ──

	const vuetifyRequiredRules = [
		(value: unknown) => (typeof value === 'string' && value.trim() !== '') || 'Ce champ est obligatoire (rules Vuetify)',
	]

	// ── Erreurs serveur simulées (errorMessages) ──

	const simulateServerError = ref(true)
	const serverErrors = ref<string[]>([])

	watch(() => serverValues.value.email, () => {
		serverErrors.value = []
	})

	function handleServerSubmit({ isValid }: { isValid: boolean }) {
		if (isValid && simulateServerError.value) {
			serverErrors.value = ['Cette adresse e-mail est déjà associée à un compte (erreur serveur simulée)']
		}
	}

	function handleServerReset() {
		serverValues.value = initServer()
		serverErrors.value = []
	}

	// ── Captcha : API simulée sans back-end ──
	// fetch accepte un POST sur une URL data: et renvoie son contenu.

	const captchaUrlCreate = 'data:application/json,{"id":"sandbox-captcha"}'
	const captchaUrlGetImage = `data:image/svg+xml,${encodeURIComponent(
		'<svg xmlns="http://www.w3.org/2000/svg" width="240" height="80"><rect width="100%" height="100%" fill="#eef2f7"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="36" fill="#0c419a">S4NDB0X</text></svg>',
	)}`
	const captchaUrlGetAudio = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA='

	// Le Captcha ne valide que le remplissage : la vérification de la réponse
	// est faite par le serveur, qui renvoie l'erreur via error-messages.
	const captchaExpectedCode = 'S4NDB0X'
	const simulateCaptchaVerification = ref(true)
	const captchaErrors = ref<string[]>([])

	watch(() => captchaValues.value.captcha, () => {
		captchaErrors.value = []
	})

	function handleCaptchaSubmit({ isValid }: { isValid: boolean }) {
		if (!isValid || !simulateCaptchaVerification.value) {
			return
		}
		if ((captchaValues.value.captcha ?? '').trim().toUpperCase() !== captchaExpectedCode) {
			captchaErrors.value = ['Le code saisi est incorrect (vérification serveur simulée)']
		}
	}

	function handleCaptchaReset() {
		captchaValues.value = initCaptcha()
		captchaErrors.value = []
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
					SyForm Tests
				</h1>
				<p class="text-body-2 text-medium-emphasis">
					Un onglet par cas de test, chacun avec son propre SyForm et son tableau de bord.
				</p>
			</div>
		</div>

		<VDivider class="mb-4" />

		<VTabs
			v-model="tab"
			color="primary"
			show-arrows
			class="mb-6"
		>
			<VTab
				v-for="item in tabs"
				:key="item.value"
				:value="item.value"
				:prepend-icon="item.icon"
			>
				{{ item.label }}
			</VTab>
		</VTabs>

		<VWindow v-model="tab">
			<!-- Texte -->
			<VWindowItem value="text">
				<SyFormTestPanel
					title="Champs texte"
					description="Règles minLength / maxLength, warning non bloquant, champ imbriqué dans DiacriticPicker."
					:values="textValues"
					@reset="textValues = initText()"
				>
					<SyTextField
						v-model="textValues.textField"
						label="Nom (SyTextField)"
						required
						display-asterisk
						:custom-rules="nameRules"
						class="mb-4"
					/>
					<SyTextArea
						v-model="textValues.textArea"
						label="Message (SyTextArea)"
						required
						display-asterisk
						:custom-rules="messageRules"
						:custom-warning-rules="messageWarningRules"
						class="mb-4"
					/>
					<DiacriticPicker
						v-model="textValues.diacritic"
						class="mb-4"
					>
						<SyTextField
							v-model="textValues.diacritic"
							label="Ville de naissance (DiacriticPicker + SyTextField)"
							required
							display-asterisk
						/>
					</DiacriticPicker>
					<PasswordField
						v-model="textValues.password"
						label="Mot de passe (PasswordField)"
						autocomplete-type="new-password"
						required
						:custom-rules="passwordRules"
					/>
				</SyFormTestPanel>
			</VWindowItem>

			<!-- Identité -->
			<VWindowItem value="identity">
				<SyFormTestPanel
					title="Identité & coordonnées"
					description="Le NIR est prérempli avec une valeur valide au chargement ; reset() le vide."
					:values="identityValues"
					@reset="identityValues = initIdentity()"
				>
					<PhoneField
						v-model="identityValues.phone"
						label="Téléphone (PhoneField)"
						required
						display-asterisk
						class="mb-4"
					/>
					<NirField
						v-model="identityValues.nir"
						number-label="Numéro de sécurité sociale (NirField)"
						required
						display-asterisk
						:display-key="true"
					/>
				</SyFormTestPanel>
			</VWindowItem>

			<!-- Dates -->
			<VWindowItem value="dates">
				<SyFormTestPanel
					title="Dates"
					description="Les quatre modes du DatePicker, MonthPicker, PeriodField et LunarCalendar."
					:values="datesValues"
					@reset="datesValues = initDates()"
				>
					<DatePicker
						v-model="datesValues.date"
						label="Date de rendez-vous (DatePicker)"
						placeholder="JJ/MM/AAAA"
						required
						display-asterisk
						:custom-rules="futureDateRules"
						class="mb-4"
					/>
					<DatePicker
						v-model="datesValues.dateNoCalendar"
						label="Date de saisie (DatePicker noCalendar)"
						placeholder="JJ/MM/AAAA"
						no-calendar
						required
						display-asterisk
						class="mb-4"
					/>
					<DatePicker
						v-model="datesValues.dateCombined"
						label="Date de soins (DatePicker useCombinedMode)"
						placeholder="JJ/MM/AAAA"
						use-combined-mode
						required
						display-asterisk
						class="mb-4"
					/>
					<DatePicker
						v-model="datesValues.birthDate"
						label="Date de naissance (DatePicker isBirthDate)"
						placeholder="JJ/MM/AAAA"
						is-birth-date
						required
						display-asterisk
						class="mb-4"
					/>
					<MonthPicker
						v-model="datesValues.month"
						label="Mois de début (MonthPicker)"
						required
						display-asterisk
						class="mb-4"
					/>
					<PeriodField
						v-model="datesValues.period"
						placeholder-from="Date d’entrée (PeriodField)"
						placeholder-to="Date de sortie (PeriodField)"
						required
						class="mb-4"
					/>
					<LunarCalendar
						v-model="datesValues.lunarDate"
						label="Date de naissance lunaire (LunarCalendar)"
						required
						display-asterisk
					/>
				</SyFormTestPanel>
			</VWindowItem>

			<!-- Sélections -->
			<VWindowItem value="selections">
				<SyFormTestPanel
					title="Sélections"
					description="Composants de sélection en choix simple."
					:values="selectionsValues"
					@reset="selectionsValues = initSelections()"
				>
					<SySelect
						v-model="selectionsValues.select"
						label="Type de soins (SySelect)"
						:items="careTypeItems"
						required
						display-asterisk
						class="mb-4"
					/>
					<SyAutocomplete
						v-model="selectionsValues.autocomplete"
						label="Médecin traitant (SyAutocomplete)"
						:items="doctorItems"
						required
						display-asterisk
						class="mb-4"
					/>
					<SyInputSelect
						v-model="selectionsValues.inputSelect"
						label="Régime (SyInputSelect)"
						:items="regimeItems"
						required
						display-asterisk
						class="mb-4"
					/>
					<SelectBtnField
						v-model="selectionsValues.selectBtn"
						label="Mode de téléversement (SelectBtnField)"
						:items="fileTransferItems"
						required
						class="mb-4"
					/>
					<SyRadioGroup
						v-model="selectionsValues.radio"
						label="Voie de transmission (SyRadioGroup)"
						:options="transmissionOptions"
						required
						display-asterisk
						class="mb-4"
					/>
					<SyCheckBoxGroup
						v-model="selectionsValues.checkboxGroup"
						label="Notifications souhaitées (SyCheckBoxGroup)"
						:options="notificationOptions"
						multiple
						required
						display-asterisk
						class="mb-4"
					/>
					<SyCheckbox
						v-model="selectionsValues.checkbox"
						label="J’accepte les conditions d’utilisation (SyCheckbox)"
						required
						display-asterisk
					/>
				</SyFormTestPanel>
			</VWindowItem>

			<!-- Variantes -->
			<VWindowItem value="variants">
				<SyFormTestPanel
					title="Variantes de sélection"
					description="Sélections multiples et radio en ligne (inline transmis au VRadioGroup via attrs)."
					:values="variantsValues"
					@reset="variantsValues = initVariants()"
				>
					<SySelect
						v-model="variantsValues.selectMultiple"
						label="Types de soins (SySelect multiple)"
						:items="careTypeItems"
						multiple
						chips
						required
						display-asterisk
						class="mb-4"
					/>
					<SyAutocomplete
						v-model="variantsValues.autocompleteMultiple"
						label="Médecins consultés (SyAutocomplete multiple)"
						:items="doctorItems"
						multiple
						chips
						required
						display-asterisk
						class="mb-4"
					/>
					<SelectBtnField
						v-model="variantsValues.selectBtnMultiple"
						label="Modes de téléversement (SelectBtnField multiple)"
						:items="fileTransferItems"
						multiple
						required
						class="mb-4"
					/>
					<SyRadioGroup
						v-model="variantsValues.radioInline"
						label="Voie de transmission (SyRadioGroup inline)"
						:options="transmissionOptions"
						inline
						required
						display-asterisk
					/>
				</SyFormTestPanel>
			</VWindowItem>

			<!-- Async -->
			<VWindowItem value="async">
				<SyFormTestPanel
					title="Validation asynchrone"
					description="Règle custom asynchrone (300 à 1500 ms, délai aléatoire). « admin » et « dupont » sont déjà pris. Tapez vite ou soumettez pendant la validation pour tester les race conditions."
					:values="asyncValues"
					@reset="asyncValues = initAsync()"
				>
					<template #dashboard>
						<p class="text-caption">
							Validations async en cours : <strong>{{ pendingAsyncValidations }}</strong>
						</p>
					</template>
					<SyTextField
						v-model="asyncValues.username"
						label="Identifiant (règle async)"
						required
						display-asterisk
						:custom-rules="usernameAsyncRules"
					/>
				</SyFormTestPanel>
			</VWindowItem>

			<!-- États -->
			<VWindowItem value="states">
				<SyFormTestPanel
					title="États & enregistrement"
					description="Tous ces champs sont obligatoires et vides. Le champ conditionnel doit se désenregistrer quand il est masqué."
					:values="statesValues"
					@reset="statesValues = initStates()"
				>
					<template #dashboard>
						<VSwitch
							v-model="showConditionalField"
							density="compact"
							color="primary"
							hide-details
							label="Afficher le champ conditionnel"
						/>
					</template>
					<SyTextField
						v-if="showConditionalField"
						v-model="statesValues.conditionalField"
						label="Champ conditionnel (v-if)"
						required
						display-asterisk
						class="mb-4"
					/>
					<SyTextField
						v-model="statesValues.disabledField"
						label="Champ désactivé (disabled)"
						required
						display-asterisk
						disabled
						class="mb-4"
					/>
					<SyTextField
						v-model="statesValues.readonlyField"
						label="Champ en lecture seule (readonly)"
						required
						display-asterisk
						readonly
						class="mb-4"
					/>
					<SyTextField
						v-model="statesValues.ignoredField"
						label="Champ sans gestion d’erreur (disableErrorHandling)"
						required
						display-asterisk
						disable-error-handling
					/>
				</SyFormTestPanel>
			</VWindowItem>

			<!-- Synapse / Vuetify -->
			<VWindowItem value="mixed">
				<SyFormTestPanel
					title="Mélange Synapse / Vuetify"
					description="Validation Synapse (customRules) et validation Vuetify (rules) dans le même formulaire."
					:values="mixedValues"
					@reset="mixedValues = initMixed()"
				>
					<SyTextField
						v-model="mixedValues.synapseField"
						label="Nom (validation Synapse)"
						required
						display-asterisk
						:custom-rules="nameRules"
						class="mb-4"
					/>
					<SyTextField
						v-model="mixedValues.vuetifyRulesField"
						label="Référence dossier (SyTextField use-vuetify-validation) *"
						aria-required="true"
						use-vuetify-validation
						:rules="vuetifyRequiredRules"
						class="mb-4"
					/>
					<VTextField
						v-model="mixedValues.nativeVTextField"
						label="Commentaire interne (VTextField natif) *"
						variant="outlined"
						aria-required="true"
						:rules="vuetifyRequiredRules"
					/>
				</SyFormTestPanel>
			</VWindowItem>

			<!-- Erreurs serveur -->
			<VWindowItem value="server">
				<SyFormTestPanel
					title="Erreurs serveur (errorMessages)"
					description="Après un submit valide, le parent injecte une erreur via error-messages. Elle disparaît dès que l’e-mail est modifié."
					:values="serverValues"
					:server-errors="serverErrors"
					@submit="handleServerSubmit"
					@reset="handleServerReset"
				>
					<template #dashboard>
						<VSwitch
							v-model="simulateServerError"
							density="compact"
							color="primary"
							hide-details
							label="Simuler une erreur serveur au submit"
						/>
					</template>
					<SyTextField
						v-model="serverValues.email"
						label="Adresse e-mail"
						required
						display-asterisk
						:error-messages="serverErrors"
					/>
				</SyFormTestPanel>
			</VWindowItem>

			<!-- Captcha -->
			<VWindowItem value="captcha">
				<SyFormTestPanel
					title="Captcha (API simulée)"
					description="Création, image et audio servis par des URL data:, sans back-end. Le composant ne vérifie que le remplissage : au submit, la vérification serveur est simulée (code attendu : S4NDB0X) et l’erreur est injectée via error-messages."
					:values="captchaValues"
					:server-errors="captchaErrors"
					@submit="handleCaptchaSubmit"
					@reset="handleCaptchaReset"
				>
					<template #dashboard>
						<VSwitch
							v-model="simulateCaptchaVerification"
							density="compact"
							color="primary"
							hide-details
							label="Simuler la vérification serveur"
						/>
					</template>
					<Captcha
						v-model="captchaValues.captcha"
						:url-create="captchaUrlCreate"
						:url-get-image="captchaUrlGetImage"
						:url-get-audio="captchaUrlGetAudio"
						:error-messages="captchaErrors"
						required
					/>
				</SyFormTestPanel>
			</VWindowItem>

			<!-- Hors SyForm -->
			<VWindowItem value="unregistered">
				<SyFormTestPanel
					title="Composants sans validation SyForm"
					description="Ces composants ne s’enregistrent pas auprès de SyForm : ils ne doivent pas influencer son v-model."
					:values="unregisteredValues"
					@reset="unregisteredValues = initUnregistered()"
				>
					<RangeField
						v-model="unregisteredValues.range"
						fieldset-label="Tranche d’âge (RangeField)"
						class="mb-4"
					/>
					<SearchListField
						v-model="unregisteredValues.searchList"
						label="Rechercher une spécialité (SearchListField)"
						list-label="Spécialités paramédicales"
						:items="searchListItems"
						class="mb-4"
					/>
					<FileUpload
						v-model="unregisteredValues.files"
						multiple
					/>
				</SyFormTestPanel>
			</VWindowItem>
		</VWindow>
	</div>
</template>
