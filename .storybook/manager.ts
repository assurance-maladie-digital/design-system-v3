import { addons } from '@storybook/manager-api'
import cnamTheme from './CnamTheme'
import paTheme from './PaTheme'

// Get stored theme or default to CNAM
const storedTheme = typeof window !== 'undefined' ? localStorage.getItem('storybook-theme') : 'cnam'

addons.setConfig({
	theme: storedTheme === 'pa' ? paTheme : cnamTheme,
})

// Listen for theme changes
if (typeof window !== 'undefined') {
	window.addEventListener('storage', (event) => {
		if (event.key === 'storybook-theme') {
			addons.setConfig({
				theme: event.newValue === 'pa' ? paTheme : cnamTheme,
			})
		}
	})
}
