<script lang="ts" setup>
	/* eslint-disable no-console */
	import { computed, defineComponent, h, onMounted, onUnmounted, ref, watch } from 'vue'
	import { VTextField } from 'vuetify/components'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import SyInputSelect from '@/components/Customs/Selects/SyInputSelect/SyInputSelect.vue'
	import SyForm from '@/components/Customs/SyForm/SyForm.vue'
	import SyAlert from '@/components/SyAlert/SyAlert.vue'
	import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
	import { useValidation } from '@/composables/unifyValidation/useValidation'
	import { mdiBugOutline, mdiConsoleLine, mdiFormTextbox, mdiRefresh, mdiShieldAlertOutline, mdiSwapHorizontal } from '@mdi/js'

	// Chaque scénario reproduit un finding EN ÉCHEC de la revue
	// (dev/Etudes/review-pr-feat-syform-tests.md) : « Attendu » décrit le
	// comportement correct, « Bug » ce qui est observable tant que le
	// correctif n'est pas appliqué. Les chips comparent les deux en direct.
	// Les warnings console sont interceptés pour les scénarios 4 et 6.

	function validityLabel(value: boolean | null) {
		if (value === null) return { text: 'null (inconnu)', color: 'medium-emphasis' as const }
		if (value === true) return { text: 'true (valide)', color: 'success' as const }
		return { text: 'false (invalide)', color: 'error' as const }
	}

	// ── Interception des warnings console (scénarios 4 et 6) ─────────
	const consoleWarnings = ref<string[]>([])
	const originalWarn = console.warn
	onMounted(() => {
		console.warn = (...args: unknown[]) => {
			consoleWarnings.value.push(args.map(String).join(' '))
			originalWarn.apply(console, args)
		}
	})
	onUnmounted(() => {
		console.warn = originalWarn
	})

	const duplicateNameWarnings = computed(() =>
		consoleWarnings.value.filter(m => m.includes('Duplicate input name')),
	)
	const readonlyWriteWarnings = computed(() =>
		consoleWarnings.value.filter(m => m.includes('Write operation failed')),
	)

	// ── Scénario 1 : readonly + erreur injectée (finding 1.1, HIGH) ──
	// Une erreur injectée (error-messages / has-error) sur un champ readonly
	// s'affiche mais ne bloque ni le submit ni le v-model — sinon un bouton
	// `:disabled="valid !== true"` resterait grisé sans recours.
	// Bug : le v-model du SyForm passe à `false` alors que le submit est valide.
	type ReadonlyMode = 'synapse' | 'vuetify' | 'native'
	const readonlyModes: { value: ReadonlyMode, title: string }[] = [
		{ value: 'synapse', title: 'SyTextField (Synapse)' },
		{ value: 'vuetify', title: 'SyTextField (use-vuetify-validation)' },
		{ value: 'native', title: 'VTextField natif' },
	]
	const roMode = ref<ReadonlyMode>('synapse')
	const roValue = ref('Jean')
	const roErrors = ref<string[]>(['Erreur serveur'])
	const roFormValid = ref<boolean | null>(null)
	const roSubmit = ref<boolean | null>(null)
	watch(roMode, () => {
		roSubmit.value = null
		roFormValid.value = null
	})
	function toggleRoError() {
		roErrors.value = roErrors.value.length ? [] : ['Erreur serveur']
		roSubmit.value = null
	}

	// ── Scénario 2 : SyInputSelect disabled (finding 1.2, HIGH) ──────
	// Un champ désactivé ne peut pas être corrigé : il ne doit pas bloquer la
	// soumission (invariant appliqué partout, cf. SyForm.mdx). Bug : le validate
	// enregistré ne court-circuite pas `disabled` → isValid: false.
	const selValue = ref<Record<string, unknown> | null>(null)
	const selItems = [
		{ text: 'Option A', value: 'a' },
		{ text: 'Option B', value: 'b' },
	]
	const selFormValid = ref<boolean | null>(null)
	const selSubmit = ref<boolean | null>(null)

	// ── Scénario 3 : état Vuetify périmé après bascule (finding 1.3, MEDIUM)
	// Après une validation en échec en mode Vuetify, basculer vers le mode
	// Synapse doit effacer l'erreur et débloquer le submit. Bug : le validator
	// Vuetify n'est jamais réinitialisé → erreur affichée et v-model figés.
	const swMode = ref(true)
	const swValue = ref('')
	const swFormValid = ref<boolean | null>(null)
	const swSubmit = ref<boolean | null>(null)
	const swRules = [(v: unknown) => Boolean(v) || 'Requis (Vuetify)']
	const swStep = ref<'initial' | 'failed' | 'switched'>('initial')
	watch(swMode, () => {
		if (swStep.value === 'failed') swStep.value = 'switched'
		swSubmit.value = null
	})
	function recordSwSubmit(isValid: boolean) {
		swSubmit.value = isValid
		if (swMode.value && !isValid) swStep.value = 'failed'
	}

	// ── Scénario 4 : labels identiques en mode Vuetify (finding 1.4, MEDIUM)
	// Le validator s'enregistre dans le VForm sous l'id `name` (= label) : deux
	// champs avec le même label partagent le même id → warning « Duplicate input
	// name » et form.update() ne met à jour que le premier item.
	// Ici le champ désactivé absorbe l'id : sans correction, la règle en échec
	// du champ actif n'est jamais propagée au v-model.
	const dupFormValid = ref<boolean | null>(null)
	const dupSubmit = ref<boolean | null>(null)
	const dupDisabledValue = ref('')
	const dupActiveValue = ref('')
	const dupFailingRule = [(v: unknown) => Boolean(v) || 'Requis (Vuetify)']

	// ── Scénario 5 : has-error + useVuetifyValidation: false (finding 1.6, LOW)
	// Le blocage par `has-error` ne fonctionne que via l'item VForm « fantôme »
	// créé par le validator Vuetify. Avec le littéral `false` (autorisé par la
	// signature), aucun validator Vuetify n'est instancié : l'erreur s'affiche
	// mais le submit passe, en contradiction avec la doc.
	const HeadlessHasErrorField = defineComponent({
		name: 'HeadlessHasErrorField',
		setup() {
			useValidation({
				modelValue: ref<unknown>('valeur valide'),
				readonly: ref(false),
				disabled: ref(false),
				required: ref(false),
				isValidateOnBlur: ref(true),
				showSuccessMessages: ref(false),
				disableErrorHandling: ref(false),
				label: ref('Champ custom'),
				focused: ref(false),
				errorMessages: ref<string[] | null>(null),
				hasErrorProp: ref(true),
				useVuetifyValidation: false,
				customRules: ref([]),
			})
			return () => h('input', {
				'class': 'headless-field',
				'value': 'valeur valide — hasError: true',
				'readonly': true,
				'aria-invalid': 'true',
			})
		},
	})
	const heFormValid = ref<boolean | null>(null)
	const heSubmit = ref<boolean | null>(null)

	// ── Scénario 6 : reset() sur modelValue readonly (finding 1.5, garde) ──
	// Finding RÉTRACTÉ : VForm.reset() écrit via update:modelValue, pas dans le
	// computed readonly — aucun warning attendu. Conservé comme garde
	// anti-régression : tout warning « Write operation failed » est un KO.
	const dpFormRef = ref<InstanceType<typeof SyForm> | null>(null)
	function resetDatePicker() {
		dpFormRef.value?.reset()
	}
</script>

<template>
	<div>
		<div class="d-flex align-center ga-3 mb-2">
			<VIcon
				:icon="mdiShieldAlertOutline"
				color="primary"
				size="32"
			/>
			<div>
				<h1 class="text-h4 font-weight-bold">
					Findings SyForm — cas en échec
				</h1>
				<p class="text-body-2 text-medium-emphasis">
					Reproduction interactive des findings de
					<code>dev/Etudes/review-pr-feat-syform-tests.md</code>.
					Pour chaque cas : <strong>Attendu</strong> = comportement correct,
					<strong>Bug</strong> = ce qui est observable avant correction.
				</p>
			</div>
		</div>

		<VDivider class="mb-6" />

		<!-- Scénario 1 : readonly + erreur injectée -->
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
					1. Champ <code>readonly</code> + erreur injectée <VChip
						color="error"
						size="x-small"
						class="ml-2"
					>
						HIGH — finding 1.1
					</VChip>
				</VCardTitle>
				<VCardSubtitle>
					Le v-model vaut <code>false</code> alors que la soumission passe
				</VCardSubtitle>
			</VCardItem>
			<VCardText>
				<SyAlert
					type="info"
					variant="tonal"
					class="mb-4"
				>
					<strong>Attendu :</strong> le message s'affiche mais ne bloque rien :
					submit <code>isValid: true</code> ET v-model <code>true</code> (un champ
					readonly ne peut pas être corrigé — même justification que
					<code>disabled</code>, cf. SyForm.mdx).<br>
					<strong>Bug :</strong> <code>enabledVuetifyItems</code> (SyForm.vue) exclut
					<code>disabled</code> mais pas <code>readonly</code> → l'item VForm invalide
					fait passer le v-model à <code>false</code> alors que le submit est valide.
					Un bouton <code>:disabled="valid !== true"</code> reste grisé sans recours.<br>
					<strong>Comment tester :</strong> vérifier que « v-model » et « Submit »
					sont tous les deux verts pour les trois variantes de champ.
				</SyAlert>

				<VBtnToggle
					v-model="roMode"
					mandatory
					density="comfortable"
					variant="outlined"
					color="primary"
					class="mb-4"
				>
					<VBtn
						v-for="mode in readonlyModes"
						:key="mode.value"
						:value="mode.value"
					>
						{{ mode.title }}
					</VBtn>
				</VBtnToggle>

				<SyForm
					v-model="roFormValid"
					@submit="roSubmit = $event.isValid"
				>
					<VTextField
						v-if="roMode === 'native'"
						key="native"
						v-model="roValue"
						label="Nom"
						readonly
						:error-messages="roErrors"
					/>
					<SyTextField
						v-else
						:key="roMode"
						v-model="roValue"
						label="Nom"
						readonly
						:use-vuetify-validation="roMode === 'vuetify'"
						:error-messages="roErrors"
					/>
					<div class="d-flex flex-wrap align-center ga-3 mt-3">
						<VBtn
							variant="tonal"
							@click="toggleRoError"
						>
							{{ roErrors.length ? 'Retirer' : 'Injecter' }} l'erreur
						</VBtn>
						<VBtn
							color="primary"
							type="submit"
						>
							Soumettre
						</VBtn>
						<VChip
							:color="roFormValid === true ? 'success' : 'error'"
							size="small"
						>
							v-model : {{ validityLabel(roFormValid).text }}
						</VChip>
						<VChip
							v-if="roSubmit !== null"
							:color="roSubmit ? 'success' : 'error'"
							size="small"
						>
							Submit : {{ roSubmit ? 'valide' : 'invalide' }}
						</VChip>
					</div>
					<SyAlert
						v-if="roSubmit === true && roFormValid === false"
						type="error"
						variant="tonal"
						class="mt-3"
					>
						Bug reproduit : le submit est valide mais le v-model vaut
						<code>false</code> — un bouton <code>:disabled="valid !== true"</code>
						resterait grisé.
					</SyAlert>
				</SyForm>
			</VCardText>
		</VCard>

		<!-- Scénario 2 : SyInputSelect disabled -->
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
					2. <code>SyInputSelect</code> <code>disabled</code> <VChip
						color="error"
						size="x-small"
						class="ml-2"
					>
						HIGH — finding 1.2
					</VChip>
				</VCardTitle>
				<VCardSubtitle>
					Un champ désactivé vide bloque la soumission
				</VCardSubtitle>
			</VCardItem>
			<VCardText>
				<SyAlert
					type="info"
					variant="tonal"
					class="mb-4"
				>
					<strong>Attendu :</strong> submit <code>isValid: true</code> — un champ
					désactivé ne peut pas être corrigé, il est ignoré (comme
					<code>SyTextField disabled</code>, déjà couvert).<br>
					<strong>Bug :</strong> <code>validateField</code> et le <code>computed
						valide</code> de SyInputSelect court-circuitent <code>readonly</code>
					mais pas <code>disabled</code> → la règle <code>required</code> échoue
					au submit (<code>isValid: false</code>) et le v-model reste à
					<code>null</code>.<br>
					<strong>Comment tester :</strong> cliquer « Soumettre » sans rien
					sélectionner (le champ est désactivé de toute façon).
				</SyAlert>

				<SyForm
					v-model="selFormValid"
					@submit="selSubmit = $event.isValid"
				>
					<SyInputSelect
						v-model="selValue"
						label="Choix"
						:items="selItems"
						required
						disabled
					/>
					<div class="d-flex flex-wrap align-center ga-3 mt-3">
						<VBtn
							color="primary"
							type="submit"
						>
							Soumettre
						</VBtn>
						<VChip
							v-if="selSubmit !== null"
							:color="selSubmit ? 'success' : 'error'"
							size="small"
						>
							Submit : {{ selSubmit ? 'valide' : 'invalide' }}
						</VChip>
						<span :class="`text-${validityLabel(selFormValid).color}`">
							v-model : {{ validityLabel(selFormValid).text }}
						</span>
					</div>
					<SyAlert
						v-if="selSubmit === false"
						type="error"
						variant="tonal"
						class="mt-3"
					>
						Bug reproduit : un champ <code>disabled</code> vide a bloqué la
						soumission alors qu'il ne peut pas être corrigé.
					</SyAlert>
				</SyForm>
			</VCardText>
		</VCard>

		<!-- Scénario 3 : état Vuetify périmé après bascule -->
		<VCard
			variant="outlined"
			rounded="lg"
			class="mb-6"
		>
			<VCardItem>
				<template #prepend>
					<VIcon
						:icon="mdiSwapHorizontal"
						color="error"
					/>
				</template>
				<VCardTitle class="text-h6">
					3. État Vuetify périmé après bascule <VChip
						color="warning"
						size="x-small"
						class="ml-2"
					>
						MEDIUM — finding 1.3
					</VChip>
				</VCardTitle>
				<VCardSubtitle>
					L'erreur Vuetify survit à la bascule vers le mode Synapse
				</VCardSubtitle>
			</VCardItem>
			<VCardText>
				<SyAlert
					type="info"
					variant="tonal"
					class="mb-4"
				>
					<strong>Attendu :</strong> après bascule Vuetify → Synapse, l'erreur
					Vuetify est effacée, le submit passe (<code>isValid: true</code>) et le
					v-model vaut <code>true</code> — les <code>rules</code> ne s'appliquent
					qu'en mode Vuetify et le champ n'a pas de <code>customRules</code>.<br>
					<strong>Bug :</strong> aucun <code>watch</code> sur <code>isCustomMode</code>
					dans <code>useValidation</code> → le validator Vuetify n'est jamais
					réinitialisé : erreur affichée figée, <code>item.isValid</code> du VForm
					périmé, v-model bloqué à <code>false</code>.<br>
					<strong>Comment tester :</strong> 1) soumettre en mode Vuetify (champ vide)
					→ « Requis (Vuetify) ». 2) basculer le switch vers le mode Synapse.
					3) l'erreur doit disparaître et « Soumettre » doit être valide.
				</SyAlert>

				<SyForm
					v-model="swFormValid"
					@submit="recordSwSubmit($event.isValid)"
				>
					<VSwitch
						v-model="swMode"
						:label="swMode ? 'Mode Vuetify (rules)' : 'Mode Synapse (sans customRules)'"
						color="primary"
						hide-details
						class="mb-3"
					/>
					<SyTextField
						v-model="swValue"
						label="Nom"
						:use-vuetify-validation="swMode"
						:rules="swRules"
					/>
					<div class="d-flex flex-wrap align-center ga-3 mt-3">
						<VBtn
							color="primary"
							type="submit"
						>
							Soumettre
						</VBtn>
						<VChip
							v-if="swSubmit !== null"
							:color="swSubmit ? 'success' : 'error'"
							size="small"
						>
							Submit : {{ swSubmit ? 'valide' : 'invalide' }}
						</VChip>
						<VChip
							:color="swFormValid === true ? 'success' : 'error'"
							size="small"
						>
							v-model : {{ validityLabel(swFormValid).text }}
						</VChip>
					</div>
					<SyAlert
						v-if="swStep === 'switched'"
						:type="swSubmit === true && swFormValid === true ? 'success' : 'error'"
						variant="tonal"
						class="mt-3"
					>
						<template v-if="swSubmit === true && swFormValid === true">
							Correct : après la bascule, l'erreur est effacée, le submit passe et
							le v-model vaut <code>true</code>.
						</template>
						<template v-else>
							Bug reproduit : après la bascule, l'erreur Vuetify est toujours
							visible et/ou le formulaire reste invalide (état périmé).
						</template>
					</SyAlert>
				</SyForm>
			</VCardText>
		</VCard>

		<!-- Scénario 4 : labels identiques -->
		<VCard
			variant="outlined"
			rounded="lg"
			class="mb-6"
		>
			<VCardItem>
				<template #prepend>
					<VIcon
						:icon="mdiFormTextbox"
						color="error"
					/>
				</template>
				<VCardTitle class="text-h6">
					4. Deux champs Vuetify avec le même label <VChip
						color="warning"
						size="x-small"
						class="ml-2"
					>
						MEDIUM — finding 1.4
					</VChip>
				</VCardTitle>
				<VCardSubtitle>
					Collision d'id dans le VForm : « Duplicate input name »
				</VCardSubtitle>
			</VCardItem>
			<VCardText>
				<SyAlert
					type="info"
					variant="tonal"
					class="mb-4"
				>
					<strong>Attendu :</strong> aucun warning « Duplicate input name » et le
					champ actif en échec bloque le submit (<code>isValid: false</code>) —
					chaque champ doit s'enregistrer sous un id unique.<br>
					<strong>Bug :</strong> le validator Vuetify s'enregistre sous l'id
					<code>name</code> (= label). Deux labels identiques → même id : Vuetify
					logue « Duplicate input name » et <code>form.update(id)</code> ne met à
					jour que le premier item trouvé. Ici le champ <code>disabled</code>
					absorbe l'id : la règle en échec du champ actif peut ne jamais être
					propagée (v-model figé à <code>null</code>, erreur excusée par le champ
					disabled dans <code>ignoreDisabledVuetifyFields</code>).<br>
					<strong>Comment tester :</strong> le compteur de warnings ci-dessous doit
					rester à 0 et le submit doit être invalide tant que le champ actif est
					vide. (Correctif appliqué : suffixe <code>useId()</code> dans
					<code>useValidation.ts</code>.)
				</SyAlert>

				<SyForm
					v-model="dupFormValid"
					@submit="dupSubmit = $event.isValid"
				>
					<SyTextField
						v-model="dupDisabledValue"
						label="Nom"
						use-vuetify-validation
						:rules="dupFailingRule"
						disabled
						class="mb-3"
					/>
					<SyTextField
						v-model="dupActiveValue"
						label="Nom"
						use-vuetify-validation
						:rules="dupFailingRule"
					/>
					<div class="d-flex flex-wrap align-center ga-3 mt-3">
						<VBtn
							color="primary"
							type="submit"
						>
							Soumettre
						</VBtn>
						<VChip
							:color="duplicateNameWarnings.length === 0 ? 'success' : 'error'"
							size="small"
							:prepend-icon="mdiConsoleLine"
						>
							Warnings « Duplicate input name » : {{ duplicateNameWarnings.length }}
						</VChip>
						<VChip
							v-if="dupSubmit !== null"
							:color="dupSubmit === !dupActiveValue ? 'success' : 'error'"
							size="small"
						>
							Submit : {{ dupSubmit ? 'valide' : 'invalide' }}
							(attendu : {{ dupActiveValue ? 'valide' : 'invalide' }})
						</VChip>
						<span class="text-caption">
							valeur champ actif : {{ JSON.stringify(dupActiveValue) }}
						</span>
						<span :class="`text-${validityLabel(dupFormValid).color}`">
							v-model : {{ validityLabel(dupFormValid).text }}
						</span>
					</div>
					<SyAlert
						v-if="duplicateNameWarnings.length > 0"
						type="error"
						variant="tonal"
						class="mt-3"
					>
						Bug reproduit : {{ duplicateNameWarnings.length }} warning(s) de
						collision d'id détecté(s). Voir la console pour le détail.
					</SyAlert>
				</SyForm>
			</VCardText>
		</VCard>

		<!-- Scénario 5 : has-error + useVuetifyValidation false littéral -->
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
					5. <code>has-error</code> + <code>useVuetifyValidation: false</code> littéral <VChip
						color="info"
						size="x-small"
						class="ml-2"
					>
						LOW — finding 1.6
					</VChip>
				</VCardTitle>
				<VCardSubtitle>
					Le blocage dépend de l'item VForm « fantôme », absent ici
				</VCardSubtitle>
			</VCardItem>
			<VCardText>
				<SyAlert
					type="info"
					variant="tonal"
					class="mb-4"
				>
					<strong>Attendu :</strong> submit <code>isValid: false</code> — un état
					forcé via <code>has-error</code> invalide le champ (SyForm.mdx), comme
					une erreur injectée.<br>
					<strong>Bug :</strong> <code>useCustomValidation.validateOnSubmit</code>
					vérifie <code>hasExternalErrors</code> mais pas <code>hasError</code>. Le
					blocage ne fonctionne que parce que le validator Vuetify est instancié
					dès que <code>useVuetifyValidation</code> est une <code>Ref</code>. Avec
					le littéral <code>false</code> (autorisé par la signature), aucun item
					VForm n'est enregistré → erreur affichée mais soumission qui passe.<br>
					<strong>Comment tester :</strong> cliquer « Soumettre » : le champ
					headless ci-dessous est en erreur forcée, le submit doit être invalide.
				</SyAlert>

				<SyForm
					v-model="heFormValid"
					@submit="heSubmit = $event.isValid"
				>
					<p class="text-caption text-medium-emphasis mb-2">
						Champ headless : <code>useValidation({ hasErrorProp: true,
							useVuetifyValidation: false })</code> — aucun rendu Vuetify.
					</p>
					<HeadlessHasErrorField />
					<div class="d-flex flex-wrap align-center ga-3 mt-3">
						<VBtn
							color="primary"
							type="submit"
						>
							Soumettre
						</VBtn>
						<VChip
							v-if="heSubmit !== null"
							:color="heSubmit === false ? 'success' : 'error'"
							size="small"
						>
							Submit : {{ heSubmit ? 'valide' : 'invalide' }} (attendu : invalide)
						</VChip>
						<span :class="`text-${validityLabel(heFormValid).color}`">
							v-model : {{ validityLabel(heFormValid).text }}
						</span>
					</div>
					<SyAlert
						v-if="heSubmit === true"
						type="error"
						variant="tonal"
						class="mt-3"
					>
						Bug reproduit : <code>has-error</code> n'a pas bloqué la soumission
						— sans item VForm fantôme, rien ne vérifie l'état forcé.
					</SyAlert>
				</SyForm>
			</VCardText>
		</VCard>

		<!-- Scénario 6 : reset() sur modelValue readonly (garde) -->
		<VCard
			variant="outlined"
			rounded="lg"
		>
			<VCardItem>
				<template #prepend>
					<VIcon
						:icon="mdiRefresh"
						color="success"
					/>
				</template>
				<VCardTitle class="text-h6">
					6. <code>reset()</code> sur un <code>modelValue</code> readonly <VChip
						color="success"
						size="x-small"
						class="ml-2"
					>
						Garde — finding 1.5 (rétracté)
					</VChip>
				</VCardTitle>
				<VCardSubtitle>
					Vérifié sain — conservé comme anti-régression
				</VCardSubtitle>
			</VCardItem>
			<VCardText>
				<SyAlert
					type="info"
					variant="tonal"
					class="mb-4"
				>
					<strong>Attendu :</strong> aucun warning « Write operation failed:
					computed value is readonly » après <code>reset()</code>.
					<code>VForm.reset()</code> écrit via <code>update:modelValue</code>
					(useProxiedModel), jamais dans le computed readonly exposé en prop par
					le DatePicker.<br>
					<strong>Comment tester :</strong> cliquer « reset() » — le compteur de
					warnings doit rester à 0.
				</SyAlert>

				<SyForm ref="dpFormRef">
					<DatePicker
						model-value="12/06/2030"
						label="Date de rendez-vous"
					/>
					<div class="d-flex flex-wrap align-center ga-3 mt-3">
						<VBtn
							color="primary"
							variant="tonal"
							@click="resetDatePicker"
						>
							reset()
						</VBtn>
						<VChip
							:color="readonlyWriteWarnings.length === 0 ? 'success' : 'error'"
							size="small"
							:prepend-icon="mdiConsoleLine"
						>
							Warnings « Write operation failed » : {{ readonlyWriteWarnings.length }}
						</VChip>
					</div>
					<SyAlert
						v-if="readonlyWriteWarnings.length > 0"
						type="error"
						variant="tonal"
						class="mt-3"
					>
						Régression : un reset a écrit dans un computed readonly. Voir la
						console.
					</SyAlert>
				</SyForm>
			</VCardText>
		</VCard>
	</div>
</template>

<style scoped>
.headless-field {
	border: 1px solid rgb(var(--v-theme-error));
	border-radius: 4px;
	padding: 8px 12px;
	width: 100%;
	color: rgb(var(--v-theme-error));
	background: rgba(var(--v-theme-error), 0.04);
}
</style>
