const reGet = /CAPTCHAID/

type SuccessCallback = (captchaId: string) => void
type ErrorCallback = (error: Error) => void

/**
 * Création du captcha auprès d'OBS
 * @param urlCreate - URL de création
 * @param body - Corps de la requête (peut être un Document ou un BodyInit)
 * @param cbsuccess - Fonction à appeler en cas de succès
 * @param cberror - Fonction à appeler en cas d'erreur
 */
export function createCaptcha(
	urlCreate: string,
	body: string | null,
	cbsuccess: SuccessCallback,
	cberror: ErrorCallback,
): void {
	fetch(urlCreate, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: body,
	})
		.then(async (response) => {
			if (response.ok) {
				try {
					const json = await response.json()
					cbsuccess(json.id)
				}
				catch (err) {
					cberror(err as Error)
				}
			}
			else {
				cberror(response.statusText ? new Error(response.statusText) : new Error('Erreur inconnue'))
			}
		})
		.catch((error) => {
			cberror(error)
		})
}

/**
 * Création d'un captcha image auprès d'OBS avec locale par défaut
 * @param urlCreate - URL de création
 * @param cbsuccess - Callback de succès
 * @param cberror - Callback d'erreur
 * @param locale - Locale (langue)
 */
export function createCaptchaImage(
	urlCreate: string,
	cbsuccess: SuccessCallback,
	cberror: ErrorCallback,
	locale: string = 'default',
): void {
	const body = JSON.stringify({
		type: 'IMAGE',
		locale,
	})
	createCaptcha(urlCreate, body, cbsuccess, cberror)
}

/**
 * Création d'un captcha audio auprès d'OBS
 * @param urlCreate - URL de création
 * @param cbsuccess - Callback de succès
 * @param cberror - Callback d'erreur
 * @param locale - Locale (langue), "default" si non indiqué
 */
export function createCaptchaAudio(
	urlCreate: string,
	cbsuccess: SuccessCallback,
	cberror: ErrorCallback,
	locale: string = 'default',
): void {
	const body = JSON.stringify({
		type: 'AUDIO',
		locale,
	})

	createCaptcha(urlCreate, body, cbsuccess, cberror)
}

/**
 * Génère l'URL de récupération de l'image du captcha
 * @param urlGetImage - URL avec le placeholder CAPTCHAID
 * @param captchaId - Identifiant du captcha
 * @returns L'URL avec l'identifiant inséré
 */
export function getCaptchaImageUrl(
	urlGetImage: string,
	captchaId: string,
): string {
	return urlGetImage.replace(reGet, captchaId)
}

/**
 * Génère l'URL de récupération de l'audio du captcha
 * @param urlGetAudio - URL avec le placeholder CAPTCHAID
 * @param captchaId - Identifiant du captcha
 * @returns L'URL avec l'identifiant inséré
 */
export function getCaptchaAudioUrl(
	urlGetAudio: string,
	captchaId: string,
): string {
	return urlGetAudio.replace(reGet, captchaId)
}
