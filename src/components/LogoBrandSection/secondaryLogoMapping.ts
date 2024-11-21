import { locales } from './locales'
import logoCnam from './assets/cnam.svg'
import logoAmeli from './assets/ameli.svg'
import logoAmeliPro from './assets/ameli-pro.svg'
import logoCompteAmeli from './assets/compte-ameli.svg'

export const secondaryLogoMapping = {
	'cnam': {
		src: logoCnam,
		alt: locales.logoCnam,
	},
	'ameli': {
		src: logoAmeli,
		alt: locales.logoAmeli,
	},
	'ameli-pro': {
		src: logoAmeliPro,
		alt: locales.logoAmeliPro,
	},
	'compte-ameli': {
		src: logoCompteAmeli,
		alt: locales.logoCompteAmeli,
	},
} as const
