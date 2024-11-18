import type { StoryObj } from '@storybook/vue3'

export default {
	title: 'Home/PolitiqueDeConfidentialite',
}

export const Default: StoryObj = {
	render: () => {
		return {
			template: `
              <iframe src="https://assurancemaladiesec.github.io/abuse/reporting/" width="100%" height="800px" frameBorder="0"></iframe>
            `,
		}
	},
	tags: ['!dev'],
}
