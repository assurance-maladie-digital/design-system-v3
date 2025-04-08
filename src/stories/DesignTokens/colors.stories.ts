import { ColorPalette, ColorItem } from '@storybook/blocks'

import { cnamColorsTokens } from '@/designTokens/tokens/cnam/cnamColors'
import { paColorsTokens } from '@/designTokens/tokens/pa/paColors'

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
				const cnamColors = {
					primary: cnamColorsTokens.blue.base,
					secondary: cnamColorsTokens.cyan.darken40,
					accent: cnamColorsTokens.cyan.base,
					error: cnamColorsTokens.orange.darken20,
					info: cnamColorsTokens.blue.base,
					success: cnamColorsTokens.green.base,
					warning: cnamColorsTokens.yellow.base,
					risquePro: cnamColorsTokens.brick.base,
				}
				const paColors = {
					primary: paColorsTokens.blue.base,
					secondary: paColorsTokens.cyan.darken40,
					accent: paColorsTokens.cyan.base,
					error: paColorsTokens.orange.darken20,
					info: paColorsTokens.blue.base,
					success: paColorsTokens.green.base,
					warning: paColorsTokens.yellow.base,
					risquePro: paColorsTokens.brick.base,
				}
				return {
					theme,
					cnamColors,
					paColors,
				}
			},
			template: `
				<ColorPalette className="vertical-palette">
					<ColorItem v-if="theme === 'cnam'" :colors="cnamColors" />
					<ColorItem v-if="theme === 'pa'" :colors="paColors" />
				</ColorPalette>
			`,
		}
	},
	tags: ['!dev'],
}