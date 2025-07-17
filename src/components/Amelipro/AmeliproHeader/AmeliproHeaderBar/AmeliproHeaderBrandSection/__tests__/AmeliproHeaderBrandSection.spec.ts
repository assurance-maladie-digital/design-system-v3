import { type RouteLocationRaw, RouterLink } from 'vue-router'
import { beforeEach, describe, expect, it } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import AmeliproHeaderBrandSection from '../AmeliproHeaderBrandSection.vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import type { PropType } from 'vue'
import TestHelper from '@tests/helpers/TestHelper'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproHeaderBrandSection> = {
	homeHref: {
		type: String,
		default: undefined,
	},
	homeLink: {
		type: [String, Boolean, Object] as PropType<RouteLocationRaw>,
		default: '/',
	},
	mobileVersion: {
		type: Boolean,
		default: false,
	},
	serviceSubTitle: {
		type: String,
		default: undefined,
	},
	serviceTitle: {
		type: String,
		default: undefined,
	},
	themeAmelipro: {
		type: Boolean,
		default: true,
	},
	uniqueId: {
		type: String,
		default: undefined,
	},
}

// Props requises
const requiredPropValues = (): ComponentProps<typeof AmeliproHeaderBrandSection> => ({})

// Props modifiées
const modifiedPropValues = (): ComponentProps<typeof AmeliproHeaderBrandSection> => ({
	homeHref: '/accueil',
	homeLink: '/accueil-link',
	mobileVersion: true,
	serviceSubTitle: 'Modified sub title',
	serviceTitle: 'Modified service title',
	themeAmelipro: false,
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(AmeliproHeaderBrandSection)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproHeaderBrandSection', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		let vueWrapper: ReturnType<typeof shallowMount>

		describe('root', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproHeaderBrandSection, { props: requiredPropValues() })
			})

			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.attributes('id')).toBe(undefined)

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.attributes('id')).toBe(`${testHelper.modified('uniqueId')}-container`)
			})
		})

		describe('Component', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproHeaderBrandSection, { props: requiredPropValues() })
			})
			it('prop homeHref sets <a> as root link', async () => {
				expect(vueWrapper.find('a.header-home-link').exists()).toBe(false)

				const { homeHref } = modifiedPropValues()
				await vueWrapper.setProps({ homeHref })
				expect(vueWrapper.find('a.header-home-link').exists()).toBe(true)
			})

			// TODO: corriger le rendu du Component
			it.skip('prop homeHref undefined uses RouterLink', () => {
				expect(vueWrapper.findComponent(RouterLink).exists()).toBe(true)
			})
		})

		// TODO: corriger le rendu du slot pour le titre
		describe.skip('Titre', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproHeaderBrandSection, { props: requiredPropValues() })
			})
			it('prop serviceTitle sets service title', async () => {
				expect(vueWrapper.find('h1.header-title').exists()).toBe(false)

				const { serviceTitle } = modifiedPropValues()
				await vueWrapper.setProps({ serviceTitle })
				expect(vueWrapper.find('h1.header-title').text()).toBe(testHelper.modified('serviceTitle'))
			})
		})

		// TODO: corriger le rendu du slot pour le sous-titre
		describe.skip('Sous-titre', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproHeaderBrandSection, { props: requiredPropValues() })
			})
			it('prop uniqueId sets attribute id', async () => {
				vueWrapper = mount(AmeliproHeaderBrandSection, {
					props: {
						...requiredPropValues(),
						serviceSubTitle: modifiedPropValues().serviceSubTitle,
						serviceTitle: modifiedPropValues().serviceTitle,
					},
				})
				expect(vueWrapper.find('h2.header-title').attributes('id')).toBe(undefined)

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('h2.header-title').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-container`)
			})

			it('prop serviceSubTitle sets subtitle', async () => {
				expect(vueWrapper.find('h2.header-title').exists()).toBe(false)

				const { serviceSubTitle, serviceTitle } = modifiedPropValues()
				// Sous-titre seul ne s'affiche pas
				await vueWrapper.setProps({ serviceSubTitle })
				expect(vueWrapper.find('h2.header-title').exists()).toBe(false)

				// Avec le titre, le sous-titre s'affiche
				await vueWrapper.setProps({ serviceTitle })
				expect(vueWrapper.find('h2.header-title').text()).toBe(testHelper.modified('serviceSubTitle'))
			})
		})

		describe('Logo', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproHeaderBrandSection, { props: requiredPropValues() })
			})
			it('prop themeAmelipro true displays logo', () => {
				vueWrapper = shallowMount(AmeliproHeaderBrandSection, { props: { ...requiredPropValues(), themeAmelipro: true } })
				expect(vueWrapper.find('img.logo-amelipro').exists()).toBe(true)
			})

			it('prop themeAmelipro false hides logo', () => {
				vueWrapper = shallowMount(AmeliproHeaderBrandSection, { props: { ...requiredPropValues(), serviceTitle: 'Titre', themeAmelipro: false } })
				expect(vueWrapper.find('img.logo-amelipro').exists()).toBe(false)
			})
		})
	})
})
