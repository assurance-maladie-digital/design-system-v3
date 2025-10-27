import { describe, it, expect } from 'vitest'
import {
	fileUploadMaxFileNumberRule,
	fileUploadDuplicationRule,
	fileUploadFormatRule,
	fileUploadRuleErrorMessages,
} from '../index'

const buildFile = (name: string, type = 'application/pdf', size = 3115351): File => (<File>{
	lastModified: 1685526538748,
	name,
	size,
	type,
	webkitRelativePath: '',
})

describe('fileUploadMaxFileNumberRule', () => {
	it('returns true when file list is not full', () => {
		const fileList: File[] = []
		const rule = fileUploadMaxFileNumberRule(fileList, 2)
		expect(rule([buildFile('file1.pdf')])).toBe(true)
	})

	it('returns error when file list is full', () => {
		const fileList: File[] = [buildFile('file1.pdf'), buildFile('file2.pdf')]
		const rule = fileUploadMaxFileNumberRule(fileList, 2)
		expect(rule([buildFile('file3.pdf')])).toBe(fileUploadRuleErrorMessages.maxFile)
	})
})

describe('fileUploadDuplicationRule', () => {
	it('returns true when file is not duplicated', () => {
		const fileList: File[] = [buildFile('file1.pdf')]
		const rule = fileUploadDuplicationRule(fileList)
		expect(rule([buildFile('file2.pdf')])).toBe(true)
	})

	it('returns error when file is duplicated', () => {
		const fileList: File[] = [buildFile('file1.pdf')]
		const rule = fileUploadDuplicationRule(fileList)
		expect(rule([buildFile('file1.pdf')])).toBe(fileUploadRuleErrorMessages.duplicated)
	})
})

describe('fileUploadFormatRule', () => {
	it('returns true when file type is accepted', () => {
		const rule = fileUploadFormatRule(['application/pdf'])
		expect(rule([buildFile('file1.pdf')])).toBe(true)
	})

	it('returns error when file type is not accepted', () => {
		const rule = fileUploadFormatRule(['image/png'])
		expect(rule([buildFile('file1.pdf')])).toBe(fileUploadRuleErrorMessages.type)
	})
})
