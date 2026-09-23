<script lang="ts" setup>
	import { ref } from 'vue'
	import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
	import NirField from '@/components/NirField/NirField.vue'
	import SySelect from '@/components/Customs/Selects/SySelect/SySelect.vue'
	import SyForm from '@/components/Customs/SyForm/SyForm.vue'
	import SyAlert from '@/components/SyAlert/SyAlert.vue'
	import { mdiCheckCircle, mdiAlertCircle, mdiFormSelect, mdiShieldCheckOutline } from '@mdi/js'

	// ── Form 1: Synapse validation (customRules) ──

	const synapseCalendarDate = ref<string | null>(null)
	const synapseNoCalendarDate = ref<string | null>(null)
	const synapseCombinedDate = ref<string | null>(null)
	const synapseNir = ref('')
	const synapseSelect = ref(null)

	const synapseFormValid = ref(false)
	const synapseSubmitted = ref(false)

	const synapseSelectItems = [
		{ title: 'Assuré social', value: 'assure' },
		{ title: 'Ayant droit', value: 'ayant-droit' },
		{ title: 'Bénéficiaire CMU', value: 'cmu' },
		{ title: 'Professionnel de santé', value: 'pro' },
	]

	const synapseDateRules = [
		{
			type: 'notBeforeToday',
			options: {
				message: 'La date ne peut pas être antérieure à aujourd\'hui',
			},
		},
	]

	function handleSynapseSubmit({ isValid }: { isValid: boolean }) {
		synapseFormValid.value = isValid
		synapseSubmitted.value = isValid
	}

	function handleSynapseReset() {
		synapseCalendarDate.value = null
		synapseNoCalendarDate.value = null
		synapseCombinedDate.value = null
		synapseNir.value = ''
		synapseSelect.value = null
		synapseSubmitted.value = false
		synapseFormValid.value = false
	}

	// ── Form 2: Vuetify native validation (rules + useVuetifyValidation) ──

	const vuetifyCalendarDate = ref<string | null>(null)
	const vuetifyNoCalendarDate = ref<string | null>(null)
	const vuetifyCombinedDate = ref<string | null>(null)
	const vuetifyNir = ref('')
	const vuetifySelect = ref(null)

	const vuetifyFormValid = ref(false)
	const vuetifySubmitted = ref(false)

	const vuetifySelectItems = [
		{ title: 'Assuré social', value: 'assure' },
		{ title: 'Ayant droit', value: 'ayant-droit' },
		{ title: 'Bénéficiaire CMU', value: 'cmu' },
		{ title: 'Professionnel de santé', value: 'pro' },
	]

	const vuetifyDateRules = [
		(value: unknown) => {
			if (!value) return true
			const today = new Date()
			today.setHours(0, 0, 0, 0)
			const input = new Date(value as string)
			input.setHours(0, 0, 0, 0)
			return input >= today || 'La date ne peut pas être antérieure à aujourd\'hui'
		},
	]

	const vuetifySelectRules = [
		(value: unknown) => !!value || 'Veuillez sélectionner une catégorie',
	]

	function handleVuetifySubmit({ isValid }: { isValid: boolean }) {
		vuetifyFormValid.value = isValid
		vuetifySubmitted.value = isValid
	}

	function handleVuetifyReset() {
		vuetifyCalendarDate.value = null
		vuetifyNoCalendarDate.value = null
		vuetifyCombinedDate.value = null
		vuetifyNir.value = ''
		vuetifySelect.value = null
		vuetifySubmitted.value = false
		vuetifyFormValid.value = false
	}
</script>

<template>
	<div>
		<!-- Page header -->
		<div class="d-flex align-center ga-3 mb-2">
			<VIcon
				:icon="mdiFormSelect"
				color="primary"
				size="32"
			/>
			<div>
				<h1 class="text-h4 font-weight-bold">
					Comparatif des modes de validation
				</h1>
				<p class="text-body-2 text-medium-emphasis">
					Deux formulaires identiques : validation Synapse (customRules) vs validation Vuetify native (rules).
				</p>
			</div>
		</div>

		<VDivider class="mb-6" />

		<VRow>
			<!-- ═══════════════════════════════════════════════════════════ -->
			<!-- Form 1: Synapse validation                                     -->
			<!-- ═══════════════════════════════════════════════════════════ -->
			<VCol
				cols="12"
				md="6"
			>
				<VCard
					variant="outlined"
					rounded="lg"
					class="h-100"
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
						<VCardSubtitle>
							customRules / customWarningRules / customSuccessRules
						</VCardSubtitle>
					</VCardItem>

					<VDivider />

					<VCardText>
						<SyAlert
							v-if="synapseSubmitted"
							type="success"
							variant="tonal"
							class="mb-4"
							closable
							@close="synapseSubmitted = false"
						>
							Formulaire valide — toutes les contraintes Synapse sont respectées.
						</SyAlert>

						<SyForm
							@submit="handleSynapseSubmit"
							@reset="handleSynapseReset"
						>
							<template #default="{ isValid, reset }">
								<p class="text-caption text-medium-emphasis mb-4">
									Les champs ci-dessous utilisent les règles Synapse (<code>customRules</code>).
									La validation est gérée par <code>useValidation</code> du système unifié.
								</p>

								<!-- DatePicker CalendarMode -->
								<div class="mb-4">
									<p class="text-body-2 font-weight-medium mb-1">
										DatePicker — Mode calendrier
									</p>
									<DatePicker
										v-model="synapseCalendarDate"
										label="Date de consultation"
										placeholder="JJ/MM/AAAA"
										format="DD/MM/YYYY"
										required
										:custom-rules="synapseDateRules"
										:display-today-button="true"
									/>
								</div>

								<!-- DatePicker noCalendar -->
								<div class="mb-4">
									<p class="text-body-2 font-weight-medium mb-1">
										DatePicker — Mode saisie manuelle (noCalendar)
									</p>
									<DatePicker
										v-model="synapseNoCalendarDate"
										label="Date de prescription"
										placeholder="JJ/MM/AAAA"
										format="DD/MM/YYYY"
										no-calendar
										required
										:custom-rules="synapseDateRules"
									/>
								</div>

								<!-- DatePicker CombinedMode -->
								<div class="mb-4">
									<p class="text-body-2 font-weight-medium mb-1">
										DatePicker — Mode combiné (useCombinedMode)
									</p>
									<DatePicker
										v-model="synapseCombinedDate"
										label="Date d'hospitalisation"
										placeholder="JJ/MM/AAAA"
										format="DD/MM/YYYY"
										use-combined-mode
										required
										:custom-rules="synapseDateRules"
									/>
								</div>

								<!-- NirField -->
								<div class="mb-4">
									<p class="text-body-2 font-weight-medium mb-1">
										NirField
									</p>
									<NirField
										v-model="synapseNir"
										required
										number-label="Numéro de sécurité sociale"
										:display-key="true"
									/>
								</div>

								<!-- SySelect -->
								<div class="mb-4">
									<p class="text-body-2 font-weight-medium mb-1">
										SySelect
									</p>
									<SySelect
										v-model="synapseSelect"
										label="Catégorie d'assuré"
										:items="synapseSelectItems"
										required
										:custom-rules="[
											{
												type: 'required',
												options: {
													message: 'Veuillez sélectionner une catégorie',
													fieldIdentifier: 'Catégorie d\'assuré',
												},
											},
										]"
									/>
								</div>

								<div class="d-flex ga-3">
									<VBtn
										type="submit"
										color="primary"
										variant="elevated"
										:prepend-icon="mdiCheckCircle"
										:disabled="!isValid"
									>
										Valider
									</VBtn>
									<VBtn
										variant="text"
										@click="reset"
									>
										Réinitialiser
									</VBtn>
								</div>
							</template>
						</SyForm>
					</VCardText>
				</VCard>
			</VCol>

			<!-- ═══════════════════════════════════════════════════════════ -->
			<!-- Form 2: Vuetify native validation                              -->
			<!-- ═══════════════════════════════════════════════════════════ -->
			<VCol
				cols="12"
				md="6"
			>
				<VCard
					variant="outlined"
					rounded="lg"
					class="h-100"
				>
					<VCardItem>
						<template #prepend>
							<VIcon
								:icon="mdiAlertCircle"
								color="secondary"
							/>
						</template>
						<VCardTitle class="text-h6">
							Validation Vuetify native
						</VCardTitle>
						<VCardSubtitle>
							rules + useVuetifyValidation
						</VCardSubtitle>
					</VCardItem>

					<VDivider />

					<VCardText>
						<SyAlert
							v-if="vuetifySubmitted"
							type="success"
							variant="tonal"
							class="mb-4"
							closable
							@close="vuetifySubmitted = false"
						>
							Formulaire valide — toutes les règles Vuetify sont respectées.
						</SyAlert>

						<SyForm
							@submit="handleVuetifySubmit"
							@reset="handleVuetifyReset"
						>
							<template #default="{ isValid, reset }">
								<p class="text-caption text-medium-emphasis mb-4">
									Les champs ci-dessous utilisent les règles Vuetify (<code>rules</code>)
									avec <code>useVuetifyValidation</code>.
								</p>

								<!-- DatePicker CalendarMode -->
								<div class="mb-4">
									<p class="text-body-2 font-weight-medium mb-1">
										DatePicker — Mode calendrier
									</p>
									<DatePicker
										v-model="vuetifyCalendarDate"
										label="Date de consultation"
										placeholder="JJ/MM/AAAA"
										format="DD/MM/YYYY"
										required
										use-vuetify-validation
										:rules="vuetifyDateRules"
										:display-today-button="true"
									/>
								</div>

								<!-- DatePicker noCalendar -->
								<div class="mb-4">
									<p class="text-body-2 font-weight-medium mb-1">
										DatePicker — Mode saisie manuelle (noCalendar)
									</p>
									<DatePicker
										v-model="vuetifyNoCalendarDate"
										label="Date de prescription"
										placeholder="JJ/MM/AAAA"
										format="DD/MM/YYYY"
										no-calendar
										required
										use-vuetify-validation
										:rules="vuetifyDateRules"
									/>
								</div>

								<!-- DatePicker CombinedMode -->
								<div class="mb-4">
									<p class="text-body-2 font-weight-medium mb-1">
										DatePicker — Mode combiné (useCombinedMode)
									</p>
									<DatePicker
										v-model="vuetifyCombinedDate"
										label="Date d'hospitalisation"
										placeholder="JJ/MM/AAAA"
										format="DD/MM/YYYY"
										use-combined-mode
										required
										use-vuetify-validation
										:rules="vuetifyDateRules"
									/>
								</div>

								<!-- NirField -->
								<div class="mb-4">
									<p class="text-body-2 font-weight-medium mb-1">
										NirField
									</p>
									<NirField
										v-model="vuetifyNir"
										required
										number-label="Numéro de sécurité sociale"
										:display-key="true"
										use-vuetify-validation
										:number-rules="[
											(value: unknown) => !!value || 'Le numéro de sécurité sociale est requis',
										]"
										:key-rules="[
											(value: unknown) => !!value || 'La clé de validation est requise',
										]"
									/>
								</div>

								<!-- SySelect -->
								<div class="mb-4">
									<p class="text-body-2 font-weight-medium mb-1">
										SySelect
									</p>
									<SySelect
										v-model="vuetifySelect"
										label="Catégorie d'assuré"
										:items="vuetifySelectItems"
										required
										use-vuetify-validation
										:rules="vuetifySelectRules"
									/>
								</div>

								<div class="d-flex ga-3">
									<VBtn
										type="submit"
										color="primary"
										variant="elevated"
										:prepend-icon="mdiCheckCircle"
										:disabled="!isValid"
									>
										Valider
									</VBtn>
									<VBtn
										variant="text"
										@click="reset"
									>
										Réinitialiser
									</VBtn>
								</div>
							</template>
						</SyForm>
					</VCardText>
				</VCard>
			</VCol>
		</VRow>
	</div>
</template>
