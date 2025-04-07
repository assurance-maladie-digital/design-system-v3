import { ColorPalette, ColorItem } from '@storybook/addon-docs'

// import { cnamLightTheme } from '@/designTokens/tokens/cnam/cnamLightTheme'
// import { cnamColorsTokens } from '@/designTokens/tokens/cnam/cnamColors'

// import { paLightTheme } from '@/designTokens/tokens/pa/paLightTheme'
// import { paColorsTokens } from '@/designTokens/tokens/pa/paColors'

import type { StoryObj } from '@storybook/vue3'

export default {
	title: 'Démarrer/Couleurs',
}
export const Base: StoryObj = {
	render: () => {
		return {
			components: { ColorPalette, ColorItem },
			setup() {
				const theme = typeof window !== 'undefined' ? localStorage.getItem('storybook-theme') : 'cnam'
				return {
					theme,
				}
			},
			template: `
              <ColorPalette className="vertical-palette">
                <ColorItem v-if="theme === 'cnam'" :colors="{
                    primary: cnamColorsTokens.blue.base,
                    secondary: cnamColorsTokens.cyan.darken40,
                    accent: cnamColorsTokens.cyan.base,
                    error: cnamColorsTokens.orange.darken20,
                    info: cnamColorsTokens.blue.base,
                    success: cnamColorsTokens.green.base,
                    warning: cnamColorsTokens.yellow.base,
                    risquePro: cnamColorsTokens.brick.base
                    }"
                />
                <ColorItem v-if="theme === 'pa'" :colors="{
                    primary: paColorsTokens.blue.base,
                    secondary: paColorsTokens.cyan.darken40,
                    accent: paColorsTokens.cyan.base,
                    error: paColorsTokens.orange.darken20,
                    info: paColorsTokens.blue.base,
                    success: paColorsTokens.green.base,
                    warning: paColorsTokens.yellow.base,
                    risquePro: paColorsTokens.brick.base
                    }"
                />
              </ColorPalette>
            `,
		}
	},
	tags: ['!dev'],
}
