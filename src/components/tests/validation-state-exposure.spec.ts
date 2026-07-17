import { mount, shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { isReadonly, type Component } from 'vue'
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

type ValidationStateVm = {
	errors: string[]
	warnings: string[]
	successes: string[]
}

const validationScenarios = [
	{
		name: 'error',
		props: {
			customRules: [{
				type: 'custom' as const,
				options: { validate: () => false, message: 'Erreur custom exposee' },
			}],
		},
		expected: { errors: ['Erreur custom exposee'], warnings: [], successes: [] },
	},
	{
		name: 'warning',
		props: {
			customWarningRules: [{
				type: 'custom' as const,
				options: { validate: () => false, warningMessage: 'Avertissement custom expose' },
			}],
		},
		expected: { errors: [], warnings: ['Avertissement custom expose'], successes: [] },
	},
	{
		name: 'success',
		props: {
			showSuccessMessages: true,
			customSuccessRules: [{
				type: 'custom' as const,
				options: { validate: () => true, successMessage: 'Succes custom expose' },
			}],
		},
		expected: { errors: [], warnings: [], successes: ['Succes custom expose'] },
	},
]

const fieldsWithCustomRules: Array<{ name: string, component: Component, props?: Record<string, unknown> }> = [
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

describe('validation state exposure', () => {
	it.each(validationScenarios)('$name state is exposed when calculated by custom rules', async ({ props: validationProps, expected }) => {
		for (const { name, component, props } of fieldsWithCustomRules) {
			const wrapper = component !== Captcha
				? mount(component, { props: { ...props, ...validationProps } })
				: shallowMount(component, { props: { ...props, ...validationProps } })
			await (wrapper.vm as unknown as { validateOnSubmit: () => Promise<boolean> }).validateOnSubmit()

			const vm = wrapper.vm as unknown as ValidationStateVm
			expect(isReadonly(vm.errors)).toBe(true)
			expect(isReadonly(vm.warnings)).toBe(true)
			expect(isReadonly(vm.successes)).toBe(true)
			for (const [state, messages] of Object.entries(expected) as Array<[keyof ValidationStateVm, string[]]>) {
				if (messages.length === 0) {
					expect(vm[state], name).toEqual([])
				}
				else {
					expect(vm[state], name).toContain(messages[0])
				}
			}
			wrapper.unmount()
		}
	})
})
