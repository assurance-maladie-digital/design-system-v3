import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import type { ThemeInstance } from 'vuetify'

export type ThemeName = 'cnam' | 'pa' | 'ap'

/**
 * Theme utility to manage theme switching between CNAM and PA themes
 * Handles Vuetify theme updates and HTML root class changes
 */
export const useThemeManager = (vuetifyTheme: ThemeInstance) => {
	// Initialize theme from localStorage or default to 'cnam'
	const storedTheme = localStorage.getItem('playground-theme') || 'cnam'
	const currentTheme: Ref<ThemeName> = ref(storedTheme as ThemeName)

	/**
   * Apply theme class to HTML root element
   */
	const applyThemeClass = (theme: ThemeName) => {
		document.documentElement.classList.remove('theme-cnam', 'theme-pa', 'theme-ap')
		document.documentElement.classList.add(`theme-${theme}`)
	}

	/**
   * Switch to a different theme
   */
	const switchTheme = (theme: ThemeName) => {
		currentTheme.value = theme
	}

	/**
   * Initialize theme on application load
   */
	const initTheme = () => {
		if (typeof window !== 'undefined') {
			// Set initial Vuetify theme
			vuetifyTheme.global.name.value = currentTheme.value

			// Apply initial theme class
			applyThemeClass(currentTheme.value)
		}
	}

	// Watch for theme changes and update Vuetify theme and HTML classes
	watch(currentTheme, (newTheme) => {
		if (typeof window !== 'undefined') {
			// Update Vuetify theme
			vuetifyTheme.global.name.value = newTheme

			// Apply the theme class to HTML root
			applyThemeClass(newTheme)

			// Store theme preference in localStorage
			localStorage.setItem('playground-theme', newTheme)
		}
	})

	return {
		currentTheme,
		switchTheme,
		initTheme,
	}
}
