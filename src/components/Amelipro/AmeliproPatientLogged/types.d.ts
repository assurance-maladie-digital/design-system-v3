import { SelectItem } from '../AmeliproSelect/types'

export interface IPatientInfos {
	birthdate?: string
	center?: string
	exemptionDialogBtnText?: string
	firstName?: string
	name?: string
	nir?: string
	rank?: string
	fund?: string
	fundTooltip?: string
	doctor?: string
	doctorTooltip?: string
	exemption?: string
	exemptionLine2?: string
	plan?: string
	rights?: string
	c2s?: string
	c2sTooltip?: string
	ame?: string
	mtm?: string
	selectItems?: SelectItem[]
}

export interface IPatientInfoLabels {
	ame: string
	birthdate: string
	btnLabel: string
	center: string
	c2s: string
	doctor: string
	doctorDialogBtn: string
	doctorDialogTitle: string
	exemption: string
	exemptionDialogTitle: string
	exemptionLine2: string
	firstName: string
	fund: string
	fundDialogTitle: string
	moreInfo: string
	mtm: string
	name: string
	nir: string
	plan: string
	rank: string
	rights: string
	selectLabel: string
}
