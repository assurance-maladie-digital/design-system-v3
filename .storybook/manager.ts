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

// Stories to hide depending theme
const ap2026OnlyStories = [
	'design-tokens-couleurs--border-section',
	'design-tokens-couleurs--text-section',
	'design-tokens-couleurs--icon-section',
	'design-tokens-couleurs--accent-section',
	'design-tokens-couleurs--interactive-section',
]
const apOnlyStories = [
	'composants-structure-footerbar--back-office',
	'composants-structure-footerbar--with-phone-number',
	'composants-boutons-usermenubtn--with-ps-info',
	'composants-données-accordion--with-custom-content',
	'composants-layout-pagecontainer--with-header-and-footer',
]

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
	'composants-données-filepreview',
	'composants-feedback-dialogbox',
	'composants-feedback-notificationbar',
	'composants-feedback-cookiebanner',
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
	'composants-layout-pagecontainer',
    'composants-navigation-contextualmenu',
    'composants-navigation-skiplink',
    'composants-navigation-sypagination',
    'composants-navigation-sytabs',
    'composants-navigation-sybtnmenu',
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
	)

const shouldShowApComponent = (item, itemId, theme) => {
	const isAp2026 = theme === 'ap2026'
	const isNotAp = theme !== 'ap'
	const isAp = theme === 'ap'
	const hideAmelipro = ['pa', 'cnam', 'ap'].includes(theme)

	const hiddenWhenAp = new Set([
		'composants-structure-headerbar--prepend-slot',
		'composants-structure-headerbar--with-header-toolbar',
		'composants-structure-headerbar-headernavigationbar',
		'composants-structure-headerbar--usages',
	])

	// Convergence des DS / Équivalence des composants : toujours visible, quel que soit le thème
	if (itemId.startsWith('guide-du-dev-convergence-des-ds')) {
		item.style.display = 'block'
		return
	}

	// Dossier Migration : entièrement masqué en thèmes pa, ap et ap2026 (visible uniquement en cnam).
	if (itemId.startsWith('guide-du-dev-migration')) {
		item.style.display = (theme === 'pa' || theme === 'ap' || theme === 'ap2026') ? 'none' : 'block'
		return
	}

	if (itemId === 'composants-amelipro') {
		item.style.display = hideAmelipro ? 'none' : 'block'
		return
	}

	if (hiddenWhenAp.has(itemId)) {
		item.style.display = isAp ? 'none' : 'block'
		return
	}

	if (isAp) {
		const isComponentTree = itemId.startsWith('composants')

		if (!isComponentTree) {
			item.style.display = ''
			return
		}

		const shouldShow = isExactMatch(itemId, apComponents)
			|| isParentOfAllowedComponent(itemId, apComponents)
			|| isChildOfAllowedComponent(itemId, apComponents)

		item.style.display = shouldShow ? '' : 'none'
		return
	}
	if (isAp2026 && isExactMatch(itemId, ap2026OnlyStories)) {
		item.style.display = 'none'
		return
	}

	if (isNotAp && isExactMatch(itemId, apOnlyStories)) {
		item.style.display = 'none'
		return
	}
}

const applyThemeSidebar = (theme) => {
	const processSidebar = () => {
		const sidebar = document.querySelector('.sidebar-container')

		// First pass: identify if amelipro should be hidden
		const hideAmelipro = ['pa', 'cnam'].includes(theme)
		// When AP theme is active, only show Amelipro components
		const isAp2026 = theme === 'ap2026'
		const isNotAp = theme !== 'ap'
		const isAp = theme === 'ap'
		const isPa = theme === 'pa'

		if (sidebar) {
			// First, reset display of all items if we're coming from AP theme
			// This ensures components are properly restored when switching from AP to other themes
			if (isAp) {
				const allItems = sidebar.querySelectorAll('.sidebar-item, .sidebar-subheading') as NodeListOf<HTMLElement>
				allItems.forEach((item) => {
					// Reset display to default
					item.style.display = ''
				})
			}

			const items = sidebar.querySelectorAll('.sidebar-item') as NodeListOf<HTMLElement>

			// Hide or show items based on theme
			items.forEach((item) => {
				item.style.display = 'block'
				const itemId = item.getAttribute('data-item-id') || ''

				// Convergence des DS / Équivalence des composants : toujours visible, quel que soit le thème
				if (itemId.startsWith('guide-du-dev-convergence-des-ds')) {
					item.style.display = 'block'
					return
				}

				// Dossier Migration : entièrement masqué en thèmes pa, ap et ap2026 (visible uniquement en cnam).
				if (itemId.startsWith('guide-du-dev-migration')) {
					item.style.display = (theme === 'pa' || theme === 'ap' || theme === 'ap2026') ? 'none' : 'block'
					return
				}

				// Handle design tokens container page
				if (item.querySelector('a#design-tokens-conteneurs-de-page--docs')) {
					item.style.display = theme === 'cnam' ? 'block' : 'none'
				}

				if (isAp2026 && isExactMatch(itemId, ap2026OnlyStories)) {
					item.style.display = 'none'
				}

				if (isNotAp && isExactMatch(itemId, apOnlyStories)) {
					item.style.display = 'none'
				}

				shouldShowApComponent(item, itemId, theme)

				// Hide Structure folder and its components when PA theme is active
				if (isPa && itemId.startsWith('composants-structure')) {
					item.style.display = 'none'
				}

				// For AP theme, hide all components except those in Amelipro folder
				// Handle amelipro components folder
				const isAmeliproFolder = item.getAttribute('data-item-id') === 'composants-amelipro'

				if (isAp2026) {
					// Get item ID and text content
					const itemId = item.getAttribute('data-item-id') || ''

					// Check if this is a component folder (but not Amelipro)
					const isComponentFolder = itemId.startsWith('composants-') && !isAmeliproFolder
					if (isComponentFolder) {
						item.style.display = 'none'
					}
				}

				// Handle the "Créer une issue" page - hide it when AP theme is active
				if (item.querySelector('a[id^="démarrer-créer-une-issue--creeruneissue"]')) {
					item.style.display = isAp2026 ? 'none' : 'block'
				}

				// Handle the "Conteneurs de page" page - hide it when AP theme is active
				if (item.querySelector('a[id^="design-tokens-conteneurs-de-page"]')) {
					item.style.display = isAp2026 ? 'none' : 'block'
				}

				// Handle the "Arrondis" page - hide it when AP theme is active
				if (item.querySelector('a[id*="design-tokens-arrondis"]')) {
					item.style.display = isAp2026 ? 'none' : 'block'
				}

				// Handle the "Elevations" page - hide it when AP theme is active
				if (item.querySelector('a[id*="design-tokens-elevations"]')) {
					item.style.display = isAp2026 ? 'none' : 'block'
				}

				// Handle the "Styles typographiques" page - hide it when AP theme is active
				if (item.querySelector('a[id*="design-tokens-styles-typographiques"]')) {
					item.style.display = isAp2026 ? 'none' : 'block'
				}

				// Handle the "Vue d'ensemble" page - hide it when AP theme is active
				if (item.textContent && item.textContent.includes('Vue d\'ensemble')) {
					item.style.display = isAp2026 ? 'none' : 'block'
				}

				// Get item ID and text content once for all checks
				const itemText = item.textContent || ''

				// Handle all items containing 'amelipro' in their ID or text content
				if (!isAmeliproFolder && (itemId.toLowerCase().includes('amelipro') || itemText.toLowerCase().includes('amelipro'))) {
					item.style.display = hideAmelipro ? 'none' : 'block'
				}

				// Target any element with Templates text - case insensitive
				if (itemText && itemText.toLowerCase().includes('templates')) {
					// console.log('Found element with Templates text:', itemText)
					item.style.display = isAp2026 ? 'none' : 'block'
				}
			})

			// Second pass: find all links related to amelipro components
			if (hideAmelipro) {
				const allLinks = sidebar.querySelectorAll('a[id]') as NodeListOf<HTMLAnchorElement>
				allLinks.forEach((link) => {
					const linkId = link.id || ''
					const linkText = link.textContent || ''
					// Convergence des DS (dont équivalence Amelipro) : toujours visible, ne pas masquer
					if (linkId.startsWith('guide-du-dev-convergence-des-ds')) {
						return
					}
					if (linkId.toLowerCase().includes('amelipro') || linkText.toLowerCase().includes('amelipro')) {
						// Find the parent sidebar item and hide it
						let parent = link.parentElement
						while (parent && !parent.classList.contains('sidebar-item')) {
							parent = parent.parentElement
						}
						if (parent) {
							(parent as HTMLElement).style.display = 'none'
						}
					}
				})
			}

			// Third pass: if AP theme, hide all component folders except Amelipro
			if (isAp2026) {
				// First hide all templates related elements
				// 1. Hide all template sections and their content completely
				const templateSections = sidebar.querySelectorAll('.sidebar-item[data-item-id*="templates"], .sidebar-item[data-nodeid*="templates"]')
				templateSections.forEach((el) => {
					(el as HTMLElement).style.display = 'none'
				})

				// 2. Hide template headings
				const allHeadings = sidebar.querySelectorAll('.sidebar-subheading')
				allHeadings.forEach((heading) => {
					const el = heading as HTMLElement
					if (el.textContent && el.textContent.toLowerCase().includes('template')) {
						el.style.display = 'none'

						// Also hide the next element which is usually the container
						if (el.nextElementSibling) {
							(el.nextElementSibling as HTMLElement).style.display = 'none'
						}
					}
				})

				// 3. Hide any sidebar items containing "templates" in their text
				const allSidebarItems = sidebar.querySelectorAll('.sidebar-item')
				allSidebarItems.forEach((item) => {
					const el = item as HTMLElement
					if (el.textContent && el.textContent.toLowerCase().includes('template')) {
						el.style.display = 'none'
					}
				})

				// 4. Now process all links to hide non-Amelipro components
				const allLinks = sidebar.querySelectorAll('a[id]') as NodeListOf<HTMLAnchorElement>
				allLinks.forEach((link) => {
					const linkId = link.id || ''
					const linkText = link.textContent || ''

					// Skip Amelipro components
					if (linkId.toLowerCase().includes('amelipro') || linkText.toLowerCase().includes('amelipro')) {
						return
					}

					// Hide templates and other components
					if (linkId.startsWith('composants-')
						|| linkId.toLowerCase().includes('template')
						|| linkText.toLowerCase().includes('template')) {
						// Find the parent sidebar item and hide it
						let parent = link.parentElement
						while (parent && !parent.classList.contains('sidebar-item')) {
							parent = parent.parentElement
						}
						if (parent) {
							(parent as HTMLElement).style.display = 'none'
						}
					}
				})
			}

			// Find the Templates section in the sidebar - this is now handled in the third pass for AP theme
			// but we keep this for other themes
			if (theme !== 'ap') {
				const templatesHeading = Array.from(sidebar.querySelectorAll('.sidebar-subheading')).find(
					heading => heading.textContent && heading.textContent.trim() === 'Templates',
				) as HTMLElement | undefined

				// If we found the Templates heading, handle it and its container
				if (templatesHeading) {
					// Only modify the display property, preserving other styles
					templatesHeading.style.display = ''

					// Find and handle the container element (usually the next sibling)
					const templatesContainer = templatesHeading.nextElementSibling as HTMLElement | null
					if (templatesContainer) {
						// Reset to original display value or use a sensible default
						templatesContainer.style.display = ''
					}
				}

				// Also look for any elements with data-item-id="templates"
				const templateItems = sidebar.querySelectorAll('[data-item-id="templates"]')
				templateItems.forEach((item) => {
					const templateItem = item as HTMLElement
					// Reset to original display value
					templateItem.style.display = ''
				})

				// Find any sidebar items that contain Templates
				const sidebarItems = sidebar.querySelectorAll('.sidebar-item')
				sidebarItems.forEach((item) => {
					if (item.textContent && item.textContent.includes('Templates')) {
						const templateItem = item as HTMLElement
						// Reset to original display value
						templateItem.style.display = ''
					}
				})
			}

			if (observer) {
				observer.disconnect()
			}
		}
	}

	let observer: MutationObserver | null = null

	const startObserving = () => {
		if (document.querySelector('.sidebar-container')) {
			processSidebar()
			return
		}

		observer = new MutationObserver(() => {
			if (document.querySelector('.sidebar-container')) {
				processSidebar()
			}
		})

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		})

		setTimeout(() => {
			if (observer) {
				observer.disconnect()
			}
		}, 10000)
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', startObserving)
	}
	else {
		startObserving()
	}
}

const observeSidebar = () => {
	const attachObserver = () => {
		const sidebar = document.querySelector('.sidebar-container')

		if (!sidebar) return

		const observer = new MutationObserver(() => {
			const theme = localStorage.getItem('storybook-theme')

			const items = sidebar.querySelectorAll('.sidebar-item') as NodeListOf<HTMLElement>

			items.forEach((item) => {
				const itemId = item.getAttribute('data-item-id') || ''
				shouldShowApComponent(item, itemId, theme)
			})
		})

		observer.observe(sidebar, { childList: true, subtree: true })
	}

	attachObserver()

	const bodyObserver = new MutationObserver(() => {
		attachObserver()
		const sidebar = document.querySelector('.sidebar-container')
		if (sidebar) bodyObserver.disconnect()
	})

	bodyObserver.observe(document.body, { childList: true, subtree: true })
}
if (typeof window !== 'undefined') {
	applyThemeClass(storedTheme || 'cnam')
	setTimeout(() => {
		applyThemeSidebar(storedTheme || 'cnam')
		observeSidebar()
	}, 100)
}

addons.setConfig({
	theme: storedTheme === 'pa'
		? paTheme
		: storedTheme === 'ap'
			? apTheme
			: storedTheme === 'ap2026'
				? ap2026Theme
				: cnamTheme,
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

	applyThemeClass(newTheme)

	applyThemeSidebar(newTheme)

	if (newTheme !== 'ap') {
		setTimeout(() => {
			applyThemeSidebar(newTheme)
		}, 0)
	}

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
