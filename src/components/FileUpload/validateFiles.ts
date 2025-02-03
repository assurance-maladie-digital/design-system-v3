import { calcHumanFileSize } from '@/utils/calcHumanFileSize'
import { locales } from './locales'

export default function validateFiles(
	files: File[],
	maxFileSize: number,
	allowedExtensions: string[],
	fileSizeUnits: string[],
) {
	const errors: string[] = []
	const validFiles: File[] = []
	for (const file of files) {
		let isValid = true
		if (file.size > maxFileSize) {
			errors.push(
				locales.errorSize(file.name, calcHumanFileSize(maxFileSize, fileSizeUnits)),
			)
			isValid = false
		}

		if (
			!allowedExtensions.includes(file.name.split('.').pop() || '')
			&& allowedExtensions.length > 0
		) {
			errors.push(
				locales.errorExtension(file.name, allowedExtensions),
			)
			isValid = false
		}

		if (isValid) {
			validFiles.push(file)
		}
	}
	return {
		errors,
		validFiles,
	}
}
