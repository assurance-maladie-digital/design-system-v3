<script lang="ts" setup>
	import { mdiClipboardTextOutline, mdiViewDashboardOutline, mdiArrowLeft, mdiStarOutline, mdiCheckboxMarkedCircleOutline, mdiChevronRight, mdiShieldAccountOutline, mdiMedicalBag, mdiFileDocumentOutline, mdiHospitalBuilding } from '@mdi/js'

	const cards = [
		{
			title: 'Déclaration de remboursement',
			subtitle: 'Formulaire de prise en charge',
			description: 'Simulez une déclaration de frais de santé avec DatePicker, RatingPicker et validation de formulaire.',
			to: '/sandbox.html/form',
			icon: mdiClipboardTextOutline,
			tags: ['DatePicker', 'RatingPicker', 'SyTextField', 'SyCheckbox'],
		},
		{
			title: 'Composants & UI',
			subtitle: 'Vitrine des composants DS',
			description: 'Alertes, titres, accordéons et champs de formulaire dans des cas d\'usage Assurance Maladie.',
			to: '/sandbox.html/components',
			icon: mdiViewDashboardOutline,
			tags: ['SyAlert', 'SyHeading', 'Accordion', 'SySelect'],
		},
	]

	const stats = [
		{ label: 'Composants DS', value: '60+', icon: mdiCheckboxMarkedCircleOutline },
		{ label: 'Pages de test', value: '2', icon: mdiViewDashboardOutline },
		{ label: 'Thèmes', value: '4', icon: mdiStarOutline },
	]

	const quickActions = [
		{ label: 'Remboursement', icon: mdiMedicalBag, color: 'primary' },
		{ label: 'Documents', icon: mdiFileDocumentOutline, color: 'info' },
		{ label: 'Établissements', icon: mdiHospitalBuilding, color: 'success' },
		{ label: 'Mon compte', icon: mdiShieldAccountOutline, color: 'warning' },
	]
</script>

<template>
	<div>
		<!-- Hero -->
		<VSheet
			color="primary"
			class="pa-8 rounded-xl mb-8"
		>
			<div class="d-flex align-center ga-3 mb-2">
				<VIcon
					:icon="mdiShieldAccountOutline"
					size="40"
					color="white"
				/>
				<div>
					<h1 class="text-h4 font-weight-bold text-white">
						Espace Assurance Maladie
					</h1>
					<p class="text-body-1 text-white opacity-90">
						Portail de services — Design System v3
					</p>
				</div>
			</div>
			<p class="text-body-2 text-white opacity-80 mb-4">
				Terrain de test interactif simulant les cas d'usage réels de l'Assurance Maladie.
			</p>
			<div class="d-flex flex-wrap ga-2">
				<VChip
					v-for="stat in stats"
					:key="stat.label"
					color="white"
					variant="outlined"
					size="small"
				>
					<VIcon
						:start="true"
						:icon="stat.icon"
						size="16"
					/>
					<span class="font-weight-bold ml-1">{{ stat.value }}</span>
					<span class="ml-1">{{ stat.label }}</span>
				</VChip>
			</div>
		</VSheet>

		<!-- Quick actions -->
		<h2 class="text-h6 font-weight-bold mb-4">
			Accès rapide
		</h2>
		<VRow class="mb-8">
			<VCol
				v-for="action in quickActions"
				:key="action.label"
				cols="6"
				sm="3"
			>
				<VCard
					variant="outlined"
					rounded="lg"
					class="text-center card-hover pa-4"
					:to="action.label === 'Remboursement' ? '/sandbox.html/form' : '/sandbox.html/components'"
				>
					<VAvatar
						:color="action.color"
						variant="tonal"
						size="48"
						class="mb-2"
					>
						<VIcon :icon="action.icon" />
					</VAvatar>
					<p class="text-body-2 font-weight-medium">
						{{ action.label }}
					</p>
				</VCard>
			</VCol>
		</VRow>

		<!-- Service cards -->
		<h2 class="text-h6 font-weight-bold mb-4">
			Services disponibles
		</h2>
		<VRow>
			<VCol
				v-for="card in cards"
				:key="card.to"
				cols="12"
				sm="6"
				md="6"
			>
				<VCard
					:to="card.to"
					variant="outlined"
					class="h-100 card-hover"
					rounded="lg"
				>
					<VCardItem>
						<template #prepend>
							<VAvatar
								color="primary"
								variant="tonal"
								rounded
							>
								<VIcon :icon="card.icon" />
							</VAvatar>
						</template>
						<VCardTitle class="text-h6">
							{{ card.title }}
						</VCardTitle>
						<VCardSubtitle>{{ card.subtitle }}</VCardSubtitle>
					</VCardItem>
					<VCardText>
						{{ card.description }}
						<div class="d-flex flex-wrap ga-1 mt-3">
							<VChip
								v-for="tag in card.tags"
								:key="tag"
								size="x-small"
								variant="tonal"
								color="primary"
							>
								{{ tag }}
							</VChip>
						</div>
					</VCardText>
					<VCardActions>
						<VBtn
							color="primary"
							variant="text"
							:append-icon="mdiChevronRight"
						>
							Accéder
						</VBtn>
					</VCardActions>
				</VCard>
			</VCol>
		</VRow>

		<!-- Back link -->
		<div class="mt-8">
			<a href="/">
				<VBtn
					variant="text"
					size="small"
					:prepend-icon="mdiArrowLeft"
				>
					Retour au playground principal
				</VBtn>
			</a>
		</div>
	</div>
</template>

<style scoped>
.card-hover {
	transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.card-hover:hover {
	border-color: rgb(var(--v-theme-primary));
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
</style>
