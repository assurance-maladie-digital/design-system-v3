import { defaultSocialMediaLinks } from '../DefaultSocialMediaLinks'
import { describe, it, expect } from 'vitest'
import { mdiLinkedin } from '@mdi/js'

describe('defaultSocialMediaLinks', () => {
	it('contains the correct number of links', () => {
		expect(defaultSocialMediaLinks.length).toBe(3)
	})

	it('contains the correct LinkedIn link', () => {
		const linkedinLink = defaultSocialMediaLinks.find(link => link.href === 'https://www.linkedin.com/company/assurance-maladie/')
		expect(linkedinLink).toBeDefined()
		expect(linkedinLink?.icon).toBe(mdiLinkedin)
	})

	it('contains the correct X link', () => {
		const xLink = defaultSocialMediaLinks.find(link => link.href === 'https://x.com/Assur_Maladie')
		expect(xLink).toBeDefined()
		expect(typeof xLink?.icon).toBe('string')
	})
})
