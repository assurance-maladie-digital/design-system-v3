import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ComplexDatePicker from '../ComplexDatePicker.vue'
import { locales } from '../../locales'

/**
 * Tests de régression : soumission avec une saisie incomplète/effacée.
 *
 * Bug constaté (story `combinedmode-validation--with-form-submission`) :
 * après avoir saisi une date valide puis effacé une partie du champ,
 * `validateOnSubmit()` renvoyait `true` : la date incomplète était considérée
 * valide par `validateSingleTextInput` (comportement prévu pour la frappe en
 * cours) et `selectedDates` conservait la dernière date valide → le formulaire
 * était soumis avec la valeur périmée.
 */
describe('Régression : submit avec saisie incomplète ou effacée', () => {
	it('refuse le submit quand la saisie a été partiellement effacée après une date valide', async () => {
		const wrapper = mount(ComplexDatePicker, {
			props: {
				modelValue: '',
				label: 'Date',
				format: 'DD/MM/YYYY',
				required: true,
			},
			attachTo: document.body,
		})

		const input = wrapper.find('input')

		// 1. Saisie d'une date complète → modèle mis à jour
		await input.setValue('22/12/2555')
		await input.trigger('blur')
		await flushPromises()

		const emitted = wrapper.emitted('update:modelValue')
		expect(emitted?.[emitted.length - 1]).toEqual(['22/12/2555'])

		// 2. L'utilisateur efface un chiffre → saisie incomplète, modèle invalidé
		await input.setValue('22/12/255_')
		await flushPromises()

		// 3. Le submit doit échouer : la saisie affichée n'est pas une date complète
		const result = await wrapper.vm.validateOnSubmit()
		await flushPromises()

		expect(result).toBe(false)
		// L'erreur de format est remontée par le pont de validation du champ texte
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- accès à l'API exposée du composant enfant
		const textInput = wrapper.findComponent({ name: 'DateTextInput' }).vm as any
		expect(textInput.errors).toContain(locales.invalidDateFormatWithFormat('DD/MM/YYYY'))

		wrapper.unmount()
	})

	it('refuse le submit quand le champ a été entièrement vidé après une date valide', async () => {
		const wrapper = mount(ComplexDatePicker, {
			props: {
				modelValue: '',
				label: 'Date',
				format: 'DD/MM/YYYY',
				required: true,
			},
			attachTo: document.body,
		})

		const input = wrapper.find('input')

		await input.setValue('22/12/2555')
		await input.trigger('blur')
		await flushPromises()

		// Le modèle a bien été renseigné
		expect(wrapper.emitted('update:modelValue')).toBeTruthy()

		// Effacement complet du champ
		await input.setValue('')
		await input.trigger('blur')
		await flushPromises()

		// Le submit ne doit pas repasser en succès
		const result = await wrapper.vm.validateOnSubmit()

		expect(result).toBe(false)

		wrapper.unmount()
	})

	it('n\'altère pas la validation pendant la frappe (saisie incomplète = pas d\'erreur immédiate)', async () => {
		const wrapper = mount(ComplexDatePicker, {
			props: {
				modelValue: '',
				label: 'Date',
				format: 'DD/MM/YYYY',
				required: true,
			},
			attachTo: document.body,
		})

		const input = wrapper.find('input')

		// Saisie incomplète en cours de frappe : pas d'erreur affichée (comportement voulu)
		await input.setValue('22/12/255_')
		await flushPromises()

		const errors = wrapper.findAll('.v-messages__message--error')
		expect(errors.length).toBe(0)

		wrapper.unmount()
	})
})

/**
 * Une date incomplète saisie directement (sans date valide retenue auparavant)
 * affichait « La date est requise. » au submit : l'erreur « requise » des dates
 * retenues passait devant l'erreur de format du champ texte (maxErrors à 1).
 */
describe('Régression : message affiché au submit d\'une date incomplète', () => {
	const mountRequired = (props: Record<string, unknown> = {}) => mount(ComplexDatePicker, {
		props: {
			modelValue: '',
			label: 'Date',
			format: 'DD/MM/YYYY',
			required: true,
			...props,
		},
		attachTo: document.body,
	})

	const displayedMessages = (wrapper: ReturnType<typeof mount>) =>
		wrapper.findAll('.v-messages__message').map(message => message.text())

	it('affiche l\'erreur de format, et non « requise », pour une date incomplète saisie directement', async () => {
		const wrapper = mountRequired()

		await wrapper.find('input').setValue('12/10/20')
		await flushPromises()

		expect(await wrapper.vm.validateOnSubmit()).toBe(false)
		await flushPromises()

		expect(displayedMessages(wrapper)).toEqual([locales.invalidDateFormatWithFormat('DD/MM/YYYY')])

		wrapper.unmount()
	})

	it('remplace l\'erreur « requise » d\'un submit précédent par l\'erreur de format', async () => {
		const wrapper = mountRequired()

		expect(await wrapper.vm.validateOnSubmit()).toBe(false)
		await flushPromises()
		expect(displayedMessages(wrapper)).toEqual([locales.required])

		await wrapper.find('input').setValue('12/10/20')
		await flushPromises()

		expect(await wrapper.vm.validateOnSubmit()).toBe(false)
		await flushPromises()

		expect(displayedMessages(wrapper)).toEqual([locales.invalidDateFormatWithFormat('DD/MM/YYYY')])

		wrapper.unmount()
	})

	it('conserve l\'erreur injectée par le parent', async () => {
		const wrapper = mountRequired({ errorMessages: ['Erreur serveur'] })

		await wrapper.find('input').setValue('12/10/20')
		await flushPromises()

		expect(await wrapper.vm.validateOnSubmit()).toBe(false)
		await flushPromises()

		expect(displayedMessages(wrapper)).toContain('Erreur serveur')
		expect(displayedMessages(wrapper)).not.toContain(locales.required)

		wrapper.unmount()
	})
})
