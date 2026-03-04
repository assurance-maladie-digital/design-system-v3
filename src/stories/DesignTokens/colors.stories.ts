import { cnamLightTheme } from '@/designTokens/tokens/cnam/cnamLightTheme'
import { cnamColorsTokens } from '@/designTokens/tokens/cnam/cnamColors'
import { paLightTheme } from '@/designTokens/tokens/pa/paLightTheme'
import { paColorsTokens } from '@/designTokens/tokens/pa/paColors'
import { apLightTheme2026 } from '@/designTokens/tokens/amelipro/apLightTheme2026'
import { apLightTheme } from '@/designTokens/tokens/amelipro/apLightTheme'
import { apColorsTokens2026 } from '@/designTokens/tokens/amelipro/apColors2026'
import { apColorsTokens } from '@/designTokens/tokens/amelipro/apColors'
import ColorDisplay from './ColorDisplay.vue'
import ColorIntegrationExample from './ColorIntegrationExample.vue'
import { h } from 'vue'
import { useTheme } from 'vuetify'
import type { StoryObj } from '@storybook/vue3'
import { computed } from 'vue'

function createSection(
	title: string,
	stories: StoryObj[],
	hideOn?: string,
) {
	return {
		setup() {
			const theme = useTheme()
			return () => {
				if (hideOn && theme.global.name.value === hideOn) {
					return h('div')
				}
				return h('section', [
					h(
						'h2',
						{
							style: `
                    border-bottom: 1px solid rgba(38, 85, 115, 0.15);
                    color: rgb(46, 52, 56);
                    font-family: 'Nunito Sans', -apple-system, '.SFNSText-Regular', 'San Francisco', BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                `,
						},
						title,
					),
					...stories.map((story) => {
						if (story.render) {
							const component = story.render(story.args ?? {}, {} as Parameters<typeof story.render>[1])
							return h(component)
						}
						return h('div')
					}),
				])
			}
			if (theme.global.name.value === 'ap2026') return
		},
	}
}

export default {
	title: 'Design Tokens/Couleurs',
}

export const Theme: StoryObj = {
	render: () => {
		return {
			setup() {
				const theme = computed(() => typeof window !== 'undefined' ? localStorage.getItem('storybook-theme') : 'cnam')
				return {
					theme,
				}
			},
			template: `
				<p style="font-size: 14px;  margin: 16px 0; line-height: 24px; color: rgb(46, 52, 56);">
					Les couleurs contribuent à l’identification de nos applications ou services et font partie intégrante de la marque <span v-if="theme === 'cnam'"><b>Assurance Maladie</b></span><span v-if="theme === 'pa'"><b>Portail Agent</b></span>. 
					Elles assurent l’homogénéité graphique des interfaces.
				</p>
			`,
		}
	},
	tags: ['!dev'],
}

export const ColorIntegration: StoryObj = {
	render: () => ({
		components: { ColorIntegrationExample },
		template: '<ColorIntegrationExample />',
	}),
	tags: ['!dev'],
}

export const ColorBase: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
                const colorTitle = ''
                const colorTitleLevel = 3
				const cnamColors = {
					'primary': cnamLightTheme.primary,
					'secondary': cnamLightTheme.secondary,
					'error': cnamLightTheme.error,
					'info': cnamLightTheme.info,
					'success': cnamLightTheme.success,
					'warning': cnamLightTheme.warning,
					'risque-pro': cnamLightTheme.risquePro,
				}
				const paColors = {
					primary: paLightTheme.primary,
					secondary: paLightTheme.secondary,
					error: paLightTheme.error,
					info: paLightTheme.info,
					success: paLightTheme.success,
					warning: paLightTheme.warning,
				}
				const apColors2026 = {
					primary: apLightTheme2026.primary,
					secondary: apLightTheme2026.secondary,
					error: apLightTheme2026.error,
					info: apLightTheme2026.info,
					success: apLightTheme2026.success,
					warning: apLightTheme2026.warning,
				}
				const apColors = {
					primary: apLightTheme.primary,
					secondary: apLightTheme.secondary,
					error: apLightTheme.error,
					info: apLightTheme.info,
					success: apLightTheme.success,
					warning: apLightTheme.warning,
				}
				return {
					cnamColors,
					paColors,
					apColors2026: apColors2026,
					apColors,
					colorTitle,
					colorTitleLevel,
				}
			},
			template: `
              <ColorDisplay
                  displayEmptyColors
                  colorCategory="base"
                  :cnamColors="cnamColors"
                  :paColors="paColors"
                  :apColors="apColors"
                  :apColors2026="apColors2026"
                  :colorTitle="colorTitle"
                  :colorTitleLevel="colorTitleLevel"
              />
            `,
		}
	},
	tags: ['!dev'],
}

export const ColorPrimary: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Accent Primary'
				const colorTitleLevel = 3
				const colorDescription = 'Ces couleurs sont à utiliser pour mettre en avant des containers de manière marquée.'
				const cnamColors = {
					'accent-primary-light': cnamLightTheme.accentPrimaryLight,
					'accent-primary': cnamLightTheme.accentPrimary,
					'accent-primary-contrasted': cnamLightTheme.accentPrimaryContrasted,
				}
				const paColors = {
					'accent-primary-light': paLightTheme.accentPrimaryLight,
					'accent-primary': paLightTheme.accentPrimary,
					'accent-primary-contrasted': paLightTheme.accentPrimaryContrasted,
				}
				const apColors = {
					'accent-primary-light': apLightTheme.accentPrimaryLight,
					'accent-primary': apLightTheme.accentPrimary,
					'accent-primary-contrasted': apLightTheme.accentPrimaryContrasted,
				}
				const apColors2026 = {}
				return {
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorDescription,
					colorTitleLevel,
				}
			},
			template: `
				<ColorDisplay
					displayEmptyColors
					colorCategory="base" 
					:cnamColors="cnamColors" 
					:paColors="paColors"
                    :apColors="apColors"
                    :apColors2026="apColors2026"
					:colorTitle="colorTitle"
                    :colorDescription="colorDescription"
                    :colorTitleLevel="colorTitleLevel"
                />
			`,
		}
	},
	tags: ['!dev'],
}

export const ColorSecondary: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Accent Secondary'
				const colorTitleLevel = 3
				const colorDescription = 'Ces couleurs sont à utiliser pour mettre en avant des containers de manière marquée.'
				const cnamColors = {
					'accent-secondary-light': cnamLightTheme.accentSecondaryLight,
					'accent-secondary': cnamLightTheme.accentSecondary,
					'accent-secondarys-contrasted': cnamLightTheme.accentSecondaryContrasted,
				}
				const paColors = {
					'accent-secondary-light': paLightTheme.accentSecondaryLight,
					'accent-secondary': paLightTheme.accentSecondary,
					'accent-secondarys-contrasted': paLightTheme.accentSecondaryContrasted,
				}
				const apColors = {
					'accent-secondary-light': apLightTheme.accentSecondaryLight,
					'accent-secondary': apLightTheme.accentSecondary,
					'accent-secondarys-contrasted': apLightTheme.accentSecondaryContrasted,
				}
				const apColors2026 = {}
				return {
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorDescription,
					colorTitleLevel,
				}
			},
			template: `
              <ColorDisplay
                  displayEmptyColors
                  colorCategory="base"
                  :cnamColors="cnamColors"
                  :paColors="paColors"
                  :apColors="apColors"
                  :apColors2026="apColors2026"
                  :colorTitle="colorTitle"
                  :colorDescription="colorDescription"
                  :colorTitleLevel="colorTitleLevel"
              />
            `,
		}
	},
	tags: ['!dev'],
}

export const ColorAlternatives: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Accent Alternatives'
				const colorTitleLevel = 3
				const colorDescription = 'Cette couleur est à utiliser pour mettre en avant des containers de manière marquée.'
				const cnamColors = {
					'accent-alt': cnamLightTheme.accentAlt,
				}
				const paColors = {
					'accent-alt': paLightTheme.accentAlt,
				}
				const apColors = {
					'accent-alt': apLightTheme.accentAlt,
				}
				const apColors2026 = {}
				return {
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorDescription,
					colorTitleLevel,
				}
			},
			template: `
              <ColorDisplay
                  displayEmptyColors
                  colorCategory="base"
                  :cnamColors="cnamColors"
                  :paColors="paColors"
                  :apColors="apColors"
                  :apColors2026="apColors2026"
                  :colorTitle="colorTitle"
                  :colorDescription="colorDescription"
                  :colorTitleLevel="colorTitleLevel"
              />
            `,
		}
	},
	tags: ['!dev'],
}

export const Interactive: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
                const colorTitle = ''
				const colorDescription = 'Ces couleurs sont à utiliser pour les fonds des éléments interactifs de sélection (item de liste sélectionnable, carte sélectionnable,...)'
				const displayEmptyColors = false
                const colorTitleLevel = 3
				const cnamColors = {
					'interactive-selection-enabled': cnamLightTheme.interactiveSelectionEnabled,
					'interactive-selection-hover': cnamLightTheme.interactiveSelectionHover,
					'interactive-selection-pressed': cnamLightTheme.interactiveSelectionPressed,
					'interactive-selection-selected': cnamLightTheme.interactiveSelectionSelected,
					'interactive-selection-hover-on-selected': cnamLightTheme.interactiveSelectionHoverOnSelected,
					'interactive-selection-selected-accent': cnamLightTheme.interactiveSelectionSelectedAccent,
					'interactive-selection-hover-on-selected-accent': cnamLightTheme.interactiveSelectionHoverOnSelectedAccent,
					'interactive-selection-disabled': cnamLightTheme.interactiveSelectionDisabled,
				}
				const paColors = {
					'interactive-selection-enabled': paLightTheme.interactiveSelectionEnabled,
					'interactive-selection-hover': paLightTheme.interactiveSelectionHover,
					'interactive-selection-pressed': paLightTheme.interactiveSelectionPressed,
					'interactive-selection-selected': paLightTheme.interactiveSelectionSelected,
					'interactive-selection-hover-on-selected': paLightTheme.interactiveSelectionHoverOnSelected,
					'interactive-selection-selected-accent': paLightTheme.interactiveSelectionSelectedAccent,
					'interactive-selection-hover-on-selected-accent': paLightTheme.interactiveSelectionHoverOnSelectedAccent,
					'interactive-selection-disabled': paLightTheme.interactiveSelectionDisabled,
				}
				const apColors = {
					'interactive-selection-enabled': apLightTheme.interactiveSelectionEnabled,
					'interactive-selection-hover': apLightTheme.interactiveSelectionHover,
					'interactive-selection-pressed': apLightTheme.interactiveSelectionPressed,
					'interactive-selection-selected': apLightTheme.interactiveSelectionSelected,
					'interactive-selection-hover-on-selected': apLightTheme.interactiveSelectionHoverOnSelected,
					'interactive-selection-selected-accent': apLightTheme.interactiveSelectionSelectedAccent,
					'interactive-selection-hover-on-selected-accent': apLightTheme.interactiveSelectionHoverOnSelectedAccent,
					'interactive-selection-disabled': apLightTheme.interactiveSelectionDisabled,
				}
				const apColors2026 = {}
				return {
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorDescription,
					colorTitleLevel,
					displayEmptyColors,
				}
			},
			template: `
              <ColorDisplay
                  :displayEmptyColors="displayEmptyColors"
                  colorCategory="interactive"
                  :cnamColors="cnamColors"
                  :paColors="paColors"
                  :apColors="apColors"
                  :apColors2026="apColors2026"
                  :colorTitle="colorTitle"
                  :colorDescription="colorDescription"
                  :colorTitleLevel="colorTitleLevel"
              />
            `,
		}
	},
	tags: ['!dev'],
}

export const ColorBaseSection = {
    render() {
        return h(createSection('Couleurs de base', [
            ColorBase
        ]))
    },
}


export const AccentSection = {
	render() {
		return h(createSection('Accent', [
			ColorPrimary,
			ColorSecondary,
			ColorAlternatives,
		], 'ap2026'))
	},
}
export const InteractiveSection = {
    render() {
        return h(createSection('Interactive', [
            Interactive,
        ], 'ap2026'))
    },
}

export const BorderBase: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Base'
				const colorTitleLevel = 3
				const colorDescription = 'Ce sont les couleurs les plus courantes à utiliser pour les contours de tous les éléments d’interface (quand nécessaire)'
				const cnamColors = {
					'border-base': cnamLightTheme.borderBase,
					'border-darker': cnamLightTheme.borderDarker,
					'border-subdued': cnamLightTheme.borderSubdued,
					'border-disabled': cnamLightTheme.borderDisabled,
					'border-disabled-on-dark': cnamLightTheme.borderDisabledOnDark,
				}
				const paColors = {
					'border-base': paLightTheme.borderBase,
					'border-darker': paLightTheme.borderDarker,
					'border-subdued': paLightTheme.borderSubdued,
					'border-disabled': paLightTheme.borderDisabled,
					'border-disabled-on-dark': paLightTheme.borderDisabledOnDark,
				}
				const apColors = {
					'border-base': apLightTheme.borderBase,
					'border-darker': apLightTheme.borderDarker,
					'border-subdued': apLightTheme.borderSubdued,
					'border-disabled': apLightTheme.borderDisabled,
					'border-disabled-on-dark': apLightTheme.borderDisabledOnDark,

				}
				const apColors2026 = {}
				return {
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorDescription,
					colorTitleLevel,
				}
			},
			template: `
              <ColorDisplay
                  displayEmptyColors
                  colorCategory="border"
                  :cnamColors="cnamColors"
                  :paColors="paColors"
                  :apColors="apColors"
                  :apColors2026="apColors2026"
                  :colorTitle="colorTitle"
                  :colorDescription="colorDescription"
                  :colorTitleLevel="colorTitleLevel"
              />
            `,
		}
	},
	tags: ['!dev'],
}

export const BorderPrimary: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Accent Primary'
				const colorDescription = 'Ce sont les couleurs à utiliser pour mettre en exergue des éléments par leur contour.'
				const colorTitleLevel = 3
				const cnamColors = {
					'border-accent-primary': cnamLightTheme.borderAccentPrimary,
					'border-accent-primary-contrasted': cnamLightTheme.borderAccentPrimaryContrasted,
					'border-accent-primary-on-dark': cnamLightTheme.borderAccentPrimaryOnDark,
				}
				const paColors = {
					'border-accent-primary': paLightTheme.borderAccentPrimary,
					'border-accent-primary-contrasted': paLightTheme.borderAccentPrimaryContrasted,
					'border-accent-primary-on-dark': paLightTheme.borderAccentPrimaryOnDark,
				}
				const apColors = {
					'border-accent-primary': apLightTheme.borderAccentPrimary,
					'border-accent-primary-contrasted': apLightTheme.borderAccentPrimaryContrasted,
					'border-accent-primary-on-dark': apLightTheme.borderAccentPrimaryOnDark,
				}
				const apColors2026 = {}
				return {
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorDescription,
					colorTitleLevel,
				}
			},
			template: `
              <ColorDisplay
                  displayEmptyColors
                  colorCategory="border"
                  :cnamColors="cnamColors"
                  :paColors="paColors"
                  :apColors="apColors"
                  :apColors2026="apColors2026"
                  :colorTitle="colorTitle"
                  :colorDescription="colorDescription"
                  :colorTitleLevel="colorTitleLevel"
              />
            `,
		}
	},
	tags: ['!dev'],
}

export const BorderSecondary: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Accent Secondary'
				const colorDescription = 'Ce sont les couleurs à utiliser pour mettre en exergue des éléments par leur contour.'
				const colorTitleLevel = 3
				const cnamColors = {
					'border-accent-secondary': cnamLightTheme.borderAccentSecondary,
					'border-accent-secondary-contrasted': cnamLightTheme.borderAccentSecondaryContrasted,
				}
				const paColors = {
					'border-accent-secondary': paLightTheme.borderAccentSecondary,
					'border-accent-secondary-contrasted': paLightTheme.borderAccentSecondaryContrasted,
				}
				const apColors = {
					'border-accent-secondary': apLightTheme.borderAccentSecondary,
					'border-accent-secondary-contrasted': apLightTheme.borderAccentSecondaryContrasted,
				}
				const apColors2026 = {}
				return {
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorDescription,
					colorTitleLevel,
				}
			},
			template: `
              <ColorDisplay
                  displayEmptyColors
                  colorCategory="border"
                  :cnamColors="cnamColors"
                  :paColors="paColors"
                  :apColors="apColors"
                  :apColors2026="apColors2026"
                  :colorTitle="colorTitle"
                  :colorDescription="colorDescription"
                  :colorTitleLevel="colorTitleLevel"
              />
            `,
		}
	},
	tags: ['!dev'],
}

export const BorderStates: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'States'
				const colorDescription = 'Ces couleurs sont à utiliser pour les contours d’éléments d’interface présentant un message d’information, de succès, d’attention ou de danger.'
				const colorTitleLevel = 3
				const cnamColors = {
					'border-info': cnamLightTheme.borderInfo,
					'border-success': cnamLightTheme.borderSuccess,
					'border-warning': cnamLightTheme.borderWarning,
					'border-error': cnamLightTheme.borderError,
				}
				const paColors = {
					'border-info': paLightTheme.borderInfo,
					'border-success': paLightTheme.borderSuccess,
					'border-warning': paLightTheme.borderWarning,
					'border-error': paLightTheme.borderError,
				}
				const apColors = {
					'border-info': apLightTheme.borderInfo,
					'border-success': apLightTheme.borderSuccess,
					'border-warning': apLightTheme.borderWarning,
					'border-error': apLightTheme.borderError,
				}
				const apColors2026 = {}
				return {
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorDescription,
					colorTitleLevel,
				}
			},
			template: `
              <ColorDisplay
                  displayEmptyColors
                  colorCategory="border"
                  :cnamColors="cnamColors"
                  :paColors="paColors"
                  :apColors="apColors"
                  :apColors2026="apColors2026"
                  :colorTitle="colorTitle"
                  :colorDescription="colorDescription"
                  :colorTitleLevel="colorTitleLevel"
              />
            `,
		}
	},
	tags: ['!dev'],
}

export const BorderSection = {
	render() {
		return h(createSection('Border', [
			BorderBase,
			BorderPrimary,
			BorderSecondary,
			BorderStates,
		], 'ap2026'))
	},
}
export const TextBase: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Base'
				const colorTitleLevel = 3
				const colorDescription = 'Ce sont les couleurs les plus courantes à utiliser pour les textes.'
				const cnamColors = {
					'text-base': cnamLightTheme.textBase,
					'text-subdued': cnamLightTheme.textSubdued,
					'text-disabled': cnamLightTheme.textDisabled,
					'text-on-dark': cnamLightTheme.textOnDark,
					'text-subdued-on-dark': cnamLightTheme.textSubduedOnDark,
					'text-disabled-on-dark': cnamLightTheme.textDisabledOnDark,
				}
				const paColors = {
					'text-base': paLightTheme.textBase,
					'text-subdued': paLightTheme.textSubdued,
					'text-disabled': paLightTheme.textDisabled,
					'text-on-dark': paLightTheme.textOnDark,
					'text-subdued-on-dark': paLightTheme.textSubduedOnDark,
					'text-disabled-on-dark': paLightTheme.textDisabledOnDark,
				}
				const apColors = {
					'text-base': apLightTheme.textBase,
					'text-subdued': apLightTheme.textSubdued,
					'text-disabled': apLightTheme.textDisabled,
					'text-on-dark': apLightTheme.textOnDark,
					'text-subdued-on-dark': apLightTheme.textSubduedOnDark,
					'text-disabled-on-dark': apLightTheme.textDisabledOnDark,
				}
				const apColors2026 = {}
				return {
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorDescription,
					colorTitleLevel,
				}
			},
			template: `
              <ColorDisplay
                  displayEmptyColors
                  colorCategory="text"
                  :cnamColors="cnamColors"
                  :paColors="paColors"
                  :apColors="apColors"
                  :apColors2026="apColors2026"
                  :colorTitle="colorTitle"
                  :colorDescription="colorDescription"
                  :colorTitleLevel="colorTitleLevel"
              />`,
		}
	},
	tags: ['!dev'],
}

export const TextPrimary: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Accent Primary'
				const colorDescription = 'Ce sont les couleurs les plus courantes à utiliser pour les textes.'
				const colorTitleLevel = 3
				const cnamColors = {
					'text-accent-primary': cnamLightTheme.textAccentPrimary,
					'text-accent-primary-contrasted': cnamLightTheme.textAccentPrimaryContrasted,
				}
				const paColors = {
					'text-accent-primary': paLightTheme.textAccentPrimary,
					'text-accent-primary-contrasted': paLightTheme.textAccentPrimaryContrasted,
				}
				const apColors = {
					'text-accent-primary': apLightTheme.textAccentPrimary,
					'text-accent-primarycontrasted': apLightTheme.textAccentPrimaryContrasted,

				}
				const apColors2026 = {}
				return {
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorDescription,
					colorTitleLevel,
				}
			},
			template: `
              <ColorDisplay
                  displayEmptyColors
                  colorCategory="text"
                  :cnamColors="cnamColors"
                  :paColors="paColors"
                  :apColors="apColors"
                  :apColors2026="apColors2026"
                  :colorTitle="colorTitle"
                  :colorDescription="colorDescription"
                  :colorTitleLevel="colorTitleLevel"
              />`,
		}
	},
	tags: ['!dev'],
}

export const TextSecondary: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Accent Secondary'
				const colorDescription = 'Ce sont les couleurs à utiliser pour mettre en exergue des textes.'
				const colorTitleLevel = 3
				const cnamColors = {
					'text-accent-secondary': cnamLightTheme.textAccentSecondary,
				}
				const paColors = {
					'text-accent-secondary': paLightTheme.textAccentSecondary,

				}
				const apColors = {
					'text-accent-secondary': apLightTheme.textAccentSecondary,

				}
				const apColors2026 = {}
				return {
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorDescription,
					colorTitleLevel,
				}
			},
			template: `
              <ColorDisplay
                  displayEmptyColors
                  colorCategory="text"
                  :cnamColors="cnamColors"
                  :paColors="paColors"
                  :apColors="apColors"
                  :apColors2026="apColors2026"
                  :colorTitle="colorTitle"
                  :colorDescription="colorDescription"
                  :colorTitleLevel="colorTitleLevel"
              />`,
		}
	},
	tags: ['!dev'],
}

export const TextState: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'State'
				const colorDescription = 'Ces couleurs sont à utiliser pour les textes présentant un message d’information, de succès, d’attention ou de danger.'
				const colorTitleLevel = 3
				const cnamColors = {
					'text-info': cnamLightTheme.textInfo,
					'text-success': cnamLightTheme.textSuccess,
					'text-warning': cnamLightTheme.textWarning,
					'text-error': cnamLightTheme.textError,
				}
				const paColors = {
					'text-info': paLightTheme.textInfo,
					'text-success': paLightTheme.textSuccess,
					'text-warning': paLightTheme.textWarning,
					'text-error': paLightTheme.textError,
				}
				const apColors = {
					'text-info': apLightTheme.textInfo,
					'text-success': apLightTheme.textSuccess,
					'text-warning': apLightTheme.textWarning,
					'text-error': apLightTheme.textError,
				}
				const apColors2026 = {}
				return {
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorDescription,
					colorTitleLevel,
				}
			},
			template: `
              <ColorDisplay
                  displayEmptyColors
                  colorCategory="text"
                  :cnamColors="cnamColors"
                  :paColors="paColors"
                  :apColors="apColors"
                  :apColors2026="apColors2026"
                  :colorTitle="colorTitle"
                  :colorDescription="colorDescription"
                  :colorTitleLevel="colorTitleLevel"
              />`,
		}
	},
	tags: ['!dev'],
}

export const TextSection = {
	render() {
		return h(createSection('Text', [
			TextBase,
			TextPrimary,
			TextSecondary,
			TextState,
		], 'ap2026'))
	},
}

export const IconBase: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Base'
				const colorDescription = 'Ce sont les couleurs les plus courantes à utiliser pour les icônes dont la seule vocation est informative ou décorative.'
				const colorTitleLevel = 3
				const cnamColors = {
					'icon-base': cnamLightTheme.iconBase,
					'icon-subdued': cnamLightTheme.iconSubdued,
					'icon-subdued-on-dark': cnamLightTheme.iconSubduedOnDark,
					'icon-on-dark': cnamLightTheme.iconOnDark,
					'icon-disabled': cnamLightTheme.iconDisabled,
					'icon-disabled-on-dark': cnamLightTheme.iconDisabledOnDark,
				}
				const paColors = {
					'icon-base': paLightTheme.iconBase,
					'icon-subdued': paLightTheme.iconSubdued,
					'icon-subdued-on-dark': paLightTheme.iconSubduedOnDark,
					'icon-on-dark': paLightTheme.iconOnDark,
					'icon-disabled': paLightTheme.iconDisabled,
					'icon-disabled-on-dark': paLightTheme.iconDisabledOnDark,
				}
				const apColors = {
					'icon-base': apLightTheme.iconBase,
					'icon-subdued': apLightTheme.iconSubdued,
					'icon-subdued-on-dark': apLightTheme.iconSubduedOnDark,
					'icon-on-dark': apLightTheme.iconOnDark,
					'icon-disabled': apLightTheme.iconDisabled,
					'icon-disabled-on-dark': apLightTheme.iconDisabledOnDark,
				}
				const apColors2026 = {}
				return {
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorDescription,
					colorTitleLevel,
				}
			},
			template: `
              <ColorDisplay
                  displayEmptyColors
                  colorCategory="icons"
                  :cnamColors="cnamColors"
                  :paColors="paColors"
                  :apColors="apColors"
                  :apColors2026="apColors2026"
                  :colorTitle="colorTitle"
                  :colorDescription="colorDescription"
                  :colorTitleLevel="colorTitleLevel"
              />
            `,
		}
	},
	tags: ['!dev'],
}
export const IconPrimary: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Accent Primary'
				const colorDescription = 'Ce sont les couleurs à utiliser dès qu’un icône symbolise une action.'
				const colorTitleLevel = 3
				const cnamColors = {
					'icon-accent-primary': cnamLightTheme.iconAccentPrimary,
					'icon-accent-primary-contrasted': cnamLightTheme.iconAccentPrimaryContrasted,
				}
				const paColors = {
					'icon-accent-primary': paLightTheme.iconAccentPrimary,
					'icon-accent-primary-contrasted': paLightTheme.iconAccentPrimaryContrasted,
				}
				const apColors = {
					'icon-accent-primary': apLightTheme.iconAccentPrimary,
					'icon-accent-primary-contrasted': apLightTheme.iconAccentPrimaryContrasted,
				}
				const apColors2026 = {}
				return {
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorDescription,
					colorTitleLevel,
				}
			},
			template: `
              <ColorDisplay
                  displayEmptyColors
                  colorCategory="icons"
                  :cnamColors="cnamColors"
                  :paColors="paColors"
                  :apColors="apColors"
                  :apColors2026="apColors2026"
                  :colorTitle="colorTitle"
                  :colorDescription="colorDescription"
                  :colorTitleLevel="colorTitleLevel"
              />
            `,
		}
	},
	tags: ['!dev'],
}
export const IconSecondary: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Accent Secondary'
				const colorDescription = 'Ce sont les couleurs à utiliser pour mettre en exergue des icônes.'
				const colorTitleLevel = 3
				const cnamColors = {
					'icon-accent-secondary': cnamLightTheme.iconAccentSecondary,
				}
				const paColors = {
					'icon-accent-secondary': paLightTheme.iconAccentSecondary,
				}
				const apColors = {
					'icon-accent-secondary': apLightTheme.iconAccentSecondary,
				}
				const apColors2026 = {}
				return {
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorDescription,
					colorTitleLevel,
				}
			},
			template: `
              <ColorDisplay
                  displayEmptyColors
                  colorCategory="icons"
                  :cnamColors="cnamColors"
                  :paColors="paColors"
                  :apColors="apColors"
                  :apColors2026="apColors2026"
                  :colorTitle="colorTitle"
                  :colorDescription="colorDescription"
                  :colorTitleLevel="colorTitleLevel"
              />
            `,
		}
	},
	tags: ['!dev'],
}
export const IconState: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'State'
				const colorDescription = 'Ces couleurs sont à utiliser pour les icônes présentant un message d’information, de succès, d’attention ou de danger.'
				const colorTitleLevel = 3
				const cnamColors = {
					'icon-info': cnamLightTheme.iconInfo,
					'icon-success': cnamLightTheme.iconSuccess,
					'icon-warning': cnamLightTheme.iconWarning,
					'icon-error': cnamLightTheme.iconError,
				}
				const paColors = {
					'icon-info': paLightTheme.iconInfo,
					'icon-success': paLightTheme.iconSuccess,
					'icon-warning': paLightTheme.iconWarning,
					'icon-error': paLightTheme.iconError,
				}
				const apColors = {
					'icon-info': apLightTheme.iconInfo,
					'icon-success': apLightTheme.iconSuccess,
					'icon-warning': apLightTheme.iconWarning,
					'icon-error': apLightTheme.iconError,
				}
				const apColors2026 = {}
				return {
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorDescription,
					colorTitleLevel,
				}
			},
			template: `
              <ColorDisplay
                  displayEmptyColors
                  colorCategory="icons"
                  :cnamColors="cnamColors"
                  :paColors="paColors"
                  :apColors="apColors"
                  :apColors2026="apColors2026"
                  :colorTitle="colorTitle"
                  :colorDescription="colorDescription"
                  :colorTitleLevel="colorTitleLevel"
              />
            `,
		}
	},
	tags: ['!dev'],
}
export const IconSection = {
	render() {
		return h(createSection('Icons', [
			IconBase,
			IconPrimary,
			IconSecondary,
			IconState,
		], 'ap2026'))
	},
}

export const MainBackgrounds: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Main'
				const colorDescription = 'Ce sont les couleurs à utiliser pour le background principal de la plateforme.'
				const colorTitleLevel = 3
				const cnamColors = {
					'background-main': cnamLightTheme.backgroundMain,
					'background-main-alt': cnamLightTheme.backgroundMainAlt,
					'background-main-ter': cnamLightTheme.backgroundMainTer,
				}
				const paColors = {
					'background-main': paLightTheme.backgroundMain,
					'background-surface': paLightTheme.backgroundSurface,
					'background-surface-alt': paLightTheme.backgroundSurfaceAlt,
				}
				const apColors = {
					'background-main': apLightTheme.backgroundMain,
					'background-surface': apLightTheme.backgroundSurface,
					'background-surface-alt': apLightTheme.backgroundSurfaceAlt,
				}
				const apColors2026 = { 'ap-grey-lighten-6': apColorsTokens2026.apGrey.lighten6 }
				return {
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorDescription,
					colorTitleLevel,
				}
			},
			template: `
              <ColorDisplay
                  displayEmptyColors
                  colorCategory="mainBackgrounds"
                  :cnamColors="cnamColors"
                  :paColors="paColors"
                  :apColors="apColors"
                  :apColors2026="apColors2026"
                  :colorTitle="colorTitle"
                  :colorDescription="colorDescription"
                  :colorTitleLevel="colorTitleLevel"
              />
            `,
		}
	},
	tags: ['!dev'],
}

export const SurfaceBackgrounds: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Surface'
				const colorDescription = 'Ce sont les couleurs à utiliser sur les containers présents en surperposition du background principal. Le principe étant d’utiliser la variante “surface” au dessus du “main” et les “alt” au dessus des “alt”.'
				const colorTitleLevel = 3
				const cnamColors = {
					'background-surface': cnamLightTheme.backgroundSurface,
					'background-surface-alt': cnamLightTheme.backgroundSurfaceAlt,
				}
				const paColors = {
					'background-surface': paLightTheme.backgroundSurface,
					'background-surface-alt': paLightTheme.backgroundSurfaceAlt,
				}
				const apColors = {
					'background-surface': apLightTheme.backgroundSurface,
					'background-surface-alt': apLightTheme.backgroundSurfaceAlt,
				}
				const apColors2026 = {}
				return {
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorDescription,
					colorTitleLevel,
				}
			},
			template: `
              <ColorDisplay
                  displayEmptyColors
                  colorCategory="alternativeBackgrounds"
                  :cnamColors="cnamColors"
                  :paColors="paColors"
                  :apColors="apColors"
                  :apColors2026="apColors2026"
                  :colorTitle="colorTitle"
                  :colorDescription="colorDescription"
                  :colorTitleLevel="colorTitleLevel"
              />
            `,
		}
	},
	tags: ['!dev'],
}

export const AlternativeBackgrounds: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Alternative'
				const colorDescription = ''
				const colorTitleLevel = 3
				const cnamColors = {}
				const paColors = {}
				const apColors = {}
				const apColors2026 = { 'ap-blue-lighten-3': apColorsTokens2026.apBlue.lighten3 }
				return {
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorDescription,
					colorTitleLevel,
				}
			},
			template: `
              <ColorDisplay
                  displayEmptyColors
                  colorCategory="alternativeBackgrounds"
                  :cnamColors="cnamColors"
                  :paColors="paColors"
                  :apColors="apColors"
                  :apColors2026="apColors2026"
                  :colorTitle="colorTitle"
                  :colorDescription="colorDescription"
                  :colorTitleLevel="colorTitleLevel"
              />
            `,
		}
	},
	tags: ['!dev'],
}

export const RaisedBackgrounds: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Raised'
				const colorDescription = 'Elle s’utilise sur les éléments ayant besoin d’une légère mise en exergue.'
				const colorTitleLevel = 3
				const cnamColors = {
					'background-raised': cnamLightTheme.backgroundRaised,
				}
				const paColors = {
					'background-raised': paLightTheme.backgroundRaised,
				}
				const apColors = {
					'background-raised': apLightTheme.backgroundRaised,
				}
				const apColors2026 = {}
				return {
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorDescription,
					colorTitleLevel,
				}
			},
			template: `
              <ColorDisplay
                  displayEmptyColors
                  colorCategory="alternativeBackgrounds"
                  :cnamColors="cnamColors"
                  :paColors="paColors"
                  :apColors="apColors"
                  :apColors2026="apColors2026"
                  :colorTitle="colorTitle"
                  :colorDescription="colorDescription"
                  :colorTitleLevel="colorTitleLevel"
              />
            `,
		}
	},
	tags: ['!dev'],
}

export const DisabledBackgrounds: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Disabled'
				const colorDescription = 'Elle s’utilise sur les background des éléments désactivés.'
				const colorTitleLevel = 3
				const cnamColors = {
					'background-disabled': cnamLightTheme.backgroundDisabled,
					'background-disabled-on-dark': cnamLightTheme.backgroundDisabledOnDark,
				}
				const paColors = {
					'background-disabled': paLightTheme.backgroundDisabled,
					'background-disabled-on-dark': paLightTheme.backgroundDisabledOnDark,
				}
				const apColors = {
					'background-disabled': apLightTheme.backgroundDisabled,
					'background-disabled-on-dark': apLightTheme.backgroundDisabledOnDark,
				}
				const apColors2026 = {}
				return {
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorDescription,
					colorTitleLevel,
				}
			},
			template: `
              <ColorDisplay
                  displayEmptyColors
                  colorCategory="alternativeBackgrounds"
                  :cnamColors="cnamColors"
                  :paColors="paColors"
                  :apColors="apColors"
                  :apColors2026="apColors2026"
                  :colorTitle="colorTitle"
                  :colorDescription="colorDescription"
                  :colorTitleLevel="colorTitleLevel"
              />
            `,
		}
	},
	tags: ['!dev'],
}

export const InformationalBackgrounds: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Informational'
				const colorTitleLevel = 3
				const cnamColors = {
					'background-info': cnamLightTheme.backgroundInfo,
					'background-info-subdued': cnamLightTheme.backgroundInfoSubdued,
					'background-info-contrasted': cnamLightTheme.backgroundInfoContrasted,
				}
				const paColors = {
					'background-info': paLightTheme.backgroundInfo,
					'background-info-subdued': paLightTheme.backgroundInfoSubdued,
					'background-info-contrasted': paLightTheme.backgroundInfoContrasted,
				}
				const apColors = {
					'background-info': apLightTheme.backgroundInfo,
					'background-info-subdued': apLightTheme.backgroundInfoSubdued,
					'background-info-contrasted': apLightTheme.backgroundInfoContrasted,
				}
				const apColors2026 = {}
				return {
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorTitleLevel,
				}
			},
			template: `
              <ColorDisplay
                  displayEmptyColors
                  colorCategory="informationalBackgrounds"
                  :cnamColors="cnamColors"
                  :paColors="paColors"
                  :apColors="apColors"
                  :apColors2026="apColors2026"
                  :colorTitle="colorTitle"
                  :colorTitleLevel="colorTitleLevel"
              />
            `,
		}
	},
	tags: ['!dev'],
}

export const SuccessBackgrounds: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Success'
				const colorTitleLevel = 3
				const cnamColors = {
					'background-success': cnamLightTheme.backgroundSuccess,
					'background-success-subdued': cnamLightTheme.backgroundSuccessSubdued,
					'background-success-contrasted': cnamLightTheme.backgroundSuccessContrasted,
				}
				const paColors = {
					'background-success': paLightTheme.backgroundSuccess,
					'background-success-subdued': paLightTheme.backgroundSuccessSubdued,
					'background-success-contrasted': paLightTheme.backgroundSuccessContrasted,
				}
				const apColors = {
					'background-success': apLightTheme.backgroundSuccess,
					'background-success-subdued': apLightTheme.backgroundSuccessSubdued,
					'background-success-contrasted': apLightTheme.backgroundSuccessContrasted,
				}
				const apColors2026 = {}
				return {
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorTitleLevel,
				}
			},
			template: `
              <ColorDisplay
                  displayEmptyColors
                  colorCategory="successBackgrounds"
                  :cnamColors="cnamColors"
                  :paColors="paColors"
                  :apColors="apColors"
                  :apColors2026="apColors2026"
                  :colorTitle="colorTitle"
                  :colorTitleLevel="colorTitleLevel"
              />
            `,
		}
	},
	tags: ['!dev'],
}

export const WarningBackgrounds: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Warning'
				const colorTitleLevel = 3
				const cnamColors = {
					'background-warning': cnamLightTheme.backgroundWarning,
					'background-warning-subdued': cnamLightTheme.backgroundWarningSubdued,
					'background-warning-contrasted': cnamLightTheme.backgroundWarningContrasted,
				}
				const paColors = {
					'background-warning': paLightTheme.backgroundWarning,
					'background-warning-subdued': paLightTheme.backgroundWarningSubdued,
					'background-warning-contrasted': paLightTheme.backgroundWarningContrasted,
				}
				const apColors = {
					'background-warning': apLightTheme.backgroundWarning,
					'background-warning-subdued': apLightTheme.backgroundWarningSubdued,
					'background-warning-contrasted': apLightTheme.backgroundWarningContrasted,
				}
				const apColors2026 = {}
				return {
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorTitleLevel,
				}
			},
			template: `
              <ColorDisplay
                  displayEmptyColors
                  colorCategory="warningBackgrounds"
                  :cnamColors="cnamColors"
                  :paColors="paColors"
                  :apColors="apColors"
                  :apColors2026="apColors2026"
                  :colorTitle="colorTitle"
                  :colorTitleLevel="colorTitleLevel"
              />
            `,
		}
	},
	tags: ['!dev'],
}

export const ErrorBackgrounds: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Error'
				const colorTitleLevel = 3
				const cnamColors = {
					'background-error': cnamLightTheme.backgroundError,
					'background-error-subdued': cnamLightTheme.backgroundErrorSubdued,
					'background-error-contrasted': cnamLightTheme.backgroundErrorContrasted,
				}
				const paColors = {
					'background-error': paLightTheme.backgroundError,
					'background-error-subdued': paLightTheme.backgroundErrorSubdued,
					'background-error-contrasted': paLightTheme.backgroundErrorContrasted,
				}
				const apColors = {
					'background-error': apLightTheme.backgroundError,
					'background-error-subdued': apLightTheme.backgroundErrorSubdued,
					'background-error-contrasted': apLightTheme.backgroundErrorContrasted,
				}
				const apColors2026 = {}
				return {
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorTitleLevel,
				}
			},
			template: `
              <ColorDisplay
                  displayEmptyColors
                  colorCategory="errorBackgrounds"
                  :cnamColors="cnamColors"
                  :paColors="paColors"
                  :apColors="apColors"
                  :apColors2026="apColors2026"
                  :colorTitle="colorTitle"
                  :colorTitleLevel="colorTitleLevel"
              />
            `,
		}
	},
	tags: ['!dev'],
}

export const OtherBackgrounds: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Other'
				const colorTitleLevel = 3
				const cnamColors = {
					'background-assure': cnamLightTheme.backgroundAssure,
					'background-professionnel': cnamLightTheme.backgroundProfessionnel,
					'background-entreprise': cnamLightTheme.backgroundEntreprise,
				}
				const paColors = {
					'background-assure': paLightTheme.backgroundAssure,
					'background-professionnel': paLightTheme.backgroundProfessionnel,
					'background-entreprise': paLightTheme.backgroundEntreprise,
				}
				const apColors = {
					'background-assure': apLightTheme.backgroundAssure,
					'background-professionnel': apLightTheme.backgroundProfessionnel,
					'background-entreprise': apLightTheme.backgroundEntreprise,
				}
				const apColors2026 = {}
				return {
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorTitleLevel,
				}
			},
			template: `
              <ColorDisplay
                  displayEmptyColors
                  colorCategory="otherBackgrounds"
                  :cnamColors="cnamColors"
                  :paColors="paColors"
                  :apColors="apColors"
                  :apColors2026="apColors2026"
                  :colorTitle="colorTitle"
                  :colorTitleLevel="colorTitleLevel"
              />
            `,
		}
	},
	tags: ['!dev'],
}

export const StatusBackgrounds: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Fonds pour les statuts'
				const colorTitleLevel = 3
				const displayEmptyColors = false
				const cnamColors = {}
				const paColors = {}
				const apColors = {}
				const apColors2026 = {
					'ap-blue-lighten-2': apColorsTokens2026.apBlue.lighten2,
					'ap-parme': apColorsTokens2026.apParme.base,
					'ap-yellow-lighten-3': apColorsTokens2026.apYellow.lighten3,
					'ap-red-lighten-2': apColorsTokens2026.apRed.lighten2,
					'ap-red-lighten-3': apColorsTokens2026.apRed.lighten3,
					'ap-green-lighten-2': apColorsTokens2026.apGreen.lighten2,
					'ap-grey-lighten-2': apColorsTokens2026.apGrey.lighten2,
				}
				return {
					displayEmptyColors,
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorTitleLevel,
				}
			},
			template: `
              <ColorDisplay
                  colorCategory="base"
                  :cnamColors="cnamColors"
                  :paColors="paColors"
                  :apColors="apColors"
                  :apColors2026="apColors2026"
                  :colorTitle="colorTitle"
                  :colorTitleLevel="colorTitleLevel"
                  :displayEmptyColors="displayEmptyColors"
              />
            `,
		}
	},
	tags: ['!dev'],
}

export const MessagesBackgrounds: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Fonds pour les messages'
				const colorTitleLevel = 3
				const displayEmptyColors = false
				const cnamColors = {}
				const paColors = {}
				const apColors = {}
				const apColors2026 = {
					'ap-red': apColorsTokens2026.apRed.base,
					'ap-turquoise-darken-1': apColorsTokens2026.apTurquoise.darken1,
					'ap-yellow': apColorsTokens2026.apYellow.base,
					'ap-parme-darken-1': apColorsTokens2026.apParme.darken1,
				}
				return {
					displayEmptyColors,
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorTitleLevel,
				}
			},
			template: `
              <ColorDisplay
                  colorCategory="base"
                  :cnamColors="cnamColors"
                  :paColors="paColors"
                  :apColors="apColors"
                  :apColors2026="apColors2026"
                  :colorTitle="colorTitle"
                  :colorTitleLevel="colorTitleLevel"
                  :displayEmptyColors="displayEmptyColors"
              />
            `,
		}
	},
	tags: ['!dev'],
}

export const BackgroundSection = {
	render() {
		return h(createSection('Background', [
			MainBackgrounds,
			SurfaceBackgrounds,
			AlternativeBackgrounds,
			RaisedBackgrounds,
			DisabledBackgrounds,
			InformationalBackgrounds,
			SuccessBackgrounds,
			WarningBackgrounds,
			ErrorBackgrounds,
			OtherBackgrounds,
			StatusBackgrounds,
			MessagesBackgrounds,
		]))
	},
}

export const PaletteOrange: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Orange'
				const displayEmptyColors = false
				const colorTitleLevel = 3
				const cnamColors = {
					'orange-darken-80': cnamColorsTokens.orange.darken80,
					'orange-darken-60': cnamColorsTokens.orange.darken60,
					'orange-darken-40': cnamColorsTokens.orange.darken40,
					'orange-darken-20': cnamColorsTokens.orange.darken20,
					'orange-base': cnamColorsTokens.orange.base,
					'orange-lighten-20': cnamColorsTokens.orange.lighten20,
					'orange-lighten-40': cnamColorsTokens.orange.lighten40,
					'orange-lighten-60': cnamColorsTokens.orange.lighten60,
					'orange-lighten-80': cnamColorsTokens.orange.lighten80,
					'orange-lighten-90': cnamColorsTokens.orange.lighten90,
					'orange-lighten-97': cnamColorsTokens.orange.lighten97,
				}
				const paColors = {
					'orange-darken-80': paColorsTokens.orange.darken80,
					'orange-darken-60': paColorsTokens.orange.darken60,
					'orange-darken-40': paColorsTokens.orange.darken40,
					'orange-darken-20': paColorsTokens.orange.darken20,
					'orange-base': paColorsTokens.orange.base,
					'orange-lighten-20': paColorsTokens.orange.lighten20,
					'orange-lighten-40': paColorsTokens.orange.lighten40,
					'orange-lighten-60': paColorsTokens.orange.lighten60,
					'orange-lighten-80': paColorsTokens.orange.lighten80,
					'orange-lighten-90': paColorsTokens.orange.lighten90,
					'orange-lighten-97': paColorsTokens.orange.lighten97,
				}
				const apColors = {
					'amber-darken-80': apColorsTokens.amber.darken80,
					'amber-darken-60': apColorsTokens.amber.darken60,
					'amber-darken-40': apColorsTokens.amber.darken40,
					'amber-darken-20': apColorsTokens.amber.darken20,
					'amber-base': apColorsTokens.amber.base,
					'amber-lighten-20': apColorsTokens.amber.lighten20,
					'amber-lighten-40': apColorsTokens.amber.lighten40,
					'amber-lighten-60': apColorsTokens.amber.lighten60,
					'amber-lighten-80': apColorsTokens.amber.lighten80,
					'amber-lighten-90': apColorsTokens.amber.lighten90,
					'amber-lighten-97': apColorsTokens.amber.lighten97,
				}
				const apColors2026 = {}
				return {
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorTitleLevel,
					displayEmptyColors,
				}
			},
			template: `
				<ColorDisplay
                    :displayEmptyColors="displayEmptyColors"
					colorCategory="base" 
					:cnamColors="cnamColors" 
					:paColors="paColors"
					:apColors="apColors"
                    :apColors2026="apColors2026"
                    :colorTitle="colorTitle"
					:colorTitleLevel="colorTitleLevel"
				/>
			`,
		}
	},
	tags: ['!dev'],
}

export const PaletteRed: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Red'
				const colorTitleLevel = 3
				const displayEmptyColors = false
				const cnamColors = {}
				const paColors = {}
				const apColors = {
					'red-darken-80': apColorsTokens.red.darken80,
					'red-darken-60': apColorsTokens.red.darken60,
					'red-darken-40': apColorsTokens.red.darken40,
					'red-darken-20': apColorsTokens.red.darken20,
					'red-base': apColorsTokens.red.base,
					'red-lighten-20': apColorsTokens.red.lighten20,
					'red-lighten-40': apColorsTokens.red.lighten40,
					'red-lighten-60': apColorsTokens.red.lighten60,
					'red-lighten-80': apColorsTokens.red.lighten80,
					'red-lighten-90': apColorsTokens.red.lighten90,
					'red-lighten-97': apColorsTokens.red.lighten97,
				}
				const apColors2026 = {
					'ap-red-darken-2': apColorsTokens2026.apRed.darken2,
					'ap-red-darken-1': apColorsTokens2026.apRed.darken1,
					'ap-red': apColorsTokens2026.apRed.base,
					'ap-red-lighten-1': apColorsTokens2026.apRed.lighten1,
					'ap-red-lighten-2': apColorsTokens2026.apRed.lighten2,
					'ap-red-lighten-3': apColorsTokens2026.apRed.lighten3,
					'ap-red-lighten-4': apColorsTokens2026.apRed.lighten4,
				}
				return {
					displayEmptyColors,
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorTitleLevel,
				}
			},
			template: `
				<ColorDisplay
					colorCategory="base" 
					:cnamColors="cnamColors" 
					:paColors="paColors"
					:apColors="apColors"
                    :apColors2026="apColors2026"
                    :colorTitle="colorTitle"
					:colorTitleLevel="colorTitleLevel"
					:displayEmptyColors="displayEmptyColors"
				/>
			`,
		}
	},
	tags: ['!dev'],
}

export const PaletteYellow: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Yellow'
				const colorTitleLevel = 3
				const cnamColors = {
					'yellow-darken-80': cnamColorsTokens.yellow.darken80,
					'yellow-darken-60': cnamColorsTokens.yellow.darken60,
					'yellow-darken-40': cnamColorsTokens.yellow.darken40,
					'yellow-darken-20': cnamColorsTokens.yellow.darken20,
					'yellow-base': cnamColorsTokens.yellow.base,
					'yellow-lighten-20': cnamColorsTokens.yellow.lighten20,
					'yellow-lighten-40': cnamColorsTokens.yellow.lighten40,
					'yellow-lighten-60': cnamColorsTokens.yellow.lighten60,
					'yellow-lighten-80': cnamColorsTokens.yellow.lighten80,
					'yellow-lighten-90': cnamColorsTokens.yellow.lighten90,
					'yellow-lighten-97': cnamColorsTokens.yellow.lighten97,
				}
				const paColors = {
					'yellow-darken-80': paColorsTokens.yellow.darken80,
					'yellow-darken-60': paColorsTokens.yellow.darken60,
					'yellow-darken-40': paColorsTokens.yellow.darken40,
					'yellow-darken-20': paColorsTokens.yellow.darken20,
					'yellow-base': paColorsTokens.yellow.base,
					'yellow-lighten-20': paColorsTokens.yellow.lighten20,
					'yellow-lighten-40': paColorsTokens.yellow.lighten40,
					'yellow-lighten-60': paColorsTokens.yellow.lighten60,
					'yellow-lighten-80': paColorsTokens.yellow.lighten80,
					'yellow-lighten-90': paColorsTokens.yellow.lighten90,
					'yellow-lighten-97': paColorsTokens.yellow.lighten97,
				}
				const apColors = {
					'yellow-darken-80': apColorsTokens.yellow.darken80,
					'yellow-darken-60': apColorsTokens.yellow.darken60,
					'yellow-darken-40': apColorsTokens.yellow.darken40,
					'yellow-darken-20': apColorsTokens.yellow.darken20,
					'yellow-base': apColorsTokens.yellow.base,
					'yellow-lighten-20': apColorsTokens.yellow.lighten20,
					'yellow-lighten-40': apColorsTokens.yellow.lighten40,
					'yellow-lighten-60': apColorsTokens.yellow.lighten60,
					'yellow-lighten-80': apColorsTokens.yellow.lighten80,
					'yellow-lighten-90': apColorsTokens.yellow.lighten90,
					'yellow-lighten-97': apColorsTokens.yellow.lighten97,
				}
				const apColors2026 = {
					'ap-yellow-darken-4': apColorsTokens2026.apYellow.darken4,
					'ap-yellow-darken-3': apColorsTokens2026.apYellow.darken3,
					'ap-yellow-darken-2': apColorsTokens2026.apYellow.darken2,
					'ap-yellow-darken-1': apColorsTokens2026.apYellow.darken1,
					'ap-yellow': apColorsTokens2026.apYellow.base,
					'ap-yellow-lighten-1': apColorsTokens2026.apYellow.lighten1,
					'ap-yellow-lighten-2': apColorsTokens2026.apYellow.lighten2,
					'ap-yellow-lighten-3': apColorsTokens2026.apYellow.lighten3,
					'ap-yellow-lighten-4': apColorsTokens2026.apYellow.lighten4,
					'ap-yellow-lighten-5': apColorsTokens2026.apYellow.lighten5,
				}
				return {
					cnamColors,
					paColors,
					apColors,
					apColors2026: apColors2026,
					colorTitle,
					colorTitleLevel,
				}
			},
			template: `
              <ColorDisplay
                  displayEmptyColors
                  colorCategory="base"
                  :cnamColors="cnamColors"
                  :paColors="paColors"
                  :apColors="apColors"
                  :apColors2026="apColors2026"
                  :colorTitle="colorTitle"
                  :colorTitleLevel="colorTitleLevel"
              />
            `,
		}
	},
	tags: ['!dev'],
}

export const PaletteForestGreen: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Forest green'
				const displayEmptyColors = false
				const colorTitleLevel = 3
				const apColors = {
					'forest-green-darken-80': apColorsTokens.forestGreen.darken80,
					'forest-green-darken-60': apColorsTokens.forestGreen.darken60,
					'forest-green-darken-40': apColorsTokens.forestGreen.darken40,
					'forest-green-darken-20': apColorsTokens.forestGreen.darken20,
					'forest-green-base': apColorsTokens.forestGreen.base,
					'forest-green-lighten-20': apColorsTokens.forestGreen.lighten20,
					'forest-green-lighten-40': apColorsTokens.forestGreen.lighten40,
					'forest-green-lighten-60': apColorsTokens.forestGreen.lighten60,
					'forest-green-lighten-80': apColorsTokens.forestGreen.lighten80,
					'forest-green-lighten-90': apColorsTokens.forestGreen.lighten90,
					'forest-green-lighten-97': apColorsTokens.forestGreen.lighten97,
				}
				const cnamColors = {}
				const paColors = {}
				const apColors2026 = {}
				return {
					displayEmptyColors,
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorTitleLevel,
				}
			},
			template: `
              <ColorDisplay
                  colorCategory="base"
                  :cnamColors="cnamColors"
                  :paColors="paColors"
                  :apColors="apColors"
                  :apColors2026="apColors2026"
                  :colorTitle="colorTitle"
                  :colorTitleLevel="colorTitleLevel"
                  :displayEmptyColors="displayEmptyColors"
              />
            `,
		}
	},
	tags: ['!dev'],
}

export const PaletteGreen: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Green'
				const colorTitleLevel = 3
				const cnamColors = {
					'green-darken-80': cnamColorsTokens.green.darken80,
					'green-darken-60': cnamColorsTokens.green.darken60,
					'green-darken-40': cnamColorsTokens.green.darken40,
					'green-darken-20': cnamColorsTokens.green.darken20,
					'green-base': cnamColorsTokens.green.base,
					'green-lighten-20': cnamColorsTokens.green.lighten20,
					'green-lighten-40': cnamColorsTokens.green.lighten40,
					'green-lighten-60': cnamColorsTokens.green.lighten60,
					'green-lighten-80': cnamColorsTokens.green.lighten80,
					'green-lighten-90': cnamColorsTokens.green.lighten90,
					'green-lighten-97': cnamColorsTokens.green.lighten97,
				}
				const paColors = {
					'green-darken-80': paColorsTokens.green.darken80,
					'green-darken-60': paColorsTokens.green.darken60,
					'green-darken-40': paColorsTokens.green.darken40,
					'green-darken-20': paColorsTokens.green.darken20,
					'green-base': paColorsTokens.green.base,
					'green-lighten-20': paColorsTokens.green.lighten20,
					'green-lighten-40': paColorsTokens.green.lighten40,
					'green-lighten-60': paColorsTokens.green.lighten60,
					'green-lighten-80': paColorsTokens.green.lighten80,
					'green-lighten-90': paColorsTokens.green.lighten90,
					'green-lighten-97': paColorsTokens.green.lighten97,
				}
				const apColors = {
					'green-darken-80': apColorsTokens.green.darken80,
					'green-darken-60': apColorsTokens.green.darken60,
					'green-darken-40': apColorsTokens.green.darken40,
					'green-darken-20': apColorsTokens.green.darken20,
					'green-base': apColorsTokens.green.base,
					'green-lighten-20': apColorsTokens.green.lighten20,
					'green-lighten-40': apColorsTokens.green.lighten40,
					'green-lighten-60': apColorsTokens.green.lighten60,
					'green-lighten-80': apColorsTokens.green.lighten80,
					'green-lighten-90': apColorsTokens.green.lighten90,
					'green-lighten-97': apColorsTokens.green.lighten97,
				}
				const apColors2026 = {
					'ap-green-darken-2': apColorsTokens2026.apGreen.darken2,
					'ap-green-darken-1': apColorsTokens2026.apGreen.darken1,
					'ap-green': apColorsTokens2026.apGreen.base,
					'ap-green-lighten-1': apColorsTokens2026.apGreen.lighten1,
					'ap-green-lighten-2': apColorsTokens2026.apGreen.lighten2,
				}
				return {
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorTitleLevel,
				}
			},
			template: `
				<ColorDisplay 
					displayEmptyColors
					colorCategory="base" 
					:cnamColors="cnamColors" 
					:paColors="paColors"
                    :apColors="apColors"
                    :apColors2026="apColors2026"
                    :colorTitle="colorTitle"
					:colorTitleLevel="colorTitleLevel"
				/>
			`,
		}
	},
	tags: ['!dev'],
}

export const PaletteTurquoise: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Turquoise'
				const colorTitleLevel = 3
				const cnamColors = {
					'turquoise-darken-80': cnamColorsTokens.turquoise.darken80,
					'turquoise-darken-60': cnamColorsTokens.turquoise.darken60,
					'turquoise-darken-40': cnamColorsTokens.turquoise.darken40,
					'turquoise-darken-20': cnamColorsTokens.turquoise.darken20,
					'turquoise-base': cnamColorsTokens.turquoise.base,
					'turquoise-lighten-20': cnamColorsTokens.turquoise.lighten20,
					'turquoise-lighten-40': cnamColorsTokens.turquoise.lighten40,
					'turquoise-lighten-60': cnamColorsTokens.turquoise.lighten60,
					'turquoise-lighten-80': cnamColorsTokens.turquoise.lighten80,
					'turquoise-lighten-90': cnamColorsTokens.turquoise.lighten90,
					'turquoise-lighten-97': cnamColorsTokens.turquoise.lighten97,
				}
				const paColors = {
					'turquoise-darken-80': paColorsTokens.turquoise.darken80,
					'turquoise-darken-60': paColorsTokens.turquoise.darken60,
					'turquoise-darken-40': paColorsTokens.turquoise.darken40,
					'turquoise-darken-20': paColorsTokens.turquoise.darken20,
					'turquoise-base': paColorsTokens.turquoise.base,
					'turquoise-lighten-20': paColorsTokens.turquoise.lighten20,
					'turquoise-lighten-40': paColorsTokens.turquoise.lighten40,
					'turquoise-lighten-60': paColorsTokens.turquoise.lighten60,
					'turquoise-lighten-80': paColorsTokens.turquoise.lighten80,
					'turquoise-lighten-90': paColorsTokens.turquoise.lighten90,
					'turquoise-lighten-97': paColorsTokens.turquoise.lighten97,
				}
				const apColors = {
					'turquoise-darken-80': apColorsTokens.turquoise.darken80,
					'turquoise-darken-60': apColorsTokens.turquoise.darken60,
					'turquoise-darken-40': apColorsTokens.turquoise.darken40,
					'turquoise-darken-20': apColorsTokens.turquoise.darken20,
					'turquoise-base': apColorsTokens.turquoise.base,
					'turquoise-lighten-20': apColorsTokens.turquoise.lighten20,
					'turquoise-lighten-40': apColorsTokens.turquoise.lighten40,
					'turquoise-lighten-60': apColorsTokens.turquoise.lighten60,
					'turquoise-lighten-80': apColorsTokens.turquoise.lighten80,
					'turquoise-lighten-90': apColorsTokens.turquoise.lighten90,
					'turquoise-lighten-97': apColorsTokens.turquoise.lighten97,
				}
				const apColors2026 = {
					'ap-turquoise-darken-3': apColorsTokens2026.apTurquoise.darken3,
					'ap-turquoise-darken-2': apColorsTokens2026.apTurquoise.darken2,
					'ap-turquoise-darken-1': apColorsTokens2026.apTurquoise.darken1,
					'ap-Turquoise': apColorsTokens2026.apTurquoise.base,
					'ap-turquoise-lighten-1': apColorsTokens2026.apTurquoise.lighten1,
					'ap-turquoise-lighten-2': apColorsTokens2026.apTurquoise.lighten2,
				}
				return {
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorTitleLevel,
				}
			},
			template: `
				<ColorDisplay
					displayEmptyColors
					colorCategory="base" 
					:cnamColors="cnamColors" 
					:paColors="paColors"
					:apColors="apColors"
                    :apColors2026="apColors2026"
                    :colorTitle="colorTitle"
					:colorTitleLevel="colorTitleLevel"
				/>
			`,
		}
	},
	tags: ['!dev'],
}

export const PaletteBlue: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Blue'
				const colorTitleLevel = 3
				const cnamColors = {
					'blue-darken-80': cnamColorsTokens.blue.darken80,
					'blue-darken-60': cnamColorsTokens.blue.darken60,
					'blue-darken-40': cnamColorsTokens.blue.darken40,
					'blue-darken-20': cnamColorsTokens.blue.darken20,
					'blue-base': cnamColorsTokens.blue.base,
					'blue-lighten-20': cnamColorsTokens.blue.lighten20,
					'blue-lighten-40': cnamColorsTokens.blue.lighten40,
					'blue-lighten-60': cnamColorsTokens.blue.lighten60,
					'blue-lighten-80': cnamColorsTokens.blue.lighten80,
					'blue-lighten-90': cnamColorsTokens.blue.lighten90,
					'blue-lighten-97': cnamColorsTokens.blue.lighten97,
				}
				const paColors = {
					'blue-darken-80': paColorsTokens.blue.darken80,
					'blue-darken-60': paColorsTokens.blue.darken60,
					'blue-darken-40': paColorsTokens.blue.darken40,
					'blue-darken-20': paColorsTokens.blue.darken20,
					'blue-base': paColorsTokens.blue.base,
					'blue-lighten-20': paColorsTokens.blue.lighten20,
					'blue-lighten-40': paColorsTokens.blue.lighten40,
					'blue-lighten-60': paColorsTokens.blue.lighten60,
					'blue-lighten-80': paColorsTokens.blue.lighten80,
					'blue-lighten-90': paColorsTokens.blue.lighten90,
					'blue-lighten-97': paColorsTokens.blue.lighten97,
				}
				const apColors = {
					'blue-darken-80': apColorsTokens.blue.darken80,
					'blue-darken-60': apColorsTokens.blue.darken60,
					'blue-darken-40': apColorsTokens.blue.darken40,
					'blue-darken-20': apColorsTokens.blue.darken20,
					'blue-base': apColorsTokens.blue.base,
					'blue-lighten-20': apColorsTokens.blue.lighten20,
					'blue-lighten-40': apColorsTokens.blue.lighten40,
					'blue-lighten-60': apColorsTokens.blue.lighten60,
					'blue-lighten-80': apColorsTokens.blue.lighten80,
					'blue-lighten-90': apColorsTokens.blue.lighten90,
					'blue-lighten-97': apColorsTokens.blue.lighten97,
				}
				const apColors2026 = {
					'ap-blue-darken-2': apColorsTokens2026.apBlue.darken2,
					'ap-blue-darken-1': apColorsTokens2026.apBlue.darken1,
					'ap-blue': apColorsTokens2026.apBlue.base,
					'ap-blue-lighten-1': apColorsTokens2026.apBlue.lighten1,
					'ap-blue-lighten-2': apColorsTokens2026.apBlue.lighten2,
					'ap-blue-lighten-3': apColorsTokens2026.apBlue.lighten3,
					'ap-blue-lighten-4': apColorsTokens2026.apBlue.lighten4,
				}
				return {
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorTitleLevel,
				}
			},
			template: `
				<ColorDisplay 
					displayEmptyColors
					colorCategory="base" 
					:cnamColors="cnamColors" 
					:paColors="paColors" 
					:apColors="apColors"
                    :apColors2026="apColors2026"
                    :colorTitle="colorTitle"
					:colorTitleLevel="colorTitleLevel"
				/>
			`,
		}
	},
	tags: ['!dev'],
}

export const PaletteCyan: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Cyan'
				const displayEmptyColors = false
				const colorTitleLevel = 3
				const cnamColors = {
					'cyan-darken-80': cnamColorsTokens.cyan.darken80,
					'cyan-darken-60': cnamColorsTokens.cyan.darken60,
					'cyan-darken-40': cnamColorsTokens.cyan.darken40,
					'cyan-darken-20': cnamColorsTokens.cyan.darken20,
					'cyan-base': cnamColorsTokens.cyan.base,
					'cyan-lighten-20': cnamColorsTokens.cyan.lighten20,
					'cyan-lighten-40': cnamColorsTokens.cyan.lighten40,
					'cyan-lighten-60': cnamColorsTokens.cyan.lighten60,
					'cyan-lighten-80': cnamColorsTokens.cyan.lighten80,
					'cyan-lighten-90': cnamColorsTokens.cyan.lighten90,
					'cyan-lighten-97': cnamColorsTokens.cyan.lighten97,
				}
				const paColors = {
					'cyan-darken-80': paColorsTokens.cyan.darken80,
					'cyan-darken-60': paColorsTokens.cyan.darken60,
					'cyan-darken-40': paColorsTokens.cyan.darken40,
					'cyan-darken-20': paColorsTokens.cyan.darken20,
					'cyan-base': paColorsTokens.cyan.base,
					'cyan-lighten-20': paColorsTokens.cyan.lighten20,
					'cyan-lighten-40': paColorsTokens.cyan.lighten40,
					'cyan-lighten-60': paColorsTokens.cyan.lighten60,
					'cyan-lighten-80': paColorsTokens.cyan.lighten80,
					'cyan-lighten-90': paColorsTokens.cyan.lighten90,
					'cyan-lighten-97': paColorsTokens.cyan.lighten97,
				}
				const apColors = {
					'cyan-darken-80': apColorsTokens.cyan.darken80,
					'cyan-darken-60': apColorsTokens.cyan.darken60,
					'cyan-darken-40': apColorsTokens.cyan.darken40,
					'cyan-darken-20': apColorsTokens.cyan.darken20,
					'cyan-base': apColorsTokens.cyan.base,
					'cyan-lighten-20': apColorsTokens.cyan.lighten20,
					'cyan-lighten-40': apColorsTokens.cyan.lighten40,
					'cyan-lighten-60': apColorsTokens.cyan.lighten60,
					'cyan-lighten-80': apColorsTokens.cyan.lighten80,
					'cyan-lighten-90': apColorsTokens.cyan.lighten90,
					'cyan-lighten-97': apColorsTokens.cyan.lighten97,
				}
				const apColors2026 = {}
				return {
					displayEmptyColors,
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorTitleLevel,
				}
			},
			template: `
				<ColorDisplay
                    :displayEmptyColors="displayEmptyColors"
					colorCategory="base" 
					:cnamColors="cnamColors" 
					:paColors="paColors"
					:apColors="apColors"
                    :apColors2026="apColors2026"
                    :colorTitle="colorTitle"
					:colorTitleLevel="colorTitleLevel"
				/>
			`,
		}
	},
	tags: ['!dev'],
}

export const PaletteFrostedBlue: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Frosted blue'
				const displayEmptyColors = false
				const colorTitleLevel = 3
				const cnamColors = {
					'frosted-blue-darken-80': cnamColorsTokens.frostedBlue.darken80,
					'frosted-blue-darken-60': cnamColorsTokens.frostedBlue.darken60,
					'frosted-blue-darken-40': cnamColorsTokens.frostedBlue.darken40,
					'frosted-blue-darken-20': cnamColorsTokens.frostedBlue.darken20,
					'frosted-blue-base': cnamColorsTokens.frostedBlue.base,
					'frosted-blue-lighten-20': cnamColorsTokens.frostedBlue.lighten20,
					'frosted-blue-lighten-40': cnamColorsTokens.frostedBlue.lighten40,
					'frosted-blue-lighten-60': cnamColorsTokens.frostedBlue.lighten60,
					'frosted-blue-lighten-80': cnamColorsTokens.frostedBlue.lighten80,
					'frosted-blue-lighten-90': cnamColorsTokens.frostedBlue.lighten90,
					'frosted-blue-lighten-97': cnamColorsTokens.frostedBlue.lighten97,
				}
				const paColors = {
					'frosted-blue-darken-80': paColorsTokens.frostedBlue.darken80,
					'frosted-blue-darken-60': paColorsTokens.frostedBlue.darken60,
					'frosted-blue-darken-40': paColorsTokens.frostedBlue.darken40,
					'frosted-blue-darken-20': paColorsTokens.frostedBlue.darken20,
					'frosted-blue-base': paColorsTokens.frostedBlue.base,
					'frosted-blue-lighten-20': paColorsTokens.frostedBlue.lighten20,
					'frosted-blue-lighten-40': paColorsTokens.frostedBlue.lighten40,
					'frosted-blue-lighten-60': paColorsTokens.frostedBlue.lighten60,
					'frosted-blue-lighten-80': paColorsTokens.frostedBlue.lighten80,
					'frosted-blue-lighten-90': paColorsTokens.frostedBlue.lighten90,
					'frosted-blue-lighten-97': paColorsTokens.frostedBlue.lighten97,
				}
				const apColors = {}
				const apColors2026 = {}
				return {
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorTitleLevel,
					displayEmptyColors,
				}
			},
			template: `
				<ColorDisplay
                    :displayEmptyColors="displayEmptyColors"
					colorCategory="base" 
					:cnamColors="cnamColors" 
					:paColors="paColors" 
					:apColors="apColors"
                    :apColors2026="apColors2026"
                    :colorTitle="colorTitle"
					:colorTitleLevel="colorTitleLevel"
				/>
			`,
		}
	},
	tags: ['!dev'],
}

export const PaletteParma: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Parma'
				const displayEmptyColors = false
				const colorTitleLevel = 3
				const cnamColors = {
					'parma-darken-80': cnamColorsTokens.parma.darken80,
					'parma-darken-60': cnamColorsTokens.parma.darken60,
					'parma-darken-40': cnamColorsTokens.parma.darken40,
					'parma-darken-20': cnamColorsTokens.parma.darken20,
					'parma-base': cnamColorsTokens.parma.base,
					'parma-lighten-20': cnamColorsTokens.parma.lighten20,
					'parma-lighten-40': cnamColorsTokens.parma.lighten40,
					'parma-lighten-60': cnamColorsTokens.parma.lighten60,
					'parma-lighten-80': cnamColorsTokens.parma.lighten80,
					'parma-lighten-90': cnamColorsTokens.parma.lighten90,
					'parma-lighten-97': cnamColorsTokens.parma.lighten97,
				}
				const paColors = {
					'parma-darken-80': paColorsTokens.parma.darken80,
					'parma-darken-60': paColorsTokens.parma.darken60,
					'parma-darken-40': paColorsTokens.parma.darken40,
					'parma-darken-20': paColorsTokens.parma.darken20,
					'parma-base': paColorsTokens.parma.base,
					'parma-lighten-20': paColorsTokens.parma.lighten20,
					'parma-lighten-40': paColorsTokens.parma.lighten40,
					'parma-lighten-60': paColorsTokens.parma.lighten60,
					'parma-lighten-80': paColorsTokens.parma.lighten80,
					'parma-lighten-90': paColorsTokens.parma.lighten90,
					'parma-lighten-97': paColorsTokens.parma.lighten97,
				}
				const apColors = {
					'parma-darken-80': apColorsTokens.parma.darken80,
					'parma-darken-60': apColorsTokens.parma.darken60,
					'parma-darken-40': apColorsTokens.parma.darken40,
					'parma-darken-20': apColorsTokens.parma.darken20,
					'parma-base': apColorsTokens.parma.base,
					'parma-lighten-20': apColorsTokens.parma.lighten20,
					'parma-lighten-40': apColorsTokens.parma.lighten40,
					'parma-lighten-60': apColorsTokens.parma.lighten60,
					'parma-lighten-80': apColorsTokens.parma.lighten80,
					'parma-lighten-90': apColorsTokens.parma.lighten90,
					'parma-lighten-97': apColorsTokens.parma.lighten97,
				}
				const apColors2026 = {
					'ap-parme-darken-1': apColorsTokens2026.apParme.darken1,
					'ap-parme': apColorsTokens2026.apParme.base,
				}
				return {
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorTitleLevel,
					displayEmptyColors,
				}
			},
			template: `
				<ColorDisplay
                    :displayEmptyColors="displayEmptyColors"
					colorCategory="base" 
					:cnamColors="cnamColors" 
					:paColors="paColors" 
					:apColors="apColors"
                    :apColors2026="apColors2026"
                    :colorTitle="colorTitle"
					:colorTitleLevel="colorTitleLevel"
				/>
			`,
		}
	},
	tags: ['!dev'],
}

export const PaletteMauve: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Mauve'
				const displayEmptyColors = false
				const colorTitleLevel = 3
				const cnamColors = {
					'mauve-darken-80': cnamColorsTokens.mauve.darken80,
					'mauve-darken-60': cnamColorsTokens.mauve.darken60,
					'mauve-darken-40': cnamColorsTokens.mauve.darken40,
					'mauve-darken-20': cnamColorsTokens.mauve.darken20,
					'mauve-base': cnamColorsTokens.mauve.base,
					'mauve-lighten-20': cnamColorsTokens.mauve.lighten20,
					'mauve-lighten-40': cnamColorsTokens.mauve.lighten40,
					'mauve-lighten-60': cnamColorsTokens.mauve.lighten60,
					'mauve-lighten-80': cnamColorsTokens.mauve.lighten80,
					'mauve-lighten-90': cnamColorsTokens.mauve.lighten90,
					'mauve-lighten-97': cnamColorsTokens.mauve.lighten97,
				}
				const paColors = {
					'mauve-darken-80': paColorsTokens.mauve.darken80,
					'mauve-darken-60': paColorsTokens.mauve.darken60,
					'mauve-darken-40': paColorsTokens.mauve.darken40,
					'mauve-darken-20': paColorsTokens.mauve.darken20,
					'mauve-base': paColorsTokens.mauve.base,
					'mauve-lighten-20': paColorsTokens.mauve.lighten20,
					'mauve-lighten-40': paColorsTokens.mauve.lighten40,
					'mauve-lighten-60': paColorsTokens.mauve.lighten60,
					'mauve-lighten-80': paColorsTokens.mauve.lighten80,
					'mauve-lighten-90': paColorsTokens.mauve.lighten90,
					'mauve-lighten-97': paColorsTokens.mauve.lighten97,
				}
				const apColors = {
					'mauve-darken-80': apColorsTokens.mauve.darken80,
					'mauve-darken-60': apColorsTokens.mauve.darken60,
					'mauve-darken-40': apColorsTokens.mauve.darken40,
					'mauve-darken-20': apColorsTokens.mauve.darken20,
					'mauve-base': apColorsTokens.mauve.base,
					'mauve-lighten-20': apColorsTokens.mauve.lighten20,
					'mauve-lighten-40': apColorsTokens.mauve.lighten40,
					'mauve-lighten-60': apColorsTokens.mauve.lighten60,
					'mauve-lighten-80': apColorsTokens.mauve.lighten80,
					'mauve-lighten-90': apColorsTokens.mauve.lighten90,
					'mauve-lighten-97': apColorsTokens.mauve.lighten97,
				}
				const apColors2026 = {}
				return {
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorTitleLevel,
					displayEmptyColors,
				}
			},
			template: `
				<ColorDisplay
                    :displayEmptyColors="displayEmptyColors"
					colorCategory="base" 
					:cnamColors="cnamColors" 
					:paColors="paColors" 
					:apColors="apColors"
                    :apColors2026="apColors2026"
                    :colorTitle="colorTitle"
					:colorTitleLevel="colorTitleLevel"
				/>
			`,
		}
	},
	tags: ['!dev'],
}

export const PalettePink: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Pink'
				const displayEmptyColors = false
				const colorTitleLevel = 3
				const cnamColors = {
					'pink-darken-80': cnamColorsTokens.pink.darken80,
					'pink-darken-60': cnamColorsTokens.pink.darken60,
					'pink-darken-40': cnamColorsTokens.pink.darken40,
					'pink-darken-20': cnamColorsTokens.pink.darken20,
					'pink-base': cnamColorsTokens.pink.base,
					'pink-lighten-20': cnamColorsTokens.pink.lighten20,
					'pink-lighten-40': cnamColorsTokens.pink.lighten40,
					'pink-lighten-60': cnamColorsTokens.pink.lighten60,
					'pink-lighten-80': cnamColorsTokens.pink.lighten80,
					'pink-lighten-90': cnamColorsTokens.pink.lighten90,
					'pink-lighten-97': cnamColorsTokens.pink.lighten97,
				}
				const paColors = {
					'pink-darken-80': paColorsTokens.pink.darken80,
					'pink-darken-60': paColorsTokens.pink.darken60,
					'pink-darken-40': paColorsTokens.pink.darken40,
					'pink-darken-20': paColorsTokens.pink.darken20,
					'pink-base': paColorsTokens.pink.base,
					'pink-lighten-20': paColorsTokens.pink.lighten20,
					'pink-lighten-40': paColorsTokens.pink.lighten40,
					'pink-lighten-60': paColorsTokens.pink.lighten60,
					'pink-lighten-80': paColorsTokens.pink.lighten80,
					'pink-lighten-90': paColorsTokens.pink.lighten90,
					'pink-lighten-97': paColorsTokens.pink.lighten97,
				}
				const apColors = {
					'pink-darken-80': apColorsTokens.pink.darken80,
					'pink-darken-60': apColorsTokens.pink.darken60,
					'pink-darken-40': apColorsTokens.pink.darken40,
					'pink-darken-20': apColorsTokens.pink.darken20,
					'pink-base': apColorsTokens.pink.base,
					'pink-lighten-20': apColorsTokens.pink.lighten20,
					'pink-lighten-40': apColorsTokens.pink.lighten40,
					'pink-lighten-60': apColorsTokens.pink.lighten60,
					'pink-lighten-80': apColorsTokens.pink.lighten80,
					'pink-lighten-90': apColorsTokens.pink.lighten90,
					'pink-lighten-97': apColorsTokens.pink.lighten97,
				}
				const apColors2026 = {
					'ap-pink': apColorsTokens2026.apPink.base,
				}
				return {
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorTitleLevel,
					displayEmptyColors,
				}
			},
			template: `
              <ColorDisplay
                  :displayEmptyColors="displayEmptyColors"
                    colorCategory="base"
                    :cnamColors="cnamColors"
                    :paColors="paColors"
                    :apColors="apColors"
                    :apColors2026="apColors2026"
					:colorTitle="colorTitle"
					:colorTitleLevel="colorTitleLevel"
				/>
			`,
		}
	},
	tags: ['!dev'],
}

export const PaletteBrick: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Brick'
				const displayEmptyColors = false
				const colorTitleLevel = 3
				const cnamColors = {
					'brick-darken-80': cnamColorsTokens.brick.darken80,
					'brick-darken-60': cnamColorsTokens.brick.darken60,
					'brick-darken-40': cnamColorsTokens.brick.darken40,
					'brick-darken-20': cnamColorsTokens.brick.darken20,
					'brick-base': cnamColorsTokens.brick.base,
					'brick-lighten-20': cnamColorsTokens.brick.lighten20,
					'brick-lighten-40': cnamColorsTokens.brick.lighten40,
					'brick-lighten-60': cnamColorsTokens.brick.lighten60,
					'brick-lighten-80': cnamColorsTokens.brick.lighten80,
					'brick-lighten-90': cnamColorsTokens.brick.lighten90,
					'brick-lighten-97': cnamColorsTokens.brick.lighten97,
				}
				const paColors = {
					'brick-darken-80': paColorsTokens.brick.darken80,
					'brick-darken-60': paColorsTokens.brick.darken60,
					'brick-darken-40': paColorsTokens.brick.darken40,
					'brick-darken-20': paColorsTokens.brick.darken20,
					'brick-base': paColorsTokens.brick.base,
					'brick-lighten-20': paColorsTokens.brick.lighten20,
					'brick-lighten-40': paColorsTokens.brick.lighten40,
					'brick-lighten-60': paColorsTokens.brick.lighten60,
					'brick-lighten-80': paColorsTokens.brick.lighten80,
					'brick-lighten-90': paColorsTokens.brick.lighten90,
					'brick-lighten-97': paColorsTokens.brick.lighten97,
				}
				const apColors = {}
				const apColors2026 = {}
				return {
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorTitleLevel,
					displayEmptyColors,
				}
			},
			template: `
				<ColorDisplay
                    :displayEmptyColors="displayEmptyColors"
                    colorCategory="base"
                    :cnamColors="cnamColors"
                    :paColors="paColors"
                    :apColors="apColors"
                    :apColors2026="apColors2026"
					:colorTitle="colorTitle"
					:colorTitleLevel="colorTitleLevel"
				/>
			`,
		}
	},
	tags: ['!dev'],
}

export const PaletteGrey: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Grey'
				const displayEmptyColors = false
				const colorTitleLevel = 3
				const cnamColors = {
					'grey-darken-80': cnamColorsTokens.grey.darken80,
					'grey-darken-60': cnamColorsTokens.grey.darken60,
					'grey-darken-40': cnamColorsTokens.grey.darken40,
					'grey-darken-20': cnamColorsTokens.grey.darken20,
					'grey-base': cnamColorsTokens.grey.base,
					'grey-lighten-20': cnamColorsTokens.grey.lighten20,
					'grey-lighten-40': cnamColorsTokens.grey.lighten40,
					'grey-lighten-60': cnamColorsTokens.grey.lighten60,
					'grey-lighten-80': cnamColorsTokens.grey.lighten80,
					'grey-lighten-90': cnamColorsTokens.grey.lighten90,
					'grey-lighten-97': cnamColorsTokens.grey.lighten97,
				}
				const paColors = {
					'grey-darken-80': paColorsTokens.grey.darken80,
					'grey-darken-60': paColorsTokens.grey.darken60,
					'grey-darken-40': paColorsTokens.grey.darken40,
					'grey-darken-20': paColorsTokens.grey.darken20,
					'grey-base': paColorsTokens.grey.base,
					'grey-lighten-20': paColorsTokens.grey.lighten20,
					'grey-lighten-40': paColorsTokens.grey.lighten40,
					'grey-lighten-60': paColorsTokens.grey.lighten60,
					'grey-lighten-80': paColorsTokens.grey.lighten80,
					'grey-lighten-90': paColorsTokens.grey.lighten90,
					'grey-lighten-97': paColorsTokens.grey.lighten97,
				}
				const apColors = {
					'grey-darken-80': apColorsTokens.grey.darken80,
					'grey-darken-60': apColorsTokens.grey.darken60,
					'grey-darken-40': apColorsTokens.grey.darken40,
					'grey-darken-20': apColorsTokens.grey.darken20,
					'grey-base': apColorsTokens.grey.base,
					'grey-lighten-20': apColorsTokens.grey.lighten20,
					'grey-lighten-40': apColorsTokens.grey.lighten40,
					'grey-lighten-60': apColorsTokens.grey.lighten60,
					'grey-lighten-80': apColorsTokens.grey.lighten80,
					'grey-lighten-90': apColorsTokens.grey.lighten90,
					'grey-lighten-97': apColorsTokens.grey.lighten97,
				}
				const apColors2026 = {
					'ap-grey-darken-1': apColorsTokens2026.apGrey.darken1,
					'ap-grey': apColorsTokens2026.apGrey.base,
					'ap-grey-lighten-1': apColorsTokens2026.apGrey.lighten1,
					'ap-grey-lighten-2': apColorsTokens2026.apGrey.lighten2,
					'ap-grey-lighten-3': apColorsTokens2026.apGrey.lighten3,
					'ap-grey-lighten-4': apColorsTokens2026.apGrey.lighten4,
					'ap-grey-lighten-5': apColorsTokens2026.apGrey.lighten5,
					'ap-grey-lighten-6': apColorsTokens2026.apGrey.lighten6,
				}
				return {
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorTitleLevel,
					displayEmptyColors,
				}
			},
			template: `
				<ColorDisplay
                    :displayEmptyColors="displayEmptyColors"
                    colorCategory="base"
                    :cnamColors="cnamColors"
                    :paColors="paColors"
                    :apColors="apColors"
                    :apColors2026="apColors2026"
					:colorTitle="colorTitle"
					:colorTitleLevel="colorTitleLevel"
				/>
			`,
		}
	},
	tags: ['!dev'],
}

export const PaletteWhite: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'White'
				const displayEmptyColors = false
				const colorTitleLevel = 3
				const cnamColors = {
					'white-lighten-70': cnamColorsTokens.white.lighten70,
					'white-lighten-60': cnamColorsTokens.white.lighten40,
					'white-lighten-40': cnamColorsTokens.white.lighten38,
					'white-lighten-20': cnamColorsTokens.white.lighten20,
					'white-base': cnamColorsTokens.white.base,
				}
				const paColors = {
					'white-lighten-80': paColorsTokens.white.lighten70,
					'white-lighten-60': paColorsTokens.white.lighten40,
					'white-lighten-40': paColorsTokens.white.lighten38,
					'white-lighten-20': paColorsTokens.white.lighten20,
					'white-base': paColorsTokens.white.base,
				}
				const apColors = {
					'white-lighten-80': apColorsTokens.white.lighten70,
					'white-lighten-60': apColorsTokens.white.lighten40,
					'white-lighten-40': apColorsTokens.white.lighten38,
					'white-lighten-20': apColorsTokens.white.lighten20,
					'white-base': apColorsTokens.white.base,
				}
				const apColors2026 = {
					'ap-white': apColorsTokens2026.apWhite.base,
				}
				return {
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorTitleLevel,
					displayEmptyColors,
				}
			},
			template: `
              <ColorDisplay
                  :displayEmptyColors="displayEmptyColors"
					colorCategory="base" 
					:cnamColors="cnamColors" 
					:paColors="paColors"
                    :apColors="apColors"
                    :apColors2026="apColors2026"
					:colorTitle="colorTitle"
					:colorTitleLevel="colorTitleLevel"
				/>
			`,
		}
	},
	tags: ['!dev'],
}

export const PaletteBlack: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Black'
				const colorTitleLevel = 3
				const displayEmptyColors = false
				const cnamColors = {}
				const paColors = {}
				const apColors = {}
				const apColors2026 = {
					'ap-black': apColorsTokens2026.apBlack.base,
				}
				return {
					displayEmptyColors,
					cnamColors,
					paColors,
					apColors,
					apColors2026,
					colorTitle,
					colorTitleLevel,
				}
			},
			template: `
				<ColorDisplay 
					:displayEmptyColors="displayEmptyColors"
					colorCategory="base" 
					:cnamColors="cnamColors" 
					:paColors="paColors"
                    :apColors="apColors"
                    :apColors2026="apColors2026"
					:colorTitle="colorTitle"
					:colorTitleLevel="colorTitleLevel"
				/>
			`,
		}
	},
	tags: ['!dev'],
}

export const PaletteSection = {
	render() {
		return h(createSection('Palette', [
			PaletteOrange,
			PaletteRed,
			PaletteYellow,
			PaletteForestGreen,
			PaletteGreen,
			PaletteTurquoise,
			PaletteBlue,
			PaletteCyan,
			PaletteFrostedBlue,
			PaletteParma,
			PaletteMauve,
			PalettePink,
			PaletteBrick,
			PaletteGrey,
			PaletteWhite,
			PaletteBlack,
		]))
	},
}
