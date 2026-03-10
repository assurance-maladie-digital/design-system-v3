// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import UploadWorkflow from '@/components/UploadWorkflow/UploadWorkflow.vue'

// Scénario d’accessibilité : zone de dépôt de fichier simple, sans fichier sélectionné,
// avec les textes d’aide par défaut.

describe('UploadWorkflow – accessibility (axe)', () => {
	it('has no obvious axe violations', async () => {
		const wrapper = mount(UploadWorkflow, {
			attachTo: document.body,
			props: {
				uploadList: [
					{
						id: '1',
						title: 'Carte d\'identité',
					},
					{
						id: '2',
						title: 'Facture de soin',
						optional: true,
					},
					{
						id: '3',
						title: 'Relevé d\'identité bancaire',
						optional: true,
					},
				],
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'UploadWorflow', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations in the modal of file selection', async () => {
		const wrapper = mount(UploadWorkflow, {
			attachTo: document.body,
			props: {
				uploadList: [
					{
						id: 'ID',
						title: 'Carte d\'identité',
					},
					{
						id: 'bill',
						title: 'Facture de soin',
					},
				],
			},
		})

		const file: File = new File([''], 'uploadInField.pdf', {
			type: 'application/pdf',
		})

		await wrapper.find('input').trigger('drop', {
			dataTransfer: {
				files: [file],
			},
		})

		const results = await axe(document.body)
		assertNoA11yViolations(results, 'UploadWorkflow - file selection modal', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations in the modal of file preview', async () => {
		const wrapper = mount(UploadWorkflow, {
			attachTo: document.body,
			props: {
				uploadList: [
					{
						id: 'ID',
						title: 'Carte d\'identité',
						showPreviewBtn: true,
					},
					{
						id: 'bill',
						title: 'Facture de soin',
					},
				],
				modelValue: [
					{
						fileName: 'file1.pdf',
						file: new File([''], 'file1.pdf', {
							type: 'application/pdf',
						}),
						id: 'ID',
						title: 'Carte d\'identité',
					},
				],
			},
		})

		await wrapper.find('.file-item button').trigger('click')

		const results = await axe(document.body)
		assertNoA11yViolations(results, 'UploadWorkflow - file preview modal', {
			ignoreRules: ['region'],
		})
	})
})
