import FooterBar from '../FooterBar/FooterBar.vue'
import CollapsibleList from '../CollapsibleList/CollapsibleList.vue'
import { getCurrentInstance, computed } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'

// Constantes réutilisables
const docProps = {
	sitemapRoute: '/',
	cguRoute: '/',
	cookiesRoute: '/',
	legalNoticeRoute: '/',
	a11yStatementRoute: '/',
}

const remboursementItems = [
	{
		text: 'Ce qui est remboursé',
		href: 'https://www.ameli.fr/assure/remboursements/rembourse',
	},
	{
		text: 'Ce qui reste à votre charge',
		href: 'https://www.ameli.fr/assure/remboursements/reste-charge',
	},
	{
		text: 'Être bien remboursé',
		href: 'https://www.ameli.fr/assure/remboursements/etre-bien-rembourse',
	},
]

const healthItems = [
	{
		text: 'Mon espace santé',
		href: 'https://www.ameli.fr/assure/sante/mon-espace-sante',
	},
	{
		text: 'Accomplir les bons gestes',
		href: 'https://www.ameli.fr/assure/sante/bons-gestes',
	},
	{
		text: 'Réagir en cas d’urgence',
		href: 'https://www.ameli.fr/assure/sante/urgence',
	},
	{
		text: 'Télésanté',
		href: 'https://www.ameli.fr/assure/sante/telesante',
	},
]

const meta = {
	title: 'Components/FooterBar',
	component: FooterBar,
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		a11yCompliance: {
			control: {
				type: 'select',
				options: ['fully-compliant', 'partially-compliant', 'fully-compliant'],
			},
			description: 'Accessibility compliance level of the footer.',
		},
		linkItems: {
			control: {
				type: 'object',
			},
			description: 'List of additional links to display in the footer.',
		},
		sitemapRoute: {
			control: {
				type: 'object',
			},
			description: 'Route to the sitemap page.',
		},
		hideSitemapLink: {
			control: {
				type: 'boolean',
			},
			description: 'Hide the sitemap link.',
		},
	},
	args: {
		a11yCompliance: 'fully-compliant',
		linkItems: [
			{ text: 'Custom Link', to: '/custom' },
		],
		sitemapRoute: { name: 'sitemap' },
		hideSitemapLink: false,
	},
} satisfies Meta<typeof FooterBar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	render() {
		return {
			components: { FooterBar },
			template: '<FooterBar />',
		}
	},
}

export const withCollapsibleList: Story = {
	args: {},
	render() {
		const isXs = computed(() => {
			const { proxy } = getCurrentInstance()!
			return proxy?.$vuetify.display.name === 'xs'
		})

		return {
			components: { FooterBar, CollapsibleList },
			setup() {
				return { docProps, remboursementItems, healthItems, isXs }
			},
			template: `
				<main>
					<FooterBar v-bind="docProps" version="v0.1.1">
						<VRow :no-gutters="isXs" class="max-width-none">
							<VCol cols="12" sm="6">
								<CollapsibleList
									:items="remboursementItems"
									list-title="Remboursement"
									class="theme--dark"
								/>
							</VCol>
							<VCol cols="12" sm="6">
								<CollapsibleList
									:items="healthItems"
									list-title="Santé"
									class="theme--dark"
								/>
							</VCol>
						</VRow>
					</FooterBar>
				</main>
			`,
		}
	},
}

export const hideLogo: Story = {
	args: {
		hideLogo: true,
	},
	render() {
		return {
			components: { FooterBar },
			setup() {
				return { docProps }
			},
			template: `
        <FooterBar v-bind="docProps" hide-logo>
          <p class="text--secondary mb-0"> Contenu supplémentaire.</p>
        </FooterBar>
      `,
		}
	},
}

export const hideSocialMediaLinks: Story = {
	args: {
		hideSocialMediaLinks: true,
	},
	render() {
		return {
			components: { FooterBar },
			setup() {
				return { docProps }
			},
			template: `
        <FooterBar v-bind="docProps" hide-social-media-links>
          <p class="text--secondary mb-0"> Contenu supplémentaire.</p>
        </FooterBar>
      `,
		}
	},
}
