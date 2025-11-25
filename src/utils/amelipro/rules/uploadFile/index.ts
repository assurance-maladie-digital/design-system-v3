import type { ErrorMessages, IFileUploadRuleParams, ValidationResult, ValidationRule } from '../../../rules/types'
import { ruleMessage } from '@/utils/ruleMessage'

export const fileUploadRuleErrorMessages: ErrorMessages = {
	default: 'Erreur lors du chargement du fichier',
	duplicated: 'Fichier déjà présent dans la liste',
	maxFile: 'Vous avez dépassé le maximum de pièces jointes autorisées',
	type: 'Format de fichier incorrect',
}

export const defaultFileUploadErrorParams = (): IFileUploadRuleParams => ({
	fileList: [],
	fileTypeAccepted: [],
	maxFileNumber: 1,
})

// check that the list length doesn't pass over authorized max file number
export const fileUploadMaxFileNumberRule = (fileList: File[], maxItems: number, errorMessages: ErrorMessages = {}): ValidationRule => (files): ValidationResult => {
	let valid: ValidationResult = true
	const localFiles = Array.isArray(files) ? files : [files]
	const results: ValidationResult[] = []
	localFiles.forEach((file) => {
		results.push(fileUploadMaxFileNumberRuleFn(fileList, maxItems, errorMessages, file as File))
	})
	valid = results.every(elem => elem === true)
	return valid || String(results.filter(elem => elem !== true))
}

const fileUploadMaxFileNumberRuleFn = (fileList: File[], maxItems: number, errorMessages: ErrorMessages, file: File): ValidationResult => {
	if (file === undefined || file === null) {
		return true
	}

	let valid = false
	let errorMessageKey = 'default'

	if (fileList.length < maxItems) {
		valid = true
	}
	else {
		errorMessageKey = 'maxFile'
	}

	return valid || ruleMessage({
		...fileUploadRuleErrorMessages,
		...errorMessages,
	}, errorMessageKey)
}

// check that the list doesn't contain duplicated file
export const fileUploadDuplicationRule = (fileList: File[], errorMessages: ErrorMessages = {}): ValidationRule => (files): ValidationResult => {
	let valid: ValidationResult = true
	const localFiles = Array.isArray(files) ? files : [files]
	const results: ValidationResult[] = []
	localFiles.forEach((file) => {
		results.push(fileUploadDuplicationRuleFn(fileList, errorMessages, file as File))
	})
	valid = results.every(elem => elem === true)
	return valid || String(results.filter(elem => elem !== true))
}

const fileUploadDuplicationRuleFn = (fileList: File[], errorMessages: ErrorMessages, file: File): ValidationResult => {
	if (file === undefined || file === null) {
		return true
	}

	let valid = false
	let errorMessageKey = 'default'
	const fileOcurrences = fileList.filter(elem => elem.name === file?.name)

	if (fileOcurrences.length === 0) {
		valid = true
	}
	else {
		errorMessageKey = 'duplicated'
	}

	return valid || ruleMessage({
		...fileUploadRuleErrorMessages,
		...errorMessages,
	}, errorMessageKey)
}

// check that the list doesn't contain wrong format file
export const fileUploadFormatRule = (fileTypeAccepted: string[], errorMessages: ErrorMessages = {}): ValidationRule => (files): ValidationResult => {
	let valid: ValidationResult = true
	const localFiles = Array.isArray(files) ? files : [files]
	const results: ValidationResult[] = []
	localFiles.forEach((file) => {
		results.push(fileUploadFormatRuleFn(fileTypeAccepted, errorMessages, file as File))
	})
	valid = results.every(elem => elem === true)
	return valid || String(results.filter(elem => elem !== true))
}

const fileUploadFormatRuleFn = (fileTypeAccepted: string[], errorMessages: ErrorMessages, file: File): ValidationResult => {
	if (file === undefined || file === null) {
		return true
	}

	if (fileTypeAccepted.length === 0) {
		return true
	}

	let valid = false
	let errorMessageKey = 'default'

	if (fileTypeAccepted.includes(file.type)) {
		valid = true
	}
	else {
		errorMessageKey = 'type'
	}

	return valid || ruleMessage({
		...fileUploadRuleErrorMessages,
		...errorMessages,
	}, errorMessageKey)
}
