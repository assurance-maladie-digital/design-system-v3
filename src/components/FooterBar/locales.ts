import { A11yComplianceEnum } from './A11yCompliance'

export const locales = {
	goTopBtnLabel: 'Retour en haut de la page',
	sitemapLabel: 'Plan du site',
	cguLabel: 'Conditions générales d’utilisation',
	cookiesLabel: 'Gestion des cookies',
	legalNoticeLabel: 'Mentions légales',
	versionLabel: 'Version',
	followUs: 'Suivez-nous',
	[A11yComplianceEnum['non-compliant']]: 'non conforme',
	[A11yComplianceEnum['partially-compliant']]: 'partiellement conforme',
	[A11yComplianceEnum['fully-compliant']]: 'totalement conforme',
	a11yLabel: (complianceLabel: string): string =>
		`Accessibilité\xa0: ${complianceLabel}`,
}
