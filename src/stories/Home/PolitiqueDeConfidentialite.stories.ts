import type { StoryObj } from '@storybook/vue3'
import { VCard } from 'vuetify/components'

export default {
	title: 'Home/PolitiqueDeConfidentialite',
}

export const Default: StoryObj = {
	render: () => {
		return {
			components: { VCard },
			template: `
               <VCard class="mt-4 p-4">
                <iframe src="https://assurancemaladiesec.github.io/abuse/reporting/" width="100%" height="800px" frameBorder="0"></iframe>
               </VCard>
            `,
		}
	},
	tags: ['!dev'],
}
