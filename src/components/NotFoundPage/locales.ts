import imgUrlAp from './assets/not-found-ap.svg'
import imgUrlCnam from './assets/not-found-cnam.svg'

export const locales = {
	default: {
		code: '404',
		pageTitle: 'Page non trouvée',
		message: 'Cette page n’existe pas ou a été déplacée.',
		src: imgUrlCnam,
	},
	cnam: {
		code: '404',
		pageTitle: 'Page non trouvée',
		message: 'Cette page n’existe pas ou a été déplacée.',
		src: imgUrlCnam,
	},
	ap: {
		code: '404',
		pageTitle: 'Page non trouvée ou inexistante - Erreur 404',
		message: 'La page que vous essayez d’afficher n’existe plus ou a été déplacée.',
		src: imgUrlAp,
	},
}
