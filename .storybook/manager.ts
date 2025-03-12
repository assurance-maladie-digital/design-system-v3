import { addons } from '@storybook/manager-api'
import cnamTheme from './CnamTheme'
import paTheme from './PaTheme'

// Helper function to apply theme class to HTML root element
const applyThemeClass = (theme) => {
	const rootElement = document.documentElement // Always exists
	rootElement.classList.remove('theme-cnam', 'theme-pa')
	rootElement.classList.add(`theme-${theme}`)
}

// TODO : FIX THIS
const applyThemeSidebar = (theme) => {
	document.addEventListener('DOMContentLoaded', () => {
		console.log('loaded')
		const sidebar = document.querySelector('.sidebar')
		console.log(sidebar)
		if (sidebar) {
			const items = sidebar.querySelectorAll('.sidebar-item') as NodeListOf<HTMLElement>
			console.log(theme)
			items.forEach((item) => {
				if (theme === 'pa') {
					if (item.querySelector('a[href="#démarrer-accueil--docs"]')) {
						console.log(item)
						item.style.display = 'none'
					}
				}
			})
		}
	})
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
