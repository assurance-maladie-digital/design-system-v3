import 'vuetify/styles'
import { watch } from 'vue'
import './storybook.css'
import type { Preview } from '@storybook/vue3'
import { setup } from '@storybook/vue3'
import { createVuetifyInstance } from '../src/vuetifyConfig'

const vuetify = createVuetifyInstance()

const cnamStoryOrder = [
	'Démarrer',
	['Accueil', 'Introduction', 'Politique de confidentialité', 'Créer une issue'],
	'Accessibilité',
	[
		'Introduction',
		'Aculturation', ['Sensibilisation à l’accessibilité numérique'],
		'Kit de pré-audit', ['Introduction', 'Kick-off échantillonnage', 'Pré-audit', 'Outils', ['Introduction', 'Tanaguru']],
		'Audit', ['RGAA'],
	],
	'Éco-conception',
	[
		'Introduction',
	],
	'Design Tokens',
	['Introduction', 'Couleurs', 'Typographie', 'Styles typographiques', 'Conteneurs de page', 'Espacements', 'Arrondis', 'Elévations', 'Thème Portail Agent'],
	'Composants',
	[
		'Vue d\'ensemble',
		'Structure', ['HeaderBar', 'HeaderToolbar', 'HeaderLoading', 'SubHeader', 'FooterBar', 'FooterWrapper'],
		'Layout', ['PageContainer'],
		'Navigation', ['ContextualMenu', 'ExternalLinks', 'SocialMediaLinks', 'SkipLink'],
		'Boutons', ['BackBtn', 'BackToTopBtn', 'CopyBtn', 'LangBtn', 'DownloadBtn', 'FranceConnectBtn', 'UserMenuBtn'],
		'Formulaires', ['SyTextField', 'SySelect', 'SyInputSelect', 'SyBtnSelect', 'DatePicker', 'FileUpload', 'NirField', 'PasswordField', 'PeriodField', 'PhoneField', 'RangeField', 'SearchListField', 'SelectBtnField', 'UploadWorkflow', 'SyBtnSelect'],
		'Tableaux', ['PaginatedTable', 'TableToolbar'],
		'Filtres', ['FiltersInline', 'FiltersSideBar', 'FilterModule'],
		'Données', ['Logo', 'LogoBrandSection', 'CollapsibleList', 'ChipList', 'DataList', 'DataListGroup', 'FilePreview', 'FileList'],
		'Feedback', ['SyAlert', 'DialogBox', 'NotificationBar', 'CookieBanner', 'RatingPicker'],
	],
	'Templates', ['Vue d\'ensemble', 'ErrorPage', 'MaintenancePage', 'NotFoundPage'],
	'Guide du dev', ['Migration depuis Bridge', 'Migration depuis Vue2', 'Utiliser les rules', 'VuetifyOptions', 'Services'],
]

const paStoryOrder = [
	'Démarrer',
	['Accueil', 'Introduction', 'Politique de confidentialité', 'Créer une issue'],
]

setup((app, { globals }) => {
	app.use(vuetify)
    app.config.idPrefix = (Math.random() + 1).toString(36).substring(7)

	// Apply theme class to <html> (document.documentElement) instead of #root
	const applyThemeClass = (theme) => {
		const rootElement = document.documentElement // Always exists
		rootElement.classList.remove('theme-cnam', 'theme-pa')
		rootElement.classList.add(`theme-${theme}`)
	}

	// Apply theme immediately on load
	if (typeof window !== 'undefined') {
		applyThemeClass(globals.theme)
	}

	watch(
		() => globals.theme,
		(newTheme) => {
			// Update Vuetify theme
			vuetify.theme.global.name.value = newTheme

			// Apply the new theme class
			applyThemeClass(newTheme)

			// Store theme in localStorage
			localStorage.setItem('storybook-theme', newTheme)
		},
		{ immediate: true },
	)
})

const globalTypes = {
	theme: {
		name: 'Theme',
		description: 'Switch between CNAM and PA themes',
		defaultValue: 'cnam',
		toolbar: {
			title: 'Thèmes',
			icon: 'paintbrush',
			items: [
				{ value: 'cnam', title: 'Thème CNAM' },
				{ value: 'pa', title: 'Thème PA' },
			],
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
			// Handle theme changes
			if (typeof window !== 'undefined' && context.globals.theme !== vuetify.theme.global.name.value) {
				vuetify.theme.global.name.value = context.globals.theme
				document.documentElement.classList.remove('theme-cnam', 'theme-pa')
				document.documentElement.classList.add(`theme-${context.globals.theme}`)
				localStorage.setItem('storybook-theme', context.globals.theme)
				window.location.reload()
			}
			return story()
		},
	],
	parameters: {
		interactions: {
			disable: true,
		},
		storySort: {
			order: localStorage.getItem('storybook-theme') === 'pa' ? paStoryOrder : cnamStoryOrder,
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
	},
}

export default preview
