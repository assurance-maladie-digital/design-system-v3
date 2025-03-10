import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import './storybook.css'
import type { Preview } from '@storybook/vue3'
import { setup } from '@storybook/vue3'
import { cnamLightTheme, cnamDarkTheme, cnamContextualTokens, cnamColorsTokens } from '../src/designTokens'
import { createFlattenTheme } from '../src/designTokens/utils'

const vuetify = createVuetify({
	components,
	directives,
	theme: {
		themes: {
			light: {
				dark: false,
				colors: {
					...cnamLightTheme,
					...cnamDarkTheme,
					// ...paLightTheme,
					// ...paDarkTheme,
				},
				variables: {
					'border-color': cnamColorsTokens.grey.base,
					...createFlattenTheme(cnamContextualTokens),
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

setup((app) => {
	app.use(vuetify)
	app.config.idPrefix = (Math.random() + 1).toString(36).substring(7)
})

const preview: Preview = {
	parameters: {
		interactions: {
			disable: true,
		},
		options: {
			storySort: {
				order: [
					'Démarrer',
					['Accueil', 'Politique de confidentialité'],
					'Accessibilité',
					[
						'Introduction',
						'Aculturation', ['Sensibilisation à l’accessibilité numérique', 'Demander un audit RGAA'],
						'Kit de pré-audit', ['Introduction', 'Kick-off échantillonnage', 'Outils', 'Pré-audit'],
					],
					'Composants',
					[
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
					'Templates',
					'Fondamentaux',
					['Introduction', 'Couleurs', 'Typographie', 'Styles typographiques', 'Conteneurs de page', 'Espacements', 'Arrondis', 'Elévations', 'Customisation et thèmes'],
					'Guidelines', ['Accessibilité', 'Eco-conception', 'Vuetify'],
					'Guide du dev', ['Créer une issue', 'Migration Vue3', 'Migration Vue2', 'Utiliser les rules', 'VuetifyOptions', 'Services'],
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
	initialGlobals: {
		vueMdx: {
			beforeVueAppMount(app): void {
				app.use(vuetify)
			},
		},
	},
}

export default preview
