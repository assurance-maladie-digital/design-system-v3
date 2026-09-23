import { mount, type VueWrapper } from '@vue/test-utils'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import DatePicker from '../DatePicker.vue'
import SyForm from '@/components/Customs/SyForm/SyForm.vue'

type DatePickerInstance = InstanceType<typeof DatePicker>
type SyFormInstance = InstanceType<typeof SyForm>

let wrapper: VueWrapper | null = null

beforeEach(() => {
	wrapper = null
})

afterEach(() => {
	wrapper?.unmount()
	wrapper = null
})

describe('DatePicker CalendarMode - clearValidation()', () => {
	describe('API publique', () => {
		it('expose la méthode clearValidation', () => {
			wrapper = mount(DatePicker, {
				props: { modelValue: null, label: 'Date de test' },
				global: {
					stubs: {
						VDatePicker: { template: '<div class="v-date-picker-mock"></div>' },
						VMenu: { template: '<div class="v-menu-mock"><slot name="activator"></slot><slot></slot></div>' },
					},
				},
			})

			const vm = wrapper.vm as unknown as { clearValidation: () => void }
			expect(typeof vm.clearValidation).toBe('function')
		})

		it('expose clearValidation via SyForm', () => {
			const localWrapper = mount({
				components: { SyForm, DatePicker },
				template: `<SyForm ref="form"><DatePicker ref="datePicker" v-model="dateValue" label="Date" /></SyForm>`,
				data() { return { dateValue: null } },
				global: {
					stubs: {
						VDatePicker: { template: '<div class="v-date-picker-mock"></div>' },
						VMenu: { template: '<div class="v-menu-mock"><slot name="activator"></slot><slot></slot></div>' },
					},
				},
			})

			const form = localWrapper.vm.$refs.form as SyFormInstance
			expect(typeof form.clearValidation).toBe('function')
			localWrapper.unmount()
		})
	})

	describe('Mode Calendar (par défaut)', () => {
		it('clearValidation() vide les messages derreur après validateOnSubmit()', async () => {
			wrapper = mount(DatePicker, {
				props: { modelValue: null, label: 'Date de test', required: true },
				global: {
					stubs: {
						VDatePicker: { template: '<div class="v-date-picker-mock"></div>' },
						VMenu: { template: '<div class="v-menu-mock"><slot name="activator"></slot><slot></slot></div>' },
					},
				},
			})

			const vm = wrapper.vm as DatePickerInstance

			await vm.validateOnSubmit()
			await nextTick()

			expect(vm.errorMessages.length).toBeGreaterThan(0)

			vm.clearValidation()
			await nextTick()

			expect(vm.errorMessages).toEqual([])
		})

		it('SyForm.clearValidation() vide les erreurs du DatePicker', async () => {
			const localWrapper = mount({
				components: { SyForm, DatePicker },
				template: `<SyForm ref="form"><DatePicker ref="datePicker" v-model="dateValue" label="Date" required /></SyForm>`,
				data() { return { dateValue: null } },
				global: {
					stubs: {
						VDatePicker: { template: '<div class="v-date-picker-mock"></div>' },
						VMenu: { template: '<div class="v-menu-mock"><slot name="activator"></slot><slot></slot></div>' },
					},
				},
			})

			const form = localWrapper.vm.$refs.form as SyFormInstance
			const datePicker = localWrapper.vm.$refs.datePicker as DatePickerInstance

			await datePicker.validateOnSubmit()
			await nextTick()

			expect(datePicker.errorMessages.length).toBeGreaterThan(0)

			form.clearValidation()
			await nextTick()

			expect(datePicker.errorMessages).toEqual([])
			localWrapper.unmount()
		})
	})

	describe('SyTextField interne', () => {
		it('les erreurs du SyTextField interne sont vidées lors de clearValidation() en mode Calendar', async () => {
			wrapper = mount(DatePicker, {
				props: { modelValue: null, label: 'Date de test', required: true },
				global: {
					stubs: {
						VDatePicker: { template: '<div class="v-date-picker-mock"></div>' },
						VMenu: { template: '<div class="v-menu-mock"><slot name="activator"></slot><slot></slot></div>' },
					},
				},
				attachTo: document.body,
			})

			const vm = wrapper.vm as unknown as {
				clearValidation: () => void
				errorMessages: string[]
				dateCalendarTextInputRef: { value?: { errorMessages?: string[], clearValidation?: () => void } }
			}

			await vm.validateOnSubmit()
			await nextTick()

			expect(vm.errorMessages.length).toBeGreaterThan(0)

			vm.clearValidation()
			await nextTick()

			expect(vm.errorMessages).toEqual([])

			if (vm.dateCalendarTextInputRef?.value?.errorMessages) {
				expect(vm.dateCalendarTextInputRef.value.errorMessages).toEqual([])
			}

			wrapper.unmount()
		})
	})
})
