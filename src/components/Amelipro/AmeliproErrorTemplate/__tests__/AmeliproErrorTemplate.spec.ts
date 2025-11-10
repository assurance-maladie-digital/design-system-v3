import type { ExpectedPropOptions } from '@tests/types'
import { VueWrapper, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import AmeliproErrorTemplate from '../AmeliproErrorTemplate.vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { PropType } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import TestHelper from '@tests/helpers/TestHelper'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproErrorTemplate> = {
	btnHref: {
		type: String,
		default: undefined,
	},
	btnTo: {
		type: [Array, Object, String] as PropType<RouteLocationRaw>,
		default: undefined,
	},
	customBtnText: {
		type: String,
		default: undefined,
	},
	customContentText: {
		type: String,
		default: undefined,
	},
	customContentTitle: {
		type: String,
		default: undefined,
	},
	customImgUrl: {
		type: String,
		default: undefined,
	},
	customTitleText: {
		type: String,
		default: undefined,
	},
	errorType: {
		type: String,
		required: true,
	},
	imgMinWidth: {
		type: String,
		default: '200',
	},
	imgWidth: {
		type: String,
		default: '200',
	},
	noButton: {
		type: Boolean,
		default: false,
	},
	uniqueId: {
		type: String,
		default: undefined,
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproErrorTemplate> => ({ errorType: 'disconnect' })

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproErrorTemplate> => ({
	btnHref: '#',
	btnTo: '/home',
	customBtnText: 'bouton',
	customContentText: 'content text',
	customContentTitle: 'content title',
	customImgUrl: 'custom-img-url',
	customTitleText: 'title',
	errorType: 'error404',
	imgMinWidth: '300',
	imgWidth: '350',
	noButton: true,
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(AmeliproErrorTemplate)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproErrorTemplate', () => {
	let vueWrapper: VueWrapper<InstanceType<typeof AmeliproErrorTemplate>>

	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('setting props should update props of inner components', () => {
		describe('Main > #image > img', () => {
			beforeEach(() => {
				// Slots => mount
				vueWrapper = mount(AmeliproErrorTemplate, { props: requiredPropValues() })
			})

			it('img attributes reflect props (min/max/width and src when customImgUrl provided)', async () => {
				const img = () => vueWrapper.find('.amelipro-error-template__img')

				// defaults
				expect(img().attributes('min-width')).toBe(testHelper.default('imgMinWidth'))
				expect(img().attributes('max-width')).toBe(testHelper.default('imgWidth'))
				expect(img().attributes('width')).toBe(testHelper.default('imgWidth'))

				// set modified props (including customImgUrl)
				const modified = modifiedPropValues()
				await vueWrapper.setProps(modified)

				expect(img().attributes('min-width')).toBe(testHelper.modified('imgMinWidth'))
				expect(img().attributes('max-width')).toBe(testHelper.modified('imgWidth'))
				expect(img().attributes('width')).toBe(testHelper.modified('imgWidth'))

				// customImgUrl should map to src when provided
				expect(img().attributes('src')).toBe(testHelper.modified('customImgUrl'))
			})
		})
	})

	describe('Functions', () => {
		// loadGlobalData ne se réexécute pas si errorType change.
		// Il faut recréer un wrapper différent pour chaque test
		it('tests loadGlobalData for error 401', () => {
			vueWrapper = mount(AmeliproErrorTemplate, { props: requiredPropValues() })

			expect(vueWrapper.find('.amelipro-error-template__title').text()).toBe('Déconnexion')
			expect(vueWrapper.find('.amelipro-error-template__content__text p').text()).toBe('Merci pour votre visite, à très bientôt !')
			expect(vueWrapper.find('.amelipro-error-template-content-title').text()).toBe('Vous êtes déconnecté(e)')
			expect(vueWrapper.find('button').text()).toBe('Page d’accueil')
		})

		it('tests loadGlobalData for error 404', () => {
			vueWrapper = mount(AmeliproErrorTemplate, {
				props: {
					...requiredPropValues(),
					errorType: 'error404',
				},
			})

			expect(vueWrapper.exists()).toBe(true)
			expect(vueWrapper.find('.amelipro-error-template__title').text()).toBe('Erreur 404')
			expect(vueWrapper.find('.amelipro-error-template__content__text p').text()).toBe('La page que vous essayez d’afficher n’existe plus ou a été déplacée.')
			expect(vueWrapper.find('.amelipro-error-template-content-title').text()).toBe('Page non trouvée ou inexistante - Erreur 404')
			expect(vueWrapper.find('button').text()).toBe('Page d’accueil')
		})
	})

	describe('Events', () => {
		it('test emitClickEvent', async () => {
			vueWrapper = mount(AmeliproErrorTemplate, {
				props: {
					...requiredPropValues(),
					errorType: 'error404',
				},
			})

			expect(vueWrapper.emitted('click')).toStrictEqual(undefined)
			await vueWrapper.find('button').trigger('click')
			expect(vueWrapper.emitted('click')).toStrictEqual([[]])
		})
	})
})
