import imgUrlAp from './assets/error-ap.svg'

export const locales = {
	default: {
		pageTitle: 'Une erreur est survenue',
		message: 'Une erreur est survenue de notre côté, veuillez réessayer plus tard.',
		src: '',
		code: '500',
	},
	cnam: {
		pageTitle: 'Une erreur est survenue',
		message: 'Une erreur est survenue de notre côté, veuillez réessayer plus tard. Si le problème persiste veuillez nous contacter par téléphone au 3646',
		src: '',
		code: '500',
	},
	ap: {
		pageTitle: 'Les services amelipro sont indisponibles !',
		message:
      'Nous mettons en œuvre les mesures nécessaires pour rétablir rapidement votre accès. Veuillez nous excuser pour la gêne occasionnée.',
		src: imgUrlAp,
		code: '500',
	},
}
