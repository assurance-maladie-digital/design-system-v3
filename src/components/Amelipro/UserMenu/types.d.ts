import type { UserMenuDetailsInfos } from './UserMenuDetails/types'

export interface UserMenuInfos {
	lastConnexion?: string
	logout?: CallableFunction
	account?: CallableFunction
	updateSelectionStructure?: CallableFunction
	userMenuDetailsInfos?: UserMenuDetailsInfos
}
