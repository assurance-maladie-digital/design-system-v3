import 'vuetify/styles'
import './storybook.css'
import type { Preview } from '@storybook/vue3-vite'
import { setup } from '@storybook/vue3-vite'
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

			// Docs mode flag (no DOM manipulation anymore)
			if (typeof document !== 'undefined' && context.viewMode === 'docs') {
				document.body.classList.add('storybook-docs-mode')
			}

			const channel = (window as any).__STORYBOOK_ADDONS_CHANNEL__

			const argTypes = context.argTypes || {}
			const args = context.args || {}

			const props = Object.entries(argTypes)
				.filter(([name, config]: any) =>
					config?.table?.category === 'props'
					&& !['default'].includes(name),
				)

			const slots = Object.entries(argTypes)
				.filter(([, config]: any) =>
					config?.table?.category === 'slots',
				)

			const documentedProps = props.filter(([, config]: any) =>
				Boolean(config?.description),
			)

			const documentedSlots = slots.filter(([, config]: any) =>
				Boolean(config?.description),
			)

			const issues: string[] = []
			const missingRequiredStories: string[] = []

			const missingDescriptions: string[] = []
			const badBooleanNames: string[] = []
			const badEventNames: string[] = []

			props.forEach(([name, config]: any) => {
				const typeName = String(
					config?.type?.name
					|| config?.type?.summary
					|| config?.table?.type?.summary
					|| '',
				)

				if (!config?.description) {
					missingDescriptions.push(name)
				}

				if (
					typeName.includes('boolean')
					&& !/^(is|has|can|should)[A-Z]/.test(name)
				) {
					badBooleanNames.push(name)
				}

				if (
					typeName.includes('function')
					|| typeName.includes('=>')
				) {
					if (!/^on[A-Z]/.test(name)) {
						badEventNames.push(name)
					}
				}
			})

			const originalSource = context.parameters?.docs?.source?.originalSource || ''
			const sourceCode = context.parameters?.docs?.source?.code || ''
			const sourceCodeCombined = `${originalSource}\n${sourceCode}`

			const hasTemplate
	= /name:\s*['"`]Template['"`]/.test(sourceCodeCombined)
		|| sourceCodeCombined.includes('<template')

			const hasScript
	= /name:\s*['"`]Script['"`]/.test(sourceCodeCombined)
		|| sourceCodeCombined.includes('<script')

			const sourceCodeStatus = hasTemplate && hasScript
				? 'Présent'
				: 'Incomplet'

			const storyId = context.id || ''
			const storyName = context.name || ''

			const isFormComponent = String(context.title || '')
				.toLowerCase()
				.includes('formulaires')

			const requiredStoryNames = ['disabled', 'required', 'form-validation']

			const componentId = String(context.id || '').split('--')[0].toLowerCase()

			const sidebarStories = Array.from(
				window.parent.document.querySelectorAll('.sidebar-item'),
			).map((item: any) => ({
				text: String(item.textContent || '').trim().toLowerCase(),
				id: String(item.getAttribute('data-item-id') || '').toLowerCase(),
			}))

			if (isFormComponent) {
				requiredStoryNames.forEach((requiredStory) => {
					const exists = sidebarStories.some(item =>
						item.id.startsWith(componentId)
						&& (
							item.id.includes(requiredStory)
							|| item.text.includes(requiredStory.replace('-', ' '))
							|| item.text.includes(requiredStory.replace('-', ''))
						),
					)

					if (!exists) {
						missingRequiredStories.push(requiredStory)
					}
				})
			}

			const requiredStoriesStatus = isFormComponent
				? missingRequiredStories.length
					? `Partiel — manquantes : ${missingRequiredStories.join(', ')}`
					: 'Complètes'
				: ''

			const propsAndSlotsTotal = props.length + slots.length
			const documentedTotal = documentedProps.length + documentedSlots.length

			const docStatus = `${documentedTotal}/${propsAndSlotsTotal} documentés`

			const componentName = context.title.split('/').at(-1)

			const hasUsagesStory = Array.from(
				window.parent.document.querySelectorAll('.sidebar-item'),
			).some((item: any) => {
				const itemText = String(item.textContent || '').trim().toLowerCase()
				const itemId = String(item.getAttribute('data-item-id') || '').toLowerCase()
				const componentId = String(context.id || '').split('--')[0].toLowerCase()

				return (
					itemText === 'usages'
					&& itemId.startsWith(componentId)
				)
			})

			const usagePageStatus = hasUsagesStory
				? 'Présente'
				: 'Absente'

			const isHeaderOrFooter = ['HeaderBar', 'FooterBar'].includes(componentName)

			const storyLabel = `${context.id} ${context.name}`.toLowerCase()

			const visualThemeStatus = isHeaderOrFooter
				? storyLabel.includes('dark') || storyLabel.includes('custom-theme')
					? 'dark'
					: 'light'
				: ''
			const themeModeStatus = context.globals.theme || 'Non défini'

			const playgroundStatus = props.length > 0
				? 'Présent'
				: 'Absent'

			const criticality = [
				missingDescriptions.length
					? `Description manquante : ${missingDescriptions.join(', ')}`
					: '',

				badBooleanNames.length
					? `Bool mal nommé : ${badBooleanNames.join(', ')}`
					: '',

				badEventNames.length
					? `Event mal nommé : ${badEventNames.join(', ')}`
					: '',

				...(isFormComponent && missingRequiredStories.length
					? [
							`Story requise manquante : ${missingRequiredStories.join(', ')}`,
						]
					: []),
			]
				.filter(Boolean)
				.join(' | ') || 'RAS'

			const score = propsAndSlotsTotal
				? Math.max(
						0,
						Math.round((documentedTotal / propsAndSlotsTotal) * 100 - issues.length * 3),
					)
				: 100

			channel?.emit('conformite-design-system/result', {
				component: context.title.split('/').at(-1),
				componentCategory: context.title,
				story: storyName,
				doc: docStatus,
				sourceCode: sourceCodeStatus,
				requiredStories: requiredStoriesStatus,
				usagePage: usagePageStatus,
				visualTheme: visualThemeStatus,
				themeMode: themeModeStatus,
				playground: playgroundStatus,
				criticality,
				score,
			})

			return story()
		},
	],
	parameters: {
		interactions: {
			disable: true,
		},
		docs: {
			controls: { sort: 'alpha' },
			argTypes: { sort: 'alpha' },
		},
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
						'Acculturation', ['Sensibilisation à l’accessibilité numérique'],
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
						'Équivalence des composants', ['Portail Agent', 'Amelipro'],
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
			sort: 'alpha',
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
