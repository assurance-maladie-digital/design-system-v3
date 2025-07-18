import { addons } from '@storybook/manager-api'
import cnamTheme from './CnamTheme'
import paTheme from './PaTheme'
import apTheme from './ApTheme'

// Helper function to apply theme class to HTML root element
const applyThemeClass = (theme) => {
	const rootElement = document.documentElement // Always exists
	rootElement.classList.remove('theme-cnam', 'theme-pa', 'theme-ap')
	rootElement.classList.add(`theme-${theme}`)
}

const applyThemeSidebar = (theme) => {
	const processSidebar = () => {
		const sidebar = document.querySelector('.sidebar-container')

		if (sidebar) {
			const items = sidebar.querySelectorAll('.sidebar-item') as NodeListOf<HTMLElement>

			// First pass: identify if amelipro should be hidden
			const hideAmelipro = theme === 'pa' || theme === 'cnam'
			// When AP theme is active, only show Amelipro components
			const showOnlyAmelipro = theme === 'ap'

			// Hide or show items based on theme
			items.forEach((item) => {
				// Handle design tokens container page
				if (item.querySelector('a#design-tokens-conteneurs-de-page--docs')) {
					item.style.display = theme === 'cnam' ? 'block' : 'none'
				}

				// Handle amelipro components folder
				const isAmeliproFolder = item.getAttribute('data-item-id') === 'composants-amelipro'
				if (isAmeliproFolder) {
					item.style.display = hideAmelipro ? 'none' : 'block'
				}

				// For AP theme, hide all components except those in Amelipro folder
				if (showOnlyAmelipro) {
					// Get item ID and text content
					const itemId = item.getAttribute('data-item-id') || ''
					const itemText = item.textContent || ''

					// Check if this is a component folder (but not Amelipro)
					const isComponentFolder = itemId.startsWith('composants-') && !isAmeliproFolder
					if (isComponentFolder) {
						item.style.display = 'none'
					}
				}

				// Handle the "Créer une issue" page - hide it when AP theme is active
				if (item.querySelector('a[id^="démarrer-créer-une-issue--creeruneissue"]')) {
					item.style.display = theme === 'ap' ? 'none' : 'block'
				}

				// Handle the "Conteneurs de page" page - hide it when AP theme is active
				if (item.querySelector('a[id^="design-tokens-conteneurs-de-page"]')) {
					item.style.display = theme === 'ap' ? 'none' : 'block'
				}

				// Handle the "Arrondis" page - hide it when AP theme is active
				if (item.querySelector('a[id*="design-tokens-arrondis"]')) {
					item.style.display = theme === 'ap' ? 'none' : 'block'
				}

				// Handle the "Elevations" page - hide it when AP theme is active
				if (item.querySelector('a[id*="design-tokens-elevations"]')) {
					item.style.display = theme === 'ap' ? 'none' : 'block'
				}

				// Handle the "Styles typographiques" page - hide it when AP theme is active
				if (item.querySelector('a[id*="design-tokens-styles-typographiques"]')) {
					item.style.display = theme === 'ap' ? 'none' : 'block'
				}

				// Handle the "Vue d'ensemble" page - hide it when AP theme is active
				if (item.textContent && item.textContent.includes('Vue d\'ensemble')) {
					item.style.display = theme === 'ap' ? 'none' : 'block'
				}

				// Handle the "Migration depuis Bridge" page - hide it when AP theme is active
				if (item.textContent && item.textContent.includes('Migration depuis Bridge')) {
					item.style.display = theme === 'ap' ? 'none' : 'block'
				}

				// Handle the "Migration depuis Vue2" page - hide it when AP theme is active
				if (item.textContent && item.textContent.includes('Migration depuis Vue2')) {
					item.style.display = theme === 'ap' ? 'none' : 'block'
				}

				// Handle the "Breaking changes" page - hide it when AP theme is active
				if (item.textContent && item.textContent.includes('Breaking changes')) {
					item.style.display = theme === 'ap' ? 'none' : 'block'
				}

				// Handle the "Correspondance composants PAG" page - hide it when AP theme is active
				if (item.textContent && item.textContent.includes('Correspondance composants PAG')) {
					item.style.display = theme === 'ap' ? 'none' : 'block'
				}

				// Get item ID and text content once for all checks
				const itemId = item.getAttribute('data-item-id') || ''
				const itemText = item.textContent || ''

				// Handle all items containing 'amelipro' in their ID or text content
				if (!isAmeliproFolder && (itemId.toLowerCase().includes('amelipro') || itemText.toLowerCase().includes('amelipro'))) {
					item.style.display = hideAmelipro ? 'none' : 'block'
				}

				// Target any element with Templates text - case insensitive
				if (itemText && itemText.toLowerCase().includes('templates')) {
					// console.log('Found element with Templates text:', itemText)
					item.style.display = theme === 'ap' ? 'none' : 'block'
				}
			})

			// Second pass: find all links related to amelipro components
			if (hideAmelipro) {
				const allLinks = sidebar.querySelectorAll('a[id]') as NodeListOf<HTMLAnchorElement>
				allLinks.forEach(link => {
					const linkId = link.id || ''
					const linkText = link.textContent || ''
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
			if (showOnlyAmelipro) {
				// First hide all templates related elements
				// 1. Hide all template sections and their content completely
				const templateSections = sidebar.querySelectorAll('.sidebar-item[data-item-id*="templates"], .sidebar-item[data-nodeid*="templates"]')
				templateSections.forEach(el => {
					(el as HTMLElement).style.display = 'none'
				})

				// 2. Hide template headings
				const allHeadings = sidebar.querySelectorAll('.sidebar-subheading')
				allHeadings.forEach(heading => {
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
				allSidebarItems.forEach(item => {
					const el = item as HTMLElement
					if (el.textContent && el.textContent.toLowerCase().includes('template')) {
						el.style.display = 'none'
					}
				})

				// 4. Now process all links to hide non-Amelipro components
				const allLinks = sidebar.querySelectorAll('a[id]') as NodeListOf<HTMLAnchorElement>
				allLinks.forEach(link => {
					const linkId = link.id || ''
					const linkText = link.textContent || ''
					
					// Skip Amelipro components
					if (linkId.toLowerCase().includes('amelipro') || linkText.toLowerCase().includes('amelipro')) {
						return
					}

					// Hide templates and other components
					if (linkId.startsWith('composants-') || 
					    linkId.toLowerCase().includes('template') || 
					    linkText.toLowerCase().includes('template')) {
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
					heading => heading.textContent && heading.textContent.trim() === 'Templates'
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
				templateItems.forEach(item => {
					const templateItem = item as HTMLElement
					// Reset to original display value
					templateItem.style.display = ''
				})
				
				// Find any sidebar items that contain Templates
				const sidebarItems = sidebar.querySelectorAll('.sidebar-item')
				sidebarItems.forEach(item => {
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

// Get stored theme or default to CNAM
const storedTheme = typeof window !== 'undefined' ? localStorage.getItem('storybook-theme') : 'cnam'

// Apply initial theme and sidebar
if (typeof window !== 'undefined') {
	applyThemeClass(storedTheme || 'cnam')
	setTimeout(() => {
		applyThemeSidebar(storedTheme || 'cnam')
	}, 100)
}

addons.setConfig({
	theme: storedTheme === 'pa' ? paTheme : storedTheme === 'ap' ? apTheme : cnamTheme,
})

// Listen for theme changes
if (typeof window !== 'undefined') {
	window.addEventListener('storage', (event) => {
		if (event.key === 'storybook-theme') {
			const newTheme = event.newValue || 'cnam'

			// Update Storybook theme
			addons.setConfig({
				theme: newTheme === 'pa' ? paTheme : newTheme === 'ap' ? apTheme : cnamTheme,
			})

			// Apply theme class to HTML root
			applyThemeClass(newTheme)

			// Apply theme menu sidebar
			applyThemeSidebar(newTheme)
		}
	})
}
