import { cnamLightTheme } from '@/designTokens/tokens/cnam/cnamLightTheme'
import { cnamColorsTokens } from '@/designTokens/tokens/cnam/cnamColors'
import { paLightTheme } from '@/designTokens/tokens/pa/paLightTheme'
import { paColorsTokens } from '@/designTokens/tokens/pa/paColors'
import ColorDisplay from './ColorDisplay.vue'

import type { StoryObj } from '@storybook/vue3'
import { computed } from 'vue'
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

export const Base: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
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
					'primary': paLightTheme.primary,
					'secondary': paLightTheme.secondary,
					'error': paLightTheme.error,
					'info': paLightTheme.info,
					'success': paLightTheme.success,
					'warning': paLightTheme.warning,
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

export const Others: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
				const cnamColors = {
					accent: cnamLightTheme.accent,
					avatar: cnamLightTheme.avatar,
					light: cnamLightTheme.light,
					dark: cnamLightTheme.dark,
				}
				const paColors = {
					accent: paLightTheme.accent,
					avatar: paLightTheme.avatar,
					light: paLightTheme.light,
					dark: paLightTheme.dark,
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

export const PaletteOrange: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
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

export const PaletteYellow: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
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

export const PaletteGreen: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
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

export const PaletteTurquoise: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
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

export const PaletteBlue: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
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

export const PaletteCyan: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
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

export const PaletteFrostedBlue: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
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

export const PaletteParma: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
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

export const PaletteMauve: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
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

export const PalettePink: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
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

export const PaletteBrick: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
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

export const PaletteGrey: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
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

export const PaletteWhite: StoryObj = {
	render: () => {
		return {
			components: { ColorDisplay },
			setup() {
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
					'interactive-default': cnamLightTheme.interactiveDefault,
					'interactive-hover': cnamLightTheme.interactiveHover,
					'interactive-pressed': cnamLightTheme.interactivePressed,
					'interactive-focus': cnamLightTheme.interactiveFocus,
					'interactive-disabled': cnamLightTheme.interactiveDisabled,
					'interactive-hover-on-selected': cnamLightTheme.interactiveHoverOnSelected,
				}
				const paColors = {
					'interactive-default': paLightTheme.interactiveDefault,
					'interactive-hover': paLightTheme.interactiveHover,
					'interactive-pressed': paLightTheme.interactivePressed,
					'interactive-focus': paLightTheme.interactiveFocus,
					'interactive-disabled': paLightTheme.interactiveDisabled,
					'interactive-hover-on-selected': paLightTheme.interactiveHoverOnSelected,
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
					'border-darker': cnamLightTheme.borderDarker,
					'border-base': cnamLightTheme.borderBase,
					'border-subdued': cnamLightTheme.borderSubdued,
					'border-accent': cnamLightTheme.borderAccent,
					'border-accent-contrasted': cnamLightTheme.borderAccentContrasted,
					'border-accent-on-dark': cnamLightTheme.borderAccentOnDark,
					'border-info': cnamLightTheme.borderInfo,
					'border-success': cnamLightTheme.borderSuccess,
					'border-warning': cnamLightTheme.borderWarning,
					'border-error': cnamLightTheme.borderError,
					'border-on-dark': cnamLightTheme.borderOnDark,
					'border-disabled': cnamLightTheme.borderDisabled,
					'border-disabled-on-dark': cnamLightTheme.borderDisabledOnDark,
				}
				const paColors = {
					'border-darker': paLightTheme.borderDarker,
					'border-base': paLightTheme.borderBase,
					'border-subdued': paLightTheme.borderSubdued,
					'border-accent': paLightTheme.borderAccent,
					'border-accent-contrasted': paLightTheme.borderAccentContrasted,
					'border-accent-on-dark': paLightTheme.borderAccentOnDark,
					'border-info': paLightTheme.borderInfo,
					'border-success': paLightTheme.borderSuccess,
					'border-warning': paLightTheme.borderWarning,
					'border-error': paLightTheme.borderError,
					'border-on-dark': paLightTheme.borderOnDark,
					'border-disabled': paLightTheme.borderDisabled,
					'border-disabled-on-dark': paLightTheme.borderDisabledOnDark,
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
					'text-base': cnamLightTheme.textBase,
					'text-accent': cnamLightTheme.textAccent,
					'text-accent-contrasted': cnamLightTheme.textAccentContrasted,
					'text-subdued': cnamLightTheme.textSubdued,
					'text-info': cnamLightTheme.textInfo,
					'text-success': cnamLightTheme.textSuccess,
					'text-warning': cnamLightTheme.textWarning,
					'text-error': cnamLightTheme.textError,
					'text-disabled': cnamLightTheme.textDisabled,
					'text-on-dark': cnamLightTheme.textOnDark,
					'text-subdued-on-dark': cnamLightTheme.textSubduedOnDark,
					'text-disabled-on-dark': cnamLightTheme.textDisabledOnDark,
				}
				const paColors = {
					'text-base': paLightTheme.textBase,
					'text-accent': paLightTheme.textAccent,
					'text-accent-contrasted': paLightTheme.textAccentContrasted,
					'text-subdued': paLightTheme.textSubdued,
					'text-info': paLightTheme.textInfo,
					'text-success': paLightTheme.textSuccess,
					'text-warning': paLightTheme.textWarning,
					'text-error': paLightTheme.textError,
					'text-disabled': paLightTheme.textDisabled,
					'text-on-dark': paLightTheme.textOnDark,
					'text-subdued-on-dark': paLightTheme.textSubduedOnDark,
					'text-disabled-on-dark': paLightTheme.textDisabledOnDark,
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
					'icon-base': cnamLightTheme.iconBase,
					'icon-subdued': cnamLightTheme.iconSubdued,
					'icon-subdued-on-dark': cnamLightTheme.iconSubduedOnDark,
					'icon-accent': cnamLightTheme.iconAccent,
					'icon-accent-contrasted': cnamLightTheme.iconAccentContrasted,
					'icon-info': cnamLightTheme.iconInfo,
					'icon-success': cnamLightTheme.iconSuccess,
					'icon-warning': cnamLightTheme.iconWarning,
					'icon-error': cnamLightTheme.iconError,
					'icon-on-dark': cnamLightTheme.iconOnDark,
					'icon-disabled': cnamLightTheme.iconDisabled,
					'icon-disabled-on-dark': cnamLightTheme.iconDisabledOnDark,
				}
				const paColors = {
					'icon-base': paLightTheme.iconBase,
					'icon-subdued': paLightTheme.iconSubdued,
					'icon-subdued-on-dark': paLightTheme.iconSubduedOnDark,
					'icon-accent': paLightTheme.iconAccent,
					'icon-accent-contrasted': paLightTheme.iconAccentContrasted,
					'icon-info': paLightTheme.iconInfo,
					'icon-success': paLightTheme.iconSuccess,
					'icon-warning': paLightTheme.iconWarning,
					'icon-error': paLightTheme.iconError,
					'icon-on-dark': paLightTheme.iconOnDark,
					'icon-disabled': paLightTheme.iconDisabled,
					'icon-disabled-on-dark': paLightTheme.iconDisabledOnDark,
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
					'background-main': cnamLightTheme.backgroundMain,
					'background-surface': cnamLightTheme.backgroundSurface,
					'background-surface-alt': cnamLightTheme.backgroundSurfaceAlt,
				}
				const paColors = {
					'background-main': paLightTheme.backgroundMain,
					'background-surface': paLightTheme.backgroundSurface,
					'background-surface-alt': paLightTheme.backgroundSurfaceAlt,
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
					'background-mainAlt': cnamLightTheme.backgroundMainAlt,
					'background-raised': cnamLightTheme.backgroundRaised,
					'background-accent': cnamLightTheme.backgroundAccent,
					'background-accent-contrasted': cnamLightTheme.backgroundAccentContrasted,
					'background-accent-alt': cnamLightTheme.backgroundAccentAlt,
				}
				const paColors = {
					'background-mainAlt': paLightTheme.backgroundMainAlt,
					'background-raised': paLightTheme.backgroundRaised,
					'background-accent': paLightTheme.backgroundAccent,
					'background-accent-contrasted': paLightTheme.backgroundAccentContrasted,
					'background-accent-alt': paLightTheme.backgroundAccentAlt,
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
					'background-info': cnamLightTheme.backgroundInfo,
					'background-info-subdued': cnamLightTheme.backgroundInfoSubdued,
					'background-info-contrasted': cnamLightTheme.backgroundInfoContrasted,
				}
				const paColors = {
					'background-info': paLightTheme.backgroundInfo,
					'background-info-subdued': paLightTheme.backgroundInfoSubdued,
					'background-info-contrasted': paLightTheme.backgroundInfoContrasted,
				}
				return {
					cnamColors,
					paColors,
				}
			},
			template: `
				<ColorDisplay 
					colorCategory="informationalBackgrounds" 
					:cnamColors="cnamColors" 
					:paColors="paColors" 
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
					'background-warning': cnamLightTheme.backgroundWarning,
					'background-warning-subdued': cnamLightTheme.backgroundWarningSubdued,
					'background-warning-contrasted': cnamLightTheme.backgroundWarningContrasted,
				}
				const paColors = {
					'background-warning': paLightTheme.backgroundWarning,
					'background-warning-subdued': paLightTheme.backgroundWarningSubdued,
					'background-warning-contrasted': paLightTheme.backgroundWarningContrasted,
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
					'background-error': cnamLightTheme.backgroundError,
					'background-error-subdued': cnamLightTheme.backgroundErrorSubdued,
					'background-error-contrasted': cnamLightTheme.backgroundErrorContrasted,
				}
				const paColors = {
					'background-error': paLightTheme.backgroundError,
					'background-error-subdued': paLightTheme.backgroundErrorSubdued,
					'background-error-contrasted': paLightTheme.backgroundErrorContrasted,
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
					'background-disabled': cnamLightTheme.backgroundDisabled,
					'background-disabled-on-dark': cnamLightTheme.backgroundDisabledOnDark,
					'background-assure': cnamLightTheme.backgroundAssure,
					'background-professionnel': cnamLightTheme.backgroundProfessionnel,
					'background-entreprise': cnamLightTheme.backgroundEntreprise,
				}
				const paColors = {
					'background-disabled': paLightTheme.backgroundDisabled,
					'background-disabled-on-dark': paLightTheme.backgroundDisabledOnDark,
					'background-assure': paLightTheme.backgroundAssure,
					'background-professionnel': paLightTheme.backgroundProfessionnel,
					'background-entreprise': paLightTheme.backgroundEntreprise,
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
