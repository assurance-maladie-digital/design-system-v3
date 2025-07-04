import { VueWrapper, mount, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import AmeliproIcon from '../AmeliproIcon.vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import TestHelper from '@tests/helpers/TestHelper'
import { VIcon } from 'vuetify/components'
import { attachToApp } from '@tests/helpers/utils'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproIcon> = {
	borderColor: {
		type: String,
		default: undefined,
	},
	bordered: {
		type: Boolean,
		default: false,
	},
	icon: {
		type: String,
		default: undefined,
	},
	iconBgColor: {
		type: String,
		default: 'transparent',
	},
	iconColor: {
		type: String,
		required: true,
	},
	label: {
		type: String,
		default: undefined,
	},
	large: {
		type: Boolean,
		default: false,
	},
	mdiPadding: {
		type: String,
		default: undefined,
	},
	medium: {
		type: Boolean,
		default: false,
	},
	size: {
		type: String,
		default: undefined,
	},
	small: {
		type: Boolean,
		default: false,
	},
	uniqueId: {
		type: String,
		default: undefined,
	},
	widthAuto: {
		type: Boolean,
		default: false,
	},
	xLarge: {
		type: Boolean,
		default: false,
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproIcon> => ({ iconColor: 'ap-black' })

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproIcon> => ({
	borderColor: 'ap-blue',
	bordered: true,
	icon: 'utilisateur',
	iconBgColor: 'ap-yellow',
	iconColor: 'ap-green',
	label: 'Modified label',
	large: true,
	mdiPadding: '3em',
	medium: true,
	size: '4rem',
	small: true,
	uniqueId: 'modified-unique-id',
	widthAuto: true,
	xLarge: true,
})

const testHelper = new TestHelper(AmeliproIcon)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproIcon', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproIcon>>

		describe('root', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproIcon, { props: requiredPropValues() })
			})

			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.find('.amelipro-icon').attributes('id')).toBeUndefined()

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.amelipro-icon').attributes('id')).toBe('modified-unique-id')
			})
		})

		describe('span.amelipro-custom-icon - without slot', () => {
			const findInnerWrapper = () => vueWrapper.find('.amelipro-custom-icon')

			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproIcon, { props: requiredPropValues() })
			})

			it('prop label sets attribute aria-label', async () => {
				expect(findInnerWrapper().attributes('aria-label')).toBeUndefined()

				const { label } = modifiedPropValues()
				await vueWrapper.setProps({ label })
				expect(findInnerWrapper().attributes('aria-label')).toBe('Modified label')
			})

			it('prop small sets attribute class', async () => {
				expect(findInnerWrapper().classes('small')).toBe(false)

				const { small } = modifiedPropValues()
				await vueWrapper.setProps({ small })
				expect(findInnerWrapper().classes('small')).toBe(true)
			})

			it('prop medium sets attribute class', async () => {
				expect(findInnerWrapper().classes('medium')).toBe(false)

				const { medium } = modifiedPropValues()
				await vueWrapper.setProps({ medium })
				expect(findInnerWrapper().classes('medium')).toBe(true)
			})

			it('prop large sets attribute class', async () => {
				expect(findInnerWrapper().classes('large')).toBe(false)

				const { large } = modifiedPropValues()
				await vueWrapper.setProps({ large })
				expect(findInnerWrapper().classes('large')).toBe(true)
			})

			it('prop xLarge sets attribute class', async () => {
				expect(findInnerWrapper().classes('x-large')).toBe(false)

				const { xLarge } = modifiedPropValues()
				await vueWrapper.setProps({ xLarge })
				expect(findInnerWrapper().classes('x-large')).toBe(true)
			})

			it('props iconColor, bordered, borderColor, size & widthAuto set attribute style', async () => {
				expect(findInnerWrapper().attributes('style')).toBe('color: #000000;')

				await vueWrapper.setProps({ iconColor: 'ap-white' })
				expect(findInnerWrapper().attributes('style')).toBe('color: #FFFFFF;')

				const { bordered } = modifiedPropValues()
				await vueWrapper.setProps({ bordered })
				expect(findInnerWrapper().attributes('style')).toBe('color: #FFFFFF; border-radius: 50%; border: 1px solid #FFFFFF;')

				const { borderColor } = modifiedPropValues()
				await vueWrapper.setProps({ borderColor })
				expect(findInnerWrapper().attributes('style')).toBe('color: #FFFFFF; border-radius: 50%; border: 1px solid #0C419A;')

				const { size } = modifiedPropValues()
				await vueWrapper.setProps({ size })
				expect(findInnerWrapper().attributes('style')).toBe('color: #FFFFFF; border-radius: 50%; border: 1px solid #0C419A; height: 4rem; width: 4rem;')

				const { widthAuto } = modifiedPropValues()
				await vueWrapper.setProps({ widthAuto })
				expect(findInnerWrapper().attributes('style')).toBe('color: #FFFFFF; border-radius: 50%; border: 1px solid #0C419A; height: 4rem; width: auto;')
			})
		})

		describe('span.amelipro-custom-icon - with slot', () => {
			const findInnerWrapper = () => vueWrapper.find('.amelipro-external-icon')

			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproIcon, {
					props: requiredPropValues(),
					slots: { default: 'Default slot' },
				})
			})

			it('prop small sets attribute class', async () => {
				expect(findInnerWrapper().classes('small')).toBe(false)

				const { small } = modifiedPropValues()
				await vueWrapper.setProps({ small })
				expect(findInnerWrapper().classes('small')).toBe(true)
			})

			it('prop medium sets attribute class', async () => {
				expect(findInnerWrapper().classes('medium')).toBe(false)

				const { medium } = modifiedPropValues()
				await vueWrapper.setProps({ medium })
				expect(findInnerWrapper().classes('medium')).toBe(true)
			})

			it('prop large sets attribute class', async () => {
				expect(findInnerWrapper().classes('large')).toBe(false)

				const { large } = modifiedPropValues()
				await vueWrapper.setProps({ large })
				expect(findInnerWrapper().classes('large')).toBe(true)
			})
			it('prop xLarge sets attribute class', async () => {
				expect(findInnerWrapper().classes('x-large')).toBe(false)

				const { xLarge } = modifiedPropValues()
				await vueWrapper.setProps({ xLarge })
				expect(findInnerWrapper().classes('x-large')).toBe(true)
			})

			it('props iconColor, iconBgColor, bordered, borderColor & size set attribute style', async () => {
				expect(findInnerWrapper().attributes('style')).toBe('background-color: transparent; border-radius: 50%; color: #000000; padding: 2px;')

				const { iconBgColor } = modifiedPropValues()
				await vueWrapper.setProps({ iconBgColor })
				expect(findInnerWrapper().attributes('style')).toBe('background-color: #F0B323; border-radius: 50%; color: #000000; padding: 2px;')

				const { bordered } = modifiedPropValues()
				await vueWrapper.setProps({ bordered })
				expect(findInnerWrapper().attributes('style')).toBe('background-color: #F0B323; border-radius: 50%; color: #000000; padding: 2px; border: 1px solid #000000;')

				await vueWrapper.setProps({ iconColor: 'ap-white' })
				expect(findInnerWrapper().attributes('style')).toBe('background-color: #F0B323; border-radius: 50%; color: #FFFFFF; padding: 2px; border: 1px solid #FFFFFF;')

				const { borderColor } = modifiedPropValues()
				await vueWrapper.setProps({ borderColor })
				expect(findInnerWrapper().attributes('style')).toBe('background-color: #F0B323; border-radius: 50%; color: #FFFFFF; padding: 2px; border: 1px solid #0C419A;')

				const { size } = modifiedPropValues()
				await vueWrapper.setProps({ size })
				expect(findInnerWrapper().attributes('style')).toBe('background-color: #F0B323; border-radius: 50%; color: #FFFFFF; padding: 5px; border: 1px solid #0C419A; height: 4rem; width: 4rem;')
			})

			it('prop small sets padding in attribute style', async () => {
				expect(findInnerWrapper().attributes('style')).toBe('background-color: transparent; border-radius: 50%; color: #000000; padding: 2px;')

				const { small } = modifiedPropValues()
				await vueWrapper.setProps({ small })
				expect(findInnerWrapper().attributes('style')).toBe('background-color: transparent; border-radius: 50%; color: #000000; padding: 1px;')
			})

			it('prop large sets padding in attribute style', async () => {
				expect(findInnerWrapper().attributes('style')).toBe('background-color: transparent; border-radius: 50%; color: #000000; padding: 2px;')

				const { large } = modifiedPropValues()
				await vueWrapper.setProps({ large })
				expect(findInnerWrapper().attributes('style')).toBe('background-color: transparent; border-radius: 50%; color: #000000; padding: 4px;')
			})
			it('prop xLarge sets padding in attribute style', async () => {
				expect(findInnerWrapper().attributes('style')).toBe('background-color: transparent; border-radius: 50%; color: #000000; padding: 2px;')

				const { xLarge } = modifiedPropValues()
				await vueWrapper.setProps({ xLarge })
				expect(findInnerWrapper().attributes('style')).toBe('background-color: transparent; border-radius: 50%; color: #000000; padding: 5px;')
			})

			it('prop size sets padding in attribute style', async () => {
				expect(findInnerWrapper().attributes('style')).toBe('background-color: transparent; border-radius: 50%; color: #000000; padding: 2px;')

				const { size } = modifiedPropValues()
				await vueWrapper.setProps({ size })
				expect(findInnerWrapper().attributes('style')).toBe('background-color: transparent; border-radius: 50%; color: #000000; padding: 5px; height: 4rem; width: 4rem;')
			})

			it('prop mdiPadding set padding in attribute style', async () => {
				expect(findInnerWrapper().attributes('style')).toBe('background-color: transparent; border-radius: 50%; color: #000000; padding: 2px;')

				const { mdiPadding } = modifiedPropValues()
				await vueWrapper.setProps({ mdiPadding })
				expect(findInnerWrapper().attributes('style')).toBe('background-color: transparent; border-radius: 50%; color: #000000; padding: 3em;')
			})
		})
	})

	describe('Setting props should update props or attributes of inner components', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproIcon>>

		describe('VIcon', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproIcon, {
					props: requiredPropValues(),
					slots: { default: 'Default slot' },
				})
			})

			it('prop iconColor sets prop color', async () => {
				expect(vueWrapper.findComponent(VIcon).props('color')).toBe('ap-black')

				const { iconColor } = modifiedPropValues()
				await vueWrapper.setProps({ iconColor })
				expect(vueWrapper.findComponent(VIcon).props('color')).toBe('ap-green')
			})
		})
	})

	// TODO: pourquoi le slot de VIcon est toujours vide ?
	describe.skip('Slots', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproIcon>>

		describe('#default', () => {
			it('slot #default without content', () => {
				vueWrapper = shallowMount(AmeliproIcon, { props: requiredPropValues() })
				expect(vueWrapper.findComponent(VIcon).exists()).toBe(false)
			})

			it('slot #default with content', () => {
				// vueWrapper = shallowMount(AmeliproIcon, {
				vueWrapper = mount(AmeliproIcon, {
					props: requiredPropValues(),
					slots: { default: 'Default slot content' },
					stubs: { VIcon },
				})
				expect(vueWrapper.find('.amelipro-external-icon').text()).toBe('Default slot content')
			})
		})
	})

	describe('Computed', () => {
		const vueWrapper = mount(AmeliproIcon, {
			autoAttach: attachToApp(),
			props: {
				...modifiedPropValues(),
				icon: 'utilisateur',
				iconColor: 'ap-blue-darken-1',
			},
		})

		it('themeIcon returns the good values', () => {
			const expectedResult = `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 1823 1823" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd">
  <circle class="circle-color" cx="912" cy="912" r="912"></circle>
  <path class="shape-color" d="M962 454c117 0 125 154 125 154v145s1 111-73 152c-2 10-3 20-1 30 4-2-21 146 106 165 92 15 178 57 247 120 23 23 40 186 40 186H418s-2-132 40-186c73-62 162-104 257-120 128-19 85-160 89-158 2-10 1-21-1-31 0 0-69-89-68-169 1-81 0-134 0-134s-4-190 126-190l101 36z"></path>
</svg>`
			expect(vueWrapper.find('svg').html()).toContain(expectedResult)
		})
	})
})
