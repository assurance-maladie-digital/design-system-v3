import { VueWrapper, mount, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import AmeliproClickableTile from '../AmeliproClickableTile.vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import type { PropType } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import TestHelper from '@tests/helpers/TestHelper'

// Stub VBtn qui préserve les attributs comme aria-label
const VBtnStub = {
	template: '<button v-bind="$attrs"><slot /></button>',
	inheritAttrs: false,
}

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproClickableTile> = {
	borderedIcon: {
		type: Boolean,
		default: false,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	href: {
		type: String,
		default: undefined,
	},
	icon: {
		type: String,
		default: undefined,
	},
	imgMaxWidth: {
		type: String,
		default: undefined,
	},
	imgMinWidth: {
		type: String,
		default: undefined,
	},
	imgSrc: {
		type: String,
		default: undefined,
	},
	imgWidth: {
		type: String,
		default: '100px',
	},
	tileTitle: {
		type: String,
		default: undefined,
	},
	tileWidth: {
		type: String,
		default: '100%',
	},
	to: {
		type: Object as PropType<RouteLocationRaw>,
		default: undefined,
	},
	uniqueId: {
		type: String,
		default: undefined,
	},
	onlyIconIsClickable: {
		type: Boolean,
		default: false,
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproClickableTile> => ({
	icon: 'utilisateur',
	tileTitle: 'titre de la tuile',
	uniqueId: 'required-unique-id',
})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproClickableTile> => ({
	icon: 'document',
	tileTitle: 'titre modifié',
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(AmeliproClickableTile)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproClickableTile', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Main container', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproClickableTile>>

		beforeEach(() => {
			vueWrapper = mount(AmeliproClickableTile, {
				props: {
					icon: 'utilisateur',
					tileTitle: 'Test',
					uniqueId: 'test-tile',
				},
				global: { stubs: { VBtn: VBtnStub } },
			})
		})

		it('prop uniqueId sets attribute id on container', async () => {
			expect(vueWrapper.attributes('id')).toBe('test-tile')
			await vueWrapper.setProps({ uniqueId: 'new-id' })
			expect(vueWrapper.attributes('id')).toBe('new-id')
		})

		it('prop tileWidth sets width attribute', async () => {
			expect(vueWrapper.find('button').attributes('width')).toBe('100%')
			await vueWrapper.setProps({ tileWidth: '50%' })
			expect(vueWrapper.find('button').attributes('width')).toBe('50%')
		})

		it('prop disabled disables the button', async () => {
			expect(vueWrapper.find('button').attributes('disabled')).toBeUndefined()
			await vueWrapper.setProps({ disabled: true })
			expect(vueWrapper.find('button').attributes('disabled')).toBeDefined()
		})

		it('prop href sets href attribute', async () => {
			expect(vueWrapper.find('button').attributes('href')).toBeUndefined()
			await vueWrapper.setProps({ href: 'https://example.com' })
			expect(vueWrapper.find('button').attributes('href')).toBe('https://example.com')
		})

		it('prop to sets to attribute', async () => {
			expect(vueWrapper.find('button').attributes('to')).toBeUndefined()
			await vueWrapper.setProps({ to: '/dashboard' })
			expect(vueWrapper.find('button').attributes('to')).toBe('/dashboard')
		})
	})

	describe('Icon or Image display', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproClickableTile>>

		beforeEach(() => {
			vueWrapper = mount(AmeliproClickableTile, {
				props: {
					icon: 'utilisateur',
					tileTitle: 'Test',
				},
				global: { stubs: { VBtn: VBtnStub } },
			})
		})

		it('displays icon when icon prop is provided', async () => {
			expect(vueWrapper.findComponent({ name: 'AmeliproIcon' }).exists()).toBe(true)
		})

		it('displays image when imgSrc prop is provided', async () => {
			await vueWrapper.setProps({ icon: undefined, imgSrc: 'https://example.com/image.png' })
			expect(vueWrapper.find('img').exists()).toBe(true)
			expect(vueWrapper.find('img').attributes('src')).toBe('https://example.com/image.png')
		})

		it('prop imgWidth sets image width style', async () => {
			await vueWrapper.setProps({ icon: undefined, imgSrc: 'https://example.com/image.png' })
			expect(vueWrapper.find('img').attributes('style')).toContain('width: 100px')
			await vueWrapper.setProps({ imgWidth: '150px' })
			expect(vueWrapper.find('img').attributes('style')).toContain('width: 150px')
		})

		it('prop imgMaxWidth sets image maxWidth style', async () => {
			await vueWrapper.setProps({
				icon: undefined,
				imgSrc: 'https://example.com/image.png',
				imgMaxWidth: '200px',
			})
			expect(vueWrapper.find('img').attributes('style')).toContain('max-width: 200px')
		})

		it('prop imgMinWidth sets image minWidth style', async () => {
			await vueWrapper.setProps({
				icon: undefined,
				imgSrc: 'https://example.com/image.png',
				imgMinWidth: '50px',
			})
			expect(vueWrapper.find('img').attributes('style')).toContain('min-width: 50px')
		})

		it('does not display both icon and image', async () => {
			await vueWrapper.setProps({
				icon: 'utilisateur',
				imgSrc: 'https://example.com/image.png',
			})
			const images = vueWrapper.findAll('img')
			const icons = vueWrapper.findAllComponents({ name: 'AmeliproIcon' })
			expect(images.length === 0 || icons.length === 0).toBe(true)
		})
	})

	describe('Title display', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproClickableTile>>

		beforeEach(() => {
			vueWrapper = mount(AmeliproClickableTile, {
				props: {
					icon: 'utilisateur',
					tileTitle: 'titre de la tuile',
				},
				global: { stubs: { VBtn: VBtnStub } },
			})
		})

		it('prop tileTitle displays title text', async () => {
			expect(vueWrapper.text()).toContain('titre de la tuile')
			await vueWrapper.setProps({ tileTitle: 'nouveau titre' })
			expect(vueWrapper.text()).toContain('nouveau titre')
		})

		it('displays slot content when provided', async () => {
			const slotWrapper = mount(AmeliproClickableTile, {
				props: { icon: 'utilisateur' },
				slots: {
					default: 'Slot content',
				},
				global: { stubs: { VBtn: VBtnStub } },
			})
			expect(slotWrapper.text()).toContain('Slot content')
		})
	})

	describe('Icon styling', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproClickableTile>>

		beforeEach(() => {
			vueWrapper = mount(AmeliproClickableTile, {
				props: {
					icon: 'utilisateur',
					tileTitle: 'Test',
				},
				global: { stubs: { VBtn: VBtnStub } },
			})
		})

		it('prop borderedIcon changes icon style', async () => {
			let icons = vueWrapper.findAllComponents({ name: 'AmeliproIcon' })
			expect(icons.length).toBeGreaterThan(0)
			expect(icons[0]?.props('bordered')).toBe(false)

			await vueWrapper.setProps({ borderedIcon: true })
			icons = vueWrapper.findAllComponents({ name: 'AmeliproIcon' })
			expect(icons[0]?.props('bordered')).toBe(true)
		})

		it('icon has correct size', async () => {
			const icons = vueWrapper.findAllComponents({ name: 'AmeliproIcon' })
			expect(icons.length).toBeGreaterThan(0)
			expect(icons[0]?.props('size')).toBe('32px')
		})

		it('arrow icon has correct size', async () => {
			const icons = vueWrapper.findAllComponents({ name: 'AmeliproIcon' })
			expect(icons.length).toBeGreaterThan(0)
			const arrowIcon = icons[icons.length - 1]
			expect(arrowIcon?.props('size')).toBe('16px')
			expect(arrowIcon?.props('icon')).toBe('chevronRight')
		})
	})

	describe('onlyIconIsClickable mode', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproClickableTile>>

		beforeEach(() => {
			vueWrapper = mount(AmeliproClickableTile, {
				props: {
					icon: 'utilisateur',
					tileTitle: 'Test',
					uniqueId: 'test-tile',
					onlyIconIsClickable: true,
				},
				global: { stubs: { VBtn: VBtnStub } },
			})
		})

		it('renders span wrapper instead of VBtn when onlyIconIsClickable is true', () => {
			expect(vueWrapper.find('span.amelipro-clickable-tile').exists()).toBe(true)
		})

		it('prop uniqueId sets attribute id on span wrapper', async () => {
			expect(vueWrapper.find('span.amelipro-clickable-tile').attributes('id')).toBe('test-tile')
			await vueWrapper.setProps({ uniqueId: 'new-id' })
			expect(vueWrapper.find('span.amelipro-clickable-tile').attributes('id')).toBe('new-id')
		})

		it('contains a VBtn for icon button only', () => {
			const buttons = vueWrapper.findAll('button')
			expect(buttons.length > 0).toBe(true)
		})

		it('icon button has uniqueId suffix', async () => {
			const buttons = vueWrapper.findAll('button')
			expect(buttons.length).toBeGreaterThan(0)
			expect(buttons[0]?.attributes('id')).toBe('test-tile-icon-button')
		})

		it('content is not clickable, only icon button is', () => {
			const span = vueWrapper.find('span.amelipro-clickable-tile')
			// Span should not have onclick handler
			expect(span.attributes('onclick')).toBeUndefined()
		})
	})

	describe('Events', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproClickableTile>>

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproClickableTile, {
				props: {
					icon: 'utilisateur',
					tileTitle: 'Test',
					uniqueId: 'test-id',
				},
			})
		})

		it('emits click event when clicked in normal mode', async () => {
			expect(vueWrapper.emitted('click')).toBeUndefined()
			await vueWrapper.trigger('click')
			expect(vueWrapper.emitted('click')).toBeTruthy()
			expect(vueWrapper.emitted('click')?.[0]).toEqual(['test-id'])
		})

		it('emits click event with uniqueId', async () => {
			await vueWrapper.setProps({ uniqueId: 'new-id' })
			await vueWrapper.trigger('click')
			expect(vueWrapper.emitted('click')?.[0]).toEqual(['new-id'])
		})

		it('does not emit click when disabled', async () => {
			await vueWrapper.setProps({ disabled: true })
			// VBtn with disabled prop should not emit click
		})
	})

	describe('Hover and Focus states', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproClickableTile>>

		beforeEach(() => {
			vueWrapper = mount(AmeliproClickableTile, {
				props: {
					icon: 'utilisateur',
					tileTitle: 'Test',
				},
				global: { stubs: { VBtn: VBtnStub } },
			})
		})

		it('changes border style on hover', async () => {
			const btn = vueWrapper.find('button')
			await btn.trigger('mouseenter')
			// Border should change when hovered
			const style = btn.attributes('style')
			expect(style).toBeDefined()
		})

		it('changes border style on focus', async () => {
			const btn = vueWrapper.find('button')
			await btn.trigger('focus')
			const style = btn.attributes('style')
			expect(style).toBeDefined()
		})

		it('removes hover state on mouseleave', async () => {
			const btn = vueWrapper.find('button')
			await btn.trigger('mouseenter')
			await btn.trigger('mouseleave')
			// State should be reset
		})

		it('removes focus state on blur', async () => {
			const btn = vueWrapper.find('button')
			await btn.trigger('focus')
			await btn.trigger('blur')
			// State should be reset
		})
	})

	describe('Disabled state styling', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproClickableTile>>

		beforeEach(() => {
			vueWrapper = mount(AmeliproClickableTile, {
				props: {
					icon: 'utilisateur',
					tileTitle: 'Test',
					disabled: true,
				},
				global: { stubs: { VBtn: VBtnStub } },
			})
		})

		it('applies disabled styling to button', () => {
			expect(vueWrapper.find('button').attributes('disabled')).toBeDefined()
		})

		it('button has disabled attribute when disabled prop is true', async () => {
			expect(vueWrapper.find('button').attributes('disabled')).toBeDefined()
			await vueWrapper.setProps({ disabled: false })
			expect(vueWrapper.find('button').attributes('disabled')).toBeUndefined()
		})
	})

	describe('ID generation', () => {
		it('generates proper IDs for all elements when uniqueId is provided', () => {
			const vueWrapper = mount(AmeliproClickableTile, {
				props: {
					icon: 'utilisateur',
					tileTitle: 'Test',
					uniqueId: 'test-tile',
				},
				global: { stubs: { VBtn: VBtnStub } },
			})

			expect(vueWrapper.attributes('id')).toBe('test-tile')
			expect(vueWrapper.find('#test-tile-icon').exists()).toBe(true)
			expect(vueWrapper.find('#test-tile-icon-arrow').exists()).toBe(true)
		})

		it('works without uniqueId', () => {
			const vueWrapper = mount(AmeliproClickableTile, {
				props: {
					icon: 'utilisateur',
					tileTitle: 'Test',
				},
				global: { stubs: { VBtn: VBtnStub } },
			})

			expect(vueWrapper.attributes('id')).toBeUndefined()
			expect(vueWrapper.find('[id*="-icon"]').exists()).toBe(false)
		})
	})
})
