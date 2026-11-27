import { mdiFacebook, mdiLinkedin } from '@mdi/js'
import SocialMediaLinks from '../SocialMediaLinks.vue'
import { getTextContrast } from '../../../../cypress/support/contrast'

const links = [
	{ name: 'LinkedIn', href: 'https://www.linkedin.com', icon: mdiLinkedin },
	{ name: 'Facebook', href: 'https://www.facebook.com', icon: mdiFacebook },
]

describe('SocialMediaLinks – RGAA browser checks – CNAM theme', () => {
	it('3.2 – keeps sufficient contrast for the accessible labels', () => {
		cy.mountWithVuetify(SocialMediaLinks, { props: { links } })
		cy.get('.vd-social-media-links a').each(($link) => {
			expect(getTextContrast($link[0]!)).to.be.at.least(3)
		})
	})

	it('3.3 and 10.7 – exposes a visible focus indicator for each link', () => {
		cy.mountWithVuetify(SocialMediaLinks, { props: { links } })
		cy.get('.vd-social-media-links a').each(($link) => {
			cy.wrap($link).focus().should(($focused) => {
				const style = window.getComputedStyle($focused[0])
				expect(style.outlineStyle).to.not.equal('none')
				expect(Number.parseFloat(style.outlineWidth)).to.be.greaterThan(0)
			})
		})
	})
})
