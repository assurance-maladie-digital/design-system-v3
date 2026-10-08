<script lang="ts" setup>
	import { computed, ref, watch } from 'vue'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import SelectBtnField from '@/components/Customs/Selects/SelectBtnField/SelectBtnField.vue'
	import SyForm from '@/components/Customs/SyForm/SyForm.vue'
	import SyAlert from '@/components/SyAlert/SyAlert.vue'
	import { mdiBugOutline, mdiCheckCircle, mdiRefresh, mdiShieldCheckOutline, mdiSwapHorizontal, mdiHelpCircleOutline } from '@mdi/js'

	// Chaque scénario correspond à un finding de la revue (audits/review-validation-unifiee.md).
	// « Attendu » = comportement correct. « Observé » = ce que la page montre en direct.

	type ScenarioStatus = 'idle' | 'ok' | 'ko'

	const scenarioStatus = ref<Record<string, ScenarioStatus>>({})
	function setStatus(key: string, status: ScenarioStatus) {
		scenarioStatus.value[key] = status
	}

	function validityLabel(value: boolean | null) {
		if (value === null) return { text: 'null (inconnu)', color: 'medium-emphasis' as const }
		if (value === true) return { text: 'true (valide)', color: 'success' as const }
		return { text: 'false (invalide)', color: 'error' as const }
	}

	// ── Scénario 1 : bascule dynamique useVuetifyValidation ──────────
	// Bug MEDIUM (corrigé) : les validateurs étaient instanciés au setup selon la
	// valeur à l'instant T. Après true→false, customValidator restait null : les
	// customRules n'étaient jamais appliquées (champ vide accepté en mode Synapse).
	// Les `rules` ne sont passées qu'en mode Vuetify pour isoler les customRules.
	const dynMode = ref(true)
	const dynValue = ref('')
	const dynFormValid = ref<boolean | null>(null)
	const dynFormRef = ref<InstanceType<typeof SyForm> | null>(null)
	const dynRules = [(v: unknown) => !!v || 'Valeur requise (Vuetify)']
	const dynCustomRules = [{ type: 'required', options: { message: 'Valeur requise (Synapse)' } }]

	async function testDynSubmit() {
		const result = await dynFormRef.value?.validate()
		// Le champ doit être valide si et seulement s'il est rempli, quel que soit le mode.
		setStatus('dyn', result === Boolean(dynValue.value) ? 'ok' : 'ko')
	}

	// ── Scénario 2 : noWeekend (typé/documenté) vs notWeekend (réel) ──
	// Bug HIGH : 'noWeekend' est dans les types + doc mais le switch
	// n'implémente que 'notWeekend' → erreur "La règle spécifiée n'existe pas".
	const documentedValue = ref('10/10/2026') // un samedi
	const realValue = ref('10/10/2026')
	const ruleFormValid = ref<boolean | null>(null)

	const noWeekendRules = [
		{ type: 'noWeekend', options: { message: 'Week-end interdit' } },
	]
	const notWeekendRules = [
		{ type: 'notWeekend', options: { message: 'Week-end interdit' } },
	]

	// ── Scénario 3 : notBeforeDate avec options.date = Date ──────────
	// Bug HIGH : le type autorise Date mais le code throw → le submit
	// du formulaire rejette (Promise.all) au lieu de marquer le champ.
	const dateObjValue = ref('15/10/2026')
	const dateObjFormValid = ref<boolean | null>(null)
	const dateObjFormRef = ref<InstanceType<typeof SyForm> | null>(null)
	const dateObjError = ref<string | null>(null)

	const dateObjRules = [
		{
			type: 'notBeforeDate',
			options: { date: new Date(), message: 'Date trop ancienne' },
		},
	]

	async function testDateObj() {
		dateObjError.value = null
		try {
			await dateObjFormRef.value?.validate()
			setStatus('dateObj', 'ok')
		}
		catch (err) {
			dateObjError.value = err instanceof Error ? err.message : String(err)
			setStatus('dateObj', 'ko')
		}
	}

	// ── Scénario 4 : règle Vuetify retournant false ──────────────────
	// Divergence : Vuetify natif pousse '' (erreur sans message) alors que
	// evaluateVuetifyRules (DatePicker) normalise en 'La valeur est invalide.'.
	const falseRuleValue = ref('quelque chose')
	const falseRuleFormValid = ref<boolean | null>(null)
	const falseRules = [() => false as const]

	// ── Scénario 5 : errorMessages externes ──────────────────────────
	// Le champ doit être invalide même si ses règles passent, et
	// clearValidation ne doit pas effacer l'erreur externe.
	const extValue = ref('valeur valide')
	const extErrors = ref<string[] | null>(null)
	const extFormValid = ref<boolean | null>(null)
	const extFormRef = ref<InstanceType<typeof SyForm> | null>(null)

	function toggleExternalError() {
		extErrors.value = extErrors.value ? null : ['Erreur injectée par le serveur']
	}

	async function testExternalClear() {
		await extFormRef.value?.clearValidation()
		// Attendu : l'erreur externe persiste après clear
		setStatus('ext', extErrors.value ? 'ok' : 'idle')
	}

	// ── Scénario 6 : reset() sur SelectBtnField (modelValue readonly) ─
	// Le composable reçoit computed(() => props.modelValue) → le reset par
	// défaut écrit sur une ref readonly → warning Vue en console. La valeur
	// peut quand même être vidée via le chemin Vuetify (VForm.reset).
	const selectBtnValue = ref<string | number | null>(null)
	const selectBtnItems = [
		{ text: 'Option A', value: 'a' },
		{ text: 'Option B', value: 'b' },
		{ text: 'Option C', value: 'c' },
	]
	const selectBtnFormRef = ref<InstanceType<typeof SyForm> | null>(null)

	async function testSelectBtnReset() {
		await selectBtnFormRef.value?.reset()
		// Attendu : selectBtnValue revient à null ET aucun warning readonly
		// dans la console. Observé : la valeur est vidée via VForm mais le
		// chemin custom (resetAll → modelValue.value = undefined) échoue
		// silencieusement avec un warning.
		setStatus('reset', selectBtnValue.value === null ? 'ok' : 'ko')
	}

	// ── Scénario 7 : champ disabled + mode Vuetify ───────────────────
	// Contradiction : useCustomValidation retourne true pour un champ
	// disabled, mais VForm.validate() évalue quand même ses rules.
	const disabledFormValid = ref<boolean | null>(null)
	const disabledValue = ref('')
	const disabledVuetifyRules = [(v: unknown) => !!v || 'Requis']

	// ── Scénario 8 : maxErrors en mode custom ────────────────────────
	// La doc dit « uniquement si useVuetifyValidation » — en réalité la
	// limite s'applique aussi aux erreurs custom.
	const maxErrValue = ref('')
	const maxErrRules = [
		{ type: 'required', options: { message: 'Erreur 1' } },
		{ type: 'minLength', options: { length: 5, message: 'Erreur 2' } },
		{ type: 'email', options: { message: 'Erreur 3' } },
	]

	// ── Scénario 9 : course asynchrone (token d'annulation) ──────────
	// Comportement attendu CORRECT : taper vite ne doit pas laisser un
	// résultat async obsolète écraser l'état final.
	const asyncValue = ref('')
	const asyncRules = [
		{
			type: 'custom',
			options: {
				validate: (v: unknown) => new Promise<boolean | string>((resolve) => {
					setTimeout(() => {
						resolve(v === 'ok' ? true : 'La valeur doit être "ok"')
					}, 600)
				}),
			},
		},
	]

	// ── Scénario 10 : erreur externe × état du champ ─────────────────
	// Une erreur injectée par le parent bloque la soumission, sauf si le
	// champ est désactivé ou en lecture seule (il ne peut pas être corrigé).
	// Couvre les trois chemins : Synapse, use-vuetify-validation, VTextField natif.
	type ExtStateMode = 'synapse' | 'vuetify' | 'native'
	type ExtStateField = 'normal' | 'disabled' | 'readonly' | 'disableErrorHandling' | 'hasError'

	const extStateModes: { value: ExtStateMode, title: string }[] = [
		{ value: 'synapse', title: 'Synapse' },
		{ value: 'vuetify', title: 'use-vuetify-validation' },
		{ value: 'native', title: 'VTextField natif' },
	]
	const extStateFields: { value: ExtStateField, title: string }[] = [
		{ value: 'normal', title: 'Normal' },
		{ value: 'disabled', title: 'disabled' },
		{ value: 'readonly', title: 'readonly' },
		{ value: 'disableErrorHandling', title: 'disableErrorHandling' },
		{ value: 'hasError', title: 'hasError / error' },
	]

	const extStateMode = ref<ExtStateMode>('synapse')
	const extStateField = ref<ExtStateField>('disabled')
	const extStateValue = ref('valeur valide')
	const extStateErrors = ref<string[]>(['Erreur injectée par le serveur'])
	const extStateFormValid = ref<boolean | null>(null)
	const extStateFieldRef = ref<InstanceType<typeof SyTextField> | null>(null)
	const extStateSubmitResult = ref<boolean | null>(null)
	const extStateFieldResult = ref<boolean | null>(null)
	const extStateRules = [(v: unknown) => !!v || 'Requis']

	const isExtStateFieldUnavailable = (field: ExtStateField) =>
		extStateMode.value === 'native' && field === 'disableErrorHandling'

	const extStateFieldProps = computed(() => ({
		disabled: extStateField.value === 'disabled',
		readonly: extStateField.value === 'readonly',
	}))

	// Attendu : un champ disabled/readonly ne bloque jamais ; hasError bloque toujours ;
	// sinon, le formulaire est invalide tant que l'erreur externe est injectée.
	const extStateExpected = computed(() => {
		if (extStateField.value === 'disabled' || extStateField.value === 'readonly') return true
		if (extStateField.value === 'hasError') return false
		return extStateErrors.value.length === 0
	})

	function resetExtStateResults() {
		extStateSubmitResult.value = null
		extStateFieldResult.value = null
	}

	watch([extStateMode, extStateField, extStateErrors], resetExtStateResults)
	watch(extStateMode, () => {
		if (isExtStateFieldUnavailable(extStateField.value)) extStateField.value = 'normal'
	})

	function toggleExtStateError() {
		extStateErrors.value = extStateErrors.value.length ? [] : ['Erreur injectée par le serveur']
	}

	async function checkExtStateField() {
		extStateFieldResult.value = await extStateFieldRef.value?.validateOnSubmit() ?? null
	}
</script>

<template>
	<div>
		<div class="d-flex align-center ga-3 mb-2">
			<VIcon
				:icon="mdiShieldCheckOutline"
				color="primary"
				size="32"
			/>
			<div>
				<h1 class="text-h4 font-weight-bold">
					Cas limites — validation unifiée
				</h1>
				<p class="text-body-2 text-medium-emphasis">
					Scénarios issus de la revue (<code>audits/review-validation-unifiee.md</code>).
					Ouvrir la console pour observer les warnings.
				</p>
			</div>
		</div>

		<VDivider class="mb-6" />

		<!-- Scénario 1 : bascule dynamique -->
		<VCard
			variant="outlined"
			rounded="lg"
			class="mb-6"
		>
			<VCardItem>
				<template #prepend>
					<VIcon
						:icon="mdiSwapHorizontal"
						color="success"
					/>
				</template>
				<VCardTitle class="text-h6">
					1. Bascule dynamique <code>useVuetifyValidation</code>
				</VCardTitle>
				<VCardSubtitle>
					Corrigé — les customRules s’appliquent après une bascule Vuetify → Synapse
				</VCardSubtitle>
			</VCardItem>
			<VCardText>
				<SyAlert
					type="info"
					variant="tonal"
					class="mb-4"
				>
					<strong>Attendu :</strong> dans les deux modes, un champ vide est invalide (« Valeur requise
					(Vuetify) » ou « Valeur requise (Synapse) ») et un champ rempli est valide.
					<strong>Bug (corrigé) :</strong> après bascule Vuetify → Synapse, les <code>customRules</code>
					n'étaient jamais appliquées : un champ vide était accepté.
				</SyAlert>
				<SyForm
					ref="dynFormRef"
					v-model="dynFormValid"
				>
					<VSwitch
						v-model="dynMode"
						:label="dynMode ? 'Mode Vuetify (rules)' : 'Mode Synapse (customRules)'"
						color="primary"
						hide-details
						class="mb-3"
					/>
					<SyTextField
						v-model="dynValue"
						label="Valeur"
						:use-vuetify-validation="dynMode"
						:rules="dynMode ? dynRules : []"
						:custom-rules="dynCustomRules"
					/>
					<div class="d-flex align-center ga-3 mt-3">
						<VBtn
							color="primary"
							@click="testDynSubmit"
						>
							Valider
						</VBtn>
						<span :class="`text-${validityLabel(dynFormValid).color}`">
							Formulaire : {{ validityLabel(dynFormValid).text }}
						</span>
						<VChip
							v-if="scenarioStatus.dyn && scenarioStatus.dyn !== 'idle'"
							:color="scenarioStatus.dyn === 'ko' ? 'error' : 'success'"
							size="small"
						>
							{{ scenarioStatus.dyn === 'ko' ? 'Bug reproduit' : 'OK' }}
						</VChip>
					</div>
				</SyForm>
			</VCardText>
		</VCard>

		<!-- Scénario 2 : noWeekend vs notWeekend -->
		<VCard
			variant="outlined"
			rounded="lg"
			class="mb-6"
		>
			<VCardItem>
				<template #prepend>
					<VIcon
						:icon="mdiBugOutline"
						color="error"
					/>
				</template>
				<VCardTitle class="text-h6">
					2. <code>noWeekend</code> (typé/documenté) vs <code>notWeekend</code> (réel)
				</VCardTitle>
				<VCardSubtitle>
					Bug high — la règle documentée n'existe pas au runtime
				</VCardSubtitle>
			</VCardItem>
			<VCardText>
				<SyAlert
					type="info"
					variant="tonal"
					class="mb-4"
				>
					<strong>Attendu :</strong> les deux champs affichent « Week-end interdit » pour un samedi.
					<strong>Bug :</strong> le premier affiche « La règle spécifiée pour … n'existe pas ».
				</SyAlert>
				<SyForm v-model="ruleFormValid">
					<SyTextField
						v-model="documentedValue"
						label="Règle 'noWeekend' (documentée)"
						:custom-rules="noWeekendRules"
						:is-validate-on-blur="false"
						class="mb-3"
					/>
					<SyTextField
						v-model="realValue"
						label="Règle 'notWeekend' (implémentée)"
						:custom-rules="notWeekendRules"
						:is-validate-on-blur="false"
					/>
				</SyForm>
			</VCardText>
		</VCard>

		<!-- Scénario 3 : options.date = Date -->
		<VCard
			variant="outlined"
			rounded="lg"
			class="mb-6"
		>
			<VCardItem>
				<template #prepend>
					<VIcon
						:icon="mdiBugOutline"
						color="error"
					/>
				</template>
				<VCardTitle class="text-h6">
					3. <code>notBeforeDate</code> avec <code>options.date: Date</code>
				</VCardTitle>
				<VCardSubtitle>
					Bug high — le type autorise <code>Date</code> mais le code throw (submit rejeté)
				</VCardSubtitle>
			</VCardItem>
			<VCardText>
				<SyAlert
					type="info"
					variant="tonal"
					class="mb-4"
				>
					<strong>Attendu :</strong> la règle s'évalue (parseDate gère les Date).
					<strong>Bug :</strong> <code>validate()</code> rejette avec « La date de référence doit être une chaîne au format DD/MM/YYYY ».
				</SyAlert>
				<SyForm
					ref="dateObjFormRef"
					v-model="dateObjFormValid"
				>
					<SyTextField
						v-model="dateObjValue"
						label="Date (JJ/MM/AAAA)"
						:custom-rules="dateObjRules"
						:is-validate-on-blur="false"
					/>
					<div class="d-flex align-center ga-3 mt-3">
						<VBtn
							color="primary"
							@click="testDateObj"
						>
							Valider
						</VBtn>
						<span :class="`text-${validityLabel(dateObjFormValid).color}`">
							Formulaire : {{ validityLabel(dateObjFormValid).text }}
						</span>
					</div>
					<SyAlert
						v-if="dateObjError"
						type="error"
						variant="tonal"
						class="mt-3"
					>
						Exception rejetée : {{ dateObjError }}
					</SyAlert>
				</SyForm>
			</VCardText>
		</VCard>

		<!-- Scénario 4 : règle Vuetify retournant false -->
		<VCard
			variant="outlined"
			rounded="lg"
			class="mb-6"
		>
			<VCardItem>
				<template #prepend>
					<VIcon
						:icon="mdiHelpCircleOutline"
						color="warning"
					/>
				</template>
				<VCardTitle class="text-h6">
					4. Règle Vuetify retournant <code>false</code>
				</VCardTitle>
				<VCardSubtitle>
					Divergence — erreur « fantôme » sans message (Vuetify) vs « La valeur est invalide. » (DatePicker)
				</VCardSubtitle>
			</VCardItem>
			<VCardText>
				<SyAlert
					type="info"
					variant="tonal"
					class="mb-4"
				>
					<strong>Attendu :</strong> message d'erreur cohérent quel que soit le chemin.
					<strong>Observé :</strong> le champ passe en erreur sans aucun message visible.
				</SyAlert>
				<SyForm v-model="falseRuleFormValid">
					<SyTextField
						v-model="falseRuleValue"
						label="Règle () => false"
						use-vuetify-validation
						:rules="falseRules"
					/>
					<span :class="`text-${validityLabel(falseRuleFormValid).color}`">
						Formulaire : {{ validityLabel(falseRuleFormValid).text }}
					</span>
				</SyForm>
			</VCardText>
		</VCard>

		<!-- Scénario 5 : errorMessages externes -->
		<VCard
			variant="outlined"
			rounded="lg"
			class="mb-6"
		>
			<VCardItem>
				<template #prepend>
					<VIcon
						:icon="mdiCheckCircle"
						color="success"
					/>
				</template>
				<VCardTitle class="text-h6">
					5. <code>errorMessages</code> externes
				</VCardTitle>
				<VCardSubtitle>
					Cas nominal — l'erreur externe bloque le formulaire et survit à clearValidation
				</VCardSubtitle>
			</VCardItem>
			<VCardText>
				<SyForm
					ref="extFormRef"
					v-model="extFormValid"
				>
					<SyTextField
						v-model="extValue"
						label="Champ avec erreur serveur"
						:error-messages="extErrors"
					/>
					<div class="d-flex align-center ga-3 mt-3">
						<VBtn
							color="primary"
							variant="tonal"
							@click="toggleExternalError"
						>
							{{ extErrors ? 'Retirer' : 'Injecter' }} l'erreur
						</VBtn>
						<VBtn
							variant="text"
							@click="testExternalClear"
						>
							clearValidation
						</VBtn>
						<span :class="`text-${validityLabel(extFormValid).color}`">
							Formulaire : {{ validityLabel(extFormValid).text }}
						</span>
					</div>
				</SyForm>
			</VCardText>
		</VCard>

		<!-- Scénario 6 : reset SelectBtnField -->
		<VCard
			variant="outlined"
			rounded="lg"
			class="mb-6"
		>
			<VCardItem>
				<template #prepend>
					<VIcon
						:icon="mdiRefresh"
						color="warning"
					/>
				</template>
				<VCardTitle class="text-h6">
					6. <code>reset()</code> sur SelectBtnField
				</VCardTitle>
				<VCardSubtitle>
					Bug medium — le chemin custom écrit sur une ref readonly (warning console)
				</VCardSubtitle>
			</VCardItem>
			<VCardText>
				<SyAlert
					type="info"
					variant="tonal"
					class="mb-4"
				>
					<strong>Attendu :</strong> reset sans warning. <strong>Bug :</strong> « Set operation on
					readonly » en console — la valeur n'est vidée que par le chemin Vuetify (enregistrement
					implicite dans VForm).
				</SyAlert>
				<SyForm ref="selectBtnFormRef">
					<SelectBtnField
						v-model="selectBtnValue"
						label="Choix"
						:items="selectBtnItems"
					/>
					<div class="d-flex align-center ga-3 mt-3">
						<VBtn
							color="primary"
							variant="tonal"
							@click="testSelectBtnReset"
						>
							Réinitialiser
						</VBtn>
						<span>valeur : {{ JSON.stringify(selectBtnValue) }}</span>
						<VChip
							v-if="scenarioStatus.reset && scenarioStatus.reset !== 'idle'"
							:color="scenarioStatus.reset === 'ko' ? 'error' : 'success'"
							size="small"
						>
							{{ scenarioStatus.reset === 'ko' ? 'Valeur non réinitialisée' : 'Valeur vidée (via Vuetify)' }}
						</VChip>
					</div>
				</SyForm>
			</VCardText>
		</VCard>

		<!-- Scénario 7 : disabled + Vuetify -->
		<VCard
			variant="outlined"
			rounded="lg"
			class="mb-6"
		>
			<VCardItem>
				<template #prepend>
					<VIcon
						:icon="mdiBugOutline"
						color="warning"
					/>
				</template>
				<VCardTitle class="text-h6">
					7. Champ <code>disabled</code> en mode Vuetify
				</VCardTitle>
				<VCardSubtitle>
					Contradiction — custom ignore le champ disabled, VForm l'évalue quand même
				</VCardSubtitle>
			</VCardItem>
			<VCardText>
				<SyAlert
					type="info"
					variant="tonal"
					class="mb-4"
				>
					<strong>Attendu :</strong> un champ disabled ne bloque pas le formulaire (comportement
					custom). <strong>Observé :</strong> en mode Vuetify, <code>VForm.validate()</code> évalue
					ses <code>rules</code> → formulaire invalide.
				</SyAlert>
				<SyForm v-model="disabledFormValid">
					<SyTextField
						v-model="disabledValue"
						label="Champ désactivé avec rules"
						disabled
						use-vuetify-validation
						:rules="disabledVuetifyRules"
					/>
					<span :class="`text-${validityLabel(disabledFormValid).color}`">
						Formulaire : {{ validityLabel(disabledFormValid).text }}
					</span>
				</SyForm>
			</VCardText>
		</VCard>

		<!-- Scénario 8 : maxErrors custom -->
		<VCard
			variant="outlined"
			rounded="lg"
			class="mb-6"
		>
			<VCardItem>
				<template #prepend>
					<VIcon
						:icon="mdiHelpCircleOutline"
						color="info"
					/>
				</template>
				<VCardTitle class="text-h6">
					8. <code>maxErrors</code> en mode custom
				</VCardTitle>
				<VCardSubtitle>
					Doc incorrecte — la limite s'applique aussi hors mode Vuetify
				</VCardSubtitle>
			</VCardItem>
			<VCardText>
				<SyAlert
					type="info"
					variant="tonal"
					class="mb-4"
				>
					<strong>Doc :</strong> « applicable uniquement si useVuetifyValidation ».
					<strong>Observé :</strong> 3 règles échouent mais 1 seule erreur affichée.
				</SyAlert>
				<SyTextField
					v-model="maxErrValue"
					label="3 règles qui échouent, max-errors=1"
					:custom-rules="maxErrRules"
					:max-errors="1"
					:is-validate-on-blur="false"
				/>
			</VCardText>
		</VCard>

		<!-- Scénario 9 : course async -->
		<VCard
			variant="outlined"
			rounded="lg"
		>
			<VCardItem>
				<template #prepend>
					<VIcon
						:icon="mdiCheckCircle"
						color="success"
					/>
				</template>
				<VCardTitle class="text-h6">
					9. Course asynchrone (token d'annulation)
				</VCardTitle>
				<VCardSubtitle>
					Cas nominal — un résultat lent obsolète ne doit pas écraser l'état final
				</VCardSubtitle>
			</VCardItem>
			<VCardText>
				<SyAlert
					type="info"
					variant="tonal"
					class="mb-4"
				>
					<strong>Test :</strong> taper « ok » puis effacer rapidement la dernière lettre.
					La règle met 600&nbsp;ms à répondre — l'état final doit correspondre à la saisie finale.
				</SyAlert>
				<SyTextField
					v-model="asyncValue"
					label="Règle async : valeur attendue « ok »"
					:custom-rules="asyncRules"
					:is-validate-on-blur="false"
				/>
				<span>valeur courante : {{ JSON.stringify(asyncValue) }}</span>
			</VCardText>
		</VCard>

		<!-- Scénario 10 : erreur externe × état du champ -->
		<VCard
			variant="outlined"
			rounded="lg"
			class="mt-6"
		>
			<VCardItem>
				<template #prepend>
					<VIcon
						:icon="mdiShieldCheckOutline"
						color="success"
					/>
				</template>
				<VCardTitle class="text-h6">
					10. Erreur externe × état du champ
				</VCardTitle>
				<VCardSubtitle>
					Correctif — un champ disabled ou readonly portant une erreur injectée ne bloque pas la soumission
				</VCardSubtitle>
			</VCardItem>
			<VCardText>
				<SyAlert
					type="info"
					variant="tonal"
					class="mb-4"
				>
					<strong>Attendu :</strong> avec l'erreur injectée, la soumission échoue (Normal,
					<code>disableErrorHandling</code>) sauf si le champ est <code>disabled</code> ou
					<code>readonly</code>. <code>hasError</code> / <code>error</code> bloque toujours.
					Le <code>validateOnSubmit()</code> du champ doit donner le même verdict que le submit.
				</SyAlert>
				<div class="d-flex flex-wrap ga-4 mb-4">
					<VBtnToggle
						v-model="extStateMode"
						mandatory
						density="comfortable"
						variant="outlined"
						color="primary"
					>
						<VBtn
							v-for="mode in extStateModes"
							:key="mode.value"
							:value="mode.value"
						>
							{{ mode.title }}
						</VBtn>
					</VBtnToggle>
					<VBtnToggle
						v-model="extStateField"
						mandatory
						density="comfortable"
						variant="outlined"
						color="primary"
					>
						<VBtn
							v-for="field in extStateFields"
							:key="field.value"
							:value="field.value"
							:disabled="isExtStateFieldUnavailable(field.value)"
						>
							{{ field.title }}
						</VBtn>
					</VBtnToggle>
				</div>
				<SyForm
					v-model="extStateFormValid"
					@submit="extStateSubmitResult = $event.isValid"
				>
					<VTextField
						v-if="extStateMode === 'native'"
						:key="`native-${extStateField}`"
						v-model="extStateValue"
						label="Champ avec erreur serveur (VTextField natif)"
						:rules="extStateRules"
						:error-messages="extStateErrors"
						:error="extStateField === 'hasError'"
						v-bind="extStateFieldProps"
					/>
					<SyTextField
						v-else
						ref="extStateFieldRef"
						:key="`${extStateMode}-${extStateField}`"
						v-model="extStateValue"
						label="Champ avec erreur serveur"
						:use-vuetify-validation="extStateMode === 'vuetify'"
						:rules="extStateRules"
						:custom-rules="[{ type: 'required', options: { message: 'Requis' } }]"
						:error-messages="extStateErrors"
						:has-error="extStateField === 'hasError'"
						:disable-error-handling="extStateField === 'disableErrorHandling'"
						v-bind="extStateFieldProps"
					/>
					<div class="d-flex flex-wrap align-center ga-3 mt-3">
						<VBtn
							variant="tonal"
							@click="toggleExtStateError"
						>
							{{ extStateErrors.length ? 'Retirer' : 'Injecter' }} l'erreur
						</VBtn>
						<VBtn
							color="primary"
							type="submit"
						>
							Soumettre
						</VBtn>
						<VBtn
							variant="text"
							:disabled="extStateMode === 'native'"
							@click="checkExtStateField"
						>
							validateOnSubmit() du champ
						</VBtn>
					</div>
					<div class="d-flex flex-wrap align-center ga-3 mt-3">
						<span>Attendu : <strong>{{ extStateExpected ? 'valide' : 'invalide' }}</strong></span>
						<VChip
							v-if="extStateSubmitResult !== null"
							:color="extStateSubmitResult === extStateExpected ? 'success' : 'error'"
							size="small"
						>
							Submit : {{ extStateSubmitResult ? 'valide' : 'invalide' }}
						</VChip>
						<VChip
							v-if="extStateFieldResult !== null"
							:color="extStateFieldResult === extStateExpected ? 'success' : 'error'"
							size="small"
						>
							Champ : {{ extStateFieldResult ? 'valide' : 'invalide' }}
						</VChip>
						<span :class="`text-${validityLabel(extStateFormValid).color}`">
							v-model SyForm : {{ validityLabel(extStateFormValid).text }}
						</span>
					</div>
				</SyForm>
			</VCardText>
		</VCard>
	</div>
</template>
