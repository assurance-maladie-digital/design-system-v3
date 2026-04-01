import type { Meta } from '@storybook/vue3'
import type { StoryObj } from '@storybook/vue3'
import { computed } from 'vue'

const meta: Meta = {
	title: 'Design Tokens/Introduction',
	parameters: {
		docsOnly: true,
	},
}

export default meta

type ThemeKey = 'cnam' | 'pa' | 'ap' | 'ap2026'

export const Theme: StoryObj = {
	render: () => {
		return {
			setup() {
				const theme = computed<ThemeKey>(() => {
					const value
                        = typeof window !== 'undefined' ? localStorage.getItem('storybook-theme') : 'cnam'
					return (value as ThemeKey) ?? 'cnam'
				})

				const themeLabels: Record<ThemeKey, string> = {
					cnam: 'Assurance Maladie',
					pa: 'Portail Agent',
					ap: 'AmeliPro',
					ap2026: 'AmeliPro',
				}

				const themeLabel = computed(() => themeLabels[theme.value])

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
