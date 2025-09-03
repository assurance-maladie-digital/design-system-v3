import { VCard, VCardText, VCardTitle, VRow, VCol, VIcon } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'

export default {
	title: 'Templates/Vue d\'ensemble',
}

export const Header: StoryObj = {
	render: () => {
		return {
			template: `
        <div class="mb-8">
          <h1 class="mb-4">Templates</h1>
          <p class="text-body-1">Découvrez notre collection de templates conçus pour accélérer le développement de vos IHM.</p>
        </div>
      `,
		}
	},
	tags: ['!dev'],
}

export const TemplatesList: StoryObj = {
	render: () => {
		return {
			components: { VCard, VCardText, VCardTitle, VRow, VCol, VIcon },
			setup() {
				const templates = [
					{
						title: 'ErrorPage',
						description: 'Utilisé pour afficher une page d\'erreur.',
						link: '/?path=/docs/templates-errorpage--docs',
						img: '/templates/error-page.svg',
						category: 'Page',
					},
					{
						title: 'MaintenancePage',
						description: 'Utilisé pour afficher une page de maintenance.',
						link: '/?path=/docs/templates-maintenancepage--docs',
						img: '/templates/maintenance-page.svg',
						category: 'Page',
					},
					{
						title: 'NotFoundPage',
						description: 'Utilisé pour afficher une page 404.',
						link: '/?path=/docs/templates-notfoundpage--docs',
						img: '/templates/not-found-page.svg',
						category: 'Page',
					},
				]

				return {
					templates,
				}
			},
			template: `
				<div>
					<VRow>
						<VCol v-for="template in templates" :key="template.title" cols="12" sm="6" md="4" lg="3">
							<VCard
								:href="template.link"
								color="primary"
								class="h-100 card-hover"
								variant="outlined"
								:ripple="true"
							>
								<img
									:src="template.img"
									:alt="template.title"
									class="w-100"
								/>
								<VCardTitle class="d-flex align-center text-h6 font-weight-bold">
									{{ template.title }}
								</VCardTitle>
								<VCardText class="text-black">
									{{ template.description }}
								</VCardText>
							</VCard>
						</VCol>
					</VRow>
				</div>
			`,
		}
	},
	tags: ['!dev'],
}
