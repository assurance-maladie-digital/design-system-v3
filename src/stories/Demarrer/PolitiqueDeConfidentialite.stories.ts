import type { StoryObj } from '@storybook/vue3-vite'
import { VCard } from 'vuetify/components'

export default {
	title: 'Démarrer/Politique de confidentialité',
}

export const Default: StoryObj = {
	render: () => {
		return {
			components: { VCard },
			template: `
               <VCard class="mt-4 pa-2">
                <iframe src="https://assurancemaladiesec.github.io/abuse/reporting/" width="100%" height="800px" frameBorder="0"></iframe>
               </VCard>
            `,
		}
	},
	tags: ['!dev'],
}
