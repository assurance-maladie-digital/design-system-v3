import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

import { downloadFile } from '../'

describe('downloadFile', () => {
	// https://stackoverflow.com/questions/69552023/after-update-typescript-3-7-2-to-latest-typescript-4-4-4-error-ts2339
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- mock IE navigator
	const nav = window.navigator as any
	const mockCreateObjectURL = vi.fn(() => 'mockObjectURL')
	const mockRevokeObjectURL = vi.fn()

	const file = new File(['test'], 'attestation.txt', {
		type: 'text/plain',
	})

	beforeEach(() => {
		global.URL.createObjectURL = mockCreateObjectURL
		global.URL.revokeObjectURL = mockRevokeObjectURL
	})
	afterEach(() => {
		vi.resetAllMocks()
		document.body.innerHTML = ''
	})

	it('download a file', () => {
		mockCreateObjectURL.mockReturnValue('http://exemple.com/')
		downloadFile(file, file.name, file.type)
		expect(mockCreateObjectURL).toHaveBeenCalledWith(
			new Blob([file], { type: file.type }),
		)
		expect(mockRevokeObjectURL).toHaveBeenCalledWith('http://exemple.com/')
	})

	it('download a file with utf8Bom', () => {
		mockCreateObjectURL.mockReturnValue('http://exemple.com/')
		downloadFile(file, file.name, file.type, true)
		expect(mockCreateObjectURL).toHaveBeenCalled()
		expect(mockRevokeObjectURL).toHaveBeenCalledWith('http://exemple.com/')
	})

	it('download a file with content type BufferSource', () => {
		const buffer = new ArrayBuffer(8)
		mockCreateObjectURL.mockReturnValue('http://exemple.com/')
		downloadFile(buffer, file.name, file.type)
		expect(mockCreateObjectURL).toHaveBeenCalledWith(
			new Blob([buffer], { type: file.type }),
		)
		expect(mockRevokeObjectURL).toHaveBeenCalledWith('http://exemple.com/')
	})

	it('download a file with content type String', () => {
		mockCreateObjectURL.mockReturnValue('http://exemple.com/')
		downloadFile('test', file.name, file.type)
		expect(mockCreateObjectURL).toHaveBeenCalledWith(
			new Blob(['test'], { type: file.type }),
		)
		expect(mockRevokeObjectURL).toHaveBeenCalledWith('http://exemple.com/')
	})

	it('download a file on Internet Explorer', () => {
		const mockSaveOrOpenBlob = vi.fn()
		nav.msSaveOrOpenBlob = mockSaveOrOpenBlob
		downloadFile(file, file.name, file.type)
		expect(mockSaveOrOpenBlob).toHaveBeenCalledWith(
			new Blob([file], { type: file.type }),
			file.name,
		)
	})
})
