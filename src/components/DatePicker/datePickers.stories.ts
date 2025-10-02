import type { StoryObj } from '@storybook/vue3'

export default {
	title: 'datePickers',
}

export const Century: StoryObj = {
	render: () => {
		return {
			setup() {
				const theme = typeof window !== 'undefined' ? localStorage.getItem('storybook-theme') : 'cnam'
				return {
					theme,
				}
			},
			template: `
                <div>
                    <span v-if="theme === 'pa'"
                        style="display: inline-block; padding: 10px; margin: 10px 0; background-color: rgba(183,203,214, 0.3); border-radius: 4px; border-left: 4px solid #3f7b99; color: #333;"
                    >
                        Les composants DatePicker ne proposent pas la prop century.
                        </span>
                </div>
            `,
		}
	},
	tags: ['!dev'],
}
