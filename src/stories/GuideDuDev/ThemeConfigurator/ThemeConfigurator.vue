<script setup lang="ts">
	import { computed, reactive, ref, watch } from 'vue'
	import { VBtn, VDefaultsProvider, VThemeProvider } from 'vuetify/components'
	import SyAlert from '@/components/SyAlert/SyAlert.vue'
	import SyCheckbox from '@/components/Customs/SyCheckbox/SyCheckbox.vue'
	import SyRadioGroup from '@/components/Customs/SyRadioGroup/SyRadioGroup.vue'
	import SySelect from '@/components/Customs/Selects/SySelect/SySelect.vue'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
	import { checkThemeConfig } from '@/vuetifyOptions'
	import { getFieldsDefaults, getFocusVariables } from '@/themeConfig/applyThemeConfig'
	import {
		FIELD_DENSITIES,
		FIELD_VARIANTS,
		FOCUS_COLORS,
		FOCUS_OFFSET_MAX,
		FOCUS_OFFSET_MIN,
		FOCUS_WIDTH_MAX,
		FOCUS_WIDTH_MIN,
		SYNAPSE_BRANDS,
		defaultThemeConfig,
	} from '@/themeConfig/constants'
	import { resolveThemeConfig } from '@/themeConfig/resolveThemeConfig'
	import type { SynapseThemeConfigInput } from '@/themeConfig/types'

	const brandLabels: Record<string, string> = { cnam: 'CNAM', pa: 'Portail Agent', ap: 'Amelipro' }
	const focusColorLabels: Record<string, string> = { primary: 'Couleur principale (primary)', pinkDarken20: 'Rose foncé (pinkDarken20)' }
	const variantLabels: Record<string, string> = { outlined: 'Contour (outlined)', filled: 'Rempli (filled)', underlined: 'Souligné (underlined)' }
	const densityLabels: Record<string, string> = { default: 'Standard (default)', comfortable: 'Confortable (comfortable)', compact: 'Compacte (compact)' }

	const toOptions = (values: readonly string[], labels: Record<string, string>) =>
		values.map(value => ({ label: labels[value] ?? value, value }))

	// Valeurs saisies : les nombres restent des chaînes pour que la validation signale une saisie invalide
	const form = reactive({
		brand: defaultThemeConfig.brand as string,
		focusWidth: String(defaultThemeConfig.focus.width),
		focusOffset: String(defaultThemeConfig.focus.offset),
		focusColor: defaultThemeConfig.focus.color as string,
		customizeFields: false,
		fieldsVariant: defaultThemeConfig.fields.variant as string,
		fieldsDensity: defaultThemeConfig.fields.density as string,
	})

	const toNumber = (value: string): number | string => {
		const parsed = Number(value)
		return value.trim() !== '' && Number.isFinite(parsed) ? parsed : value
	}

	// Configuration produite, limitée aux réglages qui diffèrent des valeurs par défaut
	const themeConfig = computed(() => {
		const config: Record<string, unknown> = {}
		const focus: Record<string, unknown> = {}

		if (form.brand !== defaultThemeConfig.brand) config.brand = form.brand

		const width = toNumber(form.focusWidth)
		const offset = toNumber(form.focusOffset)
		if (width !== defaultThemeConfig.focus.width) focus.width = width
		if (offset !== defaultThemeConfig.focus.offset) focus.offset = offset
		if (form.focusColor !== defaultThemeConfig.focus.color) focus.color = form.focusColor
		if (Object.keys(focus).length) config.focus = focus

		if (form.customizeFields) {
			config.fields = { variant: form.fieldsVariant, density: form.fieldsDensity }
		}

		return config
	})

	const validation = computed(() => checkThemeConfig(themeConfig.value))
	const errors = computed(() => validation.value.issues.filter(issue => issue.level === 'error'))
	const warnings = computed(() => validation.value.issues.filter(issue => issue.level === 'warning'))

	// Rendu appliqué : un réglage refusé reprend sa valeur par défaut, comme dans createVuetifyOptions
	const resolved = computed(() => resolveThemeConfig(themeConfig.value as SynapseThemeConfigInput, validation.value.issues))

	const previewDefaults = computed(() => form.customizeFields ? getFieldsDefaults(resolved.value.fields) : {})
	const previewStyle = computed(() => Object.fromEntries(
		Object.entries(getFocusVariables(resolved.value.focus)).map(([name, value]) => [`--v-${name}`, value]),
	))

	const configJson = computed(() => JSON.stringify(themeConfig.value, null, 2))
	const usageCode = computed(() => `import { createVuetify } from 'vuetify'
import { createVuetifyOptions } from '@cnamts/synapse/vuetifyOptions'
import themeConfig from './synapse.theme.json'

app.use(createVuetify(createVuetifyOptions(themeConfig)))`)

	const copied = ref(false)
	watch(configJson, () => {
		copied.value = false
	})
	async function copyConfig(): Promise<void> {
		if (typeof navigator === 'undefined' || !navigator.clipboard) return
		await navigator.clipboard.writeText(configJson.value)
		copied.value = true
	}

	const previewText = ref('')
	const previewSelect = ref(null)
	const previewDate = ref(null)
	const selectItems = ['Option 1', 'Option 2', 'Option 3']
</script>

<template>
	<div class="theme-configurator">
		<section
			class="theme-configurator__settings"
			aria-labelledby="theme-configurator-settings-title"
		>
			<h2
				id="theme-configurator-settings-title"
				class="text-h6 mb-4"
			>
				Réglages
			</h2>

			<SyRadioGroup
				v-model="form.brand"
				label="Marque"
				:options="toOptions(SYNAPSE_BRANDS, brandLabels)"
				hide-details
				class="mb-6"
			/>

			<fieldset class="theme-configurator__group mb-6">
				<legend class="text-subtitle-1 font-weight-bold mb-2">
					Anneau de focus
				</legend>
				<SyTextField
					v-model="form.focusWidth"
					label="Épaisseur (px)"
					type="number"
					:help-text="`Entre ${FOCUS_WIDTH_MIN} et ${FOCUS_WIDTH_MAX} px`"
					class="mb-2"
				/>
				<SyTextField
					v-model="form.focusOffset"
					label="Écart des boutons (px)"
					type="number"
					:help-text="`Entre ${FOCUS_OFFSET_MIN} et ${FOCUS_OFFSET_MAX} px`"
					class="mb-2"
				/>
				<SyRadioGroup
					v-model="form.focusColor"
					label="Couleur"
					:options="toOptions(FOCUS_COLORS, focusColorLabels)"
					hide-details
				/>
			</fieldset>

			<fieldset class="theme-configurator__group">
				<legend class="text-subtitle-1 font-weight-bold mb-2">
					Champs de formulaire
				</legend>
				<SyCheckbox
					v-model="form.customizeFields"
					label="Personnaliser les champs"
					hide-details
				/>
				<template v-if="form.customizeFields">
					<SyRadioGroup
						v-model="form.fieldsVariant"
						label="Style"
						:options="toOptions(FIELD_VARIANTS, variantLabels)"
						hide-details
						class="mt-4"
					/>
					<SyRadioGroup
						v-model="form.fieldsDensity"
						label="Densité"
						:options="toOptions(FIELD_DENSITIES, densityLabels)"
						hide-details
						class="mt-4"
					/>
				</template>
			</fieldset>
		</section>

		<section
			class="theme-configurator__result"
			aria-labelledby="theme-configurator-preview-title"
		>
			<h2
				id="theme-configurator-preview-title"
				class="text-h6 mb-2"
			>
				Aperçu
			</h2>
			<p class="text-body-2 mb-4">
				Naviguez avec la touche Tab pour voir l'anneau de focus.
			</p>

			<VThemeProvider
				:theme="resolved.brand"
				with-background
				class="theme-configurator__preview"
			>
				<VDefaultsProvider :defaults="previewDefaults">
					<div
						class="pa-4"
						:style="previewStyle"
					>
						<SyTextField
							v-model="previewText"
							label="Nom de l'assuré"
						/>
						<SySelect
							v-model="previewSelect"
							label="Motif"
							:items="selectItems"
						/>
						<DatePicker
							v-model="previewDate"
							label="Date de naissance"
							format="DD/MM/YYYY"
						/>
						<div class="d-flex flex-wrap align-center ga-4 mt-2">
							<VBtn color="primary">
								Valider
							</VBtn>
							<VBtn
								color="primary"
								variant="outlined"
							>
								Annuler
							</VBtn>
							<a href="#theme-configurator-code-title">Voir la configuration</a>
						</div>
					</div>
				</VDefaultsProvider>
			</VThemeProvider>

			<h2 class="text-h6 mt-6 mb-2">
				Validation
			</h2>
			<div class="mb-6">
				<SyAlert
					v-if="validation.valid && !warnings.length"
					type="success"
					role="status"
				>
					Configuration valide.
				</SyAlert>
				<SyAlert
					v-for="issue in errors"
					:key="`error-${issue.path}`"
					type="error"
					role="status"
					class="mb-2"
				>
					Réglage refusé, valeur par défaut appliquée : {{ issue.message }}
				</SyAlert>
				<SyAlert
					v-for="issue in warnings"
					:key="`warning-${issue.path}`"
					type="warning"
					role="status"
					class="mb-2"
				>
					{{ issue.message }}
				</SyAlert>
			</div>

			<h2
				id="theme-configurator-code-title"
				class="text-h6 mb-2"
			>
				Configuration
			</h2>
			<p class="text-body-2 mb-2">
				Fichier <code>synapse.theme.json</code> (seuls les réglages modifiés y figurent) :
			</p>
			<pre class="theme-configurator__code"><code>{{ configJson }}</code></pre>
			<VBtn
				class="mt-2 mb-4"
				variant="outlined"
				color="primary"
				@click="copyConfig"
			>
				{{ copied ? 'Configuration copiée' : 'Copier la configuration' }}
			</VBtn>
			<p class="text-body-2 mb-2">
				Utilisation :
			</p>
			<pre class="theme-configurator__code"><code>{{ usageCode }}</code></pre>
		</section>
	</div>
</template>

<style scoped lang="scss">
.theme-configurator {
	display: grid;
	grid-template-columns: minmax(0, 1fr);
	gap: 32px;
}

@media (width >= 960px) {
	.theme-configurator {
		grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
	}
}

.theme-configurator__group {
	border: 0;
	padding: 0;
	margin-inline: 0;
	min-inline-size: 0;
}

.theme-configurator__preview {
	border: 1px solid rgba(var(--v-theme-on-surface), 0.2);
	border-radius: 4px;
}

.theme-configurator__code {
	overflow-x: auto;
	padding: 16px;
	border-radius: 4px;
	background: rgb(var(--v-theme-on-surface));
	color: rgb(var(--v-theme-surface));
	font-size: 0.875rem;
	white-space: pre;
}
</style>
