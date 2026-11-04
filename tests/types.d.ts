/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentObjectPropsOptions } from 'vue'
import { ComponentMountingOptions } from '@vue/test-utils'
import type { ComponentProps } from 'vue-component-type-helpers'

type Data = Record<string, unknown>
type DefaultFactory<T> = (props: Data) => T | null | undefined

interface PropOptions<T = any, D = T> {
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
