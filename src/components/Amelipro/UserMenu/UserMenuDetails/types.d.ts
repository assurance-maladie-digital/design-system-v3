export interface UserMenuDetailsInfos {
	userName?: string
	profil?: string
	denomination?: string
	rpps?: string
	adeli?: string
	am?: string
	finess?: string
	email?: string
	adresse?: IAdresse
}

export interface IAdresse {
	numero?: string
	complement?: string
	type?: string
	nom?: string
	codePostal?: string
	commune?: string
}
