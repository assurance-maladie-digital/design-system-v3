import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import UserMenu from '../UserMenu.vue'

describe('UserMenu', () => {
	it('render correctly', async () => {
		const wrapper = mount(UserMenu, {
			props: {
				lastConnexion: '24/04/2025',
				uniqueId: 'user-information-summary-id',
				UserMenuInfos: {
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
