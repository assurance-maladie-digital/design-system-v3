// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import FileList from '../FileList.vue'

// Scénario d’accessibilité : liste de fichiers avec différents états
// (initial, succès, erreur) et actions disponibles.

describe('FileList – accessibility (axe)', () => {
	it('has no obvious axe violations with multiple upload items', async () => {
		const wrapper = mount(FileList, {
			props: {
				uploadList: [
					{
						id: 'residence',
						title: 'Attestation de domicile',
						state: 'initial',
						optional: true,
						showUploadBtn: true,
					},
					{
						id: 'identityCard',
						title: 'Carte d\'identité',
						state: 'success',
						showPreviewBtn: true,
						showDeleteBtn: true,
						fileName: 'carte-identite.pdf',
					},
				],
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'FileList – default items', {
			ignoreRules: ['region'],
		})
	})
})
