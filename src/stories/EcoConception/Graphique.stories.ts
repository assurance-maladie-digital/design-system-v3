import type { StoryObj } from '@storybook/vue3-vite'
import GraphiqueEcoConception from './GraphiqueEcoConception.vue'

const meta = {
	title: 'Éco-conception/Introduction',
	component: GraphiqueEcoConception,
	parameters: {
		layout: 'fullscreen',
		docsOnly: true,

	},
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		width: 783,
		height: 629,
		title: 'Répartition des domaines',
		description: 'Graphique circulaire représentant les différents domaines du projet.',
	},
	render: args => ({
		components: {
			GraphiqueEcoConception,
		},
		setup() {
			return {
				args,
			}
		},
		template: `
            <div style="width: 100%; margin-bottom: 7rem;">
                <GraphiqueEcoConception v-bind="args" />
            </div>
        `,
	}),
	tags: ['!dev'],

}
