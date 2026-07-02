import 'vuetify/styles'
import './storybook.css'
import type { Preview } from '@storybook/vue3'
import { setup } from '@storybook/vue3'
import { createVuetifyInstance } from '../src/vuetifyConfig'

const vuetify = createVuetifyInstance()
const isDev = process.env.NODE_ENV === 'development'

let currentTheme: string | null = null
let initialized = false

const applyTheme = (theme: string) => {
	if (!theme || theme === currentTheme) return
	currentTheme = theme

	vuetify.theme.change(theme)
	const rootElement = document.documentElement
	rootElement.classList.remove('theme-cnam', 'theme-pa', 'theme-ap', 'theme-ap2026')
	rootElement.classList.add(`theme-${theme}`)
	localStorage.setItem('storybook-theme', theme)
}

// Listen Storybook globals (preview iframe)
if (typeof window !== 'undefined' && !initialized) {
	initialized = true

	const channel = (window as any).__STORYBOOK_ADDONS_CHANNEL__

	channel?.on('globalsUpdated', (data: any) => {
		const theme = data?.globals?.theme
		if (theme) applyTheme(theme)
	})
}

setup((app, { globals }) => {
	app.use(vuetify)

	// Apply theme once
	if (typeof window !== 'undefined') {
		applyTheme(globals.theme)
	}

	app.config.idPrefix = (Math.random() + 1).toString(36).substring(7)
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

			// Docs mode flag (no DOM manipulation anymore)
			if (typeof document !== 'undefined' && context.viewMode === 'docs') {
				document.body.classList.add('storybook-docs-mode')
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
						'Reférentiel',
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
