<script lang="ts" setup>
	import { ref, computed } from 'vue'
	import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
	import RatingPicker from '@/components/RatingPicker/RatingPicker.vue'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import SyCheckbox from '@/components/Customs/SyCheckbox/SyCheckbox.vue'
	import SyForm from '@/components/Customs/SyForm/SyForm.vue'
	import { RatingEnum } from '@/components/RatingPicker/Rating'
	import { mdiClipboardTextOutline, mdiCalendarRange, mdiStarOutline, mdiCheckCircle, mdiRefresh, mdiEyeOutline, mdiGestureTapButton, mdiAccountOutline, mdiShieldCheckOutline, mdiMedicalBag, mdiCurrencyEur } from '@mdi/js'

	const formValid = ref(false)
	const syFormRef = ref<InstanceType<typeof SyForm> | null>(null)
	const selectedDate = ref<Date | null>(null)
	const ratingValue = ref(-1)
	const ratingType = ref<RatingEnum>(RatingEnum.STARS)
	const beneficiaryName = ref('')
	const beneficiarySSN = ref('')
	const careType = ref(null)
	const acceptTerms = ref(false)
	const submitted = ref(false)

	const careTypes = [
		{ title: 'Consultation médecin généraliste', value: 'gp' },
		{ title: 'Consultation médecin spécialiste', value: 'specialist' },
		{ title: 'Soins dentaires', value: 'dental' },
		{ title: 'Optique (lunettes, lentilles)', value: 'optical' },
		{ title: 'Hospitalisation', value: 'hospital' },
		{ title: 'Pharmacie', value: 'pharmacy' },
		{ title: 'Kinésithérapie', value: 'kine' },
		{ title: 'Biologie / analyses', value: 'bio' },
	]

	const ratingTypes = [
		{ title: 'Étoiles', value: RatingEnum.STARS },
		{ title: 'Note sur 10', value: RatingEnum.NUMBER },
		{ title: 'Émoticônes', value: RatingEnum.EMOTION },
	]

	const declarationRef = computed(() => {
		if (!submitted.value) return null
		const num = Math.floor(100000 + Math.random() * 900000)
		return `REM-${new Date().getFullYear()}-${num}`
	})

	const liveValues = [
		{ label: 'Date de soins', get: () => selectedDate.value ? selectedDate.value.toLocaleDateString('fr-FR') : '—', icon: mdiCalendarRange },
		{ label: 'Satisfaction', get: () => ratingValue.value === -1 ? '—' : `${ratingValue.value}/5`, icon: mdiStarOutline },
		{ label: 'Bénéficiaire', get: () => beneficiaryName.value || '—', icon: mdiAccountOutline },
		{ label: 'Type de soins', get: () => careTypes.find(t => t.value === careType.value)?.title || '—', icon: mdiMedicalBag },
	]

	function handleSubmit({ isValid }: { isValid: boolean }) {
		formValid.value = isValid
		if (isValid) {
			submitted.value = true
		}
	}

	function handleReset() {
		syFormRef.value?.reset()
		selectedDate.value = null
		ratingValue.value = -1
		beneficiaryName.value = ''
		beneficiarySSN.value = ''
		careType.value = null
		acceptTerms.value = false
		submitted.value = false
		formValid.value = false
	}
</script>

<template>
	<div>
		<!-- Page header -->
		<div class="d-flex align-center ga-3 mb-2">
			<VIcon
				:icon="mdiClipboardTextOutline"
				color="primary"
				size="32"
			/>
			<div>
				<h1 class="text-h4 font-weight-bold">
					Déclaration de remboursement
				</h1>
				<p class="text-body-2 text-medium-emphasis">
					Déclarez vos frais de santé pour prise en charge par l'Assurance Maladie.
				</p>
			</div>
		</div>

		<VDivider class="mb-6" />

		<!-- Info banner -->
		<VAlert
			type="info"
			variant="tonal"
			class="mb-6"
		>
			<p class="font-weight-medium mb-1">
				Comment ça marche ?
			</p>
			Renseignez les informations relatives à vos soins de santé.
			Votre demande sera traitée sous 5 à 10 jours ouvrés.
			Le remboursement s'effectue directement sur votre compte bancaire.
		</VAlert>

		<!-- Success alert -->
		<VAlert
			v-if="submitted"
			type="success"
			variant="tonal"
			class="mb-6"
			closable
			@close="submitted = false"
		>
			<p class="font-weight-medium mb-1">
				Déclaration transmise avec succès !
			</p>
			<p class="text-body-2 mb-2">
				Votre demande a été enregistrée sous la référence :
				<span class="font-weight-bold">{{ declarationRef }}</span>
			</p>
			<ul class="text-body-2">
				<li>Date de soins : {{ selectedDate ? selectedDate.toLocaleDateString('fr-FR') : '—' }}</li>
				<li>Type : {{ careTypes.find(t => t.value === careType)?.title || '—' }}</li>
				<li>Bénéficiaire : {{ beneficiaryName || '—' }}</li>
				<li>Satisfaction : {{ ratingValue === -1 ? '—' : `${ratingValue}/5` }}</li>
			</ul>
		</VAlert>

		<!-- Form -->
		<SyForm
			ref="syFormRef"
			@submit="handleSubmit"
			@reset="handleReset"
		>
			<template #default="{ isValid, reset }">
				<!-- Section: Bénéficiaire -->
				<VCard
					variant="outlined"
					class="mb-6"
					rounded="lg"
				>
					<VCardItem>
						<template #prepend>
							<VIcon
								:icon="mdiAccountOutline"
								color="primary"
							/>
						</template>
						<VCardTitle class="text-h6">
							Informations bénéficiaire
						</VCardTitle>
					</VCardItem>
					<VDivider />
					<VCardText class="pt-4">
						<VRow>
							<VCol
								cols="12"
								sm="6"
							>
								<SyTextField
									v-model="beneficiaryName"
									label="Nom et prénom"
									placeholder="Ex : Jean Dupont"
									variant="outlined"
								/>
							</VCol>
							<VCol
								cols="12"
								sm="6"
							>
								<SyTextField
									v-model="beneficiarySSN"
									label="Numéro de sécurité sociale"
									placeholder="1 23 45 67 890 123 45"
									variant="outlined"
								/>
							</VCol>
						</VRow>
					</VCardText>
				</VCard>

				<!-- Section: Soins -->
				<VCard
					variant="outlined"
					class="mb-6"
					rounded="lg"
				>
					<VCardItem>
						<template #prepend>
							<VIcon
								:icon="mdiMedicalBag"
								color="primary"
							/>
						</template>
						<VCardTitle class="text-h6">
							Détails des soins
						</VCardTitle>
					</VCardItem>
					<VDivider />
					<VCardText class="pt-4">
						<VRow>
							<VCol
								cols="12"
								sm="6"
							>
								<VSelect
									v-model="careType"
									:items="careTypes"
									label="Type de soins"
									variant="outlined"
									density="default"
								/>
							</VCol>
							<VCol
								cols="12"
								sm="6"
							>
								<DatePicker
									v-model="selectedDate"
									label="Date des soins"
									placeholder="JJ/MM/AAAA"
									:is-birth-date="false"
									:required="true"
									:display-today-button="true"
									:display-holiday-days="true"
								/>
							</VCol>
						</VRow>
					</VCardText>
				</VCard>

				<!-- Section: Satisfaction -->
				<VCard
					variant="outlined"
					class="mb-6"
					rounded="lg"
				>
					<VCardItem>
						<template #prepend>
							<VIcon
								:icon="mdiStarOutline"
								color="primary"
							/>
						</template>
						<VCardTitle class="text-h6">
							Votre évaluation
						</VCardTitle>
					</VCardItem>
					<VDivider />
					<VCardText class="pt-4">
						<VRow>
							<VCol
								cols="12"
								sm="6"
							>
								<VSelect
									v-model="ratingType"
									:items="ratingTypes"
									label="Mode de notation"
									variant="outlined"
									density="default"
								/>
							</VCol>
							<VCol cols="12">
								<VSheet
									variant="outlined"
									border
									rounded
									class="pa-4"
								>
									<p class="text-caption text-medium-emphasis mb-3">
										Comment évaluez-vous votre prise en charge ?
									</p>
									<RatingPicker
										v-model="ratingValue"
										:type="ratingType"
										label="Satisfaction"
										:lock-after-selection="false"
									/>
								</VSheet>
							</VCol>
						</VRow>
					</VCardText>
				</VCard>

				<!-- Section: Consentement -->
				<VCard
					variant="outlined"
					class="mb-6"
					rounded="lg"
				>
					<VCardItem>
						<template #prepend>
							<VIcon
								:icon="mdiShieldCheckOutline"
								color="primary"
							/>
						</template>
						<VCardTitle class="text-h6">
							Consentement
						</VCardTitle>
					</VCardItem>
					<VDivider />
					<VCardText class="pt-4">
						<SyCheckbox
							v-model="acceptTerms"
							label="J'atteste sur l'honneur l'exactitude des informations déclarées et j'accepte les conditions de traitement de mes données de santé par l'Assurance Maladie."
						/>
					</VCardText>
					<VDivider />
					<VCardActions class="pa-4">
						<VBtn
							type="submit"
							color="primary"
							variant="elevated"
							:prepend-icon="mdiCheckCircle"
							:disabled="!isValid"
						>
							Transmettre la déclaration
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

		<!-- Live values -->
		<VCard
			variant="outlined"
			class="mb-6"
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
					Récapitulatif en temps réel
				</VCardTitle>
			</VCardItem>
			<VDivider />
			<VCardText>
				<VRow>
					<VCol
						v-for="item in liveValues"
						:key="item.label"
						cols="6"
						sm="3"
					>
						<VSheet
							color="grey-lighten-3"
							rounded="lg"
							class="pa-3 h-100"
						>
							<div class="d-flex align-center ga-2 mb-1">
								<VIcon
									:icon="item.icon"
									size="16"
									color="medium-emphasis"
								/>
								<span class="text-caption text-medium-emphasis">{{ item.label }}</span>
							</div>
							<p class="text-body-1 font-weight-bold text-truncate">
								{{ item.get() }}
							</p>
						</VSheet>
					</VCol>
				</VRow>
				<VRow class="mt-2">
					<VCol cols="12">
						<VChip
							:color="formValid ? 'success' : 'default'"
							variant="tonal"
							size="small"
						>
							<VIcon
								:start="true"
								:icon="mdiCheckCircle"
								size="16"
							/>
							Formulaire valide : {{ formValid ? 'Oui' : 'Non' }}
						</VChip>
					</VCol>
				</VRow>
			</VCardText>
		</VCard>

		<!-- Buttons showcase -->
		<VCard
			variant="outlined"
			rounded="lg"
		>
			<VCardItem>
				<template #prepend>
					<VIcon
						:icon="mdiGestureTapButton"
						color="primary"
					/>
				</template>
				<VCardTitle class="text-h6">
					Boutons — variantes Vuetify
				</VCardTitle>
			</VCardItem>
			<VDivider />
			<VCardText>
				<VRow>
					<VCol
						cols="12"
						sm="6"
					>
						<p class="text-caption text-medium-emphasis mb-2">
							Variantes
						</p>
						<div class="d-flex flex-wrap ga-3">
							<VBtn
								color="primary"
								variant="elevated"
							>
								Elevated
							</VBtn>
							<VBtn
								color="primary"
								variant="flat"
							>
								Flat
							</VBtn>
							<VBtn
								color="primary"
								variant="tonal"
							>
								Tonal
							</VBtn>
							<VBtn
								color="primary"
								variant="outlined"
							>
								Outlined
							</VBtn>
							<VBtn
								color="primary"
								variant="text"
							>
								Text
							</VBtn>
							<VBtn
								color="primary"
								variant="plain"
							>
								Plain
							</VBtn>
							<VBtn disabled>
								Disabled
							</VBtn>
						</div>
					</VCol>
					<VCol
						cols="12"
						sm="6"
					>
						<p class="text-caption text-medium-emphasis mb-2">
							Tailles & couleurs
						</p>
						<div class="d-flex flex-wrap ga-3 align-center">
							<VBtn
								color="success"
								variant="elevated"
								size="small"
							>
								Valider
							</VBtn>
							<VBtn
								color="primary"
								variant="elevated"
								size="default"
							>
								Confirmer
							</VBtn>
							<VBtn
								color="error"
								variant="elevated"
								size="large"
							>
								Annuler
							</VBtn>
							<VBtn
								color="warning"
								variant="elevated"
								size="x-large"
							>
								Alerte
							</VBtn>
							<VBtn
								color="info"
								variant="tonal"
								size="default"
								block
								:prepend-icon="mdiCurrencyEur"
							>
								Télécharger le remboursement
							</VBtn>
						</div>
					</VCol>
				</VRow>
			</VCardText>
		</VCard>
	</div>
</template>
