import { addons } from '@storybook/manager-api'
import cnamTheme from './CnamTheme'
import paTheme from './PaTheme'

// Helper function to apply theme class to HTML root element
const applyThemeClass = (theme) => {
	const rootElement = document.documentElement // Always exists
	rootElement.classList.remove('theme-cnam', 'theme-pa')
	rootElement.classList.add(`theme-${theme}`)
}

const applyThemeSidebar = (theme) => {
	console.log('applyThemeSidebar called with theme:', theme) // Ensure this is logged

	const processSidebar = () => {
		const sidebar = document.querySelector('.sidebar-container')

		if (sidebar) {
			console.log('Sidebar found, applying theme modifications')
			const items = sidebar.querySelectorAll('.sidebar-item') as NodeListOf<HTMLElement>

			items.forEach((item) => {
				if (theme === 'pa') {
					console.log('theme pa')
					if (item.querySelector('a[href="#démarrer-introduction--docs"]')) {
						console.log('Hiding CNAM-specific item in PA theme')
						item.style.display = 'none'
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
				console.log('Stopping sidebar observer after timeout')
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

// Apply initial theme
if (typeof window !== 'undefined') {
	applyThemeClass(storedTheme || 'cnam')
	applyThemeSidebar(storedTheme || 'cnam')
}

addons.setConfig({
	theme: storedTheme === 'pa' ? paTheme : cnamTheme,
})

// Listen for theme changes
if (typeof window !== 'undefined') {
	window.addEventListener('storage', (event) => {
		if (event.key === 'storybook-theme') {
			const newTheme = event.newValue || 'cnam'

			// Update Storybook theme
			addons.setConfig({
				theme: newTheme === 'pa' ? paTheme : cnamTheme,
			})

			// Apply theme class to HTML root
			applyThemeClass(newTheme)

			// Apply theme menu sidebar
			applyThemeSidebar(newTheme)
		}
	})
}
