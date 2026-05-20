import SocialMediaLinks from '../SocialMediaLinks.vue'

const defaultLinks = [
	{ name: 'Twitter', url: 'https://twitter.com', icon: 'mdi-twitter' },
	{ name: 'Facebook', url: 'https://facebook.com', icon: 'mdi-facebook' },
	{ name: 'YouTube', url: 'https://youtube.com', icon: 'mdi-youtube' },
]

describe('SocialMediaLinks - Visual regression tests', () => {
	it('displays the social media links by default', () => {
		cy.mountWithVuetify(SocialMediaLinks, {
			props: { links: defaultLinks },
		})

		cy.get('.vd-social-media-links-content').should('be.visible')
		cy.matchImageSnapshot('social-media-links-default', cy.get('.v-application'))
	})

	it('displays the social media links without native heading', () => {
		cy.mountWithVuetify(SocialMediaLinks, {
			props: {
				links: defaultLinks,
				useNativeHeading: false,
			},
		})

		cy.get('.vd-social-media-links-content').should('be.visible')
		cy.matchImageSnapshot('social-media-links-no-native-heading', cy.get('.v-application'))
	})
})
