/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentObjectPropsOptions, PropOptions } from 'vue'
import { ComponentMountingOptions } from '@vue/test-utils'
import type { ComponentProps } from 'vue-component-type-helpers'

interface HTMLAttributes {
	'alt'?: string
	'aria-level'?: string
	'aria-required'?: boolean
	'checked'?: boolean
	'class'?: string
	'disabled'?: boolean
	'download'?: string
	'href'?: string
	'id'?: string
	'max-width'?: string
	'min-width'?: string
	'name'?: string
	'onclick'?: () => void
	'onchange'?: () => void
	'placeholder'?: string
	'readonly'?: boolean
	'src'?: string
	'style'?: string
	'title'?: string
	'type'?: string
	'value'?: string
	'width'?: string
	// Ajoutez d'autres attributs HTML selon vos besoins
}

type Data = Record<string, unknown>
type DefaultFactory<T> = (props: Data) => T | null | undefined

export interface PropOptions<T = any, D = T> {
	type?: PropType<T> | true | null
	required?: boolean
	default?: D | DefaultFactory<D> | null | undefined | object
	validator?(value: unknown, props: Data): boolean
}

export type PropOption<T, D = T> = PropOptions<T, D> & {
	type: NonNullable<PropOptions<T, D>['type']>
	required: NonNullable<PropOptions<T, D>['required']>
	default: NonNullable<PropOptions<T, D>['default']>
}

export interface PreparedExpectedData {
	defaultValue: any // Valeur définie dans "default" des propOptions
	defaultValueType: string // Type de la valeur définie dans "default" des propOptions
	expectedValue: any // Valeur attendue
	isRequired: boolean
	type: any // Type tel que défini dans propOptions
	typeLabel: string // Version facile à lire du type défini dans propOptions
}

export type DefaultProp = string | boolean | undefined
export type PropValues = Record<string, any>

export interface TUnitTestParams<C> extends ComponentMountingOptions<C> {
	expectedPropOptions: ExpectedPropOptions<typeof C>
	modifiedPropValues: () => ComponentProps<typeof C>
	requiredPropValues: () => ComponentProps<typeof C>
	vuetify?: any
	mountOptions?: Record<string, any> // Ajout pour permettre le passage d'options personnalisées à mount/shallowMount
}

// type ExtractProps<O> = O extends { $props: infer P } ? P : never;
// type ConvertProps<T> = {
//	[K in keyof T]: T[K] extends Prop<infer V> ? V : T[K];
// };
// type ExtractPropOptions<T> = {
//	[K in keyof T]: T[K] extends Prop<infer V> ? V : T[K];
// };

// export type ExpectedPropOptions<T> = ComponentObjectPropsOptions<ExtractProps<InstanceType<T>>>;
// export type ExpectedPropOptions<T> = ComponentObjectPropsOptions<InstanceType<T>['$props']>;
// export type ExpectedPropOptions<T> = ComponentObjectPropsOptions<ConvertProps<ComponentProps<T>>>;
// export type ExpectedPropOptions<T> = ComponentObjectPropsOptions<ComponentProps<T>>;
export type ExpectedPropOptions<T> = ComponentObjectPropsOptions<ComponentProps<T>>
// export type ExpectedPropOptions<T> = PropOptions<T>;
// export type ExpectedPropOptions<T> = ExtractPropOptions<ComponentProps<T>>;
// export type ExpectedPropOptions<T> = ExtractPropOptions<ExtractProps<InstanceType<T>>>;
// export type ExpectedPropOptions<T> = ComponentObjectPropsOptions<ExtractProps<InstanceType<T>>>;

// Nouveau

// Cas 'a'
export type PropCas1<C> = keyof ComponentProps<C>
// Cas ['a', 'b']
export type PropCas2<C, D = C> = [keyof ComponentProps<C>, keyof ComponentProps<D>]
// Cas [['a1', 'a2'], 'b']
export type PropCas3<C, D = C> = [(keyof ComponentProps<C>)[], keyof ComponentProps<D>]
// Cas [{
//			keys: cas 1 ou 2 ou 3
//			values: [any, any][]
//		}]
export interface TestPropData<C, D = C> {
	keys: PropCas1<C> | PropCas2<C, D> | PropCas3<C, D>
	values: [any, any][]
}
export type TestPropsData<C, D = C> = PropCas1<C> | PropCas2<C, D> | PropCas3<C, D> | TestPropData<C, D>

// Cas 'a'
export type AttributeCas1<C> = keyof ComponentProps<C>
// Cas ['a', 'b']
export type AttributeCas2<C> = [keyof ComponentProps<C>, keyof HTMLAttributes]
// Cas [['a1', 'a2'], 'b']
export type AttributeCas3<C> = [(keyof ComponentProps<C>)[], keyof HTMLAttributes]
// Cas [{
//			keys: cas 1 ou 2 ou 3
//			values: [any, any][]
//		}]
export interface TestAttributeData<C> {
	keys: AttributeCas1<C> | AttributeCas2<C> | AttributeCas3<C>
	values: [any, any][]
}

export type TestAttributesData<C> = AttributeCas1<C> | AttributeCas2<C> | AttributeCas3<C> | TestAttributeData<C>

export interface TestData<C, D = C> {
	// forcedValues?: ComponentProps<C>;
	// fullMount?: boolean;
	attributesFinder?: (key: keyof HTMLAttributes) => any
	propsFinder?: (key: keyof ComponentProps<D>) => any
	toAttributes?: TestAttributesData<C>[]
	toProps?: TestPropsData<C, D>[]
}
