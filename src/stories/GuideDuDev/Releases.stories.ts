import type { StoryObj } from '@storybook/vue3'
import { VCard } from 'vuetify/components'

export default {
	title: 'Guide Du Dev/Releases',
}

export const Default: StoryObj = {
	render: () => {
		return {
			components: { VCard },
			template: `
               <VCard class="mt-4 pa-2">
                <iframe src="https://github.com/assurance-maladie-digital/design-system-v3/releases" width="100%" height="800px" frameBorder="0"></iframe>
               </VCard>
            `,
		}
	},
	tags: ['!dev'],
}
