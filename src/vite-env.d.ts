/// <reference types="vite/client" />

interface ImportMeta {
	readonly env: {
		readonly VITEST?: boolean
		readonly MODE: string
		readonly BASE_URL: string
		readonly PROD: boolean
		readonly DEV: boolean
		[key: string]: string | boolean | undefined
	}
}
