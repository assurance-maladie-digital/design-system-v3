declare module '*.svg' {
	const content: string
	export default content
}

declare module '*.mdx' {
	import type { ComponentOptions } from 'vue'
	const component: ComponentOptions
	export default component
}
