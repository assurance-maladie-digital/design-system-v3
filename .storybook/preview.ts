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
					// ...bootstrapLightTheme,
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
})

const preview: Preview = {
	parameters: {
		interactions: {
			disable: true,
		},
		options: {
			storySort: {
				order: ['Démarrer', ['Accueil', 'Politique de confidentialité'], 'Composants', ['Structure', ['HeaderBar', 'HeaderToolbar', 'HeaderLoading', 'SubHeader', 'FooterBar', 'FooterWrapper'], 'Layout', ['PageContainer'], 'Navigation', ['ContextualMenu', 'ExternalLinks', 'SocialMediaLinks', 'SkipLink'], 'Boutons', ['BackBtn', 'BackToTopBtn', 'CopyBtn', 'LangBtn', 'DownloadBtn', 'FranceConnectBtn', 'UserMenuBtn'], 'Formulaires', ['CustomTextField', 'CustomSelect', 'CustomInputSelect', 'DatePicker', 'FileUpload', 'NirField', 'PasswordField', 'PeriodField', 'PhoneField', 'RangeField', 'SearchListField', 'SelectBtnField', 'UploadWorkflow'], 'Tableaux', ['PaginatedTable', 'TableToolbar'], 'Filtres', ['FiltersInline', 'FiltersSideBar', 'FilterModule'], 'Données', ['Logo', 'LogoBrandSection', 'CollapsibleList', 'ChipList', 'DataList', 'DataListGroup', 'FilePreview', 'FileList'], 'Feedback', ['Alert', 'DialogBox', 'NotificationBar', 'CookieBanner', 'RatingPicker']], 'Templates', 'Fondamentaux', ['Introduction', 'Couleurs', 'Typographie', 'Styles typographiques', 'Conteneurs de page', 'Espacements', 'Arrondis', 'Elévations', 'Customisation et thèmes'], 'Guidelines', ['Accessibilité', 'Eco-conception']],
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
