import { describe, expect, it } from 'vitest'
import LunarCalendar from '../LunarCalendar.vue'
import { flushPromises, mount } from '@vue/test-utils'

describe('LunarCalendar', () => {
	it('renders correctly', () => {
		const wrapper = mount(LunarCalendar, {
			props: {
				label: 'Date de naissance',
				modelValue: '10/19/1995',
			},
		})

		expect(wrapper.exists()).toBe(true)
		expect(wrapper.html()).toContain('10/19/1995')
	})

	it('emits update:modelValue on date change', async () => {
		const wrapper = mount(LunarCalendar, {
			props: {
				label: 'Date de naissance',
				modelValue: '10/19/1995',
			},
		})

		wrapper.find('input').setValue('11/20/1995')

		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
		expect(wrapper.emitted('update:modelValue')![0]).toEqual(['11/20/1995'])
	})

	it('autoformats date input', async () => {
		const wrapper = mount(LunarCalendar, {
			props: {
				label: 'Date de naissance',
				modelValue: '',
			},
		})

		const input = wrapper.find('input')
		await input.setValue('11201995')

		expect(input.element.value).toBe('11/20/1995')
	})

	describe('rules', () => {
		it('validates minDate rule', async () => {
			const wrapper = mount(LunarCalendar, {
				props: {
					modelValue: '10/19/1995',
					minYear: 1996,
					label: 'Date de naissance',
				},
			})

			await (wrapper.vm.validateOnSubmit as () => Promise<boolean>)()
			await flushPromises()
			await wrapper.vm.$nextTick()
			await wrapper.vm.$nextTick()

			expect(wrapper.html()).toContain('L\'année doit être supérieure ou égale à 1996.')
		})

		it('validates maxDate rule', async () => {
			const wrapper = mount(LunarCalendar, {
				props: {
					label: 'Date de naissance',
					modelValue: '10/19/1995',
					maxYear: 1994,
				},
			})

			await (wrapper.vm.validateOnSubmit as () => Promise<boolean>)()
			await flushPromises()
			await wrapper.vm.$nextTick()
			await wrapper.vm.$nextTick()

			expect(wrapper.html()).toContain('L\'année doit être inférieure ou égale à 1994.')
		})

		it('displays success messages when showSuccessMessages is true', async () => {
			const successRule = {
				type: 'custom',
				options: {
					validate: (value: string) => {
						const regex = /^\d{2}\/\d{2}\/\d{4}$/
						return regex.test(value)
					},
					successMessage: 'Date format valide',
				},
			}

			const wrapper = mount(LunarCalendar, {
				props: {
					label: 'Date de naissance',
					modelValue: '10/19/1995',
					showSuccessMessages: true,
					customSuccessRules: [successRule],
				},
			})

			await (wrapper.vm.validateOnSubmit as () => Promise<boolean>)()
			await flushPromises()
			await wrapper.vm.$nextTick()

			expect(wrapper.html()).toContain('Date format valide')
		})

		it('displays success messages when showSuccessMessages is true', async () => {
			const successRule = {
				type: 'custom',
				options: {
					validate: (value: string) => {
						const regex = /^\d{2}\/\d{2}\/\d{4}$/
						return regex.test(value)
					},
					successMessage: 'Date format valide',
				},
			}

			const wrapper = mount(LunarCalendar, {
				props: {
					label: 'Date de naissance',
					modelValue: '10/19/1995',
					showSuccessMessages: true,
					customSuccessRules: [successRule],
				},
			})

			await (wrapper.vm.validateOnSubmit as unknown as () => Promise<boolean>)()
			await flushPromises()
			await wrapper.vm.$nextTick()

			expect(wrapper.html()).toContain('Date format valide')
		})
	})

	describe('new props iso SyTextField', () => {
		it('renders with helpText', () => {
			const wrapper = mount(LunarCalendar, {
				props: {
					label: 'Date de naissance',
					modelValue: '10/19/1995',
					helpText: 'Format attendu : JJ/MM/AAAA',
				},
			})

			expect(wrapper.html()).toContain('Format attendu : JJ/MM/AAAA')
		})

		it('renders with noIcon', () => {
			const wrapper = mount(LunarCalendar, {
				props: {
					label: 'Date de naissance',
					modelValue: '10/19/1995',
					noIcon: true,
				},
			})

			// Vérifie que l'icône n'est pas présente
			expect(wrapper.findComponent({ name: 'SyIcon' }).exists()).toBe(false)
		})

		it('renders with displayAsterisk when required', () => {
			const wrapper = mount(LunarCalendar, {
				props: {
					label: 'Date de naissance',
					modelValue: '',
					required: true,
					displayAsterisk: true,
				},
			})

			// Vérifie que l'astérisque est présent dans le label
			expect(wrapper.html()).toContain('*')
		})

		it('renders with loading state', () => {
			const wrapper = mount(LunarCalendar, {
				props: {
					label: 'Date de naissance',
					modelValue: '10/19/1995',
					loading: true,
				},
			})

			// Vérifie que le champ a l'attribut loading ou la classe correspondante
			expect(wrapper.findComponent({ name: 'SyTextField' }).props('loading')).toBe(true)
		})

		it('renders with disabled state', () => {
			const wrapper = mount(LunarCalendar, {
				props: {
					label: 'Date de naissance',
					modelValue: '10/19/1995',
					disabled: true,
				},
			})

			const input = wrapper.find('input')
			expect(input.attributes('disabled')).toBeDefined()
		})

		it('renders with readonly state', () => {
			const wrapper = mount(LunarCalendar, {
				props: {
					label: 'Date de naissance',
					modelValue: '10/19/1995',
					readonly: true,
				},
			})

			const input = wrapper.find('input')
			expect(input.attributes('readonly')).toBeDefined()
		})

		it('renders with custom variantStyle', () => {
			const wrapper = mount(LunarCalendar, {
				props: {
					label: 'Date de naissance',
					modelValue: '10/19/1995',
					variantStyle: 'filled',
				},
			})

			expect(wrapper.findComponent({ name: 'SyTextField' }).props('variantStyle')).toBe('filled')
		})

		it('renders with custom color', () => {
			const wrapper = mount(LunarCalendar, {
				props: {
					label: 'Date de naissance',
					modelValue: '10/19/1995',
					color: 'secondary',
				},
			})

			expect(wrapper.findComponent({ name: 'SyTextField' }).props('color')).toBe('secondary')
		})

		it('renders with custom density', () => {
			const wrapper = mount(LunarCalendar, {
				props: {
					label: 'Date de naissance',
					modelValue: '10/19/1995',
					density: 'compact',
				},
			})

			expect(wrapper.findComponent({ name: 'SyTextField' }).props('density')).toBe('compact')
		})

		it('renders with hint when focused', async () => {
			const wrapper = mount(LunarCalendar, {
				props: {
					label: 'Date de naissance',
					modelValue: '10/19/1995',
					hint: 'Ceci est un hint',
				},
			})

			// Le hint s'affiche quand le champ est focus
			await wrapper.find('input').trigger('focus')
			await flushPromises()
			await wrapper.vm.$nextTick()
			await wrapper.vm.$nextTick()
			await wrapper.vm.$nextTick()

			expect(wrapper.html()).toContain('Ceci est un hint')
		})
	})
})
