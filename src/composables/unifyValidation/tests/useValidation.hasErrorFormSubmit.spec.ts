/* eslint-disable vue/one-component-per-file */
import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import { useValidation } from '../useValidation'
import SyForm from '@/components/Customs/SyForm/SyForm.vue'

// `has-error` (erreur forcée sans message) doit invalider le champ auprès du SyForm
// comme une erreur injectée — cf. SyForm.mdx : « un état forcé via has-error invalide
// le champ ». Avec le littéral `useVuetifyValidation: false`, aucun item VForm n'est
// enregistré : le blocage ne doit pas dépendre du validateur Vuetify.
const FieldWithHasError = defineComponent({
	setup() {
		useValidation({
			modelValue: ref<unknown>('valeur valide'),
			readonly: ref(false),
			disabled: ref(false),
			required: ref(false),
			isValidateOnBlur: ref(true),
			showSuccessMessages: ref(false),
			disableErrorHandling: ref(false),
			label: ref('Champ'),
			focused: ref(false),
			errorMessages: ref<string[] | null>(null),
			hasErrorProp: ref(true),
			useVuetifyValidation: false,
			customRules: ref([]),
		})
		return () => h('input')
	},
})

const FormWithHasErrorField = defineComponent({
	emits: ['submit'],
	setup(_, { emit }) {
		return () => h(SyForm, {
			onSubmit: (payload: { isValid: boolean }) => emit('submit', payload),
		}, {
			default: () => h(FieldWithHasError),
		})
	},
})

describe('useValidation with hasErrorProp and useVuetifyValidation = false (literal)', () => {
	it('blocks the SyForm submit', async () => {
		const wrapper = mount(FormWithHasErrorField)
		await flushPromises()
		await nextTick()

		await wrapper.find('form').trigger('submit')
		await flushPromises()
		await nextTick()

		expect(wrapper.emitted('submit')?.at(-1)?.[0]).toEqual({ isValid: false })
	})
})
