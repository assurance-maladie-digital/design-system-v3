import { mdiTwitter, mdiLinkedin, mdiFacebook } from '@mdi/js'

import type { SocialMediaLink } from '@/components/SocialMediaLinks/types'

export const defaultSocialMediaLinks: SocialMediaLink[] = [
	{
		icon: mdiLinkedin,
		name: 'LinkedIn',
		href: 'https://www.linkedin.com/company/assurance-maladie/',
	},
	{
		icon: mdiFacebook,
		name: 'Facebook',
		href: 'https://www.facebook.com/AssurMaladie/',
	},
	{
		icon: mdiTwitter,
		name: 'Twitter',
		href: 'https://twitter.com/Assur_Maladie',
	},
]