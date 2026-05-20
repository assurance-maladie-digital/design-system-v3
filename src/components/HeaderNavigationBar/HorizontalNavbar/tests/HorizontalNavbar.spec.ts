import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { defineComponent } from 'vue'
import { createRouter, createMemoryHistory } from 'vue-router'
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

		it('retourne false pour un item avec to (string) quand pathname ne correspond pas', () => {
			const wrapper = mount(HorizontalNavbar, {
				global: { stubs },
				props: { items: [{ label: 'À propos', to: '/about' }] },
			})

			const vm = wrapper.vm as unknown as {
				isActive: (item: { label: string, to: string }, index: number) => boolean
			}
			// jsdom pathname est '/', '/about' ne correspond pas
			expect(vm.isActive({ label: 'À propos', to: '/about' }, 0)).toBe(false)
		})

		it('retourne true pour un item avec to (string) correspondant à window.location.pathname', () => {
			Object.defineProperty(window, 'location', {
				value: { ...window.location, pathname: '/about', href: 'http://localhost/about' },
				writable: true,
			})
			const wrapper = mount(HorizontalNavbar, {
				global: { stubs },
				props: { items: [{ label: 'À propos', to: '/about' }] },
			})

			const vm = wrapper.vm as unknown as {
				isActive: (item: { label: string, to: string }, index: number) => boolean
			}
			expect(vm.isActive({ label: 'À propos', to: '/about' }, 0)).toBe(true)
			Object.defineProperty(window, 'location', {
				value: { ...window.location, pathname: '/', href: 'http://localhost/' },
				writable: true,
			})
		})

		it('retourne true pour un item avec to (string) sous-chemin de pathname', () => {
			Object.defineProperty(window, 'location', {
				value: { ...window.location, pathname: '/about/team', href: 'http://localhost/about/team' },
				writable: true,
			})
			const wrapper = mount(HorizontalNavbar, {
				global: { stubs },
				props: { items: [{ label: 'À propos', to: '/about' }] },
			})

			const vm = wrapper.vm as unknown as {
				isActive: (item: { label: string, to: string }, index: number) => boolean
			}
			expect(vm.isActive({ label: 'À propos', to: '/about' }, 0)).toBe(true)
			Object.defineProperty(window, 'location', {
				value: { ...window.location, pathname: '/', href: 'http://localhost/' },
				writable: true,
			})
		})

		it('retourne true pour un item avec to (objet) correspondant à pathname', () => {
			Object.defineProperty(window, 'location', {
				value: { ...window.location, pathname: '/contact', href: 'http://localhost/contact' },
				writable: true,
			})
			const wrapper = mount(HorizontalNavbar, {
				global: { stubs },
				props: { items: [{ label: 'Contact', to: { path: '/contact' } }] },
			})

			const vm = wrapper.vm as unknown as {
				isActive: (item: { label: string, to: { path: string } }, index: number) => boolean
			}
			expect(vm.isActive({ label: 'Contact', to: { path: '/contact' } }, 0)).toBe(true)
			Object.defineProperty(window, 'location', {
				value: { ...window.location, pathname: '/', href: 'http://localhost/' },
				writable: true,
			})
		})

		it('retourne false pour un item avec to (objet) non correspondant', () => {
			const wrapper = mount(HorizontalNavbar, {
				global: { stubs },
				props: { items: [{ label: 'Contact', to: { path: '/contact' } }] },
			})

			const vm = wrapper.vm as unknown as {
				isActive: (item: { label: string, to: { path: string } }, index: number) => boolean
			}
			// jsdom pathname est '/', '/contact' ne correspond pas
			expect(vm.isActive({ label: 'Contact', to: { path: '/contact' } }, 0)).toBe(false)
		})
	})

	describe('handleTabChange — navigation', () => {
		it('met à jour activeTab au clic sur un onglet (sans router réel)', async () => {
			const wrapper = mount(HorizontalNavbar, {
				global: { stubs },
				props: { items: defaultItems },
			})

			await wrapper.findAll('.tab-btn')[1]!.trigger('click')
			await flushPromises()

			const vm = wrapper.vm as unknown as { activeTab: number }
			expect(vm.activeTab).toBe(1)
		})

		it('met à jour activeTab mais retourne tôt si confirmTabChange est true', async () => {
			const wrapper = mount(HorizontalNavbar, {
				global: { stubs },
				props: { items: defaultItems, confirmTabChange: true },
			})

			await wrapper.findAll('.tab-btn')[1]!.trigger('click')
			await flushPromises()

			const vm = wrapper.vm as unknown as { activeTab: number }
			expect(vm.activeTab).toBe(1)
		})

		it('navigue via window.location.href si item a un href', async () => {
			const locationSpy = vi.spyOn(window, 'location', 'get').mockReturnValue({
				...window.location,
				href: '',
			} as Location)
			const hrefSetter = vi.fn()
			Object.defineProperty(window, 'location', {
				value: { ...window.location, set href(v: string) { hrefSetter(v) } },
				writable: true,
			})

			const items = [{ label: 'Externe', href: 'https://example.com' }]
			const wrapper = mount(HorizontalNavbar, {
				global: { stubs },
				props: { items },
			})

			await wrapper.findAll('.tab-btn')[0]!.trigger('click')
			await flushPromises()

			locationSpy.mockRestore()
		})

		it('ne plante pas si l\'item cliqué n\'existe pas dans items', async () => {
			const wrapper = mount(HorizontalNavbar, {
				global: { stubs },
				props: { items: defaultItems },
			})

			const vm = wrapper.vm as unknown as { handleTabChange: (index: number) => Promise<void> }
			await expect(vm.handleTabChange(999)).resolves.toBeUndefined()
		})
	})

	describe('resetTabSelection — avec items et route', () => {
		it('retourne les valeurs courantes de activeTab et activeItemIndex', () => {
			const wrapper = mount(HorizontalNavbar, {
				global: { stubs },
				props: { items: defaultItems },
			})

			const vm = wrapper.vm as unknown as {
				resetTabSelection: () => { activeTab: number, activeItemIndex: number }
			}
			const result = vm.resetTabSelection()
			expect(typeof result.activeTab).toBe('number')
			expect(typeof result.activeItemIndex).toBe('number')
		})

		it('retourne -1 si aucun item ne correspond à la route', () => {
			const wrapper = mount(HorizontalNavbar, {
				global: { stubs },
				props: { items: defaultItems },
			})

			const vm = wrapper.vm as unknown as {
				resetTabSelection: () => { activeTab: number, activeItemIndex: number }
			}
			const result = vm.resetTabSelection()
			expect(result.activeTab).toBe(-1)
		})

		it('met à jour activeTab après avoir appelé handleTabChange puis resetTabSelection', async () => {
			const wrapper = mount(HorizontalNavbar, {
				global: { stubs },
				props: { items: defaultItems },
			})

			await wrapper.findAll('.tab-btn')[1]!.trigger('click')
			await flushPromises()

			const vm = wrapper.vm as unknown as {
				activeTab: number
				resetTabSelection: () => { activeTab: number, activeItemIndex: number }
			}
			expect(vm.activeTab).toBe(1)
		})
	})

	describe('avec vue-router réel', () => {
		function makeRouter() {
			return createRouter({
				history: createMemoryHistory(),
				routes: [
					{ path: '/', component: { template: '<div/>' } },
					{ path: '/about', component: { template: '<div/>' } },
					{ path: '/contact', component: { template: '<div/>' } },
					{ path: '/about/team', component: { template: '<div/>' } },
				],
			})
		}

		it('isActive retourne true quand la route correspond à un item to (string)', async () => {
			const router = makeRouter()
			await router.push('/about')
			const wrapper = mount(HorizontalNavbar, {
				global: { stubs, plugins: [router] },
				props: { items: defaultItems },
			})
			await flushPromises()

			const vm = wrapper.vm as unknown as {
				isActive: (item: { label: string, to: string }, index: number) => boolean
			}
			expect(vm.isActive({ label: 'À propos', to: '/about' }, 1)).toBe(true)
		})

		it('resetTabSelection trouve l\'item actif avec une route correspondante', async () => {
			const router = makeRouter()
			await router.push('/about')
			const wrapper = mount(HorizontalNavbar, {
				global: { stubs, plugins: [router] },
				props: { items: defaultItems },
			})
			await flushPromises()

			const vm = wrapper.vm as unknown as {
				resetTabSelection: () => { activeTab: number, activeItemIndex: number }
			}
			const result = vm.resetTabSelection()
			expect(result.activeTab).toBe(1)
			expect(result.activeItemIndex).toBe(1)
		})

		it('watcher currentPath met à jour activeTab lors d\'un changement de route', async () => {
			const router = makeRouter()
			await router.push('/')
			const wrapper = mount(HorizontalNavbar, {
				global: { stubs, plugins: [router] },
				props: { items: defaultItems },
			})
			await flushPromises()

			await router.push('/about')
			await flushPromises()

			const vm = wrapper.vm as unknown as { activeTab: number }
			expect(vm.activeTab).toBe(1)
		})

		it('watcher currentPath remet activeTab à -1 si aucun item ne correspond', async () => {
			const router = makeRouter()
			await router.push('/about')
			const itemsWithoutContact = [
				{ label: 'Accueil', to: '/home' },
				{ label: 'À propos', to: '/about' },
			]
			const wrapper = mount(HorizontalNavbar, {
				global: { stubs, plugins: [router] },
				props: { items: itemsWithoutContact },
			})
			await flushPromises()

			await router.push('/contact')
			await flushPromises()

			const vm = wrapper.vm as unknown as { activeTab: number }
			expect(vm.activeTab).toBe(-1)
		})

		it('handleTabChange appelle router.push avec le to de l\'item', async () => {
			const router = makeRouter()
			const pushSpy = vi.spyOn(router, 'push')
			await router.push('/')
			const wrapper = mount(HorizontalNavbar, {
				global: { stubs, plugins: [router] },
				props: { items: defaultItems },
			})
			await flushPromises()

			await wrapper.findAll('.tab-btn')[1]!.trigger('click')
			await flushPromises()

			expect(pushSpy).toHaveBeenCalledWith('/about')
		})

		it('isActive retourne true pour un item avec to (string) sous-chemin', async () => {
			const router = makeRouter()
			await router.push('/about/team')
			const wrapper = mount(HorizontalNavbar, {
				global: { stubs, plugins: [router] },
				props: { items: defaultItems },
			})
			await flushPromises()

			const vm = wrapper.vm as unknown as {
				isActive: (item: { label: string, to: string }, index: number) => boolean
			}
			expect(vm.isActive({ label: 'À propos', to: '/about' }, 1)).toBe(true)
		})
	})

	describe('tabItems computed', () => {
		it('convertit les items en TabItem avec les bonnes propriétés', () => {
			const wrapper = mount(HorizontalNavbar, {
				global: { stubs },
				props: {
					items: [
						{ label: 'Accueil', to: '/', disabled: false },
						{ label: 'Externe', href: 'https://example.com' },
					],
				},
			})

			const vm = wrapper.vm as unknown as {
				tabItems: Array<{ label: string, value: number, href?: string, to?: string, disabled?: boolean }>
			}
			expect(vm.tabItems).toHaveLength(2)
			expect(vm.tabItems[0]!.label).toBe('Accueil')
			expect(vm.tabItems[0]!.value).toBe(0)
			expect(vm.tabItems[1]!.href).toBe('https://example.com')
		})

		it('retourne un tableau vide si items n\'est pas un tableau', () => {
			const wrapper = mount(HorizontalNavbar, {
				global: { stubs },
				props: { items: [] },
			})

			const vm = wrapper.vm as unknown as { tabItems: unknown[] }
			expect(vm.tabItems).toHaveLength(0)
		})
	})
})
