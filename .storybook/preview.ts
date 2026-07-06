import 'vuetify/styles'
import './storybook.css'
import type { Preview } from '@storybook/vue3-vite'
import { setup } from '@storybook/vue3-vite'
import { createVuetifyInstance } from '../src/vuetifyConfig'

const vuetify = createVuetifyInstance()
const isDev = process.env.NODE_ENV === 'development'

const applyTheme = (theme: string) => {
	vuetify.theme.change(theme)
	const rootElement = document.documentElement
	rootElement.classList.remove('theme-cnam', 'theme-pa', 'theme-ap', 'theme-ap2026')
	rootElement.classList.add(`theme-${theme}`)
	localStorage.setItem('storybook-theme', theme)
}

// Listen to Storybook globals changes — fires on all pages including pure MDX.
// __STORYBOOK_ADDONS_CHANNEL__ is the shared channel injected by Storybook into the preview iframe.
if (typeof window !== 'undefined') {
	const channel = (window as Window & { __STORYBOOK_ADDONS_CHANNEL__?: { on: (event: string, cb: (data: unknown) => void) => void } }).__STORYBOOK_ADDONS_CHANNEL__
	channel?.on('globalsUpdated', (data) => {
		const theme = (data as { globals?: Record<string, string> })?.globals?.theme
		if (theme) applyTheme(theme)
	})
}

setup((app, { globals }) => {
	app.use(vuetify)

	// Add global mixin to help with SySelect dropdown in docs mode
	if (typeof window !== 'undefined') {
		// Wait for DOM to be ready
		window.addEventListener('DOMContentLoaded', () => {
			// Add click handler to document to help with dropdown positioning
			document.addEventListener('click', (event) => {
				// Check if we're in docs mode
				if (document.body.classList.contains('storybook-docs-mode')) {
					// Find all dropdowns and make sure they're properly positioned
					const lists = document.querySelectorAll('.v-list')
					lists.forEach((list) => {
						if (list instanceof HTMLElement) {
							list.style.position = 'absolute'
							list.style.zIndex = '9999'
							list.style.visibility = 'visible'
						}
					})
				}
			})
		})
	}

	app.config.idPrefix = (Math.random() + 1).toString(36).substring(7)

	// Apply theme immediately on load
	if (typeof window !== 'undefined') {
		applyTheme(globals.theme)
	}
})

const themeItems = [
	{ value: 'cnam', title: 'Thème CNAM' },
	{ value: 'pa', title: 'Thème PA' },
	...(!isDev
		? []
		: [{ value: 'ap2026', title: 'Thème AmeliPro 2026' }]
	),
	{ value: 'ap', title: 'Thème AmeliPro' },
]

const globalTypes = {
	theme: {
		name: 'Theme',
		description: 'Switch between CNAM, PA, AP and AP2026 themes',
		defaultValue: 'cnam',
		toolbar: {
			title: 'Thèmes',
			icon: 'paintbrush',
			items: themeItems,
			dynamicTitle: true,
		},
	},
}

// Get stored theme or default to CNAM
const storedTheme = typeof window !== 'undefined' ? localStorage.getItem('storybook-theme') : 'cnam'

const preview: Preview = {
	globalTypes,
	initialGlobals: {
		theme: storedTheme || 'cnam',

		backgrounds: {
			value: 'main',
		},
	},
	decorators: [
		(story, context) => {
			// Handle theme changes for story renders (channel event handles MDX pages)
			if (typeof window !== 'undefined' && context.globals.theme !== vuetify.theme.global.name.value) {
				applyTheme(context.globals.theme)
			}

			// Check if we're in docs mode to apply special handling for dropdowns
			const isInDocs = context.viewMode === 'docs'

			if (isInDocs) {
				// Add a special class to help target docs mode in CSS
				if (typeof document !== 'undefined') {
					document.body.classList.add('storybook-docs-mode')
				}
			}

			return story()
		},
	],
	parameters: {
		interactions: {
			disable: true,
		},
		docs: { controls: { sort: 'alpha' } },
		options: {
			storySort: {
				method: 'alpha',
				locales: 'fr-FR',
				order: [
					'Démarrer',
					['Accueil', 'Introduction', 'Politique de confidentialité', 'Releases', 'Signaler une anomalie', 'Enrichir le Design System', 'Suivi des composants'],
					'Accessibilité',
					[
						'Introduction',
						'Aculturation', ['Sensibilisation à l’accessibilité numérique'],
						'Kit de pré-audit', ['Introduction', 'Échantillonnage', 'Pré-audit', 'Outils', ['Introduction', 'Tanaguru', ['Utilisation', 'Faux positifs']]],
						'Audit', ['RGAA'],
						'Design System', ['Audit du Design System', 'Avancement', 'Vuetify'],
					],
					'Éco-conception',
					[
						'Introduction',
						'Bonnes pratiques essentielles',
						'Auto-évaluation Dev Front',
						'Auto-évaluation UX',
					],
					'Design Tokens',
					['Introduction', 'Utilisation', 'Couleurs', ['*', 'Correspondances couleurs'], 'Couleurs Amelipro', 'Typographie', 'Styles typographiques', 'Conteneurs de page', 'Espacements', 'Arrondis', 'Elévations'],
					'Composants',
					// Use alphabetical order for components but keep categories grouped in this order
					[
						'Vue d\'ensemble',
						'Structure', ['FooterBar', 'FooterWrapper', 'HeaderBar', 'HeaderLoading', 'HeaderToolbar', 'SubHeader'],
						'Layout', ['PageContainer'],
						'Navigation', ['ContextualMenu', 'ExternalLinks', 'SkipLink', 'SocialMediaLinks', 'SyPagination', 'SyTabs'],
						'Boutons', ['BackBtn', 'BackToTopBtn', 'CopyBtn', 'DownloadBtn', 'FranceConnectBtn', 'LangBtn', 'UserMenuBtn'],
						'Formulaires', ['Captcha', 'DatePicker', ['Introduction', 'CalendarMode', 'CombinedMode', 'DateInput', 'Validation'], 'DiacriticPicker', 'FileUpload', 'NirField', 'PasswordField', 'PeriodField', 'PhoneField', 'RangeField', 'Selects', ['Introduction', 'SelectBtnField', 'SyInputSelect', 'SySelect'], 'SyCheckBox', 'SyCheckBoxGroup', 'SyRadioGroup', 'SyTextArea', 'SyTextField', 'UploadWorkflow'],
						'Tableaux', ['PaginatedTable', 'SyServerTable', 'SyTable', 'TableToolbar'],
						'Filtres', ['FilterInline', 'FilterSideBar', 'SearchListField'],
						'Données', ['Accordion', 'ChipList', 'CollapsibleList', 'DataList', 'DataListGroup', 'FileList', 'FilePreview', 'Logo', 'LogoBrandSection'],
						'Feedback', ['CookieBanner', 'DialogBox', 'NotificationBar', 'RatingPicker', 'SyAlert'],
						'Composants Vuetify', ['Introduction', 'VBreadcrumbs', 'VBtn', 'VCard', 'VCarousel', 'VNavigationDrawer', 'VOtpInput', 'VSkeletonLoader', 'VSlideGroup', 'VStepper', 'VSwitch', 'VTooltip'],
					],
					'Templates', ['Vue d\'ensemble', 'ErrorPage', 'MaintenancePage', 'NotFoundPage', 'StatusPage'],
					'Guide Du Dev', [
						'Démarrage', ['Installation', 'Configuration du thème', 'createVuetifyInstance', 'VuetifyOptions'],
						'Formulaires & Validation', ['Guide des formulaires', 'Guide technique'],
						'Utilitaires', ['Vue d\'ensemble', 'Stockage', 'Formatage', 'Validation', 'DOM & Navigateur', 'Données', 'Règles de validation'],
						'Services', ['useNotificationService'],
						'Directives', ['v-rgaa-svg-fix'],
						'Migration', ['Depuis Bridge (Vue3)', 'Depuis Vue2', 'Breaking changes'],
						'Convergence des DS', ['Équivalence des composants', ['Portail Agent', 'Amelipro']],
					],
				],
			},
		},
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
			disableSaveFromUI: true,
		},
		backgrounds: {
			options: {
				'main': {
					name: 'main',
					value: '#e7ecf5',
				},
				'surface': {
					name: 'surface',
					value: '#fff',
				},
				'raised': {
					name: 'raised',
					value: '#f8f9fc',
				},
				'accent': {
					name: 'accent',
					value: '#0c419a',
				},
				'accent-contrasted': {
					name: 'accent-contrasted',
					value: '#0a347b',
				},
				'accent-alt': {
					name: 'accent-alt',
					value: '#545859',
				},
				'info': {
					name: 'info',
					value: '#ced9eb',
				},
				'info-subdued': {
					name: 'info-subdued',
					value: '#e7ecf5',
				},
				'info-contrasted': {
					name: 'info-contrasted',
					value: '#0c419a',
				},
				'success': {
					name: 'success',
					value: '#cceee8',
				},
				'success-subdued': {
					name: 'success-subdued',
					value: '#e5f7f4',
				},
				'success-contrasted': {
					name: 'success-contrasted',
					value: '#56c271',
				},
			},
		},
		a11y: {
			config: {
				rules: [
					{
						id: 'color-contrast',
						enabled: false,
					},
				],
			},
		},
	},
}

export default preview
