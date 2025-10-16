/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */

import type { Component, ComponentObjectPropsOptions } from 'vue'
import type { PreparedExpectedData, PropOption, PropValues, TUnitTestParams } from '@tests/types'
import { VueWrapper, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { propTypes, typeToString, typeValueToString } from './utils'
import type { ComponentProps } from 'vue-component-type-helpers'

const prepareExpectedData = <T, D = T>(propName: string, expectedPropOption: PropOption<T, D> | null, requiredPropValues: PropValues): PreparedExpectedData => {
	if (expectedPropOption === null) {
		throw new Error('expectedPropOption should not be null here')
	}

	const { type, typeLabel } = propTypes(expectedPropOption.type)
	const isRequired = Boolean(expectedPropOption.required)
	return {
		defaultValue: expectedPropOption.default,
		defaultValueType: typeValueToString(expectedPropOption.default),
		expectedValue: isRequired ? requiredPropValues[propName] : expectedPropOption.default,
		isRequired,
		type,
		typeLabel,
	}
}

export const definedProps = (vueWrapper: VueWrapper): Record<string, ComponentObjectPropsOptions> => vueWrapper.vm.$options.props

// Ajout de la prise en compte de mountOptions
export const testProperties = <C>(component: Component, params: TUnitTestParams<C>): void => {
	const mountOptions = params.mountOptions || {}
	// On fusionne les props requises avec les mountOptions éventuelles
	const vueWrapper = mount(component, {
		props: params.requiredPropValues(),
		...mountOptions,
		global: {
			...(mountOptions.global || {}),
			plugins: params.vuetify ? [params.vuetify] : (mountOptions.global?.plugins || []),
		},
	})

	// Vérifier le wrapper
	expectWrapperExists(vueWrapper)
	expectWrapperHasSameProps(vueWrapper, params.expectedPropOptions)
	testDefaultWrapperProperties(vueWrapper, params.expectedPropOptions, params.requiredPropValues())

	if (params.modifiedPropValues) {
		const modifiedPropValues = params.modifiedPropValues()
		testModifiedWrapperProperties(vueWrapper, modifiedPropValues)
	}
}

const expectWrapperExists = (vueWrapper: VueWrapper): void => {
	it('ensure that vueWrapper exists', () => {
		expect(vueWrapper.exists()).toBe(true)
	})
}

const expectWrapperHasSameProps = (vueWrapper: VueWrapper, passThroughData: Record<string, any>): void => {
	it('should have the same list of props', () => {
		expect(Object.keys(definedProps(vueWrapper))).toStrictEqual(Object.keys(passThroughData))
	})
}

const testDefaultWrapperProperties = (
	vueWrapper: VueWrapper<any>,
	expectedPropOptions: Record<string, PropOption<any, any>>,
	requiredPropValues: PropValues,
): void => {
	describe('test default wrapper properties', () => {
		// Liste des définitions des props
		const wrapperPropOptions = definedProps(vueWrapper)

		for (const [propName, expectedPropOption] of Object.entries(expectedPropOptions)) {
			const propValue = vueWrapper.props(propName)
			const expectedDefaultData = prepareExpectedData(propName, expectedPropOption, requiredPropValues)
			testDefaultProp(propName, propValue, wrapperPropOptions[propName], expectedDefaultData)
		}
	})
}

const testDefaultProp = <T, D = T>(propName: string, wrapperPropValue: any, wrapperPropOptions: PropOption<T, D> | null, expectedDefaultData: PreparedExpectedData): void => {
	describe(propName, () => {
		// Vérifier que le type de l'instance est conforme au type attendu
		it(`is of type ${expectedDefaultData.typeLabel}`, () => {
			expect(typeToString(wrapperPropOptions?.type)).toBe(typeToString(expectedDefaultData.type))
		})
		if (expectedDefaultData.isRequired) {
			it('is required', () => {
				expect(wrapperPropOptions?.required).toBe(true)
			})
			it('has no default value', () => {
				expect(wrapperPropOptions?.default).toBeUndefined()
			})
		}
		else {
			it('is not required', () => {
				expect(wrapperPropOptions?.required).toBeFalsy()
			})
			// Test de la valeur par défaut
			it(`has default value set to <${expectedDefaultData.defaultValueType}>"${expectedDefaultData.defaultValue}"`, () => {
				if (expectedDefaultData.defaultValueType === 'undefined') {
					expect(wrapperPropOptions?.default).toBeUndefined()
					expect(wrapperPropValue).toBeUndefined()
				}
				else if (expectedDefaultData.defaultValueType === 'null') {
					expect(wrapperPropOptions?.default).toBe(expectedDefaultData.defaultValue)
					expect(wrapperPropValue).toBe(expectedDefaultData.defaultValue)
				}
				else if (expectedDefaultData.defaultValueType === 'function') {
					expect(wrapperPropOptions?.default()).toStrictEqual(expectedDefaultData.defaultValue())
					// expect(wrapperPropValue).toBe(expectedDefaultData.defaultValue);
				}
				else {
					expect(wrapperPropOptions?.default).toBe(expectedDefaultData.defaultValue)
					expect(wrapperPropValue).toBe(expectedDefaultData.defaultValue)
				}
			})
		}
	})
}

const testModifiedWrapperProperties = <T>(vueWrapper: VueWrapper<any>, modifiedPropValues: Partial<ComponentProps<T>>): void => {
	describe('test modified wrapper properties', async () => {
		await vueWrapper.setProps(modifiedPropValues)

		for (const [propName, expectedNewPropValue] of Object.entries(modifiedPropValues) as [keyof ComponentProps<T>, any][]) {
			describe(propName as string, () => {
				const newValue = vueWrapper.props(propName as string) // Cast propName to string

				if (typeValueToString(expectedNewPropValue) === 'function') {
					const expectedValueResult = (expectedNewPropValue as Function)()
					if (typeValueToString(expectedValueResult) === 'array' || typeValueToString(expectedValueResult) === 'object') {
						it(`has new value successfully set to <function> returning ${typeValueToString(expectedValueResult)}`, () => {
							expect((newValue as Function)()).toStrictEqual(expectedValueResult)
						})
					}
					else {
						it(`has new value successfully set to <function> returning ${typeValueToString(expectedValueResult)}`, () => {
							expect((newValue as Function)()).toBe(expectedValueResult)
						})
					}
				}
				else if (typeValueToString(expectedNewPropValue) === 'array') {
					it(`has new value successfully set to <array> of length ${(expectedNewPropValue as any[]).length}`, () => {
						expect(newValue).toStrictEqual(expectedNewPropValue)
					})
				}
				else if (typeValueToString(expectedNewPropValue) === 'object') {
					if (expectedNewPropValue === null) {
						it('has new value successfully set to <object>"null"', () => {
							expect(newValue).toStrictEqual(expectedNewPropValue)
						})
					}
					else {
						it(`has new value successfully set to <object> of length ${Object.keys(expectedNewPropValue as object).length}`, () => {
							expect(newValue).toStrictEqual(expectedNewPropValue)
						})
					}
				}
				else {
					it(`has new value successfully set to <${typeValueToString(expectedNewPropValue)}>"${expectedNewPropValue}"`, () => {
						expect(newValue).toBe(expectedNewPropValue)
					})
				}
			})
		}
	})
}
