import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import UserMenuDetails from '../UserMenuDetails.vue'

describe('UserMenuDetails', () => {
	it('render correctly', async () => {
		const wrapper = mount(UserMenuDetails, {
			props: {
				uniqueId: 'user-information-summary-id',
				UserMenuDetailsInfos: {
					userName: 'nom utilisateur',
					profil: 'profil',
					denomination: 'dénomination',
					rpps: 'Numéro RPPS',
					adeli: 'Numéro Adeli',
					am: 'Numéro AM',
					finess: 'Numéro Finess',
					email: 'email',
					adresse: {
						numero: 'numéro',
						complement: 'complément',
						type: 'type',
						nom: 'nom',
						codePostal: 'code postal',
						commune: 'commune',
					},
				},
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
