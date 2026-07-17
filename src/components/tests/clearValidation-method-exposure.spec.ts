import { mount, shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { type Component } from 'vue'
import Captcha from '@/components/Captcha/Captcha.vue'
import SelectBtnField from '@/components/Customs/Selects/SelectBtnField/SelectBtnField.vue'
import SySelect from '@/components/Customs/Selects/SySelect/SySelect.vue'
import SyCheckBoxGroup from '@/components/Customs/SyCheckBoxGroup/SyCheckBoxGroup.vue'
import SyCheckbox from '@/components/Customs/SyCheckbox/SyCheckbox.vue'
import SyRadioGroup from '@/components/Customs/SyRadioGroup/SyRadioGroup.vue'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
import MonthPicker from '@/components/MonthPicker/MonthPicker.vue'
import PasswordField from '@/components/PasswordField/PasswordField.vue'
import PhoneField from '@/components/PhoneField/PhoneField.vue'
import SyTextArea from '@/components/SyTextArea/SyTextArea.vue'

const fieldsWithClearValidation: Array<{ name: string, component: Component, props?: Record<string, unknown> }> = [
	{ name: 'Captcha', component: Captcha, props: { modelValue: 'captcha', urlCreate: '/captcha.json', urlGetImage: '/captcha.png', urlGetAudio: '/captcha.mp3', label: 'Captcha' } },
	{ name: 'SelectBtnField', component: SelectBtnField, props: { label: 'Select' } },
	{ name: 'SySelect', component: SySelect, props: { label: 'Select' } },
	{ name: 'SyCheckBoxGroup', component: SyCheckBoxGroup, props: { label: 'Select' } },
	{ name: 'SyCheckbox', component: SyCheckbox, props: { label: 'Selection' } },
	{ name: 'SyRadioGroup', component: SyRadioGroup, props: { label: 'Choix' } },
	{ name: 'SyTextField', component: SyTextField, props: { label: 'Nom' } },
	{ name: 'MonthPicker', component: MonthPicker, props: { label: 'Mois' } },
	{ name: 'PasswordField', component: PasswordField, props: { label: 'Mot de passe' } },
	{ name: 'PhoneField', component: PhoneField, props: { label: 'Téléphone', modelValue: '0612345678' } },
	{ name: 'SyTextArea', component: SyTextArea, props: { label: 'Description', modelValue: 'Description valide' } },
]

describe('clearValidation method exposure', () => {
	it.each(fieldsWithClearValidation)('$name has clearValidation() method exposed', ({ component, props }) => {
		const wrapper = component !== Captcha
			? mount(component, { props })
			: shallowMount(component, { props })

		expect(typeof wrapper.vm.clearValidation).toBe('function')
		expect(wrapper.vm.clearValidation).toBeDefined()
		wrapper.unmount()
	})

	it.each(fieldsWithClearValidation)('$name.clearValidation() method can be called', ({ component, props }) => {
		const wrapper = component !== Captcha
			? mount(component, { props })
			: shallowMount(component, { props })

		// Just verify that calling clearValidation() doesn't throw an error
		expect(() => {
			(wrapper.vm as { clearValidation: () => void }).clearValidation()
		}).not.toThrow()

		wrapper.unmount()
	})
})
