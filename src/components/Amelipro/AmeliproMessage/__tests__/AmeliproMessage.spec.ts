import { AmeliproIcon, AmeliproIconBtn } from '@/components'
import { VueWrapper, mount, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import AmeliproMessage from '../AmeliproMessage.vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import TestHelper from '@tests/helpers/TestHelper'
import { VAlert } from 'vuetify/components'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproMessage> = {
	alignStart: {
		type: Boolean,
		default: false,
	},
	borderLeftMessage: {
		type: Boolean,
		default: false,
	},
	borderLeftMessageTitle: {
		type: String,
		default: undefined,
	},
	color: {
		type: String,
		default: undefined,
	},
	dark: {
		type: Boolean,
		default: false,
	},
	dismissible: {
		type: Boolean,
		default: false,
	},
	icon: {
		type: String,
		default: undefined,
	},
	iconBgColor: {
		type: String,
		default: undefined,
	},
	iconColor: {
		type: String,
		default: undefined,
	},
	maxWidth: {
		type: String,
		default: undefined,
	},
	noIcon: {
		type: Boolean,
		default: false,
	},
	text: {
		type: Boolean,
		default: false,
	},
	textColor: {
		type: String,
		default: undefined,
	},
	type: {
		default: 'info',
		type: String,
		validator(value: string): boolean {
			return ['info', 'error', 'warning', 'success'].includes(value.toLowerCase())
		},
	},
	uniqueId: {
		type: String,
		default: undefined,
	},
	value: {
		type: Boolean,
		default: true,
	},
	width: {
		type: String,
		default: '100%',
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproMessage> => ({})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproMessage> => ({
	alignStart: true,
	borderLeftMessage: true,
	borderLeftMessageTitle: 'Modified border left message title',
	color: 'ap-blue',
	dark: true,
	dismissible: true,
	icon: 'plus',
	iconBgColor: 'ap-white',
	iconColor: 'ap-yellow',
	maxWidth: '500px',
	noIcon: true,
	text: true,
	textColor: 'ap-green',
	type: 'warning',
	uniqueId: 'modified-unique-id',
	value: false,
	width: '100px',
})

const testHelper = new TestHelper(AmeliproMessage)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproMessage', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update props or attributes of inner components', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproMessage>>

		describe('VAlert', () => {
			const wrapperFinder = () => vueWrapper.findComponent(VAlert)

			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproMessage, { props: requiredPropValues() })
			})

			it('prop uniqueId sets attribute id', async () => {
				expect(wrapperFinder().attributes('id')).toBe(testHelper.default('uniqueId'))

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(wrapperFinder().attributes('id')).toBe(testHelper.modified('uniqueId'))
			})

			it.skip('prop value sets prop v-model', async () => {
				expect(wrapperFinder().props('modelValue')).toBe(testHelper.default('value'))

				const { value } = modifiedPropValues()
				await vueWrapper.setProps({ value })
				expect(wrapperFinder().props('modelValue')).toBe(testHelper.modified('value'))
			})

			it('prop borderLeftMessage sets prop border', async () => {
				expect(wrapperFinder().props('border')).toBeUndefined()

				const { borderLeftMessage } = modifiedPropValues()
				await vueWrapper.setProps({ borderLeftMessage })
				expect(wrapperFinder().props('border')).toBe('start')
			})

			it('prop borderLeftMessage sets prop borderColor', async () => {
				expect(wrapperFinder().props('borderColor')).toBeUndefined()

				const { borderLeftMessage } = modifiedPropValues()
				await vueWrapper.setProps({ borderLeftMessage })
				expect(wrapperFinder().props('borderColor')).toBe('#4D547D')
			})

			// true si !(props.dark || AmeliproMessageTypes[props.type].type === 'dark' || props.text)
			it('props dark, text & type set class text-ap-white', async () => {
				expect(wrapperFinder().classes('text-ap-white')).toBe(true)

				const { dark, text, type } = modifiedPropValues()
				await vueWrapper.setProps({ text })
				expect(wrapperFinder().classes('text-ap-white')).toBe(false)

				await vueWrapper.setProps({ text: false, dark })
				expect(wrapperFinder().classes('text-ap-white')).toBe(false)

				await vueWrapper.setProps({ dark: false })
				expect(wrapperFinder().classes('text-ap-white')).toBe(true)

				await vueWrapper.setProps({ type })
				expect(wrapperFinder().classes('text-ap-white')).toBe(false)
			})

			// true si props.dark && !(AmeliproMessageTypes[props.type].type === 'dark' || props.text)
			it('props dark, text & type set class text-ap-grey-darken-1', async () => {
				expect(wrapperFinder().classes('text-ap-grey-darken-1')).toBe(false)

				const { dark, text, type } = modifiedPropValues()
				await vueWrapper.setProps({ text })
				expect(wrapperFinder().classes('text-ap-grey-darken-1')).toBe(false)

				await vueWrapper.setProps({ text: false, dark })
				expect(wrapperFinder().classes('text-ap-grey-darken-1')).toBe(true)

				await vueWrapper.setProps({ dark: false })
				expect(wrapperFinder().classes('text-ap-grey-darken-1')).toBe(false)

				await vueWrapper.setProps({ type })
				expect(wrapperFinder().classes('text-ap-grey-darken-1')).toBe(true)
			})

			it('prop text sets class pa-0', async () => {
				expect(wrapperFinder().classes('pa-0')).toBe(false)

				const { text } = modifiedPropValues()
				await vueWrapper.setProps({ text })
				expect(wrapperFinder().classes('pa-0')).toBe(true)
			})

			it('props borderLeftMessage & text set class pa-3', async () => {
				expect(wrapperFinder().classes('pa-3')).toBe(true)

				const { borderLeftMessage, text } = modifiedPropValues()
				await vueWrapper.setProps({ borderLeftMessage })
				expect(wrapperFinder().classes('pa-3')).toBe(false)

				await vueWrapper.setProps({ text })
				expect(wrapperFinder().classes('pa-3')).toBe(false)

				await vueWrapper.setProps({ borderLeftMessage: false })
				expect(wrapperFinder().classes('pa-3')).toBe(false)
			})

			it('prop text sets class amelipro-message__radius', async () => {
				expect(wrapperFinder().classes('amelipro-message__radius')).toBe(true)

				const { text } = modifiedPropValues()
				await vueWrapper.setProps({ text })
				expect(wrapperFinder().classes('amelipro-message__radius')).toBe(false)
			})

			it('prop alignStart sets class message-align-start', async () => {
				expect(wrapperFinder().classes('message-align-start')).toBe(false)

				const { alignStart } = modifiedPropValues()
				await vueWrapper.setProps({ alignStart })
				expect(wrapperFinder().classes('message-align-start')).toBe(true)
			})

			it('prop borderLeftMessage sets classes px-6, py-4 & bg-ap-grey-lighten-6', async () => {
				expect(wrapperFinder().classes('px-6')).toBe(false)
				expect(wrapperFinder().classes('py-4')).toBe(false)
				expect(wrapperFinder().classes('bg-ap-grey-lighten-6')).toBe(false)

				const { borderLeftMessage } = modifiedPropValues()
				await vueWrapper.setProps({ borderLeftMessage })
				expect(wrapperFinder().classes('px-6')).toBe(true)
				expect(wrapperFinder().classes('py-3')).toBe(true)
				expect(wrapperFinder().classes('bg-ap-grey-lighten-6')).toBe(true)
			})

			it('props color, text, textColor & type set prop color', async () => {
				const { color, text, textColor, type } = modifiedPropValues()
				await vueWrapper.setProps({
					color: undefined,
					text: undefined,
					textColor: undefined,
					type: undefined,
				})
				expect(wrapperFinder().props('color')).toBe('#4D547D')

				await vueWrapper.setProps({ type: 'error' })
				expect(wrapperFinder().props('color')).toBe('#B33F2E')

				await vueWrapper.setProps({ color })
				expect(wrapperFinder().props('color')).toBe('#0C419A')

				await vueWrapper.setProps({ color: undefined, text, type: undefined })
				expect(wrapperFinder().props('color')).toBe('#4D547D')

				await vueWrapper.setProps({ type })
				expect(wrapperFinder().props('color')).toBe('#906C16')

				await vueWrapper.setProps({ textColor })
				expect(wrapperFinder().props('color')).toBe('#56C271')
			})

			it('prop maxWidth sets prop maxWidth', async () => {
				expect(wrapperFinder().props('maxWidth')).toBe(testHelper.default('maxWidth'))

				const { maxWidth } = modifiedPropValues()
				await vueWrapper.setProps({ maxWidth })
				expect(wrapperFinder().props('maxWidth')).toBe(testHelper.modified('maxWidth'))
			})

			it('prop type sets attribute role', async () => {
				expect(wrapperFinder().attributes('role')).toBeUndefined()

				await vueWrapper.setProps({ type: 'error' })
				expect(wrapperFinder().attributes('role')).toBe('alert')
			})

			it('prop text sets prop variant', async () => {
				expect(wrapperFinder().props('variant')).toBe('flat')

				const { text } = modifiedPropValues()
				await vueWrapper.setProps({ text })
				expect(wrapperFinder().props('variant')).toBe('text')
			})

			it('prop width sets prop width', async () => {
				expect(wrapperFinder().props('width')).toBe(testHelper.default('width'))

				const { width } = modifiedPropValues()
				await vueWrapper.setProps({ width })
				expect(wrapperFinder().props('width')).toBe(testHelper.modified('width'))
			})
		})

		describe('AmeliproIcon', () => {
			const wrapperFinder = () => vueWrapper.findComponent(AmeliproIcon)

			beforeEach(() => {
				vueWrapper = mount(AmeliproMessage, {
					props: requiredPropValues(),
					stubs: {
						AmeliproIcon: true,
						AmeliproIconBtn: true,
						VAlert: true,
					},
				})
			})

			it('props noIcon & borderLeftMessage set Icon visibility', async () => {
				expect(wrapperFinder().exists()).toBe(true)

				const { noIcon, borderLeftMessage } = modifiedPropValues()
				await vueWrapper.setProps({ borderLeftMessage })
				expect(wrapperFinder().exists()).toBe(true)

				await vueWrapper.setProps({ noIcon, borderLeftMessage: false })
				expect(wrapperFinder().exists()).toBe(false)

				await vueWrapper.setProps({ borderLeftMessage })
				expect(wrapperFinder().exists()).toBe(false)
			})

			it('prop icon & type sets prop icon', async () => {
				const { borderLeftMessage } = modifiedPropValues()
				await vueWrapper.setProps({ borderLeftMessage })

				expect(wrapperFinder().props('icon')).toBe('information')

				const { icon, type } = modifiedPropValues()
				await vueWrapper.setProps({ type })
				expect(wrapperFinder().props('icon')).toBe('exclamation')

				await vueWrapper.setProps({ icon })
				expect(wrapperFinder().props('icon')).toBe('plus')
			})

			it('prop icon & type sets prop icon', async () => {
				const { borderLeftMessage } = modifiedPropValues()
				await vueWrapper.setProps({ borderLeftMessage })

				expect(wrapperFinder().props('icon')).toBe('information')

				const { icon, type } = modifiedPropValues()
				await vueWrapper.setProps({ type })
				expect(wrapperFinder().props('icon')).toBe('exclamation')

				await vueWrapper.setProps({ icon })
				expect(wrapperFinder().props('icon')).toBe('plus')
			})
		})

		describe('AmeliproIconBtn', () => {
			const wrapperFinder = () => vueWrapper.findComponent(AmeliproIconBtn)

			beforeEach(() => {
				vueWrapper = mount(AmeliproMessage, {
					props: requiredPropValues(),
					stubs: {
						AmeliproIcon: true,
						AmeliproIconBtn: true,
						VAlert: true,
					},
				})
			})

			it('prop dismissible set Icon visibility', async () => {
				expect(wrapperFinder().exists()).toBe(false)

				const { dismissible } = modifiedPropValues()
				await vueWrapper.setProps({ dismissible })
				expect(wrapperFinder().exists()).toBe(true)
			})

			it('prop uniqueId sets attribute id', async () => {
				const { dismissible } = modifiedPropValues()
				await vueWrapper.setProps({ dismissible })

				expect(wrapperFinder().attributes('id')).toBeUndefined()

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(wrapperFinder().attributes('id')).toBe('modified-unique-id-dismiss-btn')
			})

			// (props.dark || AmeliproMessageTypes[props.type].type === 'dark')  || props.text || props.borderLeftMessage
			it('props dark, type, text & borderLeftMessage set prop iconColor & iconHoverColor', async () => {
				const { dismissible } = modifiedPropValues()
				await vueWrapper.setProps({ dismissible })

				expect(wrapperFinder().props('iconColor')).toBe('#FFFFFF')
				expect(wrapperFinder().props('iconHoverColor')).toBe('#FFFFFF')

				const { dark, type, text, borderLeftMessage } = modifiedPropValues()
				await vueWrapper.setProps({ borderLeftMessage })
				expect(wrapperFinder().props('iconColor')).toBe('#1A1B1B')
				expect(wrapperFinder().props('iconHoverColor')).toBe('#1A1B1B')

				await vueWrapper.setProps({ borderLeftMessage: undefined, text })
				expect(wrapperFinder().props('iconColor')).toBe('#1A1B1B')
				expect(wrapperFinder().props('iconHoverColor')).toBe('#1A1B1B')

				await vueWrapper.setProps({ text: undefined, type })
				expect(wrapperFinder().props('iconColor')).toBe('#1A1B1B')
				expect(wrapperFinder().props('iconHoverColor')).toBe('#1A1B1B')

				await vueWrapper.setProps({ type: undefined, dark })
				expect(wrapperFinder().props('iconColor')).toBe('#1A1B1B')
				expect(wrapperFinder().props('iconHoverColor')).toBe('#1A1B1B')
			})
		})
	})

	describe('Events', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproMessage>>
		const wrapperFinder = () => vueWrapper.findComponent(AmeliproIconBtn)

		beforeEach(() => {
			vueWrapper = mount(AmeliproMessage, { props: { ...requiredPropValues(), dismissible: true } })
		})

		it('test emitCloseEvent when close button is clicked', async () => {
			expect(vueWrapper.emitted('click:close')).toBeUndefined()

			await wrapperFinder().trigger('click')
			expect(vueWrapper.emitted('click:close')).toStrictEqual([[]])
		})
	})

	// TODO: Slots
	describe.skip('Slots', () => {
		describe.skip('#default')
	})
})
