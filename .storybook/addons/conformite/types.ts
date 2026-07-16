export type StatutResult = {
	component: string
	componentCategory: string
	story: string
	doc: string
	sourceCode: string
	requiredStories: string
	usagePage: string
	visualTheme: string
	playground: string
	criticality: string
	score: number
}

export type ConformitePanelProps = {
	active?: boolean
}
