/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Component } from 'vue'
import type { ExpectedPropOptions } from '@tests/types'
import type { ComponentProps } from 'vue-component-type-helpers'
import { testProperties } from './properties'
import { testSnapshots } from './snapshots'

export default class TestHelper<C extends Component> {
	private component: Component
	private expectedPropOptions: ExpectedPropOptions<C>
	private requiredPropValues: () => ComponentProps<C>
	private modifiedPropValues: () => ComponentProps<C>
	private mountOptions: Record<string, any> = {}

	constructor(component: Component) {
		this.component = component
		this.expectedPropOptions = {} as ExpectedPropOptions<C>
		this.requiredPropValues = () => ({} as ComponentProps<C>)
		this.modifiedPropValues = () => ({} as ComponentProps<C>)
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

	public modified = (prop: keyof ComponentProps<C>): any => this.modifiedPropValues()[prop]
	public default = (prop: keyof ComponentProps<C>): any => this.defaultFromValue(prop)

	private defaultFromValue = (from: keyof ComponentProps<C>): any => {
		const propOption = this.expectedPropOptions[from] as ComponentProps<C>
		return propOption.required ? this.requiredPropValues()[from] : propOption.default
	}
}
