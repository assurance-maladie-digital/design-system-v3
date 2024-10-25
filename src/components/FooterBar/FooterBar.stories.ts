import FooterBar from '../FooterBar/FooterBar.vue'
import Logo from '../Logo/Logo.vue'
import CollapsibleList from '../CollapsibleList/CollapsibleList.vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { mdiTwitter, mdiLinkedin, mdiFacebook, mdiYoutube } from '@mdi/js'

const docProps = {
	sitemapRoute: '/',
	cguRoute: '/',
	cookiesRoute: '/',
	legalNoticeRoute: '/',
	a11yStatementRoute: '/',
}

const items = [
	{
		text: 'Plan du site',
		href: '/sitemap',
	},
	{
		text: 'Conditions générales d\'utilisation',
		href: '/cgu',
	},
	{
		text: 'Gestion des cookies',
		href: '/cookies',
	},
	{
		text: 'Mentions légales',
		href: '/mentions-legales',
	},
]

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

const currentYear = new Date().getFullYear()

const meta = {
	title: 'Components/FooterBar',
	component: FooterBar,
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['logoSize', 'social-media-links'] },
	},
	argTypes: {
		a11yCompliance: {
			options: ['non-compliant', 'partially-compliant', 'fully-compliant'],
			control: { type: 'select' },
			default: 'fully-compliant',
			description: 'Accessibility compliance level of the footer.',
		},
		items: {
			control: {
				type: 'object',
			},
			description: 'List of links to display in the footer.',
		},
		linkItems: {
			control: {
				type: 'object',
			},
			description: 'List of additional links to display in the footer.',
		},
		hideSitemapLink: {
			control: {
				type: 'boolean',
			},
			description: 'Hide the sitemap link.',
		},
		hideCguLink: {
			control: {
				type: 'boolean',
			},
			description: 'Hide the terms and conditions link.',
		},
		hideCookiesLink: {
			control: {
				type: 'boolean',
			},
			description: 'Hide the cookies link.',
		},
		hideLegalNoticeLink: {
			control: {
				type: 'boolean',
			},
			description: 'Hide the legal notice link.',
		},
		hideA11yLink: {
			control: {
				type: 'boolean',
			},
			description: 'Hide the accessibility statement link.',
		},
		hideLogo: {
			control: {
				type: 'boolean',
			},
			description: 'Hide the logo if slot present.',
		},
		hideSocialMediaLinks: {
			control: {
				type: 'boolean',
			},
			description: 'Hide the social media links if slot present.',
		},
		version: {
			control: {
				type: 'text',
			},
			description: 'Version number to display in the footer.',
		},
		socialMediaLinks: {
			control: {
				type: 'object',
			},
			description: 'List of social media links to display in the footer.',
		},
		light: {
			control: {
				type: 'boolean',
			},
			description: 'Use the light theme for the footer.',
		},
		sitemapRoute: {
			control: {
				type: 'text',
			},
			description: 'Route to the sitemap page.',
		},
		cguRoute: {
			control: {
				type: 'text',
			},
			description: 'Route to the terms and conditions page.',
		},
		cookiesRoute: {
			control: {
				type: 'text',
			},
			description: 'Route to the cookies page.',
		},
		legalNoticeRoute: {
			control: {
				type: 'text',
			},
			description: 'Route to the legal notice page.',
		},
		a11yStatementRoute: {
			control: {
				type: 'text',
			},
			description: 'Route to the accessibility statement page.',
		},
		default: {
			description: 'Default slot content.',
		},
		prepend: {
			description: 'Prepend slot content.',
		},
		append: {
			description: 'Append slot content.',
		},
		logo: {
			description: 'Logo slot content',
		},
	},
} satisfies Meta<typeof FooterBar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		docProps: docProps,
		a11yCompliance: 'non-compliant',
		items: items,
		linkItems: [],
		hideSitemapLink: false,
		hideCguLink: false,
		hideCookiesLink: false,
		hideLegalNoticeLink: false,
		hideA11yLink: false,
		hideLogo: false,
		hideSocialMediaLinks: false,
		version: '',
		socialMediaLinks: [
			{
				icon: mdiFacebook,
				name: 'Facebook',
				href: 'https://www.facebook.com',
			},
			{
				icon: mdiTwitter,
				name: 'Twitter',
				href: 'https://www.twitter.com',
			},
			{
				icon: mdiLinkedin,
				name: 'LinkedIn',
				href: 'https://www.linkedin.com',
			},
		],
		light: false,
		sitemapRoute: '/',
		cguRoute: '/',
		cookiesRoute: '/',
		legalNoticeRoute: '/',
		a11yStatementRoute: '/',
		vuetifyOptions: {
			footer: {
				elevation: 3,
				color: '#2f384d',
				height: 'auto',
			},
			goTopBtn: {
				density: 'compact',
				icon: 'true',
				variant: 'text',
				elevation: 0,
			},
			goTopBtnIcon: {
				color: 'primary',
			},
		},
	},
	render: (args) => {
		return {
			components: { FooterBar },
			setup() {
				return { args }
			},
			template: `
				<FooterBar
					v-bind="args.docProps"
					:link-items="args.items"
					:a11y-compliance="args.a11yCompliance"
					:hide-a11y-link="args.hideA11yLink"
					:hide-cgu-link="args.hideCguLink"
					:hide-cookies-link="args.hideCookiesLink"
					:hide-legal-notice-link="args.hideLegalNoticeLink"
					:hide-sitemap-link="args.hideSitemapLink"
					:hide-logo="args.hideLogo"
					:hide-social-media-links="args.hideSocialMediaLinks"
					:light="args.light"
					:version="args.version"
					:sitemap-route="args.sitemapRoute"
					:cgu-route="args.cguRoute"
					:cookies-route="args.cookiesRoute"
					:legal-notice-route="args.legalNoticeRoute"
					:a11y-statement-route="args.a11yStatementRoute"
					:social-media-links="args.socialMediaLinks"
					:vuetify-options="args.vuetifyOptions"
				/>
			`,
		}
	},
}

export const changeLinks: Story = {
	parameters: {
		controls: { include: ['items'] },
	},
	args: {
		items: [
			{
				text: 'Accueil',
				href: '/',
			},
			{
				text: 'Plan du site',
				href: '/sitemap',
			},
			{
				text: 'Conditions générales d\'utilisation',
				href: '/cgu',
			},
			{
				text: 'Aide',
				href: 'https://www.ameli.fr/assure/aide',
				ariaLabel: 'Aide (s’ouvre sur le site ameli.fr)',
				openInNewTab: true,
			},
		],
	},
	render: (args) => {
		return {
			components: { FooterBar },
			setup() {
				return { args }
			},
			template: `
				<FooterBar :link-items="args.items" />
			`,
		}
	},
}

export const slotPrepend: Story = {
	parameters: {
		controls: { include: ['prepend'] },
	},
	args: {
		items: items,
		prepend: '<li class="text--secondary my-3 mx-4">Texte ajouté</li>',
	},
	render: (args) => {
		return {
			components: { FooterBar },
			setup() {
				return { args }
			},
			template: `
				<FooterBar :link-items="args.items">
					<template #prepend>
						<li class="text--secondary my-3 mx-4">
							Texte ajouté
						</li>
					</template>
				</FooterBar>
			`,
		}
	},
}

export const slotAppend: Story = {
	parameters: {
		controls: { include: ['append'] },
	},
	args: {
		items: items,
		append: '<li class="text--secondary my-3 mx-4">{{ currentYear }}</li>',
	},
	render: (args) => {
		return {
			components: { FooterBar },
			setup() {
				return { args, currentYear }
			},
			template: `
				<FooterBar :link-items="args.items">
					<template #append>
						<li class="text--secondary my-3 mx-4">
							{{ currentYear }}
						</li>
					</template>
				</FooterBar>
			`,
		}
	},
}

export const slotLogo: Story = {
	parameters: {
		controls: { include: ['logo'] },
	},
	args: {
		items: items,
		logo: '<Logo :risque-pro="true" aria-label="Risque Pro" />',
	},
	render: (args) => {
		return {
			components: { FooterBar, Logo },
			setup() {
				return { args }
			},
			template: `
				<FooterBar :link-items="args.items">
					<p class="text--secondary mb-0"> Contenu supplémentaire.</p>
					<template #logo>
						<Logo
							:risque-pro="true"
							aria-label="Risque Pro"
						/>
					</template>
				</FooterBar>
			`,
		}
	},
}

export const extendedMode: Story = {
	parameters: {
		controls: { include: ['default'] },
	},
	args: {
		items: items,
		default: '<p class="text--secondary mb-0"> Contenu supplémentaire.</p>',
	},
	render: (args) => {
		return {
			components: { FooterBar },
			setup() {
				return { args }
			},
			template: `
				<FooterBar :link-items="args.items">
					<p class="text--secondary mb-0"> Contenu supplémentaire.</p>
				</FooterBar>
			`,
		}
	},
}

export const collapsibleList: Story = {
	parameters: {
		controls: { include: ['default'] },
	},
	args: {
		items: items,
		default: `<VRow class="max-width-none">
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
</VRow>`,
	},
	render(args) {
		return {
			components: { FooterBar, CollapsibleList },
			setup() {
				return { args, remboursementItems, healthItems }
			},
			template: `
				<FooterBar :link-items="args.items">
					<VRow class="max-width-none">
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
			`,
		}
	},
}

export const hideSectionLogo: Story = {
	parameters: {
		controls: { include: ['hideLogo'] },
	},
	args: {
		items: items,
		hideLogo: true,
	},
	render(args) {
		return {
			components: { FooterBar },
			setup() {
				return { args }
			},
			template: `
        <FooterBar :hide-logo="args.hideLogo" :link-items="args.items">
          <p class="text--secondary mb-0"> Contenu supplémentaire.</p>
        </FooterBar>
      `,
		}
	},
}

export const hideSectionSocialMediaLinks: Story = {
	parameters: {
		controls: { include: ['hideSocialMediaLinks'] },
	},
	args: {
		items: items,
		hideSocialMediaLinks: true,
	},
	render(args) {
		return {
			components: { FooterBar },
			setup() {
				return { args }
			},
			template: `
        <FooterBar :hide-social-media-links="args.hideSocialMediaLinks" :link-items="args.items">
          <p class="text--secondary mb-0"> Contenu supplémentaire.</p>
        </FooterBar>
      `,
		}
	},
}

export const customSocialMediaLinks: Story = {
	parameters: {
		controls: { include: ['socialMediaLinks'] },
	},
	args: {
		items: items,
		socialMediaLinks: [
			{
				icon: mdiFacebook,
				name: 'Facebook',
				href: 'https://www.facebook.com',
			},
			{
				icon: mdiTwitter,
				name: 'Twitter',
				href: 'https://www.twitter.com',
			},
			{
				icon: mdiLinkedin,
				name: 'LinkedIn',
				href: 'https://www.linkedin.com',
			},
			{
				icon: mdiYoutube,
				name: 'YouTube',
				link: 'https://youtube.com/',
			},
		],
	},
	render(args) {
		return {
			components: { FooterBar },
			setup() {
				return { args }
			},
			template: `
		<FooterBar :social-media-links="args.socialMediaLinks" :link-items="args.items">
		  <p class="text--secondary mb-0"> Contenu supplémentaire.</p>
		</FooterBar>
	  `,
		}
	},
}

export const lightTheme: Story = {
	parameters: {
		controls: { include: ['light'] },
	},
	args: {
		items: items,
		light: true,
	},
	render(args) {
		return {
			components: { FooterBar },
			setup() {
				return { args }
			},
			template: `
		<FooterBar :light="args.light" :link-items="args.items">
		  <p class="text--secondary mb-0"> Contenu supplémentaire.</p>
		</FooterBar>
	  `,
		}
	},
}

export const customTheme: Story = {
	parameters: {
		controls: { include: ['vuetifyOptions'] },
	},
	args: {
		items: items,
		vuetifyOptions: {
			footer: {
				elevation: 3,
				color: 'rgb(50, 53, 53)',
				height: 'auto',
			},
			goTopBtn: {
				color: 'rgb(50, 53, 53)',
			},
		},
	},
	render(args) {
		return {
			components: { FooterBar },
			setup() {
				return { args }
			},
			template: `
		<FooterBar :vuetify-options="args.vuetifyOptions" :link-items="args.items">
		  <p class="text--secondary mb-0"> Contenu supplémentaire.</p>
		</FooterBar>
	  `,
		}
	},
}
