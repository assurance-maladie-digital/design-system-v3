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
import SyAlert from '@/components/SyAlert/SyAlert.vue'
import { h } from 'vue'
import { useTheme } from 'vuetify'
import type { StoryObj } from '@storybook/vue3-vite'
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

type ThemeKey = 'cnam' | 'pa' | 'ap' | 'ap2026'

export const TokenOptimisationWarning: StoryObj = {
	render: () => ({
		components: { SyAlert },
		template: `
			<SyAlert type="warning" style="margin-bottom: 25px;">
				Suite à l'ajout du thème Amelipro dans Synapse, nous avons dû procéder à une simplification et optimisation des tokens (depuis la version 1.1.0).
			</SyAlert>
		`,
	}),
	tags: ['!dev'],
}

export const Theme: StoryObj = {
	render: () => {
		return {
			setup() {
				const theme = useTheme()

				const themeLabels: Record<ThemeKey, string> = {
					cnam: 'Assurance Maladie',
					pa: 'Portail Agent',
					ap: 'AmeliPro',
					ap2026: 'AmeliPro',
				}

				const themeLabel = computed(() => {
					const currentTheme = theme.global.name.value as ThemeKey
					return themeLabels[currentTheme] ?? themeLabels.cnam
				})

				return {
					themeLabel,
				}
			},
			template: `
              <p style="font-size: 14px; margin: 16px 0; line-height: 24px; color: rgb(46, 52, 56);">
                Les couleurs contribuent à l’identification de nos applications ou services
                et font partie intégrante de la marque <b>{{ themeLabel }}</b>.
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

export const mainColors: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Couleurs Principales'
				const colorTitleLevel = 3
				const colorDescription = 'Fond et texte (sous condition de contraste) un texte pourrait être en : On-surface ou On-surface variant ...'
				const cnamColors = {
					primary: cnamLightTheme.primary,
					primaryVariant: cnamLightTheme.primaryVariant,
					secondary: cnamLightTheme.secondary,
					secondaryVariant: cnamLightTheme.secondaryVariant,
					risquePro: cnamLightTheme.risquePro,
				}
				const paColors = {
					primary: paLightTheme.primary,
					primaryVariant: paLightTheme.primaryVariant,
					secondary: paLightTheme.secondary,
					secondaryVariant: paLightTheme.secondaryVariant,
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
					primaryVariant: apLightTheme.primaryVariant,
					secondary: apLightTheme.secondary,
					secondaryVariant: apLightTheme.secondaryVariant,
				}
				return {
					cnamColors,
					paColors,
					apColors2026: apColors2026,
					apColors,
					colorTitle,
					colorTitleLevel,
					colorDescription,
				}
			},
			template: `
              <ColorDisplay
                  displayEmptyColors
                  colorCategory="mainColors"
                  :cnamColors="cnamColors"
                  :paColors="paColors"
                  :apColors="apColors"
                  :apColors2026="apColors2026"
                  :colorTitle="colorTitle"
                  :colorTitleLevel="colorTitleLevel"
                  :colorDescription="colorDescription"
              />
            `,
		}
	},
	tags: ['!dev'],
}

export const ColorOn: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'On-Couleurs'
				const colorTitleLevel = 3
				const colorDescription = 'Texte/icône sur fond'
				const cnamColors = {
					onPrimary: cnamLightTheme.onPrimary,
					onPrimaryVariant: cnamLightTheme.onPrimaryVariant,
					onSecondary: cnamLightTheme.onSecondary,
					onSecondaryVariant: cnamLightTheme.onSecondaryVariant,
				}
				const paColors = {
					onPrimary: paLightTheme.onPrimary,
					onPrimaryVariant: paLightTheme.onPrimaryVariant,
					onSecondary: paLightTheme.onSecondary,
					onSecondaryVariant: paLightTheme.onSecondaryVariant,
				}
				const apColors = {
					onPrimary: apLightTheme.onPrimary,
					onPrimaryVariant: apLightTheme.onPrimaryVariant,
					onSecondary: apLightTheme.onSecondary,
					onSecondaryVariant: apLightTheme.onSecondaryVariant,
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
                    colorCategory="on-couleurs"
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

export const Interaction: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = ''
				const colorDescription = 'Ces couleurs sont à utiliser pour les fonds des éléments interactifs de sélection (item de liste sélectionnable, carte sélectionnable,...)'
				const displayEmptyColors = false
				const colorTitleLevel = 3
				const cnamColors = {
					interactionDark: cnamLightTheme.interactionDark,
					interactionDarken: cnamLightTheme.interactionDarken,
				}
				const paColors = {
					interactionDark: paLightTheme.interactionDark,
					interactionDarken: paLightTheme.interactionDarken,
				}
				const apColors = {
					interactionDark: apLightTheme.interactionDark,
					interactionDarken: apLightTheme.interactionDarken,
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
                  colorCategory="interaction"
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
export const Disabled: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Disabled'
				const colorDescription = 'Fond et container des éléments désactivés'
				const displayEmptyColors = false
				const colorTitleLevel = 3
				const cnamColors = {
					disabled: cnamLightTheme.disabled,
				}
				const paColors = {
					disabled: paLightTheme.disabled,
				}
				const apColors = {
					disabled: apLightTheme.disabled,
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
                  colorCategory="disabled"
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

export const mainSection = {
	render() {
		return h(createSection('Couleurs de base', [
			mainColors,
			ColorOn,
		]))
	},
}
export const Backgrounds: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Backgrounds'
				const colorDescription = 'backgrounds principaux de la plateforme'
				const colorTitleLevel = 3
				const cnamColors = {
					background: cnamLightTheme.background,
					backgroundVariant: cnamLightTheme.backgroundVariant,
				}
				const paColors = {
					background: paLightTheme.background,
					backgroundVariant: paLightTheme.backgroundVariant,
				}
				const apColors = {
					background: apLightTheme.background,
					backgroundVariant: apLightTheme.backgroundVariant,
				}
				const apColors2026 = { 'apGrey-lighten6': apColorsTokens2026.apGrey.lighten6 }
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
                  colorCategory="backgrounds"
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
export const OnBackgrounds: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'On-Backgrounds'
				const colorDescription = 'Texte/icône sur fond'
				const colorTitleLevel = 3
				const cnamColors = {
					onBackground: cnamLightTheme.onBackground,
					onBackgroundVariant: cnamLightTheme.onBackgroundVariant,
				}
				const paColors = {
					onBackground: paLightTheme.onBackground,
					onBackgroundVariant: paLightTheme.onBackgroundVariant,
				}
				const apColors = {
					onBackground: apLightTheme.onBackground,
					onBackgroundVariant: apLightTheme.onBackgroundVariant,
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
                  colorCategory="OnBackgrounds"
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
export const Surfaces: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Surfaces'
				const colorDescription = ' Surface en superposition du background principal.'
				const colorTitleLevel = 3
				const cnamColors = {
					surface: cnamLightTheme.surface,
					surfaceDim: cnamLightTheme.surfaceDim,
					surfaceBright: cnamLightTheme.surfaceBright,
					inverseSurface: cnamLightTheme.inverseSurface,
				}
				const paColors = {
					surface: paLightTheme.surface,
					surfaceDim: paLightTheme.surfaceDim,
					surfaceBright: paLightTheme.surfaceBright,
					inverseSurface: paLightTheme.inverseSurface,
				}
				const apColors = {
					surface: apLightTheme.surface,
					surfaceDim: apLightTheme.surfaceDim,
					surfaceBright: apLightTheme.surfaceBright,
					inverseSurface: apLightTheme.inverseSurface,
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
                  colorCategory="surfaces"
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
export const OnSurfaces: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'On-Surfaces'
				const colorDescription = 'Texte/icône sur une surface '
				const colorTitleLevel = 3
				const cnamColors = {
					onSurface: cnamLightTheme.onSurface,
					onSurfaceVariant: cnamLightTheme.onSurfaceVariant,
				}
				const paColors = {
					onSurface: paLightTheme.onSurface,
					onSurfaceVariant: paLightTheme.onSurfaceVariant,
				}
				const apColors = {
					onSurface: apLightTheme.onSurface,
					onSurfaceVariant: apLightTheme.onSurfaceVariant,
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
                  colorCategory="onsurfaces"
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
export const Overlay: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Overlay'
				const colorTitleLevel = 3
				const cnamColors = {
					overlay: cnamLightTheme.overlay,
				}
				const paColors = {
					overlay: paLightTheme.overlay,
				}
				const apColors = {
					overlay: apLightTheme.overlay,
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
                  colorCategory="overlay"
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
export const Borders: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Borders'
				const colorTitleLevel = 3
				const colorDescription = 'Ce sont les couleurs à utiliser pour les contours de tous les éléments d’interface (quand nécessaire)'
				const cnamColors = {
					border: cnamLightTheme.border,
					borderVariant: cnamLightTheme.borderVariant,
					borderBright: cnamLightTheme.borderBright,
					borderDim: cnamLightTheme.borderDim,
				}
				const paColors = {
					border: paLightTheme.border,
					borderVariant: paLightTheme.borderVariant,
					borderBright: paLightTheme.borderBright,
					borderDim: paLightTheme.borderDim,
				}
				const apColors = {
					border: apLightTheme.border,
					borderVariant: apLightTheme.borderVariant,
					borderBright: apLightTheme.borderBright,
					borderDim: apLightTheme.borderDim,
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
                  colorCategory="borders"
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
		return h(createSection('Borders', [
			Borders,
		], 'ap2026'))
	},
}

export const BackgroundSection = {
	render() {
		return h(createSection('Fonds et surfaces', [
			Backgrounds,
			OnBackgrounds,
			Surfaces,
			OnSurfaces,
		]))
	},
}
export const OverlaySection = {
	render() {
		return h(createSection('Fonds et surfaces', [
			Overlay,
		]))
	},
}

export const InteractionSection = {
	render() {
		return h(createSection('Interaction', [
			Interaction,
		], 'ap2026'))
	},
}

export const DisabledSection = {
	render() {
		return h(createSection('Disabled', [
			Disabled,
		], 'ap2026'))
	},
}

export const Feedback: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'Feedback'
				const colorTitleLevel = 3
				const colorDescription = 'Fonds de composants (ou de containers) indiquant un message de statut'
				const cnamColors = {
					error: cnamLightTheme.error,
					errorVariant: cnamLightTheme.errorVariant,
					success: cnamLightTheme.success,
					successVariant: cnamLightTheme.successVariant,
					warning: cnamLightTheme.warning,
					warningVariant: cnamLightTheme.warningVariant,
					info: cnamLightTheme.info,
					infoVariant: cnamLightTheme.infoVariant,
				}
				const paColors = {
					error: paLightTheme.error,
					errorVariant: paLightTheme.errorVariant,
					success: paLightTheme.success,
					successVariant: paLightTheme.successVariant,
					warning: paLightTheme.warning,
					warningVariant: paLightTheme.warningVariant,
					info: paLightTheme.info,
					infoVariant: paLightTheme.infoVariant,
				}
				const apColors = {
					error: apLightTheme.error,
					errorVariant: apLightTheme.errorVariant,
					success: apLightTheme.success,
					successVariant: apLightTheme.successVariant,
					warning: apLightTheme.warning,
					warningVariant: apLightTheme.warningVariant,
					info: apLightTheme.info,
					infoVariant: apLightTheme.infoVariant,
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
                  colorCategory="feedback"
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

export const OnFeedback: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const colorTitle = 'On-Feedback'
				const colorTitleLevel = 3
				const colorDescription = 'Textes/ Icônes sur fond de statut.'
				const cnamColors = {
					onError: cnamLightTheme.onError,
					onErrorVariant: cnamLightTheme.onErrorVariant,
					onSuccess: cnamLightTheme.onSuccess,
					onSuccessVariant: cnamLightTheme.onSuccessVariant,
					onWarning: cnamLightTheme.onWarning,
					onWarningVariant: cnamLightTheme.onWarningVariant,
					onInfo: cnamLightTheme.onInfo,
					onInfoVariant: cnamLightTheme.onInfoVariant,
				}
				const paColors = {
					onError: paLightTheme.onError,
					onErrorVariant: paLightTheme.onErrorVariant,
					onSuccess: paLightTheme.onSuccess,
					onSuccessVariant: paLightTheme.onSuccessVariant,
					onWarning: paLightTheme.onWarning,
					onWarningVariant: paLightTheme.onWarningVariant,
					onInfo: paLightTheme.onInfo,
					onInfoVariant: paLightTheme.onInfoVariant,
				}
				const apColors = {
					onError: apLightTheme.onError,
					onErrorVariant: apLightTheme.onErrorVariant,
					onSuccess: apLightTheme.onSuccess,
					onSuccessVariant: apLightTheme.onSuccessVariant,
					onWarning: apLightTheme.onWarning,
					onWarningVariant: apLightTheme.onWarningVariant,
					onInfo: apLightTheme.onInfo,
					onInfoVariant: apLightTheme.onInfoVariant,
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
                  colorCategory="feedback"
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

export const FeedbackSection = {
	render() {
		return h(createSection('Feedback', [
			Feedback,
			OnFeedback,
		], 'ap2026'))
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
					'orange-darken80': cnamColorsTokens.orange.darken80,
					'orange-darken60': cnamColorsTokens.orange.darken60,
					'orange-darken40': cnamColorsTokens.orange.darken40,
					'orange-darken20': cnamColorsTokens.orange.darken20,
					'orange-base': cnamColorsTokens.orange.base,
					'orange-lighten20': cnamColorsTokens.orange.lighten20,
					'orange-lighten40': cnamColorsTokens.orange.lighten40,
					'orange-lighten60': cnamColorsTokens.orange.lighten60,
					'orange-lighten80': cnamColorsTokens.orange.lighten80,
					'orange-lighten90': cnamColorsTokens.orange.lighten90,
					'orange-lighten97': cnamColorsTokens.orange.lighten97,
				}
				const paColors = {
					'orange-darken80': paColorsTokens.orange.darken80,
					'orange-darken60': paColorsTokens.orange.darken60,
					'orange-darken40': paColorsTokens.orange.darken40,
					'orange-darken20': paColorsTokens.orange.darken20,
					'orange-base': paColorsTokens.orange.base,
					'orange-lighten20': paColorsTokens.orange.lighten20,
					'orange-lighten40': paColorsTokens.orange.lighten40,
					'orange-lighten60': paColorsTokens.orange.lighten60,
					'orange-lighten80': paColorsTokens.orange.lighten80,
					'orange-lighten90': paColorsTokens.orange.lighten90,
					'orange-lighten97': paColorsTokens.orange.lighten97,
				}
				const apColors = {
					'amber-darken80': apColorsTokens.amber.darken80,
					'amber-darken60': apColorsTokens.amber.darken60,
					'amber-darken40': apColorsTokens.amber.darken40,
					'amber-darken20': apColorsTokens.amber.darken20,
					'amber-base': apColorsTokens.amber.base,
					'amber-lighten20': apColorsTokens.amber.lighten20,
					'amber-lighten40': apColorsTokens.amber.lighten40,
					'amber-lighten60': apColorsTokens.amber.lighten60,
					'amber-lighten80': apColorsTokens.amber.lighten80,
					'amber-lighten90': apColorsTokens.amber.lighten90,
					'amber-lighten97': apColorsTokens.amber.lighten97,
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
					'red-darken80': apColorsTokens.red.darken80,
					'red-darken60': apColorsTokens.red.darken60,
					'red-darken40': apColorsTokens.red.darken40,
					'red-darken20': apColorsTokens.red.darken20,
					'red-base': apColorsTokens.red.base,
					'red-lighten20': apColorsTokens.red.lighten20,
					'red-lighten40': apColorsTokens.red.lighten40,
					'red-lighten60': apColorsTokens.red.lighten60,
					'red-lighten80': apColorsTokens.red.lighten80,
					'red-lighten90': apColorsTokens.red.lighten90,
					'red-lighten97': apColorsTokens.red.lighten97,
				}
				const apColors2026 = {
					'apRed-darken2': apColorsTokens2026.apRed.darken2,
					'apRed-darken1': apColorsTokens2026.apRed.darken1,
					'apRed-base': apColorsTokens2026.apRed.base,
					'apRed-lighten1': apColorsTokens2026.apRed.lighten1,
					'apRed-lighten2': apColorsTokens2026.apRed.lighten2,
					'apRed-lighten3': apColorsTokens2026.apRed.lighten3,
					'apRed-lighten4': apColorsTokens2026.apRed.lighten4,
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
					'yellow-darken80': cnamColorsTokens.yellow.darken80,
					'yellow-darken60': cnamColorsTokens.yellow.darken60,
					'yellow-darken40': cnamColorsTokens.yellow.darken40,
					'yellow-darken20': cnamColorsTokens.yellow.darken20,
					'yellow-base': cnamColorsTokens.yellow.base,
					'yellow-lighten20': cnamColorsTokens.yellow.lighten20,
					'yellow-lighten40': cnamColorsTokens.yellow.lighten40,
					'yellow-lighten60': cnamColorsTokens.yellow.lighten60,
					'yellow-lighten80': cnamColorsTokens.yellow.lighten80,
					'yellow-lighten90': cnamColorsTokens.yellow.lighten90,
					'yellow-lighten97': cnamColorsTokens.yellow.lighten97,
				}
				const paColors = {
					'yellow-darken80': paColorsTokens.yellow.darken80,
					'yellow-darken60': paColorsTokens.yellow.darken60,
					'yellow-darken40': paColorsTokens.yellow.darken40,
					'yellow-darken20': paColorsTokens.yellow.darken20,
					'yellow-base': paColorsTokens.yellow.base,
					'yellow-lighten20': paColorsTokens.yellow.lighten20,
					'yellow-lighten40': paColorsTokens.yellow.lighten40,
					'yellow-lighten60': paColorsTokens.yellow.lighten60,
					'yellow-lighten80': paColorsTokens.yellow.lighten80,
					'yellow-lighten90': paColorsTokens.yellow.lighten90,
					'yellow-lighten97': paColorsTokens.yellow.lighten97,
				}
				const apColors = {
					'yellow-darken80': apColorsTokens.yellow.darken80,
					'yellow-darken60': apColorsTokens.yellow.darken60,
					'yellow-darken40': apColorsTokens.yellow.darken40,
					'yellow-darken20': apColorsTokens.yellow.darken20,
					'yellow-base': apColorsTokens.yellow.base,
					'yellow-lighten20': apColorsTokens.yellow.lighten20,
					'yellow-lighten40': apColorsTokens.yellow.lighten40,
					'yellow-lighten60': apColorsTokens.yellow.lighten60,
					'yellow-lighten80': apColorsTokens.yellow.lighten80,
					'yellow-lighten90': apColorsTokens.yellow.lighten90,
					'yellow-lighten97': apColorsTokens.yellow.lighten97,
				}
				const apColors2026 = {
					'apYellow-darken4': apColorsTokens2026.apYellow.darken4,
					'apYellow-darken3': apColorsTokens2026.apYellow.darken3,
					'apYellow-darken2': apColorsTokens2026.apYellow.darken2,
					'apYellow-darken1': apColorsTokens2026.apYellow.darken1,
					'apYellow-base': apColorsTokens2026.apYellow.base,
					'apYellow-lighten1': apColorsTokens2026.apYellow.lighten1,
					'apYellow-lighten2': apColorsTokens2026.apYellow.lighten2,
					'apYellow-lighten3': apColorsTokens2026.apYellow.lighten3,
					'apYellow-lighten4': apColorsTokens2026.apYellow.lighten4,
					'apYellow-lighten5': apColorsTokens2026.apYellow.lighten5,
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
					'forestGreen-darken80': apColorsTokens.forestGreen.darken80,
					'forestGreen-darken60': apColorsTokens.forestGreen.darken60,
					'forestGreen-darken40': apColorsTokens.forestGreen.darken40,
					'forestGreen-darken20': apColorsTokens.forestGreen.darken20,
					'forestGreen-base': apColorsTokens.forestGreen.base,
					'forestGreen-lighten20': apColorsTokens.forestGreen.lighten20,
					'forestGreen-lighten40': apColorsTokens.forestGreen.lighten40,
					'forestGreen-lighten60': apColorsTokens.forestGreen.lighten60,
					'forestGreen-lighten80': apColorsTokens.forestGreen.lighten80,
					'forestGreen-lighten90': apColorsTokens.forestGreen.lighten90,
					'forestGreen-lighten97': apColorsTokens.forestGreen.lighten97,
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
					'green-darken80': cnamColorsTokens.green.darken80,
					'green-darken60': cnamColorsTokens.green.darken60,
					'green-darken40': cnamColorsTokens.green.darken40,
					'green-darken20': cnamColorsTokens.green.darken20,
					'green-base': cnamColorsTokens.green.base,
					'green-lighten20': cnamColorsTokens.green.lighten20,
					'green-lighten40': cnamColorsTokens.green.lighten40,
					'green-lighten60': cnamColorsTokens.green.lighten60,
					'green-lighten80': cnamColorsTokens.green.lighten80,
					'green-lighten90': cnamColorsTokens.green.lighten90,
					'green-lighten97': cnamColorsTokens.green.lighten97,
				}
				const paColors = {
					'green-darken80': paColorsTokens.green.darken80,
					'green-darken60': paColorsTokens.green.darken60,
					'green-darken40': paColorsTokens.green.darken40,
					'green-darken20': paColorsTokens.green.darken20,
					'green-base': paColorsTokens.green.base,
					'green-lighten20': paColorsTokens.green.lighten20,
					'green-lighten40': paColorsTokens.green.lighten40,
					'green-lighten60': paColorsTokens.green.lighten60,
					'green-lighten80': paColorsTokens.green.lighten80,
					'green-lighten90': paColorsTokens.green.lighten90,
					'green-lighten97': paColorsTokens.green.lighten97,
				}
				const apColors = {
					'green-darken80': apColorsTokens.green.darken80,
					'green-darken60': apColorsTokens.green.darken60,
					'green-darken40': apColorsTokens.green.darken40,
					'green-darken20': apColorsTokens.green.darken20,
					'green-base': apColorsTokens.green.base,
					'green-lighten20': apColorsTokens.green.lighten20,
					'green-lighten40': apColorsTokens.green.lighten40,
					'green-lighten60': apColorsTokens.green.lighten60,
					'green-lighten80': apColorsTokens.green.lighten80,
					'green-lighten90': apColorsTokens.green.lighten90,
					'green-lighten97': apColorsTokens.green.lighten97,
				}
				const apColors2026 = {
					'apGreen-darken2': apColorsTokens2026.apGreen.darken2,
					'apGreen-darken1': apColorsTokens2026.apGreen.darken1,
					'apGreen-base': apColorsTokens2026.apGreen.base,
					'apGreen-lighten1': apColorsTokens2026.apGreen.lighten1,
					'apGreen-lighten2': apColorsTokens2026.apGreen.lighten2,
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
					'turquoise-darken80': cnamColorsTokens.turquoise.darken80,
					'turquoise-darken60': cnamColorsTokens.turquoise.darken60,
					'turquoise-darken40': cnamColorsTokens.turquoise.darken40,
					'turquoise-darken20': cnamColorsTokens.turquoise.darken20,
					'turquoise-base': cnamColorsTokens.turquoise.base,
					'turquoise-lighten20': cnamColorsTokens.turquoise.lighten20,
					'turquoise-lighten40': cnamColorsTokens.turquoise.lighten40,
					'turquoise-lighten60': cnamColorsTokens.turquoise.lighten60,
					'turquoise-lighten80': cnamColorsTokens.turquoise.lighten80,
					'turquoise-lighten90': cnamColorsTokens.turquoise.lighten90,
					'turquoise-lighten97': cnamColorsTokens.turquoise.lighten97,
				}
				const paColors = {
					'turquoise-darken80': paColorsTokens.turquoise.darken80,
					'turquoise-darken60': paColorsTokens.turquoise.darken60,
					'turquoise-darken40': paColorsTokens.turquoise.darken40,
					'turquoise-darken20': paColorsTokens.turquoise.darken20,
					'turquoise-base': paColorsTokens.turquoise.base,
					'turquoise-lighten20': paColorsTokens.turquoise.lighten20,
					'turquoise-lighten40': paColorsTokens.turquoise.lighten40,
					'turquoise-lighten60': paColorsTokens.turquoise.lighten60,
					'turquoise-lighten80': paColorsTokens.turquoise.lighten80,
					'turquoise-lighten90': paColorsTokens.turquoise.lighten90,
					'turquoise-lighten97': paColorsTokens.turquoise.lighten97,
				}
				const apColors = {
					'turquoise-darken80': apColorsTokens.turquoise.darken80,
					'turquoise-darken60': apColorsTokens.turquoise.darken60,
					'turquoise-darken40': apColorsTokens.turquoise.darken40,
					'turquoise-darken20': apColorsTokens.turquoise.darken20,
					'turquoise-base': apColorsTokens.turquoise.base,
					'turquoise-lighten20': apColorsTokens.turquoise.lighten20,
					'turquoise-lighten40': apColorsTokens.turquoise.lighten40,
					'turquoise-lighten60': apColorsTokens.turquoise.lighten60,
					'turquoise-lighten80': apColorsTokens.turquoise.lighten80,
					'turquoise-lighten90': apColorsTokens.turquoise.lighten90,
					'turquoise-lighten97': apColorsTokens.turquoise.lighten97,
				}
				const apColors2026 = {
					'apTurquoise-darken3': apColorsTokens2026.apTurquoise.darken3,
					'apTurquoise-darken2': apColorsTokens2026.apTurquoise.darken2,
					'apTurquoise-darken1': apColorsTokens2026.apTurquoise.darken1,
					'apTurquoise-base': apColorsTokens2026.apTurquoise.base,
					'apTurquoise-lighten1': apColorsTokens2026.apTurquoise.lighten1,
					'apTurquoise-lighten2': apColorsTokens2026.apTurquoise.lighten2,
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
					'blue-darken80': cnamColorsTokens.blue.darken80,
					'blue-darken60': cnamColorsTokens.blue.darken60,
					'blue-darken40': cnamColorsTokens.blue.darken40,
					'blue-darken20': cnamColorsTokens.blue.darken20,
					'blue-base': cnamColorsTokens.blue.base,
					'blue-lighten20': cnamColorsTokens.blue.lighten20,
					'blue-lighten40': cnamColorsTokens.blue.lighten40,
					'blue-lighten60': cnamColorsTokens.blue.lighten60,
					'blue-lighten80': cnamColorsTokens.blue.lighten80,
					'blue-lighten90': cnamColorsTokens.blue.lighten90,
					'blue-lighten97': cnamColorsTokens.blue.lighten97,
				}
				const paColors = {
					'blue-darken80': paColorsTokens.blue.darken80,
					'blue-darken60': paColorsTokens.blue.darken60,
					'blue-darken40': paColorsTokens.blue.darken40,
					'blue-darken20': paColorsTokens.blue.darken20,
					'blue-base': paColorsTokens.blue.base,
					'blue-lighten20': paColorsTokens.blue.lighten20,
					'blue-lighten40': paColorsTokens.blue.lighten40,
					'blue-lighten60': paColorsTokens.blue.lighten60,
					'blue-lighten80': paColorsTokens.blue.lighten80,
					'blue-lighten90': paColorsTokens.blue.lighten90,
					'blue-lighten97': paColorsTokens.blue.lighten97,
				}
				const apColors = {
					'blue-darken80': apColorsTokens.blue.darken80,
					'blue-darken60': apColorsTokens.blue.darken60,
					'blue-darken40': apColorsTokens.blue.darken40,
					'blue-darken20': apColorsTokens.blue.darken20,
					'blue-base': apColorsTokens.blue.base,
					'blue-lighten20': apColorsTokens.blue.lighten20,
					'blue-lighten40': apColorsTokens.blue.lighten40,
					'blue-lighten60': apColorsTokens.blue.lighten60,
					'blue-lighten80': apColorsTokens.blue.lighten80,
					'blue-lighten90': apColorsTokens.blue.lighten90,
					'blue-lighten97': apColorsTokens.blue.lighten97,
				}
				const apColors2026 = {
					'apBlue-darken2': apColorsTokens2026.apBlue.darken2,
					'apBlue-darken1': apColorsTokens2026.apBlue.darken1,
					'apBlue-base': apColorsTokens2026.apBlue.base,
					'apBlue-lighten1': apColorsTokens2026.apBlue.lighten1,
					'apBlue-lighten2': apColorsTokens2026.apBlue.lighten2,
					'apBlue-lighten3': apColorsTokens2026.apBlue.lighten3,
					'apBlue-lighten4': apColorsTokens2026.apBlue.lighten4,
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
					'cyan-darken80': cnamColorsTokens.cyan.darken80,
					'cyan-darken60': cnamColorsTokens.cyan.darken60,
					'cyan-darken40': cnamColorsTokens.cyan.darken40,
					'cyan-darken20': cnamColorsTokens.cyan.darken20,
					'cyan-base': cnamColorsTokens.cyan.base,
					'cyan-lighten20': cnamColorsTokens.cyan.lighten20,
					'cyan-lighten40': cnamColorsTokens.cyan.lighten40,
					'cyan-lighten60': cnamColorsTokens.cyan.lighten60,
					'cyan-lighten80': cnamColorsTokens.cyan.lighten80,
					'cyan-lighten90': cnamColorsTokens.cyan.lighten90,
					'cyan-lighten97': cnamColorsTokens.cyan.lighten97,
				}
				const paColors = {
					'cyan-darken80': paColorsTokens.cyan.darken80,
					'cyan-darken60': paColorsTokens.cyan.darken60,
					'cyan-darken40': paColorsTokens.cyan.darken40,
					'cyan-darken20': paColorsTokens.cyan.darken20,
					'cyan-base': paColorsTokens.cyan.base,
					'cyan-lighten20': paColorsTokens.cyan.lighten20,
					'cyan-lighten40': paColorsTokens.cyan.lighten40,
					'cyan-lighten60': paColorsTokens.cyan.lighten60,
					'cyan-lighten80': paColorsTokens.cyan.lighten80,
					'cyan-lighten90': paColorsTokens.cyan.lighten90,
					'cyan-lighten97': paColorsTokens.cyan.lighten97,
				}
				const apColors = {
					'cyan-darken80': apColorsTokens.cyan.darken80,
					'cyan-darken60': apColorsTokens.cyan.darken60,
					'cyan-darken40': apColorsTokens.cyan.darken40,
					'cyan-darken20': apColorsTokens.cyan.darken20,
					'cyan-base': apColorsTokens.cyan.base,
					'cyan-lighten20': apColorsTokens.cyan.lighten20,
					'cyan-lighten40': apColorsTokens.cyan.lighten40,
					'cyan-lighten60': apColorsTokens.cyan.lighten60,
					'cyan-lighten80': apColorsTokens.cyan.lighten80,
					'cyan-lighten90': apColorsTokens.cyan.lighten90,
					'cyan-lighten97': apColorsTokens.cyan.lighten97,
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
					'frostedBlue-darken80': cnamColorsTokens.frostedBlue.darken80,
					'frostedBlue-darken60': cnamColorsTokens.frostedBlue.darken60,
					'frostedBlue-darken40': cnamColorsTokens.frostedBlue.darken40,
					'frostedBlue-darken20': cnamColorsTokens.frostedBlue.darken20,
					'frostedBlue-base': cnamColorsTokens.frostedBlue.base,
					'frostedBlue-lighten20': cnamColorsTokens.frostedBlue.lighten20,
					'frostedBlue-lighten40': cnamColorsTokens.frostedBlue.lighten40,
					'frostedBlue-lighten60': cnamColorsTokens.frostedBlue.lighten60,
					'frostedBlue-lighten80': cnamColorsTokens.frostedBlue.lighten80,
					'frostedBlue-lighten90': cnamColorsTokens.frostedBlue.lighten90,
					'frostedBlue-lighten97': cnamColorsTokens.frostedBlue.lighten97,
				}
				const paColors = {
					'frostedBlue-darken80': paColorsTokens.frostedBlue.darken80,
					'frostedBlue-darken60': paColorsTokens.frostedBlue.darken60,
					'frostedBlue-darken40': paColorsTokens.frostedBlue.darken40,
					'frostedBlue-darken20': paColorsTokens.frostedBlue.darken20,
					'frostedBlue-base': paColorsTokens.frostedBlue.base,
					'frostedBlue-lighten20': paColorsTokens.frostedBlue.lighten20,
					'frostedBlue-lighten40': paColorsTokens.frostedBlue.lighten40,
					'frostedBlue-lighten60': paColorsTokens.frostedBlue.lighten60,
					'frostedBlue-lighten80': paColorsTokens.frostedBlue.lighten80,
					'frostedBlue-lighten90': paColorsTokens.frostedBlue.lighten90,
					'frostedBlue-lighten97': paColorsTokens.frostedBlue.lighten97,
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
					'parma-darken80': cnamColorsTokens.parma.darken80,
					'parma-darken60': cnamColorsTokens.parma.darken60,
					'parma-darken40': cnamColorsTokens.parma.darken40,
					'parma-darken20': cnamColorsTokens.parma.darken20,
					'parma-base': cnamColorsTokens.parma.base,
					'parma-lighten20': cnamColorsTokens.parma.lighten20,
					'parma-lighten40': cnamColorsTokens.parma.lighten40,
					'parma-lighten60': cnamColorsTokens.parma.lighten60,
					'parma-lighten80': cnamColorsTokens.parma.lighten80,
					'parma-lighten90': cnamColorsTokens.parma.lighten90,
					'parma-lighten97': cnamColorsTokens.parma.lighten97,
				}
				const paColors = {
					'parma-darken80': paColorsTokens.parma.darken80,
					'parma-darken60': paColorsTokens.parma.darken60,
					'parma-darken40': paColorsTokens.parma.darken40,
					'parma-darken20': paColorsTokens.parma.darken20,
					'parma-base': paColorsTokens.parma.base,
					'parma-lighten20': paColorsTokens.parma.lighten20,
					'parma-lighten40': paColorsTokens.parma.lighten40,
					'parma-lighten60': paColorsTokens.parma.lighten60,
					'parma-lighten80': paColorsTokens.parma.lighten80,
					'parma-lighten90': paColorsTokens.parma.lighten90,
					'parma-lighten97': paColorsTokens.parma.lighten97,
				}
				const apColors = {
					'parma-darken80': apColorsTokens.parma.darken80,
					'parma-darken60': apColorsTokens.parma.darken60,
					'parma-darken40': apColorsTokens.parma.darken40,
					'parma-darken20': apColorsTokens.parma.darken20,
					'parma-base': apColorsTokens.parma.base,
					'parma-lighten20': apColorsTokens.parma.lighten20,
					'parma-lighten40': apColorsTokens.parma.lighten40,
					'parma-lighten60': apColorsTokens.parma.lighten60,
					'parma-lighten80': apColorsTokens.parma.lighten80,
					'parma-lighten90': apColorsTokens.parma.lighten90,
					'parma-lighten97': apColorsTokens.parma.lighten97,
				}
				const apColors2026 = {
					'apParme-darken1': apColorsTokens2026.apParme.darken1,
					'apParme-base': apColorsTokens2026.apParme.base,
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
					'mauve-darken80': cnamColorsTokens.mauve.darken80,
					'mauve-darken60': cnamColorsTokens.mauve.darken60,
					'mauve-darken40': cnamColorsTokens.mauve.darken40,
					'mauve-darken20': cnamColorsTokens.mauve.darken20,
					'mauve-base': cnamColorsTokens.mauve.base,
					'mauve-lighten20': cnamColorsTokens.mauve.lighten20,
					'mauve-lighten40': cnamColorsTokens.mauve.lighten40,
					'mauve-lighten60': cnamColorsTokens.mauve.lighten60,
					'mauve-lighten80': cnamColorsTokens.mauve.lighten80,
					'mauve-lighten90': cnamColorsTokens.mauve.lighten90,
					'mauve-lighten97': cnamColorsTokens.mauve.lighten97,
				}
				const paColors = {
					'mauve-darken80': paColorsTokens.mauve.darken80,
					'mauve-darken60': paColorsTokens.mauve.darken60,
					'mauve-darken40': paColorsTokens.mauve.darken40,
					'mauve-darken20': paColorsTokens.mauve.darken20,
					'mauve-base': paColorsTokens.mauve.base,
					'mauve-lighten20': paColorsTokens.mauve.lighten20,
					'mauve-lighten40': paColorsTokens.mauve.lighten40,
					'mauve-lighten60': paColorsTokens.mauve.lighten60,
					'mauve-lighten80': paColorsTokens.mauve.lighten80,
					'mauve-lighten90': paColorsTokens.mauve.lighten90,
					'mauve-lighten97': paColorsTokens.mauve.lighten97,
				}
				const apColors = {
					'mauve-darken80': apColorsTokens.mauve.darken80,
					'mauve-darken60': apColorsTokens.mauve.darken60,
					'mauve-darken40': apColorsTokens.mauve.darken40,
					'mauve-darken20': apColorsTokens.mauve.darken20,
					'mauve-base': apColorsTokens.mauve.base,
					'mauve-lighten20': apColorsTokens.mauve.lighten20,
					'mauve-lighten40': apColorsTokens.mauve.lighten40,
					'mauve-lighten60': apColorsTokens.mauve.lighten60,
					'mauve-lighten80': apColorsTokens.mauve.lighten80,
					'mauve-lighten90': apColorsTokens.mauve.lighten90,
					'mauve-lighten97': apColorsTokens.mauve.lighten97,
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
					'pink-darken80': cnamColorsTokens.pink.darken80,
					'pink-darken60': cnamColorsTokens.pink.darken60,
					'pink-darken40': cnamColorsTokens.pink.darken40,
					'pink-darken20': cnamColorsTokens.pink.darken20,
					'pink-base': cnamColorsTokens.pink.base,
					'pink-lighten20': cnamColorsTokens.pink.lighten20,
					'pink-lighten40': cnamColorsTokens.pink.lighten40,
					'pink-lighten60': cnamColorsTokens.pink.lighten60,
					'pink-lighten80': cnamColorsTokens.pink.lighten80,
					'pink-lighten90': cnamColorsTokens.pink.lighten90,
					'pink-lighten97': cnamColorsTokens.pink.lighten97,
				}
				const paColors = {
					'pink-darken80': paColorsTokens.pink.darken80,
					'pink-darken60': paColorsTokens.pink.darken60,
					'pink-darken40': paColorsTokens.pink.darken40,
					'pink-darken20': paColorsTokens.pink.darken20,
					'pink-base': paColorsTokens.pink.base,
					'pink-lighten20': paColorsTokens.pink.lighten20,
					'pink-lighten40': paColorsTokens.pink.lighten40,
					'pink-lighten60': paColorsTokens.pink.lighten60,
					'pink-lighten80': paColorsTokens.pink.lighten80,
					'pink-lighten90': paColorsTokens.pink.lighten90,
					'pink-lighten97': paColorsTokens.pink.lighten97,
				}
				const apColors = {
					'pink-darken80': apColorsTokens.pink.darken80,
					'pink-darken60': apColorsTokens.pink.darken60,
					'pink-darken40': apColorsTokens.pink.darken40,
					'pink-darken20': apColorsTokens.pink.darken20,
					'pink-base': apColorsTokens.pink.base,
					'pink-lighten20': apColorsTokens.pink.lighten20,
					'pink-lighten40': apColorsTokens.pink.lighten40,
					'pink-lighten60': apColorsTokens.pink.lighten60,
					'pink-lighten80': apColorsTokens.pink.lighten80,
					'pink-lighten90': apColorsTokens.pink.lighten90,
					'pink-lighten97': apColorsTokens.pink.lighten97,
				}
				const apColors2026 = {
					'apPink-base': apColorsTokens2026.apPink.base,
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
					'brick-darken80': cnamColorsTokens.brick.darken80,
					'brick-darken60': cnamColorsTokens.brick.darken60,
					'brick-darken40': cnamColorsTokens.brick.darken40,
					'brick-darken20': cnamColorsTokens.brick.darken20,
					'brick-base': cnamColorsTokens.brick.base,
					'brick-lighten20': cnamColorsTokens.brick.lighten20,
					'brick-lighten40': cnamColorsTokens.brick.lighten40,
					'brick-lighten60': cnamColorsTokens.brick.lighten60,
					'brick-lighten80': cnamColorsTokens.brick.lighten80,
					'brick-lighten90': cnamColorsTokens.brick.lighten90,
					'brick-lighten97': cnamColorsTokens.brick.lighten97,
				}
				const paColors = {
					'brick-darken80': paColorsTokens.brick.darken80,
					'brick-darken60': paColorsTokens.brick.darken60,
					'brick-darken40': paColorsTokens.brick.darken40,
					'brick-darken20': paColorsTokens.brick.darken20,
					'brick-base': paColorsTokens.brick.base,
					'brick-lighten20': paColorsTokens.brick.lighten20,
					'brick-lighten40': paColorsTokens.brick.lighten40,
					'brick-lighten60': paColorsTokens.brick.lighten60,
					'brick-lighten80': paColorsTokens.brick.lighten80,
					'brick-lighten90': paColorsTokens.brick.lighten90,
					'brick-lighten97': paColorsTokens.brick.lighten97,
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
					'grey-darken80': cnamColorsTokens.grey.darken80,
					'grey-darken60': cnamColorsTokens.grey.darken60,
					'grey-darken40': cnamColorsTokens.grey.darken40,
					'grey-darken20': cnamColorsTokens.grey.darken20,
					'grey-base': cnamColorsTokens.grey.base,
					'grey-lighten20': cnamColorsTokens.grey.lighten20,
					'grey-lighten40': cnamColorsTokens.grey.lighten40,
					'grey-lighten60': cnamColorsTokens.grey.lighten60,
					'grey-lighten80': cnamColorsTokens.grey.lighten80,
					'grey-lighten90': cnamColorsTokens.grey.lighten90,
					'grey-lighten97': cnamColorsTokens.grey.lighten97,
				}
				const paColors = {
					'grey-darken80': paColorsTokens.grey.darken80,
					'grey-darken60': paColorsTokens.grey.darken60,
					'grey-darken40': paColorsTokens.grey.darken40,
					'grey-darken20': paColorsTokens.grey.darken20,
					'grey-base': paColorsTokens.grey.base,
					'grey-lighten20': paColorsTokens.grey.lighten20,
					'grey-lighten40': paColorsTokens.grey.lighten40,
					'grey-lighten60': paColorsTokens.grey.lighten60,
					'grey-lighten80': paColorsTokens.grey.lighten80,
					'grey-lighten90': paColorsTokens.grey.lighten90,
					'grey-lighten97': paColorsTokens.grey.lighten97,
				}
				const apColors = {
					'grey-darken80': apColorsTokens.grey.darken80,
					'grey-darken60': apColorsTokens.grey.darken60,
					'grey-darken40': apColorsTokens.grey.darken40,
					'grey-darken20': apColorsTokens.grey.darken20,
					'grey-base': apColorsTokens.grey.base,
					'grey-lighten20': apColorsTokens.grey.lighten20,
					'grey-lighten40': apColorsTokens.grey.lighten40,
					'grey-lighten60': apColorsTokens.grey.lighten60,
					'grey-lighten80': apColorsTokens.grey.lighten80,
					'grey-lighten90': apColorsTokens.grey.lighten90,
					'grey-lighten97': apColorsTokens.grey.lighten97,
				}
				const apColors2026 = {
					'apGrey-darken1': apColorsTokens2026.apGrey.darken1,
					'apGrey-base': apColorsTokens2026.apGrey.base,
					'apGrey-lighten1': apColorsTokens2026.apGrey.lighten1,
					'apGrey-lighten2': apColorsTokens2026.apGrey.lighten2,
					'apGrey-lighten3': apColorsTokens2026.apGrey.lighten3,
					'apGrey-lighten4': apColorsTokens2026.apGrey.lighten4,
					'apGrey-lighten5': apColorsTokens2026.apGrey.lighten5,
					'apGrey-lighten6': apColorsTokens2026.apGrey.lighten6,
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
					'white-lighten70': cnamColorsTokens.white.lighten70,
					'white-lighten40': cnamColorsTokens.white.lighten40,
					'white-lighten38': cnamColorsTokens.white.lighten38,
					'white-lighten20': cnamColorsTokens.white.lighten20,
					'white-base': cnamColorsTokens.white.base,
				}
				const paColors = {
					'white-lighten70': paColorsTokens.white.lighten70,
					'white-lighten40': paColorsTokens.white.lighten40,
					'white-lighten38': paColorsTokens.white.lighten38,
					'white-lighten20': paColorsTokens.white.lighten20,
					'white-base': paColorsTokens.white.base,
				}
				const apColors = {
					'white-lighten70': apColorsTokens.white.lighten70,
					'white-lighten40': apColorsTokens.white.lighten40,
					'white-lighten38': apColorsTokens.white.lighten38,
					'white-lighten20': apColorsTokens.white.lighten20,
					'white-base': apColorsTokens.white.base,
				}
				const apColors2026 = {
					'apWhite-base': apColorsTokens2026.apWhite.base,
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
					'apBlack-base': apColorsTokens2026.apBlack.base,
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
