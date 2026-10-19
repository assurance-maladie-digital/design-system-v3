<script lang="ts" setup>
	import { computed, ref } from 'vue'
	import SyAlert from '@/components/SyAlert/SyAlert.vue'
	import SyForm from '@/components/Customs/SyForm/SyForm.vue'
	import { mdiCheckCircle, mdiCodeJson, mdiEyeOutline, mdiRefresh } from '@mdi/js'

	// Cas de test SyForm isolé : un formulaire, son tableau de bord et ses valeurs.
	// Le parent fournit les champs (slot) et réinitialise ses valeurs sur `reset`.

	const props = defineProps<{
		title: string
		description?: string
		values: Record<string, unknown>
		// Erreurs renvoyées par le serveur (simulé) après un submit valide.
		serverErrors?: string[]
	}>()

	const emit = defineEmits<{
		(e: 'submit', value: { isValid: boolean }): void
		(e: 'reset'): void
	}>()

	const formRef = ref<InstanceType<typeof SyForm> | null>(null)
	const validity = ref<boolean | null>(null)
	const validateOnSubmit = ref(true)
	const lastSubmit = ref<{ isValid: boolean, time: string } | null>(null)
	const resetCount = ref(0)

	// Les File ne sont pas sérialisables : on n'affiche que leur nom.
	const displayedValues = computed(() => JSON.stringify(
		props.values,
		(_key, value: unknown) => (value instanceof File ? value.name : value),
		2,
	))

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

	const isRejectedByServer = computed(() =>
		lastSubmit.value?.isValid === true && (props.serverErrors?.length ?? 0) > 0,
	)

	function handleSubmit(payload: { isValid: boolean }) {
		lastSubmit.value = { isValid: payload.isValid, time: new Date().toLocaleTimeString('fr-FR') }
		emit('submit', payload)
	}

	function handleReset() {
		lastSubmit.value = null
		resetCount.value++
		emit('reset')
	}
</script>

<template>
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
						<slot name="dashboard" />
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
				:type="lastSubmit.isValid && !isRejectedByServer ? 'success' : 'error'"
				variant="tonal"
				closable
				class="mb-4"
				@close="lastSubmit = null"
			>
				Formulaire soumis : <code>isValid = {{ lastSubmit.isValid }}</code>
				<template v-if="isRejectedByServer">
					, puis rejeté par le serveur : {{ serverErrors?.join(' ') }}
				</template>
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
						<VCardItem>
							<VCardTitle class="text-h6">
								{{ title }}
							</VCardTitle>
							<VCardSubtitle
								v-if="description"
								class="description"
							>
								{{ description }}
							</VCardSubtitle>
						</VCardItem>

						<VDivider />

						<VCardText>
							<slot />
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
</template>

<style scoped>
.dashboard-panel {
	position: sticky;
	top: 16px;
}

.description {
	white-space: normal;
}

.values-panel {
	max-height: 360px;
	overflow: auto;
	white-space: pre-wrap;
	word-break: break-word;
}
</style>
