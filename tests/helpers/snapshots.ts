/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, it } from 'vitest'
import type { TUnitTestParams } from '@tests/types'
import { shallowMount } from '@vue/test-utils'

/**
 * Vérifie les snapshots
 *
 * @param component Le composant à Tester
 * @param params Les paramètres nécessaires à l'éxécution des tests
 */

export const testSnapshots = <C>(component: any, params: TUnitTestParams<C>): void => {
	it('renders the component with only required properties filled in', () => {
		const mountOptions = params.mountOptions || {}
		const vueWrapper = shallowMount(component, {
			props: params.requiredPropValues(),
			...mountOptions,
			global: {
				...(mountOptions.global || {}),
				plugins: params.vuetify ? [params.vuetify] : (mountOptions.global?.plugins || []),
			},
		})

		expect(vueWrapper.exists()).toBe(true)
		expect(vueWrapper.html()).toMatchSnapshot()
	})

	it('renders the component with all properties filled in', () => {
		const mountOptions = params.mountOptions || {}
		const vueWrapper = shallowMount(component, {
			props: {
				...params.requiredPropValues(),
				...(params.modifiedPropValues ? params.modifiedPropValues() : {}),
			},
			...mountOptions,
			global: {
				...(mountOptions.global || {}),
				plugins: params.vuetify ? [params.vuetify] : (mountOptions.global?.plugins || []),
			},
		})

		expect(vueWrapper.exists()).toBe(true)
		expect(vueWrapper.html()).toMatchSnapshot()
	})
}
