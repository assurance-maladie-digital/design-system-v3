import type { Directive, DirectiveBinding } from 'vue'

interface LetterSpacingOptions {
	/**
	 * Whether to apply to all typography elements or only specific selectors
	 * @default true
	 */
	applyToAll?: boolean
	/**
	 * Specific selectors to target (if applyToAll is false)
	 */
	selectors?: string[]
	/**
	 * Whether to observe DOM changes for dynamic content
	 * @default true
	 */
	observeChanges?: boolean
}

/**
 * Find and modify Vuetify's CSS rules to remove !important from letter-spacing
 */
function modifyVuetifyStylesheets(): void {
	try {
		// Get all stylesheets
		const stylesheets = Array.from(document.styleSheets)

		stylesheets.forEach((stylesheet, index) => {
			try {
				// Try to access rules (may fail for cross-origin stylesheets)
				const rules = Array.from(stylesheet.cssRules || stylesheet.rules || [])

				rules.forEach((rule) => {
					if (rule instanceof CSSStyleRule) {
						// Check if this rule affects typography classes
						const typographyClasses = ['.text-h1', '.text-h2', '.text-h3', '.text-h4', '.text-h5', '.text-h6', '.text-body-1', '.text-body-2', '.text-subtitle-1', '.text-subtitle-2', '.text-caption', '.text-overline', '.text-button', '.text-md-subtitle-1']

						const matchesTypography = typographyClasses.some(cls => rule.selectorText?.includes(cls))

						if (matchesTypography && rule.style.letterSpacing) {
							// Try to modify the rule
							try {
								rule.style.setProperty('letter-spacing', '0px', '')
							}
							catch (modifyError) {
								console.log(`Could not modify rule: ${rule.selectorText}`, modifyError)
							}
						}
					}
				})
			}
			catch (accessError: unknown) {
				// Stylesheet is cross-origin or inaccessible
				const errorMessage = accessError instanceof Error ? accessError.message : String(accessError)
				console.log(`Cannot access stylesheet ${index}:`, errorMessage)
			}
		})
	}
	catch (error) {
		console.error('Error modifying Vuetify stylesheets:', error)
	}
}

/**
 * Inject CSS with !important to override Vuetify, but using CSS custom properties
 */
function injectOverrideCSS(): void {
	const styleId = 'letter-spacing-override-styles'

	// Remove existing style element if it exists
	const existingStyle = document.getElementById(styleId)
	if (existingStyle) {
		existingStyle.remove()
	}

	// Create new style element
	const styleElement = document.createElement('style')
	styleElement.id = styleId
	styleElement.type = 'text/css'

	// Use high specificity selectors without !important
	const cssRules = `
		/* Override Vuetify letter-spacing with high specificity and CSS custom properties */
		.v-application .v-application .text-h1 { letter-spacing: var(--v-typography-h1-letter-spacing, 0px); }
		.v-application .v-application .text-h2 { letter-spacing: var(--v-typography-h2-letter-spacing, 0px); }
		.v-application .v-application .text-h3 { letter-spacing: var(--v-typography-h3-letter-spacing, 0px); }
		.v-application .v-application .text-h4 { letter-spacing: var(--v-typography-h4-letter-spacing, 0px); }
		.v-application .v-application .text-h5 { letter-spacing: var(--v-typography-h5-letter-spacing, 0px); }
		.v-application .v-application .text-h6 { letter-spacing: var(--v-typography-h6-letter-spacing, 0px); }
		.v-application .v-application .text-body-1 { letter-spacing: var(--v-typography-body1-letter-spacing, 0px); }
		.v-application .v-application .text-body-2 { letter-spacing: var(--v-typography-body2-letter-spacing, 0px); }
		.v-application .v-application .text-subtitle-1 { letter-spacing: var(--v-typography-subtitle1-letter-spacing, 0px); }
		.v-application .v-application .text-subtitle-2 { letter-spacing: var(--v-typography-subtitle2-letter-spacing, 0px); }
		.v-application .v-application .text-caption { letter-spacing: var(--v-typography-caption-letter-spacing, 0px); }
		.v-application .v-application .text-overline { letter-spacing: var(--v-typography-overline-letter-spacing, 0px); }
		.v-application .v-application .text-button { letter-spacing: var(--v-typography-button-letter-spacing, 0px); }
		.v-application .v-application .text-md-subtitle-1 { letter-spacing: var(--v-typography-md-subtitle1-letter-spacing, 0px); }
		.v-application .v-application h1 { letter-spacing: var(--v-typography-h1-letter-spacing, 0px); }
		.v-application .v-application h2 { letter-spacing: var(--v-typography-h2-letter-spacing, 0px); }
		.v-application .v-application h3 { letter-spacing: var(--v-typography-h3-letter-spacing, 0px); }
		.v-application .v-application h4 { letter-spacing: var(--v-typography-h4-letter-spacing, 0px); }
		.v-application .v-application h5 { letter-spacing: var(--v-typography-h5-letter-spacing, 0px); }
		.v-application .v-application h6 { letter-spacing: var(--v-typography-h6-letter-spacing, 0px); }
	`

	styleElement.textContent = cssRules

	// Append to head
	document.head.appendChild(styleElement)
}

/**
 * Apply design token letter-spacing values using multiple approaches
 */
// function applyTokenLetterSpacing(element: HTMLElement): void {
function applyTokenLetterSpacing(): void {
	// Try to modify existing Vuetify stylesheets first
	modifyVuetifyStylesheets()

	// Inject override CSS with !important but using CSS custom properties
	injectOverrideCSS()

	// Set CSS variables with design token values
	const rootElement = document.documentElement
	const rootStyle = getComputedStyle(rootElement)

	// List of all typography CSS variables to set
	const typographyVars = [
		'--v-typography-h1-letter-spacing',
		'--v-typography-h2-letter-spacing',
		'--v-typography-h3-letter-spacing',
		'--v-typography-h4-letter-spacing',
		'--v-typography-h5-letter-spacing',
		'--v-typography-h6-letter-spacing',
		'--v-typography-body1-letter-spacing',
		'--v-typography-body2-letter-spacing',
		'--v-typography-subtitle1-letter-spacing',
		'--v-typography-subtitle2-letter-spacing',
		'--v-typography-caption-letter-spacing',
		'--v-typography-overline-letter-spacing',
		'--v-typography-button-letter-spacing',
		'--v-typography-md-subtitle1-letter-spacing',
	]

	// Set each CSS variable with design token values
	typographyVars.forEach((cssVar) => {
		const tokenValue = rootStyle.getPropertyValue(cssVar).trim()
		const finalValue = tokenValue || '0px'

		rootElement.style.setProperty(cssVar, finalValue)
	})

	// Add debugging attributes
	// element.setAttribute('data-letter-spacing-override', 'multi-approach')
	// element.setAttribute('data-letter-spacing-timestamp', Date.now().toString())
}

/**
 * Vue directive to override Vuetify's !important letter-spacing with design token values
 *
 * Usage:
 * - v-letter-spacing (applies to all typography elements)
 * - v-letter-spacing="{ applyToAll: false, selectors: ['.text-h1', '.text-h2'] }"
 * - v-letter-spacing="{ observeChanges: false }" (disable mutation observer)
 */
export const vLetterSpacing: Directive<HTMLElement, LetterSpacingOptions | boolean> = {
	mounted(el: HTMLElement, binding: DirectiveBinding<LetterSpacingOptions | boolean>) {
		const options: LetterSpacingOptions = typeof binding.value === 'boolean'
			? { applyToAll: binding.value }
			: { applyToAll: true, observeChanges: true, ...binding.value }

		// Apply letter-spacing override immediately
		applyTokenLetterSpacing()

		// Set up mutation observer if enabled
		if (options.observeChanges !== false) {
			const observer = new MutationObserver((mutations) => {
				let shouldReapply = false

				mutations.forEach((mutation) => {
					// Check if new nodes were added
					if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
						shouldReapply = true
					}
					// Check if class attributes changed
					if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
						shouldReapply = true
					}
				})

				if (shouldReapply) {
					applyTokenLetterSpacing()
				}
			})

			observer.observe(el, {
				childList: true,
				subtree: true,
				attributes: true,
				attributeFilter: ['class'],
			})

			// Store observer reference for cleanup
			;(el as HTMLElement & { _letterSpacingObserver?: MutationObserver })._letterSpacingObserver = observer
		}
	},

	updated() {
		// Reapply letter-spacing override when component updates
		applyTokenLetterSpacing()
	},

	beforeUnmount(el: HTMLElement) {
		// Clean up mutation observer
		const observer = (el as HTMLElement & { _letterSpacingObserver?: MutationObserver })._letterSpacingObserver
		if (observer) {
			observer.disconnect()
			delete (el as HTMLElement & { _letterSpacingObserver?: MutationObserver })._letterSpacingObserver
		}

		// Remove override attributes
		// const elements = el.querySelectorAll('[data-letter-spacing-override]')
		// elements.forEach((element) => {
		// 	element.removeAttribute('data-letter-spacing-override')
		// 	element.removeAttribute('data-letter-spacing-timestamp')
		// })

		// Clean up the main element if it has the override
		// if (el.hasAttribute('data-letter-spacing-override')) {
		// 	el.removeAttribute('data-letter-spacing-override')
		// 	el.removeAttribute('data-letter-spacing-timestamp')
		// }
	},
}

export default vLetterSpacing
