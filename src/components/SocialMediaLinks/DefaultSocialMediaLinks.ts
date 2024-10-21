import { mdiTwitter, mdiLinkedin } from '@mdi/js'

import type { SocialMediaLink } from './types'

export const defaultSocialMediaLinks: SocialMediaLink[] = [
	{
		icon: mdiLinkedin,
		href: 'https://www.linkedin.com/company/assurance-maladie/',
	},
	{
		icon: mdiTwitter,
		href: 'https://twitter.com/Assur_Maladie',
	},
]
