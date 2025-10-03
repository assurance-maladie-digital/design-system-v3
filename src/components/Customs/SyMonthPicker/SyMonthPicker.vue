<script setup lang="ts">
	import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
	import SyTextField from '../SyTextField/SyTextField.vue'
	import { VMenu, VBtn, VIcon } from 'vuetify/components'
	import dayjs from 'dayjs'
	import customParseFormat from 'dayjs/plugin/customParseFormat'
	import 'dayjs/locale/fr'
	import { mdiCalendar, mdiChevronLeft, mdiChevronRight } from '@mdi/js'

	// Initialiser les plugins dayjs
	dayjs.extend(customParseFormat)
	// Définir la locale française
	dayjs.locale('fr')

	const props = withDefaults(defineProps<{
		modelValue?: string
		label?: string
		placeholder?: string
		format?: string
		required?: boolean
		disabled?: boolean
		readonly?: boolean
		isOutlined?: boolean
		density?: 'default' | 'comfortable' | 'compact'
		hideDetails?: boolean | 'auto'
		bgColor?: string
		displayAsterisk?: boolean
		displayIcon?: boolean
		displayAppendIcon?: boolean
		displayPrependIcon?: boolean
		clearable?: boolean
	}>(), {
		modelValue: undefined,
		label: 'Sélectionner un mois',
		placeholder: 'MM/YYYY',
		format: 'MM/YYYY',
		required: false,
		disabled: false,
		readonly: false,
		isOutlined: true,
		density: 'default',
		hideDetails: false,
		bgColor: 'white',
		displayAsterisk: false,
		displayIcon: true,
		displayAppendIcon: false,
		displayPrependIcon: true,
		clearable: false,
	})

	const emit = defineEmits<{
		(e: 'update:modelValue', value: string | null): void
		(e: 'closed'): void
		(e: 'focus'): void
		(e: 'blur'): void
		(e: 'month-selected', value: string): void
		(e: 'first-day', value: Date): void
		(e: 'last-day', value: Date): void
		(e: 'clear'): void
	}>()

	const isMenuVisible = ref(false)
	const selectedMonth = ref<number | null>(null)
	const selectedYear = ref<number | null>(null)
	const displayFormattedDate = ref('')
	const textFieldRef = ref<InstanceType<typeof SyTextField> | null>(null)
	const errorMessages = ref<string[]>([])

	// Variable pour éviter les mises à jour récursives
	const isUpdatingFromInternal = ref(false)

	// Calculer la date formatée à partir du mois et de l'année sélectionnés
	const formattedDate = computed(() => {
		if (selectedMonth.value === null || selectedYear.value === null) {
			return null
		}

		// Le mois est 0-indexed dans JavaScript, mais nous voulons l'afficher 1-indexed
		const monthValue = selectedMonth.value + 1
		const formattedMonth = monthValue < 10 ? `0${monthValue}` : `${monthValue}`

		return `${formattedMonth}/${selectedYear.value}`
	})

	// Observer les changements du mois et de l'année sélectionnés
	watch([selectedMonth, selectedYear], () => {
		if (selectedMonth.value !== null && selectedYear.value !== null) {
			updateModel()
		}
	}, { deep: true })

	// Observer les changements du modèle
	watch(() => props.modelValue, (newValue) => {
		if (isUpdatingFromInternal.value) return

		if (!newValue) {
			// Si le modèle est vide, réinitialiser les valeurs
			selectedMonth.value = null
			selectedYear.value = null
			displayFormattedDate.value = ''
			return
		}

		try {
			isUpdatingFromInternal.value = true

			// Parse la chaîne au format MM/YYYY
			const parts = newValue.split('/')
			if (parts.length === 2) {
				const month = parseInt(parts[0], 10) - 1 // Convertir en 0-indexed pour JavaScript
				const year = parseInt(parts[1], 10)

				if (!isNaN(month) && !isNaN(year)) {
					selectedMonth.value = month
					selectedYear.value = year
					displayFormattedDate.value = formatDisplayDate(month, year)
				}
			}
		}
		finally {
			setTimeout(() => {
				isUpdatingFromInternal.value = false
			}, 0)
		}
	}, { immediate: true })

	// Calcule le premier jour du mois sélectionné
	const getFirstDayOfMonth = (month: number, year: number): Date => {
		return new Date(year, month, 1)
	}

	// Calcule le dernier jour du mois sélectionné
	const getLastDayOfMonth = (month: number, year: number): Date => {
		// Pour obtenir le dernier jour, on prend le jour 0 du mois suivant (qui est en fait le dernier jour du mois courant)
		return new Date(year, month + 1, 0)
	}

	// Formater une date pour l'affichage dans le range (format court)
	const formatRangeDate = (date: Date): string => {
		return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
	}

	// Mettre à jour le modèle avec la date formatée
	const updateModel = () => {
		const formatted = formattedDate.value

		try {
			isUpdatingFromInternal.value = true

			if (formatted && selectedMonth.value !== null && selectedYear.value !== null) {
				// Mise à jour du modèle principal
				emit('update:modelValue', formatted)
				emit('month-selected', formatted)
				displayFormattedDate.value = formatDisplayDate(selectedMonth.value, selectedYear.value)

				// Émettre les événements pour le premier et dernier jour du mois
				const firstDay = getFirstDayOfMonth(selectedMonth.value, selectedYear.value)
				const lastDay = getLastDayOfMonth(selectedMonth.value, selectedYear.value)

				emit('first-day', firstDay)
				emit('last-day', lastDay)
			}
			else {
				emit('update:modelValue', null)
				displayFormattedDate.value = ''
			}
		}
		finally {
			setTimeout(() => {
				isUpdatingFromInternal.value = false
			}, 0)
		}
	}

	// Formater la date pour l'affichage
	const formatDisplayDate = (month: number, year: number) => {
		// Créer une date au 1er jour du mois sélectionné
		const date = new Date(year, month, 1)
		// Formater avec le nom du mois et l'année (ex: Janvier 2023)
		return dayjs(date).format('MMMM YYYY')
	}

	// Gestionnaire pour sélectionner un mois
	const selectMonth = (monthIndex: number) => {
		selectedMonth.value = monthIndex

		// Si l'année n'est pas définie, utiliser l'année courante
		if (selectedYear.value === null) {
			selectedYear.value = new Date().getFullYear()
		}

		// Mettre à jour le modèle immédiatement
		updateModel()
	}

	// Fonctions de navigation pour les années
	const previousYear = () => {
		if (selectedYear.value === null) {
			selectedYear.value = new Date().getFullYear() - 1
		}
		else {
			selectedYear.value -= 1
		}

		// Mettre à jour le modèle si un mois est déjà sélectionné
		if (selectedMonth.value !== null) {
			updateModel()
		}
	}

	const nextYear = () => {
		if (selectedYear.value === null) {
			selectedYear.value = new Date().getFullYear() + 1
		}
		else {
			selectedYear.value += 1
		}

		// Mettre à jour le modèle si un mois est déjà sélectionné
		if (selectedMonth.value !== null) {
			updateModel()
		}
	}

	// Fonction pour obtenir le nom du mois - utilise formatDisplayDate mais n'affiche que le mois
	const getMonthName = (monthIndex: number) => {
		// Créer une date pour le premier jour du mois spécifié
		const date = new Date(2000, monthIndex, 1)
		// Retourner uniquement le nom du mois dans la langue locale (sans l'année)
		return dayjs(date).format('MMMM')
	}

	// Ouvrir le menu de sélection
	const openPicker = () => {
		if (props.disabled || props.readonly) return
		isMenuVisible.value = true
	}

	// Fermer le menu de sélection sans validation
	const closePicker = () => {
		isMenuVisible.value = false
		emit('closed')
	}

	// Fermer le menu avec confirmation et validation
	const confirmPicker = () => {
		isMenuVisible.value = false
		emit('closed')
		validateField()
	}

	// Fermer le menu avec annulation (ne pas valider la sélection)
	const cancelPicker = () => {
		isMenuVisible.value = false
		emit('closed')
	}

	// Effacer la sélection et réinitialiser le composant
	const clearSelection = () => {
		selectedMonth.value = null
		selectedYear.value = null
		displayFormattedDate.value = ''
		emit('update:modelValue', null)
		emit('month-selected', '')
		emit('clear')
		emit('closed')
	}

	// Gestionnaire de clic en dehors du menu
	const handleClickOutside = (event: MouseEvent) => {
		if (!isMenuVisible.value) return

		const target = event.target as HTMLElement
		const container = target.closest('.month-picker-container')

		if (!container) {
			cancelPicker() // On ferme sans valider lors d'un clic en dehors
		}
	}

	// Validation du champ
	const validateField = () => {
		errorMessages.value = []

		if (props.required && formattedDate.value === null) {
			errorMessages.value.push('Ce champ est requis')
		}

		return errorMessages.value.length === 0
	}

	// Gérer le focus sur le champ
	const handleFocus = () => {
		emit('focus')
	}

	// Gérer la perte de focus
	const handleBlur = () => {
		emit('blur')
		validateField()
	}

	// Gestionnaire d'événement clavier
	const handleKeydown = (event: KeyboardEvent) => {
		if (props.readonly) return

		// Ouvrir le menu avec la touche Entrée
		if (event.key === 'Enter' && !isMenuVisible.value) {
			openPicker()
			event.preventDefault()
		}
		// Fermer le menu avec la touche Escape
		else if ((event.key === 'Escape' || event.key === 'Esc') && isMenuVisible.value) {
			if (formattedDate.value) {
				confirmPicker()
			}
			else {
				cancelPicker()
			}
			event.preventDefault()
		}
		// Effacer avec Escape quand le menu n'est pas visible et que le champ est clearable
		else if ((event.key === 'Escape' || event.key === 'Esc') && !isMenuVisible.value && props.clearable && (selectedMonth.value !== null || selectedYear.value !== null)) {
			clearSelection()
			event.preventDefault()
		}
	}

	// Ajouter l'écouteur de clic en dehors au montage
	onMounted(() => {
		document.addEventListener('click', handleClickOutside)

		// Initialiser l'affichage formaté si une valeur est définie
		if (props.modelValue) {
			const parts = props.modelValue.split('/')
			if (parts.length === 2) {
				const month = parseInt(parts[0], 10) - 1
				const year = parseInt(parts[1], 10)

				if (!isNaN(month) && !isNaN(year)) {
					displayFormattedDate.value = formatDisplayDate(month, year)
				}
			}
		}
	})

	// Nettoyer les écouteurs au démontage
	onBeforeUnmount(() => {
		document.removeEventListener('click', handleClickOutside)
	})

	// Fonctions exposées
	defineExpose({
		validateField,
		openPicker,
		closePicker,
		confirmPicker,
		cancelPicker,
		clearSelection,
		getFirstDayOfMonth,
		getLastDayOfMonth,
	})

	// Récupérer le label avec astérisque si nécessaire
	const labelWithAsterisk = computed(() => {
		return props.displayAsterisk && props.required ? `${props.label} *` : props.label
	})

	// Classes pour le message d'erreur
	const getMessageClasses = computed(() => ({
		'dp-width': true,
		'v-messages__message--error': errorMessages.value.length > 0,
	}))
</script>

<template>
	<div class="month-picker-container">
		<VMenu
			v-model="isMenuVisible"
			activator="parent"
			:min-width="0"
			location="bottom"
			:close-on-content-click="false"
			:open-on-click="false"
			scroll-strategy="reposition"
			transition="fade-transition"
			attach="body"
			:offset="[-20, 5]"
		>
			<template #activator="{ props: menuProps }">
				<SyTextField
					v-bind="menuProps"
					ref="textFieldRef"
					v-model="displayFormattedDate"
					:class="getMessageClasses"
					:append-icon="displayIcon && displayAppendIcon ? 'calendar' : undefined"
					:prepend-icon="displayIcon && displayPrependIcon ? 'calendar' : undefined"
					:append-inner-icon="props.clearable && displayFormattedDate ? 'close' : undefined"
					:error-messages="errorMessages"
					:disabled="props.disabled"
					:readonly="true"
					:label="labelWithAsterisk || ''"
					:placeholder="props.placeholder"
					:bg-color="props.bgColor"
					:outlined="props.isOutlined"
					:density="props.density"
					:hide-details="props.hideDetails"
					@click:append-inner="clearSelection"
					@click="openPicker"
					@focus="handleFocus"
					@blur="handleBlur"
					@keydown="handleKeydown"
				>
					<template #append>
						<div
							v-if="displayIcon && displayAppendIcon"
							class="calendar-icon"
							role="button"
							aria-label="Ouvrir le sélecteur de mois"
							tabindex="0"
							@click.stop="openPicker"
							@keydown.enter="openPicker"
						>
							<VIcon :icon="mdiCalendar" />
						</div>
					</template>
					<template #prepend>
						<div
							v-if="displayIcon && displayPrependIcon"
							class="calendar-icon"
							role="button"
							aria-label="Ouvrir le sélecteur de mois"
							tabindex="0"
							@click.stop="openPicker"
							@keydown.enter="openPicker"
						>
							<VIcon :icon="mdiCalendar" />
						</div>
					</template>
				</SyTextField>
			</template>

			<div class="sy-month-picker-panel">
				<div class="sy-month-picker-header">
					<VBtn
						variant="text"
						size="small"
						:icon="mdiChevronLeft"
						aria-label="Année précédente"
						@click.stop="previousYear"
					/>
					<span class="sy-month-picker-year">{{ selectedYear || new Date().getFullYear() }}</span>
					<VBtn
						variant="text"
						size="small"
						:icon="mdiChevronRight"
						aria-label="Année suivante"
						@click.stop="nextYear"
					/>
				</div>
				<div class="sy-month-picker-months">
					<button
						v-for="(month, index) in 12"
						:key="index"
						:class="[{
							'sy-month-active': selectedMonth === index
						}, 'sy-month-btn']"
						type="button"
						@click.stop="selectMonth(index)"
					>
						{{ getMonthName(index) }}
					</button>
				</div>

				<!-- Affichage des dates de début et fin du mois -->
				<div
					v-if="selectedMonth !== null && selectedYear !== null"
					class="sy-month-range"
				>
					<div class="sy-month-range-item">
						<span class="sy-month-range-label">Premier jour:</span>
						<span class="sy-month-range-date">
							{{ formatRangeDate(getFirstDayOfMonth(selectedMonth, selectedYear)) }}
						</span>
					</div>
					<div class="sy-month-range-item">
						<span class="sy-month-range-label">Dernier jour:</span>
						<span class="sy-month-range-date">
							{{ formatRangeDate(getLastDayOfMonth(selectedMonth, selectedYear)) }}
						</span>
					</div>
				</div>
			</div>

			<div class="month-picker-actions">
				<VBtn
					v-if="props.clearable && (selectedMonth !== null || selectedYear !== null)"
					variant="text"
					color="error"
					aria-label="Effacer la sélection"
					@click.stop="clearSelection"
				>
					Effacer
				</VBtn>
				<div class="spacer" />
				<VBtn
					variant="text"
					color="primary"
					@click.stop="confirmPicker"
				>
					Confirmer
				</VBtn>
				<VBtn
					variant="text"
					@click.stop="cancelPicker"
				>
					Annuler
				</VBtn>
			</div>
		</VMenu>
	</div>
</template>

<style lang="scss" scoped>
.month-picker-container {
	width: 100%;
	position: relative;
}

.calendar-icon {
	cursor: pointer;
}

.month-picker-actions {
	display: flex;
	justify-content: flex-end;
	padding: 8px 16px;
	border-top: 1px solid rgb(0 0 0 / 12%);
}

.spacer {
	flex-grow: 1;
}

.sy-month-picker-panel {
	padding: 16px;
	background-color: white;
	max-width: 320px;
}

.sy-month-picker-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 16px;
}

.sy-month-picker-year {
	font-size: 1.25rem;
	font-weight: 500;
}

.sy-year-nav-btn {
	border: none;
	background: none;
	cursor: pointer;
	color: rgb(0 0 0 / 87%);
	border-radius: 50%;
	width: 36px;
	height: 36px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.sy-year-nav-btn:hover {
	background-color: rgb(0 0 0 / 4%);
}

.sy-month-picker-months {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 8px;
}

.sy-month-btn {
	padding: 8px 12px;
	border: none;
	background: none;
	cursor: pointer;
	border-radius: 4px;
	text-align: center;
	font-size: 0.875rem;
}

.sy-month-btn:hover {
	background-color: rgba(var(--v-theme-primary), 0.14);
}

.sy-month-active {
	background-color: rgba(var(--v-theme-primary), 1) !important;
	color: white !important;
	font-weight: 600;
	z-index: 1;
	position: relative;
}

.sy-month-active:hover {
	background-color: var(--v-theme-primary-darken-1, #1565c0);
	color: white !important;
}

.sy-month-range {
	margin-top: 12px;
	padding-top: 8px;
	border-top: 1px solid rgb(0 0 0 / 12%);
	font-size: 0.875rem;
}

.sy-month-range-item {
	display: flex;
	justify-content: space-between;
	margin-bottom: 4px;
}

.sy-month-range-item:last-child {
	margin-bottom: 0;
}

.sy-month-range-label {
	color: rgb(0 0 0 / 60%);
}

.sy-month-range-date {
	font-weight: 500;
}

:deep(.v-picker__title) {
	display: none;
}

:deep(.v-date-picker-month) {
	cursor: pointer;
}

.dp-width {
	width: 100%;
}
</style>
