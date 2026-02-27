import FooterBar from '../FooterBar/FooterBar.vue'
import Logo from '../Logo/Logo.vue'
import CollapsibleList from '../CollapsibleList/CollapsibleList.vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { fn } from '@storybook/test'
import { mdiLinkedin, mdiFacebook, mdiYoutube } from '@mdi/js'
import imgUrl from '@/assets/amelipro/img/cartouche_nouveauTEL.svg'

const xIcon = 'M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z'

const items = [
	{
		text: 'Plan du site',
		href: 'javascript:void(0)',
		theme: 'cnam',
	},
	{
		text: 'Aide et configuration',
		href: 'javascript:void(0)',
		theme: 'ap',
	},
	{
		text: 'Conditions générales d\'utilisation',
		href: 'javascript:void(0)',
	},
	{
		text: 'Gestion des cookies',
		href: 'javascript:void(0)',
		theme: 'cnam',
	},
	{
		text: 'Mentions légales',
		href: 'javascript:void(0)',
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
	title: 'Composants/Structure/FooterBar',
	component: FooterBar,
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['logoSize', 'onEvent'] },
		actions: {
			handles: ['event'],
		},
	},
	argTypes: {
		a11yCompliance: {
			options: ['non-compliant', 'partially-compliant', 'fully-compliant'],
			control: { type: 'select' },
			default: 'fully-compliant',
			description: 'Le niveau de conformité aux règles d’accessibilité de l’application.\n Cette mention est obligatoire, voir la <a target="_blank" href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/obligations/#d%C3%A9claration-daccessibilit%C3%A9">documentation du RGAA</a>.',
		},
		linkItems: {
			control: {
				type: 'object',
			},
			description: 'Les liens de navigation à afficher dans le pied de page.',
		},
		hideSitemapLink: {
			control: {
				type: 'boolean',
			},
			description: 'Masque le lien vers le Plan du site.',
		},
		hideHelpLink: {
			control: {
				type: 'boolean',
			},
			description: 'Masque le lien vers aide et configuation.',
		},
		hideCguLink: {
			control: {
				type: 'boolean',
			},
			description: 'Masque le lien vers les Conditions générales d’utilisation.',
		},
		hideCookiesLink: {
			control: {
				type: 'boolean',
			},
			description: 'Masque le lien vers la Gestion des cookies.',
		},
		hideLegalNoticeLink: {
			control: {
				type: 'boolean',
			},
			description: 'Masque le lien vers les Mentions légales.',
		},
		hideA11yLink: {
			control: {
				type: 'boolean',
			},
			description: 'Masque le lien vers la Déclaration d’accessibilité.',
		},
		hideLogo: {
			control: {
				type: 'boolean',
			},
			description: 'Masque le logo.',
		},
		hideSocialMediaLinks: {
			control: {
				type: 'boolean',
			},
			description: 'Masque la liste des réseaux sociaux.',
		},
		version: {
			control: {
				type: 'text',
			},
			description: 'Le numéro de version de l’application.',
		},
		socialMediaLinks: {
			control: {
				type: 'object',
			},
			description: 'Personnalisation de la liste des réseaux sociaux.',
		},
		light: {
			control: {
				type: 'boolean',
			},
			description: 'Use the light theme for the footer.',
		},
		backOffice: {
			control: {
				type: 'boolean',
			},
			description: 'Affichage du footer pour le back office.',
		},
		backOfficeText: {
			control: {
				type: 'text',
			},
			description: 'Nom du service en back office à afficher dans le footer.',
		},
		sitemapRoute: {
			control: {
				type: 'text',
			},
			description: 'La valeur de la prop `to` du lien vers le Plan du site.',
		},
		helpRoute: {
			control: {
				type: 'text',
			},
			description: 'La valeur de la prop `to` du lien vers aide et configuration.',
		},
		cguRoute: {
			control: {
				type: 'text',
			},
			description: 'La valeur de la prop `to` du lien vers les Conditions générales d’utilisation.',
		},
		cookiesRoute: {
			control: {
				type: 'text',
			},
			description: 'La valeur de la prop `to` du lien vers la Gestion des cookies..',
		},
		legalNoticeRoute: {
			control: {
				type: 'text',
			},
			description: 'La valeur de la prop `to` du lien vers les Mentions légales.',
		},
		a11yStatementRoute: {
			control: {
				type: 'text',
			},
			description: 'La valeur de la prop `to` du lien vers la Déclaration d’accessibilité.',
		},
		default: {
			control: {
				type: 'text',
			},
			description: 'Slot pour ajouter du contenu dans la partie centrale du pied de page.',
		},
		prepend: {
			control: {
				type: 'text',
			},
			description: 'Slot pour ajouter du contenu avant les liens du pied de page.',
		},
		append: {
			control: {
				type: 'text',
			},
			description: 'Slot pour ajouter du contenu après les liens du pied de page.',
		},
		logo: {
			control: {
				type: 'text',
			},
			description: 'Slot pour remplacer le logo.',
		},
	},
} satisfies Meta<typeof FooterBar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<FooterBar v-bind="docProps"  />
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { FooterBar } from '@cnamts/synapse'
	
	const docProps = {
		sitemapRoute: '/',
		helpRoute: '/',
		cguRoute: '/',
		cookiesRoute: '/',
		legalNoticeRoute: '/',
		a11yStatementRoute: '/',
	}
</script>
				`,
			},
		],
		controls: { exclude: ['logoSize', 'items', 'onEvent'] },
	},
	args: {
		a11yCompliance: 'non-compliant',
		items: items,
		hideSitemapLink: false,
		hideHelpLink: false,
		hideCguLink: false,
		hideCookiesLink: false,
		hideLegalNoticeLink: false,
		hideA11yLink: false,
		hideLogo: false,
		hideSocialMediaLinks: false,
		backOffice: false,
		backOfficeText: 'Ameli Pro Back Office',
		socialMediaLinks: [
			{
				icon: mdiFacebook,
				name: 'Facebook',
				href: 'https://www.facebook.com',
			},
			{
				icon: xIcon,
				name: 'X',
				href: 'https://x.com',
			},
			{
				icon: mdiLinkedin,
				name: 'LinkedIn',
				href: 'https://www.linkedin.com',
			},
		],
		light: false,
		sitemapRoute: '/',
		helpRoute: '/',
		cguRoute: '/',
		cookiesRoute: '/',
		legalNoticeRoute: '/',
		a11yStatementRoute: '/',
		vuetifyOptions: {
			footer: {
				elevation: 3,
				color: 'var(--footer-background)',
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
		onEvent: fn(),
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
                    :hide-help-link="args.hideHelpLink"
					:hide-logo="args.hideLogo"
					:hide-social-media-links="args.hideSocialMediaLinks"
					:light="args.light"
                    :version="args.version"
                    :back-office="args.backOffice"
                    :back-office-text="args.backOfficeText"
                    :sitemap-route="args.sitemapRoute"
                    :help-route="args.helpRoute"
					:cgu-route="args.cguRoute"
					:cookies-route="args.cookiesRoute"
					:legal-notice-route="args.legalNoticeRoute"
					:a11y-statement-route="args.a11yStatementRoute"
					:social-media-links="args.socialMediaLinks"
					:vuetify-options="args.vuetifyOptions"
                    @event="args.onEvent"
				/>
			`,
		}
	},
}

export const changeLinks: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<FooterBar :link-items="items" />
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { FooterBar } from '@cnamts/synapse'
	
	const items = [
        		{
			text: 'Accueil',
			href: '/',
		},
		{
			text: 'Plan du site',
			href: '/sitemap',
		},
		{
			text: 'Conditions générales d\\'utilisation',
			href: '/cgu',
		},
		{
			text: 'Aide',
			href: 'https://www.ameli.fr/assure/aide',
			ariaLabel: 'Aide (s’ouvre sur le site ameli.fr)',
			openInNewTab: true,
		},
	]
</script>
				`,
			},
		],
		controls: { include: ['linkItems'] },
	},
	args: {
		linkItems: [
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
              <FooterBar :link-items="args.linkItems"/>
			`,
		}
	},
}

export const slotPrepend: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<FooterBar :link-items="items">
		<template #prepend>
			<li class="text--secondary my-3 mx-4">
				Texte ajouté
			</li>
		</template>
	</FooterBar>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { FooterBar } from '@cnamts/synapse'
	
	const items = [
        {
			text: 'Plan du site',
			href: '/sitemap',
		},
		{
			text: 'Conditions générales d\\'utilisation',
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
</script>
				`,
			},
		],
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
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<FooterBar :link-items="items">
		<template #append>
			<li class="text--secondary my-3 mx-4">
				{{ currentYear }}
			</li>
		</template>
	</FooterBar>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { FooterBar } from '@cnamts/synapse'
	
	const items = [
        {
			text: 'Plan du site',
			href: '/sitemap',
		},
		{
			text: 'Conditions générales d\\'utilisation',
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
	
	const currentYear = new Date().getFullYear()
</script>
				`,
			},
		],
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

export const extendedMode: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<FooterBar :link-items="items">
		<p class="text--secondary mb-0">Contenu supplémentaire.</p>
	</FooterBar>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { FooterBar } from '@cnamts/synapse'
	
	const items = [
        {
			text: 'Plan du site',
			href: '/sitemap',
		},
		{
			text: 'Conditions générales d\\'utilisation',
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
</script>
				`,
			},
		],
		controls: { include: ['default'] },
	},
	args: {
		items: items,
		default: '<p class="text--secondary mb-0">Contenu supplémentaire.</p>',
	},
	render: (args) => {
		return {
			components: { FooterBar },
			setup() {
				return { args }
			},
			template: `
              <FooterBar :link-items="args.items">
					<p class="text--secondary mb-0">Contenu supplémentaire.</p>
				</FooterBar>
			`,
		}
	},
}

export const slotLogo: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<FooterBar :link-items="items">
		<p class="text--secondary mb-0">Contenu supplémentaire.</p>
		<template #logo>
			<Logo
				:risque-pro="true"
				aria-label="Risque Pro"
			/>
		</template>
	</FooterBar>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { FooterBar } from '@cnamts/synapse'
	import { Logo } from '@cnamts/synapse'
	
	const items = [
        {
			text: 'Plan du site',
			href: '/sitemap',
		},
		{
			text: 'Conditions générales d\\'utilisation',
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
</script>
				`,
			},
		],
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
					<p class="text--secondary mb-0">Contenu supplémentaire.</p>
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

export const collapsibleList: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<FooterBar :link-items="items">
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
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { FooterBar } from '@cnamts/synapse'
	import { CollapsibleList } from '@cnamts/synapse'
	
	const items = [
        {
			text: 'Plan du site',
			href: '/sitemap',
		},
		{
			text: 'Conditions générales d\\'utilisation',
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
</script>
				`,
			},
		],
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
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<FooterBar 
		:link-items="items"
		hide-logo
	>
		<p class="text--secondary mb-0">Contenu supplémentaire.</p>
	</FooterBar>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { FooterBar } from '@cnamts/synapse'
	
	const items = [
        {
			text: 'Plan du site',
			href: '/sitemap',
		},
		{
			text: 'Conditions générales d\\'utilisation',
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
</script>
				`,
			},
		],
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
          <p class="text--secondary mb-0">Contenu supplémentaire.</p>
        </FooterBar>
      `,
		}
	},
}

export const hideSectionSocialMediaLinks: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<FooterBar 
		:link-items="items"
		hide-social-media-link
	>
		<p class="text--secondary mb-0">Contenu supplémentaire.</p>
	</FooterBar>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { FooterBar } from '@cnamts/synapse'
	
	const items = [
        {
			text: 'Plan du site',
			href: '/sitemap',
		},
		{
			text: 'Conditions générales d\\'utilisation',
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
</script>
				`,
			},
		],
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
              <FooterBar :hide-social-media-links="args.hideSocialMediaLinks"
                         :link-items="args.items"
              >
          <p class="text--secondary mb-0">Contenu supplémentaire.</p>
        </FooterBar>
      `,
		}
	},
}

export const customSocialMediaLinks: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<FooterBar 
		:link-items="items"
		:social-media-links="socialMediaLinks"
	>
		<p class="text--secondary mb-0">Contenu supplémentaire.</p>
	</FooterBar>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { FooterBar } from '@cnamts/synapse'
	import { mdiFacebook, mdiTwitter, mdiLinkedin, mdiYoutube } from '@mdi/js'
	
	const xIcon = 'M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z'

	
	const items = [
        {
			text: 'Plan du site',
			href: '/sitemap',
		},
		{
			text: 'Conditions générales d\\'utilisation',
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
	
	const socialMediaLinks = [
		{
			icon: mdiFacebook,
			name: 'Facebook',
			href: 'https://www.facebook.com',
		},
		{
			icon: xIcon,
			name: 'X',
			href: 'https://x.com',
		},
		{
			icon: mdiLinkedin,
			name: 'LinkedIn',
			href: 'https://www.linkedin.com',
		},
		{
			icon: mdiYoutube,
			name: 'YouTube',
			href: 'https://youtube.com',
		},
	]
</script>
				`,
			},
		],
		controls: { include: ['socialMediaLinks'] },
	},
	args: {
		items: items,
		socialMediaLinks: [
			{
				icon: mdiLinkedin,
				name: 'LinkedIn',
				href: 'https://www.linkedin.com',
			},
			{
				icon: mdiFacebook,
				name: 'Facebook',
				href: 'https://www.facebook.com',
			},
			{
				icon: xIcon,
				name: 'X',
				href: 'https://x.com',
			},
			{
				icon: mdiYoutube,
				name: 'YouTube',
				href: 'https://youtube.com',
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
              <FooterBar :social-media-links="args.socialMediaLinks"
                         :link-items="args.items"
              >
		  <p class="text--secondary mb-0">Contenu supplémentaire.</p>
		</FooterBar>
	  `,
		}
	},
}

export const lightTheme: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<FooterBar 
		:link-items="items"
		light
	>
		<p class="text--secondary mb-0">Contenu supplémentaire.</p>
	</FooterBar>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { FooterBar } from '@cnamts/synapse'
	
	const items = [
        {
			text: 'Plan du site',
			href: '/sitemap',
		},
		{
			text: 'Conditions générales d\\'utilisation',
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
</script>
				`,
			},
		],
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
		  <p class="text--secondary mb-0">Contenu supplémentaire.</p>
		</FooterBar>
	  `,
		}
	},
}

export const customTheme: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<FooterBar 
		:link-items="items"
		:vuetify-options="vuetifyOptions"
	>
		<p class="text--secondary mb-0">Contenu supplémentaire.</p>
	</FooterBar>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { FooterBar } from '@cnamts/synapse'
	
	const items = [
        {
			text: 'Plan du site',
			href: '/sitemap',
		},
		{
			text: 'Conditions générales d\\'utilisation',
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
	
	const vuetifyOptions = {
		footer: {
			elevation: 3,
			color: 'rgb(50, 53, 53)',
			height: 'auto',
		},
		goTopBtn: {
			color: 'rgb(50, 53, 53)',
		},
	}
</script>
				`,
			},
		],
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
		  <p class="text--secondary mb-0">Contenu supplémentaire.</p>
		</FooterBar>
	  `,
		}
	},
}
export const BackOffice: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<FooterBar v-bind="docProps" />
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { FooterBar } from '@cnamts/synapse'
	
	const docProps = {
		sitemapRoute: '/',
		helpRoute: '/',
		cguRoute: '/',
		cookiesRoute: '/',
		legalNoticeRoute: '/',
		a11yStatementRoute: '/',
	}
</script>
				`,
			},
		],
		controls: { exclude: ['logoSize', 'items'] },
	},
	args: {
		a11yCompliance: 'non-compliant',
		items: items,
		version: '1.1.2',
		backOffice: true,
		backOfficeText: 'Ameli Pro Back Office',
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
		helpRoute: '/',
		cguRoute: '/',
		cookiesRoute: '/',
		legalNoticeRoute: '/',
		a11yStatementRoute: '/',
		vuetifyOptions: {
			footer: {
				elevation: 3,
				color: 'var(--footer-background)',
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
                  :hide-help-link="args.hidehelpLink"
                  :hide-logo="args.hideLogo"
                  :hide-social-media-links="args.hideSocialMediaLinks"
                  :light="args.light"
                  :version="args.version"
                  :back-office="args.backOffice"
                  :back-office-text="args.backOfficeText"
                  :sitemap-route="args.sitemapRoute"
                  :help-route="args.helpRoute"
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
export const withPhoneNumber: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
      <FooterBar :link-items="args.items" prepend>
                <template #prepend>
                  <img
                      :src="imgUrl"
                      alt="au 3608 : Service gratuit + prix appel"
                      style="cursor: pointer;"
                  />
                </template>
              </FooterBar>
	</FooterBar>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { FooterBar } from '@cnamts/synapse'
	
	const items = [
        {
			text: 'Plan du site',
			href: '/sitemap',
		},
		{
			text: 'Conditions générales d\\'utilisation',
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
</script>
				`,
			},
		],
		controls: { include: ['prepend'] },
	},
	args: {
		items: items,
	},
	render: (args) => {
		return {
			components: { FooterBar },
			setup() {
				return { args, imgUrl }
			},
			template: `
              <FooterBar :link-items="args.items" prepend>
                <template #prepend>
                  <img
                      :src="imgUrl"
                      alt="au 3608 : Service gratuit + prix appel"
                      style="cursor: pointer;"
                  />
                </template>
              </FooterBar>
            `,
		}
	},
}
