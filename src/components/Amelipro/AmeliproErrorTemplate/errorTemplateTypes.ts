import type { ErrorTemplateTypes } from './types'
import url403 from '../../../assets/amelipro/img/visuel_erreur_403.svg'
import url404 from '../../../assets/amelipro/img/visuel_erreur_404.svg'
import url500 from '../../../assets/amelipro/img/visuel_erreur_500.svg'
import url503 from '../../../assets/amelipro/img/visuel_erreur_503.svg'
import urlDeconnexion from '../../../assets/amelipro/img/visuel_deconnexion.svg'
import urlObsolete from '../../../assets/amelipro/img/visuel_navigateur_obsolete.svg'

export const ErrorTemplateContent: ErrorTemplateTypes = {
	disconnect: {
		btnText: 'Page d’accueil',
		contentText: 'Merci pour votre visite, à très bientôt !',
		contentTitle: 'Vous êtes déconnecté(e)',
		imgUrl: urlDeconnexion,
		titleText: 'Déconnexion',
	},
	error401: {
		btnText: 'Se reconnecter',
		contentText: `Nous mettons en œuvre les mesures nécessaires pour rétablir rapidement votre accès.
		Veuillez nous excuser pour la gêne occasionnée.`,
		contentTitle: 'Les services amelipro sont indisponibles !',
		imgUrl: urlDeconnexion,
		titleText: 'Erreur 401',
	},
	error403: {
		btnText: 'Page d’accueil',
		contentText: 'Vous n’êtes pas autorisé à être ici, Veuillez contacter l’équipe support.',
		contentTitle: 'Vous n’êtes pas autorisé à voir cette page !',
		imgUrl: url403,
		titleText: 'Erreur 403',
	},
	error404: {
		btnText: 'Page d’accueil',
		contentText: 'La page que vous essayez d’afficher n’existe plus ou a été déplacée.',
		contentTitle: 'Page non trouvée ou inexistante - Erreur 404',
		imgUrl: url404,
		titleText: 'Erreur 404',
	},
	error500: {
		btnText: 'Se reconnecter',
		contentText: `Nous mettons en œuvre les mesures nécessaires pour rétablir rapidement votre accès.
		Veuillez nous excuser pour la gêne occasionnée.`,
		contentTitle: 'Les services amelipro sont indisponibles !',
		imgUrl: url500,
		titleText: 'Erreur 500',
	},
	error503: {
		btnText: 'Page d’accueil',
		contentText: `Nous mettons en œuvre les mesures nécessaires pour que vous puissiez le retrouver rapidement.
		Veuillez nous excuser pour la gêne occasionnée.`,
		contentTitle: 'Pour votre confort, nous améliorons ce service !',
		imgUrl: url503,
		titleText: 'Erreur 503',
	},
	inactive: {
		btnText: 'Se reconnecter',
		contentText: 'Veuillez nous excuser pour la gêne occasionnée.',
		contentTitle: 'En raison d’inactivité, votre session a expiré !',
		imgUrl: urlDeconnexion,
		titleText: 'Session Expirée',
	},
	maintenance: {
		btnText: 'Page d’accueil',
		contentText: `L'application n'est pas disponible pour le moment.
		Veuillez nous excuser pour la gêne occasionnée.`,
		contentTitle: 'Maintenance en cours !',
		imgUrl: url503,
		titleText: 'MAINTENANCE EN COURS',
	},
	obsolete: {
		btnText: 'Page d’accueil',
		contentText: 'Nous vous conseillons de télécharger une version plus récente ou de choisir un autre navigateur afin d’utiliser nos services de façon optimale et en toute sécurité.',
		contentTitle: 'Cette version de navigateur est obsolète !',
		imgUrl: urlObsolete,
		titleText: 'NAVIGATEUR OBSOLÈTE',
	},
	technical: {
		btnText: 'Page d’accueil',
		contentText: `Nous mettons en œuvre les mesures nécessaires pour résoudre rapidement le problème.
		Veuillez nous excuser pour la gêne occasionnée.`,
		contentTitle: 'Une erreur technique s’est produite.',
		imgUrl: urlDeconnexion,
		titleText: 'Erreur technique',
	},
}
