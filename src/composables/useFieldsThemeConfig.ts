import { type ComputedRef, type MaybeRefOrGetter, type Ref, computed, getCurrentInstance, inject, toValue } from 'vue'
import { toKebabCase } from '@/designTokens/utils/toKebabCase'
import { FIELDS_DEFAULTS_KEY } from '@/themeConfig/constants'
import type { SynapseFieldDensity, SynapseFieldsConfig, SynapseFieldVariant } from '@/themeConfig/types'

// Clé d'injection des `defaults` Vuetify (symbole global enregistré par Vuetify : `Symbol.for('vuetify:defaults')`).
const VUETIFY_DEFAULTS_KEY = Symbol.for('vuetify:defaults')

export interface UseFieldsThemeConfig {
	/** Réglages `fields` de la configuration de thème du projet (vide si le projet ne les renseigne pas). */
	themeFields: ComputedRef<Partial<SynapseFieldsConfig>>
	/** Indique si le parent a passé la prop explicitement (une valeur `undefined` compte comme absente). */
	isPropExplicit: (name: string) => boolean
	/** `variant` à appliquer : prop explicite, sinon réglage du projet, sinon valeur de la prop (son défaut). */
	resolveVariant: <T extends string | undefined>(propName: string, value: MaybeRefOrGetter<T>) => ComputedRef<T | SynapseFieldVariant>
	/** `density` à appliquer : prop explicite, sinon réglage du projet, sinon valeur de la prop (son défaut). */
	resolveDensity: <T extends string | undefined>(propName: string, value: MaybeRefOrGetter<T>) => ComputedRef<T | SynapseFieldDensity>
}

/**
 * Applique aux champs Synapse les réglages `fields` de la configuration de thème
 * (`createVuetifyOptions({ fields: { variant, density } })`).
 *
 * Les champs Synapse passent leur `variant` et leur `density` explicitement au composant Vuetify :
 * les `defaults` Vuetify ne les atteignent donc pas. Ce composable lit les réglages du projet
 * et les applique uniquement quand la prop n'a pas été passée par le parent :
 * une prop explicite reste toujours prioritaire, et sans configuration le rendu est inchangé.
 *
 * Un composant qui encapsule un autre champ Synapse transmet la valeur résolue (ou `undefined`
 * pour laisser le champ enfant la résoudre lui-même).
 */
export function useFieldsThemeConfig(): UseFieldsThemeConfig {
	const instance = getCurrentInstance()
	const defaults = inject<Ref<Record<string, unknown> | undefined> | null>(VUETIFY_DEFAULTS_KEY, null)

	const themeFields = computed<Partial<SynapseFieldsConfig>>(() => {
		const fields = defaults?.value?.[FIELDS_DEFAULTS_KEY]
		return typeof fields === 'object' && fields !== null ? fields as Partial<SynapseFieldsConfig> : {}
	})

	const isPropExplicit = (name: string): boolean => {
		const vnodeProps = instance?.vnode.props
		if (!vnodeProps) {
			return false
		}
		return vnodeProps[name] !== undefined || vnodeProps[toKebabCase(name)] !== undefined
	}

	const resolveVariant = <T extends string | undefined>(propName: string, value: MaybeRefOrGetter<T>) => computed<T | SynapseFieldVariant>(() =>
		isPropExplicit(propName) ? toValue(value) : themeFields.value.variant ?? toValue(value),
	)

	const resolveDensity = <T extends string | undefined>(propName: string, value: MaybeRefOrGetter<T>) => computed<T | SynapseFieldDensity>(() =>
		isPropExplicit(propName) ? toValue(value) : themeFields.value.density ?? toValue(value),
	)

	return { themeFields, isPropExplicit, resolveVariant, resolveDensity }
}
