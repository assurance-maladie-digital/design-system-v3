import 'vuetify/styles'
import './storybook.css'
import type { Preview } from '@storybook/vue3'
import { setup } from '@storybook/vue3'
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
					['Accueil', 'Introduction', 'Politique de confidentialité', 'Releases', 'Signaler une anomalie', 'Enrichir le Design System'],
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
						'Reférentiel',
					],
					'Design Tokens',
					['Introduction', 'Couleurs', 'Couleurs Amelipro', 'Typographie', 'Styles typographiques', 'Conteneurs de page', 'Espacements', 'Arrondis', 'Elévations'],
					'Composants',
					[
						'Vue d\'ensemble',
						'Structure', ['HeaderBar', 'HeaderToolbar', 'HeaderLoading', 'SubHeader', 'FooterBar', 'FooterWrapper'],
						'Layout', ['PageContainer'],
						'Navigation', ['ContextualMenu', 'ExternalLinks', 'SocialMediaLinks', 'SkipLink', 'SyPagination'],
						'Boutons', ['BackBtn', 'BackToTopBtn', 'CopyBtn', 'LangBtn', 'DownloadBtn', 'FranceConnectBtn', 'UserMenuBtn'],
						'Formulaires', ['SyTextField', 'SyTextArea', 'DatePicker', ['Introduction', 'CalendarMode', 'DateInput', 'CombinedMode', 'Validation'], 'DiacriticPicker', 'FileUpload', 'NirField', 'PasswordField', 'PeriodField', 'PhoneField', 'RangeField', 'SearchListField', 'Selects', ['Introduction', 'SelectBtnField', 'SyInputSelect', 'SySelect'], 'UploadWorkflow', 'Captcha', 'SyRadioGroup', 'SyCheckBoxGroup', 'SyCheckBox'],
						'Tableaux', ['PaginatedTable', 'TableToolbar', 'SyTable', 'SyServerTable'],
						'Filtres', ['FiltersInline', 'FiltersSideBar', 'FilterModule'],
						'Données', ['Logo', 'LogoBrandSection', 'CollapsibleList', 'ChipList', 'DataList', 'DataListGroup', 'FilePreview', 'FileList'],
						'Feedback', ['SyAlert', 'DialogBox', 'NotificationBar', 'CookieBanner', 'RatingPicker'],
						'Composants Vuetify', ['Introduction', 'VBreadcrumbs', 'VBtn', 'VOtpInput', 'VSkeletonLoader', 'VSwitch', 'VTooltip'],
					],
					'Templates', ['Vue d\'ensemble', 'StatusPage', 'ErrorPage', 'MaintenancePage', 'NotFoundPage'],
					'Guide Du Dev', [
						'Installation',
						'Migration', ['Migration depuis Bridge', 'Migration depuis Vue2', 'Breaking changes'],
						'Configuration du thème',
						'Correspondance composants PAG',
						'Correspondance composants Amelipro',
						'Règles De Validation',
						'Utiliser les rules',
						'Services',
						'Classes utilitaires',
						'VuetifyOptions',
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
			default: 'main',
			values: [
				{
					name: 'main',
					value: '#e7ecf5',
				},
				{
					name: 'surface',
					value: '#fff',
				},
				{
					name: 'raised',
					value: '#f8f9fc',
				},
				{
					name: 'accent',
					value: '#0c419a',
				},
				{
					name: 'accent-contrasted',
					value: '#0a347b',
				},
				{
					name: 'accent-alt',
					value: '#545859',
				},
				{
					name: 'info',
					value: '#ced9eb',
				},
				{
					name: 'info-subdued',
					value: '#e7ecf5',
				},
				{
					name: 'info-contrasted',
					value: '#0c419a',
				},
				{
					name: 'success',
					value: '#cceee8',
				},
				{
					name: 'success-subdued',
					value: '#e5f7f4',
				},
				{
					name: 'success-contrasted',
					value: '#56c271',
				},
			],
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
