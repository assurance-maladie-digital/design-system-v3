// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import DeclarationAccessibilityPage from '../DeclarationAccessibilityPage.vue'

describe('DeclarationAccessibilityPage – accessibility (axe)', () => {
	it('has no obvious axe violations with full data', async () => {
		const wrapper = mount(DeclarationAccessibilityPage, {
			props: {
				entityName: 'Assurance Maladie',
				siteName: 'ameli.fr',
				siteUrl: 'https://www.ameli.fr',
				contactEmail: 'accessibilite@ameli.fr',
				contactPhone: '01 23 45 67 89',
				schemaUrl: '#schema',
				schemaUrlLabel: 'Schéma pluriannuel 2024-2026',
				actionsRealisedUrl: '#actions',
				actionsRealisedUrlLabel: 'Actions réalisées en 2024',
				planActionsUrl: '#plan',
				planActionsUrlLabel: 'Plan d\'actions 2025',
				auditEntity: 'Atalan',
				auditDate: '2024-06-15',
				auditGridUrl: '#audit',
				overallComplianceRate: 95,
				averageComplianceRate: 82,
				nonConformities: [
					'Certaines images informatives n\'ont pas d\'alternative textuelle.',
				],
				exemptions: ['Les documents PDF archivés antérieurs à 2020.'],
				nonObligatoryContents: ['Contenus tiers embarqués.'],
				technologies: ['HTML5', 'CSS3', 'Vue.js'],
				testEnvironments: ['Firefox 115 avec NVDA 2023.1'],
				accessibilityTools: ['Axe DevTools', 'Wave'],
				verifiedPages: [
					{ name: 'Accueil', url: 'https://www.ameli.fr' },
					{ name: 'Contact' },
				],
				declarationDate: '2024-06-20',
				updateDate: '2025-01-10',
			},
		})

		await wrapper.vm.$nextTick()

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'DeclarationAccessibilityPage – full data', {
			ignoreRules: ['region'],
		})
	})
})
