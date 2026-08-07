import SocialMediaLinks from '../SocialMediaLinks.vue'
import { mdiFacebook, mdiLinkedin, mdiYoutube } from '@mdi/js'
import { h } from 'vue'

const defaultLinks = [
	{ name: 'LinkedIn', href: 'https://linkedin.com', icon: mdiLinkedin },
	{ name: 'Facebook', href: 'https://facebook.com', icon: mdiFacebook },
	{ name: 'YouTube', href: 'https://youtube.com', icon: mdiYoutube },
]

describe('SocialMediaLinks - Visual regression tests', () => {
	it('displays the social media links by default', () => {
		cy.mountWithVuetify(
			h('div', { style: 'background-color: #1e1e2e; padding: 16px;' }, [
				h(SocialMediaLinks, { links: defaultLinks }),
			]),
		)

		cy.get('.vd-social-media-links-content').should('be.visible')
		cy.matchImageSnapshot('social-media-links-default', cy.get('.vd-social-media-links-content').parent().parent())
	})

	it('displays the social media links without native heading', () => {
		cy.mountWithVuetify(
			h('div', { style: 'background-color: #1e1e2e; padding: 16px;' }, [
				h(SocialMediaLinks, { links: defaultLinks, useNativeHeading: false }),
			]),
		)

		cy.get('.vd-social-media-links-content').should('be.visible')
		cy.matchImageSnapshot('social-media-links-no-native-heading', cy.get('.vd-social-media-links-content').parent().parent())
	})

	it('displays the social media links in dark mode', () => {
		cy.mountWithVuetify(
			h('div', { style: 'background-color: #1e1e2e; padding: 16px;' }, [
				h(SocialMediaLinks, {
					links: defaultLinks,
					dark: true,
				}),
			]),
		)

		cy.get('.vd-social-media-links').should('be.visible')
		cy.get('.vd-social-media-links')
			.should('have.class', 'vd-social-media-links--dark')

		cy.matchImageSnapshot(
			'social-media-links-dark',
			cy.get('.vd-social-media-links'),
		)
	})
})
