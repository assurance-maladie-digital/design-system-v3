import { addons } from '@storybook/manager-api'
import cnamTheme from './CnamTheme'
import paTheme from './PaTheme'
import apTheme from './ApTheme'
import ap2026Theme from './Ap2026Theme'

const channel = addons.getChannel()

// Helper function to apply theme class to HTML root element
const applyThemeClass = (theme) => {
	const rootElement = document.documentElement // Always exists
	rootElement.classList.remove('theme-cnam', 'theme-pa', 'theme-ap', 'theme-ap2026')
	rootElement.classList.add(`theme-${theme}`)
}

// Get stored theme or default to CNAM
const storedTheme = typeof window !== 'undefined' ? localStorage.getItem('storybook-theme') : 'cnam'

if (typeof window !== 'undefined') {
	applyThemeClass(storedTheme || 'cnam')
}

const hiddenIdsByTheme: Record<string, string[]> = {
	cnam: [
		'guide-du-dev-convergence-des-ds',
		'composants-structure-footerbar--back-office',
		'composants-structure-footerbar--with-phone-number',
		'composants-boutons-usermenubtn--with-ps-info',
		'composants-données-accordion--with-custom-content',
		'composants-layout-pagecontainer--with-header-and-footer',
		'guide-du-dev-convergence-des-ds-équivalence-des-composants-amelipro--docs',
	],
	pa: [
		'composants-structure',
	],
	ap: [
		'composants-données-logo',
		'composants-données-logobrandsection',
	],
	ap2026: [
		'guide-du-dev',
		'guide-du-dev-convergence-des-ds',
		'guide-du-dev-migration',
		'design-tokens-conteneurs-de-page',
		'démarrer-créer-une-issue--creeruneissue',
		'design-tokens-arrondis',
		'design-tokens-elevations',
		'design-tokens-styles-typographiques',
		'Vue d\'ensemble',
	],
}

const allowedConvergenceIdsByTheme: Record<string, string[]> = {
	ap: [
		'guide-du-dev-convergence-des-ds-équivalence-des-composants-amelipro',
	],
	pa: [
		'guide-du-dev-convergence-des-ds-équivalence-des-composants-portail-agent',
	],
}

addons.setConfig({
	theme: storedTheme === 'pa'
		? paTheme
		: storedTheme === 'ap'
			? apTheme
			: storedTheme === 'ap2026'
				? ap2026Theme
				: cnamTheme,

	sidebar: {
		filters: {
			filter: (item) => {
				const theme = localStorage.getItem('storybook-theme') ?? 'cnam'

				const id = (item.id ?? '').toLowerCase()
				const name = (item.name ?? '').toLowerCase()

				// Masquer des dossiers/stories suivant le thème
				const hiddenIds = hiddenIdsByTheme[theme] ?? []
				if (hiddenIds.some(hiddenId => id.startsWith(hiddenId))) {
					return false
				}

				// Cas particulier du dossier Convergence des DS
				if (id.startsWith('guide-du-dev-convergence-des-ds-')) {
					const allowedIds = allowedConvergenceIdsByTheme[theme] ?? []
					return allowedIds.some(allowedId => id.startsWith(allowedId))
				}

				if (theme === 'ap2026') {
					if (id.startsWith('templates')) return false

					if (id.startsWith('composants-')) {
						return id.startsWith('composants-amelipro')
					}

					return true
				}

				const isAmelipro = id.includes('amelipro') || name.includes('amelipro')

				return !isAmelipro
			} },
	},
})

const getCurrentItemIdFromUrl = () => {
	const params = new URLSearchParams(window.location.search)
	const path = params.get('path') || ''
	const match = path.match(/docs\/(.+)$/)
	return match ? match[1] : null
}

const navigateToDocsStory = (itemId: string) => {
	const params = new URLSearchParams(window.location.search)
	const globals = params.get('globals')

	const newUrl = `?path=/docs/${encodeURIComponent(itemId)}${
		globals ? `&globals=${globals}` : ''
	}`

	window.location.replace(newUrl)
}

const handleThemeChange = (newTheme) => {
	document.documentElement.style.opacity = '0'

	const currentItemId = getCurrentItemIdFromUrl()

	if (currentItemId) {
		const currentItem = document.querySelector(
			`.sidebar-item[data-item-id="${currentItemId}"]`,
		) as HTMLElement | null

		const isHidden = currentItem && currentItem.style.display === 'none'

		if (isHidden) {
			navigateToDocsStory('démarrer-accueil--docs')
			return
		}
	}

	// Update Storybook theme
	addons.setConfig({
		theme: newTheme === 'pa'
			? paTheme
			: newTheme === 'ap'
				? apTheme
				: newTheme === 'ap2026'
					? ap2026Theme
					: cnamTheme,
	})

	window.location.reload()

	applyThemeClass(newTheme)

	setTimeout(() => {
		document.documentElement.style.opacity = '1'
	}, 0)
}
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
}
