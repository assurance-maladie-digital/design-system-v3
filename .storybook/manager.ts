import { addons } from 'storybook/manager-api'
<<<<<<< HEAD
import type { API } from 'storybook/manager-api'
=======
import { registerConformiteAddon } from './addons/conformite'
>>>>>>> d5234678 (refacto ok)
import cnamTheme from './CnamTheme'
import paTheme from './PaTheme'
import apTheme from './ApTheme'
import ap2026Theme from './Ap2026Theme'

const channel = addons.getChannel()
registerConformiteAddon()

type Theme = 'cnam' | 'pa' | 'ap' | 'ap2026'

const getCurrentTheme = (): Theme => {
	return (localStorage.getItem('storybook-theme') as Theme) ?? 'cnam'
}

const getThemeConfig = (theme: Theme) => {
	switch (theme) {
		case 'pa':
			return paTheme
		case 'ap':
			return apTheme
		case 'ap2026':
			return ap2026Theme
		default:
			return cnamTheme
	}
}

<<<<<<< HEAD
const applyThemeClass = (theme: Theme) => {
	document.documentElement.classList.remove(
		'theme-cnam',
		'theme-pa',
		'theme-ap',
		'theme-ap2026',
=======
// Components to display in AP theme
const apComponents = [
	'composants-boutons-backtotopbtn',
	'composants-boutons-copybtn',
	'composants-boutons-downloadbtn',
	'composants-boutons-langbtn',
	'composants-boutons-syiconbutton',
	'composants-boutons-usermenubtn',
	'composants-boutons-backbtn',
	'composants-composants-vuetify',
	'composants-composants-vuetify-introduction--docs',
	'composants-composants-vuetify-vbreadcrumbs--docs',
	'composants-composants-vuetify-vbtn--docs',
	'composants-composants-vuetify-vcard--docs',
	'composants-composants-vuetify-vcarousel--docs',
	'composants-composants-vuetify-vnavigationdrawer--docs',
	'composants-composants-vuetify-votpinput--docs',
	'composants-composants-vuetify-vskeletonloader--docs',
	'composants-composants-vuetify-vslidegroup--docs',
	'composants-composants-vuetify-vstepper--docs',
	'composants-composants-vuetify-vswitch--docs',
	'composants-composants-vuetify-vtooltip--docs',
	'composants-données-accordion',
	'composants-données-chiplist',
	'composants-données-collapsiblelist',
	'composants-données-datalist',
	'composants-données-datalistgroup',
	'composants-données-filelist',
	'composants-données-filepreview',
	'composants-feedback-dialogbox',
	'composants-feedback-notificationbar',
	'composants-feedback-cookiebanner',
	'composants-feedback-ratingpicker',
	'composants-filtres-filtersidebar',
	'composants-filtres-searchlistfield',
	'composants-formulaires-captcha',
	'composants-formulaires-datepicker-introduction--docs',
	'composants-formulaires-datepicker-calendarmode',
	'composants-formulaires-datepicker-combinedmode',
	'composants-formulaires-datepicker-dateinput',
	'composants-formulaires-datepicker-validation',
	'composants-formulaires-datepicker-usages',
	'composants-formulaires-fileupload',
	'composants-formulaires-nirfield',
	'composants-formulaires-phonefield',
	'composants-formulaires-selects-syautocomplete',
	'composants-formulaires-selects-syselect',
	'composants-formulaires-selects-selectbtnfield',
	'composants-formulaires-sycheckbox',
	'composants-formulaires-sycheckboxgroup',
	'composants-formulaires-syradiogroup',
	'composants-formulaires-sytextarea',
	'composants-formulaires-sytextfield',
	'composants-formulaires-passwordfield',
	'composants-formulaires-uploadworkflow',
	'composants-formulaires-rangefield',
	'composants-formulaires-periodfield',
	'composants-formulaires-selects-syinputselect',
	'composants-layout-pagecontainer',
	'composants-navigation-contextualmenu',
	'composants-navigation-externallinks',
	'composants-navigation-skiplink',
	'composants-navigation-socialmedialinks',
	'composants-navigation-sybtnmenu',
	'composants-navigation-sypagination',
	'composants-navigation-sytabs',
	'composants-structure-footerbar',
	'composants-structure-headerbar',
	'composants-structure-headerloading',
	'composants-structure-headertoolbar',
	'composants-structure-subheader',
	'composants-tableaux-tabletoolbar',
	'composants-vue-d-ensemble--docs',
	'composants-tableaux-sytable',
	'composants-tableaux-syservertable',
	'composants-tableaux-paginatedtable',
]

// Get stored theme or default to CNAM
const storedTheme = typeof window !== 'undefined' ? localStorage.getItem('storybook-theme') : 'cnam'

const isExactMatch = (itemId: string, stories: string[]) =>
	stories.includes(itemId)

const isParentOfAllowedComponent = (itemId: string, stories: string[]) =>
	stories.some(story => story.startsWith(`${itemId}-`))

const isChildOfAllowedComponent = (itemId: string, stories: string[]) =>
	stories.some(
		story =>
			itemId.startsWith(`${story}--`)
			|| itemId.startsWith(`${story}-`),
>>>>>>> d5234678 (refacto ok)
	)

	document.documentElement.classList.add(`theme-${theme}`)
}

const hiddenIdsByTheme: Record<Theme, string[]> = {
	cnam: [
		'composants-structure-footerbar--back-office',
		'composants-structure-footerbar--with-phone-number',
		'composants-boutons-usermenubtn--with-ps-info',
		'composants-données-accordion--with-custom-content',
		'composants-layout-pagecontainer--with-header-and-footer',
		'guide-du-dev-équivalence-des-composants-amelipro--docs',
	],

	pa: [
		'composants-structure',
		'composants-boutons-usermenubtn--with-ps-info',
		'composants-données-accordion--with-custom-content',
		'composants-layout-pagecontainer--with-header-and-footer',
	],

	ap: [
		'composants-données-logo',
		'composants-données-logobrandsection',
		'guide-du-dev-formulaires-validation',
		'guide-du-dev-migration',
		'composants-boutons-franceconnectbtn',
	],

	ap2026: [
		'guide-du-dev',
		'guide-du-dev-migration',
		'design-tokens-conteneurs-de-page',
		'design-tokens-couleurs--border-section',
		'design-tokens-couleurs--overlay-section',
		'design-tokens-couleurs--interaction-section',
		'design-tokens-couleurs--disabled-section',
		'design-tokens-couleurs--feedback-section',
		'design-tokens-couleurs-correspondances-couleurs--docs',
		'démarrer-créer-une-issue--creeruneissue',
		'design-tokens-arrondis',
		'design-tokens-elevations',
		'design-tokens-styles-typographiques',
		'composants-vue-d-ensemble--docs',
	],
}

const allowedEquivalenceIdsByTheme: Partial<Record<Theme, string[]>> = {
	ap: [
			'guide-du-dev-équivalence-des-composants-amelipro',
		],

	pa: [
		'guide-du-dev-équivalence-des-composants-portail-agent',
	],
}

const makeThemeFilter = (theme: Theme) => {
	return (item: { id?: string, name?: string }) => {
		const id = (item.id ?? '').toLowerCase()
		const name = (item.name ?? '').toLowerCase()

		const hiddenIds = hiddenIdsByTheme[theme] ?? []

		if (
			hiddenIds.some(hiddenId =>
				id.startsWith(hiddenId),
			)
		) {
			return false
		}

		if (id.startsWith('guide-du-dev-équivalence-des-composants')) {
			const allowedIds
				= allowedEquivalenceIdsByTheme[theme] ?? []

			return allowedIds.some(allowedId =>
				id.startsWith(allowedId),
			)
		}

		if (theme === 'ap2026') {
			if (id.startsWith('templates')) {
				return false
			}

			if (id.startsWith('composants-')) {
				return id.startsWith('composants-amelipro')
			}

			return true
		}

		const isAmeliorate
			= id.includes('amelipro')
				|| name.includes('amelipro')

		return !isAmeliorate
	}
}

const getCurrentItemIdFromUrl = () => {
	const params = new URLSearchParams(window.location.search)
	const path = params.get('path') ?? ''
	const match = path.match(/docs\/(.+)$/)
	return match?.[1] ?? null
}

const updateTheme = (api: API, themeValue?: string) => {
	const theme = (themeValue ?? 'cnam') as Theme

	applyThemeClass(theme)

	addons.setConfig({
		theme: getThemeConfig(theme),
	})

	api.experimental_setFilter(
		'theme',
		makeThemeFilter(theme),
	)

	const currentItemId = getCurrentItemIdFromUrl()

	if (currentItemId) {
		const isAllowed = makeThemeFilter(theme)({
			id: currentItemId,
		})

		if (!isAllowed) {
			api.selectStory('démarrer-accueil--docs')
		}
	}
}
<<<<<<< HEAD
addons.register(
	'theme-sidebar-filter',
	(api) => {
		updateTheme(
			api,
			getCurrentTheme(),
		)

		channel.on(
			'storybook-theme-change',
			(theme) => {
				updateTheme(api, theme)
			},
		)
	},
)

if (typeof window !== 'undefined') {
	const originalSetItem
		= localStorage.setItem

	localStorage.setItem = function (
		key,
		value,
	) {
		originalSetItem.call(
			this,
			key,
			value,
		)

		if (key === 'storybook-theme') {
			channel.emit(
				'storybook-theme-change',
				value,
			)
		}
	}

	window.addEventListener(
		'storage',
		(event) => {
			if (
				event.key === 'storybook-theme'
			) {
				channel.emit(
					'storybook-theme-change',
					event.newValue ?? 'cnam',
				)
			}
		},
	)
=======
// Listen for theme changes from other tabs (storage event)
if (typeof window !== 'undefined') {
	// Override the localStorage.setItem method to detect changes in the current tab
	const originalSetItem = localStorage.setItem
	localStorage.setItem = function (key, value) {
		// Call the original method
		originalSetItem.apply(this, arguments)

		// If the theme is being changed, handle it
		if (key === 'storybook-theme') {
			handleThemeChange(value || 'cnam')
			channel.emit('storybook-theme-change', value)
		}
	}

	// Listen for storage events (from other tabs)
	window.addEventListener('storage', (event) => {
		if (event.key === 'storybook-theme') {
			handleThemeChange(event.newValue || 'cnam')
		}
	})
>>>>>>> d5234678 (refacto ok)
}
