import imgUrlAp from './assets/maintenance-ap.svg'
import imgUrlCnam from './assets/maintenance.svg'

export const locales = {
	default: {
		pageTitle: 'Maintenance en cours',
		message:
      'L’application n’est pas disponible pour le moment, veuillez nous excuser pour la gêne occasionnée.',
		src: undefined,
		code: '503',
	},
	cnam: {
		pageTitle: 'Maintenance en cours',
		message:
      'L’application n’est pas disponible pour le moment, veuillez nous excuser pour la gêne occasionnée.',
		src: imgUrlCnam,
		code: '',
	},
	ap: {
		pageTitle: 'Pour votre confort, nous améliorons ce service !',
		message:
      'Nous mettons en œuvre les mesures nécessaires pour que vous puissiez le retrouver rapidement. Veuillez nous excuser pour la gêne occasionnée.',
		src: imgUrlAp,
		code: '503',
	},
}
