import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproFooter from './AmeliproFooter.vue'

const meta = {
	argTypes: {
		'a11y-event': {
			action: 'click-phone',
			description: 'Événement émis au click sur le bouton accessibilité',
			type: 'void',
		},
		'a11yCompliance': { description: 'Niveau de conformité au RGAA de l’application Amelipro' },
		'a11yHref': { description: 'Href du bouton accessibilité' },
		'a11yTarget': { description: 'Target du bouton accessibilité (seulement si a11yHref est renseigné)' },
		'a11yTo': { description: 'Route du bouton accessibilité' },
		'about-event': {
			action: 'about-event',
			description: 'Événement émis au click sur le bouton à propos',
			type: 'void',
		},
		'aboutHref': { description: 'Href du bouton à propos' },
		'aboutTarget': { description: 'Target du bouton à propos (seulement si aboutHref est renseigné)' },
		'aboutTo': { description: 'Route du bouton à propos' },
		'backOffice': { description: 'Affichage du footer pour le back office ' },
		'backOfficeText': { description: 'Nom du service en back office à afficher dans le footer' },
		'cgu-event': {
			action: 'cgu-event',
			description: 'Événement émis au click sur le bouton CGU',
			type: 'void',
		},
		'cguHref': { description: 'Href du bouton CGU' },
		'cguTarget': { description: 'Target du bouton CGU (seulement si cguHref est renseigné)' },
		'cguTo': { description: 'Route du bouton CGU' },
		'click-phone': {
			action: 'click-phone',
			description: 'Événement émis au click sur le bouton contact si phoneLink est à false',
		},
		'config-event': {
			action: 'config-event',
			description: 'Événement émis au click sur le bouton configuration',
			type: 'void',
		},
		'configurationHref': { description: 'Href du bouton configuration' },
		'configurationTarget': { description: 'Target du bouton configuration (seulement si configurationHref est renseigné)' },
		'configurationTo': { description: 'Route du bouton configuration' },
		'legal-notice-event': {
			action: 'legal-notice-event',
			description: 'Événement émis au click sur le bouton mentions légales',
			type: 'void',
		},
		'legalNoticeHref': { description: 'Route du bouton mentions légales' },
		'legalNoticeTarget': { description: 'Target du bouton mentions légales (seulement si legalNoticeHref est renseigné)' },
		'legalNoticeTo': { description: 'Route du bouton mentions légales' },
		'noA11y': { description: 'Masque le bouton Accessibilité' },
		'noAbout': { description: 'Masque le bouton à propos' },
		'noCgu': { description: 'Masque le bouton CGU' },
		'noConfiguration': { description: 'Masque le bouton configuration' },
		'noLegalNotice': { description: 'Masque le bouton mentions légales' },
		'noLinkA11y': { description: 'Transforme le bouton Accessibilité en texte simple sans lien' },
		'noPhone': { description: 'Masque le numéro de téléphone' },
		'noSiteMap': { description: 'Masque le bouton plan du site' },
		'phoneLink': { description: 'Property à mettre à false pour utiliser le lien du de contact du footer comme un bouton' },
		'site-map-event': {
			action: 'site-map-event',
			description: 'Événement émis au click sur le bouton plan de site',
			type: 'void',
		},
		'siteMapHref': { description: 'Href du bouton plan de site' },
		'siteMapTarget': { description: 'Target du bouton plan de site (seulement si siteMapHref est renseigné)' },
		'siteMapTo': { description: 'Route du bouton plan de site' },
		'uniqueId': { description: 'Identifiant unique du footer' },
		'version': { description: 'Version de l’application Amelipro' },
	},
	component: AmeliproFooter,
	title: 'Composants/Amelipro/Mise en page/AmeliproFooter',
} as Meta<typeof AmeliproFooter>
export default meta

type Story = StoryObj<typeof AmeliproFooter>

export const Default: Story = {
	args: {
		a11yCompliance: 'A11yComplianceEnum.NON_COMPLIANT',
		backOffice: false,
		noA11y: false,
		noAbout: false,
		noCgu: false,
		noConfiguration: false,
		noLegalNotice: false,
		noLinkA11y: false,
		noSiteMap: false,
		version: 'X.X.X',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproFooter
		a11y-compliance="A11yComplianceEnum.NON_COMPLIANT"
		:back-office="false"
		:no-a11y="false"
		:no-about="false"
		:no-cgu="false"
		:no-configuration="false"
		:no-legal-notice="false"
		:no-link-a11y="false"
		:no-site-map="false"
		version="X.X.X"
		@a11y-event="args['a11y-event']"
		@about-event="args['about-event']"
		@cgu-event="args['cgu-event']"
		@click-phone="args['click-phone']"
		@config-event="args['config-event']"
		@legal-notice-event="args['legal-notice-event']"
		@site-map-event="args['site-map-event']"
	/>
</template>
				`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
	import { AmeliproFooter } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproFooter },
		setup() {
			return { args }
		},
		template: `
<AmeliproFooter
	v-bind="args"
	@a11y-event="args['a11y-event']"
	@about-event="args['about-event']"
	@cgu-event="args['cgu-event']"
	@click-phone="args['click-phone']"
	@config-event="args['config-event']"
	@legal-notice-event="args['legal-notice-event']"
	@site-map-event="args['site-map-event']"
/>
		`,
	}),
}
