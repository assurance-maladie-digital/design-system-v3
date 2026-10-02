/* eslint-disable vue/one-component-per-file */
import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'
import SyForm from '../SyForm.vue'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
import { useValidatable } from '@/composables/validation/useValidatable'

// Régression du bug de la page sandbox SyFormVModelPage (onglet Vuetify) :
// le v-model de SyForm passait à true au chargement alors que tous les champs
// vides échouent aux rules Vuetify — les champs en mode Vuetify s'enregistraient
// comme composants custom avec un tri-état Synapse vide (valide=true).
// En mode Vuetify, la validité transite par le VForm (validator Vuetify
// enregistré auprès de lui) : le champ custom ne doit pas s'enregistrer.
const VuetifyOnlyForm = defineComponent({
	components: { SyForm, SyTextField },
	setup() {
		const formValidity = ref<boolean | null>(null)
		const name = ref('')
		const requiredRule = (value: unknown): boolean | string =>
			(typeof value === 'string' && value.trim() !== '') || 'Le nom est obligatoire'

		return { formValidity, name, requiredRule }
	},
	template: `
		<SyForm v-model="formValidity">
			<SyTextField
				v-model="name"
				label="Nom"
				use-vuetify-validation
				:rules="[requiredRule]"
			/>
			<span data-testid="form-validity">{{ String(formValidity) }}</span>
		</SyForm>
	`,
})

const LegacyField = defineComponent({
	name: 'LegacyField',
	setup() {
		useValidatable(() => true)
		return () => h('div')
	},
})

const MixedPristineForm = defineComponent({
	components: { LegacyField, SyForm, SyTextField },
	setup() {
		const formValidity = ref<boolean | null>(null)
		const name = ref('')
		const requiredRule = (value: unknown): boolean | string =>
			(typeof value === 'string' && value.trim() !== '') || 'Le nom est obligatoire'

		return { formValidity, name, requiredRule }
	},
	template: `
		<SyForm v-model="formValidity">
			<LegacyField />
			<SyTextField
				v-model="name"
				label="Nom"
				use-vuetify-validation
				:rules="[requiredRule]"
			/>
			<span data-testid="form-validity">{{ String(formValidity) }}</span>
		</SyForm>
	`,
})

describe('SyForm — champs en mode Vuetify uniquement', () => {
	it('reste null au chargement quand le champ requis est pristine', async () => {
		const wrapper = mount(VuetifyOnlyForm)
		await flushPromises()
		expect(wrapper.get('[data-testid="form-validity"]').text()).toBe('null')
	})

	it('reste null quand un champ Vuetify est pristine avec un composant legacy enregistré', async () => {
		const wrapper = mount(MixedPristineForm)
		await flushPromises()
		expect(wrapper.get('[data-testid="form-validity"]').text()).toBe('null')
	})

	it('passe à false après une validation explicite sur champ vide', async () => {
		const wrapper = mount(VuetifyOnlyForm)
		const form = wrapper.findComponent(SyForm)
		await form.vm.validate()
		await flushPromises()
		expect(wrapper.get('[data-testid="form-validity"]').text()).toBe('false')
	})

	it('passe à true quand le champ devient valide puis est soumis', async () => {
		const wrapper = mount(VuetifyOnlyForm)
		await wrapper.find('input').setValue('Jean Dupont')
		const form = wrapper.findComponent(SyForm)
		await form.vm.validate()
		await flushPromises()
		expect(wrapper.get('[data-testid="form-validity"]').text()).toBe('true')
	})
})
