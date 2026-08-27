/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Component } from 'vue'

/**
 * Génère une valeur factice cohérente avec le type de prop attendu par Vue.
 */
export const generateStubValue = (type: any): any => {
	if (Array.isArray(type)) {
		return generateStubValue(type[0])
	}
	switch (type) {
		case String:
			return 'stub-value'
		case Number:
			return 0
		case Boolean:
			return false
		case Array:
			return []
		case Object:
			return {}
		case Function:
			return (): void => {}
		case Date:
			return new Date('2024-01-01')
		default:
			return undefined
	}
}

/**
 * Construit un jeu de props minimal permettant de monter un composant
 * sans déclencher les avertissements Vue "missing required prop".
 */
export const generateRequiredProps = (component: Component): Record<string, unknown> => {
	const propsDef = (component as any)?.props ?? {}
	const values: Record<string, unknown> = {}

	for (const [name, definition] of Object.entries<any>(propsDef)) {
		const isRequired = typeof definition === 'object' && definition !== null && definition.required === true
		if (isRequired) {
			const type = typeof definition === 'object' && definition !== null ? definition.type : definition
			values[name] = generateStubValue(type)
		}
	}

	return values
}

/**
 * Détermine si une valeur exportée par la librairie est un composant Vue montable
 * (par opposition à un composable, une directive, un type ou une constante).
 */
export const isMountableComponent = (value: unknown): value is Component => {
	if (typeof value === 'function') {
		return false
	}
	if (typeof value !== 'object' || value === null) {
		return false
	}
	return 'render' in value || 'setup' in value || '__name' in value || 'template' in value
}
