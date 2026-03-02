import type { Meta, StoryObj } from '@storybook/vue3'

import DeclarationAccessibilityPage from './DeclarationAccessibilityPage.vue'

const meta = {
	title: 'Templates/DeclarationAccessibilityPage',
	component: DeclarationAccessibilityPage,
	parameters: {
		layout: 'fullscreen',
		docsOnly: true,
	},
	argTypes: {
		entityName: {
			control: 'text',
			description: 'Nom de l\'entité responsable',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: {
					summary: '',
				},
			},
		},
		schemaUrl: {
			control: 'text',
			description: 'URL du schéma pluriannuel d\'accessibilité',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: {
					summary: '',
				},
			},
		},
		actionsRealisedUrl: {
			control: 'text',
			description: 'URL des actions réalisées',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: {
					summary: '',
				},
			},
		},
		schemaUrlLabel: {
			control: 'text',
			description: 'Label pour le lien du schéma pluriannuel',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: {
					summary: 'Schéma pluriannuel de mise en accessibilité',
				},
			},
		},
		actionsRealisedUrlLabel: {
			control: 'text',
			description: 'Label pour le lien des actions réalisées',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: {
					summary: 'Actions réalisées',
				},
			},
		},
		planActionsUrl: {
			control: 'text',
			description: 'URL du plan d\'actions',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: {
					summary: '',
				},
			},
		},
		planActionsUrlLabel: {
			control: 'text',
			description: 'Label pour le lien du plan d\'actions',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: {
					summary: 'Plan d\'actions',
				},
			},
		},
		siteName: {
			control: 'text',
			description: 'Nom du site',
			table: {
				type: {
					summary: 'string',
				},
			},
		},
		siteUrl: {
			control: 'text',
			description: 'URL du site',
			table: {
				type: {
					summary: 'string',
				},
			},
		},
		contactEmail: {
			control: 'text',
			description: 'Email de contact',
			table: {
				type: {
					summary: 'string',
				},
			},
		},
		contactPhone: {
			control: 'text',
			description: 'Téléphone de contact',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: {
					summary: '',
				},
			},
		},
		auditEntity: {
			control: 'text',
			description: 'Entité qui a réalisé l\'audit',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: {
					summary: '',
				},
			},
		},
		overallComplianceRate: {
			control: { type: 'number', min: 0, max: 100 },
			description: 'Pourcentage des critères RGAA respectés',
			table: {
				type: {
					summary: 'number',
				},
				defaultValue: {
					summary: 'null',
				},
			},
		},
		auditGridUrl: {
			control: 'text',
			description: 'URL de la grille d\'audit RGAA',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: {
					summary: '',
				},
			},
		},
		nonConformities: {
			control: 'object',
			description: 'Liste des non-conformités',
			table: {
				type: {
					summary: 'array',
				},
				defaultValue: {
					summary: '[]',
				},
			},
		},
		exemptions: {
			control: 'object',
			description: 'Liste des dérogations pour charge disproportionnée',
			table: {
				type: {
					summary: 'array',
				},
				defaultValue: {
					summary: '[]',
				},
			},
		},
		nonObligatoryContents: {
			control: 'object',
			description: 'Liste des contenus non soumis à l\'obligation d\'accessibilité',
			table: {
				type: {
					summary: 'array',
				},
				defaultValue: {
					summary: '[]',
				},
			},
		},
		// Établissement de la déclaration
		declarationDate: {
			control: 'text',
			description: 'Date d\'établissement de la déclaration',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: {
					summary: '',
				},
			},
		},
		updateDate: {
			control: 'text',
			description: 'Date de mise à jour de la déclaration',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: {
					summary: '',
				},
			},
		},
		technologies: {
			control: 'object',
			description: 'Technologies utilisées pour la réalisation du site',
			table: {
				type: {
					summary: 'array',
				},
				defaultValue: {
					summary: '[]',
				},
			},
		},
		testEnvironments: {
			control: 'object',
			description: 'Environnements de test utilisés',
			table: {
				type: {
					summary: 'array',
				},
				defaultValue: {
					summary: '[]',
				},
			},
		},
		accessibilityTools: {
			control: 'object',
			description: 'Outils utilisés pour évaluer l\'accessibilité',
			table: {
				type: {
					summary: 'array',
				},
				defaultValue: {
					summary: '[]',
				},
			},
		},
		verifiedPages: {
			control: 'object',
			description: 'Pages du site ayant fait l\'objet de la vérification',
			table: {
				type: {
					summary: 'array',
				},
				defaultValue: {
					summary: '[]',
				},
			},
		},
	},
} as Meta<typeof DeclarationAccessibilityPage>

export default meta

type Story = StoryObj<typeof DeclarationAccessibilityPage>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				language: 'vue',
				code: `<DeclarationAccessibilityPage
  entityName="Assurance Maladie"
  siteName="ameli.fr"
  siteUrl="https://www.ameli.fr"
  contactEmail="accessibilite@ameli.fr"
  contactPhone="01 23 45 67 89"
  schemaUrl="#"
  actionsRealisedUrl="#"
  planActionsUrl="#"
/>`,
			},
		],
	},
	args: {
		entityName: 'Assurance Maladie',
		siteName: 'ameli.fr',
		siteUrl: 'https://www.ameli.fr',
		contactEmail: 'accessibilite@ameli.fr',
		contactPhone: '01 23 45 67 89',
		schemaUrl: '#',
		actionsRealisedUrl: '#',
		planActionsUrl: '#',
	},
}

export const SimpleCase: Story = {
	parameters: {
		sourceCode: [
			{
				language: 'vue',
				code: `<DeclarationAccessibilityPage
  entityName="CPAM de Paris"
  siteName="Mon Espace Santé"
  siteUrl="https://www.mon-espace-sante.fr"
  contactEmail="accessibilite@mon-espace-sante.fr"
  contactPhone="01 23 45 67 89"
/>`,
			},
		],
	},
	args: {
		entityName: 'CPAM de Paris',
		siteName: 'Mon Espace Santé',
		siteUrl: 'https://www.mon-espace-sante.fr',
		contactEmail: 'accessibilite@mon-espace-sante.fr',
		contactPhone: '01 23 45 67 89',
	},
}

export const WithAccessibilityPlan: Story = {
	parameters: {
		sourceCode: [
			{
				language: 'vue',
				code: `<DeclarationAccessibilityPage
  entityName="CPAM de Paris"
  siteName="Mon Espace Santé"
  siteUrl="https://www.mon-espace-sante.fr"
  contactEmail="accessibilite@mon-espace-sante.fr"
  contactPhone="01 23 45 67 89"
  schemaUrl="#"
  schemaUrlLabel="Schéma pluriannuel 2022-2024"
  actionsRealisedUrl="#"
  actionsRealisedUrlLabel="Actions réalisées en 2022"
  planActionsUrl="#"
  planActionsUrlLabel="Plan d'actions 2023"
/>`,
			},
		],
	},
	args: {
		entityName: 'CPAM de Paris',
		siteName: 'Mon Espace Santé',
		siteUrl: 'https://www.mon-espace-sante.fr',
		contactEmail: 'accessibilite@mon-espace-sante.fr',
		contactPhone: '01 23 45 67 89',
		schemaUrl: '#',
		schemaUrlLabel: 'Schéma pluriannuel 2022-2024',
		actionsRealisedUrl: '#',
		actionsRealisedUrlLabel: 'Actions réalisées en 2022',
		planActionsUrl: '#',
		planActionsUrlLabel: 'Plan d\'actions 2023',
	},
}

export const WithNonConformities: Story = {
	parameters: {
		sourceCode: [
			{
				language: 'vue',
				code: `<DeclarationAccessibilityPage
  entityName="CPAM de Paris"
  siteName="Mon Espace Santé"
  siteUrl="https://www.mon-espace-sante.fr"
  contactEmail="accessibilite@mon-espace-sante.fr"
  contactPhone="01 23 45 67 89"
  :nonConformities="[
    'Les formulaires de contact ne possèdent pas d\\'étiquettes correctement associées aux champs. Cette erreur sera corrigée avant le 30 septembre 2023.',
    'Certaines images informatives n\\'ont pas d\\'alternative textuelle. Cette erreur sera corrigée avant le 31 décembre 2023.'
  ]"
/>`,
			},
		],
	},
	args: {
		entityName: 'CPAM de Paris',
		siteName: 'Mon Espace Santé',
		siteUrl: 'https://www.mon-espace-sante.fr',
		contactEmail: 'accessibilite@mon-espace-sante.fr',
		contactPhone: '01 23 45 67 89',
		nonConformities: [
			'Les formulaires de contact ne possèdent pas d\'étiquettes correctement associées aux champs. Cette erreur sera corrigée avant le 30 septembre 2023.',
			'Certaines images informatives n\'ont pas d\'alternative textuelle. Cette erreur sera corrigée avant le 31 décembre 2023.',
		],
	},
}

export const WithExemptions: Story = {
	parameters: {
		sourceCode: [
			{
				language: 'vue',
				code: `<DeclarationAccessibilityPage
  entityName="CPAM de Paris"
  siteName="Mon Espace Santé"
  siteUrl="https://www.mon-espace-sante.fr"
  :averageComplianceRate="75"
  contactEmail="accessibilite@mon-espace-sante.fr"
  contactPhone="01 23 45 67 89"
  :exemptions="[
	'Les documents PDF archivés antérieurs à 2020 ne sont pas accessibles. Il est possible d\\'en demander une version accessible par email.',
	'Les cartes interactives de localisation des agences ne sont pas totalement accessibles, mais les informations sont disponibles sous forme de liste textuelle.'
  ]"
/>`,
			},
		],
	},
	args: {
		entityName: 'CPAM de Paris',
		siteName: 'Mon Espace Santé',
		siteUrl: 'https://www.mon-espace-sante.fr',
		averageComplianceRate: 75,
		contactEmail: 'accessibilite@mon-espace-sante.fr',
		contactPhone: '01 23 45 67 89',
		exemptions: [
			'Les documents PDF archivés antérieurs à 2020 ne sont pas accessibles. Il est possible d\'en demander une version accessible par email.',
			'Les cartes interactives de localisation des agences ne sont pas totalement accessibles, mais les informations sont disponibles sous forme de liste textuelle.',
		],
	},
}

export const WithTestsEnvironement: Story = {
	parameters: {
		sourceCode: [
			{
				language: 'vue',
				code: `<DeclarationAccessibilityPage
  entityName="CPAM de Paris"
  siteName="Mon Espace Santé"
  siteUrl="https://www.mon-espace-sante.fr"
  :averageComplianceRate="75"
  contactEmail="accessibilite@mon-espace-sante.fr"
  contactPhone="01 23 45 67 89"
  :technologies="[
	'HTML5',
	'CSS3',
	'JavaScript',
	'Vue.js'
  ]"
  :testEnvironments="[
	'Firefox 115 avec NVDA 2023.1',
	'Chrome 114 avec JAWS 2023',
	'Safari 16 avec VoiceOver'
  ]"
  :accessibilityTools="[
	'Axe DevTools',
	'Wave',
	'Contrast Checker',
	'Keyboard Navigation Test'
  ]"
/>`,
			},
		],
	},
	args: {
		entityName: 'CPAM de Paris',
		siteName: 'Mon Espace Santé',
		siteUrl: 'https://www.mon-espace-sante.fr',
		averageComplianceRate: 75,
		contactEmail: 'accessibilite@mon-espace-sante.fr',
		contactPhone: '01 23 45 67 89',
		technologies: [
			'HTML5',
			'CSS3',
			'JavaScript',
			'Vue.js',
		],
		testEnvironments: [
			'Firefox 115 avec NVDA 2023.1',
			'Chrome 114 avec JAWS 2023',
			'Safari 16 avec VoiceOver',
		],
		accessibilityTools: [
			'Axe DevTools',
			'Wave',
			'Contrast Checker',
			'Keyboard Navigation Test',
		],
	},
}
