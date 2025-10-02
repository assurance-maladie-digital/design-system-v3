import { beforeEach, describe, it, expect } from 'vitest'
import type { IFileUploadRuleParams, ValidationRule } from '../../../../rules/types'
import { fileUploadRule } from '../'

describe('fileUploadRule', () => {
	const buildFile = (name: string): File => (<File>{
		lastModified: 1685526538748,
		name,
		size: 3115351,
		type: 'application/pdf',
		webkitRelativePath: '',
	})
	const simplePdf = buildFile('file1.pdf')

	it('returns true when the file has the right type', () => {
		const params = <IFileUploadRuleParams> {
			fileList: [],
			fileTypeAccepted: ['application/pdf'],
			maxFileNumber: 1,
		}
		expect(fileUploadRule({}, params)(simplePdf)).toBe(true)
	})

	describe('default and custom error messages', () => {
		let defaultRule: ValidationRule<File>
		let customRule: ValidationRule<File>

		beforeEach(() => {
			defaultRule = fileUploadRule()
			customRule = fileUploadRule({
				default: 'Default error',
				duplicated: 'Duplicated error',
				maxFile: 'Max files error',
				type: 'Type error',
			})
		})

		it('returns an error when the file type is not defined', () => {
			expect(defaultRule(simplePdf)).toBe('Format de fichier incorrect (file1.pdf)')
			expect(customRule(simplePdf)).toBe('Type error')
		})

		it('returns an error when the file list is full', () => {
			const params = <IFileUploadRuleParams> {
				fileList: [simplePdf],
				fileTypeAccepted: ['application/pdf'],
				maxFileNumber: 1,
			}
			expect(defaultRule(simplePdf, params)).toBe('Vous avez dépassé le maximum de pièces jointes autorisées')
			expect(customRule(simplePdf, params)).toBe('Max files error')
		})

		it('returns an error when the file already exists in the file list', () => {
			const params = <IFileUploadRuleParams> {
				fileList: [simplePdf],
				fileTypeAccepted: ['application/pdf'],
				maxFileNumber: 2,
			}
			expect(defaultRule(simplePdf, params)).toBe('Fichier déjà présent dans la liste (file1.pdf)')
			expect(customRule(simplePdf, params)).toBe('Duplicated error')
		})
	})
})
