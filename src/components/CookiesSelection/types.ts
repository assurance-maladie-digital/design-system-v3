export type CookieTypes = 'essentials' | 'functional' | 'analytics'

export type CookiesItems = {
	[key in CookieTypes]?: Cookie[]
}

export type Preferences = {
	[key in CookieTypes]: boolean | undefined
}

export interface Cookie {
	name: string
	description?: string
	conservation: string
}
