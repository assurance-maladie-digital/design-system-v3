import { mdiTwitter, mdiLinkedin, mdiFacebook } from '@mdi/js'

import type { SocialMediaLink } from '@/components/SocialMediaLinks/types'

export const defaultSocialMediaLinks: SocialMediaLink[] = [
	{
		icon: mdiLinkedin,
		href: 'https://www.linkedin.com/company/assurance-maladie/',
	},
	{
		icon: mdiFacebook,
		href: 'https://www.facebook.com/AssurMaladie/',
	},
	{
		icon: mdiTwitter,
		href: 'https://twitter.com/Assur_Maladie',
	},
]
