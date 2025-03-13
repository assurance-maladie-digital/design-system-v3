<script lang="ts" setup>
	import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import DateTextInput from './DateTextInput.vue'
	import { VDatePicker } from 'vuetify/components'
	import { useFieldValidation } from '@/composables/rules/useFieldValidation'
	import type { RuleOptions } from '@/composables/rules/useFieldValidation'

	type DateValue = string | [string, string] | null
	type DateInput = string | string[] | null | object

	const props = withDefaults(defineProps<{
		modelValue?: DateInput
		placeholder?: string
		format?: string
		dateFormatReturn?: string
		isBirthDate?: boolean
		showWeekNumber?: boolean
		required?: boolean
		displayRange?: boolean
		displayIcon?: boolean
		displayAppendIcon?: boolean
		displayPrependIcon?: boolean
		customRules?: { type: string, options: RuleOptions }[]
		customWarningRules?: { type: string, options: RuleOptions }[]
		isDisabled?: boolean
		noIcon?: boolean
		noCalendar?: boolean
		isOutlined?: boolean
		isReadOnly?: boolean
		width?: string
	}>(), {
		modelValue: undefined,
		placeholder: 'Sélectionner une date',
		format: 'DD/MM/YYYY',
		dateFormatReturn: '',
		isBirthDate: false,
		showWeekNumber: false,
		required: false,
		displayRange: false,
		displayIcon: true,
		displayAppendIcon: false,
		displayPrependIcon: true,
		customRules: () => [],
		customWarningRules: () => [],
		isDisabled: false,
		noIcon: false,
		noCalendar: false,
		isOutlined: true,
		isReadOnly: false,
		width: '100%',
	})

	const emit = defineEmits<{
		(e: 'update:modelValue', value: DateValue): void
		(e: 'closed'): void
		(e: 'focus'): void
		(e: 'blur'): void
	}>()

	// Fonction pour parser les dates selon le format spécifié
	const parseDate = (dateString: string, format: string = props.format): Date | null => {
		if (!dateString) return null

		// Créer un mapping des positions des éléments de date selon le format
		const separator = format.includes('/') ? '/' : format.includes('-') ? '-' : '.'
		const parts = format.split(separator)
		const dateParts = dateString.split(separator)

		if (parts.length !== dateParts.length) return null

		let day = 0, month = 0, year = 0

		// Extraire les valeurs selon leur position dans le format
		parts.forEach((part, index) => {
			const value = parseInt(dateParts[index], 10)
			if (isNaN(value)) return

			if (part.includes('DD') || part.includes('D')) day = value
			else if (part.includes('MM') || part.includes('M')) month = value - 1 // Les mois en JS sont 0-indexés
			else if (part.includes('YYYY')) year = value
			else if (part.includes('YY')) {
				// Gestion intelligente des années à 2 chiffres
				// Si l'année est < 50, on considère qu'elle est dans le 21ème siècle
				// Sinon, elle est dans le 20ème siècle
				year = value < 50 ? 2000 + value : 1900 + value
			}
		})

		// Vérifier que nous avons toutes les parties nécessaires et qu'elles sont dans des plages valides
		if (day < 1 || day > 31 || month < 0 || month > 11 || year < 1000 || year > 9999) return null

		// Créer la date à midi (12:00) pour éviter les problèmes de décalage de fuseau horaire
		// Cela garantit que la date reste la même lors de la conversion en UTC
		const date = new Date(year, month, day, 12, 0, 0)

		// Vérifier que la date est valide (par exemple, 31 février n'existe pas)
		if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) return null

		return date
	}

	function initializeSelectedDates(
		modelValue: DateInput | null,
	): Date | Date[] | null {
		if (!modelValue) return null

		// Déterminer le format à utiliser pour l'analyse
		const parseFormat = props.dateFormatReturn || props.format

		if (Array.isArray(modelValue)) {
			if (modelValue.length >= 2) {
				// Essayer d'abord avec le format de retour, puis avec le format d'affichage
				let dates = [parseDate(modelValue[0], parseFormat), parseDate(modelValue[1], parseFormat)]

				// Si l'une des dates est invalide avec le format de retour, essayer avec le format d'affichage
				if (dates.some(date => date === null) && props.dateFormatReturn) {
					dates = [parseDate(modelValue[0], props.format), parseDate(modelValue[1], props.format)]
				}

				// Vérifie si l'une des dates est toujours invalide
				if (dates.some(date => date === null)) {
					return []
				}

				// Vérifie si la première date est après la seconde
				if (dates[0] && dates[1] && dates[0] > dates[1]) {
					return []
				}

				// Filtrer les dates nulles et convertir en tableau de Date
				return dates.filter((date): date is Date => date !== null)
			}

			if (modelValue.length === 1) {
				// Essayer d'abord avec le format de retour, puis avec le format d'affichage
				let date = parseDate(modelValue[0], parseFormat)

				// Si la date est invalide avec le format de retour, essayer avec le format d'affichage
				if (date === null && props.dateFormatReturn) {
					date = parseDate(modelValue[0], props.format)
				}

				return date === null ? [] : [date]
			}

			return []
		}

		// Si modelValue est un objet, on le convertit en chaîne
		if (typeof modelValue === 'object') {
			return null
		}

		// Essayer d'abord avec le format de retour, puis avec le format d'affichage
		let date = parseDate(modelValue, parseFormat)

		// Si la date est invalide avec le format de retour, essayer avec le format d'affichage
		if (date === null && props.dateFormatReturn) {
			date = parseDate(modelValue, props.format)
		}

		return date === null ? null : date
	}

	// Utilisation de la fonction pour initialiser `selectedDates`
	const selectedDates = ref<Date | Date[] | null>(
		initializeSelectedDates(props.modelValue as DateInput | null),
	)

	const isDatePickerVisible = ref(false)
	const errorMessages = ref<string[]>([])
	const successMessages = ref<string[]>([])
	const warningMessages = ref<string[]>([])
	const displayFormattedDate = ref('')

	const textInputValue = ref<string>('')

	// Variable pour éviter les mises à jour récursives
	const isUpdatingFromInternal = ref(false)

	// Déclaration des règles de validation
	type Rule = { type: string, options: RuleOptions }
	const customRules = ref<Rule[]>(props.customRules || [])
	const customWarningRules = ref<Rule[]>(props.customWarningRules || [])

	const { generateRules } = useFieldValidation()
	const validationRules = generateRules(customRules.value)
	const warningValidationRules = generateRules(customWarningRules.value)

	// Déclaration de la fonction validateDates avant son utilisation
	const validateDates = (forceValidation = false) => {
		// Réinitialiser tous les messages
		errorMessages.value = []
		successMessages.value = []
		warningMessages.value = []

		if (props.noCalendar) {
			// En mode no-calendar, on délègue la validation au DateTextInput
			return
		}

		// Vérifier si le champ est requis et vide
		// Si forceValidation est true, on ignore les conditions de validation interactive
		if ((forceValidation || !isUpdatingFromInternal.value) && props.required && (!selectedDates.value || (Array.isArray(selectedDates.value) && selectedDates.value.length === 0))) {
			errorMessages.value.push('La date est requise.')
			return
		}

		if (!selectedDates.value) return

		// Préparer les dates à valider
		const datesToValidate = Array.isArray(selectedDates.value)
			? selectedDates.value
			: [selectedDates.value]

		// Collecter tous les messages
		const allErrors: string[] = []
		const allWarnings: string[] = []
		const allSuccess: string[] = []

		// Appliquer les règles de validation
		datesToValidate.forEach((date) => {
			// Appliquer d'abord les règles de validation standard
			validationRules.forEach((rule) => {
				const result = rule(date)
				if (result?.error) allErrors.push(result.error)
				else if (result?.success) allSuccess.push(result.success)
			})

			// Ensuite appliquer les règles d'avertissement
			warningValidationRules.forEach((rule) => {
				const result = rule(date)
				if (result?.warning) allWarnings.push(result.warning)
				else if (result?.success && !allErrors.length) allSuccess.push(result.success)
			})
		})

		// Dédoublonner et assigner les messages
		errorMessages.value = [...new Set(allErrors)]
		warningMessages.value = [...new Set(allWarnings)]
		successMessages.value = [...new Set(allSuccess)]
	}

	// Fonction centralisée pour mettre à jour le modèle
	const updateModel = (value: DateValue) => {
		// Éviter les mises à jour inutiles
		if (JSON.stringify(value) === JSON.stringify(props.modelValue)) return

		try {
			isUpdatingFromInternal.value = true
			emit('update:modelValue', value)
		}
		finally {
			// S'assurer que le flag est toujours réinitialisé
			setTimeout(() => {
				isUpdatingFromInternal.value = false
			}, 0)
		}
	}

	// Watcher pour mettre à jour le modèle lorsque les dates sélectionnées changent
	watch(selectedDates, (newValue) => {
		// Valider les dates
		validateDates()

		// Mettre à jour le modèle si nécessaire
		if (newValue !== null) {
			updateModel(formattedDate.value)

			// Mettre à jour textInputValue pour le DateTextInput
			try {
				isUpdatingFromInternal.value = true
				if (Array.isArray(newValue)) {
					// Pour les plages de dates, utiliser la première date
					if (newValue.length > 0) {
						textInputValue.value = formatDate(newValue[0], props.format)
					}
				}
				else {
					// Pour une date unique
					textInputValue.value = formatDate(newValue, props.format)
				}
			}
			finally {
				setTimeout(() => {
					isUpdatingFromInternal.value = false
				}, 0)
			}
		}
		else {
			updateModel(null)
			// Réinitialiser textInputValue
			textInputValue.value = ''
		}

		// Gérer la visibilité du date picker
		if (props.displayRange) {
			if (Array.isArray(newValue) && newValue.length >= 2) {
				isDatePickerVisible.value = false
				emit('closed')
			}
		}
		else {
			isDatePickerVisible.value = false
			emit('closed')
		}
	})

	const getMessageClasses = () => ({
		'dp-width': true,
		'v-messages__message--success': successMessages.value.length > 0,
		'v-messages__message--error': errorMessages.value.length > 0,
		'v-messages__message--warning': warningMessages.value.length > 0 && errorMessages.value.length < 1,
	})

	const inputStyle = computed(() => ({
		'min-width': '100%',
	}))

	// Formate une date unique au format spécifié
	const formatDate = (date: Date, format: string): string => {
		if (!date) return ''

		// Formats de base
		const day = date.getDate().toString().padStart(2, '0')
		const month = (date.getMonth() + 1).toString().padStart(2, '0')
		const year = date.getFullYear().toString()
		const shortYear = year.slice(-2)

		// Formats sans padding
		const dayNoPad = date.getDate().toString()
		const monthNoPad = (date.getMonth() + 1).toString()

		// Remplacer les tokens dans l'ordre correct (du plus spécifique au moins spécifique)
		let result = format
			.replace(/YYYY/g, year)
			.replace(/YY/g, shortYear)
			.replace(/MM/g, month)
			.replace(/M/g, monthNoPad)
			.replace(/DD/g, day)
			.replace(/D/g, dayNoPad)

		return result
	}

	// Date(s) formatée(s) en chaîne de caractères pour la valeur de retour
	const formattedDate = computed<DateValue>(() => {
		if (!selectedDates.value) return ''

		const returnFormat = props.dateFormatReturn || props.format

		if (Array.isArray(selectedDates.value)) {
			if (selectedDates.value.length >= 2) {
				return [
					formatDate(selectedDates.value[0], returnFormat),
					formatDate(selectedDates.value[1], returnFormat),
				] as [string, string]
			}
			return ''
		}

		return formatDate(selectedDates.value, returnFormat)
	})

	watch(formattedDate, (newValue) => {
		if (!newValue || newValue === '') {
			textInputValue.value = ''
		}
		else if (typeof newValue === 'string') {
			// Si on a un format de retour différent, on doit convertir la date
			if (props.dateFormatReturn) {
				const date = parseDate(newValue, props.dateFormatReturn)
				if (date) {
					textInputValue.value = formatDate(date, props.format)
				}
			}
			else {
				textInputValue.value = newValue
			}
		}
	}, { immediate: true })

	watch(textInputValue, (newValue) => {
		// Éviter les mises à jour récursives
		if (isUpdatingFromInternal.value) return

		// Parse la date avec le format d'affichage
		const date = parseDate(newValue, props.format)
		if (date) {
			// Si on a un format de retour, formater la date dans ce format
			const formattedValue = props.dateFormatReturn
				? formatDate(date, props.dateFormatReturn)
				: formatDate(date, props.format)
			updateModel(formattedValue)

			// Mettre à jour selectedDates sans déclencher de watchers supplémentaires
			try {
				isUpdatingFromInternal.value = true
				selectedDates.value = date
				// Mettre à jour l'affichage formaté
				displayFormattedDate.value = formatDate(date, props.format)
			}
			finally {
				setTimeout(() => {
					isUpdatingFromInternal.value = false
				}, 0)
			}
		}
		else if (newValue) {
			// Même si la date n'est pas valide, conserver la valeur saisie
			// pour éviter que la date ne disparaisse
			updateModel(newValue)
			// Mettre à jour l'affichage formaté pour qu'il corresponde à ce qui est saisi
			try {
				isUpdatingFromInternal.value = true
				displayFormattedDate.value = newValue
			}
			finally {
				setTimeout(() => {
					isUpdatingFromInternal.value = false
				}, 0)
			}
		}
		else {
			updateModel(null)
			// Réinitialiser l'affichage formaté
			try {
				isUpdatingFromInternal.value = true
				displayFormattedDate.value = ''
				selectedDates.value = null
			}
			finally {
				setTimeout(() => {
					isUpdatingFromInternal.value = false
				}, 0)
			}
		}
	})

	// Date(s) formatée(s) en chaîne de caractères pour l'affichage
	const displayFormattedDateComputed = computed(() => {
		if (!selectedDates.value) return null

		if (Array.isArray(selectedDates.value)) {
			if (selectedDates.value.length >= 2) {
				return `${formatDate(selectedDates.value[0], props.format)} - ${formatDate(
					selectedDates.value[selectedDates.value.length - 1],
					props.format,
				)}`
			}
			return formatDate(selectedDates.value[0], props.format)
		}

		return formatDate(selectedDates.value, props.format)
	})

	// const validateDateValue = (value: DateValue): DateValue => {
	// 	if (Array.isArray(value)) {
	// 		if (value.length >= 2) {
	// 			return [value[0], value[1]] as [string, string]
	// 		}
	// 		return value[0] || ''
	// 	}
	// 	return value
	// }

	watch(displayFormattedDateComputed, (newValue) => {
		if (!props.noCalendar && newValue) {
			displayFormattedDate.value = newValue
		}
	})

	const updateSelectedDates = (input: DateValue) => {
		if (Array.isArray(input)) {
			const dates = input
				.map(date => (date ? parseDate(date) : null))
				.filter((date): date is Date => date !== null)

			if (dates.length === 0) {
				selectedDates.value = null
				return
			}

			selectedDates.value = dates
			return
		}

		const date = input ? parseDate(input) : null
		selectedDates.value = date === null ? null : date
	}

	// Gestionnaire de clic en dehors
	const handleClickOutside = (event: MouseEvent) => {
		if (!isDatePickerVisible.value) return

		const target = event.target as HTMLElement
		const container = target.closest('.date-picker-container')

		// Si on clique dans le conteneur du DatePicker, on ne fait rien
		if (container) return
		emit('closed')
		// Déclencher la validation à la fermeture
		validateDates()
	}

	const todayInString = computed(() => {
		return (new Date().toLocaleDateString('fr-FR', {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
		})).replace(/\b\w/g, l => l.toUpperCase())
	})

	// Watcher pour le modelValue pour synchroniser les dates sélectionnées
	watch(() => props.modelValue, (newValue) => {
		// Éviter les mises à jour récursives
		if (isUpdatingFromInternal.value) return

		try {
			isUpdatingFromInternal.value = true

			if (!newValue || newValue === '') {
				// Réinitialiser les valeurs
				selectedDates.value = null
				textInputValue.value = ''
				displayFormattedDate.value = ''
			}
			else {
				// Initialiser les dates sélectionnées
				selectedDates.value = initializeSelectedDates(newValue)

				// Mettre à jour l'affichage
				if (selectedDates.value) {
					displayFormattedDate.value = displayFormattedDateComputed.value || ''
				}
			}

			// Valider les dates
			validateDates()
		}
		finally {
			setTimeout(() => {
				isUpdatingFromInternal.value = false
			}, 0)
		}
	}, { immediate: true })

	onMounted(() => {
		document.addEventListener('click', handleClickOutside)

		// Initialiser l'affichage formaté
		if (displayFormattedDateComputed.value) {
			displayFormattedDate.value = displayFormattedDateComputed.value
		}

		// Valider les dates au montage
		validateDates()
	})

	onBeforeUnmount(() => {
		document.removeEventListener('click', handleClickOutside)
	})

	const dateTextInputRef = ref()

	const validateOnSubmit = () => {
		if (props.noCalendar) {
			return dateTextInputRef.value?.validateOnSubmit()
		}
		// Forcer la validation pour ignorer les conditions de validation interactive
		validateDates(true)
		return errorMessages.value.length === 0
	}

	defineExpose({
		validateOnSubmit,
		isDatePickerVisible,
		selectedDates,
		errorMessages,
		handleClickOutside,
		initializeSelectedDates,
	})

	// Fonction pour améliorer l'accessibilité du DatePicker
	const updateAccessibility = async () => {
		await nextTick()

		// Utiliser des attributs data pour sélectionner les éléments, ce qui est plus stable que les classes CSS
		const datePickerEl = document.querySelector('.v-date-picker')
		if (!datePickerEl) return

		// Ajouter un attribut role="application" au conteneur principal
		datePickerEl.setAttribute('role', 'application')
		datePickerEl.setAttribute('aria-label', 'Sélecteur de date')

		// Sélectionner tous les boutons de navigation
		const navigationButtons = datePickerEl.querySelectorAll('button')

		// Attribuer des labels significatifs basés sur la position ou l'icône
		navigationButtons.forEach((button) => {
			const iconEl = button.querySelector('.v-icon')
			if (!iconEl) return

			// Utiliser le contenu de l'icône pour déterminer sa fonction
			const iconContent = iconEl.textContent || ''
			const iconClasses = iconEl.className || ''

			if (iconClasses.includes('mdi-chevron-left') || iconContent.includes('chevron-left')) {
				button.setAttribute('aria-label', 'Mois précédent')
			}
			else if (iconClasses.includes('mdi-chevron-right') || iconContent.includes('chevron-right')) {
				button.setAttribute('aria-label', 'Mois suivant')
			}
			else if (iconClasses.includes('mdi-chevron-down') || iconContent.includes('chevron-down')
				|| iconClasses.includes('mdi-menu-down') || iconContent.includes('menu-down')) {
				button.setAttribute('aria-label', 'Changer de vue')
			}
		})

		// Ajouter des instructions pour les lecteurs d'écran
		let srOnlyEl = datePickerEl.querySelector('.sr-only-instructions')
		if (!srOnlyEl) {
			srOnlyEl = document.createElement('span')
			srOnlyEl.className = 'sr-only-instructions'
			srOnlyEl.setAttribute('aria-live', 'polite')
			// Utiliser HTMLElement pour accéder aux propriétés de style
			const srOnlyHtmlEl = srOnlyEl as HTMLElement
			srOnlyHtmlEl.style.position = 'absolute'
			srOnlyHtmlEl.style.width = '1px'
			srOnlyHtmlEl.style.height = '1px'
			srOnlyHtmlEl.style.padding = '0'
			srOnlyHtmlEl.style.margin = '-1px'
			srOnlyHtmlEl.style.overflow = 'hidden'
			srOnlyHtmlEl.style.clip = 'rect(0, 0, 0, 0)'
			srOnlyHtmlEl.style.whiteSpace = 'nowrap'
			srOnlyHtmlEl.style.border = '0'
			srOnlyEl.textContent = 'Utilisez les flèches pour naviguer entre les dates et Entrée pour sélectionner une date'

			datePickerEl.prepend(srOnlyEl)
		}
	}

	// Appliquer les améliorations d'accessibilité quand le DatePicker devient visible
	watch(isDatePickerVisible, async (newValue) => {
		if (newValue) {
			await updateAccessibility()
		}
	})

	const handlePrependIconClick = () => {
		isDatePickerVisible.value = true
	}

	const handleAppendIconClick = () => {
		isDatePickerVisible.value = true
	}

	// Fonctions et constantes déjà déclarées plus haut dans le code

	const getIcon = () => {
		if (props.noCalendar) {
			return
		}
		switch (true) {
		case errorMessages.value.length > 0:
			return 'error'
		case warningMessages.value.length > 0:
			return 'warning'
		case successMessages.value.length > 0:
			return 'success'
		default:
			return
		}
	}

	// Watch sur modelValue pour gérer les changements externes
	watch(() => props.modelValue, (newValue) => {
		// Éviter les mises à jour récursives
		if (isUpdatingFromInternal.value) return

		try {
			isUpdatingFromInternal.value = true

			if (!newValue || newValue === '') {
				selectedDates.value = null
				textInputValue.value = ''
				displayFormattedDate.value = ''
			}
			else {
				// Initialiser les dates sélectionnées
				selectedDates.value = initializeSelectedDates(newValue)

				// Mettre à jour l'affichage et le textInputValue
				if (selectedDates.value) {
					if (Array.isArray(selectedDates.value)) {
						if (selectedDates.value.length > 0) {
							textInputValue.value = formatDate(selectedDates.value[0], props.format)
							displayFormattedDate.value = displayFormattedDateComputed.value || ''
						}
					}
					else {
						textInputValue.value = formatDate(selectedDates.value, props.format)
						displayFormattedDate.value = displayFormattedDateComputed.value || ''
					}
				}
			}

			// Valider les dates
			validateDates()
		}
		finally {
			setTimeout(() => {
				isUpdatingFromInternal.value = false
			}, 0)
		}
	}, { immediate: true })
</script>

<template>
	<div
		class="date-picker-container"
		:style="inputStyle"
	>
		<template v-if="props.noCalendar">
			<DateTextInput
				ref="dateTextInputRef"
				v-model="textInputValue"
				:class="[getMessageClasses(), 'label-hidden-on-focus']"
				:date-format-return="props.dateFormatReturn"
				:format="props.format"
				:label="props.placeholder"
				:placeholder="props.placeholder"
				:required="props.required"
				:custom-rules="props.customRules"
				:custom-warning-rules="props.customWarningRules"
				:is-disabled="props.isDisabled"
				:is-read-only="props.isReadOnly"
				:is-outlined="props.isOutlined"
				:display-icon="props.displayIcon"
				:display-append-icon="props.displayAppendIcon"
				:display-prepend-icon="props.displayPrependIcon"
				:no-icon="props.noIcon"
				title="Date text input"
				@focus="emit('focus')"
				@blur="emit('blur')"
			/>
		</template>
		<template v-else>
			<SyTextField
				v-model="displayFormattedDate"
				:append-icon="displayIcon && displayAppendIcon ? 'calendar' : undefined"
				:append-inner-icon="getIcon()"
				:class="[getMessageClasses(), 'label-hidden-on-focus']"
				:error-messages="errorMessages"
				:warning-messages="warningMessages"
				:success-messages="successMessages"
				:is-disabled="props.isDisabled"
				:is-read-only="true"
				:label="props.placeholder"
				:no-icon="props.noIcon"
				:prepend-icon="displayIcon && !displayAppendIcon ? 'calendar' : undefined"
				:variant-style="props.isOutlined ? 'outlined' : 'underlined'"
				color="primary"
				is-clearable
				title="Date Picker"
				@focus="isDatePickerVisible = true"
				@update:model-value="updateSelectedDates"
				@prepend-icon-click="handlePrependIconClick"
				@append-icon-click="handleAppendIconClick"
			/>
		</template>
		<div>
			<VMenu
				v-if="!props.noCalendar"
				v-model="isDatePickerVisible"
				activator="parent"
				:min-width="0"
				location="bottom"
				:close-on-content-click="false"
				:open-on-click="false"
				transition="fade-transition"
				attach="body"
				:offset="[-20, 5]"
			>
				<transition name="fade">
					<VDatePicker
						v-if="isDatePickerVisible && !props.noCalendar"
						v-model="selectedDates"
						:first-day-of-week="1"
						:multiple="props.displayRange ? 'range' : false"
						:show-adjacent-months="true"
						:show-week="props.showWeekNumber"
						:view-mode="props.isBirthDate ? 'year' : 'month'"
						color="primary"
					>
						<template #title>
							Sélectionnez une date
						</template>
						<template #header>
							<h3 class="mx-auto my-auto ml-5 mb-4">
								{{ todayInString }}
							</h3>
						</template>
					</VDatePicker>
				</transition>
			</VMenu>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';

.label-hidden-on-focus:focus + label {
	display: none;
}

.dp-width {
	width: v-bind('props.width');
}

.v-messages__message--success {
	:deep(.v-input__control),
	:deep(.v-messages__message) {
		color: tokens.$colors-text-success !important;

		--v-medium-emphasis-opacity: 1;
	}

	.v-field--active & {
		color: tokens.$colors-border-success !important;
	}
}

.v-messages__message--error {
	:deep(.v-input__control),
	:deep(.v-messages__message) {
		color: tokens.$colors-text-error !important;
	}

	.v-field--active & {
		color: tokens.$colors-border-error !important;
	}
}

.v-messages__message--warning {
	:deep(.v-input__control) {
		color: tokens.$colors-text-warning !important;

		--v-medium-emphasis-opacity: 1;
	}

	:deep(.v-messages__message) {
		color: tokens.$colors-text-warning !important;
	}

	.v-field--active & {
		color: tokens.$colors-text-warning !important;
	}
}

:deep(.v-btn__content) {
	font-size: tokens.$font-size-body-text + 3;
	font-weight: bold;
}

:deep(.v-messages) {
	opacity: 1;
}

:deep(.v-field--dirty) {
	opacity: 1 !important;

	--v-medium-emphasis-opacity: 1;
}

:deep(.v-field--focused) {
	opacity: 1 !important;

	--v-medium-emphasis-opacity: 1;
}

.date-picker-container {
	max-width: 100%;
	position: relative;

	:deep(.v-date-picker) {
		max-width: 445px;
		position: absolute;
		top: 56px;
		left: 0;
		z-index: 2;
		box-shadow:
			0 5px 5px -3px rgb(0 0 0 / 20%),
			0 8px 10px 1px rgb(0 0 0 / 14%),
			0 3px 14px 2px rgb(0 0 0 / 12%) !important;
	}
}

:deep(.v-date-picker-month__day--selected, .v-date-picker-month__day--adjacent) {
	opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
