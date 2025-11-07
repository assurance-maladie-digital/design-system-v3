import { RouteLocationRaw } from 'vue-router'

export interface AmeliproFooterInfos {
	version?: string
	a11yCompliance?: string
	noSiteMap?: boolean
	siteMapTarget?: string
	siteMapTo?: RouteLocationRaw
	siteMapHref?: string
	noAbout?: boolean
	aboutTarget?: string
	aboutTo?: RouteLocationRaw
	aboutHref?: string
	noConfiguration?: boolean
	configurationTarget?: string
	configurationTo?: RouteLocationRaw
	configurationHref?: string
	configurationLabel?: string
	noLegalNotice?: boolean
	legalNoticeTarget?: string
	legalNoticeTo?: RouteLocationRaw
	legalNoticeHref?: string
	noCgu?: boolean
	cguTarget?: string
	cguTo?: RouteLocationRaw
	cguHref?: string
	noA11y?: boolean
	noLinkA11y?: boolean
	a11yTarget?: string
	a11yTo?: RouteLocationRaw
	a11yHref?: string
	backOffice?: boolean
	backOfficeText?: string
	noPhone?: boolean
}
