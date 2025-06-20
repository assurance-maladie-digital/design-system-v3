import { defineAsyncComponent, markRaw, shallowRef } from 'vue'

const loadedComponents = shallowRef<Record<string, unknown>>({})

export default function getFilterComponent(filterType?: string, filterOptions?: unknown) {
	// Déterminer le type de composant à charger
	let componentType = 'text'

	if (filterType === 'select' || filterOptions) {
		componentType = 'select'
	}
	else if (filterType === 'date') {
		componentType = 'date'
	}
	else if (filterType === 'period') {
		componentType = 'period'
	}
	else if (filterType === 'number') {
		componentType = 'number'
	}

	// Si le composant est déjà chargé, le retourner
	if (loadedComponents.value[componentType]) {
		return loadedComponents.value[componentType]
	}

	// Sinon, charger le composant de manière asynchrone
	let asyncComponent
	switch (componentType) {
		case 'select':
			asyncComponent = markRaw(defineAsyncComponent(() => import('./SelectFilter.vue')))
			Object.defineProperty(asyncComponent, 'name', { value: 'SelectFilter' })
			break
		case 'date':
			asyncComponent = markRaw(defineAsyncComponent(() => import('./DateFilter.vue')))
			Object.defineProperty(asyncComponent, 'name', { value: 'DateFilter' })
			break
		case 'period':
			asyncComponent = markRaw(defineAsyncComponent(() => import('./PeriodFilter.vue')))
			Object.defineProperty(asyncComponent, 'name', { value: 'PeriodFilter' })
			break
		case 'number':
			asyncComponent = markRaw(defineAsyncComponent(() => import('./NumberFilter.vue')))
			Object.defineProperty(asyncComponent, 'name', { value: 'NumberFilter' })
			break
		default:
			asyncComponent = markRaw(defineAsyncComponent(() => import('./TextFilter.vue')))
			Object.defineProperty(asyncComponent, 'name', { value: 'TextFilter' })
	}

	// Stocker le composant pour éviter de le recharger
	loadedComponents.value[componentType] = asyncComponent
	return asyncComponent
}
