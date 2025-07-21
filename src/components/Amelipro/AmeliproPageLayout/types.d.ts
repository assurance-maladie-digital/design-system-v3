import type { AmeliproFooterInfos } from '../AmeliproFooter/types'
import type { AmeliproHeaderInfos } from '../AmeliproHeader/types'
import type { AmeliproPatientBannerInfos } from '../AmeliproPatientBanner/types'

export interface SkipLink {
	label: string
	href: string
}

export interface AmeliproPageLayoutInfos {
	ameliproHeaderInfos?: AmeliproHeaderInfos
	ameliproFooterInfos?: AmeliproFooterInfos
	ameliproPatientBannerInfos?: AmeliproPatientBannerInfos
	displayPatientBanner?: boolean
}
