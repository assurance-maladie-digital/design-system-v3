import componentInfo from '@/stories/Demarrer/component-info.json'
import accessibilityHistory from '../../../scripts/data/a11y-history-data.json'

const componentAliases: Record<string, string> = {
	'DatePicker (mode calendrier)': 'DatePicker/CalendarMode',
	'ComplexDatePicker (mode combiné)': 'DatePicker/ComplexDatePicker',
	'DateTextInput (saisie manuelle)': 'DatePicker/DateTextInput',
	'HeaderNavigation': 'HeaderNavigationBar',
}

const normalizeComponentName = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]/g, '')

export const resolveA11yVersion = (componentName: string): string | undefined => {
	const lookupName = componentAliases[componentName] || componentName
	const normalizedName = normalizeComponentName(lookupName)
	const info = componentInfo.results.find(entry => (
		normalizeComponentName(entry.componentName) === normalizedName
	))
	const history = accessibilityHistory[lookupName] || accessibilityHistory[componentName]
	const version = info?.a11yVersion || history?.version

	return version ? `Dernière mise à jour accessibilité : V${version}` : undefined
}
