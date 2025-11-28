<!-- eslint-disable no-console -->
<script setup lang="ts">
/* eslint-disable vuejs-accessibility/no-static-element-interactions, vuejs-accessibility/label-has-for */
	import type { ErrorBucket, Registrable } from './types'
	import type { ErrorMessages, ValidationRule } from '@/utils/rules/types'
	import {
		computed,
		getCurrentInstance,
		inject,
		nextTick,
		onBeforeUnmount,
		onMounted,
		type PropType,
		ref,
		watch,
	} from 'vue'
	import {
		fileUploadDuplicationRule,
		fileUploadFormatRule,
		fileUploadMaxFileNumberRule,
	} from '@/utils/amelipro/rules/uploadFile'
	import AmeliproChips from '../AmeliproChips/AmeliproChips.vue'
	import AmeliproIcon from '../AmeliproIcon/AmeliproIcon.vue'
	import AmeliproMessage from '../AmeliproMessage/AmeliproMessage.vue'
	import { isRequiredFn } from '@/utils/rules/isRequired'
	import bgPJ from '@/assets/amelipro/img/bg-pieces-jointe.svg'

	type FileInfo = { name: string, size: number, type: string, hash: string }

	function fileHashSync(file: { name: string, size: number, type: string }): string {
		const str = `${file.name}:${file.size}:${file.type}`
		let hash = 5381
		for (let i = 0; i < str.length; i++) {
			hash = ((hash << 5) + hash) + str.charCodeAt(i)
		}
		return Math.abs(hash).toString(36)
	}

	const props = defineProps({
		required: {
			type: Boolean,
			default: false,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		errorMessages: {
			type: Object as PropType<ErrorMessages>,
			default: undefined,
		},
		errorTitle: {
			type: String,
			default: undefined,
		},
		externalErrors: {
			type: Array as PropType<ErrorBucket[] | string[]>,
			default: () => [],
		},
		fileTypeAccepted: {
			type: Array as PropType<string[]>,
			required: true,
		},
		inputLabel: {
			type: String,
			default: 'Cliquer sur ce bouton pour joindre vos documents ou les glisser-déposer directement dans ce cadre',
		},
		maxFileNumber: {
			type: Number,
			default: 1,
		},
		rules: {
			type: Array as PropType<ValidationRule[]>,
			default: () => [],
		},
		uniqueId: {
			type: String,
			required: true,
		},
		value: {
			type: Array as PropType<File[]>,
			default: () => [],
		},
		warningRules: {
			type: Array as PropType<ValidationRule[]>,
			default: () => [],
		},
		warningTitle: {
			type: String,
			default: undefined,
		},
	})

	/**
	 * @type {Ref<boolean>} - Référence à l'état de focus
	 */
	const focused = ref(false)

	// internalFiles est la source de vérité pour les fichiers importés
	const internalFiles = ref<File[]>(props.value)

	// --- Gestion des fichiers ---
	/**
	 * @type {Ref<File[]>} - Référence à la liste des fichiers "de travail"
	 *
	 * @description - On a besoin de dupliquer filesModel pour pouvoir modifier sa valeur en
	 * temps réel sans modifier la valeur de filesModel (qui déclencherait un
	 * événement "input" pour chaque nouveau fichier, au lieu d'un seul
	 * événement pour l'ensemble des fichiers ajoutés)
	 */
	const pendingFiles = ref<File[]>([...internalFiles.value])

	// fileInputModel est lié au composant VFileInput
	const fileInputModel = ref<File[]>([])

	//
	const warningMessagesBucket = ref<ErrorBucket[]>([])

	/**
	 * Référence à l'instance de VFileInput
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const vFileInput = ref<any>({ reset: () => undefined, valid: true })

	/**
	 * Référence à la liste de fichiers importés
	 */
	const filesModel = computed({
		get: (): File[] => internalFiles.value,
		set: (fileList: File[]): void => {
			internalFiles.value = fileList
			fileInputModel.value = fileList
			emitFiles(fileList)
		},
	})

	/**
	 * Applique les règles de validation sur un fichier donné.
	 * @param {ValidationRule[]} rules - Liste des règles de validation
	 * @param {File} file - Fichier à valider
	 * @returns {boolean | string[]} - true si le fichier est valide, sinon un tableau de messages d'erreur
	 */
	const applyRulesOnFile = (rules: ValidationRule[], file: File): boolean | string[] => {
		let isValid = true
		const fileErrorMessages: string[] = []

		rules.forEach((rule) => {
			const result = rule(file)
			if (result !== true) {
				isValid = false
				const fileErrorMessage = String(result)
				if (!fileErrorMessages.includes(fileErrorMessage)) {
					fileErrorMessages.push(fileErrorMessage)
				}
			}
		})

		return isValid || fileErrorMessages
	}

	const importFilesFrom = (filesToAdd: File[], source: string): void => {
		isUpdating = true

		const allMatch = filesToAdd.length === lastEmittedFiles.value.length && filesToAdd.every((file, index) => {
			const lastFile = lastEmittedFiles.value[index]
			return fileHashSync(file) === lastFile.hash
		})

		// Si la liste est exactement la même que la dernière liste émise, ignorer
		if (allMatch) {
			isUpdating = false
			return
		}

		if (source === 'prop') {
			// Si la source est la prop, tout supprimer
			removeAllFiles()
		}

		removeErrors()
		importFiles(filesToAdd)

		nextTick(() => {
			isUpdating = false
			internalValidate()
		})
	}

	/**
	 * Ajoute des fichiers à la liste des fichiers importés
	 * @param filesToAdd - Liste de fichiers à ajouter
	 * @returns {void}
	 * @description Ajoute des fichiers à la liste de fichiers importés
	 * en appliquant les règles de validation définies dans le composant.
	 * Si un fichier est valide, il est ajouté à la liste de fichiers importés.
	 * Si un fichier est invalide, il est ajouté à la liste de fichiers invalides (warningMessagesBucket)
	 * avec les messages d'erreur associés.
	 */
	const importFiles = (filesToAdd: File[]): void => {
		let updateFilesModel = false

		pendingFiles.value = [...filesModel.value]

		filesToAdd.forEach((file) => {
			const result = applyRulesOnFile(inputRules.value, file)
			if (result === true) {
				pendingFiles.value.push(file)
				updateFilesModel = true
			}
			else {
				warningMessagesBucket.value.push({ fileName: file.name, errors: result as string[] })
			}
		})

		if (updateFilesModel) {
			filesModel.value = [...pendingFiles.value]
		}

		vFileInput.value.reset()
	}

	/**
	 * Valide les fichiers en appliquant les règles de validation
	 * définies dans le composant.
	 * @returns {boolean} - true si tous les fichiers sont valides, false sinon
	 */
	const internalValidate = (): void => {
		const errorBucket: ErrorBucket[] = []

		if (filesModel.value.length > 0) {
			// Appliquer les règles de validation sur chaque fichier
			// et ajouter les messages d'erreur dans le tableau errorBucket
			filesModel.value.forEach((file) => {
				const result = applyRulesOnFile(validationRules.value, file)
				if (result !== true) {
					errorBucket.push({ fileName: file.name, errors: result as string[] })
				}
			})
		}
		else {
			// Si la liste de fichiers est vide, on applique les règles de validation sur un tableau vide
			// pour déclencher les messages d'erreur relatifs à l'absence de fichiers
			// (ex: "Ce champ est requis")
			validationRules.value.forEach((rule) => {
				const result = rule([])
				if (result !== true) {
					errorBucket.push({ errors: (Array.isArray(result) ? result : [result]) as string[] })
				}
			})
		}

		// Mettre à jour les messages d'erreur et l'état de validation
		validationMessagesBucket.value = errorBucket
	}

	/**
	 * Supprime un fichier de la liste des fichiers importés
	 * @param index - Index du fichier à supprimer
	 * @returns {void}
	 */
	const removeFile = (index: number): void => {
		isUpdating = true

		removeErrors()
		doRemoveFile(index)

		nextTick(() => {
			isUpdating = false
			internalValidate()
		})
	}

	/**
	 * Effectue la suppression d'un fichier de la liste des fichiers importés
	 * @param index - Index du fichier à supprimer
	 * @returns {void}
	 */
	const doRemoveFile = (index: number): void => {
		let updateFilesModel = false
		pendingFiles.value = [...filesModel.value]

		if (index >= 0 && index < pendingFiles.value.length) {
			pendingFiles.value.splice(index, 1)
			updateFilesModel = true
		}
		else {
			console.warn('AmeliproUpload:doRemoveFile: index out of bounds', index)
		}

		if (updateFilesModel) {
			filesModel.value = [...pendingFiles.value]
		}

		nextTick(() => {
			vFileInput.value.$el.querySelector('input').value = ''
		})
	}

	const removeAllFiles = (): void => {
		isUpdating = true

		removeErrors()
		internalFiles.value = []
		pendingFiles.value = []

		nextTick(() => {
			isUpdating = false
			internalValidate()
		})
	}

	// --- Gestion des erreurs ---
	const validationMessagesBucket = ref<ErrorBucket[]>([])

	const errorMessagesBucket = computed<ErrorBucket[]>(() => {
		const errorBucket: ErrorBucket[] = []

		if (validationMessagesBucket.value.length > 0) {
			errorBucket.push(...validationMessagesBucket.value)
		}

		if (props.externalErrors) {
			if (Array.isArray(props.externalErrors) && typeof props.externalErrors[0] === 'string') {
				// Convertir string[] en ErrorBucket[]
				const convertedErrors = (props.externalErrors as string[]).map(error => ({ errors: [error] }))
				errorBucket.push(...convertedErrors)
			}
			else {
				// Ajouter directement si déjà de type ErrorBucket[]
				errorBucket.push(...(props.externalErrors as ErrorBucket[]))
			}
		}
		return errorBucket
	})

	const removeErrors = (): void => {
		warningMessagesBucket.value = []
		validationMessagesBucket.value = []
	}

	const hasError = computed<boolean>(() => errorMessagesBucket.value.length > 0)

	const hasWarning = computed<boolean>(() => warningMessagesBucket.value.length > 0)

	// --- Accessibilité ---
	const errorId = computed<string>(() => `${props.uniqueId}-error`)
	const warningId = computed<string>(() => `${props.uniqueId}-warning`)

	const errorTitle = computed<string>(() => props.errorTitle ?? `${errorMessagesBucket.value.length > 1 ? 'Ces erreurs empêchent' : 'Cette erreur empêche'} la validation du formulaire :`)
	const warningTitle = computed<string>(() => props.warningTitle ?? `${warningMessagesBucket.value.length > 1 ? 'Ces fichiers n\'ont pas été joints' : 'Ce fichier n\'a pas été joint'} :`)

	const describedby = computed<string | undefined>(() => {
		const ids: string[] = []
		if (hasError.value) {
			ids.push(errorId.value)
		}
		if (hasWarning.value) {
			ids.push(warningId.value)
		}
		return ids.length > 0 ? ids.join(' ') : undefined
	})

	const onFocus = (): void => {
		focused.value = true
	}

	const onBlur = (): void => {
		focused.value = false
		internalValidate()
	}

	// --- Règles de validation (bloquantes) ---
	const validationRules = computed<ValidationRule[]>(() => {
		const rules = [...props.rules]

		if (props.required) {
			rules.push(isRequiredFn(props.errorMessages))
		}

		return rules
	})

	// --- Règles d'importation (non bloquantes) ---
	const inputRules = computed<ValidationRule[]>(() => {
		const rules = [
			fileUploadMaxFileNumberRule(pendingFiles.value, props.maxFileNumber, props.errorMessages),
			fileUploadDuplicationRule(pendingFiles.value, props.errorMessages),
			fileUploadFormatRule(props.fileTypeAccepted, props.errorMessages),
			...props.warningRules,
		]

		return rules
	})

	// --- Gestion des événements ---
	const emit = defineEmits(['update:model-value'])
	let isUpdating = false

	let lastEmittedFiles = ref<FileInfo[]>([])

	const emitFiles = (files: File[]): void => {
		// Sauvegarder les infos nécessaires pour comparaison future
		lastEmittedFiles.value = files.map(f => ({ name: f.name, size: f.size, type: f.type, hash: fileHashSync(f) }))

		emit('update:model-value', files)
	}

	const onDropFile = (dragEvent: DragEvent): void => {
		if (!props.disabled) {
			const droppedFiles = dragEvent?.dataTransfer?.files
			if (droppedFiles) {
				isUpdating = true
				importFilesFrom(Array.from(droppedFiles), 'drop')
			}
		}
	}

	// --- Fonctions utilitaires ---
	// const areFileArraysDifferent = (array1: File[], array2: File[]): boolean => {
	//	if (array1.length !== array2.length) {
	//		return true
	//	}
	//	return array1.some((file, index) => file.name !== array2[index]?.name)
	// }

	// --- Watchers ---
	watch(() => props.required, () => {
		internalValidate()
	})

	watch(() => hasError.value, (newValue: boolean) => {
		vFileInput.value.valid = newValue
	}, { immediate: true })

	watch(() => props.value, (newValue: File[]) => {
		if (isUpdating) {
			return
		}

		importFilesFrom(newValue, 'prop')
	}, { immediate: true })

	watch(() => fileInputModel.value, (newValue: File[]) => {
		if (isUpdating) {
			return
		}

		importFilesFrom(newValue, 'input')
	})

	// --- Enregistrer l'instance du composant dans le contexte du formulaire ---
	const formContext = inject<Registrable | null>('form', null)

	onMounted(() => {
		const instance = getCurrentInstance()
		if (instance && formContext) {
			formContext.register(instance.proxy)
		}
	})

	onBeforeUnmount(() => {
		if (formContext) {
			formContext.unregister({ validate })
		}
	})

	// --- Exposer les méthodes et variables publiques ---
	const validate = (): boolean => {
		removeErrors()
		internalValidate()
		return !hasError.value
	}

	defineExpose({ hasError, validate })
</script>

<template>
	<div
		v-cloak
		:id="`${uniqueId}-container`"
		class="d-flex flex-column dashed-style amelipro-upload"
		:class="{ invalid: hasError, valid: !hasError }"
		@dragover.prevent
		@drop.prevent="onDropFile"
	>
		<div class="d-flex align-center justify-space-between w-100">
			<VFileInput
				:id="uniqueId"
				ref="vFileInput"
				v-model="fileInputModel"
				:accept="fileTypeAccepted.join(',')"
				:aria-describedby="describedby"
				:aria-invalid="hasError"
				:required="required"
				:clearable="false"
				density="compact"
				:disabled="disabled"
				:error="hasError"
				hide-details
				multiple
				prepend-icon=""
				@blur="onBlur"
				@focus="onFocus"
			>
				<template #prepend>
					<label
						:id="`${uniqueId}-label`"
						class="d-flex align-center w-100 amelipro-upload__label"
						:class="focused ? 'label-outline' : undefined"
						:for="uniqueId"
					>
						<AmeliproIcon
							class="mr-2 amelipro-upload__icon"
							icon="pieceJointe"
							icon-bg-color="ap-blue-darken-1"
							icon-color="ap-white"
							:unique-id="`${uniqueId}-upload-icon`"
							x-large
						/>

						<span class="d-flex justify-space-between align-center w-100">
							<span
								:id="`${uniqueId}-label-text`"
								class="text-body-1 upload-input-text text-left text-ap-grey-darken-1 amelipro-upload__text"
							>
								{{ inputLabel }}
								<span v-if="required">
									<span aria-hidden="true">
										&nbsp;*
									</span>

									<span class="d-sr-only">
										&nbsp;Champ obligatoire
									</span>
								</span>
							</span>

							<slot name="append-icon">
								<img
									:id="`${uniqueId}-upload-img`"
									alt=""
									class="ml-4 upload-input-img"
									:src="bgPJ"
								>
							</slot>
						</span>
					</label>
				</template>
			</VFileInput>
		</div>

		<div
			v-if="hasError"
			class="d-flex error-wrapper"
		>
			<AmeliproMessage
				class="my-2"
				text
				type="error"
				:unique-id="errorId"
			>
				<div>
					<p v-if="errorTitle">
						{{ errorTitle }}
					</p>
					<ul
						v-if="errorMessagesBucket.length > 0"
						:id="`${errorId}-error-list`"
						class="mb-0"
					>
						<li
							v-for="({ fileName, errors }, index) in errorMessagesBucket"
							:id="`${errorId}-message-item-${index}`"
							:key="index"
						>
							<p v-if="fileName">
								<strong>{{ fileName }}</strong> <em>({{ errors.join(', ') }})</em>
							</p>
							<p v-else>
								<em>{{ errors.join(', ') }}</em>
							</p>
						</li>
					</ul>
				</div>
			</AmeliproMessage>
		</div>

		<div
			v-if="hasWarning"
			class="d-flex warning-wrapper"
		>
			<AmeliproMessage
				class="my-2"
				text
				type="warning"
				:unique-id="warningId"
			>
				<div v-if="warningMessagesBucket.length > 0">
					<p v-if="warningTitle">
						{{ warningTitle }}
					</p>
					<ul
						:id="`${warningId}-bad-file-list`"
						class="mb-0"
					>
						<li
							v-for="({ fileName, errors }, index) in warningMessagesBucket"
							:id="`${warningId}-message-item-${index}`"
							:key="index"
						>
							<p>
								<strong v-if="fileName">{{ fileName }}</strong> <em>({{ errors.join(', ') }})</em>
							</p>
						</li>
					</ul>
				</div>
			</AmeliproMessage>
		</div>

		<div
			v-if="filesModel.length > 0"
			class="d-flex mt-2"
		>
			<ul
				:id="`${uniqueId}-file-list`"
				class="list-style-none amelipro-upload__list"
			>
				<li
					v-for="(file, index) in filesModel"
					:id="`${uniqueId}-file-item-${index}`"
					:key="index"
					class="mt-6 d-inline-flex amelipro-upload__item"
				>
					<AmeliproChips
						:text="file.name"
						:unique-id="`${uniqueId}-chips-${index}`"
						@click="removeFile(index)"
					/>
				</li>
			</ul>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

.amelipro-upload {
	padding: apTokens.$card-padding-tablet;
	border-radius: apTokens.$card-radius;

	@media #{apTokens.$media-only-xs} {
		padding: apTokens.$card-padding-mobile;
	}
}

.dashed-style {
	border-style: dashed;
	border-width: thin;
}

.amelipro-upload__item {
	&:not(:last-child) {
		margin-right: 1rem;
	}
}

.truncate-text {
	white-space: nowrap;
	text-overflow: ellipsis;
	width: 148px;
	min-width: 148px;
	display: block;
	overflow: hidden;
}

.v-input {
	display: block;
	margin-top: 0;

	& :deep(label) {
		cursor: pointer;

		&:hover {
			opacity: 0.9;
		}
	}

	& :deep(.label-outline) {
		outline: 1px dotted apTokens.$ap-grey-darken1;
	}

	& :deep(.v-input__control) {
		width: 0;
		height: 0;
		opacity: 0;
	}

	& :deep(.v-input__append) {
		margin-left: 0;
	}
}

.error-wrapper,
.warning-wrapper {
	margin: 0.75em 0 0 0.75em;
}

.v-alert {
	margin-top: 1em;

	& :deep(.v-alert__wrapper) {
		align-items: start;
	}

	& :deep(.v-alert__content) {
		margin-top: 0.15em;
	}
}

.upload-input-text {
	width: calc(100% - 61px);
}

.upload-input-img {
	width: 32px;
}
</style>
