import { cnamLightTheme } from '@/designTokens/tokens/cnam/cnamLightTheme'
import { paLightTheme } from '@/designTokens/tokens/pa/paLightTheme'
import ColorDisplay from './ColorDisplay.vue'

import type { StoryObj } from '@storybook/vue3'
export default {
	title: 'Design Tokens/Couleurs',
}

export const Base: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const cnamColors = {
					primary: cnamLightTheme.primary,
					secondary: cnamLightTheme.secondary,
					accent: cnamLightTheme.accent,
					error: cnamLightTheme.error,
					info: cnamLightTheme.info,
					success: cnamLightTheme.success,
					warning: cnamLightTheme.warning,
					risquePro: cnamLightTheme.risquePro,
				}
				const paColors = {
					primary: paLightTheme.primary,
					secondary: paLightTheme.secondary,
					accent: paLightTheme.accent,
					error: paLightTheme.error,
					info: paLightTheme.info,
					success: paLightTheme.success,
					warning: paLightTheme.warning,
					risquePro: paLightTheme.risquePro,
				}
				return {
					cnamColors,
					paColors,
				}
			},
			template: `
				<ColorDisplay 
					colorCategory="base" 
					:cnamColors="cnamColors" 
					:paColors="paColors" 
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
				const cnamColors = {
					interactiveDefault: cnamLightTheme.interactiveDefault,
					interactiveHover: cnamLightTheme.interactiveHover,
					interactivePressed: cnamLightTheme.interactivePressed,
					interactiveFocus: cnamLightTheme.interactiveFocus,
					interactiveDisabled: cnamLightTheme.interactiveDisabled,
					interactiveHoverOnSelected: cnamLightTheme.interactiveHoverOnSelected,
				}
				const paColors = {
					interactiveDefault: paLightTheme.interactiveDefault,
					interactiveHover: paLightTheme.interactiveHover,
					interactivePressed: paLightTheme.interactivePressed,
					interactiveFocus: paLightTheme.interactiveFocus,
					interactiveDisabled: paLightTheme.interactiveDisabled,
					interactiveHoverOnSelected: paLightTheme.interactiveHoverOnSelected,
				}
				return {
					cnamColors,
					paColors,
				}
			},
			template: `
				<ColorDisplay 
					colorCategory="interactive" 
					:cnamColors="cnamColors" 
					:paColors="paColors" 
				/>
			`,
		}
	},
	tags: ['!dev'],
}

export const Border: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const cnamColors = {
					borderDarker: cnamLightTheme.borderDarker,
					borderBase: cnamLightTheme.borderBase,
					borderSubdued: cnamLightTheme.borderSubdued,
					borderAccent: cnamLightTheme.borderAccent,
					borderAccentContrasted: cnamLightTheme.borderAccentContrasted,
					borderAccentOnDark: cnamLightTheme.borderAccentOnDark,
					borderInfo: cnamLightTheme.borderInfo,
					borderSuccess: cnamLightTheme.borderSuccess,
					borderWarning: cnamLightTheme.borderWarning,
					borderError: cnamLightTheme.borderError,
					borderOnDark: cnamLightTheme.borderOnDark,
					borderDisabled: cnamLightTheme.borderDisabled,
					borderDisabledOnDark: cnamLightTheme.borderDisabledOnDark,
				}
				const paColors = {
					borderDarker: paLightTheme.borderDarker,
					borderBase: paLightTheme.borderBase,
					borderSubdued: paLightTheme.borderSubdued,
					borderAccent: paLightTheme.borderAccent,
					borderAccentContrasted: paLightTheme.borderAccentContrasted,
					borderAccentOnDark: paLightTheme.borderAccentOnDark,
					borderInfo: paLightTheme.borderInfo,
					borderSuccess: paLightTheme.borderSuccess,
					borderWarning: paLightTheme.borderWarning,
					borderError: paLightTheme.borderError,
					borderOnDark: paLightTheme.borderOnDark,
					borderDisabled: paLightTheme.borderDisabled,
					borderDisabledOnDark: paLightTheme.borderDisabledOnDark,
				}
				return {
					cnamColors,
					paColors,
				}
			},
			template: `
				<ColorDisplay 
					colorCategory="border" 
					:cnamColors="cnamColors" 
					:paColors="paColors" 
				/>
			`,
		}
	},
	tags: ['!dev'],
}

export const Text: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const cnamColors = {
					textBase: cnamLightTheme.textBase,
					textAccent: cnamLightTheme.textAccent,
					textAccentContrasted: cnamLightTheme.textAccentContrasted,
					textSubdued: cnamLightTheme.textSubdued,
					textInfo: cnamLightTheme.textInfo,
					textSuccess: cnamLightTheme.textSuccess,
					textWarning: cnamLightTheme.textWarning,
					textError: cnamLightTheme.textError,
					textDisabled: cnamLightTheme.textDisabled,
					textOnDark: cnamLightTheme.textOnDark,
					textSubduedOnDark: cnamLightTheme.textSubduedOnDark,
					textDisabledOnDark: cnamLightTheme.textDisabledOnDark,
				}
				const paColors = {
					textBase: paLightTheme.textBase,
					textAccent: paLightTheme.textAccent,
					textAccentContrasted: paLightTheme.textAccentContrasted,
					textSubdued: paLightTheme.textSubdued,
					textInfo: paLightTheme.textInfo,
					textSuccess: paLightTheme.textSuccess,
					textWarning: paLightTheme.textWarning,
					textError: paLightTheme.textError,
					textDisabled: paLightTheme.textDisabled,
					textOnDark: paLightTheme.textOnDark,
					textSubduedOnDark: paLightTheme.textSubduedOnDark,
					textDisabledOnDark: paLightTheme.textDisabledOnDark,
				}
				return {
					cnamColors,
					paColors,
				}
			},
			template: `
				<ColorDisplay 
					colorCategory="text" 
					:cnamColors="cnamColors" 
					:paColors="paColors" 
				/>`,
		}
	},
	tags: ['!dev'],
}

export const Icons: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const cnamColors = {
					iconBase: cnamLightTheme.iconBase,
					iconSubdued: cnamLightTheme.iconSubdued,
					iconSubduedOnDark: cnamLightTheme.iconSubduedOnDark,
					iconAccent: cnamLightTheme.iconAccent,
					iconAccentContrasted: cnamLightTheme.iconAccentContrasted,
					iconInfo: cnamLightTheme.iconInfo,
					iconSuccess: cnamLightTheme.iconSuccess,
					iconWarning: cnamLightTheme.iconWarning,
					iconError: cnamLightTheme.iconError,
					iconOnDark: cnamLightTheme.iconOnDark,
					iconDisabled: cnamLightTheme.iconDisabled,
					iconDisabledOnDark: cnamLightTheme.iconDisabledOnDark,
				}
				const paColors = {
					iconBase: paLightTheme.iconBase,
					iconSubdued: paLightTheme.iconSubdued,
					iconSubduedOnDark: paLightTheme.iconSubduedOnDark,
					iconAccent: paLightTheme.iconAccent,
					iconAccentContrasted: paLightTheme.iconAccentContrasted,
					iconInfo: paLightTheme.iconInfo,
					iconSuccess: paLightTheme.iconSuccess,
					iconWarning: paLightTheme.iconWarning,
					iconError: paLightTheme.iconError,
					iconOnDark: paLightTheme.iconOnDark,
					iconDisabled: paLightTheme.iconDisabled,
					iconDisabledOnDark: paLightTheme.iconDisabledOnDark,
				}
				return {
					cnamColors,
					paColors,
				}
			},
			template: `
				<ColorDisplay 
					colorCategory="icons" 
					:cnamColors="cnamColors" 
					:paColors="paColors" 
				/>
			`,
		}
	},
	tags: ['!dev'],
}

export const MainBackgrounds: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const cnamColors = {
					backgroundMain: cnamLightTheme.backgroundMain,
					backgroundSurface: cnamLightTheme.backgroundSurface,
					backgroundSurfaceAlt: cnamLightTheme.backgroundSurfaceAlt
				}
				const paColors = {
					backgroundMain: paLightTheme.backgroundMain,
					backgroundSurface: paLightTheme.backgroundSurface,
					backgroundSurfaceAlt: paLightTheme.backgroundSurfaceAlt
				}
				return {
					cnamColors,
					paColors,
				}
			},
			template: `
				<ColorDisplay 
					colorCategory="mainBackgrounds" 
					:cnamColors="cnamColors" 
					:paColors="paColors" 
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
				const cnamColors = {
					backgroundMainAlt: cnamLightTheme.backgroundMainAlt,
					backgroundRaised: cnamLightTheme.backgroundRaised,
					backgroundAccent: cnamLightTheme.backgroundAccent,
					backgroundAccentContrasted: cnamLightTheme.backgroundAccentContrasted,
					backgroundAccentAlt: cnamLightTheme.backgroundAccentAlt,
				}
				const paColors = {
					backgroundMainAlt: paLightTheme.backgroundMainAlt,
					backgroundRaised: paLightTheme.backgroundRaised,
					backgroundAccent: paLightTheme.backgroundAccent,
					backgroundAccentContrasted: paLightTheme.backgroundAccentContrasted,
					backgroundAccentAlt: paLightTheme.backgroundAccentAlt,
				}
				return {
					cnamColors,
					paColors,
				}
			},
			template: `
				<ColorDisplay 
					colorCategory="alternativeBackgrounds" 
					:cnamColors="cnamColors" 
					:paColors="paColors" 
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
				const cnamColors = {
					backgroundInfo: cnamLightTheme.backgroundInfo,
					backgroundInfoSubdued: cnamLightTheme.backgroundInfoSubdued,
					backgroundInfoContrasted: cnamLightTheme.backgroundInfoContrasted
				}
				const paColors = {
					backgroundInfo: paLightTheme.backgroundInfo,
					backgroundInfoSubdued: paLightTheme.backgroundInfoSubdued,
					backgroundInfoContrasted: paLightTheme.backgroundInfoContrasted
				}
				return {
					cnamColors,
					paColors,
				}
			},
			template: `<ColorDisplay colorCategory="informationalBackgrounds" :cnamColors="cnamColors" :paColors="paColors" />`,
		}
	},
	tags: ['!dev'],
}

export const SuccessBackgrounds: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const cnamColors = {
					backgroundSuccess: cnamLightTheme.backgroundSuccess,
					backgroundSuccessSubdued: cnamLightTheme.backgroundSuccessSubdued,
					backgroundSuccessContrasted: cnamLightTheme.backgroundSuccessContrasted,
				}
				const paColors = {
					backgroundSuccess: paLightTheme.backgroundSuccess,
					backgroundSuccessSubdued: paLightTheme.backgroundSuccessSubdued,
					backgroundSuccessContrasted: paLightTheme.backgroundSuccessContrasted,
				}
				return {
					cnamColors,
					paColors,
				}
			},
			template: `
				<ColorDisplay 
					colorCategory="successBackgrounds" 
					:cnamColors="cnamColors" 
					:paColors="paColors" 
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
				const cnamColors = {
					backgroundWarning: cnamLightTheme.backgroundWarning,
					backgroundWarningSubdued: cnamLightTheme.backgroundWarningSubdued,
					backgroundWarningContrasted: cnamLightTheme.backgroundWarningContrasted,
				}
				const paColors = {
					backgroundWarning: paLightTheme.backgroundWarning,
					backgroundWarningSubdued: paLightTheme.backgroundWarningSubdued,
					backgroundWarningContrasted: paLightTheme.backgroundWarningContrasted,
				}
				return {
					cnamColors,
					paColors,
				}
			},
			template: `
				<ColorDisplay 
					colorCategory="warningBackgrounds" 
					:cnamColors="cnamColors" 
					:paColors="paColors" 
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
				const cnamColors = {
					backgroundError: cnamLightTheme.backgroundError,
					backgroundErrorSubdued: cnamLightTheme.backgroundErrorSubdued,
					backgroundErrorContrasted: cnamLightTheme.backgroundErrorContrasted,
				}
				const paColors = {
					backgroundError: paLightTheme.backgroundError,
					backgroundErrorSubdued: paLightTheme.backgroundErrorSubdued,
					backgroundErrorContrasted: paLightTheme.backgroundErrorContrasted,
				}
				return {
					cnamColors,
					paColors,
				}
			},
			template: `
				<ColorDisplay 
					colorCategory="errorBackgrounds" 
					:cnamColors="cnamColors" 
					:paColors="paColors" 
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
				const cnamColors = {
					backgroundDisabled: cnamLightTheme.backgroundDisabled,
					backgroundDisabledOnDark: cnamLightTheme.backgroundDisabledOnDark,
					backgroundAssure: cnamLightTheme.backgroundAssure,
					backgroundProfessionnel: cnamLightTheme.backgroundProfessionnel,
					backgroundEntreprise: cnamLightTheme.backgroundEntreprise,
				}
				const paColors = {
					backgroundDisabled: paLightTheme.backgroundDisabled,
					backgroundDisabledOnDark: paLightTheme.backgroundDisabledOnDark,
					backgroundAssure: paLightTheme.backgroundAssure,
					backgroundProfessionnel: paLightTheme.backgroundProfessionnel,
					backgroundEntreprise: paLightTheme.backgroundEntreprise,
				}
				return {
					cnamColors,
					paColors,
				}
			},
			template: `
				<ColorDisplay 
					colorCategory="otherBackgrounds" 
					:cnamColors="cnamColors" 
					:paColors="paColors" 
				/>
			`,
		}
	},
	tags: ['!dev'],
}

export const TransparentBlues: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const cnamColors = {
					transparentBlue18: cnamLightTheme.transparentBlue18,
					transparentBlue8: cnamLightTheme.transparentBlue8,
				}
				const paColors = {
					transparentBlue18: paLightTheme.transparentBlue18,
					transparentBlue8: paLightTheme.transparentBlue8,
				}
				return {
					cnamColors,
					paColors,
				}
			},
			template: `
				<ColorDisplay
					colorCategory="transparentBlues"
					:cnamColors="cnamColors"
					:paColors="paColors"
				/>
			`,
		}
	},
	tags: ['!dev'],
}