import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { watch } from 'vue'

import './storybook.css'
import type { Preview } from '@storybook/vue3'
import { setup } from '@storybook/vue3'
import {
	cnamColorsTokens,
	cnamContextualTokens,
	cnamLightTheme,
	paColorsTokens,
	paContextualTokens,
	paLightTheme,
} from '../src/designTokens'

import { createFlattenTheme } from '../src/designTokens/utils'

const vuetify = createVuetify({
	components,
	directives,
	theme: {
		defaultTheme: 'cnam',
		themes: {
			cnam: {
				dark: false,
				colors: {
					...cnamLightTheme,
				},
				variables: {
					'border-color': cnamColorsTokens.grey.base,
					...createFlattenTheme(cnamContextualTokens),
				},
			},
			pa: {
				dark: false,
				colors: {
					...paLightTheme,
				},
				variables: {
					'border-color': paColorsTokens.grey.base,
					...createFlattenTheme(paContextualTokens),
				},
			},
		},
	},
	icons: {
		defaultSet: 'mdi',
		aliases,
		sets: {
			mdi,
		},
	},
})

setup((app, { globals }) => {
	app.use(vuetify)

	// Track if this is initial load
	let isInitialLoad = true

	// Update Vuetify theme based on Storybook global theme
	vuetify.theme.global.name.value = globals.theme

	watch(
		() => globals.theme,
		async (newTheme) => {
			console.log(`Switching theme to: ${newTheme}`)

			if (isInitialLoad) {
				isInitialLoad = false
				return
			}

			// Set new theme
			vuetify.theme.global.name.value = newTheme

			// Update document classes
			document.documentElement.classList.remove('theme-cnam', 'theme-pa')
			document.documentElement.classList.add(`theme-${newTheme}`)

			// Store theme in localStorage
			localStorage.setItem('storybook-theme', newTheme)

			// Reload the page to apply theme changes
			window.location.reload()
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
		options: {
			storySort: {
				order: [
					'Démarrer',
					['Accueil', 'Introduction', 'Politique de confidentialité', 'Créer une issue'],
					'Accessibilité',
					[
						'Introduction',
						'Aculturation', ['Sensibilisation à l’accessibilité numérique'],
						'Kit de pré-audit', ['Introduction', 'Échantillonnage', 'Pré-audit', 'Outils', ['Introduction', 'Tanaguru']],
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
	},
}

export default preview
