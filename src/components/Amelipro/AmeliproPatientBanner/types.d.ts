import type { RouteLocationRaw } from 'vue-router'

export interface AmeliproPatientBannerInfos {
	name?: string
	birthName?: string
	birthdate?: string
	patientStatus?: string
	patientNir?: string
	patientSystem?: string
	patientOrganism?: string
	moreInformationHref?: string
	moreInformationTo?: RouteLocationRaw
	patientDoctorInfos?: string
	noMoreInformation?: boolean
	noPatientChange?: boolean
}
