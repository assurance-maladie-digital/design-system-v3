<script setup lang="ts">
	import SyIcon from './SyIcon.vue'
	import { ref, computed } from 'vue'
	import { mdiInformation, mdiHome, mdiAccount, mdiCog, mdiAlertCircle, mdiMagnify, mdiDownload, mdiPencil, mdiCheck, mdiClose, mdiHelp } from '@mdi/js'

	// Liste d'icônes prédéfinies pour la sélection
	const iconOptions = [
		{ label: 'Information', value: mdiInformation, index: 0 },
		{ label: 'Alerte', value: mdiAlertCircle, index: 1 },
		{ label: 'Compte', value: mdiAccount, index: 2 },
		{ label: 'Recherche', value: mdiMagnify, index: 3 },
		{ label: 'Accueil', value: mdiHome, index: 4 },
		{ label: 'Paramètres', value: mdiCog, index: 5 },
		{ label: 'Télécharger', value: mdiDownload, index: 6 },
		{ label: 'Éditer', value: mdiPencil, index: 7 },
		{ label: 'Valider', value: mdiCheck, index: 8 },
		{ label: 'Annuler', value: mdiClose, index: 9 },
		{ label: 'Aide', value: mdiHelp, index: 10 },
	]

	// Options pour la démonstration
	const decorative = ref(true)
	const label = ref('Information importante')
	const icon = ref(mdiInformation)
	const selectedIconIndex = ref(0)

	// Mettre à jour l'icône sélectionnée
	const updateSelectedIcon = (index) => {
		if (index !== undefined && index !== null && iconOptions[index]) {
			selectedIconIndex.value = index
			icon.value = iconOptions[index].value
			if (!decorative.value && !label.value) {
				label.value = iconOptions[index].label
			}
		}
	}

	// Attributs générés en fonction des options
	const ariaAttributes = computed(() => {
		return {
			'role': decorative.value !== false ? 'presentation' : 'img',
			'aria-hidden': decorative.value !== false ? 'true' : undefined,
			'aria-label': decorative.value === false && label.value ? label.value : undefined,
		}
	})

	// Code HTML généré
	const generatedHtml = computed(() => {
		const attrs: string[] = [] // Typage explicite du tableau comme chaînes de caractères
		if (ariaAttributes.value.role) {
			attrs.push(`role="${ariaAttributes.value.role}"`)
		}
		if (ariaAttributes.value['aria-hidden']) {
			attrs.push(`aria-hidden="${ariaAttributes.value['aria-hidden']}"`)
		}
		if (ariaAttributes.value['aria-label']) {
			attrs.push(`aria-label="${ariaAttributes.value['aria-label']}"`)
		}

		return `<v-icon ${attrs.join(' ')}>${icon.value}</v-icon>`
	})
</script>

<template>
	<VContainer class="sy-icon-accessibility pa-4">
		<!-- En-tête et principes d'accessibilité -->
		<VCard
			class="mb-6"
			variant="outlined"
		>
			<VCardTitle class="text-h5 primary lighten-4 py-3 px-4">
				Guide d'accessibilité pour SyIcon
			</VCardTitle>

			<VCardText>
				<h3 class="text-h6 mb-3 font-weight-medium">
					Principes d'accessibilité
				</h3>
				<p class="mb-2">
					Le composant SyIcon respecte les normes d'accessibilité RGAA en appliquant automatiquement les attributs ARIA appropriés
					en fonction de la nature de l'icône (décorative ou informative).
				</p>

				<VAlert
					class="mb-4"
					color="warning"
					variant="tonal"
					density="comfortable"
				>
					<strong>Important :</strong> Si une icône est marquée comme non décorative (<code>:decorative="false"</code>) mais qu'aucun label n'est fourni,
					un message d'erreur sera affiché dans la console : <code>L'icône "[nom-de-l'icône]" n'est pas décorative, mais aucun texte alternatif (label) n'a été fourni.</code>
				</VAlert>

				<VList
					class="mb-4 bg-grey-lighten-4 rounded"
					density="compact"
				>
					<VListItem>
						<VListItemTitle class="font-weight-bold">
							Icônes décoratives
						</VListItemTitle>
						<VListItemSubtitle>
							Invisibles pour les lecteurs d'écran (role="presentation", aria-hidden="true")
						</VListItemSubtitle>
					</VListItem>
					<VDivider />
					<VListItem>
						<VListItemTitle class="font-weight-bold">
							Icônes informatives
						</VListItemTitle>
						<VListItemSubtitle>
							Annoncées par les lecteurs d'écran avec un label explicite (role="img", aria-label="[label]")
						</VListItemSubtitle>
					</VListItem>
				</VList>

				<VAlert
					class="mb-4"
					color="info"
					variant="tonal"
					density="comfortable"
				>
					La directive <code>v-rgaa-svg-fix</code> est également appliquée pour garantir la compatibilité avec les lecteurs d'écran.
				</VAlert>
			</VCardText>
		</VCard>

		<!-- Démonstration interactive -->
		<VCard
			class="mb-6"
			variant="outlined"
		>
			<VCardTitle class="text-h6 secondary lighten-4 py-3 px-4">
				Démonstration interactive
			</VCardTitle>

			<VCardText>
				<p class="mb-4">
					Modifiez les paramètres ci-dessous pour voir comment les attributs d'accessibilité sont générés :
				</p>

				<VRow>
					<!-- Configuration -->
					<VCol
						cols="12"
						md="6"
					>
						<VCard
							variant="flat"
							class="pa-4 border rounded"
						>
							<h4 class="text-subtitle-1 mb-4 font-weight-medium">
								Configuration
							</h4>

							<VRadioGroup
								v-model="decorative"
								inline
								label="Type d'icône :"
								class="mb-4"
							>
								<VRadio
									:value="true"
									label="Décorative"
								/>
								<VRadio
									:value="false"
									label="Informative"
								/>
							</VRadioGroup>

							<VSelect
								v-model="selectedIconIndex"
								label="Sélectionnez une icône"
								:items="iconOptions"
								item-title="label"
								item-value="index"
								class="mb-4"
								variant="outlined"
								density="comfortable"
								@update:model-value="updateSelectedIcon"
							/>

							<VTextField
								v-if="decorative === false"
								v-model="label"
								label="Label d'accessibilité"
								variant="outlined"
								density="comfortable"
								hint="Ce texte sera lu par les lecteurs d'écran"
								persistent-hint
							/>
						</VCard>
					</VCol>

					<!-- Aperçu -->
					<VCol
						cols="12"
						md="6"
					>
						<VCard
							variant="flat"
							class="pa-4 border rounded"
						>
							<h4 class="text-subtitle-1 mb-4 font-weight-medium">
								Aperçu
							</h4>

							<div class="d-flex align-center gap-4 mb-4">
								<VCard
									class="pa-6 d-flex justify-center align-center"
									width="100"
									height="100"
								>
									<SyIcon
										:icon="icon"
										:decorative="decorative"
										:label="decorative === false ? label : undefined"
										size="x-large"
										color="primary"
									/>
								</VCard>
								<div>
									<VChip
										v-if="decorative"
										color="success"
										variant="outlined"
										class="ml-10 mb-2"
									>
										Icône décorative
									</VChip>
									<VChip
										v-else
										color="info"
										variant="outlined"
										class="ml-10 mb-2"
									>
										Icône informative
									</VChip>
									<p
										v-if="!decorative"
										class="text-body-2"
									>
										Label: "{{ label }}"
									</p>
								</div>
							</div>
						</VCard>
					</VCol>
				</VRow>
			</VCardText>
		</VCard>

		<!-- Résultats -->
		<VCard
			class="mb-6"
			variant="outlined"
		>
			<VCardTitle class="text-h6 accent lighten-4 py-3 px-4">
				Résultats
			</VCardTitle>

			<VCardText>
				<VRow>
					<VCol
						cols="12"
						md="6"
					>
						<h4 class="text-subtitle-1 mb-3 font-weight-medium">
							Attributs ARIA générés
						</h4>
						<VCard
							class="pa-4 rounded bg-grey-lighten-4"
							variant="flat"
						>
							<pre><code>{{ JSON.stringify(ariaAttributes, null, 2) }}</code></pre>
						</VCard>
					</VCol>

					<VCol
						cols="12"
						md="6"
					>
						<h4 class="text-subtitle-1 mb-3 font-weight-medium">
							Code HTML généré
						</h4>
						<VCard
							class="pa-4 rounded bg-grey-lighten-4"
							variant="flat"
						>
							<pre><code>{{ generatedHtml }}</code></pre>
						</VCard>
					</VCol>
				</VRow>
			</VCardText>
		</VCard>
	</VContainer>
</template>

<style scoped>
pre {
	margin: 0;
	white-space: pre-wrap;
	word-break: break-word;
}
</style>
