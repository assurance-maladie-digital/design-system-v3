/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Component, ComponentInstance } from 'vue'
import type { ExpectedPropOptions, HTMLAttributes, TestAttributeData, TestAttributesData, TestData, TestPropData, TestPropsData } from '@tests/types'
import { expect, it } from 'vitest'
import type { ComponentProps } from 'vue-component-type-helpers'
import { VueWrapper } from '@vue/test-utils'
import { testProperties } from './properties'
import { testSnapshots } from './snapshots'
import { toKebabCase } from '@/utils/functions/amelipro/toKebabCase'
import { typeValueToString } from './utils'

export default class TestHelper<C extends Component> {
	private component: Component
	private expectedPropOptions: ExpectedPropOptions<C>
	private requiredPropValues: () => ComponentProps<C>
	private modifiedPropValues: () => ComponentProps<C>
	private vueWrapper: VueWrapper<ComponentInstance<C>>
	private mountOptions: Record<string, any> = {}

	constructor(component: Component) {
		this.component = component
		this.expectedPropOptions = {} as ExpectedPropOptions<C>
		this.requiredPropValues = () => ({} as ComponentProps<C>)
		this.modifiedPropValues = () => ({} as ComponentProps<C>)
		this.vueWrapper = {} as VueWrapper<ComponentInstance<C>>
	}

	public setMountOptions = (mountOptions: Record<string, any>): TestHelper<C> => {
		this.mountOptions = mountOptions
		return this
	}

	public setExpectedPropOptions = (expectedPropOptions: typeof this.expectedPropOptions): TestHelper<C> => {
		this.expectedPropOptions = expectedPropOptions
		return this
	}

	public setRequiredPropValues = (requiredPropValues: typeof this.requiredPropValues): TestHelper<C> => {
		this.requiredPropValues = requiredPropValues
		return this
	}

	public setModifiedPropValues = (modifiedPropValues: typeof this.modifiedPropValues): TestHelper<C> => {
		this.modifiedPropValues = modifiedPropValues
		return this
	}

	/**
	 * @deprecated
	 */
	public setWrapper = (vueWrapper: VueWrapper<ComponentInstance<C>>): TestHelper<C> => {
		this.vueWrapper = vueWrapper
		return this
	}

	/**
	 * @deprecated
	 */
	public getWrapper = (): VueWrapper<ComponentInstance<C>> => this.vueWrapper

	public snapshots = (): void => {
		testSnapshots(this.component, {
			expectedPropOptions: this.expectedPropOptions,
			modifiedPropValues: this.modifiedPropValues,
			mountOptions: this.mountOptions,
			requiredPropValues: this.requiredPropValues,
		})
	}

	public properties = (): void => {
		testProperties(this.component, {
			expectedPropOptions: this.expectedPropOptions,
			modifiedPropValues: this.modifiedPropValues,
			mountOptions: this.mountOptions,
			requiredPropValues: this.requiredPropValues,
		})
	}

	/**
	 * @deprecated
	 */
	public testTarget = <D = C>(
		testData: TestData<C, D>,
	): void => {
		if (testData.toAttributes) {
			if (!testData.attributesFinder) {
				throw new Error('Ajouter un finder pour les attributs')
			}
			this.targetAttributes(testData.attributesFinder, testData.toAttributes)
		}

		if (testData.toProps) {
			if (!testData.propsFinder) {
				throw new Error('Ajouter un finder pour les attributs')
			}
			this.targetProps(testData.propsFinder, testData.toProps)
		}
	}

	public modified = (prop: keyof ComponentProps<C>): any => this.modifiedPropValues()[prop]
	public default = (prop: keyof ComponentProps<C>): any => this.defaultFromValue(prop)

	/**
	 * @deprecated
	 */
	private targetAttributes = <D = C>(
		targetFinder: (key: keyof HTMLAttributes) => any,
		testData: TestAttributesData<C>[],
	): void => {
		testData.forEach((data) => {
			const {
				fromKeys,
				fromLabel,
				fromValues,
				to,
			} = this.prepareData<D>(data)

			fromValues?.forEach((pair: [any, any]) => {
				const [fromValue, expectedToValue] = pair
				it(`prop ${fromLabel} sets attribute ${to}, using value(s) '${fromValue}'`, async () => {
					await this.vueWrapper.setProps(this.preparePropsData(fromKeys, fromValue))
					this.testAttribute(typeValueToString(expectedToValue), targetFinder(toKebabCase(to) as keyof HTMLAttributes), expectedToValue)
				})
			})
		})
	}

	/**
	 * @deprecated
	 */
	private targetProps = <D = C>(
		targetFinder: (prop: any) => unknown,
		testData: TestPropsData<C, D>[],
	): void => {
		testData.forEach((data) => {
			const {
				fromKeys,
				fromLabel,
				fromValues,
				to,
			} = this.prepareData<D>(data)
			fromValues?.forEach((pair: [any, any]) => {
				const [fromValue, expectedToValue] = pair
				it(`prop ${fromLabel} sets prop ${to}, using value(s) '${fromValue}'`, async () => {
					const preparedPropsData = this.preparePropsData(fromKeys, fromValue)
					await this.vueWrapper.setProps(preparedPropsData)
					this.testProp(typeValueToString(expectedToValue), targetFinder(to as keyof ComponentProps<D>), expectedToValue)
				})
			})
		})
	}

	/**
	 * @deprecated
	 */

	private prepareData = <D = C>(data: TestAttributesData<C> | TestPropsData<C, D>) => {
		// Props en entrée, props ou attributs en sortie
		let from: keyof ComponentProps<C> | (keyof ComponentProps<C>)[],
			to: keyof ComponentProps<C> | keyof HTMLAttributes

		// Liste des valeurs des props en entrées : valeurs custom ou valeur actuelle du wrapper ?
		let fromValues: TestAttributeData<C>['values'] | TestPropData<C, D>['values']

		if (typeof data === 'string') {
			// Cas 'a' => { from: 'a', to: 'a' }
			from = data
			// from: keyof ComponentProps<C>
			to = data
			// to: keyof ComponentProps<C> | keyof HTMLAttributes

			// Préparation automatique des valeurs par défaut et modifiées
			const defaultFromValue = this.defaultFromValue(from)
			const modifiedFromValue = this.modifiedPropValues()[from]
			fromValues = [
				// Valeurs par défaut, identiques en entrées et en sortie
				[defaultFromValue, defaultFromValue],
				// Valeurs modifiée, identiques en entrées et en sortie
				[modifiedFromValue, modifiedFromValue],
			]
		}
		else if (Array.isArray(data)) {
			// Cas ['a', 'b'] => { from: 'a', to: 'b' }
			// Cas [['a1', 'a2'], 'b'] => { from: ['a1', 'a2'], to: 'b' }
			from = data[0]
			to = data[1]

			if (typeof from === 'string') {
				// Préparation automatique des valeurs par défaut et modifiées
				const defaultFromValue = this.defaultFromValue(from)
				const modifiedFromValue = this.modifiedPropValues()[from]
				fromValues = [
					// Valeurs par défaut, identiques en entrées et en sortie
					[defaultFromValue, defaultFromValue],
					// Valeurs modifiée, identiques en entrées et en sortie
					[modifiedFromValue, modifiedFromValue],
				]
			}
			else {
				throw new Error('Ce cas ne peut être traité automatiquement. Utiliser le format { keys: [[keyA1, keyA2], keyB], values: [[valueA1, valueA2], valueB] }')
			}
		}
		else if (typeof data === 'object') {
			if (Array.isArray(data.keys)) {
				// { keys: ['a', 'b'], values: [?, ?] } => { from: 'a', to: 'b' }
				// { keys: [['a1', 'a2'], 'b'], values: [?, ?] } => { from: ['a1', 'a2'], to: 'b' }
				from = data.keys[0]
				to = data.keys[1]
			}
			else {
				// { keys: 'a', values: [?, ?] } => { from: 'a', to: 'a' }
				from = data.keys
				to = data.keys
			}
			// Préparation manuelle à partir des valeurs fournies en paramètre
			fromValues = data.values
		}
		else {
			throw new Error('Format de données test non reconnu')
		}

		// Liste des props en entrées, pour affichage dans les messages de test
		const fromLabel = Array.isArray(from) ? `[${String(from)}]` : String(from)

		// Liste des props en entrées, pour utilisation dans le code
		const fromKeys: string[] = Array.isArray(from) ? from as string[] : [String(from)]

		return {
			fromKeys,
			fromLabel,
			fromValues,
			to: String(to),
		}
	}

	private defaultFromValue = (from: keyof ComponentProps<C>): any => {
		const propOption = this.expectedPropOptions[from] as ComponentProps<C>
		return propOption.required ? this.requiredPropValues()[from] : propOption.default
	}

	/**
	 * @deprecated
	 */
	private preparePropsData = (fromKeys: string[], fromValue: any): Record<string, any> => fromKeys.reduce((propsData, propKey, dataIndex) => {
		propsData[String(propKey)] = fromKeys.length > 1 ? fromValue[dataIndex] : fromValue
		return propsData
	}, {} as Record<string, any>)

	/**
	 * @deprecated
	 */
	// Les attributs undefined ou null ne sont pas ajoutés au DOM du composant => undefined
	// Les attributs booleen => "true" ou "false"
	private testAttribute = (valueType: string, actual: any, expected: any): void => {
		if (valueType === 'undefined') {
			expect(actual).toBeUndefined()
		}
		else if (valueType === 'null') {
			expect(actual).toBeUndefined()
		}
		else if (valueType === 'function') {
			expect(actual()).toBe(expected())
		}
		else if (valueType === 'boolean') {
			expect(actual).toBe(String(expected))
		}
		else {
			expect(actual).toBe(expected)
		}
	}

	/**
	 * @deprecated
	 */
	private testProp = (valueType: string, actual: any, expected: any): void => {
		if (valueType === 'array') {
			expect(actual).toEqual(expected)
		}
		else {
			expect(actual).toBe(expected)
		}
	}
}
