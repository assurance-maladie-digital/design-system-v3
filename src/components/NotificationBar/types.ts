export interface Notification {
	id: string
	message: string
	type: 'info' | 'success' | 'warning' | 'error'
	timeout?: number
	icon?: string | null
}
