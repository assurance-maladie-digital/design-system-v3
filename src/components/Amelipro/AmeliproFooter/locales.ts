import { A11yComplianceEnum } from './A11yComplianceEnum'
import imgUrl from '@/assets/amelipro/img/cartouche_nouveauTEL.svg'

export const locales = {
	a11yLabel: (complianceLabel: string): string => `Accessibilité\xa0: ${complianceLabel}`,
	aboutLabel: 'À propos',
	cguLabel: 'CGU',
	configurationLabel: 'Configuration',
	contactLabel: 'Nous contacter',
	imgSrc: imgUrl,
	legalNoticeLabel: 'Mentions légales',
	siteMapLabel: 'Plan de site',
	[A11yComplianceEnum.NON_COMPLIANT]: 'non conforme',
	[A11yComplianceEnum.PARTIALLY_COMPLIANT]: 'partiellement conforme',
	[A11yComplianceEnum.FULLY_COMPLIANT]: 'conforme',
}
