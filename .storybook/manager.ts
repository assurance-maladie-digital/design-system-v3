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

			items.forEach((item) => {
				if (theme === 'pa') {
					if (item.querySelector('a#design-tokens-conteneurs-de-page--docs')) {
						item.style.display = 'none'
					}
				}
				if (theme === 'cnam') {
					if (item.querySelector('a#design-tokens-conteneurs-de-page--docs')) {
						item.style.display = 'block'
					}
				}
				if (theme === 'amelipro') {
					if (item.querySelector('a#démarrer-introduction--docs')) {
						// item.style.display = 'block'
					}
				}
			})

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
