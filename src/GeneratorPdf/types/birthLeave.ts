/** Données du PDF phase 2. Dates au format YYYY-MM-DD ; chaîne vide pour une valeur absente. */
export interface BirthLeaveForm {
	declarationDate: string
	employerName: string
	siret: string
	employerContact: string
	socialSecurityNumber: string
	employeeLastName: string
	employeeFirstName: string
	childBirthDate: string
	childLastName: string
	childFirstName: string
	secondChildFirstName: string
	thirdChildFirstName: string
	leaveMode: 'continuous' | 'fractional'
	firstMonthStart: string
	fractionalPeriod: '' | 'first' | 'second'
	fractionalStart: string
	conventionalLeaveStart: string
	conventionalLeaveEnd: string
}
