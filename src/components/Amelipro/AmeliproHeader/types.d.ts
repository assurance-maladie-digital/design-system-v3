import type { IServiceMenuInfos } from '../ServiceMenu/types'
import type { RouteLocationRaw } from 'vue-router'
import type { StructureMenuInfosForHeader } from '../StructureMenu/types'
import type { UserInformationSummaryInfos } from '../UserInformationSummary/types'
import type { UserMenuInfos } from '../UserMenu/types'

export interface AmeliproHeaderInfos {
	backoffice?: boolean
	headerTitle?: string
	homeHref?: string
	homeLink?: RouteLocationRaw
	serviceMenuInfos?: IServiceMenuInfos
	serviceName?: string
	serviceSubTitle?: string
	signatureInfos?: ISignatureInfos
	structureMenuInfos?: StructureMenuInfosForHeader
	userInformationSummaryInfos?: UserInformationSummaryInfos
	userMenuInfos?: UserMenuInfos
}

export interface ISignatureInfos {
	clickFn?: CallableFunction
	href?: string
	to?: RouteLocationRaw
}
