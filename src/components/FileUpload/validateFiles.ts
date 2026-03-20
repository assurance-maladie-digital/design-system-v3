import { calcHumanFileSize } from '@/utils/calcHumanFileSize'
import { locales as defaultLocales } from './locales'

export default function validateFiles(
	files: File[],
	maxFileSize: number,
	allowedExtensions: string[],
	fileSizeUnits: string[],
	locales: typeof defaultLocales = defaultLocales,
) {
	const errors: string[] = []
	const validFiles: File[] = []
	const normalizedExtensions = allowedExtensions.map(ext => ext.toLowerCase())
	for (const file of files) {
		let isValid = true
		if (file.size > maxFileSize) {
			errors.push(
				locales.errorSize(file.name, calcHumanFileSize(maxFileSize, fileSizeUnits)),
			)
			isValid = false
		}

		const fileExt = (file.name.split('.').pop() || '').toLowerCase()
		if (
			!normalizedExtensions.includes(fileExt)
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
