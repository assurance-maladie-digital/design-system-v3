import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import SyInputSelect from '../SyInputSelect.vue'

const items = [
	{ text: 'Option 1', value: '1' },
	{ text: 'Option 2', value: '2' },
]

describe('SyInputSelect – accessibility (axe)', () => {
	it('has no axe violations – default', async () => {
		const wrapper = mount(SyInputSelect, {
			props: { label: 'Sélectionnez une option', items },
		})
		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyInputSelect – default', {
			ignoreRules: ['region'],
		})
		wrapper.unmount()
	})

	it('has no axe violations – outlined false (variante texte)', async () => {
		const wrapper = mount(SyInputSelect, {
			props: { label: 'Sélectionnez une option', items, outlined: false },
		})
		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyInputSelect – outlined false', {
			ignoreRules: ['region'],
		})
		wrapper.unmount()
	})

	it('has no axe violations – valeur sélectionnée', async () => {
		const wrapper = mount(SyInputSelect, {
			props: { label: 'Sélectionnez une option', items, modelValue: items[0] },
		})
		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyInputSelect – selected', {
			ignoreRules: ['region'],
		})
		wrapper.unmount()
	})

	it('has no axe violations – requis avec astérisque affiché', async () => {
		const wrapper = mount(SyInputSelect, {
			props: {
				label: 'Sélectionnez une option',
				items,
				required: true,
				displayAsterisk: true,
			},
		})
		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyInputSelect – required asterisk', {
			ignoreRules: ['region'],
		})
		wrapper.unmount()
	})

	it('has no axe violations – état erreur', async () => {
		const wrapper = mount(SyInputSelect, {
			props: {
				label: 'Sélectionnez une option',
				items,
				required: true,
				errorMessages: ['Ce champ est requis'],
			},
		})
		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyInputSelect – error', {
			ignoreRules: ['region'],
		})
		wrapper.unmount()
	})

	it('has no axe violations – readonly', async () => {
		const wrapper = mount(SyInputSelect, {
			props: {
				label: 'Sélectionnez une option',
				items,
				readonly: true,
				modelValue: items[0],
			},
		})
		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyInputSelect – readonly', {
			ignoreRules: ['region'],
		})
		wrapper.unmount()
	})

	// it('has no axe violations – clearable avec sélection', async () => {
	// 	const wrapper = mount(SyInputSelect, {
	// 		props: {
	// 			label: 'Sélectionnez une option',
	// 			items,
	// 			clearable: true,
	// 			modelValue: items[0],
	// 		},
	// 	})
	// 	const results = await axe(wrapper.element as HTMLElement)
	// 	assertNoA11yViolations(results, 'SyInputSelect – clearable with selection', {
	// 		ignoreRules: ['region'],
	// 	})
	// 	wrapper.unmount()
	// })

	it('has no axe violations – menu ouvert', async () => {
		const wrapper = mount(SyInputSelect, {
			props: { label: 'Sélectionnez une option', items },
		})
		await wrapper.find('.sy-input-select').trigger('click')
		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyInputSelect – menu open', {
			ignoreRules: ['region'],
		})
		wrapper.unmount()
	})

	it('has no axe violations – menu ouvert dans un header toolbar', async () => {
		const wrapper = mount(SyInputSelect, {
			props: { label: 'Sélectionnez une option', items, isHeaderToolbar: true },
		})
		await wrapper.find('.sy-input-select').trigger('click')
		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyInputSelect – header toolbar menu open', {
			ignoreRules: ['region'],
		})
		wrapper.unmount()
	})

	it('has no axe violations après ouverture au clavier (Enter)', async () => {
		const wrapper = mount(SyInputSelect, {
			props: { label: 'Sélectionnez une option', items },
		})
		await wrapper.find('.sy-input-select').trigger('keydown.enter')
		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyInputSelect – after Enter keydown', {
			ignoreRules: ['region'],
		})
		wrapper.unmount()
	})

	it('has no axe violations après navigation clavier (ArrowDown) dans la liste', async () => {
		const wrapper = mount(SyInputSelect, {
			props: { label: 'Sélectionnez une option', items },
		})
		await wrapper.find('.sy-input-select').trigger('click')
		await wrapper.find('[role="listbox"]').trigger('keydown', { key: 'ArrowDown' })
		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyInputSelect – after ArrowDown', {
			ignoreRules: ['region'],
		})
		wrapper.unmount()
	})

	it('has no axe violations après fermeture au clavier (Escape)', async () => {
		const wrapper = mount(SyInputSelect, {
			props: { label: 'Sélectionnez une option', items },
		})
		await wrapper.find('.sy-input-select').trigger('click')
		await wrapper.find('[role="listbox"]').trigger('keydown', { key: 'Escape' })
		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyInputSelect – after Escape keydown', {
			ignoreRules: ['region'],
		})
		wrapper.unmount()
	})

	// it('has no axe violations – locales personnalisées (clearLabel)', async () => {
	// 	const wrapper = mount(SyInputSelect, {
	// 		props: {
	// 			label: 'Sélectionnez une option',
	// 			items,
	// 			clearable: true,
	// 			modelValue: items[0],
	// 			locales: { clearLabel: 'Réinitialiser' },
	// 		},
	// 	})
	// 	const results = await axe(wrapper.element as HTMLElement)
	// 	assertNoA11yViolations(results, 'SyInputSelect – custom clear locale', {
	// 		ignoreRules: ['region'],
	// 	})
	// 	wrapper.unmount()
	// })
})
