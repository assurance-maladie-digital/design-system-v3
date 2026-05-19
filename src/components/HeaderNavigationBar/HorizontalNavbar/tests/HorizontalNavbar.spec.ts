import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { defineComponent } from 'vue'
import HorizontalNavbar from '../HorizontalNavbar.vue'

const SyTabsStub = defineComponent({
	name: 'SyTabs',
	props: {
		items: { type: Array, default: () => [] },
		modelValue: { type: Number, default: -1 },
		confirmTabChange: { type: Boolean, default: false },
		confirmationMessage: { type: String, default: undefined },
	},
	emits: ['update:modelValue', 'cancel-navigation', 'confirm-tab-change'],
	template: `
		<div class="sy-tabs-stub">
			<button
				v-for="(item, i) in items"
				:key="i"
				:class="['tab-btn', { active: modelValue === i }]"
				:data-index="i"
				@click="$emit('update:modelValue', i)"
			>{{ item.label }}</button>
		</div>
	`,
})

const stubs = {
	RouterLink: true,
	SyTabs: SyTabsStub,
}

const defaultItems = [
	{ label: 'Accueil', to: '/' },
	{ label: 'À propos', to: '/about' },
	{ label: 'Contact', to: '/contact' },
]

describe('HorizontalNavbar', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('rendu', () => {
		it('rend le composant avec la classe horizontal-menu', () => {
			const wrapper = mount(HorizontalNavbar, {
				global: { stubs },
				props: { items: defaultItems },
			})
			expect(wrapper.find('.horizontal-menu').exists()).toBe(true)
		})

		it('rend autant d\'onglets que d\'items', () => {
			const wrapper = mount(HorizontalNavbar, {
				global: { stubs },
				props: { items: defaultItems },
			})
			expect(wrapper.findAll('.tab-btn')).toHaveLength(3)
		})

		it('rend sans items sans crash', () => {
			const wrapper = mount(HorizontalNavbar, {
				global: { stubs },
				props: { items: [] },
			})
			expect(wrapper.find('.horizontal-menu').exists()).toBe(true)
			expect(wrapper.findAll('.tab-btn')).toHaveLength(0)
		})

		it('applique la largeur personnalisée via le prop width', () => {
			const wrapper = mount(HorizontalNavbar, {
				global: { stubs },
				props: { items: defaultItems, width: '1200px' },
			})
			expect(wrapper.html()).toBeTruthy()
		})
	})

	describe('slots', () => {
		it('rend le slot navigation-bar-prepend', () => {
			const wrapper = mount(HorizontalNavbar, {
				global: { stubs },
				props: { items: defaultItems },
				slots: { 'navigation-bar-prepend': '<span class="prepend-content">Logo</span>' },
			})
			expect(wrapper.find('.prepend-content').exists()).toBe(true)
			expect(wrapper.find('.prepend-content').text()).toBe('Logo')
		})

		it('rend le slot navigation-bar-append', () => {
			const wrapper = mount(HorizontalNavbar, {
				global: { stubs },
				props: { items: defaultItems },
				slots: { 'navigation-bar-append': '<span class="append-content">Actions</span>' },
			})
			expect(wrapper.find('.append-content').exists()).toBe(true)
		})
	})

	describe('handleTabChange', () => {
		it('met à jour activeTab quand un onglet est cliqué', async () => {
			const wrapper = mount(HorizontalNavbar, {
				global: { stubs },
				props: { items: defaultItems },
			})

			await wrapper.findAll('.tab-btn')[1]!.trigger('click')
			await flushPromises()

			const vm = wrapper.vm as unknown as { activeTab: number }
			expect(vm.activeTab).toBe(1)
		})

		it('ne navigue pas via router.push si l\'item est désactivé', async () => {
			const mockPush = vi.fn()
			const items = [
				{ label: 'Accueil', to: '/' },
				{ label: 'Désactivé', to: '/disabled', disabled: true },
			]
			const wrapper = mount(HorizontalNavbar, {
				global: {
					stubs,
					mocks: { $router: { push: mockPush, currentRoute: { value: { path: '/' } } } },
				},
				props: { items },
			})

			await wrapper.findAll('.tab-btn')[1]!.trigger('click')
			await flushPromises()

			expect(mockPush).not.toHaveBeenCalled()
		})

		it('émet cancel-navigation depuis SyTabs', async () => {
			const wrapper = mount(HorizontalNavbar, {
				global: { stubs },
				props: { items: defaultItems },
			})

			wrapper.findComponent(SyTabsStub).vm.$emit('cancel-navigation')
			await flushPromises()

			expect(wrapper.emitted('cancel-navigation')).toBeTruthy()
		})
	})

	describe('confirmTabChange', () => {
		it('transmet confirmTabChange=true à SyTabs', () => {
			const wrapper = mount(HorizontalNavbar, {
				global: { stubs },
				props: { items: defaultItems, confirmTabChange: true },
			})

			const tabs = wrapper.findComponent(SyTabsStub)
			expect(tabs.props('confirmTabChange')).toBe(true)
		})

		it('transmet un confirmationMessage string à SyTabs', () => {
			const wrapper = mount(HorizontalNavbar, {
				global: { stubs },
				props: {
					items: defaultItems,
					confirmTabChange: true,
					confirmationMessage: 'Voulez-vous continuer ?',
				},
			})

			const tabs = wrapper.findComponent(SyTabsStub)
			expect(tabs.props('confirmationMessage')).toBe('Voulez-vous continuer ?')
		})

		it('formattedConfirmationMessage est undefined si confirmationMessage est un booléen', () => {
			const wrapper = mount(HorizontalNavbar, {
				global: { stubs },
				props: {
					items: defaultItems,
					confirmTabChange: true,
					confirmationMessage: true,
				},
			})

			const tabs = wrapper.findComponent(SyTabsStub)
			expect(tabs.props('confirmationMessage')).toBeUndefined()
		})

		it('émet confirm-tab-change avec le message et le callback', async () => {
			const wrapper = mount(HorizontalNavbar, {
				global: { stubs },
				props: { items: defaultItems, confirmTabChange: true },
			})

			const callback = vi.fn()
			wrapper.findComponent(SyTabsStub).vm.$emit('confirm-tab-change', 'Message', callback)
			await flushPromises()

			expect(wrapper.emitted('confirm-tab-change')).toBeTruthy()
			const [msg, cb] = wrapper.emitted('confirm-tab-change')![0] as [string, () => void]
			expect(msg).toBe('Message')
			expect(cb).toBe(callback)
		})
	})

	describe('resetTabSelection', () => {
		it('retourne activeTab=-1 et activeItemIndex=-1 si items est vide', () => {
			const wrapper = mount(HorizontalNavbar, {
				global: { stubs },
				props: { items: [] },
			})

			const vm = wrapper.vm as unknown as { resetTabSelection: () => { activeTab: number, activeItemIndex: number } }
			const result = vm.resetTabSelection()
			expect(result.activeTab).toBe(-1)
			expect(result.activeItemIndex).toBe(-1)
		})

		it('est exposée et appelable depuis l\'extérieur', () => {
			const wrapper = mount(HorizontalNavbar, {
				global: { stubs },
				props: { items: defaultItems },
			})

			const vm = wrapper.vm as unknown as { resetTabSelection: () => unknown }
			expect(typeof vm.resetTabSelection).toBe('function')
			expect(() => vm.resetTabSelection()).not.toThrow()
		})
	})

	describe('isActive', () => {
		it('retourne false pour un item désactivé', () => {
			const wrapper = mount(HorizontalNavbar, {
				global: { stubs },
				props: {
					items: [{ label: 'Test', to: '/', disabled: true }],
				},
			})

			const vm = wrapper.vm as unknown as {
				isActive: (item: { label: string, to: string, disabled?: boolean }, index: number) => boolean
			}
			expect(vm.isActive({ label: 'Test', to: '/', disabled: true }, 0)).toBe(false)
		})
	})
})
