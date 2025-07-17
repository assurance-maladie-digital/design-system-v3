import type { Service } from './ServiceBtn/types'

export interface IServiceMenuInfos {
	icon?: string
	messageToDisplay?: string
	servicesContact?: Service[]
	servicesPatient?: Service[]
	servicesPs: Service[]
	uniqueId: string
}
export interface ServiceMenuInfos extends IServiceMenuInfos {
	value: boolean
}
