<script lang="ts" setup>
	import { ref } from 'vue'
	import SyAlert from '@/components/SyAlert/SyAlert.vue'
	import SyHeading from '@/components/SyHeading/SyHeading.vue'
	import Accordion from '@/components/Accordion/Accordion.vue'
	import SyCheckbox from '@/components/Customs/SyCheckbox/SyCheckbox.vue'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import SySelect from '@/components/Customs/Selects/SySelect/SySelect.vue'
	import { mdiViewDashboardOutline, mdiFormatTitle, mdiAlertCircleOutline, mdiChevronUp, mdiFormTextbox, mdiCheckboxMarkedOutline, mdiInformationOutline } from '@mdi/js'

	const checkboxValue = ref(false)
	const textFieldValue = ref('')
	const selectValue = ref(null)

	const selectItems = [
		{ text: 'Médecin généraliste', value: 'gp' },
		{ text: 'Médecin spécialiste', value: 'specialist' },
		{ text: 'Chirurgien-dentiste', value: 'dental' },
		{ text: 'Sage-femme', value: 'midwife' },
		{ text: 'Kinésithérapeute', value: 'kine' },
	]

	const accordionItems = [
		{ id: 'faq-1', title: 'Comment obtenir un remboursement ?', content: 'Déposez votre déclaration en ligne via le formulaire de déclaration. Le remboursement est effectué sous 5 à 10 jours ouvrés sur votre compte bancaire.' },
		{ id: 'faq-2', title: 'Quels documents fournir ?', content: 'Vous devez fournir la feuille de soins, l\'ordonnance (le cas échéant) et tout justificatif lié aux soins réalisés.' },
		{ id: 'faq-3', title: 'Consulter le remboursement de la Sécurité Sociale', content: 'Vos remboursements sont consultables dans votre espace ameli, rubrique "Mes paiements". Vous y trouverez l\'historique des 12 derniers mois.' },
	]
</script>

<template>
	<div>
		<!-- Page header -->
		<div class="d-flex align-center ga-3 mb-2">
			<VIcon
				:icon="mdiViewDashboardOutline"
				color="primary"
				size="32"
			/>
			<div>
				<h1 class="text-h4 font-weight-bold">
					Composants & UI
				</h1>
				<p class="text-body-2 text-medium-emphasis">
					Vitrine des composants du Design System en contextes Assurance Maladie.
				</p>
			</div>
		</div>

		<VDivider class="mb-6" />

		<VRow>
			<!-- SyHeading -->
			<VCol cols="12" md="6">
				<VCard
					variant="outlined"
					class="mb-6"
					rounded="lg"
				>
					<VCardItem>
						<template #prepend>
							<VIcon
								:icon="mdiFormatTitle"
								color="primary"
							/>
						</template>
						<VCardTitle class="text-h6">
							SyHeading — Titres
						</VCardTitle>
						<VCardSubtitle>Hiérarchie de contenu portail ameli</VCardSubtitle>
					</VCardItem>
					<VDivider />
					<VCardText class="pt-4">
						<SyHeading level="1">
							Mon espace santé
						</SyHeading>
						<SyHeading level="2">
							Mes remboursements
						</SyHeading>
						<SyHeading level="3">
							Déclaration en cours
						</SyHeading>
						<SyHeading level="4">
							Historique des transactions
						</SyHeading>
					</VCardText>
				</VCard>
			</VCol>

			<!-- SyAlert -->
			<VCol cols="12" md="6">
				<VCard
					variant="outlined"
					class="mb-6"
					rounded="lg"
				>
					<VCardItem>
						<template #prepend>
							<VIcon
								:icon="mdiAlertCircleOutline"
								color="primary"
							/>
						</template>
						<VCardTitle class="text-h6">
							SyAlert — Notifications
						</VCardTitle>
						<VCardSubtitle>Messages utilisateur type portail</VCardSubtitle>
					</VCardItem>
					<VDivider />
					<VCardText class="pt-4 d-flex flex-column ga-3">
						<SyAlert
							type="info"
							variant="tonal"
						>
							Votre carte vitale arrive à échéance le 31 décembre 2025. Pensez à la renouveler.
						</SyAlert>
						<SyAlert
							type="success"
							variant="tonal"
						>
							Votre déclaration REM-2025-482910 a été validée. Remboursement de 24,50 € sous 5 jours.
						</SyAlert>
						<SyAlert
							type="warning"
							variant="tonal"
						>
							Votre mutuelle complémentaire n'est plus à jour. Certaines prises en charge peuvent être suspendues.
						</SyAlert>
						<SyAlert
							type="error"
							variant="tonal"
						>
							Le numéro de sécurité sociale saisi est invalide. Veuillez vérifier votre saisie.
						</SyAlert>
					</VCardText>
				</VCard>
			</VCol>

			<!-- Accordion FAQ -->
			<VCol cols="12" md="6">
				<VCard
					variant="outlined"
					class="mb-6"
					rounded="lg"
				>
					<VCardItem>
						<template #prepend>
							<VIcon
								:icon="mdiChevronUp"
								color="primary"
							/>
						</template>
						<VCardTitle class="text-h6">
							Accordion — FAQ
						</VCardTitle>
						<VCardSubtitle>Questions fréquentes Assurance Maladie</VCardSubtitle>
					</VCardItem>
					<VDivider />
					<VCardText class="pt-4">
						<Accordion :items="accordionItems" />
					</VCardText>
				</VCard>
			</VCol>

			<!-- Form fields -->
			<VCol cols="12" md="6">
				<VCard
					variant="outlined"
					class="mb-6"
					rounded="lg"
				>
					<VCardItem>
						<template #prepend>
							<VIcon
								:icon="mdiFormTextbox"
								color="primary"
							/>
						</template>
						<VCardTitle class="text-h6">
							Champs de formulaire
						</VCardTitle>
						<VCardSubtitle>Recherche professionnel de santé</VCardSubtitle>
					</VCardItem>
					<VDivider />
					<VCardText class="pt-4">
						<VRow>
							<VCol cols="12">
								<SyTextField
									v-model="textFieldValue"
									label="Ville ou code postal"
									placeholder="Ex : 75014"
									variant="outlined"
								/>
							</VCol>
							<VCol cols="12">
								<SySelect
									v-model="selectValue"
									:items="selectItems"
									label="Type de professionnel"
								/>
							</VCol>
							<VCol cols="12">
								<div class="d-flex align-center ga-2">
									<SyCheckbox
										v-model="checkboxValue"
										label="Accepte la carte vitale"
									/>
									<VChip
										v-if="checkboxValue"
										size="small"
										color="success"
										variant="tonal"
									>
										<VIcon
											:start="true"
											:icon="mdiCheckboxMarkedOutline"
											size="16"
										/>
										Secteur 1
									</VChip>
								</div>
							</VCol>
						</VRow>
					</VCardText>
				</VCard>
			</VCol>
		</VRow>

		<!-- Info card -->
		<VCard
			color="primary"
			variant="tonal"
			rounded="lg"
			class="mt-2"
		>
			<VCardText>
				<div class="d-flex align-start ga-3">
					<VIcon
						:icon="mdiInformationOutline"
						color="primary"
						size="24"
					/>
					<div>
						<p class="font-weight-medium text-primary mb-1">
							À propos de cette vitrine
						</p>
						<p class="text-body-2">
							Cette page présente les composants du Design System de l'Assurance Maladie
							dans des cas d'usage réels : notifications portail ameli, FAQ remboursement,
							recherche de professionnel de santé. Changez de thème via le sélecteur en bas à droite.
						</p>
					</div>
				</div>
			</VCardText>
		</VCard>
	</div>
</template>
