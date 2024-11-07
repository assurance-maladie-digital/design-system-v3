/* eslint-disable vue/one-component-per-file */
import { vuetify } from '@tests/unit/setup'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { computed, defineComponent, inject, readonly, ref, type DeepReadonly, type Ref } from 'vue'
import { registerSubMenuKey } from '../conts'
import useHandleSubMenus from '../useHandleSubMenus'

describe('useHandleSubMenus', () => {
	const TestParentComponent = defineComponent({
		setup() {
			const openStatus = ref(false)
			const { haveOpenSubMenu } = useHandleSubMenus(readonly(openStatus))
			const rootClasses = computed(() => ({
				'parent-open': openStatus.value,
				'has-open-submenu': haveOpenSubMenu.value,
			}))

			return { rootClasses, openStatus }
		},
		template: `
			<button @click="openStatus = !openStatus" class="parent-menu-btn">Toggle</button>
			<div :class="rootClasses"><slot/></div>
		`,
	})

	const TestChildrenComponent = defineComponent({
		setup() {
			const openStatus = ref(false)
			const registerSubMenu = inject<((r: DeepReadonly<Ref<boolean>>, c: () => void) => void) | undefined>(registerSubMenuKey)!

			registerSubMenu(readonly(openStatus), () => {
				openStatus.value = false
			})

			const rootClasses = computed(() => ({
				'children-open': openStatus.value,
			}))

			return { rootClasses, openStatus }
		},
		template: `
			<button @click="openStatus = !openStatus" class="child-menu-btn">Toggle</button>
			<div :class="rootClasses"></div>
		`,
	})

	it('if close the submenu if the parent menu is closed', async () => {
		const wrapper = mount({
			components: {
				TestParentComponent,
				TestChildrenComponent,
			},
			template: `
				<TestParentComponent>
					<TestChildrenComponent />
				</TestParentComponent>
			`,
		}, {
			global: {
				plugins: [vuetify],
			},
		})

		expect(wrapper.find('.parent-open').exists()).toBe(false)
		expect(wrapper.find('.children-open').exists()).toBe(false)

		const parentBtn = wrapper.find('.parent-menu-btn')
		await parentBtn.trigger('click')
		expect(wrapper.find('.parent-open').exists()).toBe(true)
		expect(wrapper.find('.children-open').exists()).toBe(false)

		const childBtn = wrapper.find('.child-menu-btn')
		await childBtn.trigger('click')
		expect(wrapper.find('.parent-open').exists()).toBe(true)
		expect(wrapper.find('.children-open').exists()).toBe(true)

		await parentBtn.trigger('click')
		expect(wrapper.find('.parent-open').exists()).toBe(false)
		expect(wrapper.find('.children-open').exists()).toBe(false)

		await parentBtn.trigger('click')
		expect(wrapper.find('.parent-open').exists()).toBe(true)
		expect(wrapper.find('.children-open').exists()).toBe(false)
	})

	it('if close the submenu if another submenu is opened', async () => {
		const wrapper = mount({
			components: {
				TestParentComponent,
				TestChildrenComponent,
			},
			template: `
				<TestParentComponent>
					<TestChildrenComponent />
					<TestChildrenComponent />
				</TestParentComponent>
			`,
		}, {
			global: {
				plugins: [vuetify],
			},
		})

		expect(wrapper.find('.parent-open').exists()).toBe(false)
		expect(wrapper.findAll('.children-open').length).toBe(0)

		const parentBtn = wrapper.find('.parent-menu-btn')
		await parentBtn.trigger('click')
		expect(wrapper.find('.parent-open').exists()).toBe(true)
		expect(wrapper.findAll('.children-open').length).toBe(0)

		const childBtns = wrapper.findAll('.child-menu-btn')
		await childBtns[0].trigger('click')
		expect(wrapper.find('.parent-open').exists()).toBe(true)
		expect(wrapper.findAll('.children-open').length).toBe(1)

		await childBtns[1].trigger('click')
		expect(wrapper.find('.parent-open').exists()).toBe(true)
		expect(wrapper.findAll('.children-open').length).toBe(1)
	})

	it('return haveOpenSubMenu and update it when the component have a submenu open', async () => {
		const wrapper = mount({
			components: {
				TestParentComponent,
				TestChildrenComponent,
			},
			template: `
				<TestParentComponent>
					<TestChildrenComponent />
					<TestChildrenComponent />
				</TestParentComponent>
			`,
		}, {
			global: {
				plugins: [vuetify],
			},
		})

		const parentBtn = wrapper.find('.parent-menu-btn')
		await parentBtn.trigger('click')
		const parentMenu = wrapper.find('.parent-open')

		expect(parentMenu!.classes()).not.toContain('has-open-submenu')

		const childBtns = wrapper.findAll('.child-menu-btn')

		await childBtns[0].trigger('click')
		expect(parentMenu!.classes()).toContain('has-open-submenu')

		await childBtns[0].trigger('click')
		expect(parentMenu!.classes()).not.toContain('has-open-submenu')

		await childBtns[1].trigger('click')
		expect(parentMenu!.classes()).toContain('has-open-submenu')
	})
})
