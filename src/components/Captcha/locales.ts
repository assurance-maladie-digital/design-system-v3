export const locales = {
	hardToRead: 'Vous n\'arrivez pas à lire ?',
	image: {
		new: 'Changer d’image',
		change: 'Utiliser un captcha audio',
		textfieldLabel: 'Caractères de l’image',
	},
	audio: {
		new: 'Changer d’audio',
		change: 'Utiliser un captcha image',
		textfieldLabel: 'Caractères de l’audio',
	},
	choiceCaptcha: {
		image: 'captcha image',
		audio: 'captcha audio',
	},
	helpDesk: (phoneNumber: string) => `Si vous êtes en incapacité de résoudre le captcha, contactez le support au ${phoneNumber}.`,
	pause: 'Pause',
	play: 'Lire l\'audio',
	renew: 'Renouveler le captcha',
	validate: 'Vérifier',
	captchaImgLoading: 'Chargement de l\'image du captcha',
	captchaImgAlt: 'Le captcha à saisir',
	information: {
		securityCheck: 'Vérification de sécurité',
		btnAriaLabel: 'Ouvrir la bulle d’information',
		tooltip: 'Nous nous assurons ainsi que vous êtes un être humain, et non un robot.',
		imageInstruction: 'Saisissez les caractères affichés ci-dessous.',
		audioInstruction: 'Saisissez le texte que vous entendez.',
	},
	defaultErrorMessage: 'Une erreur inconnue est survenue',
	required: 'Le captcha est requis',
	choiceCaptchaTitle: 'Choisissez le type de captcha de votre choix.',
}
