import { mount } from '@vue/test-utils'
import { defineComponent, h, onMounted } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { Required, Multiple, MultipleRequired, Readonly, EventShowcase } from '../SyCheckBoxGroup.stories'
import { CustomRules, MultipleSelectionValidation, WithError, WithSuccess } from '../Validation/Validation.stories'

const CheckBoxGroupStub = defineComponent({
	props: {
		label: { type: String, default: '' },
		multiple: { type: Boolean, default: false },
		showSuccessMessages: { type: Boolean, default: false },
	},
	emits: ['update:modelValue'],
	setup(_, { emit }) {
		onMounted(() => emit('update:modelValue', 'B'))
		return () => h('div')
	},
})

describe('SyCheckBoxGroup stories', () => {
	it('keeps required and multiple scenario props bound to story args', () => {
		expect(Required.args?.required).toBe(true)
		expect(Required.render?.(Required.args ?? {})).toMatchObject({
			template: expect.stringContaining('v-bind="args"'),
		})

		expect(Multiple.args?.multiple).toBe(true)
		expect(Multiple.render?.(Multiple.args ?? {})).toMatchObject({
			template: expect.stringContaining('v-bind="args"'),
		})

		expect(MultipleRequired.args?.multiple).toBe(true)
		expect(MultipleRequired.args?.required).toBe(true)
		expect(MultipleRequired.argTypes?.multiple).toMatchObject({ control: false })
		expect(MultipleRequired.render?.(MultipleRequired.args ?? {})).toMatchObject({
			template: expect.stringContaining('v-bind="args"'),
		})
	})

	it('binds the readonly label and EventShowcase controls to their components', () => {
		expect(Readonly.args?.label).toBe('CheckBoxGroup en lecture seule')
		expect(Readonly.render?.(Readonly.args ?? {})).toMatchObject({
			template: expect.stringContaining('v-bind="args"'),
		})

		expect(EventShowcase.args?.multiple).toBe(true)
		expect(EventShowcase.render?.(EventShowcase.args ?? {})).toMatchObject({
			template: expect.stringContaining('v-bind="args"'),
		})
	})

	it.each([true, false])('passes multiple=%s from EventShowcase Controls', (multiple) => {
		const renderedStory = EventShowcase.render?.({ ...EventShowcase.args, multiple })
		if (!renderedStory) {
			throw new Error('EventShowcase story must provide a render result')
		}

		const wrapper = mount({
			...renderedStory,
			components: { SyCheckBoxGroup: CheckBoxGroupStub },
		})

		expect(wrapper.findComponent(CheckBoxGroupStub).props('multiple')).toBe(multiple)
	})

	it('keeps validation controls effective and locks required multiple mode', () => {
		expect(WithSuccess.args?.showSuccessMessages).toBe(true)
		expect(WithSuccess.render?.(WithSuccess.args ?? {})).toMatchObject({
			template: expect.stringContaining('v-bind="args"'),
		})

		expect(WithError.args?.multiple).toBe(true)
		expect(WithError.argTypes?.multiple).toMatchObject({ control: false })
		expect(MultipleSelectionValidation.args?.multiple).toBe(true)
		expect(MultipleSelectionValidation.argTypes?.multiple).toMatchObject({ control: false })
	})

	it('applies CustomRules args and forwards model updates to Actions', () => {
		const onUpdate = vi.fn()
		const renderedStory = CustomRules.render?.({
			...CustomRules.args,
			'label': 'Contrôle lié',
			'multiple': true,
			'showSuccessMessages': false,
			'onUpdate:modelValue': onUpdate,
		})
		if (!renderedStory) {
			throw new Error('CustomRules story must provide a render result')
		}

		const wrapper = mount({
			...renderedStory,
			components: { SyCheckBoxGroup: CheckBoxGroupStub },
		})

		const checkBoxGroup = wrapper.findComponent(CheckBoxGroupStub)
		expect(checkBoxGroup.props('label')).toBe('Contrôle lié')
		expect(checkBoxGroup.props('multiple')).toBe(true)
		expect(checkBoxGroup.props('showSuccessMessages')).toBe(false)
		expect(onUpdate).toHaveBeenCalledWith('B')
	})
})
